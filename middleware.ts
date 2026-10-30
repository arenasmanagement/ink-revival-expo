/**
 * Next.js middleware — server-side admin route protection.
 * Runs before any admin page is rendered so unauthenticated users
 * never receive HTML from protected routes.
 *
 * Auth strategy: Supabase access_token stored in HttpOnly cookie.
 * Middleware verifies the token with Supabase Auth (see lib/admin-auth.ts) —
 * a hand-made or expired cookie is redirected to the login page.
 *
 * Also forwards `x-pathname` as a request header so the root Server Component
 * layout can conditionally hide the public Navbar/Footer for admin routes.
 */

import { NextRequest, NextResponse } from "next/server";

import { COOKIE_NAME, verifyAdminToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
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

    if (!(await verifyAdminToken(token))) {
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
