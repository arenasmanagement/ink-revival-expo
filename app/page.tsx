import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "West TN Tattoo and Art Festival 2027 | Huntingdon, Tennessee",
  description:
    "West TN Tattoo and Art Festival — March 12–14, 2027 at the Carroll County TN Fairgrounds, Huntingdon, Tennessee. West Tennessee's first tattoo & art festival featuring 35 tattoo artists, vendors, food trucks, car show, competitions, and three days of ink culture. Tickets: Fri $15, Sat $20, Sun $15, 3-Day $40.",
  alternates: { canonical: "https://www.westtninkrevival.com" },
  openGraph: {
    title: "West TN Tattoo and Art Festival 2027 — Huntingdon, Tennessee",
    description:
      "March 12–14, 2027 · Carroll County TN Fairgrounds · Huntingdon, TN. West Tennessee's first tattoo & art festival — 35 artist booths, car show, vendors, food trucks, competitions. Tickets from $15.",
    url: "https://www.westtninkrevival.com",
    images: [
      {
        url: "/west-tn-tattoo-festival-2027-og.jpg",
        width: 1200,
        height: 630,
        alt: "West TN Tattoo and Art Festival 2027 — Huntingdon, Tennessee",
      },
    ],
  },
};

import Hero             from "@/components/home/Hero";
import FestivalIntro    from "@/components/home/FestivalIntro";
import ExperiencesGrid  from "@/components/home/ExperiencesGrid";
import TicketsSection   from "@/components/home/TicketsSection";
import MascotSection    from "@/components/home/MascotSection";
import ParticipateSection from "@/components/home/ParticipateSection";
import EventInfoSection from "@/components/home/EventInfoSection";
import EmailSignup      from "@/components/home/EmailSignup";

/* ── Structured data (schema.org) ── */
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "West TN Tattoo and Art Festival 2027",
  description:
    "West TN Tattoo and Art Festival 2027 — West Tennessee's first tattoo & art festival. Three days of tattoo artistry, art, vendors, food trucks, car show, competitions, and entertainment at the Carroll County TN Fairgrounds in Huntingdon, Tennessee. Tickets from $15.",
  startDate: "2027-03-12",
  endDate: "2027-03-14",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Carroll County TN Fairgrounds",
    address: {
      "@type": "PostalAddress",
      streetAddress: "201 Fairgrounds Road",
      addressLocality: "Huntingdon",
      addressRegion: "TN",
      postalCode: "38344",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 36.0009,
      longitude: -88.4264,
    },
  },
  organizer: {
    "@type": "Organization",
    name: "West TN Tattoo and Art Festival",
    url: "https://www.westtninkrevival.com",
  },
  url: "https://www.westtninkrevival.com",
  image: [
    "https://www.westtninkrevival.com/west-tn-tattoo-festival-2027-og.jpg",
    "https://www.westtninkrevival.com/hero-trans.png",
  ],
  keywords:
    "tattoo convention Tennessee, West Tennessee tattoo festival, tattoo and art festival Tennessee, tattoo show Huntingdon TN, car show Tennessee 2027",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "West TN Tattoo and Art Festival",
  url: "https://www.westtninkrevival.com",
  logo: "https://www.westtninkrevival.com/west-tn-tattoo-festival-2027-og.jpg",
  image: "https://www.westtninkrevival.com/west-tn-tattoo-festival-2027-og.jpg",
  description:
    "The first annual West Tennessee Tattoo and Art Festival. March 12–14, 2027 at the Carroll County TN Fairgrounds in Huntingdon, Tennessee.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "201 Fairgrounds Road",
    addressLocality: "Huntingdon",
    addressRegion: "TN",
    postalCode: "38344",
    addressCountry: "US",
  },
  sameAs: ["https://www.westtninkrevival.com"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "West TN Tattoo and Art Festival",
  url: "https://www.westtninkrevival.com",
  description:
    "Official website for West TN Tattoo and Art Festival — West Tennessee's first annual tattoo & art festival, March 12–14, 2027.",
};

export default function HomePage() {
  return (
    <>
      {/* ── Structured data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* ── 01 Hero ── */}
      <Hero />

      {/* ── 02 Festival Introduction (cream) ── */}
      <FestivalIntro />

      {/* ── 03 Experiences Grid (ink) ── */}
      <ExperiencesGrid />

      {/* ── 04 Tickets (teal-deep) ── */}
      <TicketsSection />

      {/* ── 05 Mascot (cream) ── */}
      <MascotSection />

      {/* ── 06 Participate — capacity + CTAs (ink) ── */}
      <ParticipateSection />

      {/* ── 07 Event Info + Location (aged cream) ── */}
      <EventInfoSection />

      {/* ── 08 Email Signup (teal) ── */}
      <EmailSignup />
    </>
  );
}
