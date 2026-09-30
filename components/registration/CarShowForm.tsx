"use client";

import { useState } from "react";

const BODY: React.CSSProperties    = { fontFamily: "var(--font-body, system-ui, sans-serif)" };
const DISPLAY: React.CSSProperties = { fontFamily: "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)", letterSpacing: "0.04em" };
const INPUT =
  "w-full px-4 py-3 bg-transparent border border-[rgba(245,237,216,0.2)] text-cream placeholder:text-[rgba(245,237,216,0.3)] focus:border-teal focus:outline-none transition-colors";

export default function CarShowForm() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    year: "", make: "", model: "", color: "", description: "",
    city: "", state: "",
    termsAgreed: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [orderId, setOrderId]       = useState("");
  const [error, setError]           = useState("");

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.year || !form.make || !form.model) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!form.termsAgreed) { setError("Please agree to the participant terms."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "car-show", ...form, totalCents: 2500 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setOrderId(json.orderId ?? "");
      if (json.checkoutUrl) { window.location.href = json.checkoutUrl; return; }
      setSubmitted(true);
    } catch (e) { setError((e as Error).message); } finally { setSubmitting(false); }
  }

  if (submitted) {
    return (
      <div className="text-center py-16 px-4">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏎️</div>
        <h2 style={{ ...DISPLAY, fontSize: "3rem", color: "#3D8878" }} className="mb-4">You&apos;re Entered!</h2>
        <p style={{ ...BODY, color: "rgba(245,237,216,0.65)", maxWidth: "480px", margin: "0 auto 1rem" }}>
          Thanks, {form.firstName}! Your {form.year} {form.make} {form.model} is registered for the car show.
          Confirmation sent to <strong style={{ color: "#F5EDD8" }}>{form.email}</strong>.
        </p>
        {orderId && <p style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.35)" }}>Reference: {orderId}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: "640px", margin: "0 auto", padding: "0 1rem" }} className="space-y-5">
      <h2 style={{ ...DISPLAY, fontSize: "2.5rem", color: "#F5EDD8" }}>Car Show Registration</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>First Name *</label>
          <input className={INPUT} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
        </div>
        <div>
          <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Last Name *</label>
          <input className={INPUT} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
        </div>
      </div>
      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Email *</label>
        <input className={INPUT} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>
      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Phone</label>
        <input className={INPUT} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>

      <div style={{ borderTop: "1px solid rgba(245,237,216,0.08)", paddingTop: "1rem" }}>
        <p style={{ ...DISPLAY, fontSize: "1.3rem", color: "#3D8878", marginBottom: "1rem" }}>Vehicle Information</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Year *</label>
          <input className={INPUT} value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2024" maxLength={4} />
        </div>
        <div>
          <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Make *</label>
          <input className={INPUT} value={form.make} onChange={(e) => set("make", e.target.value)} placeholder="Ford" />
        </div>
        <div>
          <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Model *</label>
          <input className={INPUT} value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="Mustang" />
        </div>
      </div>
      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Color</label>
        <input className={INPUT} value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="Candy apple red" />
      </div>
      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Tell us about your vehicle</label>
        <textarea className={INPUT} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Modifications, build story, awards, anything you want judges to know..." style={{ resize: "vertical" }} />
      </div>

      <div style={{ borderTop: "1px solid rgba(245,237,216,0.1)", paddingTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ ...BODY, color: "rgba(245,237,216,0.5)" }}>Entry fee</span>
          <span style={{ ...DISPLAY, fontSize: "2rem", color: "#3D8878" }}>$25</span>
        </div>
        <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
          <input type="checkbox" checked={form.termsAgreed} onChange={(e) => set("termsAgreed", e.target.checked)} style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#3D8878", flexShrink: 0 }} />
          <span style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.6)" }}>
            I agree to the West TN Tattoo &amp; Art Festival car show rules and participant terms. *
          </span>
        </label>
      </div>

      {error && <p style={{ ...BODY, color: "#E03A3A", fontSize: "0.85rem" }}>{error}</p>}

      <button type="submit" disabled={submitting} style={{ width: "100%", backgroundColor: "#3D8878", color: "#F5EDD8", fontFamily: "var(--font-display, Impact, sans-serif)", fontSize: "1.2rem", letterSpacing: "0.08em", padding: "0.9rem", border: "none", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
        {submitting ? "Processing…" : "Register & Pay $25 →"}
      </button>
    </form>
  );
}
