import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import { ScrollworkDivider } from "@/components/ui/OrnamentalDivider";
import VendorApplicationForm from "@/components/registration/VendorApplicationForm";
import FoodTruckApplicationForm from "@/components/registration/FoodTruckApplicationForm";
import { PRICING, CAPACITY } from "@/lib/eventData";

export const metadata: Metadata = {
  title: "Vendor Booths & Food Truck Spaces | West TN Tattoo and Art Festival 2027",
  description: `Reserve a vendor booth at West TN Tattoo and Art Festival — March 12–14, 2027 in Huntingdon, Tennessee. ${CAPACITY.vendorBooths} vendor booths and ${CAPACITY.foodTrucks} food truck spaces available. 10×10 booth $150, double booth $300, food truck space $250. Showcase your business at West Tennessee's first tattoo & art festival.`,
  alternates: { canonical: "https://www.westtninkrevival.com/vendors" },
  openGraph: {
    title: "Vendor Booths & Food Truck Spaces — West TN Tattoo and Art Festival 2027",
    description: `${CAPACITY.vendorBooths} vendor booths · ${CAPACITY.foodTrucks} food truck spaces · 10×10 booth $150 · Double booth $300 · Food truck space $250. March 12–14, 2027 at the Carroll County TN Fairgrounds, Huntingdon, Tennessee.`,
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

const VENDOR_CATEGORIES = [
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
          subtitle="Showcase your business to the West Tennessee tattoo and arts community. March 12–14, 2027."
          light
          as="h1"
          className="max-w-4xl mx-auto"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">

        {/* ── Capacity at a glance ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {[
            { value: CAPACITY.vendorBooths, label: "Vendor Booths", color: "text-gold" },
            { value: CAPACITY.foodTrucks,   label: "Food Truck Spaces", color: "text-rust" },
            { value: "3",                   label: "Days",              color: "text-crimson" },
            { value: "1st",                 label: "Annual Event",      color: "text-ink/60" },
          ].map((s) => (
            <div key={s.label} className="text-center border border-gold/25 bg-cream/60 py-4 px-2">
              <p
                className={`${s.color} text-2xl font-bold`}
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                {s.value}
              </p>
              <p
                className="text-ink/50 text-[10px] uppercase tracking-wider mt-0.5"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Vendor Booths section ── */}
        <section className="mb-12 sm:mb-16" id="vendor-booths">
          <SectionHeading eyebrow="Vendor Booths" title="Reserve Your Space" className="mb-8" />

          {/* Pricing quick reference */}
          <div className="grid sm:grid-cols-2 gap-5 mb-8">

            {/* 10×10 */}
            <div className="border-2 border-gold/40 bg-cream/70 p-5 relative card-vintage">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gold" />
              <p
                className="text-crimson text-xs tracking-[0.25em] uppercase mb-1"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                ★ Standard ★
              </p>
              <h2
                className="text-ink text-xl mb-0.5"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                10×10 Booth
              </h2>
              <p
                className="text-gold text-3xl font-bold mb-3"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                ${PRICING.vendor.single.price}
              </p>
              <div className="divider-ink mb-3" style={{ opacity: 0.2 }} />
              <ul className="space-y-1.5">
                {[
                  "10×10 ft dedicated vendor space",
                  "All three days — March 12–14, 2027",
                  "Access to 1,000+ expected attendees",
                  "Listed in the event vendor directory",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-ink/70 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                    <span className="text-crimson text-xs mt-0.5 flex-shrink-0">★</span> {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Double */}
            <div className="border-2 border-crimson/40 bg-cream/70 p-5 relative card-vintage">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-crimson" />
              <p
                className="text-gold text-xs tracking-[0.25em] uppercase mb-1"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                ★ Double Space ★
              </p>
              <h2
                className="text-ink text-xl mb-0.5"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                Double Booth
              </h2>
              <p
                className="text-crimson text-3xl font-bold mb-3"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                ${PRICING.vendor.double.price}
              </p>
              <div className="divider-ink mb-3" style={{ opacity: 0.2 }} />
              <ul className="space-y-1.5">
                {[
                  "10×20 ft of dedicated vendor space",
                  "Ideal for larger setups or multiple lines",
                  "All three days — March 12–14, 2027",
                  "Premium listing in vendor directory",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-ink/70 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                    <span className="text-crimson text-xs mt-0.5 flex-shrink-0">★</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Who can vendor */}
          <div className="bg-cream/50 border border-ink/12 p-6 mb-10">
            <h3
              className="text-ink text-lg mb-4"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              Who Can Vendor?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {VENDOR_CATEGORIES.map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="text-crimson text-xs">★</span>
                  <span className="text-ink/70 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Application Form */}
          <div id="apply-vendor" className="max-w-2xl mx-auto">
            <SectionHeading eyebrow="Apply Now" title="Vendor Application" className="mb-6" />
            <VendorApplicationForm />
          </div>
        </section>

        <ScrollworkDivider className="mb-12 sm:mb-16" />

        {/* ── Food Trucks section ── */}
        <section id="food-trucks" className="mb-10 sm:mb-14">
          <SectionHeading eyebrow="Food & Beverage" title="Food Truck Spaces" className="mb-8" />

          <div className="grid sm:grid-cols-2 gap-8 items-start mb-10">

            {/* Pricing callout */}
            <div className="border-2 border-rust/40 bg-cream/70 p-6 relative card-vintage">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-rust" />
              <p
                className="text-rust text-xs tracking-[0.25em] uppercase mb-1"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                ★ Food Truck Space ★
              </p>
              <p
                className="text-rust text-3xl font-bold mb-3"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                ${PRICING.foodTruck.space.price}
              </p>
              <div className="divider-ink mb-3" style={{ opacity: 0.2 }} />
              <ul className="space-y-1.5">
                {[
                  `Only ${CAPACITY.foodTrucks} spaces — limited availability`,
                  "Dedicated space for all 3 days",
                  "High-traffic fairgrounds location",
                  "Connect with attendees and families",
                  "Part of a major new regional event",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-ink/70 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                    <span className="text-rust text-xs mt-0.5 flex-shrink-0">★</span> {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div>
              <p
                className="text-ink/70 text-lg leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                Serve hungry attendees across three packed days at the Carroll County TN Fairgrounds in Huntingdon.
              </p>
              <p
                className="text-ink/60 text-base leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                West TN Tattoo and Art Festival draws tattoo enthusiasts, artists, families, and locals from across West Tennessee.
                Only {CAPACITY.foodTrucks} food truck spaces are available — apply early to secure yours.
              </p>
              <p
                className="text-ink/50 text-sm italic"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                No payment collected until your space is confirmed.
              </p>
            </div>
          </div>

          {/* Food Truck Application Form */}
          <div id="apply-food-truck" className="max-w-2xl mx-auto">
            <SectionHeading eyebrow="Apply Now" title="Food Truck Application" className="mb-6" />
            <FoodTruckApplicationForm />
          </div>
        </section>

      </div>
    </div>
  );
}
