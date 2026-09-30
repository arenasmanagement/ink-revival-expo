"use client";

import { useState } from "react";
import { PRICING } from "@/lib/eventData";

const BODY: React.CSSProperties = { fontFamily: "var(--font-body, system-ui, sans-serif)" };
const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:  0.95,
};

const INPUT =
  "w-full px-4 py-3 bg-transparent border border-[rgba(245,237,216,0.2)] text-cream placeholder:text-[rgba(245,237,216,0.3)] focus:border-sunset focus:outline-none transition-colors";

type Package = "basic" | "vip";

interface FormData {
  firstName:    string;
  lastName:     string;
  businessName: string;
  email:        string;
  phone:        string;
  website:      string;
  package:      Package;
  message:      string;
  termsAgreed:  boolean;
}

const INITIAL: FormData = {
  firstName:    "",
  lastName:     "",
  businessName: "",
  email:        "",
  phone:        "",
  website:      "",
  package:      "basic",
  termsAgreed:  false,
  message:      "",
};

const PACKAGES: { id: Package; label: string; price: number; tag: string; benefits: readonly string[] }[] = [
  {
    id:       "basic",
    label:    "Basic Sponsorship",
    price:    PRICING.sponsorship.basic.price,
    tag:      "★ BASIC ★",
    benefits: PRICING.sponsorship.basic.benefits,
  },
  {
    id:       "vip",
    label:    "VIP Sponsorship",
    price:    PRICING.sponsorship.vip.price,
    tag:      "★ VIP ★",
    benefits: PRICING.sponsorship.vip.benefits,
  },
];

export default function SponsorApplicationForm() {
  const [data, setData]           = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [orderId, setOrderId]       = useState("");
  const [error, setError]           = useState("");

  const set = (field: keyof FormData, value: unknown) =>
    setData((p) => ({ ...p, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.firstName || !data.lastName || !data.email || !data.businessName) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!data.termsAgreed) {
      setError("Please agree to the sponsorship terms to continue.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          type:         "sponsor",
          firstName:    data.firstName,
          lastName:     data.lastName,
          businessName: data.businessName,
          email:        data.email,
          phone:        data.phone,
          website:      data.website,
          package:      data.package,
          message:      data.message,
          termsAgreed:  data.termsAgreed,
          estimatedTotal: data.package === "vip"
            ? PRICING.sponsorship.vip.price
            : PRICING.sponsorship.basic.price,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setOrderId(json.orderId ?? "");
      setSubmitted(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Confirmation ────────────────────────────────────────────────────────
  if (submitted) {
    const pkg = PACKAGES.find((p) => p.id === data.package)!;
    return (
      <div className="text-center py-16 px-4">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h2 style={{ ...DISPLAY, fontSize: "3rem", color: "#E07830" }} className="mb-4">
          Application Received
        </h2>
        <p style={{ ...BODY, color: "rgba(245,237,216,0.65)", maxWidth: "480px", margin: "0 auto 1rem" }}>
          Thank you, {data.firstName}! Your <strong style={{ color: "#F5EDD8" }}>{pkg.label}</strong> interest has been submitted.
          The festival team will follow up at{" "}
          <strong style={{ color: "#F5EDD8" }}>{data.email}</strong> within 3–5 business days with a sponsorship agreement.
        </p>
        {orderId && (
          <p style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.35)" }}>
            Reference: {orderId}
          </p>
        )}
        <p style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.4)", marginTop: "1.5rem" }}>
          Payment is collected after agreement is finalized — not at this step.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "640px", margin: "0 auto", padding: "0 1rem" }}
    >
      {/* Package selection */}
      <div className="mb-8">
        <p style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", marginBottom: "12px" }}>
          Select Your Package *
        </p>
        <div className="grid grid-cols-2 gap-4">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              type="button"
              onClick={() => set("package", pkg.id)}
              style={{
                border:          `2px solid ${data.package === pkg.id ? "#E07830" : "rgba(245,237,216,0.15)"}`,
                backgroundColor: data.package === pkg.id ? "rgba(224,120,48,0.08)" : "transparent",
                padding:         "1.25rem",
                textAlign:       "left",
                cursor:          "pointer",
                transition:      "all 0.15s ease",
              }}
            >
              <div style={{ ...BODY, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: data.package === pkg.id ? "#E07830" : "rgba(245,237,216,0.35)", marginBottom: "4px" }}>
                {pkg.tag}
              </div>
              <div style={{ ...DISPLAY, fontSize: "1.6rem", color: data.package === pkg.id ? "#E07830" : "#F5EDD8" }}>
                ${pkg.price}
              </div>
              <ul style={{ marginTop: "8px", paddingLeft: 0, listStyle: "none" }}>
                {pkg.benefits.slice(0, 3).map((b) => (
                  <li key={b} style={{ ...BODY, fontSize: "0.72rem", color: "rgba(245,237,216,0.45)", marginBottom: "3px" }}>
                    · {b}
                  </li>
                ))}
                {pkg.benefits.length > 3 && (
                  <li style={{ ...BODY, fontSize: "0.72rem", color: "rgba(245,237,216,0.3)", fontStyle: "italic" }}>
                    + {pkg.benefits.length - 3} more
                  </li>
                )}
              </ul>
            </button>
          ))}
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-4 mb-6">
        <h3 style={{ ...DISPLAY, fontSize: "1.8rem", color: "#F5EDD8" }}>Your Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>
              First Name *
            </label>
            <input
              className={INPUT}
              value={data.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              placeholder="First"
              required
            />
          </div>
          <div>
            <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>
              Last Name *
            </label>
            <input
              className={INPUT}
              value={data.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              placeholder="Last"
              required
            />
          </div>
        </div>

        <div>
          <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>
            Business / Organization Name *
          </label>
          <input
            className={INPUT}
            value={data.businessName}
            onChange={(e) => set("businessName", e.target.value)}
            placeholder="Your business name"
            required
          />
        </div>

        <div>
          <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>
            Email Address *
          </label>
          <input
            className={INPUT}
            type="email"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@business.com"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>
              Phone
            </label>
            <input
              className={INPUT}
              type="tel"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(555) 000-0000"
            />
          </div>
          <div>
            <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>
              Website
            </label>
            <input
              className={INPUT}
              type="url"
              value={data.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://"
            />
          </div>
        </div>

        <div>
          <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>
            Anything you&apos;d like us to know?
          </label>
          <textarea
            className={INPUT}
            rows={3}
            value={data.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Goals, questions, custom partnership ideas..."
            style={{ resize: "vertical" }}
          />
        </div>
      </div>

      {/* Agreement */}
      <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", marginBottom: "1.5rem" }}>
        <input
          type="checkbox"
          checked={data.termsAgreed}
          onChange={(e) => set("termsAgreed", e.target.checked)}
          style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#E07830", flexShrink: 0 }}
        />
        <span style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.6)" }}>
          I understand this is an expression of interest. A formal sponsorship agreement will be provided before payment is collected. *
        </span>
      </label>

      {/* Error */}
      {error && (
        <p style={{ ...BODY, color: "#E03A3A", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        style={{
          width:           "100%",
          backgroundColor: "#E07830",
          color:           "#0E0804",
          fontFamily:      "var(--font-display, Impact, sans-serif)",
          fontSize:        "1.2rem",
          letterSpacing:   "0.08em",
          padding:         "0.9rem",
          border:          "none",
          cursor:          submitting ? "not-allowed" : "pointer",
          opacity:         submitting ? 0.7 : 1,
          transition:      "opacity 0.15s ease",
        }}
      >
        {submitting ? "Submitting…" : "Submit Sponsorship Interest"}
      </button>

      <p style={{ ...BODY, fontSize: "0.78rem", color: "rgba(245,237,216,0.3)", textAlign: "center", marginTop: "1rem" }}>
        No payment required at this step — agreement sent after review.
      </p>
    </form>
  );
}
