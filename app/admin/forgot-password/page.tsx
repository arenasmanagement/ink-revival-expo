"use client";

/**
 * /admin/forgot-password
 *
 * Lets an administrator request a new password-setup / reset email.
 * Sends a Supabase recovery link that redirects to /admin/setup-password.
 *
 * SECURITY:
 *  - Always returns success (no email enumeration).
 *  - Rate-limited at the API layer (/api/admin/auth/reset).
 *  - Public page — listed in middleware passthrough.
 */

import { useState } from "react";
import Link from "next/link";

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(245,237,216,0.06)",
  border: "1px solid rgba(196,144,42,0.3)",
  color: "#F5EDD8",
  padding: "12px 14px",
  fontSize: "14px",
  fontFamily: "var(--font-special-elite, monospace)",
  letterSpacing: "0.05em",
  outline: "none",
  boxSizing: "border-box",
  borderRadius: "2px",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/admin/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <div
      className="adm-auth min-h-dvh flex items-center justify-center px-4 py-8"
      style={{ background: "#0f0a05" }}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <p
            style={{
              color: "#C4902A",
              fontFamily: "var(--font-special-elite, monospace)",
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            ★ Organizer Portal ★
          </p>
          <h1
            style={{
              color: "#F5EDD8",
              fontFamily: "var(--font-rye, serif)",
              fontSize: "22px",
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {submitted ? "Check Your Email" : "Request New Link"}
          </h1>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#1a120a",
            border: "1px solid rgba(196,144,42,0.25)",
            borderRadius: "4px",
            padding: "32px",
          }}
        >
          {submitted ? (
            /* ── Confirmation state ── */
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#C4902A", fontSize: "28px", marginBottom: "12px" }}>
                ✉
              </p>
              <p
                style={{
                  color: "#F5EDD8",
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  marginBottom: "12px",
                }}
              >
                Password setup link sent
              </p>
              <p
                style={{
                  color: "rgba(245,237,216,0.5)",
                  fontFamily: "var(--font-garamond, serif)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                If <strong style={{ color: "rgba(245,237,216,0.7)" }}>{email}</strong> is
                registered as an administrator, you will receive an email with a link
                to set your password. Check your spam folder if it doesn&apos;t arrive
                within a few minutes.
              </p>
              <p
                style={{
                  color: "rgba(245,237,216,0.3)",
                  fontFamily: "var(--font-garamond, serif)",
                  fontSize: "12px",
                  lineHeight: 1.5,
                  marginBottom: "20px",
                }}
              >
                The link expires in 60 minutes. Once you receive it, click it
                immediately and complete the password setup in the same browser tab.
              </p>
              <Link
                href="/admin/login"
                style={{
                  color: "rgba(196,144,42,0.7)",
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                }}
              >
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── Email form ── */
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <p
                style={{
                  color: "rgba(245,237,216,0.5)",
                  fontFamily: "var(--font-garamond, serif)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Enter your administrator email and we will send you a secure link to
                set up your password.
              </p>

              <div>
                <label
                  htmlFor="forgot-email"
                  style={{
                    display: "block",
                    color: "rgba(245,237,216,0.5)",
                    fontSize: "10px",
                    fontFamily: "var(--font-special-elite, monospace)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoFocus
                  required
                  style={INPUT_STYLE}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(196,144,42,0.6)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(196,144,42,0.3)";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: loading || !email ? "rgba(196,144,42,0.4)" : "#C4902A",
                  color: "#0f0a05",
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "12px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: loading || !email ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  transition: "all 0.2s",
                  borderRadius: "2px",
                }}
              >
                {loading ? "Sending…" : "Send Setup Link"}
              </button>

              <div style={{ textAlign: "center" }}>
                <Link
                  href="/admin/login"
                  style={{
                    color: "rgba(245,237,216,0.3)",
                    fontFamily: "var(--font-special-elite, monospace)",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(196,144,42,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(245,237,216,0.3)";
                  }}
                >
                  ← Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

        <p
          style={{
            color: "rgba(245,237,216,0.12)",
            fontSize: "10px",
            fontFamily: "var(--font-special-elite, monospace)",
            textAlign: "center",
            marginTop: "24px",
            letterSpacing: "0.1em",
          }}
        >
          PRIVATE — FOR AUTHORIZED ORGANIZERS ONLY
        </p>
      </div>
    </div>
  );
}
