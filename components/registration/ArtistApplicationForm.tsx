"use client";

import { useState } from "react";
import { TATTOO_SPECIALTIES } from "@/lib/eventData";

const BODY: React.CSSProperties = { fontFamily: "var(--font-body, system-ui, sans-serif)" };
const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:  0.95,
};

const STEPS = ["Info", "Booth", "Requirements", "Review", "Submit"];

interface FormData {
  // Step 1
  firstName:   string;
  lastName:    string;
  email:       string;
  phone:       string;
  instagram:   string;
  website:     string;
  city:        string;
  state:       string;
  // Step 2
  boothSize:   "10x10" | "10x20";
  additionalBooth: boolean;
  licenseState: string; // for permit fee
  specialties: string[];
  // Step 3
  yearsExp:    string;
  portfolio:   string;
  about:       string;
  // Agreements
  termsAgreed: boolean;
  mediaRelease: boolean;
}

const INITIAL: FormData = {
  firstName: "", lastName: "", email: "", phone: "", instagram: "",
  website: "", city: "", state: "",
  boothSize: "10x10", additionalBooth: false, licenseState: "",
  specialties: [],
  yearsExp: "", portfolio: "", about: "",
  termsAgreed: false, mediaRelease: false,
};

const BOOTH_PRICES = { "10x10": 150, "10x20": 300 };
const PERMIT_FEE = (state: string) =>
  state.toUpperCase() === "TN" ? 50 : state ? 100 : 0;

function calcTotal(d: FormData): number {
  let total = BOOTH_PRICES[d.boothSize];
  if (d.additionalBooth) total += 150;
  total += PERMIT_FEE(d.licenseState);
  return total;
}

const INPUT =
  "w-full px-4 py-3 bg-transparent border border-[rgba(245,237,216,0.2)] text-cream placeholder:text-[rgba(245,237,216,0.3)] focus:border-sunset focus:outline-none transition-colors";

export default function ArtistApplicationForm() {
  const [step, setStep]       = useState(0);
  const [data, setData]       = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [orderId, setOrderId]       = useState("");
  const [error, setError]           = useState("");

  const set = (field: keyof FormData, value: unknown) =>
    setData((p) => ({ ...p, [field]: value }));

  const toggleSpecialty = (s: string) =>
    setData((p) => ({
      ...p,
      specialties: p.specialties.includes(s)
        ? p.specialties.filter((x) => x !== s)
        : [...p.specialties, s],
    }));

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type:          "artist",
          firstName:     data.firstName,
          lastName:      data.lastName,
          email:         data.email,
          phone:         data.phone,
          instagram:     data.instagram,
          website:       data.website,
          city:          data.city,
          state:         data.state,
          boothSize:     data.boothSize,
          additionalBooth: data.additionalBooth,
          licenseState:  data.licenseState,
          specialties:   data.specialties,
          yearsExp:      data.yearsExp,
          portfolio:     data.portfolio,
          about:         data.about,
          termsAgreed:   data.termsAgreed,
          mediaRelease:  data.mediaRelease,
          estimatedTotal: calcTotal(data),
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

  // ── Confirmation screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="text-center py-16 px-4">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h2 style={{ ...DISPLAY, fontSize: "3rem", color: "#E07830" }} className="mb-4">
          Application Received
        </h2>
        <p style={{ ...BODY, color: "rgba(245,237,216,0.65)", maxWidth: "480px", margin: "0 auto 1rem" }}>
          Thank you, {data.firstName}! Your artist application has been submitted.
          The festival team will review it and contact you at <strong style={{ color: "#F5EDD8" }}>{data.email}</strong> within 5–7 business days.
        </p>
        {orderId && (
          <p style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.35)" }}>
            Reference: {orderId}
          </p>
        )}
        <p style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.4)", marginTop: "1.5rem" }}>
          Booth fees are collected only <em>after</em> your application is approved.
        </p>
      </div>
    );
  }

  const total = calcTotal(data);

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1rem" }}>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              style={{
                width: "28px", height: "28px", borderRadius: "50%",
                backgroundColor: i < step ? "#3D8878" : i === step ? "#E07830" : "transparent",
                border: `2px solid ${i <= step ? (i < step ? "#3D8878" : "#E07830") : "rgba(245,237,216,0.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ ...BODY, fontSize: "0.7rem", fontWeight: 700, color: i <= step ? "#0E0804" : "rgba(245,237,216,0.3)" }}>
                {i < step ? "✓" : i + 1}
              </span>
            </div>
            <span style={{ ...BODY, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: i === step ? "#E07830" : "rgba(245,237,216,0.35)", whiteSpace: "nowrap" }}>
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: "1px", backgroundColor: i < step ? "#3D8878" : "rgba(245,237,216,0.1)" }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 0: Personal Info ── */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 style={{ ...DISPLAY, fontSize: "2.5rem", color: "#F5EDD8" }}>Your Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>First Name *</label>
              <input className={INPUT} value={data.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First" />
            </div>
            <div>
              <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>Last Name *</label>
              <input className={INPUT} value={data.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last" />
            </div>
          </div>
          <div>
            <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>Email Address *</label>
            <input className={INPUT} type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>Phone</label>
            <input className={INPUT} type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 000-0000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>Instagram</label>
              <input className={INPUT} value={data.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@handle" />
            </div>
            <div>
              <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>Website</label>
              <input className={INPUT} value={data.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>City</label>
              <input className={INPUT} value={data.city} onChange={(e) => set("city", e.target.value)} placeholder="City" />
            </div>
            <div>
              <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>State</label>
              <input className={INPUT} value={data.state} onChange={(e) => set("state", e.target.value)} placeholder="TN" maxLength={2} />
            </div>
          </div>
          <NavButtons
            onNext={() => {
              if (!data.firstName || !data.lastName || !data.email) {
                setError("Please fill in your name and email.");
                return;
              }
              setError("");
              setStep(1);
            }}
            showBack={false}
            error={error}
          />
        </div>
      )}

      {/* ── Step 1: Booth Options ── */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 style={{ ...DISPLAY, fontSize: "2.5rem", color: "#F5EDD8" }}>Booth Options</h2>

          <div>
            <p style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", marginBottom: "12px" }}>Booth Size *</p>
            <div className="grid grid-cols-2 gap-4">
              {(["10x10", "10x20"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => set("boothSize", size)}
                  style={{
                    border: `2px solid ${data.boothSize === size ? "#E07830" : "rgba(245,237,216,0.15)"}`,
                    backgroundColor: data.boothSize === size ? "rgba(224,120,48,0.08)" : "transparent",
                    padding: "1rem",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ ...DISPLAY, fontSize: "1.5rem", color: data.boothSize === size ? "#E07830" : "#F5EDD8" }}>
                    {size === "10x10" ? "10 × 10 ft" : "10 × 20 ft"}
                  </div>
                  <div style={{ ...BODY, fontSize: "0.9rem", color: "rgba(245,237,216,0.5)", marginTop: "4px" }}>
                    ${BOOTH_PRICES[size]} · {size === "10x10" ? "Single booth" : "Double booth"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={data.additionalBooth}
              onChange={(e) => set("additionalBooth", e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#E07830" }}
            />
            <span style={{ ...BODY, color: "rgba(245,237,216,0.7)" }}>
              Add additional 10×10 space (+$150)
            </span>
          </label>

          <div>
            <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>
              State you&apos;re licensed in (for permit fee)
            </label>
            <input
              className={INPUT}
              value={data.licenseState}
              onChange={(e) => set("licenseState", e.target.value.toUpperCase())}
              placeholder="TN"
              maxLength={2}
              style={{ maxWidth: "120px" }}
            />
            {data.licenseState && (
              <p style={{ ...BODY, fontSize: "0.8rem", color: "#C89030", marginTop: "6px" }}>
                {data.licenseState === "TN"
                  ? "In-state permit fee: $50"
                  : `Out-of-state permit fee: $100`}
              </p>
            )}
          </div>

          {/* Price preview */}
          <div style={{ borderTop: "1px solid rgba(245,237,216,0.1)", paddingTop: "1rem" }}>
            <div style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.4)", marginBottom: "4px" }}>
              Estimated total (collected after approval):
            </div>
            <div style={{ ...DISPLAY, fontSize: "2rem", color: "#E07830" }}>${total}</div>
          </div>

          <NavButtons onBack={() => { setError(""); setStep(0); }} onNext={() => { setError(""); setStep(2); }} error={error} />
        </div>
      )}

      {/* ── Step 2: Portfolio / Requirements ── */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 style={{ ...DISPLAY, fontSize: "2.5rem", color: "#F5EDD8" }}>Portfolio & Style</h2>

          <div>
            <p style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", marginBottom: "10px" }}>Specialties</p>
            <div className="flex flex-wrap gap-2">
              {TATTOO_SPECIALTIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialty(s)}
                  style={{
                    ...BODY,
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    padding: "5px 14px",
                    border: `1px solid ${data.specialties.includes(s) ? "#3D8878" : "rgba(245,237,216,0.15)"}`,
                    backgroundColor: data.specialties.includes(s) ? "rgba(61,136,120,0.15)" : "transparent",
                    color: data.specialties.includes(s) ? "#3D8878" : "rgba(245,237,216,0.55)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>Years of Experience</label>
            <input className={INPUT} value={data.yearsExp} onChange={(e) => set("yearsExp", e.target.value)} placeholder="e.g. 7 years" />
          </div>

          <div>
            <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>Portfolio Link *</label>
            <input className={INPUT} value={data.portfolio} onChange={(e) => set("portfolio", e.target.value)} placeholder="Instagram, website, or portfolio URL" />
          </div>

          <div>
            <label style={{ ...BODY, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", display: "block", marginBottom: "6px" }}>Tell us about yourself & your work *</label>
            <textarea
              className={INPUT}
              rows={4}
              value={data.about}
              onChange={(e) => set("about", e.target.value)}
              placeholder="Brief bio, style, what makes your work stand out..."
              style={{ resize: "vertical" }}
            />
          </div>

          <NavButtons
            onBack={() => { setError(""); setStep(1); }}
            onNext={() => {
              if (!data.portfolio || !data.about) {
                setError("Please fill in your portfolio link and bio.");
                return;
              }
              setError("");
              setStep(3);
            }}
            error={error}
          />
        </div>
      )}

      {/* ── Step 3: Review ── */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 style={{ ...DISPLAY, fontSize: "2.5rem", color: "#F5EDD8" }}>Review Your Application</h2>

          <ReviewRow label="Name" value={`${data.firstName} ${data.lastName}`} />
          <ReviewRow label="Email" value={data.email} />
          {data.phone && <ReviewRow label="Phone" value={data.phone} />}
          {data.instagram && <ReviewRow label="Instagram" value={data.instagram} />}
          <ReviewRow label="Location" value={`${data.city}, ${data.state}`} />
          <ReviewRow label="Booth Size" value={data.boothSize === "10x10" ? "10×10 ft ($150)" : "10×20 ft ($300)"} />
          {data.additionalBooth && <ReviewRow label="Additional Booth" value="+$150" />}
          {data.licenseState && (
            <ReviewRow
              label="Permit Fee"
              value={`${data.licenseState === "TN" ? "In-state" : "Out-of-state"} — $${PERMIT_FEE(data.licenseState)}`}
            />
          )}
          {data.specialties.length > 0 && (
            <ReviewRow label="Specialties" value={data.specialties.join(", ")} />
          )}
          <ReviewRow label="Portfolio" value={data.portfolio} />

          <div style={{ borderTop: "2px solid #E07830", paddingTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...BODY, fontWeight: 600, color: "rgba(245,237,216,0.6)" }}>Estimated Total (due after approval)</span>
              <span style={{ ...DISPLAY, fontSize: "2rem", color: "#E07830" }}>${total}</span>
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-4 pt-2">
            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={data.termsAgreed}
                onChange={(e) => set("termsAgreed", e.target.checked)}
                style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#E07830", flexShrink: 0 }}
              />
              <span style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.6)" }}>
                I agree to the West TN Tattoo &amp; Art Festival participant terms, rules, and booth policies. *
              </span>
            </label>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={data.mediaRelease}
                onChange={(e) => set("mediaRelease", e.target.checked)}
                style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#E07830", flexShrink: 0 }}
              />
              <span style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.6)" }}>
                I consent to photography/video of my booth for festival promotional use.
              </span>
            </label>
          </div>

          {error && (
            <p style={{ ...BODY, color: "#E03A3A", fontSize: "0.85rem" }}>{error}</p>
          )}

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => { setError(""); setStep(2); }}
              style={{ ...BODY, fontWeight: 600, color: "rgba(245,237,216,0.4)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (!data.termsAgreed) {
                  setError("Please agree to the participant terms to continue.");
                  return;
                }
                setError("");
                handleSubmit();
              }}
              disabled={submitting}
              style={{
                flex: 1,
                backgroundColor: "#E07830",
                color: "#0E0804",
                fontFamily: "var(--font-display, Impact, sans-serif)",
                fontSize: "1.2rem",
                letterSpacing: "0.08em",
                padding: "0.9rem",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid rgba(245,237,216,0.06)", paddingBottom: "0.6rem" }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(245,237,216,0.35)", minWidth: "130px", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#F5EDD8", wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}

function NavButtons({
  onBack,
  onNext,
  showBack = true,
  error,
}: {
  onBack?:   () => void;
  onNext?:   () => void;
  showBack?: boolean;
  error?:    string;
}) {
  return (
    <div className="pt-4">
      {error && (
        <p style={{ fontFamily: "var(--font-body)", color: "#E03A3A", fontSize: "0.85rem", marginBottom: "12px" }}>{error}</p>
      )}
      <div className="flex gap-4">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "rgba(245,237,216,0.4)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            ← Back
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            style={{
              flex:            1,
              backgroundColor: "#E07830",
              color:           "#0E0804",
              fontFamily:      "var(--font-display, Impact, sans-serif)",
              fontSize:        "1.1rem",
              letterSpacing:   "0.08em",
              padding:         "0.85rem",
              border:          "none",
              cursor:          "pointer",
            }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
