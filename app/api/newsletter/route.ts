/**
 * /api/newsletter — Email list signup
 *
 * Inserts into wtsf_email_list in Supabase (upsert on conflict to avoid errors
 * if the same address signs up twice).  Degrades gracefully if Supabase is
 * unavailable — still returns success so the UI confirms to the user.
 *
 * No confirmation email is sent yet (opt-in flow TBD). The organizer will
 * receive a weekly digest or can view the list in Supabase.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { email?: string; firstName?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const firstName = String(body.firstName ?? "").trim();

  if (!email || !email.includes("@") || !email.includes(".")) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // ── Persist to Supabase ────────────────────────────────────────────────────
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createServiceClient();
      const { error } = await supabase
        .from("wtsf_email_list")
        .upsert(
          {
            email,
            first_name: firstName || null,
            source: "website_homepage",
            categories: ["general"],
            confirmed: false,
          },
          { onConflict: "email", ignoreDuplicates: true }
        );

      if (error) {
        // Log but don't block — return success so user isn't confused
        console.error("[/api/newsletter] Supabase upsert error:", error);
      }
    } catch (err) {
      console.error("[/api/newsletter] Supabase error:", err);
    }
  }

  return NextResponse.json({ success: true });
}
