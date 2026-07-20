import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | West TN Ink Revival Expo",
  description: "The page you were looking for doesn't exist. Head back to the West TN Ink Revival Expo homepage.",
};

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Event Info", href: "/event-info" },
  { label: "Artists", href: "/artists" },
  { label: "Vendors", href: "/vendors" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center"
      style={{ background: "var(--color-ink, #1A1008)" }}
    >
      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg,transparent,#C4902A,transparent)",
        }}
      />

      {/* 404 number */}
      <p
        className="text-[120px] sm:text-[160px] leading-none font-bold mb-0"
        style={{
          fontFamily: "var(--font-rye, serif)",
          color: "rgba(196,144,42,0.15)",
          lineHeight: 0.9,
        }}
      >
        404
      </p>

      {/* Star */}
      <p className="text-gold text-2xl my-4">★</p>

      {/* Heading */}
      <h1
        className="text-cream text-3xl sm:text-4xl mb-4"
        style={{ fontFamily: "var(--font-rye, serif)" }}
      >
        Page Not Found
      </h1>

      {/* Divider */}
      <div
        className="mx-auto mb-6"
        style={{
          width: "80px",
          height: "2px",
          background: "linear-gradient(90deg,transparent,#C4902A,transparent)",
        }}
      />

      {/* Description */}
      <p
        className="text-cream/60 text-base sm:text-lg max-w-md mb-10 leading-relaxed"
        style={{ fontFamily: "var(--font-garamond, serif)" }}
      >
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        Let&rsquo;s get you back to the expo.
      </p>

      {/* Primary CTA */}
      <Link
        href="/"
        className="inline-block mb-8 px-8 py-4 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all duration-200 active:scale-95"
        style={{ fontFamily: "var(--font-special-elite, monospace)" }}
      >
        Back to Homepage
      </Link>

      {/* Quick nav links */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-sm">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-cream/40 hover:text-gold text-sm transition-colors"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
