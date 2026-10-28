/**
 * /api/admin/staff/revoke
 * DELETE { userId } → permanently remove a staff account
 *
 * Cannot revoke the owner account.
 * Owner-only.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireOwner } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  const authError = requireOwner(req);
  if (authError) return authError;

  let body: { userId?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { userId } = body;
  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Fetch user to guard against revoking the owner
  const { data: { user }, error: getError } = await supabase.auth.admin.getUserById(userId);
  if (getError || !user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (user.email === "arenasmanagementco@gmail.com") {
    return NextResponse.json({ error: "Cannot revoke the owner account." }, { status: 403 });
  }

  const role = (user.app_metadata as Record<string, unknown>)?.role;
  if (role === "owner") {
    return NextResponse.json({ error: "Cannot revoke an owner account." }, { status: 403 });
  }

  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
