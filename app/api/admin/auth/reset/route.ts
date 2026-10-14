/**
 * /api/admin/auth/reset
 * POST { email } → sends Supabase password reset email
 *
 * Always returns 200 to prevent email enumeration.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { email } = body;

  // Always delay and return success to prevent enumeration
  await new Promise((r) => setTimeout(r, 600));

  if (email && typeof email === "string") {
    try {
      const supabase = createServiceClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://westtninkrevival.com";
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/admin/login/new-password`,
      });
    } catch { /* intentionally silent */ }
  }

  return NextResponse.json({ ok: true });
}
