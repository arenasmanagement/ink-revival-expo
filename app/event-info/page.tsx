import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import { ScrollworkDivider } from "@/components/ui/OrnamentalDivider";
import Link from "next/link";
import { EVENT } from "@/lib/eventData";
import VenueMap from "@/components/ui/VenueMap";

export const metadata: Metadata = {
  title: "Event Info — Dates, Venue & Details | West TN Ink Revival Expo",
  description: "West TN Ink Revival Expo details: March 12–14, 2027 at the Carroll County TN Fairgrounds, 201 Fairgrounds Road, Huntingdon, Tennessee. Parking, accessibility, hotels, and everything you need to plan your visit to the West Tennessee tattoo convention.",
  alternates: { canonical: "https://www.westtninkrevival.com/event-info" },
  openGraph: {
    title: "Event Details — West TN Ink Revival Expo 2027, Huntingdon, Tennessee",
    description: "Dates: March 12–14, 2027. Location: Carroll County TN Fairgrounds, 201 Fairgrounds Road, Huntingdon, TN 38344. Plan your visit to West Tennessee's first tattoo convention.",
    url: "https://www.westtninkrevival.com/event-info",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.westtninkrevival.com" },
    { "@type": "ListItem", position: 2, name: "Event Info", item: "https://www.westtninkrevival.com/event-info" },
  ],
};

const INFO_BLOCKS = [
  {
    title: "Event Dates",
    icon: "📅",
    items: [
      { label: "Friday", value: "March 12, 2027" },
      { label: "Saturday", value: "March 13, 2027" },
      { label: "Sunday", value: "March 14, 2027" },
    ],
    note: "Event hours to be announced",
  },
  {
    title: "Venue",
    icon: "📍",
    items: [
      { label: "Location", value: EVENT.venue.name },
      { label: "Address", value: EVENT.venue.address },
      { label: "City", value: `${EVENT.venue.city}, ${EVENT.venue.state} ${EVENT.venue.zip}` },
    ],
  },
  {
    title: "Admission",
    icon: "🎟️",
    items: [
      { label: "Tickets", value: "Coming soon" },
    ],
    note: "Ticket information and pricing will be announced. Join our email list to be notified first.",
  },
  {
    title: "Parking",
    icon: "🚗",
    items: [
      { label: "On-site Parking", value: "Available" },
      { label: "Cost", value: "Details coming soon" },
    ],
  },
  {
    title: "Accessibility",
    icon: "♿",
    items: [
      { label: "ADA Access", value: "Available" },
    ],
    note: "Full accessibility details to be confirmed and posted prior to the event.",
  },
  {
    title: "Age Policy",
    icon: "👶",
    items: [
      { label: "General Admission", value: "Coming soon" },
      { label: "Minors", value: "Policy to be announced" },
    ],
  },
  {
    title: "Hotel & Travel",
    icon: "🏨",
    items: [
      { label: "Recommended Hotels", value: "Coming soon" },
    ],
    note: "We'll share a list of nearby accommodations in Huntingdon and surrounding areas closer to the event.",
  },
  {
    title: "Prohibited Items",
    icon: "🚫",
    items: [
      { label: "Policy", value: "Coming soon" },
    ],
    note: "A full list of permitted and prohibited items will be published prior to the event.",
  },
];

export default function EventInfoPage() {
  return (
    <div className="bg-parchment-light-texture min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Page header */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Details"
            title="Event Information"
            subtitle="Everything you need to know about West TN Ink Revival Expo 2027."
            light
            as="h1"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        {/* Intro */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p
            className="text-ink/75 text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            West TN Ink Revival Expo is a three-day celebration of tattoo artistry, culture, and community
            held at the Carroll County TN Fairgrounds in Huntingdon, Tennessee. This inaugural event is
            presented and produced by Studio 45 Tattoos.
          </p>
        </div>

        {/* Info grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8 sm:mb-10">
          {INFO_BLOCKS.map((block) => (
            <div
              key={block.title}
              className="bg-cream/70 border border-ink/12 p-6"
              style={{ boxShadow: "0 2px 12px rgba(26,16,8,0.07)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{block.icon}</span>
                <h2
                  className="text-ink text-lg"
                  style={{ fontFamily: "var(--font-rye, serif)" }}
                >
                  {block.title}
                </h2>
              </div>
              <div className="divider-ink mb-4" style={{ opacity: 0.2 }} />
              <dl className="space-y-2">
                {block.items.map((item) => (
                  <div key={item.label} className="flex justify-between gap-4">
                    <dt
                      className="text-ink/50 text-xs uppercase tracking-wider flex-shrink-0"
                      style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                    >
                      {item.label}
                    </dt>
                    <dd
                      className="text-ink/80 text-sm text-right"
                      style={{ fontFamily: "var(--font-garamond, serif)" }}
                    >
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {block.note && (
                <p
                  className="text-ink/40 text-xs italic mt-3 border-t border-ink/10 pt-3"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                >
                  {block.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <ScrollworkDivider className="mb-8 sm:mb-10" />

        {/* Venue Map */}
        <div className="mb-10 sm:mb-14">
          <h2
            className="text-center text-ink text-xl mb-2"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            Venue Location
          </h2>
          <p
            className="text-center text-ink/50 text-sm mb-6"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            Carroll County TN Fairgrounds · 201 Fairgrounds Road · Huntingdon, TN 38344
          </p>
          <VenueMap directionsUrl={EVENT.venue.directionsUrl} />
          <div className="text-center mt-5">
            <a
              href={EVENT.venue.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-7 py-2.5 bg-crimson text-cream uppercase tracking-widest text-xs hover:bg-crimson-dark transition-all duration-200 active:scale-95"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Get Directions →
            </a>
          </div>
        </div>

        <ScrollworkDivider className="mb-8 sm:mb-10" />

        {/* Producer */}
        <div className="text-center border-2 border-gold/30 bg-cream/50 p-8 max-w-xl mx-auto mb-10">
          <p
            className="text-crimson text-xs tracking-[0.25em] uppercase mb-3"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            ★ Presented By ★
          </p>
          <p
            className="text-ink text-2xl mb-1"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            Studio 45 Tattoos
          </p>
          <a
            href="tel:731-513-4271"
            className="text-gold hover:text-gold-light transition-colors text-lg"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            731-513-4271
          </a>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={EVENT.venue.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all duration-200 text-center active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Get Directions
          </a>
          <Link href="/contact" className="px-8 py-3 border-2 border-ink text-ink uppercase tracking-widest text-sm hover:bg-ink hover:text-cream transition-all duration-200 text-center active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Contact Us
          </Link>
          <Link href="/faq" className="px-8 py-3 border border-ink/30 text-ink/60 uppercase tracking-widest text-sm hover:border-ink hover:text-ink transition-all duration-200 text-center active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            View FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
