interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean; // true = cream text on dark bg
  centered?: boolean;
  className?: string;
  as?: "h1" | "h2"; // semantic heading level — use "h1" for the main page heading
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  centered = true,
  className = "",
  as: Tag = "h2",
}: SectionHeadingProps) {
  const textColor = light ? "text-cream" : "text-ink";
  const subColor = light ? "text-cream/70" : "text-ink/70";
  const eyeColor = light ? "text-gold" : "text-crimson";
  const dividerClass = light ? "divider-gold" : "divider-ink";

  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <p
          className={`${eyeColor} text-xs tracking-[0.25em] uppercase mb-2`}
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          ★ {eyebrow} ★
        </p>
      )}
      <Tag
        className={`${textColor} text-3xl sm:text-4xl leading-tight`}
        style={{ fontFamily: "var(--font-rye, 'Rye', serif)" }}
      >
        {title}
      </Tag>
      <div className={`${dividerClass} ${centered ? "mx-auto" : ""} w-32 my-4`} />
      {subtitle && (
        <p
          className={`${subColor} text-lg max-w-2xl ${centered ? "mx-auto" : ""} leading-relaxed`}
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
