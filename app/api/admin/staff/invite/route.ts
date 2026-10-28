/**
 * /api/admin/staff/invite
 * POST { email, role } → invite a new user via Supabase Auth
 *
 * Only the owner role can invite staff.
 * Sets app_metadata.role = "organizer" so the JWT carries the correct role.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireOwner } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://westtninkrevival.com";

export async function POST(req: NextRequest) {
  const authError = requireOwner(req);
  if (authError) return authError;

  let body: { email?: string; role?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { email, role = "organizer" } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  // Only allow organizer role for now — owner is exclusively via direct DB
  if (role !== "organizer") {
    return NextResponse.json({ error: "Only the 'organizer' role can be invited." }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Check if user already exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (!listError) {
    const existing = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
  }

  // Send Supabase invite — the email template uses {{ .TokenHash }} and points
  // to /admin/setup-password?token_hash={{ .TokenHash }}&type=invite
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${SITE_URL}/admin/setup-password`,
    data: { role }, // goes into user_metadata as initial hint
  });

  if (error) {
    console.error("[staff/invite]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Immediately set role in app_metadata (more secure — user cannot self-modify)
  if (data.user?.id) {
    await supabase.auth.admin.updateUserById(data.user.id, {
      app_metadata: { role },
    });
  }

  return NextResponse.json({ ok: true, userId: data.user?.id });
}
