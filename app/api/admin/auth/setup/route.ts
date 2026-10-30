/**
 * /api/admin/auth/setup
 *
 * POST { token_hash, type, password }
 *   → verifyOtp (server-side, anon client)
 *   → admin.updateUserById (service client — no user session required)
 *   → signInWithPassword → set wt_admin_session cookie
 *   → 200 { ok: true, requiresLogin: false }
 *
 * This route exists because client-side verifyOtp with persistSession:false
 * can return { user, session: null } without an error in certain Supabase
 * configurations, causing the "This link is invalid" error even after a valid
 * OTP verification. Running everything server-side + using the admin API to
 * update the password by user ID eliminates the session-null edge case entirely.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase";
import { setAdminCookie } from "@/lib/admin-auth";
import { getClientIp, bucketKey, rateLimitStatus, rateLimitRecord, tooManyMessage } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { token_hash?: string; type?: string; password?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { token_hash, type, password } = body;

  if (!token_hash || typeof token_hash !== "string") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (!type || !["recovery", "invite", "signup"].includes(type)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }
  if (password.length < 12) {
    return NextResponse.json({ error: "Password must be at least 12 characters." }, { status: 400 });
  }

  // Rate limit failed link verifications per visitor (stops token guessing).
  const ip = getClientIp(req);
  const ipKey = bucketKey("setup_ip", ip);
  const wait = await rateLimitStatus(ipKey);
  if (wait > 0) {
    return NextResponse.json(
      { error: tooManyMessage(wait) },
      { status: 429, headers: { "Retry-After": String(wait) } },
    );
  }

  // Small delay to slow brute-force attempts
  await new Promise((r) => setTimeout(r, 300));

  // ── Step 1: Verify the OTP server-side (anon client) ───────────────────────
  // Using the anon client server-side avoids the client-side session=null bug.
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, detectSessionInUrl: false, autoRefreshToken: false } }
  );

  const { data: verifyData, error: verifyError } = await anonClient.auth.verifyOtp({
    token_hash,
    type: type as "recovery" | "invite" | "signup",
  });

  if (verifyError) {
    await rateLimitRecord("setup_ip", ipKey);
    const msg = verifyError.message?.toLowerCase() ?? "";
    const code = msg.includes("expired") ? "expired" : "invalid";
    return NextResponse.json({ error: code }, { status: 401 });
  }

  // Get user from session OR the bare user field (handles session=null case)
  const user = verifyData?.session?.user ?? verifyData?.user;
  if (!user?.id || !user?.email) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  // ── Step 2: Update password via admin API (no user session required) ────────
  const serviceClient = createServiceClient();
  const { error: updateError } = await serviceClient.auth.admin.updateUserById(user.id, {
    password,
  });

  if (updateError) {
    console.error("[setup] Password update failed:", updateError.message);
    return NextResponse.json(
      { error: "Failed to update password. Please try again." },
      { status: 500 }
    );
  }

  // ── Step 3: Auto sign-in to set the session cookie ──────────────────────────
  const { data: signInData, error: signInError } = await serviceClient.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (signInError || !signInData?.session) {
    // Password was saved but auto-login failed — user will need to log in manually
    console.warn("[setup] Auto sign-in failed after password update:", signInError?.message);
    return NextResponse.json({ ok: true, requiresLogin: true });
  }

  // ── Step 4: Set HttpOnly admin session cookie ────────────────────────────────
  const res = NextResponse.json({ ok: true, requiresLogin: false });
  setAdminCookie(res, signInData.session.access_token);
  return res;
}
