/* ── Festival Experiences Grid ──────────────────────────────────────────────
   SECTION 3 — Deep ink background.
   "What's there" — seven categories of what makes this festival.
   ─────────────────────────────────────────────────────────────────────────── */
import Link from "next/link";

const EXPERIENCES = [
  {
    title:       "Tattoo Artists",
    description: "35 booths. American Traditional, Blackwork, Realism, Neo-Trad, and more. Get tattooed by some of the best artists in the region.",
    icon:        "🪡",
    color:       "#E07830",
    href:        "/artists",
    cta:         "Meet the Artists",
  },
  {
    title:       "Fine Art",
    description: "Original paintings, prints, and handmade art from regional creators. The art world and the tattoo world in one place.",
    icon:        "🖼",
    color:       "#C89030",
    href:        "/vendors",
    cta:         null,
  },
  {
    title:       "Competitions",
    description: "Tattoo competitions judged by fellow artists. Best of Show, Best Traditional, Best Realism, Best Color, and more.",
    icon:        "🏆",
    color:       "#CC3578",
    href:        "/competitions",
    cta:         "See Categories",
  },
  {
    title:       "Classic Car Show",
    description: "75 vehicles competing for trophies. Every class — muscle, custom, classic American iron. A show unto itself.",
    icon:        "🚗",
    color:       "#3D8878",
    href:        "/car-show",
    cta:         "Enter Your Vehicle",
  },
  {
    title:       "Vendors",
    description: "35 vendor spaces. Apparel, jewelry, collectibles, tattoo merch, lifestyle brands, and unique handmade goods.",
    icon:        "🛍",
    color:       "#E07830",
    href:        "/vendors",
    cta:         "Apply for a Booth",
  },
  {
    title:       "Food Trucks",
    description: "10 food truck spots. Three days of good food, cold drinks, and festival energy at the Carroll County Fairgrounds.",
    icon:        "🌮",
    color:       "#C89030",
    href:        "/vendors#food-trucks",
    cta:         "Food Truck Spaces",
  },
  {
    title:       "Entertainment",
    description: "Live music, demonstrations, and the kind of atmosphere that only happens when a whole community shows up for something.",
    icon:        "🎶",
    color:       "#4EA898",
    href:        "/event-info",
    cta:         null,
  },
];

export default function ExperiencesGrid() {
  return (
    <section
      style={{ backgroundColor: "#1A1008" }}
      aria-label="Festival Experiences"
    >
      <div className="container-festival py-16 sm:py-20 lg:py-24">

        {/* Eyebrow */}
        <p className="eyebrow eyebrow-cream-dim text-center mb-2">
          What&apos;s There
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
          Three Days of<br />
          <span style={{ color: "#E07830" }}>Pure Festival</span>
        </h2>

        {/* Sub-copy */}
        <p
          className="text-center max-w-xl mx-auto mb-14"
          style={{
            fontFamily: "var(--font-garamond, serif)",
            fontSize:   "clamp(1rem, 1.4vw, 1.1rem)",
            lineHeight: 1.7,
            color:      "rgba(245,237,216,0.55)",
            fontStyle:  "italic",
          }}
        >
          Ink, art, cars, food, and live music — all under one fairground, all three days.
        </p>

        {/* 7-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EXPERIENCES.map((exp, i) => (
            <div
              key={exp.title}
              className="flex flex-col"
              style={{
                backgroundColor: "#201408",
                borderTop:       `3px solid ${exp.color}`,
                padding:         "1.5rem",
                /* Make the 7th card span full width on the last row in 4-col,
                   or behave naturally in smaller breakpoints */
                ...(i === 6 ? { gridColumn: "span 1" } : {}),
              }}
            >
              <div
                style={{
                  fontSize:     "1.75rem",
                  marginBottom: "0.75rem",
                  lineHeight:   1,
                }}
                aria-hidden="true"
              >
                {exp.icon}
              </div>

              <h3
                style={{
                  fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
                  fontSize:      "1.35rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color:         exp.color,
                  marginBottom:  "0.5rem",
                  lineHeight:    1,
                }}
              >
                {exp.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-garamond, serif)",
                  fontSize:   "0.95rem",
                  lineHeight: 1.65,
                  color:      "rgba(245,237,216,0.55)",
                  flex:       1,
                  marginBottom: exp.cta ? "1rem" : 0,
                }}
              >
                {exp.description}
              </p>

              {exp.cta && (
                <Link
                  href={exp.href}
                  className="transition-opacity duration-150 hover:opacity-80"
                  style={{
                    fontFamily:    "var(--font-special-elite, monospace)",
                    fontSize:      "0.58rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color:         exp.color,
                    display:       "inline-flex",
                    alignItems:    "center",
                    gap:           "4px",
                    marginTop:     "auto",
                  }}
                >
                  {exp.cta} →
                </Link>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
