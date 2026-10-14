"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";
  const setupDone = searchParams.get("setup") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => { if (r.ok) router.replace(redirectTo); })
      .catch(() => {});
  }, [router, redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      if (res.ok) {
        router.replace(redirectTo);
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Invalid email or password. Please try again.");
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
          {setupDone && (
            <div style={{ background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: "3px", padding: "10px 14px", marginBottom: "20px" }}>
              <p style={{ color: "#16a34a", fontFamily: "var(--font-special-elite, monospace)", fontSize: "12px", letterSpacing: "0.05em", margin: 0 }}>
                ✓ Password created — please sign in below.
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                style={{ display: "block", color: "rgba(245,237,216,0.5)", fontSize: "10px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
                autoComplete="email"
                required
                style={INPUT_STYLE}
                onFocus={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.6)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(196,144,42,0.3)"; }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                style={{ display: "block", color: "rgba(245,237,216,0.5)", fontSize: "10px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                style={INPUT_STYLE}
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
              disabled={loading || !email || !password}
              style={{
                width: "100%",
                padding: "13px",
                background: loading || !email || !password ? "rgba(196,144,42,0.4)" : "#C4902A",
                color: "#0f0a05",
                fontFamily: "var(--font-special-elite, monospace)",
                fontSize: "12px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                border: "none",
                cursor: loading || !email || !password ? "not-allowed" : "pointer",
                fontWeight: "bold",
                transition: "all 0.2s",
                borderRadius: "2px",
                marginTop: "4px",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Forgot password */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link
              href="/admin/login/reset"
              style={{
                color: "rgba(245,237,216,0.3)",
                fontSize: "11px",
                fontFamily: "var(--font-special-elite, monospace)",
                letterSpacing: "0.1em",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(196,144,42,0.7)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,237,216,0.3)"; }}
            >
              Forgot Password?
            </Link>
          </div>
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
