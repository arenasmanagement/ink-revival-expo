"use client";

/**
 * /admin/setup-password
 *
 * Handles all three URL formats Supabase may send after a recovery or invite email:
 *
 *   1. ?token_hash=HASH&type=recovery  (modern Supabase default — was NOT handled before)
 *   2. ?code=CODE                      (PKCE code exchange)
 *   3. #access_token=AT&type=recovery  (implicit / hash fragment)
 *
 * The previous version called getSession() immediately after createClient(), which
 * races with Supabase's async detectSessionInUrl processing and nearly always
 * returns null — causing the "invalid or expired" message on fresh valid links.
 *
 * This version sets detectSessionInUrl: false and handles each URL format
 * explicitly so there is no race condition.
 *
 * SECURITY: Public page — in middleware passthrough list.
 */

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";

type Phase =
  | "verifying"   // Parsing URL token — initial state
  | "form"        // Token verified — ready for password input
  | "submitting"  // Saving password + auto-login
  | "success"     // Done — redirecting
  | "invalid";    // Token missing / expired / already used

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
  const supabaseRef = useRef<SupabaseClient | null>(null);

  const [phase, setPhase] = useState<Phase>("verifying");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [invalidReason, setInvalidReason] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const strength = getPasswordStrength(password);

  /**
   * Create a Supabase anon client. detectSessionInUrl is intentionally false —
   * we parse and exchange the URL token ourselves so there is no async race.
   */
  function getClient(): SupabaseClient {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            persistSession: false,
            detectSessionInUrl: false, // We handle URL parsing manually
            autoRefreshToken: false,
          },
        }
      );
    }
    return supabaseRef.current;
  }

  useEffect(() => {
    const supabase = getClient();

    const searchParams = new URLSearchParams(window.location.search);
    const hashParams  = new URLSearchParams(
      window.location.hash.length > 1
        ? window.location.hash.substring(1)
        : ""
    );

    // Extract every possible token location
    const tokenHash    = searchParams.get("token_hash");
    const urlType      = searchParams.get("type") ?? hashParams.get("type");
    const code         = searchParams.get("code");
    const accessToken  = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token") ?? "";

    let cancelled = false;

    // 8-second safety timeout — if none of the flows succeed, show error
    const timeout = setTimeout(() => {
      if (!cancelled) {
        cancelled = true;
        setInvalidReason("The verification request timed out. Please request a new link.");
        setPhase("invalid");
      }
    }, 8000);

    async function initSession() {
      // ── Flow 1: token_hash (modern Supabase recovery / invite) ──────────────
      // URL: /admin/setup-password?token_hash=XXXXX&type=recovery
      // This is the DEFAULT format for modern Supabase Auth projects.
      // The previous code never handled this, which caused all fresh links to fail.
      if (tokenHash && urlType) {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: urlType as "recovery" | "invite" | "signup",
        });

        if (cancelled) return;
        clearTimeout(timeout);
        cancelled = true;

        if (error || !data.session) {
          setInvalidReason(
            error?.message?.toLowerCase().includes("expired")
              ? "This link has expired. Please request a new one — links are valid for 1 hour."
              : "This link is invalid or has already been used. Please request a new one."
          );
          setPhase("invalid");
          return;
        }

        setUserEmail(data.session.user.email ?? "");
        setPhase("form");
        return;
      }

      // ── Flow 2: PKCE code exchange ───────────────────────────────────────────
      // URL: /admin/setup-password?code=XXXXX
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (cancelled) return;
        clearTimeout(timeout);
        cancelled = true;

        if (error || !data.session) {
          setInvalidReason(
            "This link is invalid or has already been used. Please request a new one."
          );
          setPhase("invalid");
          return;
        }

        setUserEmail(data.session.user.email ?? "");
        setPhase("form");
        return;
      }

      // ── Flow 3: Hash / implicit ──────────────────────────────────────────────
      // URL: /admin/setup-password#access_token=AT&refresh_token=RT&type=recovery
      if (
        accessToken &&
        (urlType === "recovery" || urlType === "invite" || urlType === "signup")
      ) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (cancelled) return;
        clearTimeout(timeout);
        cancelled = true;

        if (error || !data.session) {
          setInvalidReason(
            error?.message?.toLowerCase().includes("expired")
              ? "This link has expired. Please request a new one — links are valid for 1 hour."
              : "This link is invalid or has already been used. Please request a new one."
          );
          setPhase("invalid");
          return;
        }

        setUserEmail(data.session.user.email ?? "");
        setPhase("form");
        return;
      }

      // ── No recognisable token in URL ─────────────────────────────────────────
      if (!cancelled) {
        clearTimeout(timeout);
        cancelled = true;
        setInvalidReason(
          "No valid recovery token was found in this link. Please request a new password reset."
        );
        setPhase("invalid");
      }
    }

    initSession();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

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
      const supabase = getClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      // Auto sign-in: exchange the new credentials for our wt_admin_session cookie
      if (userEmail) {
        const loginRes = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, password }),
        });

        if (loginRes.ok) {
          setPhase("success");
          setTimeout(() => router.replace("/admin"), 1800);
          return;
        }
      }

      // Fallback: password saved, auto-login failed — go to login page
      setPhase("success");
      setTimeout(() => router.replace("/admin/login?setup=1"), 1800);
    } catch (err) {
      setPhase("form");
      setErrorMsg(
        (err as Error).message ?? "Failed to set password. Please try again."
      );
    }
  }

  const meetsLength    = password.length >= 12;
  const meetsUppercase = /[A-Z]/.test(password);
  const meetsNumber    = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirm;
  const canSubmit      = meetsLength && meetsUppercase && meetsNumber && passwordsMatch && phase !== "submitting";

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
          {/* Verifying */}
          {phase === "verifying" && (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  border: "2px solid rgba(196,144,42,0.3)",
                  borderTopColor: "#C4902A",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  marginBottom: "12px",
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p
                style={{
                  color: "rgba(245,237,216,0.4)",
                  fontFamily: "var(--font-garamond, serif)",
                  fontSize: "13px",
                }}
              >
                Verifying your link…
              </p>
            </div>
          )}

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

          {/* Password form */}
          {(phase === "form" || phase === "submitting") && (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              {userEmail && (
                <p
                  style={{
                    color: "rgba(245,237,216,0.35)",
                    fontFamily: "var(--font-garamond, serif)",
                    fontSize: "12px",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Setting password for{" "}
                  <span style={{ color: "rgba(245,237,216,0.6)" }}>{userEmail}</span>
                </p>
              )}

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
                    style={{ ...INPUT_STYLE, paddingRight: "44px" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.6)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "rgba(196,144,42,0.3)"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
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
                    style={{ ...INPUT_STYLE, paddingRight: "44px" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.6)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "rgba(196,144,42,0.3)"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
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
                      color: met
                        ? "#16a34a"
                        : "rgba(245,237,216,0.25)",
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
