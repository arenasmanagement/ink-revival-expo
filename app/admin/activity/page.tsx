"use client";

import { useState, useEffect } from "react";

interface ActivityEntry {
  id: string;
  order_id?: string;
  action: string;
  performed_by: string;
  prev_status?: string;
  new_status?: string;
  detail?: string;
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  approved: "#16a34a",
  captured: "#16a34a",
  denied: "#dc2626",
  cancelled: "#dc2626",
  request_info: "#d97706",
  info_requested: "#d97706",
  note_added: "#2563eb",
  note_deleted: "#6b7280",
};

function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ActivityPage() {
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(100);

  async function load(l = limit) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/activity?limit=${l}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setActivity(json.activity ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleLoadMore() {
    const next = limit + 100;
    setLimit(next);
    load(next);
  }

  // Group by date
  const grouped: Record<string, ActivityEntry[]> = {};
  for (const a of activity) {
    const date = new Date(a.created_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(a);
  }

  return (
    <div style={{ padding: "32px 32px 48px", maxWidth: "860px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Admin Portal
          </p>
          <h1 style={{ margin: 0, fontSize: "24px", fontFamily: "var(--font-rye, serif)", color: "#1a120a" }}>
            Activity Log
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>
            Full audit trail of all admin actions — approvals, denials, notes, and info requests.
          </p>
        </div>
        <button
          onClick={() => load()}
          style={{ padding: "9px 16px", fontSize: "11px", fontFamily: "var(--font-special-elite, monospace)", background: "none", border: "1px solid #d1c9b8", color: "#888", cursor: "pointer", borderRadius: "3px" }}
        >
          ↺ Refresh
        </button>
      </div>

      {loading && <p style={{ color: "#888", fontFamily: "var(--font-garamond, serif)", fontSize: "14px" }}>Loading activity…</p>}
      {error && <p style={{ color: "#dc2626", fontFamily: "var(--font-garamond, serif)", fontSize: "14px" }}>Error: {error}</p>}

      {!loading && !error && activity.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid #e5e0d5", borderRadius: "6px", padding: "48px", textAlign: "center" }}>
          <p style={{ color: "#aaa", fontFamily: "var(--font-garamond, serif)", fontSize: "16px", margin: 0 }}>No activity recorded yet.</p>
        </div>
      )}

      {!loading && Object.entries(grouped).map(([date, entries]) => (
        <div key={date} style={{ marginBottom: "28px" }}>
          <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {date}
          </p>
          <div style={{ background: "#fff", border: "1px solid #e5e0d5", borderRadius: "6px", overflow: "hidden" }}>
            {entries.map((a, i) => {
              const actionColor = ACTION_COLORS[a.action] ?? "#6b7280";
              return (
                <div key={a.id} style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "16px", padding: "14px 20px", borderBottom: i < entries.length - 1 ? "1px solid #f0ebe0" : "none", alignItems: "flex-start" }}>
                  <p style={{ margin: 0, fontSize: "11px", color: "#aaa", fontFamily: "var(--font-special-elite, monospace)", paddingTop: "1px" }}>
                    {new Date(a.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: a.detail || a.order_id ? "4px" : 0 }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: actionColor, flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a" }}>
                        {formatAction(a.action)}
                        {a.prev_status && a.new_status && (
                          <span style={{ fontSize: "11px", color: "#888", fontFamily: "var(--font-garamond, serif)", marginLeft: "8px" }}>
                            {a.prev_status} → {a.new_status}
                          </span>
                        )}
                      </p>
                    </div>
                    {a.order_id && (
                      <p style={{ margin: "2px 0 0 14px", fontSize: "11px", color: "#2563eb", fontFamily: "var(--font-garamond, serif)" }}>
                        <a href={`/admin/applications/${a.order_id}`} style={{ color: "#2563eb", textDecoration: "none" }}>
                          {a.order_id} →
                        </a>
                      </p>
                    )}
                    {a.detail && (
                      <p style={{ margin: "2px 0 0 14px", fontSize: "12px", color: "#888", fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}>
                        {a.detail}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {!loading && activity.length >= limit && (
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button
            onClick={handleLoadMore}
            style={{ padding: "10px 24px", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", background: "none", border: "1px solid #d1c9b8", color: "#555", cursor: "pointer", borderRadius: "3px" }}
          >
            Load More ({limit} shown)
          </button>
        </div>
      )}
    </div>
  );
}
