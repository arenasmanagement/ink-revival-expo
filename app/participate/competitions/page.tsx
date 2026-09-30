import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Competitions | West TN Tattoo and Art Festival",
  description:
    "Tattoo and art competitions at the West TN Tattoo and Art Festival — March 12–14, 2027. Categories being finalized. Registration opening soon.",
};

const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:  0.95,
};

export default function CompetitionsPage() {
  return (
    <div style={{ backgroundColor: "#1A1008", minHeight: "100vh" }}>
      <section className="py-24 md:py-36 text-center">
        <div className="container-festival max-w-2xl mx-auto px-4">
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,237,216,0.35)", marginBottom: "1.5rem" }}>
            Participate · Competitions
          </p>
          <h1 style={{ ...DISPLAY, fontSize: "clamp(3rem, 8vw, 6rem)", color: "#F5EDD8", marginBottom: "1.5rem" }}>
            Competitions
          </h1>
          <div style={{ width: "60px", height: "3px", backgroundColor: "#E07830", margin: "0 auto 2rem" }} />
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", color: "rgba(245,237,216,0.55)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Tattoo competitions and art contests are coming to the West TN Tattoo &amp; Art Festival.
            We&apos;re finalizing categories and judges — registration will open soon.
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(245,237,216,0.35)", marginBottom: "2.5rem" }}>
            Entry fee: $25 per category · March 12–14, 2027
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/participate"
              style={{ display: "inline-block", border: "1px solid rgba(245,237,216,0.2)", color: "rgba(245,237,216,0.55)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.75rem 1.5rem", transition: "all 0.15s ease" }}
              className="hover:border-cream/50 hover:text-cream transition-all"
            >
              ← Back to Participate
            </Link>
            <Link
              href="/#email-signup"
              style={{ display: "inline-block", backgroundColor: "#E07830", color: "#0E0804", fontFamily: "var(--font-display, Impact, sans-serif)", fontSize: "1.1rem", letterSpacing: "0.08em", padding: "0.75rem 1.75rem" }}
              className="hover:opacity-85 transition-opacity"
            >
              Notify Me When Open
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
