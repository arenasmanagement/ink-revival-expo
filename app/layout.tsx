import type { Metadata } from "next";
import { Bebas_Neue, Barlow, Rye, Special_Elite, EB_Garamond } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

/* ── Display / Headline — bold condensed festival poster type ── */
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

/* ── Body / UI — clean, versatile sans-serif ── */
const barlow = Barlow({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

/* ── Rye — western serif used for countdown numbers, headings, prices ── */
const rye = Rye({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rye",
  display: "swap",
});

/* ── Special Elite — typewriter style used for labels and eyebrows ── */
const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
  display: "swap",
});

/* ── EB Garamond — classic serif for body copy and descriptions ── */
const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.westtninkrevival.com"),
  title: {
    default: "West TN Tattoo and Art Festival 2027 | Huntingdon, Tennessee",
    template: "%s | West TN Tattoo and Art Festival",
  },
  description:
    "West TN Tattoo and Art Festival — March 12–14, 2027 at the Carroll County TN Fairgrounds in Huntingdon, Tennessee. The first annual West Tennessee tattoo & art festival featuring tattoo artists, vendors, food trucks, car show, competitions, and three days of festival culture.",
  keywords: [
    "West TN Tattoo and Art Festival",
    "tattoo convention Tennessee",
    "tattoo festival Tennessee 2027",
    "West Tennessee tattoo festival",
    "Huntingdon Tennessee tattoo",
    "Jackson TN tattoo convention",
    "Carroll County fairgrounds",
    "tattoo artists West Tennessee",
    "tattoo and art festival Tennessee",
    "tattoo show Tennessee",
    "tattoo expo 2027",
  ],
  openGraph: {
    title: "West TN Tattoo and Art Festival 2027 — Huntingdon, Tennessee",
    description:
      "The first annual West Tennessee Tattoo and Art Festival. March 12–14, 2027 at the Carroll County TN Fairgrounds in Huntingdon, TN. Tattoo artists, vendors, food trucks, car show, competitions, and three days of festival culture.",
    type: "website",
    locale: "en_US",
    url: "https://www.westtninkrevival.com",
    siteName: "West TN Tattoo and Art Festival",
    images: [
      {
        url: "/og-card.png",
        width: 1200,
        height: 630,
        alt: "West TN Tattoo and Art Festival 2027 — March 12–14, Huntingdon, Tennessee",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "West TN Tattoo and Art Festival 2027 — Huntingdon, Tennessee",
    description:
      "West Tennessee's first tattoo & art festival. March 12–14, 2027 · Carroll County TN Fairgrounds · Huntingdon, TN",
    images: ["/og-card.png"],
    site: "@westtninkrevival",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${barlow.variable} ${rye.variable} ${specialElite.variable} ${ebGaramond.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-ink" style={{ backgroundColor: "#1A1008" }}>
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-1J8YDHQEN3" />
    </html>
  );
}
