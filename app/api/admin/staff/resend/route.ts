/**
 * /api/admin/staff/resend
 * POST { userId } → resend an invitation to a pending user
 *
 * Deletes the existing user and re-invites with the same email + role.
 * This is the cleanest way to issue a fresh invite token in Supabase.
 * Owner-only.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireOwner } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://westtninkrevival.com";

export async function POST(req: NextRequest) {
  const authError = requireOwner(req);
  if (authError) return authError;

  let body: { userId?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { userId } = body;
  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Fetch the user to get email + role
  const { data: { user }, error: getError } = await supabase.auth.admin.getUserById(userId);
  if (getError || !user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (!user.email) {
    return NextResponse.json({ error: "User has no email." }, { status: 400 });
  }

  // Don't resend to a user who has already activated
  if (user.last_sign_in_at) {
    return NextResponse.json(
      { error: "This user has already activated their account." },
      { status: 409 }
    );
  }

  const role =
    ((user.app_metadata as Record<string, unknown>)?.role as string) ?? "organizer";

  // Delete old user
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Re-invite
  const { data, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(user.email, {
    redirectTo: `${SITE_URL}/admin/setup-password`,
    data: { role },
  });

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  // Set app_metadata role
  if (data.user?.id) {
    await supabase.auth.admin.updateUserById(data.user.id, {
      app_metadata: { role },
    });
  }

  return NextResponse.json({ ok: true });
}
