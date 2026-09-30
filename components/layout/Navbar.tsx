"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Navigation data ─────────────────────────────────────────────── */

const PARTICIPATE_ITEMS = [
  { label: "Tattoo Artists",  href: "/artists",             desc: "Apply for a booth" },
  { label: "Vendors",         href: "/vendors",             desc: "Reserve a vendor space" },
  { label: "Food Trucks",     href: "/vendors#food-trucks", desc: "Food truck spots" },
  { label: "Car Show",        href: "/car-show",            desc: "Enter your vehicle" },
  { label: "Competitions",    href: "/competitions",        desc: "Tattoo & car show awards" },
  { label: "Sponsors",        href: "/sponsors",            desc: "Sponsorship packages" },
];

const PARTICIPATE_PATHS = ["/artists", "/vendors", "/sponsors", "/car-show", "/competitions"];
const BEFORE_PARTICIPATE = [{ label: "Event Info", href: "/event-info" }];
const AFTER_PARTICIPATE  = [{ label: "FAQ", href: "/faq" }, { label: "Contact", href: "/contact" }];

/* ── Styles ─────────────────────────────────────────────────────── */
const BG  = "#1A1008";
const BG2 = "#0E0804";

/* ── Component ───────────────────────────────────────────────────── */

export default function Navbar() {
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [participateOpen, setParticipateOpen] = useState(false);
  const [dropdownOpen,    setDropdownOpen]    = useState(false);
  const [scrolled,        setScrolled]        = useState(false);
  const pathname  = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setParticipateOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const participateActive = PARTICIPATE_PATHS.some((p) => pathname.startsWith(p));

  /* Desktop nav link */
  function NavLink({ href, label }: { href: string; label: string }) {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className="relative px-3 py-2 transition-colors duration-150"
        style={{
          fontFamily: "var(--font-special-elite, monospace)",
          fontSize: "0.65rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: active ? "#E07830" : "rgba(245,237,216,0.75)",
        }}
        onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "#F5EDD8"; }}
        onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(245,237,216,0.75)"; }}
      >
        {label}
        {active && (
          <span
            className="absolute bottom-0 left-3 right-3 h-[1.5px]"
            style={{ background: "#E07830" }}
          />
        )}
      </Link>
    );
  }

  return (
    <header
      className="sticky top-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: BG,
        borderBottom: scrolled
          ? "1px solid rgba(224,120,48,0.45)"
          : "1px solid rgba(224,120,48,0.2)",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <nav className="container-festival">
        <div className="flex items-center justify-between" style={{ height: "64px" }}>

          {/* ── Wordmark / Logo ── */}
          <Link
            href="/"
            className="flex-shrink-0 group flex flex-col leading-none"
            aria-label="West TN Tattoo and Art Festival — Home"
          >
            <span
              style={{
                fontFamily: "var(--font-bebas-neue, Impact, sans-serif)",
                fontSize: "0.65rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(245,237,216,0.55)",
                lineHeight: 1,
                transition: "color 0.15s ease",
              }}
              className="group-hover:text-cream/80 transition-colors"
            >
              West Tennessee
            </span>
            <span
              style={{
                fontFamily: "var(--font-bebas-neue, Impact, sans-serif)",
                fontSize: "1.55rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#E07830",
                lineHeight: 0.95,
                transition: "color 0.15s ease",
              }}
            >
              Tattoo &amp; Art
            </span>
            <span
              style={{
                fontFamily: "var(--font-special-elite, monospace)",
                fontSize: "0.5rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(61,136,120,0.8)",
                lineHeight: 1.2,
              }}
            >
              Festival&nbsp;·&nbsp;2027
            </span>
          </Link>

          {/* ── Desktop Navigation ── */}
          <div className="hidden lg:flex items-center gap-1">
            {BEFORE_PARTICIPATE.map((l) => <NavLink key={l.href} {...l} />)}

            {/* Participate Dropdown */}
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
                className="relative flex items-center gap-1 px-3 py-2 transition-colors duration-150"
                style={{
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: participateActive || dropdownOpen
                    ? "#E07830"
                    : "rgba(245,237,216,0.75)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Participate
                <span
                  className="text-[8px] transition-transform duration-200"
                  style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  ▾
                </span>
                {(participateActive || dropdownOpen) && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[1.5px]"
                    style={{ background: "#E07830" }}
                  />
                )}
              </button>

              {/* Hit area bridge */}
              <div className="absolute top-full left-0 right-0 h-2" />

              {/* Dropdown panel */}
              <div
                className="absolute w-56"
                style={{
                  top:           "calc(100% + 8px)",
                  left:          "50%",
                  transform:     dropdownOpen
                    ? "translateX(-50%) translateY(0)"
                    : "translateX(-50%) translateY(-6px)",
                  opacity:       dropdownOpen ? 1 : 0,
                  pointerEvents: dropdownOpen ? "auto" : "none",
                  transition:    "opacity 0.18s ease, transform 0.18s ease",
                  backgroundColor: BG2,
                  border:        "1px solid rgba(224,120,48,0.3)",
                  borderTop:     "2px solid #E07830",
                  boxShadow:     "0 12px 36px rgba(0,0,0,0.65)",
                }}
                aria-label="Participate submenu"
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
                      className="group block px-4 py-3 transition-colors duration-150"
                      style={{
                        borderBottom: i < PARTICIPATE_ITEMS.length - 1
                          ? "1px solid rgba(245,237,216,0.05)"
                          : "none",
                        backgroundColor: isActive ? "rgba(224,120,48,0.08)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(245,237,216,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-special-elite, monospace)",
                          fontSize: "0.6rem",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: isActive ? "#E07830" : "rgba(245,237,216,0.75)",
                          display: "block",
                        }}
                      >
                        {isActive && <span style={{ color: "#3D8878", marginRight: "6px" }}>●</span>}
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-garamond, serif)",
                          fontStyle: "italic",
                          fontSize: "0.75rem",
                          color: "rgba(245,237,216,0.3)",
                          display: "block",
                          marginTop: "2px",
                        }}
                      >
                        {item.desc}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {AFTER_PARTICIPATE.map((l) => <NavLink key={l.href} {...l} />)}

            {/* Divider */}
            <div
              className="self-stretch mx-3"
              style={{ width: "1px", background: "rgba(224,120,48,0.18)" }}
            />

            {/* Tickets CTA */}
            <Link
              href="/tickets"
              className="transition-all duration-150 active:scale-95"
              style={{
                fontFamily: "var(--font-bebas-neue, Impact, sans-serif)",
                fontSize: "1rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                backgroundColor: pathname === "/tickets" ? "#B85A18" : "#E07830",
                color: "#0E0804",
                padding: "0.45rem 1.25rem",
                lineHeight: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F0923C"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = pathname === "/tickets" ? "#B85A18" : "#E07830"; }}
            >
              Get Tickets
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden flex flex-col gap-[5px] p-2"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className="block h-[1.5px] w-6 transition-all duration-250"
              style={{
                backgroundColor: "#E07830",
                transform: menuOpen ? "rotate(45deg) translate(4px, 4.5px)" : "none",
              }}
            />
            <span
              className="block h-[1.5px] w-6 transition-all duration-250"
              style={{
                backgroundColor: "#E07830",
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? "scaleX(0)" : "none",
              }}
            />
            <span
              className="block h-[1.5px] w-6 transition-all duration-250"
              style={{
                backgroundColor: "#E07830",
                transform: menuOpen ? "rotate(-45deg) translate(4px, -4.5px)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? "100vh" : "0",
          opacity: menuOpen ? 1 : 0,
          backgroundColor: BG2,
          borderTop: "1px solid rgba(224,120,48,0.2)",
        }}
      >
        <div className="px-5 py-4 flex flex-col">

          {BEFORE_PARTICIPATE.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 border-b transition-colors duration-150"
                style={{
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: active ? "#E07830" : "rgba(245,237,216,0.75)",
                  borderColor: "rgba(245,237,216,0.06)",
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Participate accordion */}
          <div style={{ borderBottom: "1px solid rgba(245,237,216,0.06)" }}>
            <button
              onClick={() => setParticipateOpen((v) => !v)}
              className="w-full flex items-center justify-between py-3"
              style={{
                fontFamily: "var(--font-special-elite, monospace)",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: participateActive ? "#E07830" : "rgba(245,237,216,0.75)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.75rem 0",
              }}
            >
              <span>Participate</span>
              <span
                className="text-[9px] transition-transform duration-200"
                style={{ transform: participateOpen ? "rotate(180deg)" : "rotate(0deg)", color: "#E07830" }}
              >
                ▾
              </span>
            </button>

            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: participateOpen ? "600px" : "0", opacity: participateOpen ? 1 : 0 }}
            >
              {PARTICIPATE_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href.includes("#") && pathname === item.href.split("#")[0]);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 py-3 pl-5"
                    style={{
                      fontFamily: "var(--font-special-elite, monospace)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: isActive ? "#E07830" : "rgba(245,237,216,0.55)",
                      borderTop: "1px solid rgba(245,237,216,0.04)",
                      display: "flex",
                    }}
                  >
                    <span style={{ color: "#3D8878", fontSize: "0.5rem", flexShrink: 0 }}>●</span>
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
                className="py-3 border-b transition-colors duration-150"
                style={{
                  fontFamily: "var(--font-special-elite, monospace)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: active ? "#E07830" : "rgba(245,237,216,0.75)",
                  borderColor: "rgba(245,237,216,0.06)",
                }}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 pb-2">
            <Link
              href="/tickets"
              className="block text-center active:scale-95 transition-transform"
              style={{
                fontFamily: "var(--font-bebas-neue, Impact, sans-serif)",
                fontSize: "1.15rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                backgroundColor: "#E07830",
                color: "#0E0804",
                padding: "0.85rem 1rem",
                lineHeight: 1,
              }}
            >
              Get Tickets
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
