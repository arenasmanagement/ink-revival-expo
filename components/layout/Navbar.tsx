"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Navigation data ─────────────────────────────────────── */

const PARTICIPATE_ITEMS = [
  { label: "Tattoo Artists",  href: "/artists",              desc: "Apply for a booth" },
  { label: "Vendors",         href: "/vendors",              desc: "Reserve a vendor booth" },
  { label: "Food Trucks",     href: "/vendors#food-trucks",  desc: "Food truck spaces" },
  { label: "Car Show",        href: "/car-show",             desc: "Enter your vehicle" },
  { label: "Competitions",    href: "/competitions",         desc: "Tattoo & car show awards" },
  { label: "Sponsors",        href: "/sponsors",             desc: "Sponsorship packages" },
];

const PARTICIPATE_PATHS = ["/artists", "/vendors", "/sponsors", "/car-show", "/competitions"];

const BEFORE_PARTICIPATE = [{ label: "Event", href: "/event-info" }];
const AFTER_PARTICIPATE  = [{ label: "FAQ", href: "/faq" }, { label: "Contact", href: "/contact" }];

/* ── Component ───────────────────────────────────────────── */

export default function Navbar() {
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [participateOpen, setParticipateOpen] = useState(false);
  const [dropdownOpen,    setDropdownOpen]    = useState(false);
  const [scrolled,        setScrolled]        = useState(false);
  const pathname  = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
    setParticipateOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const participateActive = PARTICIPATE_PATHS.some((p) => pathname.startsWith(p));

  function NavLink({ href, label }: { href: string; label: string }) {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`relative px-3 py-1.5 text-sm tracking-wider uppercase transition-colors duration-200 ${
          active ? "text-gold" : "text-cream/80 hover:text-cream"
        }`}
        style={{ fontFamily: "var(--font-special-elite, monospace)" }}
      >
        {label}
        {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />}
      </Link>
    );
  }

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: "#1A1008",
        borderBottom: scrolled ? "2px solid #C4902A" : "2px solid rgba(196,144,42,0.5)",
        boxShadow:     scrolled ? "0 4px 20px rgba(0,0,0,0.4)" : "none",
      }}
    >
      {/* ── Announcement ticker bar ── */}
      <div
        className="overflow-hidden"
        style={{
          background: "linear-gradient(180deg,#9B2020 0%,#7A1714 50%,#5C100F 100%)",
          borderBottom: "1px solid rgba(196,144,42,0.3)",
        }}
        aria-label="Event announcement"
      >
        <div
          className="flex whitespace-nowrap py-1.5"
          style={{ animation: "tickerScroll 26s linear infinite" }}
          aria-hidden="true"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-cream/80 text-[10px] tracking-[0.3em] uppercase pr-16"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              ★ West TN Tattoo &amp; Art Festival &nbsp;·&nbsp; March 12–14, 2027 · Huntingdon, Tennessee &nbsp;·&nbsp; Tickets: Fri $15 · Sat $20 · Sun $15 · Weekend $40 · Kids FREE &nbsp;·&nbsp; 35 Artist Booths · Vendors · Car Show · Food Trucks · Competitions &nbsp;
            </span>
          ))}
        </div>
        <p className="sr-only">
          West TN Tattoo and Art Festival — March 12–14, 2027 · Huntingdon, Tennessee — Tickets: Fri $15, Sat $20, Sun $15, Weekend Pass $40, Children 12 & Under Free
        </p>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[70px]">

          {/* ── Logo → Home ── */}
          <Link href="/" className="flex-shrink-0 group" aria-label="West TN Tattoo and Art Festival — Home">
            <div className="flex flex-col leading-none">
              <span
                className="text-gold text-xs tracking-[0.2em] uppercase opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                West TN
              </span>
              <span
                className="text-cream text-lg leading-tight group-hover:text-gold transition-colors duration-200"
                style={{ fontFamily: "var(--font-rye, 'Rye', serif)" }}
              >
                Tattoo &amp; Art
              </span>
              <span
                className="text-gold-light text-[10px] tracking-[0.18em] uppercase opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                Festival 2027
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-0.5">

              {BEFORE_PARTICIPATE.map((l) => <NavLink key={l.href} {...l} />)}

              {/* Participate dropdown */}
              <div
                ref={wrapperRef}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  className={`relative flex items-center gap-1 px-3 py-1.5 text-sm tracking-wider uppercase transition-colors duration-200 ${
                    participateActive || dropdownOpen ? "text-gold" : "text-cream/80 hover:text-cream"
                  }`}
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  Participate
                  <span
                    className="text-[9px] mt-px transition-transform duration-200"
                    style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    ▾
                  </span>
                  {(participateActive || dropdownOpen) && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
                  )}
                </button>

                <div className="absolute top-full left-0 right-0 h-2" />

                <div
                  aria-label="Participate submenu"
                  className="absolute w-56"
                  style={{
                    top:             "calc(100% + 8px)",
                    left:            "50%",
                    opacity:         dropdownOpen ? 1 : 0,
                    transform:       dropdownOpen
                                       ? "translateX(-50%) translateY(0)"
                                       : "translateX(-50%) translateY(-6px)",
                    pointerEvents:   dropdownOpen ? "auto" : "none",
                    transition:      "opacity 0.18s ease, transform 0.18s ease",
                    backgroundColor: "#150D06",
                    border:          "1px solid rgba(196,144,42,0.35)",
                    borderTop:       "2px solid #C4902A",
                    boxShadow:       "0 10px 32px rgba(0,0,0,0.55)",
                  }}
                >
                  {PARTICIPATE_ITEMS.map((item, i) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href.includes("#") && pathname === item.href.split("#")[0]);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className={`group block px-4 py-3 transition-colors duration-150 ${
                          i < PARTICIPATE_ITEMS.length - 1 ? "border-b border-white/5" : ""
                        } ${isActive ? "bg-crimson/15" : "hover:bg-white/5"}`}
                      >
                        <span
                          className={`block text-xs tracking-wider uppercase ${
                            isActive ? "text-gold" : "text-cream/75 group-hover:text-cream"
                          }`}
                          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                        >
                          {isActive && <span className="mr-1.5 text-gold">★</span>}
                          {item.label}
                        </span>
                        <span
                          className="block text-[10px] text-cream/30 mt-0.5 group-hover:text-cream/50 transition-colors"
                          style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
                        >
                          {item.desc}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {AFTER_PARTICIPATE.map((l) => <NavLink key={l.href} {...l} />)}
            </div>

            <div
              className="mx-4 self-stretch"
              style={{ width: "1px", background: "rgba(196,144,42,0.2)" }}
            />

            {/* Tickets — now a real link */}
            <Link
              href="/tickets"
              className={`inline-flex items-center justify-center text-xs tracking-wider uppercase px-4 py-2 flex-shrink-0 leading-none transition-all duration-200 ${
                pathname === "/tickets"
                  ? "bg-crimson text-cream"
                  : "bg-crimson/80 text-cream hover:bg-crimson"
              }`}
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Get Tickets
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className={`block h-0.5 w-6 bg-cream transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-cream transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-cream transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ backgroundColor: "#1A1008", borderTop: "1px solid rgba(196,144,42,0.3)" }}
      >
        <div className="px-4 py-3 flex flex-col">

          {BEFORE_PARTICIPATE.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 px-3 text-sm tracking-wider uppercase border-b transition-colors duration-200 ${
                  active ? "text-gold border-gold/20" : "text-cream/80 hover:text-cream border-white/5"
                }`}
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                {active && <span className="mr-2 text-gold">★</span>}
                {link.label}
              </Link>
            );
          })}

          {/* Participate accordion */}
          <div className="border-b border-white/5">
            <button
              onClick={() => setParticipateOpen((v) => !v)}
              className={`w-full flex items-center justify-between py-3 px-3 text-sm tracking-wider uppercase transition-colors duration-200 ${
                participateActive ? "text-gold" : "text-cream/80 hover:text-cream"
              }`}
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              <span>
                {participateActive && <span className="mr-2 text-gold">★</span>}
                Participate
              </span>
              <span
                className="text-[10px] transition-transform duration-200"
                style={{ transform: participateOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                ▾
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                participateOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {PARTICIPATE_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href.includes("#") && pathname === item.href.split("#")[0]);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 py-3 pl-8 pr-3 text-xs tracking-wider uppercase border-t border-white/5 transition-colors duration-200 ${
                      isActive ? "text-gold" : "text-cream/60 hover:text-cream"
                    }`}
                    style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                  >
                    <span className="text-crimson text-[9px] flex-shrink-0">★</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {AFTER_PARTICIPATE.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 px-3 text-sm tracking-wider uppercase border-b transition-colors duration-200 ${
                  active ? "text-gold border-gold/20" : "text-cream/80 hover:text-cream border-white/5"
                }`}
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                {active && <span className="mr-2 text-gold">★</span>}
                {link.label}
              </Link>
            );
          })}

          {/* Tickets */}
          <div className="pt-4 pb-2">
            <Link
              href="/tickets"
              className={`block text-center text-sm tracking-wider uppercase py-3 transition-colors ${
                pathname === "/tickets"
                  ? "bg-crimson text-cream"
                  : "bg-crimson/80 text-cream hover:bg-crimson"
              }`}
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Get Tickets
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
