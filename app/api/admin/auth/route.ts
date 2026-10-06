/**
 * /api/admin/auth
 * POST { password } → sets HttpOnly session cookie, returns 200
 * GET               → returns 200 if authenticated, 401 if not
 * DELETE            → clears session cookie (logout)
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, setAdminCookie, clearAdminCookie, isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { password } = body;
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password required." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    // Add a tiny delay to slow brute-force attempts
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  setAdminCookie(res);
  return res;
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}

export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  clearAdminCookie(res);
  return res;
}
