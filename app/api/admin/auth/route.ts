/**
 * /api/admin/auth
 *
 * POST { email, password } → Supabase signInWithPassword → sets HttpOnly JWT cookie → 200
 * GET                      → 200 if cookie is a non-expired JWT, 401 if not
 * DELETE                   → clears session cookie (logout)
 *
 * Password reset is handled by /api/admin/auth/reset (separate route).
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdminAuthenticated, setAdminCookie, clearAdminCookie } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { email, password } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  // A tiny delay to slow brute-force attempts
  await new Promise((r) => setTimeout(r, 300));

  const supabase = createServiceClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  setAdminCookie(res, data.session.access_token);
  return res;
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}

export async function DELETE(req: NextRequest) {
  // Best-effort Supabase session invalidation (ignore errors)
  try {
    const supabase = createServiceClient();
    const token = req.cookies.get("wt_admin_session")?.value;
    if (token) {
      // Sign out using the access token — invalidates the refresh token server-side
      await supabase.auth.admin.signOut(token);
    }
  } catch { /* ignore */ }

  const res = NextResponse.json({ ok: true });
  clearAdminCookie(res);
  return res;
}
