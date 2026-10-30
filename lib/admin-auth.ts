/**
 * Admin authentication — server-side only.
 *
 * Strategy: Supabase Auth email+password login.
 * On successful login, the Supabase access_token (JWT) is stored in
 * an HttpOnly cookie named `wt_admin_session`.
 *
 * VERIFICATION: every check asks Supabase Auth (GET /auth/v1/user) whether the
 *   token is genuine and the user still exists. HttpOnly only stops browser JS
 *   from reading the cookie — anyone can still SEND a hand-made cookie, so an
 *   unverified JWT must never be trusted. The role comes from the verified
 *   user's app_metadata, never from the cookie payload.
 *
 * SECURITY: Never expose this file's logic in client bundles.
 *   Import only in API routes (server) and middleware (edge-compatible).
 */

import { NextRequest, NextResponse } from "next/server";

export const COOKIE_NAME = "wt_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours — adjust Supabase JWT Expiry to match

/**
 * Decode a JWT payload (base64url) and check the `exp` claim.
 * Used ONLY as a cheap expiry pre-check; trust comes from verifyAdminToken().
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // base64url → base64 → decode
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = typeof atob !== "undefined"
      ? atob(b64)
      : Buffer.from(b64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export type AdminRole = "owner" | "organizer";

export interface AdminSession {
  userId: string;
  email: string | null;
  role: AdminRole;
}

/**
 * Verify an access token with Supabase Auth and return the admin session,
 * or null if the token is missing, expired, forged, revoked, or the user has
 * no admin role. Server-side only.
 */
export async function verifyAdminToken(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;

  // Cheap pre-check: reject malformed / expired tokens without a network call.
  const payload = decodeJwtPayload(token);
  const exp = typeof payload?.exp === "number" ? payload.exp : 0;
  if (exp <= Math.floor(Date.now() / 1000)) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null; // fail closed

  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const user = (await res.json()) as {
      id?: string;
      email?: string;
      app_metadata?: { role?: unknown };
    };
    const role = user.app_metadata?.role;
    if (!user.id || (role !== "owner" && role !== "organizer")) return null;
    return { userId: user.id, email: user.email ?? null, role };
  } catch {
    return null; // fail closed on network errors
  }
}

/** Verified admin session for this request, or null. */
export async function getAdminSession(req: NextRequest): Promise<AdminSession | null> {
  return verifyAdminToken(req.cookies.get(COOKIE_NAME)?.value);
}

/** Returns true if the request carries a genuine admin session. */
export async function isAdminAuthenticated(req: NextRequest): Promise<boolean> {
  return (await getAdminSession(req)) !== null;
}

/** Check auth and return 401 response if not authenticated. */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Store the Supabase access_token in an HttpOnly session cookie. */
export function setAdminCookie(res: NextResponse, accessToken: string): void {
  res.cookies.set(COOKIE_NAME, accessToken, {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === "production",
    sameSite:  "strict",
    maxAge:    COOKIE_MAX_AGE,
    path:      "/",
  });
}

/** Clear the admin session cookie (logout). */
export function clearAdminCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   0,
    path:     "/",
  });
}

/** Verified admin role for this request ("owner" | "organizer"), or null. */
export async function getAdminRole(req: NextRequest): Promise<AdminRole | null> {
  return (await getAdminSession(req))?.role ?? null;
}

/** Returns 401/403 unless the caller is a verified owner. */
export async function requireOwner(req: NextRequest): Promise<NextResponse | null> {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "owner") {
    return NextResponse.json({ error: "Forbidden — owner role required." }, { status: 403 });
  }
  return null;
}
