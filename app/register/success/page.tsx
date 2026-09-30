import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registration Confirmed | West TN Tattoo and Art Festival",
  robots: { index: false },
};

const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:  0.95,
};

export default function RegistrationSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string; session_id?: string };
}) {
  const orderId = searchParams.orderId ?? "";

  return (
    <div style={{ backgroundColor: "#1A1008", minHeight: "100vh" }}>
      <section className="py-24 md:py-36 text-center">
        <div className="container-festival max-w-xl mx-auto px-4">
          {/* Icon */}
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>✅</div>

          <h1 style={{ ...DISPLAY, fontSize: "clamp(3rem, 8vw, 5.5rem)", color: "#3D8878", marginBottom: "1rem" }}>
            You&apos;re Registered!
          </h1>

          <div style={{ width: "60px", height: "3px", backgroundColor: "#3D8878", margin: "0 auto 2rem" }} />

          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", color: "rgba(245,237,216,0.7)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Payment confirmed. A confirmation email has been sent to you with your registration details.
          </p>

          {orderId && (
            <div style={{ border: "2px solid rgba(61,136,120,0.4)", padding: "1rem 1.5rem", marginBottom: "2rem", backgroundColor: "rgba(61,136,120,0.06)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,136,120,0.7)", marginBottom: "4px" }}>
                Order Reference
              </p>
              <p style={{ ...DISPLAY, fontSize: "1.8rem", color: "#F5EDD8" }}>{orderId}</p>
            </div>
          )}

          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(245,237,216,0.45)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            March 12–14, 2027 · Carroll County TN Fairgrounds · Huntingdon, Tennessee
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              style={{ display: "inline-block", backgroundColor: "#E07830", color: "#0E0804", fontFamily: "var(--font-display, Impact, sans-serif)", fontSize: "1.1rem", letterSpacing: "0.08em", padding: "0.75rem 1.75rem" }}
              className="hover:opacity-85 transition-opacity"
            >
              Back to Home
            </Link>
            <Link
              href="/participate"
              style={{ display: "inline-block", border: "1px solid rgba(245,237,216,0.2)", color: "rgba(245,237,216,0.55)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.75rem 1.5rem" }}
              className="hover:border-cream/50 hover:text-cream transition-all"
            >
              More Registration Options
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
