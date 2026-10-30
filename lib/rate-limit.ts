/**
 * Rate limiting for admin auth routes — server-side only.
 *
 * Counters live in Supabase (public.wtsf_auth_rate_limits) so every Vercel
 * function instance shares them. Buckets are keyed by an HMAC of
 * scope + visitor IP (+ normalised email where relevant), so no IP address,
 * email, password or token is ever stored.
 *
 * Lockout policy: every block is temporary (minutes). Email-based buckets
 * always include the visitor's IP, so an attacker elsewhere can only slow
 * themselves down — they cannot lock a real admin out of their own account.
 *
 * Availability: if the counter store is unreachable the check fails OPEN
 * (logs an error, lets the attempt through). Supabase Auth's own limits still
 * apply in that case, and admins are never locked out by an outage.
 */

import { createHmac } from "crypto";
import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export type RateLimitScope = "login" | "login_ip" | "reset" | "reset_ip" | "setup_ip";

interface Rule {
  max: number;           // attempts allowed inside the window
  windowSeconds: number; // counting window
  blockSeconds: number;  // temporary block once max is reached
}

export const RULES: Record<RateLimitScope, Rule> = {
  login:    { max: 5,  windowSeconds: 15 * 60, blockSeconds: 15 * 60 }, // failed logins, per IP + email
  login_ip: { max: 20, windowSeconds: 15 * 60, blockSeconds: 15 * 60 }, // failed logins, per IP (any email)
  reset:    { max: 3,  windowSeconds: 60 * 60, blockSeconds: 60 * 60 }, // reset requests, per IP + email
  reset_ip: { max: 10, windowSeconds: 60 * 60, blockSeconds: 60 * 60 }, // reset requests, per IP
  setup_ip: { max: 10, windowSeconds: 15 * 60, blockSeconds: 15 * 60 }, // failed link/password setups, per IP
};

// ── Visitor IP ───────────────────────────────────────────────────────────────

const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

/** Expand an IPv6 address to 8 hextets, or null if it isn't one. */
function expandIpv6(ip: string): string[] | null {
  if (!/^[0-9a-f:.]+$/i.test(ip) || !ip.includes(":")) return null;
  let addr = ip.toLowerCase();
  // IPv4-mapped tail (::ffff:1.2.3.4) — convert the dotted part to 2 hextets
  const v4 = addr.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (v4) {
    const p = v4[1].split(".").map(Number);
    if (p.some((n) => n > 255)) return null;
    addr = addr.slice(0, -v4[1].length) +
      ((p[0] << 8) | p[1]).toString(16) + ":" + ((p[2] << 8) | p[3]).toString(16);
  }
  const halves = addr.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const fill = 8 - head.length - tail.length;
  if (halves.length === 1 ? head.length !== 8 : fill < 1) return null;
  const parts = [...head, ...Array(halves.length === 2 ? fill : 0).fill("0"), ...tail];
  if (parts.length !== 8 || parts.some((h) => !/^[0-9a-f]{1,4}$/.test(h))) return null;
  return parts.map((h) => h.padStart(4, "0"));
}

/**
 * Normalise a raw IP into the unit we rate-limit on:
 *  - IPv4: the full address
 *  - IPv6: its /64 network (one household/device can rotate the lower 64 bits freely)
 * Anything unparseable collapses to "unknown" (one shared, strict bucket).
 */
export function normaliseIp(raw: string | null | undefined): string {
  const ip = (raw ?? "").split(",")[0].trim();
  const m = ip.match(IPV4);
  if (m) return m.slice(1).every((o) => Number(o) <= 255) ? `v4:${m.slice(1).map(Number).join(".")}` : "unknown";
  const v6 = expandIpv6(ip.replace(/^\[|\]$/g, "").split("%")[0]);
  if (v6) {
    // IPv4-mapped IPv6 → treat as the IPv4 address
    if (v6.slice(0, 5).every((h) => h === "0000") && v6[5] === "ffff") {
      const a = parseInt(v6[6], 16), b = parseInt(v6[7], 16);
      return `v4:${a >> 8}.${a & 255}.${b >> 8}.${b & 255}`;
    }
    return `v6:${v6.slice(0, 4).join(":")}::/64`;
  }
  return "unknown";
}

/**
 * The visitor's IP as reported by Vercel's edge. Vercel overwrites these
 * headers on every request (client-supplied values are discarded), so they
 * cannot be spoofed on Vercel. x-vercel-forwarded-for is preferred because it
 * cannot be altered by any proxy in front of Vercel.
 */
export function getClientIp(req: NextRequest): string {
  return normaliseIp(
    req.headers.get("x-vercel-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for"),
  );
}

// ── Bucket keys ──────────────────────────────────────────────────────────────

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Opaque, non-reversible bucket key: "<scope>:<hmac-sha256 hex>". */
export function bucketKey(scope: RateLimitScope, ip: string, email?: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  const material = ["wtsf-auth-rate-limit-v1", scope, ip, email ? normaliseEmail(email) : ""].join("\n");
  return `${scope}:${createHmac("sha256", secret).update(material).digest("hex")}`;
}

// ── Store operations (fail open) ─────────────────────────────────────────────

/** Seconds the bucket must wait (0 = allowed). */
export async function rateLimitStatus(key: string): Promise<number> {
  try {
    const { data, error } = await createServiceClient().rpc("wtsf_rate_limit_status", { p_key: key });
    if (error) throw error;
    return typeof data === "number" ? data : 0;
  } catch (err) {
    console.error("[rate-limit] status check failed (allowing):", (err as Error).message);
    return 0;
  }
}

/** Record one attempt; returns seconds now blocked (0 = still allowed). */
export async function rateLimitRecord(scope: RateLimitScope, key: string): Promise<number> {
  const r = RULES[scope];
  try {
    const { data, error } = await createServiceClient().rpc("wtsf_rate_limit_record", {
      p_key: key, p_max: r.max, p_window_seconds: r.windowSeconds, p_block_seconds: r.blockSeconds,
    });
    if (error) throw error;
    return typeof data === "number" ? data : 0;
  } catch (err) {
    console.error("[rate-limit] record failed:", (err as Error).message);
    return 0;
  }
}

export async function rateLimitClear(key: string): Promise<void> {
  try {
    const { error } = await createServiceClient().rpc("wtsf_rate_limit_clear", { p_key: key });
    if (error) throw error;
  } catch (err) {
    console.error("[rate-limit] clear failed:", (err as Error).message);
  }
}

/** Largest wait across several buckets (0 = all allowed). */
export async function maxWait(keys: string[]): Promise<number> {
  const waits = await Promise.all(keys.map(rateLimitStatus));
  return Math.max(0, ...waits);
}

/** Human message for a 429 — identical whatever the email, so it reveals nothing. */
export function tooManyMessage(seconds: number, what = "attempts"): string {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return `Too many ${what}. Please wait about ${minutes} minute${minutes === 1 ? "" : "s"} and try again.`;
}
