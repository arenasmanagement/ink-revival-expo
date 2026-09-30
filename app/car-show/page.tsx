import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import CarShowRegistrationForm from "@/components/car-show/CarShowRegistrationForm";
import { CAPACITY, EVENT } from "@/lib/eventData";

export const metadata: Metadata = {
  title: "Car Show — Register Your Vehicle | West TN Tattoo and Art Festival 2027",
  description:
    "Enter the West TN Tattoo and Art Festival car show in Huntingdon, Tennessee. 75 vehicle spaces available. Custom cars, trucks, motorcycles, and classics welcome. March 12–14, 2027 at the Carroll County TN Fairgrounds.",
  alternates: { canonical: "https://www.westtninkrevival.com/car-show" },
  openGraph: {
    title: "Car Show — West TN Tattoo and Art Festival 2027 | Huntingdon, Tennessee",
    description:
      "75 car show spaces. Custom builds, classics, trucks, motorcycles welcome. March 12–14, 2027 at Carroll County TN Fairgrounds, Huntingdon, TN.",
    url: "https://www.westtninkrevival.com/car-show",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.westtninkrevival.com" },
    { "@type": "ListItem", position: 2, name: "Car Show", item: "https://www.westtninkrevival.com/car-show" },
  ],
};

const VEHICLE_CLASSES = [
  { icon: "🏎️", label: "Custom Builds", desc: "Full custom fabrication, restomod, pro touring" },
  { icon: "🚗", label: "Classics", desc: "Pre-1980 stock, modified, and restored vehicles" },
  { icon: "🛻", label: "Trucks & SUVs", desc: "Custom and classic trucks, bagged, lifted, slammed" },
  { icon: "🏍️", label: "Motorcycles", desc: "Choppers, bobbers, café racers, custom builds" },
  { icon: "💪", label: "Muscle Cars", desc: "American muscle — stock, modified, and restored" },
  { icon: "✨", label: "Show Cars", desc: "Full show builds, trailer queens, award contenders" },
];

const WHY_ENTER = [
  "On-site display space for all 3 days of the expo",
  "75 curated vehicle slots — high-quality, low-traffic show",
  "Hundreds of tattoo and car culture enthusiasts in attendance",
  "Trophy and award ceremony for outstanding builds",
  "Be part of West Tennessee's first tattoo & car culture festival",
  "Photography-friendly event with natural lighting at the fairgrounds",
];

export default function CarShowPage() {
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
            eyebrow="Car Culture"
            title="Car Show"
            subtitle="75 vehicle spaces. Custom builds, classics, muscle, trucks, motorcycles — all welcome at West Tennessee's first tattoo & art festival."
            light
            as="h1"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">

        {/* ── Key stats callout ── */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-14">
          {[
            { value: CAPACITY.carShowVehicles, label: "Vehicle Spaces", color: "#C4902A" },
            { value: "3", label: "Days On Display", color: "#7A1714" },
            { value: "1st", label: "Annual Event", color: "#C4902A" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center border border-ink/15 bg-cream/70 py-5 px-3"
            >
              <p
                className="text-3xl font-bold mb-1"
                style={{ fontFamily: "var(--font-rye, serif)", color: stat.color }}
              >
                {stat.value}
              </p>
              <p
                className="text-ink/55 text-xs uppercase tracking-wider"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Vehicle classes ── */}
        <section className="mb-12">
          <SectionHeading eyebrow="Vehicle Classes" title="Who Can Enter?" className="mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VEHICLE_CLASSES.map((v) => (
              <div
                key={v.label}
                className="bg-cream/60 border border-ink/12 p-5 flex items-start gap-4 card-vintage"
              >
                <span className="text-2xl flex-shrink-0">{v.icon}</span>
                <div>
                  <p
                    className="text-ink text-sm font-medium mb-1"
                    style={{ fontFamily: "var(--font-rye, serif)" }}
                  >
                    {v.label}
                  </p>
                  <p
                    className="text-ink/55 text-xs leading-relaxed"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why enter ── */}
        <section className="mb-14">
          <div className="bg-cream/60 border border-ink/12 p-6 sm:p-8 card-vintage">
            <h2
              className="text-ink text-xl mb-5"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              Why Show at West TN Tattoo and Art Festival?
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {WHY_ENTER.map((reason) => (
                <div key={reason} className="flex items-start gap-2">
                  <span className="text-crimson text-xs mt-0.5 flex-shrink-0">★</span>
                  <span
                    className="text-ink/70 text-sm"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Registration ── */}
        <section id="register" className="mb-14">
          <SectionHeading eyebrow="Enter Your Vehicle" title="Car Show Registration" className="mb-8" />
          <CarShowRegistrationForm />
        </section>

        {/* ── Awards ── */}
        <section className="mb-10">
          <div
            className="bg-ink-texture relative overflow-hidden p-8 sm:p-12 text-center"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }}
            />
            <p
              className="text-gold/70 text-xs tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              ★ Awards & Trophies ★
            </p>
            <h2
              className="text-cream text-2xl sm:text-3xl mb-3"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              Competitions &amp; Awards
            </h2>
            <p
              className="text-cream/60 text-base mb-6 max-w-lg mx-auto"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              Car show award categories and trophy presentations will be announced closer to the event.
              View the full competitions page for all contest details.
            </p>
            <Link
              href="/competitions"
              className="inline-block px-8 py-3 border-2 border-gold text-gold uppercase tracking-widest text-sm hover:bg-gold hover:text-ink transition-all active:scale-95"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              View Competitions →
            </Link>
          </div>
        </section>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tickets"
            className="px-8 py-3 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all text-center active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Get Admission Tickets
          </Link>
          <Link
            href="/event-info"
            className="px-8 py-3 border-2 border-ink text-ink uppercase tracking-widest text-sm hover:bg-ink hover:text-cream transition-all text-center active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Event Details
          </Link>
          <a
            href={`tel:${EVENT.contact.phone}`}
            className="px-8 py-3 border border-ink/30 text-ink/60 uppercase tracking-widest text-sm hover:border-ink hover:text-ink transition-all text-center active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Call {EVENT.contact.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
