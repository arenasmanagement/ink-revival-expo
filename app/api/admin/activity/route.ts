/**
 * /api/admin/activity
 * GET ?orderId=&limit= — activity log
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const limit = Math.min(200, parseInt(searchParams.get("limit") ?? "50", 10));

  const supabase = createServiceClient();
  let query = supabase
    .from("wtsf_admin_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (orderId) {
    query = query.eq("order_id", orderId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to load activity." }, { status: 500 });
  return NextResponse.json({ activity: data ?? [] });
}
