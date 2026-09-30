/* ── Participate Section ─────────────────────────────────────────────────────
   SECTION 6 — Deep ink background. Energy. Urgency.
   Capacity numbers as large typographic elements.
   ─────────────────────────────────────────────────────────────────────────── */
import Link from "next/link";
import { CAPACITY, REGISTRATION_URLS } from "@/lib/eventData";

const {
  artistApplicationPath,
  vendorApplicationPath,
  foodTruckApplicationPath,
  carShowApplicationPath,
  sponsorPath,
} = REGISTRATION_URLS;

const SLOTS = [
  {
    number: CAPACITY.tattooArtistBooths,
    label:  "Artist\nBooths",
    color:  "#E07830",
    href:   artistApplicationPath,
    cta:    "Apply as Artist",
    note:   "Approval required · $150/$300 per booth",
  },
  {
    number: CAPACITY.vendorBooths,
    label:  "Vendor\nSpaces",
    color:  "#3D8878",
    href:   vendorApplicationPath,
    cta:    "Reserve a Booth",
    note:   "$150 single · $300 double",
  },
  {
    number: CAPACITY.foodTrucks,
    label:  "Food Truck\nSpots",
    color:  "#C89030",
    href:   foodTruckApplicationPath,
    cta:    "Apply for Space",
    note:   "$250 for all three days",
  },
  {
    number: CAPACITY.carShowVehicles,
    label:  "Car Show\nVehicles",
    color:  "#CC3578",
    href:   carShowApplicationPath,
    cta:    "Register Vehicle",
    note:   "Open to all classes",
  },
];

export default function ParticipateSection() {
  return (
    <section
      style={{ backgroundColor: "#1A1008" }}
      aria-label="Participate in the Festival"
    >
      <div className="container-festival py-16 sm:py-20 lg:py-24">

        {/* Eyebrow */}
        <p className="eyebrow eyebrow-sunset text-center mb-2">
          Limited Spaces
        </p>

        {/* Headline */}
        <h2
          className="text-center mb-5"
          style={{
            fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
            fontSize:      "clamp(2.6rem, 6vw, 5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            lineHeight:    0.88,
            color:         "#F5EDD8",
          }}
        >
          Be Part of<br />
          <span style={{ color: "#E07830" }}>The Festival</span>
        </h2>

        <p
          className="text-center max-w-xl mx-auto mb-16"
          style={{
            fontFamily: "var(--font-garamond, serif)",
            fontSize:   "clamp(1rem, 1.4vw, 1.1rem)",
            lineHeight: 1.7,
            color:      "rgba(245,237,216,0.5)",
            fontStyle:  "italic",
          }}
        >
          Space is limited by design. Every slot that fills is one less available.
          Apply early — this is the first year, and the energy will be real.
        </p>

        {/* Big capacity numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-4" style={{ background: "rgba(245,237,216,0.06)" }}>
          {SLOTS.map((slot) => (
            <div
              key={slot.label}
              className="flex flex-col"
              style={{
                backgroundColor: "#1A1008",
                padding:         "2rem 1.5rem 1.75rem",
                borderTop:       `3px solid ${slot.color}`,
              }}
            >
              {/* Large number */}
              <div
                className="stat-number"
                style={{ color: slot.color, marginBottom: "0.15em" }}
              >
                {slot.number}
              </div>

              {/* Label */}
              <div
                style={{
                  fontFamily:    "var(--font-special-elite, monospace)",
                  fontSize:      "0.55rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color:         "rgba(245,237,216,0.4)",
                  lineHeight:    1.5,
                  whiteSpace:    "pre-line",
                  marginBottom:  "1.25rem",
                  flex:          1,
                }}
              >
                {slot.label}
              </div>

              {/* Note */}
              <div
                style={{
                  fontFamily:    "var(--font-garamond, serif)",
                  fontStyle:     "italic",
                  fontSize:      "0.8rem",
                  color:         "rgba(245,237,216,0.28)",
                  marginBottom:  "1rem",
                  lineHeight:    1.5,
                }}
              >
                {slot.note}
              </div>

              {/* CTA link */}
              <Link
                href={slot.href}
                className="transition-all duration-150 hover:opacity-80 active:scale-95"
                style={{
                  fontFamily:      "var(--font-bebas-neue, Impact, sans-serif)",
                  fontSize:        "1rem",
                  letterSpacing:   "0.08em",
                  textTransform:   "uppercase",
                  backgroundColor: slot.color,
                  color:           "#0E0804",
                  padding:         "0.55rem 1rem",
                  textAlign:       "center",
                  display:         "block",
                  lineHeight:      1,
                }}
              >
                {slot.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Sponsor callout */}
        <div
          style={{
            backgroundColor: "rgba(200,144,48,0.06)",
            border:          "1px solid rgba(200,144,48,0.2)",
            padding:         "1.5rem 2rem",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "space-between",
            flexWrap:        "wrap",
            gap:             "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
                fontSize:      "1.4rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:         "#C89030",
                lineHeight:    1,
                marginBottom:  "4px",
              }}
            >
              Sponsorship Packages Available
            </div>
            <div
              style={{
                fontFamily: "var(--font-garamond, serif)",
                fontStyle:  "italic",
                fontSize:   "0.9rem",
                color:      "rgba(245,237,216,0.38)",
              }}
            >
              Basic $500 · VIP $1,000 — visibility at every touchpoint of the festival.
            </div>
          </div>
          <Link
            href={sponsorPath}
            className="transition-all duration-150 hover:opacity-80 active:scale-95 flex-shrink-0"
            style={{
              fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
              fontSize:      "1rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color:         "#C89030",
              padding:       "0.55rem 1.25rem",
              border:        "1px solid rgba(200,144,48,0.4)",
              display:       "inline-block",
            }}
          >
            Sponsor the Festival
          </Link>
        </div>

      </div>
    </section>
  );
}
