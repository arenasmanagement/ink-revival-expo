"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Registration {
  order_id: string;
  registration_type: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  business_name?: string;
  city?: string;
  state?: string;
  amount_cents: number;
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  created_at: string;
  updated_at?: string;
  paid_at?: string;
  metadata: Record<string, unknown> | null;
  terms_agreed: boolean;
  terms_agreed_at?: string;
  denial_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  info_request_message?: string;
  info_requested_at?: string;
}

interface Note { id: string; note_text: string; created_by: string; created_at: string; }
interface Activity { id: string; action: string; performed_by: string; prev_status?: string; new_status?: string; detail?: string; created_at: string; }

const TYPE_LABELS: Record<string, string> = {
  artist: "Tattoo Artist",
  vendor: "Vendor",
  food_truck: "Food Truck",
  sponsor: "Sponsor",
  car_show: "Car Show",
  competition: "Competition",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending:                   { bg: "#fef3c7", text: "#92400e", label: "Awaiting Payment" },
  pending_review:            { bg: "#dbeafe", text: "#1e40af", label: "Pending Review" },
  captured:                  { bg: "#dcfce7", text: "#166534", label: "Approved & Paid" },
  confirmed:                 { bg: "#dcfce7", text: "#166534", label: "Confirmed" },
  cancelled:                 { bg: "#fee2e2", text: "#991b1b", label: "Denied" },
  payment_failed:            { bg: "#fee2e2", text: "#991b1b", label: "Payment Failed" },
  approved_pending_payment:  { bg: "#ede9fe", text: "#5b21b6", label: "Approved — Payment Required" },
  info_requested:            { bg: "#fef3c7", text: "#92400e", label: "Info Requested" },
};

function MetaField({ label, value }: { label: string; value?: unknown }) {
  if (value === undefined || value === null || value === "") return null;
  const display = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <div className="adm-field" style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid #f0ebe0" }}>
      <span style={{ width: "160px", flexShrink: 0, fontSize: "12px", color: "#888", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.05em", textTransform: "capitalize" }}>
        {label.replace(/_/g, " ")}
      </span>
      <span style={{ fontSize: "13px", color: "#333", fontFamily: "var(--font-garamond, serif)", wordBreak: "break-all" }}>
        {display}
      </span>
    </div>
  );
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);

  const [reg, setReg] = useState<Registration | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Action state
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [actionError, setActionError] = useState("");
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Notes
  const [newNote, setNewNote] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  async function loadData() {
    try {
      const res = await fetch(`/api/admin/registrations/${orderId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Not found");
      setReg(json.registration);
      setNotes(json.notes ?? []);
      setActivity(json.activity ?? []);
    } catch (e) {
      setError((e as Error).message ?? "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [orderId]);

  async function handleAction(action: string, extra?: Record<string, string>) {
    setActionLoading(true);
    setActionMsg("");
    setActionError("");
    try {
      const res = await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action, ...extra }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Action failed");
      setActionMsg(json.emailSent ? `✅ Done — email sent to applicant.` : `✅ Done.`);
      setShowDenyModal(false);
      setShowInfoModal(false);
      setShowApproveModal(false);
      setDenyReason("");
      setInfoMessage("");
      await loadData();
    } catch (e) {
      setActionError((e as Error).message ?? "Action failed.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNoteLoading(true);
    try {
      const res = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, noteText: newNote }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setNotes((prev) => [json.note, ...prev]);
      setNewNote("");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setNoteLoading(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (!confirm("Delete this note?")) return;
    await fetch("/api/admin/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId }),
    });
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }

  if (loading) return <div style={{ padding: "32px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>Loading…</div>;
  if (error) return <div style={{ padding: "32px", color: "#dc2626" }}>Error: {error}</div>;
  if (!reg) return null;

  const statusStyle = STATUS_COLORS[reg.status] ?? { bg: "#f3f4f6", text: "#6b7280", label: reg.status };
  const canApprove = ["pending", "pending_review", "info_requested"].includes(reg.status);
  const canDeny = ["pending", "pending_review", "info_requested", "approved_pending_payment"].includes(reg.status);
  const canRequestInfo = ["pending", "pending_review"].includes(reg.status);

  const METADATA_LABELS: Record<string, string> = {
    boothSize: "Booth Size",
    vendorCategory: "Vendor Category",
    sponsorPackage: "Sponsor Package",
    tattoingYears: "Years of Experience",
    specialties: "Specialties",
    portfolioUrl: "Portfolio URL",
    instagramHandle: "Instagram",
    vehicleYear: "Vehicle Year",
    vehicleMake: "Vehicle Make",
    vehicleModel: "Vehicle Model",
    vehicleColor: "Vehicle Color",
    vehicleDesc: "Vehicle Description",
    website: "Website",
    notes: "Notes / Special Requests",
    additionalBooth: "Additional Booth",
    pricingKey: "Pricing Key",
    categoryId: "Category ID",
    categories: "Competition Categories",
    messageToOrganizer: "Message to Organizer",
  };

  return (
    <div className="adm-page px-4 py-6 md:px-8 md:py-8 pb-16" style={{ maxWidth: "900px" }}>
      {/* Back link */}
      <Link href="/admin/applications" style={{ fontSize: "12px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", textDecoration: "none", display: "inline-block", marginBottom: "20px" }}>
        ← BACK TO APPLICATIONS
      </Link>

      {/* Header */}
      <div className="adm-header" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "24px" }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            {TYPE_LABELS[reg.registration_type] ?? reg.registration_type} · {reg.order_id}
          </p>
          <h1 className="adm-h1" style={{ margin: 0, fontSize: "26px", fontFamily: "var(--font-rye, serif)", color: "#1a120a" }}>
            {reg.first_name} {reg.last_name}
          </h1>
          {reg.business_name && (
            <p style={{ margin: "4px 0 0", fontSize: "16px", color: "#555", fontFamily: "var(--font-garamond, serif)" }}>{reg.business_name}</p>
          )}
        </div>
        <span style={{
          padding: "6px 14px", borderRadius: "4px", fontSize: "12px",
          fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.08em",
          background: statusStyle.bg, color: statusStyle.text, alignSelf: "flex-start",
        }}>
          {statusStyle.label}
        </span>
      </div>

      {/* Action messages */}
      {actionMsg && (
        <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", color: "#166534", fontSize: "13px", fontFamily: "var(--font-garamond, serif)" }}>
          {actionMsg}
        </div>
      )}
      {actionError && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", color: "#991b1b", fontSize: "13px" }}>
          Error: {actionError}
        </div>
      )}

      {/* Action buttons */}
      {(canApprove || canDeny || canRequestInfo) && (
        <div className="adm-panel" style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "6px", padding: "20px 24px", marginBottom: "24px" }}>
          <p style={{ margin: "0 0 12px", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", color: "#8a7a68", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Review Actions
          </p>
          <div className="adm-review-actions" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {canApprove && (
              <button
                onClick={() => setShowApproveModal(true)}
                disabled={actionLoading}
                style={{ padding: "10px 20px", background: "#16a34a", color: "#fff", border: "none", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "4px", opacity: actionLoading ? 0.6 : 1 }}
              >
                {actionLoading ? "Processing…" : reg.status === "pending_review" ? "✓ Approve & Capture Payment" : "✓ Approve Application"}
              </button>
            )}
            {canRequestInfo && (
              <button
                onClick={() => setShowInfoModal(true)}
                disabled={actionLoading}
                style={{ padding: "10px 20px", background: "#d97706", color: "#fff", border: "none", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "4px" }}
              >
                ? Request Info
              </button>
            )}
            {canDeny && (
              <button
                onClick={() => setShowDenyModal(true)}
                disabled={actionLoading}
                style={{ padding: "10px 20px", background: "#faf6ee", color: "#dc2626", border: "1px solid #dc2626", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "4px" }}
              >
                ✗ Deny Application
              </button>
            )}
          </div>
          {reg.status === "pending" && (
            <p style={{ margin: "12px 0 0", fontSize: "12px", color: "#d97706", fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}>
              ⚠ This applicant has not completed payment. Approving will mark them as "Approved — Payment Required" and notify them by email. No funds will be captured.
            </p>
          )}
        </div>
      )}

      {/* Approve confirmation — approving can capture a card payment, so it always asks first */}
      {showApproveModal && (
        <div className="adm-modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="approve-title" style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "8px", padding: "28px", maxWidth: "480px", width: "100%", boxSizing: "border-box" }}>
            <h2 id="approve-title" style={{ margin: "0 0 16px", fontFamily: "var(--font-rye, serif)", fontSize: "20px", color: "#1a120a" }}>
              {reg.status === "pending_review" ? "Approve & Capture Payment?" : "Approve Application?"}
            </h2>
            <p style={{ fontSize: "13px", color: "#555", fontFamily: "var(--font-garamond, serif)", marginBottom: "16px" }}>
              {reg.status === "pending_review"
                ? <>This will approve <strong>{reg.first_name} {reg.last_name}</strong>, <strong>charge their card {reg.amount_cents ? `$${(reg.amount_cents / 100).toFixed(2)}` : ""}</strong>, and email their confirmation.</>
                : <>This will approve <strong>{reg.first_name} {reg.last_name}</strong> and email them that payment is still required. No funds will be captured.</>}
            </p>
            <div className="adm-modal-actions" style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowApproveModal(false)} disabled={actionLoading} style={{ padding: "9px 18px", background: "none", border: "1px solid #d1c9b8", color: "#1a120a", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", cursor: "pointer", borderRadius: "4px" }}>
                Cancel
              </button>
              <button
                onClick={() => handleAction("approve")}
                disabled={actionLoading}
                style={{ padding: "9px 18px", background: "#16a34a", color: "#fff", border: "none", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: "4px", opacity: actionLoading ? 0.6 : 1 }}
              >
                {actionLoading ? "Processing…" : reg.status === "pending_review" ? "Confirm & Capture" : "Confirm Approval"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deny modal */}
      {showDenyModal && (
        <div className="adm-modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div className="adm-modal" role="dialog" aria-modal="true" style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "8px", padding: "28px", maxWidth: "480px", width: "100%", boxSizing: "border-box" }}>
            <h2 style={{ margin: "0 0 16px", fontFamily: "var(--font-rye, serif)", fontSize: "20px", color: "#1a120a" }}>Deny Application</h2>
            <p style={{ fontSize: "13px", color: "#555", fontFamily: "var(--font-garamond, serif)", marginBottom: "16px" }}>
              This will deny the application and notify <strong>{reg.first_name} {reg.last_name}</strong> by email. Any payment hold will be released.
            </p>
            <label style={{ display: "block", fontSize: "11px", color: "#888", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
              Reason (optional — sent to applicant)
            </label>
            <textarea
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              rows={3}
              placeholder="e.g. We have reached our capacity for this category."
              style={{ width: "100%", padding: "10px 12px", fontSize: "13px", fontFamily: "var(--font-garamond, serif)", border: "1px solid #d1c9b8", borderRadius: "4px", resize: "vertical", boxSizing: "border-box" }}
            />
            <div className="adm-modal-actions" style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => { setShowDenyModal(false); setDenyReason(""); }} style={{ padding: "9px 18px", background: "none", border: "1px solid #d1c9b8", color: "#1a120a", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", cursor: "pointer", borderRadius: "4px" }}>
                Cancel
              </button>
              <button
                onClick={() => handleAction("deny", { reason: denyReason })}
                disabled={actionLoading}
                style={{ padding: "9px 18px", background: "#dc2626", color: "#fff", border: "none", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: "4px" }}
              >
                {actionLoading ? "Processing…" : "Confirm Denial"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request info modal */}
      {showInfoModal && (
        <div className="adm-modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div className="adm-modal" role="dialog" aria-modal="true" style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "8px", padding: "28px", maxWidth: "480px", width: "100%", boxSizing: "border-box" }}>
            <h2 style={{ margin: "0 0 16px", fontFamily: "var(--font-rye, serif)", fontSize: "20px", color: "#1a120a" }}>Request More Information</h2>
            <p style={{ fontSize: "13px", color: "#555", fontFamily: "var(--font-garamond, serif)", marginBottom: "16px" }}>
              This will email <strong>{reg.first_name} {reg.last_name}</strong> asking for more information.
            </p>
            <label style={{ display: "block", fontSize: "11px", color: "#888", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
              Message to applicant *
            </label>
            <textarea
              value={infoMessage}
              onChange={(e) => setInfoMessage(e.target.value)}
              rows={4}
              placeholder="Explain what additional information you need…"
              style={{ width: "100%", padding: "10px 12px", fontSize: "13px", fontFamily: "var(--font-garamond, serif)", border: "1px solid #d1c9b8", borderRadius: "4px", resize: "vertical", boxSizing: "border-box" }}
            />
            <div className="adm-modal-actions" style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => { setShowInfoModal(false); setInfoMessage(""); }} style={{ padding: "9px 18px", background: "none", border: "1px solid #d1c9b8", color: "#1a120a", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", cursor: "pointer", borderRadius: "4px" }}>
                Cancel
              </button>
              <button
                onClick={() => handleAction("request_info", { message: infoMessage })}
                disabled={actionLoading || !infoMessage.trim()}
                style={{ padding: "9px 18px", background: "#d97706", color: "#fff", border: "none", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: "4px", opacity: !infoMessage.trim() ? 0.6 : 1 }}
              >
                {actionLoading ? "Sending…" : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two column layout — stacks on mobile */}
      <div className="adm-two-col grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Applicant info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>
          {/* Contact */}
          <section className="adm-panel" style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "6px", padding: "20px 24px", minWidth: 0 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#888", letterSpacing: "0.15em", textTransform: "uppercase" }}>Contact Information</h2>
            <MetaField label="Email" value={reg.email} />
            <MetaField label="Phone" value={reg.phone} />
            <MetaField label="City" value={reg.city} />
            <MetaField label="State" value={reg.state} />
            <MetaField label="Business" value={reg.business_name} />
            <MetaField label="Terms Agreed" value={reg.terms_agreed} />
          </section>

          {/* Submitted form data */}
          {reg.metadata && Object.keys(reg.metadata).length > 0 && (
            <section className="adm-panel" style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "6px", padding: "20px 24px", minWidth: 0 }}>
              <h2 style={{ margin: "0 0 16px", fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#888", letterSpacing: "0.15em", textTransform: "uppercase" }}>Submitted Information</h2>
              {Object.entries(reg.metadata).map(([k, v]) => {
                if (k === "pricingKey" || k === "categoryId") return null;
                const label = METADATA_LABELS[k] ?? k;
                const val = Array.isArray(v) ? (v as string[]).join(", ") : v;
                return <MetaField key={k} label={label} value={val as unknown} />;
              })}
            </section>
          )}
        </div>

        {/* Right: Payment + admin */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>
          {/* Payment */}
          <section className="adm-panel" style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "6px", padding: "20px 24px", minWidth: 0 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#888", letterSpacing: "0.15em", textTransform: "uppercase" }}>Payment Information</h2>
            <MetaField label="Amount" value={reg.amount_cents ? `$${(reg.amount_cents / 100).toFixed(2)}` : "—"} />
            <MetaField label="Payment Status" value={statusStyle.label} />
            <MetaField label="Paid At" value={reg.paid_at ? new Date(reg.paid_at).toLocaleString("en-US") : undefined} />
            <MetaField label="Submitted" value={new Date(reg.created_at).toLocaleString("en-US")} />
            {reg.stripe_payment_intent_id && (
              <div className="adm-field" style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid #f0ebe0" }}>
                <span style={{ width: "160px", flexShrink: 0, fontSize: "12px", color: "#888", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.05em" }}>Stripe PI</span>
                <a
                  href={`https://dashboard.stripe.com/payments/${reg.stripe_payment_intent_id}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "12px", color: "#2563eb", fontFamily: "var(--font-garamond, serif)", wordBreak: "break-all" }}
                >
                  {reg.stripe_payment_intent_id} ↗
                </a>
              </div>
            )}
            {reg.denial_reason && (
              <div style={{ marginTop: "12px", padding: "10px 12px", background: "#fee2e2", borderRadius: "4px" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#991b1b", fontFamily: "var(--font-garamond, serif)" }}>
                  <strong>Denial reason:</strong> {reg.denial_reason}
                </p>
              </div>
            )}
          </section>

          {/* Private notes */}
          <section className="adm-panel" style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "6px", padding: "20px 24px", minWidth: 0 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#888", letterSpacing: "0.15em", textTransform: "uppercase" }}>Private Notes</h2>
            <p style={{ margin: "0 0 14px", fontSize: "11px", color: "#ccc", fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}>Never visible to applicants.</p>

            <form className="adm-note-form" onSubmit={handleAddNote} style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a private note…"
                aria-label="Add a private note"
                style={{ flex: 1, minWidth: 0, padding: "8px 12px", fontSize: "13px", fontFamily: "var(--font-garamond, serif)", border: "1px solid #d1c9b8", borderRadius: "4px" }}
              />
              <button type="submit" disabled={noteLoading || !newNote.trim()} style={{ padding: "8px 14px", background: "#1a120a", color: "#F5EDD8", border: "none", fontSize: "11px", fontFamily: "var(--font-special-elite, monospace)", cursor: "pointer", borderRadius: "4px", opacity: !newNote.trim() ? 0.5 : 1 }}>
                Add
              </button>
            </form>

            {notes.length === 0 ? (
              <p style={{ color: "#ccc", fontSize: "13px", fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}>No notes yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {notes.map((note) => (
                  <div key={note.id} style={{ padding: "10px 12px", background: "#fef9ee", border: "1px solid #f0e8c8", borderRadius: "4px" }}>
                    <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#333", fontFamily: "var(--font-garamond, serif)" }}>{note.note_text}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ margin: 0, fontSize: "10px", color: "#aaa", fontFamily: "var(--font-special-elite, monospace)" }}>
                        {note.created_by} · {new Date(note.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <button className="adm-note-delete" aria-label="Delete note" onClick={() => handleDeleteNote(note.id)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "12px", padding: "2px" }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Activity log */}
          <section className="adm-panel" style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "6px", padding: "20px 24px", minWidth: 0 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#888", letterSpacing: "0.15em", textTransform: "uppercase" }}>Activity History</h2>
            {activity.length === 0 ? (
              <p style={{ color: "#ccc", fontSize: "13px", fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}>No recorded activity yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* System-generated events */}
                <div className="adm-history-row" style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid #f0ebe0" }}>
                  <span style={{ fontSize: "11px", color: "#aaa", fontFamily: "var(--font-special-elite, monospace)", width: "130px", flexShrink: 0 }}>
                    {new Date(reg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span style={{ fontSize: "12px", color: "#555", fontFamily: "var(--font-garamond, serif)" }}>Application submitted</span>
                </div>
                {activity.map((a) => (
                  <div key={a.id} className="adm-history-row" style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid #f0ebe0" }}>
                    <span style={{ fontSize: "11px", color: "#aaa", fontFamily: "var(--font-special-elite, monospace)", width: "130px", flexShrink: 0 }}>
                      {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#333", fontFamily: "var(--font-garamond, serif)" }}>
                        {a.action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        {a.prev_status && a.new_status && ` (${a.prev_status} → ${a.new_status})`}
                      </p>
                      {a.detail && <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#aaa", fontFamily: "var(--font-garamond, serif)" }}>{a.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
