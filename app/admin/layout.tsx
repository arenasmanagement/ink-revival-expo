"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/admin",              label: "Dashboard",     icon: "⬛" },
  { href: "/admin/applications", label: "Applications",  icon: "📋" },
  { href: "/admin/capacity",     label: "Capacity",      icon: "📊" },
  { href: "/admin/activity",     label: "Activity Log",  icon: "📜" },
  { href: "/admin/staff",        label: "Staff",         icon: "👤" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't wrap the login page with sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f0e8", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: "240px",
        background: "#1a120a",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: mobileOpen ? 0 : undefined,
        bottom: 0,
        zIndex: 50,
        transition: "transform 0.2s",
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
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{
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

      {/* Mobile top bar */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        background: "#1a120a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid rgba(196,144,42,0.2)",
      }} className="flex md:hidden">
        <p style={{ color: "#F5EDD8", fontFamily: "var(--font-rye, serif)", fontSize: "14px", margin: 0 }}>
          WTTAF Admin
        </p>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", color: "#C4902A", fontSize: "20px", cursor: "pointer", padding: "4px" }}
        >
          ☰
        </button>
      </div>

      {/* Mobile sidebar (overlay) */}
      {mobileOpen && (
        <aside style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "240px",
          background: "#1a120a",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
        }} className="flex md:hidden">
          <div style={{ padding: "20px", borderBottom: "1px solid rgba(196,144,42,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "#F5EDD8", fontFamily: "var(--font-rye, serif)", fontSize: "14px", margin: 0 }}>
              Menu
            </p>
            <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "rgba(245,237,216,0.4)", fontSize: "18px", cursor: "pointer" }}>✕</button>
          </div>
          <nav style={{ flex: 1, padding: "12px 0" }}>
            {NAV.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 20px",
                  color: active ? "#F5EDD8" : "rgba(245,237,216,0.5)",
                  background: active ? "rgba(196,144,42,0.15)" : "transparent",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontFamily: "var(--font-special-elite, monospace)",
                  borderLeft: active ? "3px solid #C4902A" : "3px solid transparent",
                }}>
                  <span>{item.icon}</span> {item.label}
                </Link>
              );
            })}
          </nav>
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(196,144,42,0.2)" }}>
            <button onClick={handleLogout} style={{ background: "none", border: "1px solid rgba(245,237,216,0.15)", color: "rgba(245,237,216,0.4)", padding: "10px 14px", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", width: "100%" }}>
              Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: "0", paddingTop: "0" }} className="md:ml-[240px] pt-[52px] md:pt-0">
        {children}
      </main>
    </div>
  );
}
