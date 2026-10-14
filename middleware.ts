/**
 * Next.js middleware — server-side admin route protection.
 * Runs before any admin page is rendered, so unauthenticated users
 * never receive HTML from protected routes.
 */

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "wt_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and all auth API routes through
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/auth")
  ) {
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || !cookie || cookie !== adminPassword) {
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
