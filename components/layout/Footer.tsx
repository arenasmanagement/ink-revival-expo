import Link from "next/link";
import { EVENT, NAV_LINKS, REGISTRATION_URLS } from "@/lib/eventData";

const { sponsorRegistrationUrl, vendorRegistrationUrl } = REGISTRATION_URLS;

const SOCIAL_ICON = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth={0} />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.35 6.35 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.83 1.56V6.78a4.85 4.85 0 0 1-1.06-.09z" />
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer className="bg-ink-texture text-cream/80">
      {/* Top divider */}
      <div className="h-[3px]" style={{ background: "linear-gradient(90deg,#7A1714,#C4902A,#7A1714)" }} />

      {/* Ornamental top */}
      <div className="text-center py-4 text-gold/60 text-xl tracking-[1em]">✦ ✦ ✦</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

          {/* Brand column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2
              className="text-gold text-2xl leading-tight mb-1"
              style={{ fontFamily: "var(--font-rye, 'Rye', serif)" }}
            >
              West TN Ink Revival Expo
            </h2>
            <p
              className="text-cream/50 text-xs tracking-widest uppercase mb-4"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Presented by {EVENT.producer}
            </p>
            <div className="divider-gold w-24 mb-4" />
            <address className="not-italic text-sm text-cream/60 leading-7">
              <div>{EVENT.dates.display}</div>
              <div>{EVENT.venue.name}</div>
              <div>{EVENT.venue.city}, {EVENT.venue.state}</div>
              <a
                href={`tel:${EVENT.contact.phone}`}
                className="text-gold/80 hover:text-gold transition-colors"
              >
                {EVENT.contact.phone}
              </a>
            </address>

            {/* Socials — only render icons when real URLs are set */}
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
                      aria-label={`${s} — West TN Ink Revival Expo`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream/40 hover:text-gold transition-colors duration-200"
                    >
                      {SOCIAL_ICON[s]}
                    </a>
                  ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="text-center md:text-left">
            <h3
              className="text-gold text-sm tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Quick Links
            </h3>
            <div className="divider-gold mb-4" />
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/60 hover:text-cream text-sm transition-colors duration-200"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Participate */}
          <div className="text-center md:text-left">
            <h3
              className="text-gold text-sm tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Participate
            </h3>
            <div className="divider-gold mb-4" />
            <ul className="space-y-3">
              {/* Internal links */}
              {[
                { label: "Apply as a Tattoo Artist", href: "/artists" },
                { label: "Food Truck Application", href: "/vendors#food-trucks" },
                { label: "Contact the Expo", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-cream/60 hover:text-cream text-sm transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="text-crimson text-xs">★</span>
                    {item.label}
                  </Link>
                </li>
              ))}
              {/* External registration links */}
              <li>
                <a
                  href={vendorRegistrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/60 hover:text-cream text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="text-crimson text-xs">★</span>
                  Reserve a Vendor Booth
                </a>
              </li>
              <li>
                <a
                  href={sponsorRegistrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/60 hover:text-cream text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="text-crimson text-xs">★</span>
                  Register as a Sponsor
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/30">
          <p style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            © 2026 West TN Ink Revival Expo. All rights reserved.
          </p>
          <p
            style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
          >
            Website by{" "}
            <a
              href="https://www.arenasmanagementco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold/50 transition-colors duration-200 not-italic"
              style={{ fontFamily: "var(--font-special-elite, monospace)", fontStyle: "normal" }}
            >
              Arenas Management Co.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
