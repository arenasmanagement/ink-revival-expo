/**
 * /api/admin/registrations
 * GET ?status=pending_review (default) — returns registrations for admin review.
 * Requires valid admin session cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listRegistrations } from "@/lib/registration";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "pending_review";
  const showAll = status === "all";

  try {
    const registrations = await listRegistrations(showAll ? undefined : status);
    return NextResponse.json({ registrations });
  } catch (err) {
    console.error("[admin/registrations]", err);
    return NextResponse.json({ error: "Failed to fetch registrations." }, { status: 500 });
  }
}
