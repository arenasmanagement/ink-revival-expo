"use client";

import { ScrollworkDivider } from "@/components/ui/OrnamentalDivider";

export default function EmailSignup() {
  return (
    <section className="bg-parchment-texture pt-6 sm:pt-8 pb-14 sm:pb-20 px-4 relative overflow-hidden">
      {/* Background stars decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        {["15% 20%", "85% 15%", "10% 80%", "90% 75%", "50% 10%"].map((pos) => (
          <span
            key={pos}
            className="absolute text-5xl"
            style={{ top: pos.split(" ")[1], left: pos.split(" ")[0] }}
          >
            ★
          </span>
        ))}
      </div>

      <div className="max-w-xl mx-auto text-center relative z-10">
        <ScrollworkDivider className="mb-10 sm:mb-12" />
        {/* Eyebrow */}
        <p
          className="text-crimson text-xs tracking-[0.3em] uppercase mb-3"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          ★ Don&rsquo;t Miss a Thing ★
        </p>

        <h2
          className="text-ink text-3xl sm:text-4xl mb-3"
          style={{ fontFamily: "var(--font-rye, serif)" }}
        >
          Stay Updated
        </h2>

        <div className="divider-ink mx-auto mb-5" style={{ width: "80px" }} />

        <p
          className="text-ink/70 text-lg mb-8 leading-relaxed"
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          Get artist announcements, ticket updates, schedules, contests, and convention news
          delivered to your inbox.
        </p>

        {/* Email signup coming soon */}
        <div className="border-2 border-gold/30 bg-cream/60 py-8 px-6">
          <p className="text-3xl mb-3">✦</p>
          <p
            className="text-ink text-xl mb-2"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            Email List Coming Soon
          </p>
          <p
            className="text-ink/60 text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            Our email list will be available shortly. In the meantime, follow us on social media
            or call <a href="tel:731-513-4271" className="text-crimson hover:text-crimson/80 transition-colors">731-513-4271</a> to stay connected.
          </p>
        </div>
      </div>
    </section>
  );
}
