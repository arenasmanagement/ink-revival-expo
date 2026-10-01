import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { ADMISSION, EVENT } from "@/lib/eventData";

// VIP Weekend Pass (ticket_vip_weekend) — $75, salesActive: false
// Benefits NOT yet confirmed by organizer. Do NOT show specific perks.
// This card is intentionally shown as "coming soon" to build awareness
// without making promises. Activate when organizer confirms + approves.

export const metadata: Metadata = {
  title: "Tickets — General Admission Pricing | West TN Tattoo and Art Festival 2027",
  description:
    "Buy tickets to West TN Tattoo and Art Festival 2027 in Huntingdon, Tennessee. Friday $15, Saturday $20, Sunday $15, 3-day pass $40. Children 12 & under FREE. March 12–14, 2027 at the Carroll County TN Fairgrounds.",
  alternates: { canonical: "https://www.westtninkrevival.com/tickets" },
  openGraph: {
    title: "Tickets — West TN Tattoo and Art Festival 2027 | Huntingdon, Tennessee",
    description:
      "General admission tickets: Friday $15 · Saturday $20 · Sunday $15 · 3-Day Pass $40 · Kids 12 & under FREE. West Tennessee's first tattoo & art festival, March 12–14, 2027.",
    url: "https://www.westtninkrevival.com/tickets",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.westtninkrevival.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tickets",
      item: "https://www.westtninkrevival.com/tickets",
    },
  ],
};

const TICKET_OPTIONS = [
  {
    key: "friday",
    day: "Friday",
    date: "March 12, 2027",
    price: ADMISSION.friday.price,
    accent: "border-gold/40",
    badge: "#C4902A",
    description: "Opening night — artists, vendors, car show, entertainment",
    featured: false,
  },
  {
    key: "saturday",
    day: "Saturday",
    date: "March 13, 2027",
    price: ADMISSION.saturday.price,
    accent: "border-crimson/60",
    badge: "#7A1714",
    description: "Peak day — competitions, full lineup, live music & more",
    featured: true,
  },
  {
    key: "sunday",
    day: "Sunday",
    date: "March 14, 2027",
    price: ADMISSION.sunday.price,
    accent: "border-gold/40",
    badge: "#C4902A",
    description: "Final day — awards, last-chance tattoos, closing events",
    featured: false,
  },
];

const WHAT_TO_EXPECT = [
  { icon: "🎨", label: "35 Tattoo Artist Booths", desc: "Walk-ups & appointments with artists from across the region" },
  { icon: "🛍️", label: "35 Vendor Booths", desc: "Apparel, art, jewelry, collectibles & more" },
  { icon: "🍔", label: "Food Trucks", desc: "Up to 10 food & beverage options on-site" },
  { icon: "🏎️", label: "Car Show", desc: "75 custom vehicles on display" },
  { icon: "🏆", label: "Competitions", desc: "Tattoo contests and car show awards" },
  { icon: "🎵", label: "Entertainment", desc: "Live events across all three days" },
];

export default function TicketsPage() {
  return (
    <div className="bg-parchment-light-texture min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Page header */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }}
        />
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="General Admission"
            title="Get Your Tickets"
            subtitle="West TN Tattoo and Art Festival — March 12–14, 2027 · Carroll County TN Fairgrounds · Huntingdon, Tennessee"
            light
            as="h1"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">

        {/* ── 3-Day Pass — featured top ── */}
        <div className="max-w-2xl mx-auto mb-12">
          <div
            className="relative border-2 border-gold bg-cream/80 p-8 text-center card-vintage"
            style={{ boxShadow: "0 8px 40px rgba(196,144,42,0.18)" }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[5px]"
              style={{ background: "linear-gradient(90deg,#7A1714,#C4902A,#7A1714)" }}
            />
            <p
              className="text-crimson text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              ★ Best Value ★
            </p>
            <h2
              className="text-ink text-3xl mb-2"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              3-Day Weekend Pass
            </h2>
            <p
              className="text-ink/50 text-sm mb-4"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              {EVENT.dates.display} · All Three Days
            </p>
            <div className="flex items-end justify-center gap-2 mb-4">
              <span
                className="text-gold text-6xl font-bold leading-none"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                $40
              </span>
              <span
                className="text-ink/40 text-base pb-1"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                / person
              </span>
            </div>
            <p
              className="text-ink/50 text-sm mb-6 italic"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              Save $10 vs. buying each day separately
            </p>
            <div
              className="flex items-center justify-center gap-6 mb-6 text-sm"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              {["Fri Mar 12", "Sat Mar 13", "Sun Mar 14"].map((d) => (
                <div key={d} className="flex items-center gap-1.5">
                  <span className="text-crimson text-xs">✓</span>
                  <span className="text-ink/60">{d}</span>
                </div>
              ))}
            </div>
            {/* Ticket purchase — online sales link to be activated when Stripe is live */}
            <div
              className="border border-gold/30 bg-gold/5 py-3 px-4 mb-4 text-center"
            >
              <p
                className="text-gold/70 text-xs uppercase tracking-widest mb-1"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                ★ Online Sales Opening Soon ★
              </p>
              <p
                className="text-ink/50 text-xs italic"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                Tickets will also be available at the door. Cash & card accepted.
              </p>
            </div>
            <Link
              href="/contact"
              className="block py-3 border-2 border-gold text-ink uppercase tracking-wider text-sm hover:bg-gold transition-all active:scale-95"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Questions About Tickets? Contact Us
            </Link>
          </div>
        </div>

        {/* ── Single-day options ── */}
        <SectionHeading eyebrow="Single Day" title="Day Passes" className="mb-8" />

        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {TICKET_OPTIONS.map((ticket) => (
            <div
              key={ticket.key}
              className={`relative border-2 ${ticket.accent} bg-cream/70 p-6 card-vintage ${ticket.featured ? "ring-2 ring-crimson/30" : ""}`}
            >
              {ticket.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span
                    className="bg-crimson text-cream text-[9px] tracking-[0.2em] uppercase px-3 py-1"
                    style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                  >
                    ★ Biggest Day ★
                  </span>
                </div>
              )}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(90deg, ${ticket.badge}, ${ticket.badge}88)` }}
              />
              <p
                className="text-xs tracking-[0.25em] uppercase mb-1"
                style={{
                  fontFamily: "var(--font-special-elite, monospace)",
                  color: ticket.badge,
                }}
              >
                {ticket.day}
              </p>
              <p
                className="text-ink/50 text-xs mb-3"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                {ticket.date}
              </p>
              <p
                className="text-4xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-rye, serif)",
                  color: ticket.badge,
                }}
              >
                ${ticket.price}
              </p>
              <div
                className="divider-ink mb-3"
                style={{ opacity: 0.15 }}
              />
              <p
                className="text-ink/55 text-xs leading-relaxed"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                {ticket.description}
              </p>
            </div>
          ))}
        </div>

        {/* ── VIP Weekend Pass — coming soon ── */}
        <div className="max-w-2xl mx-auto mb-12">
          <div
            className="relative border border-ink/20 bg-cream/60 p-8 text-center card-vintage"
            style={{ boxShadow: "0 4px 24px rgba(204,53,120,0.08)" }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: "linear-gradient(90deg,#CC3578,#E07830,#CC3578)" }}
            />
            {/* Coming soon badge */}
            <div className="flex justify-center mb-4">
              <span
                className="inline-block px-4 py-1 text-[9px] tracking-[0.35em] uppercase"
                style={{
                  fontFamily: "var(--font-special-elite, monospace)",
                  backgroundColor: "rgba(204,53,120,0.08)",
                  color: "#CC3578",
                  border: "1px solid rgba(204,53,120,0.25)",
                }}
              >
                ★ Details Coming Soon ★
              </span>
            </div>
            <h2
              className="text-ink text-3xl mb-1"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              VIP Weekend Pass
            </h2>
            <p
              className="text-ink/50 text-sm mb-5"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              {EVENT.dates.display} · All Three Days
            </p>
            <div className="flex items-end justify-center gap-2 mb-5">
              <span
                className="text-6xl font-bold leading-none"
                style={{ fontFamily: "var(--font-rye, serif)", color: "#CC3578" }}
              >
                $75
              </span>
              <span
                className="text-ink/40 text-base pb-1"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                / person
              </span>
            </div>
            {/* Benefits placeholder — organizer has not confirmed what's included */}
            <div
              className="border border-ink/10 bg-ink/3 py-4 px-5 mb-5 text-center"
            >
              <p
                className="text-ink/50 text-sm mb-1"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                VIP Package Details
              </p>
              <p
                className="text-ink/40 text-xs italic leading-relaxed"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                We&apos;re finalizing what makes VIP special. Package details will be
                announced before tickets go on sale — check back soon.
              </p>
            </div>
            {/* Purchase not yet active */}
            <div
              className="border border-ink/15 bg-ink/4 py-3 px-4 mb-4 text-center"
            >
              <p
                className="text-ink/40 text-xs uppercase tracking-widest mb-1"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                ★ Sales Opening Soon ★
              </p>
              <p
                className="text-ink/35 text-xs italic"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                VIP tickets will be available online once package details are confirmed.
              </p>
            </div>
            <Link
              href="/contact"
              className="block py-3 border border-ink/25 text-ink/50 uppercase tracking-wider text-xs hover:border-ink hover:text-ink transition-all active:scale-95"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Questions? Contact Us
            </Link>
          </div>
        </div>

        {/* ── Children FREE banner ── */}
        <div
          className="max-w-xl mx-auto mb-12 border border-gold/30 bg-gold/8 p-5 text-center"
        >
          <p
            className="text-gold text-2xl mb-1"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            Children 12 &amp; Under — FREE
          </p>
          <p
            className="text-ink/55 text-sm"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            With a paying adult admission. Bring the whole family.
          </p>
        </div>

        {/* ── Pricing summary table ── */}
        <div className="max-w-md mx-auto mb-14 border border-ink/15 bg-cream/60">
          <div
            className="bg-ink text-cream px-5 py-3 text-center"
          >
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Admission at a Glance
            </p>
          </div>
          <div className="divide-y divide-ink/10">
            {[
              { label: "Friday, March 12",   price: "$15" },
              { label: "Saturday, March 13", price: "$20" },
              { label: "Sunday, March 14",   price: "$15" },
              { label: "3-Day Weekend Pass", price: "$40",  highlight: true },
              { label: "VIP Weekend Pass",   price: "$75",  note: "Details coming soon" },
              { label: "Children 12 & Under", price: "FREE" },
            ].map((row) => (
              <div
                key={row.label}
                className={`flex justify-between items-center px-5 py-3 ${row.highlight ? "bg-gold/10" : ""}`}
              >
                <div>
                  <span
                    className="text-ink/70 text-sm"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {row.label}
                  </span>
                  {"note" in row && row.note && (
                    <span
                      className="block text-ink/35 text-xs italic"
                      style={{ fontFamily: "var(--font-garamond, serif)" }}
                    >
                      {row.note}
                    </span>
                  )}
                </div>
                <span
                  className={`text-base font-bold ${row.highlight ? "text-gold" : "text-ink/80"}`}
                  style={{ fontFamily: "var(--font-rye, serif)" }}
                >
                  {row.price}
                </span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-ink/15 text-center">
            <p
              className="text-ink/40 text-xs italic"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              Tickets available at the door and online (sales opening soon).
            </p>
          </div>
        </div>

        {/* ── What to expect ── */}
        <SectionHeading
          eyebrow="Included With Admission"
          title="What&rsquo;s Inside"
          className="mb-8"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {WHAT_TO_EXPECT.map((item) => (
            <div
              key={item.label}
              className="bg-cream/60 border border-ink/12 p-5 flex items-start gap-4 card-vintage"
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p
                  className="text-ink text-sm font-medium mb-1"
                  style={{ fontFamily: "var(--font-rye, serif)" }}
                >
                  {item.label}
                </p>
                <p
                  className="text-ink/55 text-xs leading-relaxed"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA row ── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/event-info"
            className="px-8 py-3 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all text-center active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Event Details &amp; Venue
          </Link>
          <Link
            href="/faq"
            className="px-8 py-3 border-2 border-ink text-ink uppercase tracking-widest text-sm hover:bg-ink hover:text-cream transition-all text-center active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 border border-ink/30 text-ink/60 uppercase tracking-widest text-sm hover:border-ink hover:text-ink transition-all text-center active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
