/* ── Event Information Section ───────────────────────────────────────────────
   SECTION 7 — Cream background. Clean, practical info.
   Location, dates, produced by. The "when and where."
   ─────────────────────────────────────────────────────────────────────────── */
import Link from "next/link";
import { EVENT } from "@/lib/eventData";

export default function EventInfoSection() {
  return (
    <section
      style={{ backgroundColor: "#EDDFBC", color: "#1A1008" }}
      aria-label="Event Information"
    >
      <div className="container-festival py-16 sm:py-20 lg:py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left: event details ── */}
          <div>
            {/* Eyebrow */}
            <p className="eyebrow eyebrow-ink-dim mb-2">Plan Your Visit</p>

            {/* Headline */}
            <h2
              style={{
                fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
                fontSize:      "clamp(2.6rem, 5.5vw, 4.5rem)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                lineHeight:    0.88,
                color:         "#1A1008",
                marginBottom:  "1rem",
              }}
            >
              When &amp; <span style={{ color: "#E07830" }}>Where</span>
            </h2>

            <div
              style={{
                height:       "2.5px",
                width:        "50px",
                background:   "#E07830",
                marginBottom: "1.5rem",
              }}
              aria-hidden="true"
            />

            {/* Detail rows */}
            <dl className="space-y-5">
              {[
                {
                  label: "Dates",
                  value: EVENT.dates.display,
                  color: "#E07830",
                },
                {
                  label: "Venue",
                  value: EVENT.venue.name,
                  color: "#3D8878",
                },
                {
                  label: "Address",
                  value: `${EVENT.venue.address}, ${EVENT.venue.city}, ${EVENT.venue.state} ${EVENT.venue.zip}`,
                  color: "#1A1008",
                },
                {
                  label: "Phone",
                  value: EVENT.contact.phone,
                  isPhone: true,
                  color: "#3D8878",
                },
              ].map((row) => (
                <div key={row.label}>
                  <dt
                    style={{
                      fontFamily:    "var(--font-special-elite, monospace)",
                      fontSize:      "0.55rem",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color:         "rgba(26,16,8,0.4)",
                      marginBottom:  "3px",
                    }}
                  >
                    {row.label}
                  </dt>
                  <dd>
                    {row.isPhone ? (
                      <a
                        href={`tel:${row.value}`}
                        style={{
                          fontFamily: "var(--font-garamond, serif)",
                          fontSize:   "1.05rem",
                          color:      row.color,
                          fontWeight: 600,
                        }}
                        className="hover:opacity-75 transition-opacity"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span
                        style={{
                          fontFamily: "var(--font-garamond, serif)",
                          fontSize:   "1.05rem",
                          color:      row.color,
                          fontWeight: 600,
                        }}
                      >
                        {row.value}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href="/event-info"
              className="inline-flex items-center gap-2 mt-8 transition-opacity hover:opacity-75"
              style={{
                fontFamily:    "var(--font-special-elite, monospace)",
                fontSize:      "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color:         "#E07830",
              }}
            >
              Full Event Info →
            </Link>
          </div>

          {/* ── Right: map callout + directions ── */}
          <div>
            {/* Static map placeholder */}
            <div
              style={{
                backgroundColor: "rgba(26,16,8,0.06)",
                border:          "1px solid rgba(26,16,8,0.12)",
                aspectRatio:     "16 / 9",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                marginBottom:    "1.25rem",
                overflow:        "hidden",
                position:        "relative",
              }}
            >
              {/* Embedded Google Maps iframe */}
              <iframe
                title="Carroll County TN Fairgrounds — West TN Tattoo and Art Festival"
                src="https://maps.google.com/maps?q=201+Fairgrounds+Road,+Huntingdon,+TN+38344&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", inset: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <a
              href={`https://maps.google.com/maps?q=${encodeURIComponent(
                "201 Fairgrounds Road, Huntingdon, TN 38344"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-75"
              style={{
                fontFamily:    "var(--font-special-elite, monospace)",
                fontSize:      "0.58rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color:         "rgba(26,16,8,0.5)",
              }}
            >
              Open in Google Maps →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
