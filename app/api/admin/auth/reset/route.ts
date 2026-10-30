/**
 * /api/admin/auth/reset
 * POST { email } → sends Supabase password reset email
 *
 * Always returns 200 to prevent email enumeration.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getClientIp, bucketKey, maxWait, rateLimitRecord } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { email } = body;

  // Always delay and return success to prevent enumeration
  await new Promise((r) => setTimeout(r, 600));

  if (email && typeof email === "string") {
    // Rate limit reset emails per visitor+email and per visitor. When limited
    // we silently skip sending — the response is identical either way, so it
    // reveals neither the limit nor whether the email exists.
    const ip = getClientIp(req);
    const emailKey = bucketKey("reset", ip, email);
    const ipKey = bucketKey("reset_ip", ip);
    if ((await maxWait([emailKey, ipKey])) > 0) {
      return NextResponse.json({ ok: true });
    }
    await Promise.all([rateLimitRecord("reset", emailKey), rateLimitRecord("reset_ip", ipKey)]);
    try {
      const supabase = createServiceClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://westtninkrevival.com";
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/admin/setup-password`,
      });
    } catch { /* intentionally silent */ }
  }

  return NextResponse.json({ ok: true });
}
