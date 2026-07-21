import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import { PRICING, REGISTRATION_URLS } from "@/lib/eventData";

const { sponsorRegistrationUrl } = REGISTRATION_URLS;

export const metadata: Metadata = {
  title: "Sponsorships | West TN Ink Revival Expo 2027",
  description: "Sponsor West TN Ink Revival Expo 2027 and place your brand in front of a passionate regional audience.",
  alternates: { canonical: "https://www.westtninkrevival.com/sponsors" },
};

const WHY = [
  { icon: "👥", title: "Reach Your Audience", desc: "Connect with tattoo enthusiasts, artists, vendors, creators, and businesses from across West Tennessee and beyond." },
  { icon: "📱", title: "Online Exposure", desc: "Your brand gains visibility through our social media, promotional materials, and event marketing before, during, and after the event." },
  { icon: "🤝", title: "Community Partnership", desc: "Support the tattoo and art community in West Tennessee and build authentic brand relationships." },
  { icon: "🌐", title: "Network", desc: "Connect with artists, vendors, creators, and businesses from across the region at a growing new annual event." },
];

export default function SponsorsPage() {
  return (
    <div className="bg-parchment-light-texture min-h-screen">
      {/* Header */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <SectionHeading eyebrow="Partnerships" title="Sponsorship Opportunities" subtitle="Partner with West TN Ink Revival Expo and place your business in front of a passionate regional audience." light as="h1" className="max-w-4xl mx-auto" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">

        {/* Why sponsor */}
        <section className="mb-10 sm:mb-14">
          <SectionHeading eyebrow="Why Sponsor" title="Make an Impact" className="mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map((w) => (
              <div key={w.title} className="card-vintage bg-cream/60 border border-ink/12 p-5 text-center">
                <div className="text-3xl mb-3">{w.icon}</div>
                <h3 className="text-ink text-base mb-2" style={{ fontFamily: "var(--font-rye, serif)" }}>{w.title}</h3>
                <p className="text-ink/60 text-sm leading-relaxed" style={{ fontFamily: "var(--font-garamond, serif)" }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Packages */}
        <section className="mb-10 sm:mb-14">
          <SectionHeading eyebrow="Packages" title="Sponsorship Packages" className="mb-10" />
          <div className="grid sm:grid-cols-2 gap-6 mb-6">

            {/* Basic */}
            <div className="border-2 border-ink/20 bg-cream/70 p-6 sm:p-8 relative card-vintage">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gold" />
              <div className="banner-crimson inline-block px-4 py-1 mb-4">
                <span className="text-cream text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>★ Basic ★</span>
              </div>
              <p className="text-ink text-3xl font-bold mb-5" style={{ fontFamily: "var(--font-rye, serif)" }}>${PRICING.sponsorship.basic.price}</p>
              <div className="divider-ink mb-5" style={{ opacity: 0.2 }} />
              <ul className="space-y-3 mb-6">
                {PRICING.sponsorship.basic.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-ink/70 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                    <span className="text-gold text-xs mt-0.5 flex-shrink-0">★</span> {b}
                  </li>
                ))}
              </ul>
              <a
                href={sponsorRegistrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 bg-gold text-ink uppercase tracking-wider text-sm hover:bg-gold-light transition-all active:scale-95"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                Register as a Sponsor
              </a>
            </div>

            {/* VIP */}
            <div className="border-2 border-gold/50 bg-cream/70 p-6 sm:p-8 relative card-vintage" style={{ boxShadow: "0 4px 24px rgba(196,144,42,0.15)" }}>
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-crimson" />
              <div className="banner-crimson inline-block px-4 py-1 mb-4">
                <span className="text-cream text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>★ VIP ★</span>
              </div>
              <p className="text-crimson text-3xl font-bold mb-5" style={{ fontFamily: "var(--font-rye, serif)" }}>${PRICING.sponsorship.vip.price}</p>
              <div className="divider-ink mb-5" style={{ opacity: 0.2 }} />
              <ul className="space-y-3 mb-6">
                {PRICING.sponsorship.vip.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-ink/70 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                    <span className="text-crimson text-xs mt-0.5 flex-shrink-0">★</span> {b}
                  </li>
                ))}
              </ul>
              <a
                href={sponsorRegistrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 bg-crimson text-cream uppercase tracking-wider text-sm hover:bg-crimson-dark transition-all active:scale-95"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                Register as a Sponsor
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center border border-ink/15 bg-cream/40 p-4 max-w-xl mx-auto">
            <p className="text-ink/50 text-sm italic" style={{ fontFamily: "var(--font-garamond, serif)" }}>
              Final benefits, specifications, deadlines, and logo-placement details are subject to confirmation in the sponsorship agreement.
            </p>
          </div>
          <p className="text-center text-ink/45 text-xs italic mt-4" style={{ fontFamily: "var(--font-garamond, serif)" }}>
            Registration is completed through our official Jotform. Submissions are subject to review and confirmation.
          </p>
        </section>

        {/* Custom partnerships */}
        <section className="text-center bg-ink-texture p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
          <p className="text-gold/70 text-xs tracking-[0.3em] uppercase mb-3" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>★ Custom Partnerships ★</p>
          <h2 className="text-cream text-2xl sm:text-3xl mb-3" style={{ fontFamily: "var(--font-rye, serif)" }}>Looking for Something Bigger?</h2>
          <p className="text-cream/60 text-base mb-6 max-w-lg mx-auto" style={{ fontFamily: "var(--font-garamond, serif)" }}>
            Contact the West TN Ink Revival team to discuss additional opportunities tailored to your business.
          </p>
          <a href="tel:731-513-4271" className="inline-block px-8 py-3 border-2 border-gold text-gold uppercase tracking-widest text-sm hover:bg-gold hover:text-ink transition-all active:scale-95" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Call 731-513-4271
          </a>
        </section>
      </div>
    </div>
  );
}
