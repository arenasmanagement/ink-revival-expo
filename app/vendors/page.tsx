import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { PRICING, REGISTRATION_URLS } from "@/lib/eventData";

const { vendorRegistrationUrl } = REGISTRATION_URLS;

export const metadata: Metadata = {
  title: "Vendor Booths & Food Truck Spaces | West TN Ink Revival Expo 2027",
  description: "Reserve a vendor booth at West TN Ink Revival Expo — March 12–14, 2027 in Huntingdon, Tennessee. 10×10 booth $250, double booth $400, food truck space $200. Showcase your business at West Tennessee's first tattoo convention.",
  alternates: { canonical: "https://www.westtninkrevival.com/vendors" },
  openGraph: {
    title: "Vendor Booths & Food Truck Spaces — West TN Ink Revival Expo 2027",
    description: "10×10 vendor booth $250 · Double booth $400 · Food truck space $200. March 12–14, 2027 at the Carroll County TN Fairgrounds, Huntingdon, Tennessee.",
    url: "https://www.westtninkrevival.com/vendors",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.westtninkrevival.com" },
    { "@type": "ListItem", position: 2, name: "Vendors & Food Trucks", item: "https://www.westtninkrevival.com/vendors" },
  ],
};

const VENDOR_TYPES = [
  "Apparel & Clothing",
  "Artwork & Prints",
  "Jewelry & Accessories",
  "Handmade & Crafts",
  "Collectibles",
  "Tattoo-Related Merchandise",
  "Lifestyle Brands",
  "Local Businesses",
];

export default function VendorsPage() {
  return (
    <div className="bg-parchment-light-texture min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Page header ── */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <SectionHeading
          eyebrow="Participate"
          title="Vendors & Food Trucks"
          subtitle="Showcase your business to the West Tennessee tattoo community."
          light
          as="h1"
          className="max-w-4xl mx-auto"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">

        {/* ── Vendor Booths ── */}
        <section className="mb-10 sm:mb-14">
          <SectionHeading eyebrow="Vendor Booths" title="Reserve Your Space" className="mb-10" />

          <div className="grid sm:grid-cols-2 gap-6 mb-8">

            {/* 10×10 */}
            <div className="border-2 border-gold/40 bg-cream/70 p-6 sm:p-8 relative card-vintage">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gold" />
              <p
                className="text-crimson text-xs tracking-[0.25em] uppercase mb-2"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                ★ Standard ★
              </p>
              <h2
                className="text-ink text-2xl mb-1"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                10×10 Booth
              </h2>
              <p
                className="text-gold text-3xl font-bold mb-4"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                ${PRICING.vendor.single.price}
              </p>
              <div className="divider-ink mb-4" style={{ opacity: 0.2 }} />
              <ul className="space-y-2 mb-6">
                {[
                  "10×10 ft of dedicated vendor space",
                  "Three-day event (March 12–14, 2027)",
                  "Access to visitors from across West Tennessee and the surrounding region",
                  "Included in event vendor directory",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-ink/70 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                    <span className="text-crimson text-xs mt-0.5 flex-shrink-0">★</span> {b}
                  </li>
                ))}
              </ul>
              <a
                href={vendorRegistrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 bg-gold text-ink uppercase tracking-wider text-sm hover:bg-gold-light transition-all active:scale-95"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                Register as a Vendor
              </a>
            </div>

            {/* Double */}
            <div className="border-2 border-crimson/40 bg-cream/70 p-6 sm:p-8 relative card-vintage">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-crimson" />
              <p
                className="text-gold text-xs tracking-[0.25em] uppercase mb-2"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                ★ Double Space ★
              </p>
              <h2
                className="text-ink text-2xl mb-1"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                Double Booth
              </h2>
              <p
                className="text-crimson text-3xl font-bold mb-4"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                ${PRICING.vendor.double.price}
              </p>
              <div className="divider-ink mb-4" style={{ opacity: 0.2 }} />
              <ul className="space-y-2 mb-6">
                {[
                  "Double the standard vendor space",
                  "Ideal for larger setups or multiple products",
                  "Three-day event (March 12–14, 2027)",
                  "Premium vendor directory listing",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-ink/70 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                    <span className="text-crimson text-xs mt-0.5 flex-shrink-0">★</span> {b}
                  </li>
                ))}
              </ul>
              <a
                href={vendorRegistrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 bg-crimson text-cream uppercase tracking-wider text-sm hover:bg-crimson-dark transition-all active:scale-95"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                Register as a Vendor
              </a>
            </div>
          </div>

          {/* Jotform note */}
          <p
            className="text-center text-ink/45 text-xs italic mb-8"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            Registration is completed through our official Jotform. Submissions are subject to review and confirmation.
          </p>

          {/* Who can vendor */}
          <div className="bg-cream/50 border border-ink/12 p-6">
            <h3
              className="text-ink text-lg mb-4"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              Who Can Vendor?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {VENDOR_TYPES.map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="text-crimson text-xs">★</span>
                  <span className="text-ink/70 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Food Trucks ── */}
        <section id="food-trucks" className="mb-10 sm:mb-14">
          <SectionHeading eyebrow="Food & Beverage" title="Food Truck Spaces" className="mb-10" />

          <div className="grid sm:grid-cols-2 gap-8 items-start">

            {/* Pricing card */}
            <div className="border-2 border-rust/40 bg-cream/70 p-6 sm:p-8 relative card-vintage">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-rust" />
              <p
                className="text-rust text-xs tracking-[0.25em] uppercase mb-2"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                ★ Food Truck Space ★
              </p>
              <p
                className="text-rust text-3xl font-bold mb-4"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                ${PRICING.foodTruck.space.price}
              </p>
              <div className="divider-ink mb-4" style={{ opacity: 0.2 }} />
              <ul className="space-y-2 mb-6">
                {[
                  "Dedicated food truck space for all 3 days",
                  "Connect with attendees throughout the event",
                  "High-traffic fairgrounds location",
                  "Support the tattoo & creative community",
                  "Opportunity to be part of a major new regional event",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-ink/70 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                    <span className="text-rust text-xs mt-0.5 flex-shrink-0">★</span> {b}
                  </li>
                ))}
              </ul>

              {/* Coming Soon state */}
              <div className="text-center border border-rust/30 bg-rust/5 py-3 px-4 mb-3">
                <p
                  className="text-rust/80 text-xs tracking-wider uppercase"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  ★ Application Coming Soon ★
                </p>
              </div>
              <Link
                href="/contact"
                className="block text-center py-3 border-2 border-rust text-rust uppercase tracking-wider text-sm hover:bg-rust hover:text-cream transition-all active:scale-95"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                Contact the Expo
              </Link>
              <p
                className="text-ink/40 text-xs italic text-center mt-3"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                Official food truck application details will be announced soon.
              </p>
            </div>

            {/* Info text */}
            <div>
              <p
                className="text-ink/70 text-lg leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                Serve hungry attendees and supporters across three packed days at the Carroll County TN Fairgrounds in Huntingdon.
              </p>
              <p
                className="text-ink/60 text-base leading-relaxed"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                West TN Ink Revival Expo is a community-centered event drawing tattoo enthusiasts, artists, families,
                and locals from across West Tennessee. Food truck spaces are limited — contact us early to express interest.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
