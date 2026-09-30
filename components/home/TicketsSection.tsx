/* ── Tickets Section ─────────────────────────────────────────────────────────
   SECTION 4 — Deep teal background. Conversion-focused.
   Clear pricing, clear action. No noise.
   ─────────────────────────────────────────────────────────────────────────── */
import Link from "next/link";
import { ADMISSION, REGISTRATION_URLS } from "@/lib/eventData";

const { ticketsPath } = REGISTRATION_URLS;

export default function TicketsSection() {
  const tickets = [
    { day: "Friday",  date: "March 12",  price: ADMISSION.friday.price,  featured: false },
    { day: "Saturday",date: "March 13",  price: ADMISSION.saturday.price, featured: true  },
    { day: "Sunday",  date: "March 14",  price: ADMISSION.sunday.price,  featured: false },
  ];

  return (
    <section
      style={{ backgroundColor: "#0E2820" }}
      aria-label="Tickets and Admission"
    >
      <div className="container-festival py-16 sm:py-20 lg:py-24">

        {/* Eyebrow */}
        <p className="eyebrow eyebrow-teal text-center mb-2">
          Admission
        </p>

        {/* Headline */}
        <h2
          className="text-center mb-4"
          style={{
            fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
            fontSize:      "clamp(2.6rem, 6vw, 5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            lineHeight:    0.88,
            color:         "#F5EDD8",
          }}
        >
          Get Your <span style={{ color: "#E07830" }}>Tickets</span>
        </h2>

        <p
          className="text-center max-w-md mx-auto mb-12"
          style={{
            fontFamily: "var(--font-garamond, serif)",
            fontSize:   "clamp(1rem, 1.4vw, 1.1rem)",
            lineHeight: 1.7,
            color:      "rgba(245,237,216,0.5)",
            fontStyle:  "italic",
          }}
        >
          Children 12 &amp; under free. Tickets available at the door — online sales coming soon.
        </p>

        {/* Ticket cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          {tickets.map((t) => (
            <div
              key={t.day}
              style={{
                backgroundColor: t.featured ? "#1E5048" : "rgba(30,80,72,0.35)",
                border:          t.featured ? "2px solid #E07830" : "1px solid rgba(61,136,120,0.25)",
                padding:         "1.75rem 1.5rem",
                textAlign:       "center",
                position:        "relative",
              }}
            >
              {t.featured && (
                <div
                  style={{
                    position:        "absolute",
                    top:             "-1px",
                    left:            "50%",
                    transform:       "translateX(-50%)",
                    backgroundColor: "#E07830",
                    color:           "#0E0804",
                    fontFamily:      "var(--font-bebas-neue, Impact, sans-serif)",
                    fontSize:        "0.7rem",
                    letterSpacing:   "0.18em",
                    textTransform:   "uppercase",
                    padding:         "2px 10px",
                  }}
                >
                  Most Popular
                </div>
              )}
              <div
                style={{
                  fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
                  fontSize:      "1.5rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color:         t.featured ? "#E07830" : "rgba(245,237,216,0.75)",
                  lineHeight:    1,
                  marginBottom:  "0.2em",
                }}
              >
                {t.day}
              </div>
              <div
                style={{
                  fontFamily:    "var(--font-special-elite, monospace)",
                  fontSize:      "0.55rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:         "rgba(245,237,216,0.35)",
                  marginBottom:  "1rem",
                }}
              >
                {t.date}
              </div>
              <div
                style={{
                  fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
                  fontSize:      "clamp(3.5rem, 8vw, 5rem)",
                  letterSpacing: "0.02em",
                  lineHeight:    0.85,
                  color:         "#F5EDD8",
                }}
              >
                ${t.price}
              </div>
            </div>
          ))}
        </div>

        {/* Weekend pass callout */}
        <div
          className="max-w-3xl mx-auto mb-12"
          style={{
            backgroundColor: "rgba(224,120,48,0.1)",
            border:          "1px solid rgba(224,120,48,0.3)",
            padding:         "1.25rem 2rem",
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
                fontSize:      "1.5rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:         "#E07830",
                lineHeight:    1,
              }}
            >
              3-Day Weekend Pass
            </div>
            <div
              style={{
                fontFamily:    "var(--font-special-elite, monospace)",
                fontSize:      "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color:         "rgba(245,237,216,0.4)",
                marginTop:     "3px",
              }}
            >
              Friday + Saturday + Sunday — Best Value
            </div>
          </div>
          <div
            style={{
              fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
              fontSize:      "clamp(2.5rem, 5vw, 3.5rem)",
              letterSpacing: "0.02em",
              lineHeight:    0.85,
              color:         "#F5EDD8",
            }}
          >
            ${ADMISSION.weekend.price}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={ticketsPath}
            className="btn-sunset transition-all duration-150 active:scale-95"
            style={{ fontSize: "1.3rem", padding: "0.9rem 2.5rem" }}
          >
            View Ticket Details
          </Link>
          <p
            className="mt-4"
            style={{
              fontFamily: "var(--font-garamond, serif)",
              fontSize:   "0.85rem",
              fontStyle:  "italic",
              color:      "rgba(245,237,216,0.3)",
            }}
          >
            Online ticket sales activate soon — walk-up tickets available at the gate.
          </p>
        </div>

      </div>
    </section>
  );
}
