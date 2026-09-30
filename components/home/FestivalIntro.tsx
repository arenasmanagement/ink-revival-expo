/* ── Festival Introduction Section ──────────────────────────────────────────
   SECTION 2 — Cream / warm paper background.
   What this festival IS. First breath after the hero.
   ─────────────────────────────────────────────────────────────────────────── */
import { CAPACITY } from "@/lib/eventData";

export default function FestivalIntro() {
  const stats = [
    { value: CAPACITY.tattooArtistBooths, label: "Tattoo\nArtists", color: "#E07830" },
    { value: CAPACITY.vendorBooths,       label: "Vendor\nSpaces",  color: "#3D8878" },
    { value: CAPACITY.carShowVehicles,    label: "Car Show\nSlots",  color: "#C89030" },
    { value: CAPACITY.foodTrucks,         label: "Food Truck\nSpots", color: "#CC3578" },
  ];

  return (
    <section
      style={{ backgroundColor: "#F5EDD8", color: "#1A1008" }}
      aria-label="About the Festival"
    >
      <div className="container-festival py-16 sm:py-20 lg:py-24">

        {/* Eyebrow */}
        <p
          className="eyebrow eyebrow-ink-dim text-center mb-2"
        >
          About the Event
        </p>

        {/* Headline */}
        <h2
          className="text-center mb-8"
          style={{
            fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
            fontSize:      "clamp(2.6rem, 6.5vw, 5.5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            lineHeight:    0.88,
            color:         "#1A1008",
          }}
        >
          West Tennessee&apos;s<br />
          <span style={{ color: "#E07830" }}>First Annual</span><br />
          Tattoo &amp; Art Festival
        </h2>

        {/* Intro copy */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p
            style={{
              fontFamily:  "var(--font-garamond, serif)",
              fontSize:    "clamp(1.05rem, 1.5vw, 1.2rem)",
              lineHeight:  1.75,
              color:       "rgba(26,16,8,0.75)",
              marginBottom: "1em",
            }}
          >
            Three days of tattoo artistry, original art, live competitions, a classic car show,
            craft vendors, food trucks, and entertainment — at the Carroll County TN Fairgrounds
            in Huntingdon. March 12–14, 2027.
          </p>
          <p
            style={{
              fontFamily: "var(--font-garamond, serif)",
              fontSize:   "clamp(0.95rem, 1.3vw, 1.05rem)",
              lineHeight: 1.7,
              color:      "rgba(26,16,8,0.5)",
              fontStyle:  "italic",
            }}
          >
            Produced by Studio 45 Tattoos — bringing ink culture, handmade art,
            and West Tennessee community together for the first time.
          </p>
        </div>

        {/* Divider */}
        <div className="divider-ink mx-auto max-w-xs mb-14" style={{ opacity: 0.2 }} />

        {/* Capacity stats — large typographic elements */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center"
              style={{
                padding:       "1.5rem 1rem",
                borderTop:     `3px solid ${s.color}`,
                backgroundColor: "rgba(26,16,8,0.04)",
              }}
            >
              <div
                className="stat-number"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily:    "var(--font-special-elite, monospace)",
                  fontSize:      "0.55rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color:         "rgba(26,16,8,0.5)",
                  marginTop:     "0.4em",
                  lineHeight:    1.5,
                  whiteSpace:    "pre-line",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
