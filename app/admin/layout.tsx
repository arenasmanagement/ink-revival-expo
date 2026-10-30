"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "./admin.css";

const NAV = [
  { href: "/admin",              label: "Dashboard",     icon: "⬛" },
  { href: "/admin/applications", label: "Applications",  icon: "📋" },
  { href: "/admin/capacity",     label: "Capacity",      icon: "📊" },
  { href: "/admin/activity",     label: "Activity Log",  icon: "📜" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/admin" && pathname.startsWith(href));
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const closeDrawer = useCallback(() => setMobileOpen(false), []);

  // Close the drawer whenever the route changes (adjust state during render,
  // the React-recommended alternative to setState inside an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  // Close it if the screen grows to desktop width (rotation, resize).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => { if (mq.matches) setMobileOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // While open: lock background scroll, Escape closes, Tab stays inside, focus moves in/out.
  useEffect(() => {
    const root = document.documentElement;
    if (!mobileOpen) {
      root.classList.remove("adm-scroll-lock");
      if (wasOpen.current) toggleRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    root.classList.add("adm-scroll-lock");
    const drawer = drawerRef.current;
    const focusables = () =>
      Array.from(drawer?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); setMobileOpen(false); return; }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.classList.remove("adm-scroll-lock");
    };
  }, [mobileOpen]);

  // Don't wrap auth pages with the sidebar — they render their own full-screen layout.
  // This covers: login, login/reset, login/new-password, setup-password, forgot-password.
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname === "/admin/setup-password" ||
    pathname === "/admin/forgot-password"
  ) {
    return <div className="adm">{children}</div>;
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div className="adm" style={{ display: "flex", minHeight: "100vh", background: "#f5f0e8", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* ── Desktop sidebar (≥768px). Visibility is controlled only by Tailwind
             (hidden md:flex) — an inline display value would override it. ── */}
      <aside
        style={{
          width: "240px",
          background: "#1a120a",
          flexShrink: 0,
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          zIndex: 50,
        }}
        className="hidden md:flex"
      >
        {/* Brand */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(196,144,42,0.2)" }}>
          <p style={{ color: "#C4902A", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 6px", fontFamily: "var(--font-special-elite, monospace)" }}>
            Admin Portal
          </p>
          <p style={{ color: "#F5EDD8", fontSize: "15px", fontFamily: "var(--font-rye, serif)", margin: 0, lineHeight: 1.3 }}>
            West TN Tattoo<br />& Art Festival
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                color: active ? "#F5EDD8" : "rgba(245,237,216,0.5)",
                background: active ? "rgba(196,144,42,0.15)" : "transparent",
                textDecoration: "none",
                fontSize: "13px",
                fontFamily: "var(--font-special-elite, monospace)",
                letterSpacing: "0.05em",
                borderLeft: active ? "3px solid #C4902A" : "3px solid transparent",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: "14px" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(196,144,42,0.2)" }}>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1px solid rgba(245,237,216,0.15)",
              color: "rgba(245,237,216,0.4)",
              padding: "8px 14px",
              fontSize: "11px",
              fontFamily: "var(--font-special-elite, monospace)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              width: "100%",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => { (e.target as HTMLButtonElement).style.color = "rgba(245,237,216,0.7)"; }}
            onMouseOut={(e) => { (e.target as HTMLButtonElement).style.color = "rgba(245,237,216,0.4)"; }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar (<768px) ── */}
      <header
        className="adm-topbar flex md:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          background: "#1a120a",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "52px",
          padding: "0 6px 0 16px",
          borderBottom: "1px solid rgba(196,144,42,0.2)",
          boxSizing: "border-box",
        }}
      >
        <Link href="/admin" style={{ color: "#F5EDD8", fontFamily: "var(--font-rye, serif)", fontSize: "15px", textDecoration: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          WTTAF Admin
        </Link>
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="adm-mobile-drawer"
          style={{ background: "none", border: "none", color: "#C4902A", fontSize: "22px", cursor: "pointer", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          ☰
        </button>
      </header>

      {/* ── Mobile drawer: overlays the page, never pushes it ── */}
      <div
        className="adm-scrim md:hidden"
        data-open={mobileOpen}
        onClick={closeDrawer}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, background: "rgba(10,6,2,0.6)", zIndex: 40 }}
      />
      <aside
        id="adm-mobile-drawer"
        ref={drawerRef}
        className="adm-drawer flex md:hidden"
        data-open={mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Admin menu"
        inert={!mobileOpen}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          background: "#1a120a",
          zIndex: 50,
          flexDirection: "column",
          boxShadow: "4px 0 24px rgba(0,0,0,0.35)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ padding: "16px 8px 16px 20px", borderBottom: "1px solid rgba(196,144,42,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: "#C4902A", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 4px", fontFamily: "var(--font-special-elite, monospace)" }}>
              Admin Portal
            </p>
            <p style={{ color: "#F5EDD8", fontFamily: "var(--font-rye, serif)", fontSize: "15px", margin: 0, lineHeight: 1.3 }}>
              West TN Tattoo<br />& Art Festival
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close menu"
            style={{ background: "none", border: "1px solid rgba(245,237,216,0.15)", borderRadius: "4px", color: "rgba(245,237,216,0.7)", fontSize: "18px", cursor: "pointer", width: "44px", height: "44px", flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
        <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} onClick={closeDrawer} aria-current={active ? "page" : undefined} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minHeight: "48px",
                padding: "0 20px",
                color: active ? "#F5EDD8" : "rgba(245,237,216,0.65)",
                background: active ? "rgba(196,144,42,0.15)" : "transparent",
                textDecoration: "none",
                fontSize: "15px",
                fontFamily: "var(--font-special-elite, monospace)",
                letterSpacing: "0.04em",
                borderLeft: active ? "3px solid #C4902A" : "3px solid transparent",
              }}>
                <span aria-hidden="true">{item.icon}</span> {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(196,144,42,0.2)" }}>
          <button onClick={handleLogout} style={{ background: "none", border: "1px solid rgba(245,237,216,0.25)", color: "rgba(245,237,216,0.75)", minHeight: "44px", padding: "0 14px", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", width: "100%" }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content — margin controlled by Tailwind (md:ml-[240px]); no inline override */}
      <main style={{ flex: 1, minWidth: 0 }} className="adm-main md:ml-[240px] pt-[52px] md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
