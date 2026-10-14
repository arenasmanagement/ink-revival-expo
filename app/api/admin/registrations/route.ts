/**
 * /api/admin/registrations
 * GET ?status=&type=&search=&page=&limit= — returns registrations with full fields.
 * Requires valid admin session cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "pending_review";
  const type = searchParams.get("type") ?? "";
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50", 10));
  const offset = (page - 1) * limit;

  try {
    const supabase = createServiceClient();
    let query = supabase
      .from("wtsf_registrations")
      .select("order_id,registration_type,status,first_name,last_name,email,phone,business_name,city,state,amount_cents,stripe_payment_intent_id,created_at,metadata,paid_at,review_status,denial_reason,reviewed_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (type) {
      query = query.eq("registration_type", type);
    }
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,business_name.ilike.%${search}%,order_id.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      registrations: data ?? [],
      total: count ?? 0,
      page,
      limit,
    });
  } catch (err) {
    console.error("[admin/registrations]", err);
    return NextResponse.json({ error: "Failed to fetch registrations." }, { status: 500 });
  }
}
