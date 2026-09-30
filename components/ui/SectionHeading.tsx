/* ── SectionHeading ──────────────────────────────────────────────────────────
   Shared heading component used across inner pages.
   Supports light (on dark backgrounds) and dark (on cream backgrounds).
   ─────────────────────────────────────────────────────────────────────────── */

interface SectionHeadingProps {
  eyebrow?:   string;
  title:      string;
  subtitle?:  string;
  light?:     boolean;   /* true = light text on dark bg */
  as?:        "h1" | "h2" | "h3";
  className?: string;
  accentColor?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  as: Tag = "h2",
  className = "",
  accentColor,
}: SectionHeadingProps) {
  const textColor   = light ? "#F5EDD8" : "#1A1008";
  const dimColor    = light ? "rgba(245,237,216,0.45)" : "rgba(26,16,8,0.45)";
  const accentLine  = accentColor ?? (light ? "#E07830" : "#E07830");

  return (
    <div className={`text-center ${className}`}>
      {eyebrow && (
        <p
          style={{
            fontFamily:    "var(--font-special-elite, monospace)",
            fontSize:      "0.58rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color:         dimColor,
            marginBottom:  "0.5em",
          }}
        >
          {eyebrow}
        </p>
      )}

      <Tag
        style={{
          fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
          fontSize:      "clamp(2.2rem, 5vw, 4rem)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          lineHeight:    0.9,
          color:         textColor,
          marginBottom:  subtitle ? "0.3em" : 0,
        }}
      >
        {title}
      </Tag>

      {subtitle && (
        <>
          {/* Accent line */}
          <div
            style={{
              height:       "2px",
              width:        "40px",
              background:   accentLine,
              margin:       "0.7em auto 0.7em",
            }}
            aria-hidden="true"
          />
          <p
            style={{
              fontFamily: "var(--font-garamond, serif)",
              fontSize:   "clamp(1rem, 1.4vw, 1.1rem)",
              lineHeight: 1.7,
              color:      dimColor,
              maxWidth:   "600px",
              margin:     "0 auto",
            }}
          >
            {subtitle}
          </p>
        </>
      )}
    </div>
  );
}
