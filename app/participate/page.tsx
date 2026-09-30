import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Participate | West TN Tattoo and Art Festival",
  description:
    "Apply to be a tattoo artist, vendor, food truck, or sponsor at the West TN Tattoo and Art Festival — March 12–14, 2027 in Huntingdon, Tennessee.",
};

const CARDS = [
  {
    href:        "/participate/artists",
    emoji:       "🎨",
    title:       "Tattoo Artists",
    subtitle:    "Application → Approval → Payment",
    desc:        "Apply for a 10×10 or 10×20 booth. All applications are reviewed. Booth fee collected after approval.",
    pricing:     "From $150 (10×10)",
    cta:         "Apply Now",
    color:       "#E07830",
    available:   true,
  },
  {
    href:        "/participate/vendors",
    emoji:       "🛍️",
    title:       "Vendors",
    subtitle:    "Direct Registration",
    desc:        "Reserve your vendor booth and pay online. Art, jewelry, tattoo aftercare, festival goods, and more.",
    pricing:     "From $150 (10×10)",
    cta:         "Register & Pay",
    color:       "#3D8878",
    available:   true,
  },
  {
    href:        "/participate/food-truck",
    emoji:       "🚚",
    title:       "Food Trucks",
    subtitle:    "Application → Approval → Payment",
    desc:        "Apply for a food truck space. Applications reviewed individually. Space fee collected after approval.",
    pricing:     "$250 / space",
    cta:         "Apply Now",
    color:       "#E07830",
    available:   true,
  },
  {
    href:        "/participate/sponsors",
    emoji:       "⭐",
    title:       "Sponsors",
    subtitle:    "Direct Registration",
    desc:        "Booth sponsorship, basic, or VIP packages. Get visibility in front of thousands of festival-goers.",
    pricing:     "From $50 (booth)",
    cta:         "Become a Sponsor",
    color:       "#C89030",
    available:   true,
  },
  {
    href:        "/participate/car-show",
    emoji:       "🏎️",
    title:       "Car Show",
    subtitle:    "Direct Registration",
    desc:        "Enter your custom, classic, or show vehicle. Limited to 75 vehicles. Open judging — all makes & models welcome.",
    pricing:     "$25 / vehicle",
    cta:         "Enter Car Show",
    color:       "#3D8878",
    available:   true,
  },
  {
    href:        "/participate/competitions",
    emoji:       "🏆",
    title:       "Competitions",
    subtitle:    "Coming Soon",
    desc:        "Tattoo competitions and art contests. Categories being finalized — check back soon for registration details.",
    pricing:     "$25 / category",
    cta:         "Coming Soon",
    color:       "#5A4E3C",
    available:   false,
  },
];

const EYEBROW: React.CSSProperties = {
  fontFamily:    "var(--font-body, system-ui, sans-serif)",
  fontSize:      "0.65rem",
  fontWeight:    600,
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  color:         "#E07830",
};

const DISPLAY: React.CSSProperties = {
  fontFamily:    "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:    0.95,
};

export default function ParticipatePage() {
  return (
    <div style={{ backgroundColor: "#1A1008", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section
        className="py-20 md:py-28 text-center"
        style={{ borderBottom: "1px solid rgba(224,120,48,0.2)" }}
      >
        <div className="container-festival max-w-3xl mx-auto px-4">
          <p style={EYEBROW} className="mb-4">West TN Tattoo &amp; Art Festival 2027</p>
          <h1
            style={{ ...DISPLAY, fontSize: "clamp(3.5rem, 8vw, 6.5rem)", color: "#F5EDD8" }}
            className="mb-6"
          >
            Participate
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: "rgba(245,237,216,0.65)", lineHeight: 1.7 }}>
            March 12–14, 2027 · Carroll County Fairgrounds · Huntingdon, Tennessee<br />
            Select your participation type below to apply or register.
          </p>
        </div>
      </section>

      {/* ── Cards grid ── */}
      <section className="py-16 md:py-20">
        <div className="container-festival max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CARDS.map((card) => (
              <div
                key={card.href}
                style={{
                  backgroundColor: "#0E0804",
                  border:          `1px solid ${card.available ? "rgba(224,120,48,0.25)" : "rgba(245,237,216,0.08)"}`,
                  opacity:         card.available ? 1 : 0.6,
                  display:         "flex",
                  flexDirection:   "column",
                }}
              >
                <div className="p-6 flex-1 flex flex-col">
                  {/* Icon + label */}
                  <div className="flex items-center justify-between mb-4">
                    <span style={{ fontSize: "2rem" }}>{card.emoji}</span>
                    <span
                      style={{
                        fontFamily:    "var(--font-body, system-ui, sans-serif)",
                        fontSize:      "0.6rem",
                        fontWeight:    600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color:         card.available ? card.color : "rgba(245,237,216,0.3)",
                        border:        `1px solid ${card.available ? card.color : "rgba(245,237,216,0.15)"}`,
                        padding:       "3px 8px",
                      }}
                    >
                      {card.subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      ...DISPLAY,
                      fontSize: "2rem",
                      color:    card.available ? "#F5EDD8" : "rgba(245,237,216,0.45)",
                    }}
                    className="mb-2"
                  >
                    {card.title}
                  </h2>

                  {/* Price */}
                  <p
                    style={{
                      fontFamily: "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
                      fontSize:   "1.1rem",
                      letterSpacing: "0.05em",
                      color:      card.available ? card.color : "rgba(245,237,216,0.25)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {card.pricing}
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-body, system-ui, sans-serif)",
                      fontSize:   "0.9rem",
                      color:      "rgba(245,237,216,0.55)",
                      lineHeight: 1.6,
                      flexGrow:   1,
                    }}
                    className="mb-6"
                  >
                    {card.desc}
                  </p>

                  {/* CTA */}
                  {card.available ? (
                    <Link
                      href={card.href}
                      style={{
                        display:         "block",
                        textAlign:       "center",
                        backgroundColor: card.color,
                        color:           "#0E0804",
                        fontFamily:      "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
                        fontSize:        "1.1rem",
                        letterSpacing:   "0.08em",
                        padding:         "0.75rem 1rem",
                        transition:      "opacity 0.15s ease",
                      }}
                      className="hover:opacity-85 active:scale-95 transition-transform"
                    >
                      {card.cta}
                    </Link>
                  ) : (
                    <div
                      style={{
                        display:    "block",
                        textAlign:  "center",
                        border:     "1px solid rgba(245,237,216,0.15)",
                        color:      "rgba(245,237,216,0.3)",
                        fontFamily: "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
                        fontSize:   "1.1rem",
                        letterSpacing: "0.08em",
                        padding:    "0.75rem 1rem",
                      }}
                    >
                      {card.cta}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── General Admission tickets CTA ── */}
      <section
        className="py-14"
        style={{ backgroundColor: "#0E0804", borderTop: "2px solid #E07830" }}
      >
        <div className="container-festival max-w-3xl mx-auto px-4 text-center">
          <h2
            style={{ ...DISPLAY, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#E07830" }}
            className="mb-3"
          >
            Just want to attend?
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "rgba(245,237,216,0.6)", marginBottom: "1.5rem" }}>
            General admission tickets are available. Friday $15 · Saturday $20 · Sunday $15 · Weekend Pass $40.
            Children 12 &amp; under are FREE.
          </p>
          <Link
            href="/tickets"
            style={{
              display:         "inline-block",
              backgroundColor: "#E07830",
              color:           "#0E0804",
              fontFamily:      "var(--font-display, Impact, sans-serif)",
              fontSize:        "1.3rem",
              letterSpacing:   "0.08em",
              padding:         "0.9rem 2.5rem",
            }}
            className="hover:opacity-85 transition-opacity"
          >
            Get Tickets
          </Link>
        </div>
      </section>

      {/* ── Questions ── */}
      <section className="py-12">
        <div className="container-festival max-w-2xl mx-auto px-4 text-center">
          <p style={{ fontFamily: "var(--font-body)", color: "rgba(245,237,216,0.45)", fontSize: "0.9rem" }}>
            Questions about participating?{" "}
            <Link
              href="/contact"
              style={{ color: "#3D8878", textDecoration: "underline" }}
            >
              Contact us
            </Link>
            {" "}— we&apos;re happy to help.
          </p>
        </div>
      </section>
    </div>
  );
}
