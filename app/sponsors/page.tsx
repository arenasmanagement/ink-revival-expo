import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import SponsorApplicationForm from "@/components/registration/SponsorApplicationForm";

export const metadata: Metadata = {
  title: "Sponsorship Packages — Basic $500 · VIP $1,000 | West TN Tattoo and Art Festival",
  description: "Sponsor West TN Tattoo and Art Festival 2027 in Huntingdon, Tennessee. Basic sponsorship $500 and VIP sponsorship $1,000. Place your brand in front of tattoo enthusiasts, artists, and the West Tennessee community at West Tennessee's first tattoo convention.",
  alternates: { canonical: "https://www.westtninkrevival.com/sponsors" },
  openGraph: {
    title: "Sponsorship Packages — West TN Tattoo and Art Festival 2027",
    description: "Basic $500 · VIP $1,000. Sponsor West Tennessee's first tattoo convention and reach a passionate regional audience. March 12–14, 2027, Huntingdon, TN.",
    url: "https://www.westtninkrevival.com/sponsors",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.westtninkrevival.com" },
    { "@type": "ListItem", position: 2, name: "Sponsorships", item: "https://www.westtninkrevival.com/sponsors" },
  ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Header */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <SectionHeading eyebrow="Partnerships" title="Sponsorship Opportunities" subtitle="Partner with West TN Tattoo and Art Festival and place your business in front of a passionate regional audience." light as="h1" className="max-w-4xl mx-auto" />
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

        {/* ── Native Sponsor Application Form ── */}
        <section id="apply" className="max-w-2xl mx-auto mb-12">
          <SectionHeading eyebrow="Get Started" title="Apply as a Sponsor" className="mb-8" />
          <div
            style={{
              backgroundColor: "#1A1008",
              padding:         "2rem 1.5rem",
              borderTop:       "3px solid #C89030",
            }}
          >
            <SponsorApplicationForm />
          </div>
          <p className="text-ink/40 text-xs text-center italic mt-4" style={{ fontFamily: "var(--font-garamond, serif)" }}>
            Final benefits, specifications, deadlines, and logo-placement details are subject to confirmation in the sponsorship agreement.
          </p>
        </section>

        {/* Custom partnerships */}
        <section className="text-center bg-ink-texture p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
          <p className="text-gold/70 text-xs tracking-[0.3em] uppercase mb-3" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>★ Custom Partnerships ★</p>
          <h2 className="text-cream text-2xl sm:text-3xl mb-3" style={{ fontFamily: "var(--font-rye, serif)" }}>Looking for Something Bigger?</h2>
          <p className="text-cream/60 text-base mb-6 max-w-lg mx-auto" style={{ fontFamily: "var(--font-garamond, serif)" }}>
            Contact the West TN Tattoo and Art Festival team to discuss additional opportunities tailored to your business.
          </p>
          <a href="/contact" className="inline-block px-8 py-3 border-2 border-gold text-gold uppercase tracking-widest text-sm hover:bg-gold hover:text-ink transition-all active:scale-95" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
}
