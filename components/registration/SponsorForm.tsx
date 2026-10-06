"use client";

import { useState } from "react";
import PaymentForm from "@/components/payment/PaymentForm";

const BODY: React.CSSProperties    = { fontFamily: "var(--font-body, system-ui, sans-serif)" };
const DISPLAY: React.CSSProperties = { fontFamily: "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)", letterSpacing: "0.04em" };
const INPUT =
  "w-full px-4 py-3 bg-transparent border border-[rgba(245,237,216,0.2)] text-cream placeholder:text-[rgba(245,237,216,0.3)] focus:border-amber focus:outline-none transition-colors";

const PACKAGES = [
  { id: "booth",  label: "Booth Sponsor",  price: 50   },
  { id: "basic",  label: "Basic Sponsor",  price: 500  },
  { id: "vip",    label: "VIP Sponsor",    price: 1000 },
];

export default function SponsorForm() {
  const [pkg, setPkg]         = useState("basic");
  const [form, setForm]       = useState({ firstName: "", lastName: "", email: "", phone: "", company: "", website: "", city: "", state: "", notes: "", termsAgreed: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [orderId, setOrderId]       = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [amountCents, setAmountCents]   = useState(0);
  const [error, setError]           = useState("");

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));
  const price = PACKAGES.find((p) => p.id === pkg)?.price ?? 500;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) { setError("Please fill in required fields."); return; }
    if (!form.termsAgreed) { setError("Please agree to the sponsor terms."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "sponsor", ...form, sponsorPackage: pkg, totalCents: price * 100 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setOrderId(json.orderId ?? "");
      if (json.testMode) { setSubmitted(true); return; }
      if (json.clientSecret) {
        setClientSecret(json.clientSecret);
        setAmountCents(json.amountCents ?? price * 100);
        return;
      }
      setSubmitted(true);
    } catch (e) { setError((e as Error).message); } finally { setSubmitting(false); }
  }

  if (clientSecret && !submitted) {
    return (
      <div style={{ paddingTop: "2rem" }}>
        <h2 style={{ ...DISPLAY, fontSize: "2rem", color: "#F5EDD8", textAlign: "center", marginBottom: "0.5rem" }}>Authorize Sponsorship Hold</h2>
        <p style={{ ...BODY, color: "rgba(245,237,216,0.5)", fontSize: "0.85rem", textAlign: "center", marginBottom: "2rem" }}>
          Reference: <strong style={{ color: "#F5EDD8" }}>{orderId}</strong><br />
          A hold will be placed on your card. No charge until your sponsorship is confirmed.
        </p>
        <PaymentForm
          clientSecret={clientSecret}
          orderId={orderId}
          amountCents={amountCents}
          paymentType="auth"
          onSuccess={() => setSubmitted(true)}
          onError={(msg) => setError(msg)}
        />
        {error && <p style={{ ...BODY, color: "#E07830", fontSize: "0.85rem", textAlign: "center", marginTop: "1rem" }}>{error}</p>}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-12 px-4">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⭐</div>
        <h2 style={{ ...DISPLAY, fontSize: "3rem", color: "#C89030" }} className="mb-4">Sponsorship Received!</h2>
        <p style={{ ...BODY, color: "rgba(245,237,216,0.65)", maxWidth: "480px", margin: "0 auto 1rem" }}>
          Thank you, {form.firstName}! We&apos;ll be in touch at <strong style={{ color: "#F5EDD8" }}>{form.email}</strong> with next steps.
        </p>
        {orderId && <p style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.35)" }}>Reference: {orderId}</p>}
        <p style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.4)", marginTop: "1rem" }}>
          Your payment hold has been placed. If confirmed, your sponsorship fee will be captured.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: "640px", margin: "0 auto" }} className="space-y-5">
      <h2 style={{ ...DISPLAY, fontSize: "2rem", color: "#F5EDD8" }}>Sponsorship Application</h2>

      {/* Package selector */}
      <div className="grid grid-cols-3 gap-3">
        {PACKAGES.map((p) => (
          <button key={p.id} type="button" onClick={() => setPkg(p.id)} style={{ border: `2px solid ${pkg === p.id ? "#C89030" : "rgba(245,237,216,0.12)"}`, backgroundColor: pkg === p.id ? "rgba(200,144,48,0.1)" : "transparent", padding: "0.75rem", textAlign: "center", cursor: "pointer" }}>
            <div style={{ ...DISPLAY, fontSize: "1rem", color: pkg === p.id ? "#C89030" : "#F5EDD8" }}>{p.label}</div>
            <div style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.4)", marginTop: "2px" }}>${p.price}</div>
          </button>
        ))}
      </div>

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
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Company / Organization</label>
        <input className={INPUT} value={form.company} onChange={(e) => set("company", e.target.value)} />
      </div>
      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Email *</label>
        <input className={INPUT} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>
      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Phone</label>
        <input className={INPUT} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>
      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Website</label>
        <input className={INPUT} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />
      </div>
      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Questions / Notes</label>
        <textarea className={INPUT} rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} style={{ resize: "vertical" }} />
      </div>

      <div style={{ borderTop: "1px solid rgba(245,237,216,0.1)", paddingTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ ...BODY, color: "rgba(245,237,216,0.5)" }}>Package total</span>
          <span style={{ ...DISPLAY, fontSize: "2rem", color: "#C89030" }}>${price}</span>
        </div>
        <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
          <input type="checkbox" checked={form.termsAgreed} onChange={(e) => set("termsAgreed", e.target.checked)} style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#C89030", flexShrink: 0 }} />
          <span style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.6)" }}>I agree to the West TN Tattoo &amp; Art Festival sponsorship terms. *</span>
        </label>
      </div>

      {error && <p style={{ ...BODY, color: "#E03A3A", fontSize: "0.85rem" }}>{error}</p>}

      <button type="submit" disabled={submitting} style={{ width: "100%", backgroundColor: "#C89030", color: "#0E0804", fontFamily: "var(--font-display, Impact, sans-serif)", fontSize: "1.2rem", letterSpacing: "0.08em", padding: "0.9rem", border: "none", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
        {submitting ? "Processing…" : `Register as ${PACKAGES.find((p) => p.id === pkg)?.label ?? "Sponsor"} →`}
      </button>
    </form>
  );
}
