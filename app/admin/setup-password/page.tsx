"use client";

/**
 * /admin/setup-password
 *
 * Dedicated password-setup page for new admins arriving from an invite
 * or password-reset email. Handles both Supabase auth flows:
 *   • Hash-based (implicit): #access_token=TOKEN&type=invite|recovery
 *   • PKCE code-based:       ?code=CODE  (defensive fallback)
 *
 * After the password is saved, the user is automatically signed into the
 * admin session (wt_admin_session cookie set) and redirected to /admin.
 *
 * SECURITY: Public page — must be in middleware passthrough list.
 * Uses only the Supabase anon key (no service role).
 */

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";

type Phase =
  | "verifying"   // Parsing URL token
  | "form"        // Ready for password input
  | "submitting"  // Saving password + auto-login
  | "success"     // Done — redirecting
  | "invalid";    // Token missing/expired

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

export default function SetupPasswordPage() {
  const router = useRouter();
  const supabaseRef = useRef<SupabaseClient | null>(null);

  const [phase, setPhase] = useState<Phase>("verifying");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Lazily create — and reuse — a single anon client per page load.
  // persistSession: false keeps tokens out of localStorage while still
  // allowing detectSessionInUrl to parse the hash on initialisation.
  function getClient(): SupabaseClient {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, detectSessionInUrl: true } }
      );
    }
    return supabaseRef.current;
  }

  useEffect(() => {
    const supabase = getClient();
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    async function initSession() {
      // --- PKCE code flow (defensive) ---
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error || !data.session) {
          setPhase("invalid");
          return;
        }
        setUserEmail(data.session.user.email ?? "");
        setPhase("form");
        return;
      }

      // --- Hash / implicit flow (invite + recovery) ---
      if (
        hash.includes("access_token") &&
        (hash.includes("type=recovery") ||
          hash.includes("type=invite") ||
          hash.includes("type=signup"))
      ) {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          setPhase("invalid");
          return;
        }
        setUserEmail(session.user.email ?? "");
        setPhase("form");
        return;
      }

      // No token found in URL
      setPhase("invalid");
    }

    initSession();
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

      // Update the password (session is still alive in this client instance)
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      // Auto sign-in: exchange the new password for our wt_admin_session cookie
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

      // Fallback: password set, but auto-login failed — send to login page
      setPhase("success");
      setTimeout(() => router.replace("/admin/login?setup=1"), 1800);
    } catch (err) {
      setPhase("form");
      setErrorMsg(
        (err as Error).message ?? "Failed to set password. Please try again."
      );
    }
  }

  const isSubmitDisabled =
    phase === "submitting" || !password || !confirm || password !== confirm;

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
            {phase === "success" ? "Password Created" : "Set Your Password"}
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
            <p
              style={{
                color: "rgba(245,237,216,0.4)",
                fontFamily: "var(--font-garamond, serif)",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              Verifying your link…
            </p>
          )}

          {/* Invalid / expired */}
          {phase === "invalid" && (
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#dc2626",
                  fontFamily: "var(--font-garamond, serif)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  marginBottom: "20px",
                }}
              >
                This link is invalid or has expired. Please request a new one.
              </p>
              <Link
                href="/admin/forgot-password"
                style={{
                  color: "rgba(196,144,42,0.7)",
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                }}
              >
                Request a new link →
              </Link>
            </div>
          )}

          {/* Success */}
          {phase === "success" && (
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#16a34a",
                  fontSize: "28px",
                  marginBottom: "12px",
                }}
              >
                ✓
              </p>
              <p
                style={{
                  color: "#F5EDD8",
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Password created successfully!
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

          {/* Password form (form + submitting states) */}
          {(phase === "form" || phase === "submitting") && (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
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
                  <span style={{ color: "rgba(245,237,216,0.55)" }}>
                    {userEmail}
                  </span>
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
                <input
                  id="setup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 12 chars, 1 uppercase, 1 number"
                  autoFocus
                  required
                  minLength={12}
                  style={INPUT_STYLE}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(196,144,42,0.6)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(196,144,42,0.3)";
                  }}
                />
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
                <input
                  id="setup-confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
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

              {/* Mismatch hint */}
              {confirm && password !== confirm && (
                <p
                  style={{
                    color: "rgba(220,38,38,0.8)",
                    fontFamily: "var(--font-garamond, serif)",
                    fontSize: "12px",
                    margin: 0,
                  }}
                >
                  Passwords do not match.
                </p>
              )}

              {/* Requirements hint */}
              <p
                style={{
                  color: "rgba(245,237,216,0.25)",
                  fontFamily: "var(--font-garamond, serif)",
                  fontSize: "11px",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                At least 12 characters · one uppercase letter · one number
              </p>

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
                disabled={isSubmitDisabled}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: isSubmitDisabled
                    ? "rgba(196,144,42,0.4)"
                    : "#C4902A",
                  color: "#0f0a05",
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "12px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: isSubmitDisabled ? "not-allowed" : "pointer",
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
