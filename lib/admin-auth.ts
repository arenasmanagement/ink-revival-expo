/**
 * Admin authentication — server-side only.
 *
 * Strategy: ADMIN_PASSWORD env var (never public) + HttpOnly cookie.
 * Cookie name: wt_admin_session  (value = the password itself, constant token)
 * This is a simple shared-secret approach appropriate for a single-admin
 * festival tool.  Replace with NextAuth/Supabase Auth for multi-user needs.
 *
 * SECURITY: ADMIN_PASSWORD must be a server-side (non-NEXT_PUBLIC_) env var.
 * It is never embedded in client JS and never printed in logs or responses.
 */

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "wt_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD env var is not set.");
  return pw;
}

/** Returns true if the request carries a valid admin session cookie. */
export function isAdminAuthenticated(req: NextRequest): boolean {
  try {
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    if (!cookie) return false;
    return cookie === getAdminPassword();
  } catch {
    return false;
  }
}

/** Check auth and return 401 response if not authenticated. */
export function requireAdmin(
  req: NextRequest
): NextResponse | null {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Set the admin session cookie on a response. */
export function setAdminCookie(res: NextResponse): void {
  const pw = getAdminPassword();
  res.cookies.set(COOKIE_NAME, pw, {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === "production",
    sameSite:  "strict",
    maxAge:    COOKIE_MAX_AGE,
    path:      "/",
  });
}

/** Clear the admin session cookie. */
export function clearAdminCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   0,
    path:     "/",
  });
}

/** Verify a submitted password against ADMIN_PASSWORD. */
export function verifyAdminPassword(submitted: string): boolean {
  try {
    const pw = getAdminPassword();
    // Constant-time-ish compare (simple; JS doesn't have crypto.timingSafeEqual for strings)
    if (submitted.length !== pw.length) return false;
    let diff = 0;
    for (let i = 0; i < pw.length; i++) {
      diff |= submitted.charCodeAt(i) ^ pw.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}
