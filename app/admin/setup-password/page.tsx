"use client";

/**
 * /admin/setup-password
 *
 * Handles Supabase password recovery and invite flows.
 *
 * ─── ARCHITECTURE: verify-on-submit ────────────────────────────────────────
 *
 *  Previous architecture (broken):
 *    Email → {{ .ConfirmationURL }} → Supabase /auth/v1/verify endpoint
 *    → Email security scanner hits Supabase endpoint → token consumed
 *    → Even if it reaches our page, useEffect calls verifyOtp() immediately
 *    → Token consumed again → Diego clicks → "Link Invalid or Expired"
 *
 *  New architecture (correct):
 *    Email → {{ .TokenHash }} → direct URL to THIS page
 *    → Email scanners get server-rendered HTML (no JS, no token consumed)
 *    → Page shows password form immediately — NO auto-verification on load
 *    → User fills password, clicks Set Password
 *    → Form submit handler POSTs to /api/admin/auth/setup (server-side)
 *    → Server verifyOtp + admin.updateUserById + signInWithPassword
 *    → Token consumed exactly once, by the real user
 *
 *  URL format this page expects:
 *    /admin/setup-password?token_hash=HASH&type=recovery
 *    /admin/setup-password?token_hash=HASH&type=invite
 *
 * SECURITY: Public page — in middleware passthrough list.
 * No authentication bypass: verifyOtp() with an invalid/expired hash returns
 * an error and the page shows "Link Invalid". Password update requires a
 * valid, live Supabase recovery session obtained via verifyOtp().
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Phase =
  | "ready"      // Token found in URL — form is shown, waiting for user input
  | "submitting" // User submitted — verifying token + updating password
  | "success"    // Password updated — redirecting to /admin
  | "invalid";   // No token in URL, or verifyOtp failed on submit

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(245,237,216,0.06)",
  border: "1px solid rgba(196,144,42,0.3)",
  color: "#F5EDD8",
  padding: "12px 14px",
  fontSize: "14px",
  fontFamily: "var(--font-special-elite, monospace)",
  outline: "none",
  boxSizing: "border-box",
  borderRadius: "2px",
};

function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
  if (pw.length === 0) return { level: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "#dc2626" };
  if (score <= 2) return { level: 2, label: "Fair", color: "#d97706" };
  if (score <= 3) return { level: 3, label: "Good", color: "#ca8a04" };
  if (score <= 4) return { level: 4, label: "Strong", color: "#16a34a" };
  return { level: 5, label: "Very Strong", color: "#15803d" };
}

export default function SetupPasswordPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("ready");
  const [tokenHash, setTokenHash] = useState("");
  const [tokenType, setTokenType] = useState<"recovery" | "invite" | "signup">("recovery");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [invalidReason, setInvalidReason] = useState("");

  const strength = getPasswordStrength(password);

  /**
   * On mount: read token_hash and type from URL.
   * CRITICAL: We do NOT call any Supabase auth API here.
   * The token must survive email security scanners fetching this page,
   * so it is only consumed inside handleSubmit when the user actually acts.
   */
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const hash = sp.get("token_hash");
    const type = sp.get("type") as "recovery" | "invite" | "signup" | null;

    if (!hash || !type || !["recovery", "invite", "signup"].includes(type)) {
      setInvalidReason(
        "No valid recovery token was found in this link. Please request a new password reset."
      );
      setPhase("invalid");
      return;
    }

    setTokenHash(hash);
    setTokenType(type);
    setPhase("ready");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Form submit: delegates entirely to the server-side /api/admin/auth/setup
   * route which handles verifyOtp + admin.updateUserById + signInWithPassword
   * atomically. This avoids the client-side session=null edge case where
   * verifyOtp returns { user, session: null } without an error.
   *
   * Step 1 — Validate password locally (no API call yet).
   * Step 2 — POST to /api/admin/auth/setup — server verifies OTP, updates
   *           password via admin API, signs in, sets wt_admin_session cookie.
   * Step 3 — Redirect to /admin (or /admin/login if auto-login failed).
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    // ── Local validation ────────────────────────────────────────────────────
    if (password.length < 12) {
      setErrorMsg("Password must be at least 12 characters.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setErrorMsg("Password must include at least one uppercase letter.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setErrorMsg("Password must include at least one number.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setPhase("submitting");

    try {
      // ── Step 2: Server-side verify + update + sign-in ──────────────────────
      const res = await fetch("/api/admin/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_hash: tokenHash, type: tokenType, password }),
      });

      const data = await res.json() as { ok?: boolean; error?: string; requiresLogin?: boolean };

      if (!res.ok) {
        const errCode = data.error ?? "";
        if (errCode === "expired") {
          setInvalidReason(
            "This link has expired. Recovery links are valid for 1 hour. Please request a new one."
          );
          setPhase("invalid");
        } else if (errCode === "invalid") {
          setInvalidReason(
            "This link is invalid or has already been used. Please request a new one."
          );
          setPhase("invalid");
        } else {
          // Generic / server error — stay on form so user can retry
          setPhase("ready");
          setErrorMsg(errCode || "Failed to set password. Please try again.");
        }
        return;
      }

      // ── Step 3: Password saved — redirect ─────────────────────────────────
      setPhase("success");
      // Use window.location.href for a full page reload so the cookie set by
      // the server response is picked up cleanly by Next.js middleware.
      if (data.requiresLogin) {
        setTimeout(() => { window.location.href = "/admin/login?setup=1"; }, 1800);
      } else {
        setTimeout(() => { window.location.href = "/admin"; }, 1800);
      }

    } catch (err) {
      setPhase("ready");
      setErrorMsg(
        (err as Error).message ?? "Network error. Please try again."
      );
    }
  }

  const meetsLength    = password.length >= 12;
  const meetsUppercase = /[A-Z]/.test(password);
  const meetsNumber    = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirm;
  const canSubmit      =
    meetsLength && meetsUppercase && meetsNumber && passwordsMatch && phase !== "submitting";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
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
            {phase === "success" ? "Password Updated" : "Set Your Password"}
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
          {/* Invalid / expired */}
          {phase === "invalid" && (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#dc2626", fontSize: "24px", marginBottom: "12px" }}>✕</p>
              <p
                style={{
                  color: "#F5EDD8",
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  marginBottom: "12px",
                }}
              >
                Link Invalid or Expired
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
                {invalidReason || "This link is invalid or has expired. Please request a new one."}
              </p>
              <Link
                href="/admin/forgot-password"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  background: "#C4902A",
                  color: "#0f0a05",
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: "2px",
                  fontWeight: "bold",
                }}
              >
                Request New Link
              </Link>
            </div>
          )}

          {/* Success */}
          {phase === "success" && (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#16a34a", fontSize: "32px", marginBottom: "12px" }}>✓</p>
              <p
                style={{
                  color: "#F5EDD8",
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Password updated successfully!
              </p>
              <p
                style={{
                  color: "rgba(245,237,216,0.4)",
                  fontFamily: "var(--font-garamond, serif)",
                  fontSize: "13px",
                }}
              >
                Taking you to the dashboard…
              </p>
            </div>
          )}

          {/* Password form — shown as soon as the page loads (no verifying spinner) */}
          {(phase === "ready" || phase === "submitting") && (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              {/* New password */}
              <div>
                <label
                  htmlFor="setup-password"
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
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="setup-password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 12 chars, 1 uppercase, 1 number"
                    autoFocus
                    required
                    disabled={phase === "submitting"}
                    style={{ ...INPUT_STYLE, paddingRight: "44px" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.6)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "rgba(196,144,42,0.3)"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    disabled={phase === "submitting"}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "rgba(245,237,216,0.4)",
                      cursor: "pointer",
                      fontSize: "12px",
                      padding: 0,
                      fontFamily: "var(--font-special-elite, monospace)",
                    }}
                    tabIndex={-1}
                  >
                    {showPw ? "hide" : "show"}
                  </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginTop: "8px" }}>
                    <div
                      style={{
                        height: "3px",
                        background: "rgba(245,237,216,0.1)",
                        borderRadius: "2px",
                        overflow: "hidden",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${(strength.level / 5) * 100}%`,
                          background: strength.color,
                          transition: "width 0.2s, background 0.2s",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "10px",
                        fontFamily: "var(--font-special-elite, monospace)",
                        color: strength.color,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="setup-confirm"
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
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="setup-confirm"
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    disabled={phase === "submitting"}
                    style={{ ...INPUT_STYLE, paddingRight: "44px" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.6)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "rgba(196,144,42,0.3)"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    disabled={phase === "submitting"}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "rgba(245,237,216,0.4)",
                      cursor: "pointer",
                      fontSize: "12px",
                      padding: 0,
                      fontFamily: "var(--font-special-elite, monospace)",
                    }}
                    tabIndex={-1}
                  >
                    {showConfirm ? "hide" : "show"}
                  </button>
                </div>

                {/* Match indicator */}
                {confirm.length > 0 && (
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: "11px",
                      fontFamily: "var(--font-garamond, serif)",
                      color: passwordsMatch ? "#16a34a" : "rgba(220,38,38,0.8)",
                    }}
                  >
                    {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Requirements checklist */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  padding: "12px",
                  background: "rgba(245,237,216,0.03)",
                  borderRadius: "2px",
                  border: "1px solid rgba(196,144,42,0.1)",
                }}
              >
                {[
                  { met: meetsLength,    text: "At least 12 characters" },
                  { met: meetsUppercase, text: "One uppercase letter"   },
                  { met: meetsNumber,    text: "One number"             },
                ].map(({ met, text }) => (
                  <p
                    key={text}
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      fontFamily: "var(--font-garamond, serif)",
                      color: met ? "#16a34a" : "rgba(245,237,216,0.25)",
                      transition: "color 0.15s",
                    }}
                  >
                    {met ? "✓" : "·"} {text}
                  </p>
                ))}
              </div>

              {/* Server error */}
              {errorMsg && (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "13px",
                    fontFamily: "var(--font-garamond, serif)",
                    margin: 0,
                  }}
                >
                  {errorMsg}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: !canSubmit ? "rgba(196,144,42,0.4)" : "#C4902A",
                  color: "#0f0a05",
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "12px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: !canSubmit ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  transition: "all 0.2s",
                  borderRadius: "2px",
                }}
              >
                {phase === "submitting" ? "Setting Password…" : "Set Password"}
              </button>
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
