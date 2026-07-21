import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { EVENT } from "@/lib/eventData";

export const metadata: Metadata = {
  title: "Schedule | West TN Ink Revival Expo 2027",
  description: "Event schedule for West TN Ink Revival Expo — March 12–14, 2027. Full schedule coming soon.",
  alternates: { canonical: "https://www.westtninkrevival.com/schedule" },
};

const EVENT_DAYS = [
  {
    date: "Friday, March 12",
    year: "2027",
    label: "Day 1 — Opening Day",
    num: "01",
  },
  {
    date: "Saturday, March 13",
    year: "2027",
    label: "Day 2 — Main Day",
    num: "02",
  },
  {
    date: "Sunday, March 14",
    year: "2027",
    label: "Day 3 — Final Day",
    num: "03",
  },
];

export default function SchedulePage() {
  return (
    <div className="bg-parchment-light-texture min-h-screen">
      {/* Header */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <SectionHeading
          eyebrow="Plan Your Visit"
          title="Event Schedule"
          subtitle="The complete three-day schedule will be released as details are finalized."
          light
          as="h1"
          className="max-w-4xl mx-auto"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">

        {/* Coming soon hero */}
        <div className="text-center border-2 border-gold/40 bg-cream/60 p-8 sm:p-12 mb-10 sm:mb-14 card-vintage relative">
          <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: "linear-gradient(90deg,#7A1714,#C4902A,#7A1714)" }} />
          <p className="text-gold/60 text-xl tracking-[0.8em] mb-4">★ ★ ★</p>
          <h2
            className="text-ink text-2xl sm:text-3xl mb-4"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            Official Schedule Coming Soon
          </h2>
          <p
            className="text-ink/65 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            The complete three-day schedule — including event hours, featured activities,
            artist announcements, competitions, contests, and entertainment — will be released
            as details are finalized. Join our email list to be the first to know.
          </p>
          <Link
            href="/#email-signup"
            className="inline-block px-8 py-3 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all duration-200 active:scale-[0.97]"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Get Schedule Updates
          </Link>
        </div>

        {/* Event dates */}
        <section className="mb-10 sm:mb-14">
          <SectionHeading eyebrow="Event Dates" title="Three Days of Tattooing" className="mb-10" />

          <div className="grid sm:grid-cols-3 gap-5">
            {EVENT_DAYS.map((day) => (
              <div
                key={day.date}
                className="bg-cream/60 border border-ink/12 card-vintage relative overflow-hidden text-center p-6"
              >
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-crimson" />
                <p
                  className="text-crimson/25 text-6xl leading-none mb-3 select-none"
                  style={{ fontFamily: "var(--font-rye, serif)" }}
                  aria-hidden="true"
                >
                  {day.num}
                </p>
                <p
                  className="text-ink/40 text-[10px] tracking-[0.3em] uppercase mb-1"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  {day.label}
                </p>
                <h3
                  className="text-ink text-lg leading-tight"
                  style={{ fontFamily: "var(--font-rye, serif)" }}
                >
                  {day.date}
                </h3>
                <p
                  className="text-ink/40 text-sm mt-1"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  {day.year}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Venue reminder */}
        <section className="text-center bg-ink-texture p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
          <p
            className="text-gold/60 text-[10px] tracking-[0.3em] uppercase mb-3"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            ★ Location ★
          </p>
          <p
            className="text-cream text-xl sm:text-2xl mb-2"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            {EVENT.venue.name}
          </p>
          <p
            className="text-cream/60 text-base mb-6"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            {EVENT.venue.city}, {EVENT.venue.state} · {EVENT.dates.display}
          </p>
          <Link
            href="/event-info"
            className="inline-block px-7 py-3 border-2 border-gold text-gold uppercase tracking-widest text-sm hover:bg-gold hover:text-ink transition-all duration-200 active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            View Event Info
          </Link>
        </section>
      </div>
    </div>
  );
}
