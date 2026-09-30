import type { Metadata } from "next";
import ArtistApplicationForm from "@/components/registration/ArtistApplicationForm";

export const metadata: Metadata = {
  title: "Tattoo Artist Application | West TN Tattoo and Art Festival",
  description:
    "Apply for a tattoo artist booth at the West TN Tattoo and Art Festival — March 12–14, 2027 in Huntingdon, Tennessee. 10×10 and 10×20 booths available.",
};

const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:  0.95,
};

export default function ArtistApplicationPage() {
  return (
    <div style={{ backgroundColor: "#1A1008", minHeight: "100vh" }}>
      {/* Header */}
      <section
        className="py-16 md:py-20"
        style={{ borderBottom: "1px solid rgba(224,120,48,0.2)", textAlign: "center" }}
      >
        <div className="container-festival max-w-3xl mx-auto px-4">
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#E07830", marginBottom: "1rem" }}>
            Participate · Tattoo Artists
          </p>
          <h1 style={{ ...DISPLAY, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#F5EDD8", marginBottom: "1.5rem" }}>
            Artist Application
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(245,237,216,0.55)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 1rem" }}>
            All applications are reviewed by the festival team. Booth fees are collected only after your application is approved.
            We&apos;ll contact you at the email you provide within 5–7 business days.
          </p>
          {/* How-it-works */}
          <div className="flex items-center justify-center gap-4 flex-wrap mt-6">
            {["Submit Application", "Application Review", "Approval + Payment Link"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#E07830" }}>{i + 1}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(245,237,216,0.5)" }}>{s}</span>
                </div>
                {i < 2 && <span style={{ color: "rgba(245,237,216,0.2)" }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-14">
        <ArtistApplicationForm />
      </section>
    </div>
  );
}
