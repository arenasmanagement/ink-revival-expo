"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => { if (r.ok) router.replace(redirectTo); })
      .catch(() => {});
  }, [router, redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace(redirectTo);
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Incorrect password. Please try again.");
        setPassword("");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0f0a05" }}>
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-8">
          <p style={{ color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "8px" }}>
            ★ Organizer Portal ★
          </p>
          <h1 style={{ color: "#F5EDD8", fontFamily: "var(--font-rye, serif)", fontSize: "22px", lineHeight: 1.3, margin: 0 }}>
            West TN Tattoo<br />and Art Festival
          </h1>
          <p style={{ color: "rgba(245,237,216,0.4)", fontFamily: "var(--font-special-elite, monospace)", fontSize: "11px", letterSpacing: "0.2em", marginTop: "6px" }}>
            2027 Admin Panel
          </p>
        </div>

        {/* Login card */}
        <div style={{ background: "#1a120a", border: "1px solid rgba(196,144,42,0.25)", borderRadius: "4px", padding: "32px" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ display: "block", color: "rgba(245,237,216,0.5)", fontSize: "11px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                autoComplete="current-password"
                style={{
                  width: "100%",
                  background: "rgba(245,237,216,0.06)",
                  border: "1px solid rgba(196,144,42,0.3)",
                  color: "#F5EDD8",
                  padding: "12px 14px",
                  fontSize: "14px",
                  fontFamily: "var(--font-special-elite, monospace)",
                  letterSpacing: "0.15em",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.6)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.3)"; }}
              />
            </div>

            {error && (
              <p style={{ color: "#dc2626", fontSize: "13px", fontFamily: "var(--font-garamond, serif)", margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: "100%",
                padding: "13px",
                background: loading || !password ? "rgba(196,144,42,0.4)" : "#C4902A",
                color: "#0f0a05",
                fontFamily: "var(--font-special-elite, monospace)",
                fontSize: "12px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                border: "none",
                cursor: loading || !password ? "not-allowed" : "pointer",
                fontWeight: "bold",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p style={{ color: "rgba(245,237,216,0.2)", fontSize: "11px", fontFamily: "var(--font-garamond, serif)", textAlign: "center", marginTop: "24px", marginBottom: 0 }}>
            Forgot your password? Contact your developer to reset the admin password in Vercel.
          </p>
        </div>

        <p style={{ color: "rgba(245,237,216,0.15)", fontSize: "10px", fontFamily: "var(--font-special-elite, monospace)", textAlign: "center", marginTop: "24px", letterSpacing: "0.1em" }}>
          PRIVATE — FOR AUTHORIZED ORGANIZERS ONLY
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a05" }}>
        <p style={{ color: "rgba(245,237,216,0.4)", fontFamily: "monospace", fontSize: "13px" }}>Loading…</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
