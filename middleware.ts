/**
 * Next.js middleware — server-side admin route protection.
 * Runs before any admin page is rendered so unauthenticated users
 * never receive HTML from protected routes.
 *
 * Auth strategy: Supabase access_token stored in HttpOnly cookie.
 * Middleware decodes the JWT payload (base64) and checks the `exp` claim.
 * No signature verification is needed here — see lib/admin-auth.ts for rationale.
 *
 * Also forwards `x-pathname` as a request header so the root Server Component
 * layout can conditionally hide the public Navbar/Footer for admin routes.
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

  // Forward pathname so the root Server Component layout can check it.
  // This is the official Next.js pattern for passing data from middleware
  // to async Server Components via request headers.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Pass through auth pages and auth API routes (no cookie check)
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname === "/admin/setup-password" ||
    pathname === "/admin/forgot-password" ||
    pathname.startsWith("/api/admin/auth")
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } });
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

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*"],
};
