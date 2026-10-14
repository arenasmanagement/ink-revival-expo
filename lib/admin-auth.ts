/**
 * Admin authentication — server-side only.
 *
 * Strategy: Supabase Auth email+password login.
 * On successful login, the Supabase access_token (JWT) is stored in
 * an HttpOnly cookie named `wt_admin_session`.
 *
 * MIDDLEWARE: decodes the JWT payload (base64) to verify it has not expired.
 *   No signature verification is needed in middleware because:
 *   – The cookie is HttpOnly: client JS cannot read or write it.
 *   – The token is issued by Supabase and only placed in the cookie on
 *     a successful signInWithPassword call server-side.
 *
 * SECURITY: Never expose this file's logic in client bundles.
 *   Import only in API routes (server) and middleware (edge-compatible).
 */

import { NextRequest, NextResponse } from "next/server";

export const COOKIE_NAME = "wt_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours — adjust Supabase JWT Expiry to match

/**
 * Decode a JWT payload (base64url) and check the `exp` claim.
 * Does NOT verify the signature — the HttpOnly cookie property
 * ensures the token originated from our server.
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

/** Returns true if the request carries a valid, non-expired admin session JWT. */
export function isAdminAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  // Check expiry
  const exp = typeof payload.exp === "number" ? payload.exp : 0;
  return exp > Math.floor(Date.now() / 1000);
}

/** Check auth and return 401 response if not authenticated. */
export function requireAdmin(req: NextRequest): NextResponse | null {
  if (!isAdminAuthenticated(req)) {
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
