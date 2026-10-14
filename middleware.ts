/**
 * Next.js middleware — server-side admin route protection.
 * Runs before any admin page is rendered so unauthenticated users
 * never receive HTML from protected routes.
 *
 * Auth strategy: Supabase access_token stored in HttpOnly cookie.
 * Middleware decodes the JWT payload (base64) and checks the `exp` claim.
 * No signature verification is needed here — see lib/admin-auth.ts for rationale.
 */

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "wt_admin_session";

/** Decode JWT payload and verify the token has not expired. */
function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(b64)) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through login page, password-reset pages, and auth API routes
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname.startsWith("/api/admin/auth")
  ) {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token || !isTokenValid(token)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
