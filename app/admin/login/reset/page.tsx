"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0f0a05" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p style={{ color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "8px" }}>
            ★ Organizer Portal ★
          </p>
          <h1 style={{ color: "#F5EDD8", fontFamily: "var(--font-rye, serif)", fontSize: "22px", lineHeight: 1.3, margin: 0 }}>
            Reset Password
          </h1>
        </div>

        <div style={{ background: "#1a120a", border: "1px solid rgba(196,144,42,0.25)", borderRadius: "4px", padding: "32px" }}>
          {submitted ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#C4902A", fontSize: "28px", marginBottom: "12px" }}>✉</p>
              <p style={{ color: "#F5EDD8", fontFamily: "var(--font-special-elite, monospace)", fontSize: "13px", letterSpacing: "0.05em", marginBottom: "8px" }}>
                Check your email
              </p>
              <p style={{ color: "rgba(245,237,216,0.5)", fontFamily: "var(--font-garamond, serif)", fontSize: "13px", lineHeight: 1.6, margin: "0 0 20px" }}>
                If an account exists for <strong style={{ color: "rgba(245,237,216,0.7)" }}>{email}</strong>, you will receive a password reset link shortly.
              </p>
              <Link
                href="/admin/login"
                style={{ color: "rgba(196,144,42,0.7)", fontFamily: "var(--font-special-elite, monospace)", fontSize: "11px", letterSpacing: "0.1em", textDecoration: "none" }}
              >
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ color: "rgba(245,237,216,0.5)", fontFamily: "var(--font-garamond, serif)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                Enter your administrator email address and we will send you a password reset link.
              </p>

              <div>
                <label
                  htmlFor="reset-email"
                  style={{ display: "block", color: "rgba(245,237,216,0.5)", fontSize: "10px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}
                >
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoFocus
                  required
                  style={{
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
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.6)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.3)"; }}
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
                {loading ? "Sending…" : "Send Reset Link"}
              </button>

              <div style={{ textAlign: "center" }}>
                <Link
                  href="/admin/login"
                  style={{ color: "rgba(245,237,216,0.3)", fontFamily: "var(--font-special-elite, monospace)", fontSize: "11px", letterSpacing: "0.1em", textDecoration: "none" }}
                >
                  ← Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
