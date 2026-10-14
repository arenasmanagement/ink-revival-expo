"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Public anon client — used only to exchange the recovery token for a session
// and update the password. Service role is NOT used here.
function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

export default function NewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase sends the recovery token in the URL fragment (#access_token=...&type=recovery)
  // We need to exchange it for a session client-side before we can update the password.
  useEffect(() => {
    const supabase = getAnonClient();
    const hash = window.location.hash;
    if (!hash.includes("type=recovery") && !hash.includes("type=invite")) {
      setErrorMsg("Invalid or expired reset link. Please request a new one.");
      return;
    }
    // Supabase automatically parses the hash fragment when you call getSession()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      } else {
        setErrorMsg("Invalid or expired reset link. Please request a new one.");
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setStatus("loading");
    try {
      const supabase = getAnonClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setStatus("success");
      // Redirect to login after short delay
      setTimeout(() => router.replace("/admin/login"), 2500);
    } catch (err) {
      setStatus("error");
      setErrorMsg((err as Error).message ?? "Failed to update password. Please try again.");
    }
  }

  const inputStyle: React.CSSProperties = {
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0f0a05" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p style={{ color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "8px" }}>
            ★ Organizer Portal ★
          </p>
          <h1 style={{ color: "#F5EDD8", fontFamily: "var(--font-rye, serif)", fontSize: "22px", lineHeight: 1.3, margin: 0 }}>
            {status === "success" ? "Password Updated" : "Set New Password"}
          </h1>
        </div>

        <div style={{ background: "#1a120a", border: "1px solid rgba(196,144,42,0.25)", borderRadius: "4px", padding: "32px" }}>
          {status === "success" ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#16a34a", fontSize: "28px", marginBottom: "12px" }}>✓</p>
              <p style={{ color: "#F5EDD8", fontFamily: "var(--font-special-elite, monospace)", fontSize: "13px", letterSpacing: "0.05em", marginBottom: "8px" }}>
                Password updated successfully!
              </p>
              <p style={{ color: "rgba(245,237,216,0.4)", fontFamily: "var(--font-garamond, serif)", fontSize: "13px" }}>
                Redirecting to sign in…
              </p>
            </div>
          ) : errorMsg && !sessionReady ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#dc2626", fontFamily: "var(--font-garamond, serif)", fontSize: "13px", lineHeight: 1.6, marginBottom: "16px" }}>
                {errorMsg}
              </p>
              <a
                href="/admin/login/reset"
                style={{ color: "rgba(196,144,42,0.7)", fontFamily: "var(--font-special-elite, monospace)", fontSize: "11px", letterSpacing: "0.1em", textDecoration: "none" }}
              >
                Request a new reset link →
              </a>
            </div>
          ) : !sessionReady ? (
            <p style={{ color: "rgba(245,237,216,0.4)", fontFamily: "var(--font-garamond, serif)", fontSize: "13px", textAlign: "center" }}>
              Verifying reset link…
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  htmlFor="new-password"
                  style={{ display: "block", color: "rgba(245,237,216,0.5)", fontSize: "10px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  autoFocus
                  required
                  minLength={8}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.6)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.3)"; }}
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  style={{ display: "block", color: "rgba(245,237,216,0.5)", fontSize: "10px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}
                >
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.6)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.3)"; }}
                />
              </div>

              {errorMsg && (
                <p style={{ color: "#dc2626", fontSize: "13px", fontFamily: "var(--font-garamond, serif)", margin: 0 }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading" || !password || !confirm}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: status === "loading" || !password || !confirm ? "rgba(196,144,42,0.4)" : "#C4902A",
                  color: "#0f0a05",
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "12px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: status === "loading" || !password || !confirm ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  transition: "all 0.2s",
                  borderRadius: "2px",
                }}
              >
                {status === "loading" ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
