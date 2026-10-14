/**
 * /api/admin/registrations/[orderId]
 * GET — full registration detail including notes and activity
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { orderId } = await params;
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();

    const [regResult, notesResult, activityResult] = await Promise.all([
      supabase
        .from("wtsf_registrations")
        .select("*")
        .eq("order_id", orderId)
        .single(),
      supabase
        .from("wtsf_admin_notes")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false }),
      supabase
        .from("wtsf_admin_activity")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false }),
    ]);

    if (regResult.error) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    return NextResponse.json({
      registration: regResult.data,
      notes: notesResult.data ?? [],
      activity: activityResult.data ?? [],
    });
  } catch (err) {
    console.error("[admin/registrations/detail]", err);
    return NextResponse.json({ error: "Failed to load." }, { status: 500 });
  }
}
