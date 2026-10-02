"use client";

import { useState } from "react";

/* ── Email Signup Section ────────────────────────────────────────────────────
   SECTION 8 — Deep teal background. Energy close.
   Stay in the loop. Simple, bold, one-field.
   ─────────────────────────────────────────────────────────────────────────── */
export default function EmailSignup() {
  const [email,     setEmail]     = useState("");
  const [status,    setStatus]    = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg,  setErrorMsg]  = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (res.ok && json.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please check your connection and try again.");
    }
  }

  return (
    <section
      style={{ backgroundColor: "#0E2820" }}
      aria-label="Email Newsletter Signup"
    >
      <div className="container-festival py-16 sm:py-20">

        <div className="max-w-2xl mx-auto text-center">

          {/* Frog silhouette — small mascot cameo */}
          <div
            aria-hidden="true"
            style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.55 }}
          >
            🐸
          </div>

          {/* Eyebrow */}
          <p className="eyebrow eyebrow-teal mb-2">
            Stay in the Loop
          </p>

          {/* Headline */}
          <h2
            style={{
              fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
              fontSize:      "clamp(2.4rem, 5.5vw, 4.5rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              lineHeight:    0.9,
              color:         "#F5EDD8",
              marginBottom:  "0.6em",
            }}
          >
            First to Know<br />
            <span style={{ color: "#3D8878" }}>First to Come</span>
          </h2>

          <p
            style={{
              fontFamily:   "var(--font-garamond, serif)",
              fontSize:     "clamp(1rem, 1.4vw, 1.1rem)",
              lineHeight:   1.7,
              color:        "rgba(245,237,216,0.5)",
              fontStyle:    "italic",
              marginBottom: "2rem",
            }}
          >
            Artist announcements, ticket sale dates, vendor updates —
            everything West TN Tattoo &amp; Art Festival, straight to your inbox.
          </p>

          {status === "success" ? (
            <div
              style={{
                backgroundColor: "rgba(61,136,120,0.15)",
                border:          "1px solid rgba(61,136,120,0.4)",
                padding:         "1.5rem 2rem",
                color:           "#4EA898",
                fontFamily:      "var(--font-bebas-neue, Impact, sans-serif)",
                fontSize:        "1.3rem",
                letterSpacing:   "0.06em",
                textTransform:   "uppercase",
              }}
            >
              ✓ You&apos;re on the list — see you at the festival.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div
                className="flex flex-col sm:flex-row gap-2"
                style={{ maxWidth: "480px", margin: "0 auto" }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="field-ink flex-1"
                  style={{
                    backgroundColor: "rgba(14,8,4,0.5)",
                    borderColor:     "rgba(61,136,120,0.3)",
                    fontSize:        "1rem",
                  }}
                  required
                  aria-label="Email address"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-teal flex-shrink-0 transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ fontSize: "1.1rem", minWidth: "120px" }}
                >
                  {status === "loading" ? "..." : "Subscribe"}
                </button>
              </div>

              {errorMsg && (
                <p
                  style={{
                    fontFamily:  "var(--font-garamond, serif)",
                    fontStyle:   "italic",
                    fontSize:    "0.85rem",
                    color:       "#CC3578",
                    marginTop:   "0.75rem",
                    textAlign:   "center",
                  }}
                >
                  {errorMsg}
                </p>
              )}
            </form>
          )}

          <p
            style={{
              fontFamily:   "var(--font-garamond, serif)",
              fontStyle:    "italic",
              fontSize:     "0.75rem",
              color:        "rgba(245,237,216,0.2)",
              marginTop:    "1.25rem",
            }}
          >
            No spam. Unsubscribe any time.
          </p>
        </div>
      </div>
    </section>
  );
}
