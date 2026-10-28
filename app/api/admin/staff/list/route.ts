/**
 * /api/admin/staff/list
 * GET → list all staff accounts (excluding the owner)
 *
 * Returns each user's id, email, role, status, invited_at, last_sign_in_at.
 * Owner-only route.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireOwner } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authError = requireOwner(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const { data: { users }, error } = await supabase.auth.admin.listUsers({ perPage: 200 });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const staff = users
    .filter((u) => u.email !== "arenasmanagementco@gmail.com")
    .map((u) => {
      const appRole = (u.app_metadata as Record<string, unknown>)?.role as string | undefined;
      const userRole = (u.user_metadata as Record<string, unknown>)?.role as string | undefined;
      const role = appRole ?? userRole ?? "organizer";

      // Pending = invited but never signed in
      const status: "pending" | "active" | "disabled" =
        u.banned_until ? "disabled"
        : !u.last_sign_in_at ? "pending"
        : "active";

      return {
        id:             u.id,
        email:          u.email,
        role,
        status,
        invitedAt:      u.invited_at ?? u.created_at,
        lastSignIn:     u.last_sign_in_at,
        confirmedAt:    u.confirmed_at,
      };
    });

  return NextResponse.json({ staff });
}
