import type { Metadata } from "next";
import SponsorForm from "@/components/registration/SponsorForm";

export const metadata: Metadata = {
  title: "Sponsorship | West TN Tattoo and Art Festival",
  description:
    "Sponsor the West TN Tattoo and Art Festival — March 12–14, 2027. Booth, Basic, and VIP sponsorship packages available. Get your brand in front of thousands.",
};

const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:  0.95,
};

const PACKAGES = [
  { name: "Booth Sponsor",   price: "$50",    perks: ["10×10 booth space", "Name in program", "Social media mention"] },
  { name: "Basic Sponsor",   price: "$500",   perks: ["Logo on banner", "Name in program", "Social media feature", "Sponsor badge"] },
  { name: "VIP Sponsor",     price: "$1,000", perks: ["Premium placement", "Logo on all materials", "Social media campaign", "VIP badges (4)", "Stage mention"], highlight: true },
];

export default function SponsorsPage() {
  return (
    <div style={{ backgroundColor: "#1A1008", minHeight: "100vh" }}>
      {/* Header */}
      <section className="py-16 md:py-20" style={{ borderBottom: "1px solid rgba(200,144,48,0.3)", textAlign: "center" }}>
        <div className="container-festival max-w-3xl mx-auto px-4">
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C89030", marginBottom: "1rem" }}>
            Participate · Sponsors
          </p>
          <h1 style={{ ...DISPLAY, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#F5EDD8", marginBottom: "1.5rem" }}>
            Sponsorship Packages
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(245,237,216,0.55)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Put your brand in front of thousands of tattoo enthusiasts, artists, and festival-goers across West Tennessee.
          </p>
        </div>
      </section>

      {/* Package comparison */}
      <section className="py-14">
        <div className="container-festival max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                style={{
                  backgroundColor: "#0E0804",
                  border: `2px solid ${pkg.highlight ? "#C89030" : "rgba(245,237,216,0.1)"}`,
                  padding: "1.75rem",
                  position: "relative",
                }}
              >
                {pkg.highlight && (
                  <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#C89030", color: "#0E0804", fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 14px", whiteSpace: "nowrap" }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ ...DISPLAY, fontSize: "1.8rem", color: pkg.highlight ? "#C89030" : "#F5EDD8", marginBottom: "0.5rem" }}>{pkg.name}</h3>
                <div style={{ ...DISPLAY, fontSize: "2.5rem", color: "#E07830", marginBottom: "1.25rem" }}>{pkg.price}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {pkg.perks.map((perk) => (
                    <li key={perk} style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(245,237,216,0.65)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#3D8878", fontSize: "0.55rem" }}>●</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Form */}
          <SponsorForm />
        </div>
      </section>
    </div>
  );
}
