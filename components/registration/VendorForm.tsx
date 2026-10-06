"use client";

import { useState } from "react";
import PaymentForm from "@/components/payment/PaymentForm";

const BODY: React.CSSProperties    = { fontFamily: "var(--font-body, system-ui, sans-serif)" };
const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:  0.95,
};

const BOOTH_OPTIONS = [
  { id: "10x10", label: "10 × 10 ft",  price: 150, desc: "Single booth space" },
  { id: "10x20", label: "10 × 20 ft",  price: 300, desc: "Double booth space" },
];

const INPUT =
  "w-full px-4 py-3 bg-transparent border border-[rgba(245,237,216,0.2)] text-cream placeholder:text-[rgba(245,237,216,0.3)] focus:border-teal focus:outline-none transition-colors";

export default function VendorForm() {
  const [step, setStep] = useState(0);
  const [booth, setBooth] = useState("10x10");
  const [addBooth, setAddBooth] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    businessName: "", city: "", state: "",
    vendorType: "", description: "",
    termsAgreed: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [orderId, setOrderId]       = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [amountCents, setAmountCents]   = useState(0);
  const [error, setError]           = useState("");

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const boothPrice = booth === "10x10" ? 150 : 300;
  const addPrice   = addBooth ? 150 : 0;
  const total      = boothPrice + addPrice;

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "vendor",
          ...form,
          boothSize: booth,
          additionalBooth: addBooth,
          totalCents: total * 100,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setOrderId(json.orderId ?? "");
      // Test mode: no payment needed
      if (json.testMode) { setSubmitted(true); return; }
      // Show embedded Payment Element
      if (json.clientSecret) {
        setClientSecret(json.clientSecret);
        setAmountCents(json.amountCents ?? total * 100);
        return;
      }
      setSubmitted(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  // Payment step: show embedded Stripe Payment Element
  if (clientSecret && !submitted) {
    return (
      <div style={{ paddingTop: "2rem" }}>
        <h2 style={{ ...DISPLAY, fontSize: "2rem", color: "#F5EDD8", textAlign: "center", marginBottom: "0.5rem" }}>
          Complete Payment
        </h2>
        <p style={{ ...BODY, color: "rgba(245,237,216,0.5)", fontSize: "0.85rem", textAlign: "center", marginBottom: "2rem" }}>
          Reference: <strong style={{ color: "#F5EDD8" }}>{orderId}</strong>
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
      <div className="text-center py-16 px-4">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h2 style={{ ...DISPLAY, fontSize: "3rem", color: "#3D8878" }} className="mb-4">Registration Received</h2>
        <p style={{ ...BODY, color: "rgba(245,237,216,0.65)", maxWidth: "480px", margin: "0 auto 1rem" }}>
          Thank you, {form.firstName}! Your vendor registration has been submitted.
          Check your email at <strong style={{ color: "#F5EDD8" }}>{form.email}</strong> for confirmation and payment details.
        </p>
        {orderId && <p style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.35)" }}>Reference: {orderId}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 1rem" }}>
      {/* Step 0: Info */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 style={{ ...DISPLAY, fontSize: "2.5rem", color: "#F5EDD8" }}>Your Information</h2>
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
            <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Business Name</label>
            <input className={INPUT} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Email *</label>
            <input className={INPUT} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Phone</label>
            <input className={INPUT} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>City</label>
              <input className={INPUT} value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>State</label>
              <input className={INPUT} value={form.state} onChange={(e) => set("state", e.target.value)} maxLength={2} />
            </div>
          </div>
          <div>
            <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>What do you sell? *</label>
            <input className={INPUT} value={form.vendorType} onChange={(e) => set("vendorType", e.target.value)} placeholder="Art prints, jewelry, clothing, crystals, etc." />
          </div>
          {error && <p style={{ ...BODY, color: "#E03A3A", fontSize: "0.85rem" }}>{error}</p>}
          <button
            type="button"
            onClick={() => {
              if (!form.firstName || !form.lastName || !form.email || !form.vendorType) {
                setError("Please fill in all required fields.");
                return;
              }
              setError("");
              setStep(1);
            }}
            style={{ width: "100%", backgroundColor: "#3D8878", color: "#F5EDD8", fontFamily: "var(--font-display, Impact, sans-serif)", fontSize: "1.2rem", letterSpacing: "0.08em", padding: "0.9rem", border: "none", cursor: "pointer" }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 1: Booth + Payment */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 style={{ ...DISPLAY, fontSize: "2.5rem", color: "#F5EDD8" }}>Booth & Payment</h2>
          <div className="grid grid-cols-2 gap-4">
            {BOOTH_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setBooth(opt.id)}
                style={{ border: `2px solid ${booth === opt.id ? "#3D8878" : "rgba(245,237,216,0.15)"}`, backgroundColor: booth === opt.id ? "rgba(61,136,120,0.08)" : "transparent", padding: "1rem", textAlign: "left", cursor: "pointer" }}
              >
                <div style={{ ...DISPLAY, fontSize: "1.5rem", color: booth === opt.id ? "#3D8878" : "#F5EDD8" }}>{opt.label}</div>
                <div style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.45)", marginTop: "4px" }}>${opt.price} · {opt.desc}</div>
              </button>
            ))}
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
            <input type="checkbox" checked={addBooth} onChange={(e) => setAddBooth(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#3D8878" }} />
            <span style={{ ...BODY, color: "rgba(245,237,216,0.7)" }}>Add extra 10×10 space (+$150)</span>
          </label>

          <div style={{ borderTop: "1px solid rgba(245,237,216,0.1)", paddingTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...BODY, color: "rgba(245,237,216,0.5)" }}>Total due today</span>
              <span style={{ ...DISPLAY, fontSize: "2rem", color: "#3D8878" }}>${total}</span>
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.termsAgreed} onChange={(e) => set("termsAgreed", e.target.checked)} style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#3D8878", flexShrink: 0 }} />
            <span style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.6)" }}>
              I agree to the West TN Tattoo &amp; Art Festival vendor terms and booth policies. *
            </span>
          </label>

          {error && <p style={{ ...BODY, color: "#E03A3A", fontSize: "0.85rem" }}>{error}</p>}

          <div className="flex gap-4">
            <button type="button" onClick={() => { setError(""); setStep(0); }} style={{ ...BODY, fontWeight: 600, color: "rgba(245,237,216,0.4)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>← Back</button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                if (!form.termsAgreed) { setError("Please agree to the terms."); return; }
                setError("");
                submit();
              }}
              style={{ flex: 1, backgroundColor: "#3D8878", color: "#F5EDD8", fontFamily: "var(--font-display, Impact, sans-serif)", fontSize: "1.2rem", letterSpacing: "0.08em", padding: "0.9rem", border: "none", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "Processing…" : `Pay $${total} →`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
