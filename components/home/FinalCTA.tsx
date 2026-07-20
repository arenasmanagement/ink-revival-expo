import Link from "next/link";
import Image from "next/image";
import { REGISTRATION_URLS } from "@/lib/eventData";

const { sponsorRegistrationUrl } = REGISTRATION_URLS;

export default function FinalCTA() {
  return (
    <section className="bg-ink-texture py-12 sm:py-16 px-4 relative overflow-hidden">
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />

      {/* Hero artwork watermark — transparent PNG, alpha fades naturally into dark bg */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/hero-trans.png"
          alt=""
          width={1536}
          height={1024}
          quality={75}
          sizes="100vw"
          className="w-full max-w-4xl h-auto"
          style={{
            opacity: 0.08,
            mixBlendMode: "screen",
            filter: "drop-shadow(0 0 0 transparent)",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Star row */}
        <p className="text-gold/50 text-xl tracking-[1em] mb-6">★ ★ ★</p>

        {/* Heading */}
        <div
          className="banner-crimson inline-block px-8 py-4 mb-8"
          style={{ clipPath: "polygon(2% 0%,98% 0%,100% 50%,98% 100%,2% 100%,0% 50%)" }}
        >
          <h2
            className="text-cream leading-tight"
            style={{
              fontFamily: "var(--font-rye, 'Rye', serif)",
              fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
              textShadow: "0 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            Be Part of West Tennessee&rsquo;s<br />Newest Tattoo Tradition
          </h2>
        </div>

        <p
          className="text-cream/60 text-lg mb-10 max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
        >
          March 12–14, 2027 · Carroll County TN Fairgrounds · Huntingdon, Tennessee
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/artists"
            className="px-8 py-4 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all duration-200 active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Apply to Participate
          </Link>
          <a
            href={sponsorRegistrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 border-gold text-gold uppercase tracking-widest text-sm hover:bg-gold hover:text-ink transition-all duration-200 active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Register as a Sponsor
          </a>
          <Link
            href="/contact"
            className="px-8 py-4 border-2 border-cream/30 text-cream/70 uppercase tracking-widest text-sm hover:border-cream hover:text-cream transition-all duration-200 active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Contact the Expo
          </Link>
        </div>

        {/* Star row */}
        <p className="text-gold/30 text-xl tracking-[1em] mt-10">★ ★ ★</p>

        {/* Producer credit */}
        <p
          className="text-cream/25 text-xs tracking-[0.2em] uppercase mt-4"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          Presented by Studio 45 Tattoos · 731-513-4271
        </p>
      </div>
    </section>
  );
}
