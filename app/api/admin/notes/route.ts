/**
 * /api/admin/notes
 * GET  ?orderId= — fetch notes for a registration
 * POST { orderId, noteText } — add a note
 * DELETE { noteId } — remove a note
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("wtsf_admin_notes")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to load notes." }, { status: 500 });
  return NextResponse.json({ notes: data ?? [] });
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  let body: { orderId?: string; noteText?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { orderId, noteText } = body;
  if (!orderId || !noteText?.trim()) {
    return NextResponse.json({ error: "orderId and noteText are required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("wtsf_admin_notes")
    .insert({ order_id: orderId, note_text: noteText.trim(), created_by: "owner" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to save note." }, { status: 500 });
  return NextResponse.json({ note: data });
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  let body: { noteId?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { noteId } = body;
  if (!noteId) return NextResponse.json({ error: "noteId required" }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("wtsf_admin_notes").delete().eq("id", noteId);
  if (error) return NextResponse.json({ error: "Failed to delete note." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
