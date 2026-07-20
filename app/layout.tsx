import type { Metadata } from "next";
import { Rye, Playfair_Display, EB_Garamond, Special_Elite } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const rye = Rye({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rye",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase is required for Next.js to resolve relative OG/Twitter image URLs
  // to absolute URLs when the metadata is consumed by social platforms.
  metadataBase: new URL("https://www.westtninkrevival.com"),

  title: "West TN Ink Revival Expo 2027 | Tattoo Convention in Huntingdon, Tennessee",
  description:
    "Join the first annual West TN Ink Revival Expo, March 12–14, 2027, at the Carroll County TN Fairgrounds in Huntingdon, Tennessee. Discover tattoo artists, vendors, food, sponsors, and three days celebrating tattoo culture.",
  keywords: [
    "West TN Ink Revival Expo",
    "tattoo convention Tennessee",
    "tattoo expo 2027",
    "Huntingdon Tennessee",
    "Carroll County fairgrounds",
    "Studio 45 Tattoos",
    "tattoo artists West Tennessee",
    "tattoo convention 2027",
  ],
  openGraph: {
    title: "West TN Ink Revival Expo 2027",
    description:
      "The first annual West TN Ink Revival Expo — March 12–14, 2027 in Huntingdon, Tennessee. Three days of tattoo artistry, vendors, food, and community.",
    type: "website",
    locale: "en_US",
    url: "https://www.westtninkrevival.com",
    siteName: "West TN Ink Revival Expo",
    images: [
      {
        url: "/og-card.png",
        width: 1200,
        height: 630,
        alt: "West TN Ink Revival Expo 2027 — March 12–14, Huntingdon, Tennessee",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "West TN Ink Revival Expo 2027",
    description: "March 12–14, 2027 · Carroll County TN Fairgrounds · Huntingdon, Tennessee",
    images: ["/og-card.png"],
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
      className={`${rye.variable} ${playfair.variable} ${ebGaramond.variable} ${specialElite.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
