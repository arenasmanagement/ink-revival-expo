"use client";

import Link from "next/link";
import { EVENT, NAV_LINKS, REGISTRATION_URLS } from "@/lib/eventData";

const { vendorApplicationPath, sponsorPath, artistApplicationPath, foodTruckApplicationPath } =
  REGISTRATION_URLS;

const SOCIAL_ICON = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth={0} />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.35 6.35 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.83 1.56V6.78a4.85 4.85 0 0 1-1.06-.09z" />
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#0E0804", borderTop: "2px solid #E07830", color: "#F5EDD8" }}
    >
      <div className="container-festival py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

          {/* ── Brand column ── */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            {/* Wordmark */}
            <div className="mb-4">
              <div
                style={{
                  fontFamily: "var(--font-bebas-neue, Impact, sans-serif)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "rgba(245,237,216,0.45)",
                  marginBottom: "2px",
                }}
              >
                West Tennessee
              </div>
              <div
                style={{
                  fontFamily: "var(--font-bebas-neue, Impact, sans-serif)",
                  fontSize: "1.65rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#E07830",
                  lineHeight: 0.9,
                }}
              >
                Tattoo &amp; Art Festival
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body, system-ui, sans-serif)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(61,136,120,0.7)",
                  marginTop: "4px",
                }}
              >
                March 12–14, 2027
              </div>
            </div>

            <div className="divider-sunset w-20 mb-5" />

            <address
              className="not-italic text-sm leading-7"
              style={{
                fontFamily: "var(--font-body, system-ui, sans-serif)",
                color: "rgba(245,237,216,0.55)",
              }}
            >
              <div>{EVENT.dates.display}</div>
              <div>{EVENT.venue.name}</div>
              <div>
                {EVENT.venue.city}, {EVENT.venue.state}
              </div>
              <a
                href={`tel:${EVENT.contact.phone}`}
                style={{ color: "#3D8878" }}
                className="hover:opacity-80 transition-opacity"
              >
                {EVENT.contact.phone}
              </a>
            </address>

            {/* Social icons */}
            {(["facebook", "instagram", "tiktok"] as const).some(
              (s) => EVENT.social[s] !== "#"
            ) && (
              <div className="flex gap-4 mt-5">
                {(["facebook", "instagram", "tiktok"] as const)
                  .filter((s) => EVENT.social[s] !== "#")
                  .map((s) => (
                    <a
                      key={s}
                      href={EVENT.social[s]}
                      aria-label={`${s} — West TN Tattoo and Art Festival`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity duration-200 hover:opacity-80"
                      style={{ color: "rgba(245,237,216,0.35)" }}
                    >
                      {SOCIAL_ICON[s]}
                    </a>
                  ))}
              </div>
            )}
          </div>

          {/* ── Quick links ── */}
          <div className="text-center md:text-left">
            <h3
              style={{
                fontFamily: "var(--font-body, system-ui, sans-serif)",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#E07830",
                marginBottom: "0.75rem",
              }}
            >
              Quick Links
            </h3>
            <div className="divider-sunset mb-5" />
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-150 hover:opacity-100"
                    style={{
                      fontFamily: "var(--font-body, system-ui, sans-serif)",
                      fontSize: "0.95rem",
                      color: "rgba(245,237,216,0.55)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#F5EDD8"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,237,216,0.55)"; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Participate ── */}
          <div className="text-center md:text-left">
            <h3
              style={{
                fontFamily: "var(--font-body, system-ui, sans-serif)",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#3D8878",
                marginBottom: "0.75rem",
              }}
            >
              Participate
            </h3>
            <div className="divider-teal mb-5" />
            <ul className="space-y-2.5">
              {[
                { label: "Apply as a Tattoo Artist", href: artistApplicationPath },
                { label: "Reserve a Vendor Booth",   href: vendorApplicationPath },
                { label: "Food Truck Application",   href: foodTruckApplicationPath },
                { label: "Sponsorship Packages",     href: sponsorPath },
                { label: "Contact Us",               href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 transition-colors duration-150"
                    style={{
                      fontFamily: "var(--font-body, system-ui, sans-serif)",
                      fontSize: "0.95rem",
                      color: "rgba(245,237,216,0.55)",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#F5EDD8"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,237,216,0.55)"; }}
                  >
                    <span style={{ color: "#3D8878", fontSize: "0.5rem", flexShrink: 0 }}>●</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(245,237,216,0.08)" }}
        >
          <p
            style={{
              fontFamily: "var(--font-body, system-ui, sans-serif)",
              fontSize: "0.6rem",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(245,237,216,0.22)",
            }}
          >
            © 2026–2027 West TN Tattoo and Art Festival. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body, system-ui, sans-serif)",
              fontSize: "0.8rem",
              color: "rgba(245,237,216,0.22)",
            }}
          >
            Website by{" "}
            <a
              href="https://www.arenasmanagementco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
              style={{
                fontFamily: "var(--font-body, system-ui, sans-serif)",
                fontWeight: 600,
              }}
            >
              Arenas Management Co.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
