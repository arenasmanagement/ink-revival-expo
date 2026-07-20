import Link from "next/link";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  external?: boolean;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "bg-crimson text-cream border-2 border-crimson hover:bg-crimson-dark hover:border-crimson-dark active:scale-95",
  secondary:
    "bg-ink text-cream border-2 border-ink hover:bg-ink-light active:scale-95",
  outline:
    "bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-cream active:scale-95",
  ghost:
    "bg-transparent text-cream border-2 border-cream/50 hover:border-cream hover:bg-cream/10 active:scale-95",
  gold:
    "bg-gold text-ink border-2 border-gold hover:bg-gold-light hover:border-gold-light active:scale-95",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "px-5 py-2 text-xs tracking-widest",
  md: "px-7 py-3 text-sm tracking-widest",
  lg: "px-9 py-4 text-base tracking-widest",
};

export default function Button({
  href,
  onClick,
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled = false,
  type = "button",
  external = false,
}: ButtonProps) {
  const baseClass = `
    inline-flex items-center justify-center gap-2 uppercase font-medium
    transition-all duration-200 cursor-pointer select-none
    ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]}
    ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
    ${className}
  `;

  const fontStyle = { fontFamily: "var(--font-special-elite, monospace)" };

  if (href) {
    return external ? (
      <a href={href} className={baseClass} style={fontStyle} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <Link href={href} className={baseClass} style={fontStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      style={fontStyle}
    >
      {children}
    </button>
  );
}
