"use client";

import { useState, useEffect, useCallback } from "react";

interface StaffMember {
  id: string;
  email: string;
  role: string;
  status: "pending" | "active" | "disabled";
  invitedAt: string;
  lastSignIn: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  owner:     "Owner",
  organizer: "Organizer",
};

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  pending:  { bg: "#fef3c7", text: "#92400e", label: "Pending Invite" },
  active:   { bg: "#dcfce7", text: "#166534", label: "Active" },
  disabled: { bg: "#fee2e2", text: "#991b1b", label: "Disabled" },
};

export default function StaffPage() {
  const [staff, setStaff]               = useState<StaffMember[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  // Invite form
  const [inviteEmail, setInviteEmail]   = useState("");
  const [inviting, setInviting]         = useState(false);
  const [inviteMsg, setInviteMsg]       = useState<{ ok: boolean; text: string } | null>(null);

  // Confirm revoke
  const [revoking, setRevoking]         = useState<string | null>(null);
  const [resending, setResending]       = useState<string | null>(null);

  const loadStaff = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/staff/list");
      if (!res.ok) throw new Error("Failed to load staff list.");
      const json = await res.json();
      setStaff(json.staff ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStaff(); }, [loadStaff]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteMsg(null);
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const res = await fetch("/api/admin/staff/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: "organizer" }),
      });
      const json = await res.json();
      if (!res.ok) {
        setInviteMsg({ ok: false, text: json.error ?? "Invite failed." });
      } else {
        setInviteMsg({ ok: true, text: `Invitation sent to ${inviteEmail.trim()}.` });
        setInviteEmail("");
        loadStaff();
      }
    } catch {
      setInviteMsg({ ok: false, text: "Network error. Please try again." });
    } finally {
      setInviting(false);
    }
  }

  async function handleResend(userId: string) {
    setResending(userId);
    try {
      const res = await fetch("/api/admin/staff/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Failed to resend invitation.");
      } else {
        await loadStaff();
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setResending(null);
    }
  }

  async function handleRevoke(userId: string, email: string) {
    if (!window.confirm(`Permanently remove access for ${email}? This cannot be undone.`)) return;
    setRevoking(userId);
    try {
      const res = await fetch("/api/admin/staff/revoke", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Failed to revoke access.");
      } else {
        await loadStaff();
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setRevoking(null);
    }
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 pb-12" style={{ maxWidth: "760px" }}>
      {/* Header */}
      <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
        Admin Portal
      </p>
      <h1 style={{ margin: "0 0 4px", fontSize: "24px", fontFamily: "var(--font-rye, serif)", color: "#1a120a" }}>
        Staff Access
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: "13px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>
        Invite organizers to the portal. They will receive an email with a secure activation link.
      </p>

      {/* ── Invite Form ─────────────────────────────────────────── */}
      <div style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "6px", padding: "24px 28px", marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Invite a New Organizer
        </h2>
        <form onSubmit={handleInvite} style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 280px" }}>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="organizer@email.com"
              required
              disabled={inviting}
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: "13px",
                fontFamily: "var(--font-garamond, serif)",
                border: "1px solid #d1c9b8",
                background: "#fff",
                color: "#1a120a",
                borderRadius: "3px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={inviting || !inviteEmail.trim()}
            style={{
              padding: "10px 20px",
              fontSize: "11px",
              fontFamily: "var(--font-special-elite, monospace)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              background: inviting ? "rgba(196,144,42,0.5)" : "#C4902A",
              color: "#fff",
              border: "none",
              borderRadius: "3px",
              cursor: inviting ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {inviting ? "Sending…" : "Send Invitation"}
          </button>
        </form>

        {inviteMsg && (
          <p style={{
            margin: "12px 0 0",
            fontSize: "13px",
            fontFamily: "var(--font-garamond, serif)",
            color: inviteMsg.ok ? "#166534" : "#dc2626",
          }}>
            {inviteMsg.ok ? "✓ " : "✕ "}{inviteMsg.text}
          </p>
        )}

        <p style={{ margin: "14px 0 0", fontSize: "12px", color: "#aaa", fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}>
          The organizer will receive an email from West TN Tattoo &amp; Art Festival with a secure link to create their password. The link expires in 24 hours.
        </p>
      </div>

      {/* ── Active / Pending Staff ──────────────────────────────── */}
      <div style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "6px", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #e0d8c8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Current Accounts
          </h2>
          <button
            onClick={loadStaff}
            style={{ background: "none", border: "1px solid #d1c9b8", color: "#888", padding: "6px 12px", fontSize: "11px", fontFamily: "var(--font-special-elite, monospace)", cursor: "pointer", borderRadius: "3px" }}
          >
            ↺ Refresh
          </button>
        </div>

        {/* Owner row — always shown */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 24px", borderBottom: "1px solid #f0ebe0" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1a120a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "14px", color: "#C4902A", fontFamily: "var(--font-rye, serif)" }}>A</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 2px", fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a" }}>
              arenasmanagementco@gmail.com
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: "#aaa", fontFamily: "var(--font-garamond, serif)" }}>
              Owner · Full access · Cannot be modified
            </p>
          </div>
          <span style={{ fontSize: "10px", padding: "3px 10px", borderRadius: "2px", background: "#1a120a", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", flexShrink: 0 }}>
            OWNER
          </span>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "20px 24px" }}>
            <p style={{ margin: 0, color: "#dc2626", fontFamily: "var(--font-garamond, serif)", fontSize: "13px" }}>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ padding: "20px 24px" }}>
            <p style={{ margin: 0, color: "#aaa", fontFamily: "var(--font-garamond, serif)", fontSize: "13px" }}>Loading…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && staff.length === 0 && (
          <div style={{ padding: "28px 24px" }}>
            <p style={{ margin: 0, color: "#aaa", fontFamily: "var(--font-garamond, serif)", fontSize: "13px", fontStyle: "italic" }}>
              No organizer accounts yet. Send an invitation above to get started.
            </p>
          </div>
        )}

        {/* Staff rows */}
        {!loading && staff.map((member, i) => {
          const statusStyle = STATUS_STYLE[member.status] ?? STATUS_STYLE.pending;
          const isPending = member.status === "pending";
          const isWorking = revoking === member.id || resending === member.id;

          return (
            <div
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px 24px",
                borderBottom: i < staff.length - 1 ? "1px solid #f0ebe0" : "none",
                opacity: isWorking ? 0.6 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {/* Avatar */}
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#C4902A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "14px", color: "#fff", fontFamily: "var(--font-rye, serif)" }}>
                  {(member.email?.[0] ?? "?").toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 2px", fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {member.email}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#aaa", fontFamily: "var(--font-garamond, serif)" }}>
                  {ROLE_LABELS[member.role] ?? member.role} · Invited {new Date(member.invitedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {member.lastSignIn && ` · Last login ${new Date(member.lastSignIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                </p>
              </div>

              {/* Status badge */}
              <span style={{
                fontSize: "10px",
                padding: "3px 10px",
                borderRadius: "2px",
                background: statusStyle.bg,
                color: statusStyle.text,
                fontFamily: "var(--font-special-elite, monospace)",
                letterSpacing: "0.08em",
                flexShrink: 0,
              }}>
                {statusStyle.label}
              </span>

              {/* Actions */}
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                {isPending && (
                  <button
                    onClick={() => handleResend(member.id)}
                    disabled={isWorking}
                    title="Resend invitation email"
                    style={{
                      padding: "6px 10px",
                      fontSize: "10px",
                      fontFamily: "var(--font-special-elite, monospace)",
                      background: "#faf6ee",
                      border: "1px solid #d1c9b8",
                      color: "#555",
                      cursor: isWorking ? "not-allowed" : "pointer",
                      borderRadius: "3px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {resending === member.id ? "Sending…" : "Resend"}
                  </button>
                )}
                <button
                  onClick={() => handleRevoke(member.id, member.email)}
                  disabled={isWorking}
                  title="Remove this person's access"
                  style={{
                    padding: "6px 10px",
                    fontSize: "10px",
                    fontFamily: "var(--font-special-elite, monospace)",
                    background: "#fff0f0",
                    border: "1px solid #fca5a5",
                    color: "#dc2626",
                    cursor: isWorking ? "not-allowed" : "pointer",
                    borderRadius: "3px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {revoking === member.id ? "Removing…" : "Revoke"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security note */}
      <div style={{ marginTop: "20px", background: "#fef9ee", border: "1px solid #f0e8c8", borderRadius: "6px", padding: "14px 20px" }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#92400e", fontFamily: "var(--font-garamond, serif)" }}>
          <strong>Security:</strong> Organizers can view applications, approve, deny, and request info. They cannot invite other staff, access Stripe credentials, or modify Owner settings. Role permissions are enforced server-side.
        </p>
      </div>
    </div>
  );
}
