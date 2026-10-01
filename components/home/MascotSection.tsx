/* ── Mascot Section ──────────────────────────────────────────────────────────
   SECTION 5 — Cream background. Personality moment.
   The frog "lives" in the site — handmade, authentic, character.
   ─────────────────────────────────────────────────────────────────────────── */
import Image from "next/image";

export default function MascotSection() {
  return (
    <section
      style={{ backgroundColor: "#F5EDD8", color: "#1A1008" }}
      aria-label="Festival Mascot — The Spirit of the Festival"
    >
      <div className="container-festival py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Mascot image ── */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div
              className="relative"
              style={{ maxWidth: "420px", width: "100%" }}
            >
              {/* Decorative circle behind the frog */}
              <div
                aria-hidden="true"
                style={{
                  position:        "absolute",
                  inset:           "-12px",
                  borderRadius:    "50%",
                  border:          "2px solid rgba(61,136,120,0.18)",
                  pointerEvents:   "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position:        "absolute",
                  inset:           "-28px",
                  borderRadius:    "50%",
                  border:          "1px solid rgba(61,136,120,0.08)",
                  pointerEvents:   "none",
                }}
              />

              <Image
                src="/frog-tattoo-art.png"
                alt="The West TN Ink Revival Expo mascot — a hand-drawn teal frog in orange pants and red suspenders, holding a paintbrush in one hand and a tattoo machine in the other, with a panther tattoo on his chest and a boater hat"
                width={420}
                height={630}
                className="mascot-float relative"
                style={{
                  objectFit: "contain",
                  filter:    "drop-shadow(0 8px 32px rgba(61,136,120,0.3)) drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
                  zIndex:    2,
                }}
              />
            </div>
          </div>

          {/* ── Copy column ── */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            {/* Eyebrow */}
            <p className="eyebrow eyebrow-ink-dim mb-2">
              Spirit of the Festival
            </p>

            {/* Headline */}
            <h2
              style={{
                fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
                fontSize:      "clamp(2.8rem, 6vw, 5rem)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                lineHeight:    0.88,
                color:         "#1A1008",
                marginBottom:  "0.5em",
              }}
            >
              Meet the<br />
              <span style={{ color: "#3D8878" }}>Mascot</span>
            </h2>

            {/* Teal accent line */}
            <div
              style={{
                height:       "2.5px",
                width:        "50px",
                background:   "#3D8878",
                marginBottom: "1.25rem",
                marginLeft:   "auto",
                marginRight:  "auto",
              }}
              className="lg:mx-0"
              aria-hidden="true"
            />

            <p
              style={{
                fontFamily:   "var(--font-garamond, serif)",
                fontSize:     "clamp(1.05rem, 1.4vw, 1.15rem)",
                lineHeight:   1.75,
                color:        "rgba(26,16,8,0.7)",
                marginBottom: "1em",
              }}
            >
              Every great festival has a spirit. Ours is this frog — teal green, hand-drawn,
              with a panther tattoo on his chest, a paintbrush in one hand, and a tattoo machine
              in the other. He&apos;s got both worlds covered, and now it&apos;s time to bring
              the whole swamp out for the show.
            </p>

            <p
              style={{
                fontFamily: "var(--font-garamond, serif)",
                fontSize:   "clamp(0.95rem, 1.25vw, 1.05rem)",
                lineHeight: 1.7,
                color:      "rgba(26,16,8,0.5)",
                fontStyle:  "italic",
              }}
            >
              The mascot was drawn by hand — the same handmade spirit that makes a tattoo
              convention in West Tennessee something worth driving to.
            </p>

            {/* Decorative teal dot ornament */}
            <div
              className="flex items-center gap-3 mt-8"
              style={{
                justifyContent: "center",
              }}
            >
              <div className="lg:justify-start flex items-center gap-3">
                {[0.9, 1, 0.9].map((opacity, i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    style={{
                      width:           i === 1 ? "8px" : "5px",
                      height:          i === 1 ? "8px" : "5px",
                      borderRadius:    "50%",
                      backgroundColor: "#3D8878",
                      opacity,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
