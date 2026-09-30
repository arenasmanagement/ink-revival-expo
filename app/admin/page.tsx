"use client";

import { useState } from "react";
import { CAPACITY, ADMISSION, PRICING } from "@/lib/eventData";

// Simple client-side PIN gate — not cryptographic, just keeps casual visitors out.
// The real data is in Studio 45's email (studio45tattoo2025@gmail.com).
// Replace with proper auth (NextAuth / Supabase Auth) when Supabase is wired.
const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "studio45";

const CAPACITY_ROWS = [
  { category: "Tattoo Artist Booths",  total: CAPACITY.tattooArtistBooths, price: `$${PRICING.tattooArtist.single.price} / $${PRICING.tattooArtist.double.price} (single/double) + permit`, type: "artist" },
  { category: "Vendor Booths",         total: CAPACITY.vendorBooths,        price: `$${PRICING.vendor.single.price} / $${PRICING.vendor.double.price} (single/double)`, type: "vendor" },
  { category: "Food Truck Spaces",     total: CAPACITY.foodTrucks,          price: `$${PRICING.foodTruck.space.price}`,                       type: "food-truck" },
  { category: "Sponsor Booths",        total: CAPACITY.sponsorBooths,       price: "Custom packages",                                         type: "sponsor" },
  { category: "Car Show Vehicles",     total: CAPACITY.carShowVehicles,     price: "See car-show page",                                       type: "car-show" },
  { category: "VIP Sponsors",          total: CAPACITY.vipSponsors,         price: "TBD — confirm with Studio 45",                            type: "sponsor" },
];

const ADMISSION_ROWS = [
  { label: "Friday, March 12",      price: `$${ADMISSION.friday.price}` },
  { label: "Saturday, March 13",    price: `$${ADMISSION.saturday.price}` },
  { label: "Sunday, March 14",      price: `$${ADMISSION.sunday.price}` },
  { label: "3-Day Weekend Pass",    price: `$${ADMISSION.weekend.price}` },
  { label: "Children (12 & under)", price: "FREE" },
];

export default function AdminPage() {
  const [pin, setPin]         = useState("");
  const [authed, setAuthed]   = useState(false);
  const [error, setError]     = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-ink-texture flex items-center justify-center px-4">
        <div className="bg-cream/90 border-2 border-gold/40 p-8 w-full max-w-sm text-center card-vintage">
          <p
            className="text-crimson text-xs tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            ★ Admin Access ★
          </p>
          <h1
            className="text-ink text-2xl mb-6"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            West TN Tattoo and Art Festival<br />Admin Panel
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              autoFocus
              className="w-full border border-ink/20 bg-white/80 px-4 py-3 text-ink text-sm text-center tracking-[0.3em] focus:outline-none focus:border-gold/60"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            />
            {error && (
              <p className="text-crimson text-xs" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                Incorrect PIN. Contact Studio 45.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-parchment-light-texture min-h-screen">
      {/* Header */}
      <div className="bg-ink-texture py-10 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p
              className="text-gold/60 text-[10px] uppercase tracking-[0.3em] mb-1"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Admin Panel
            </p>
            <h1
              className="text-cream text-2xl"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              West TN Tattoo and Art Festival 2027
            </h1>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="text-cream/40 text-xs uppercase tracking-wider hover:text-cream/70 transition-colors"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── Registration inbox reminder ── */}
        <div className="bg-gold/10 border-2 border-gold/40 p-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl flex-shrink-0">📬</span>
            <div>
              <h2
                className="text-ink text-lg mb-1"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                Check Your Email for Registrations
              </h2>
              <p
                className="text-ink/70 text-sm leading-relaxed mb-2"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                Every registration submitted through the website sends an admin notification to{" "}
                <strong>studio45tattoo2025@gmail.com</strong> with the registrant&apos;s full details, reference ID,
                and booth/space selection.
              </p>
              <p
                className="text-ink/50 text-xs italic"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                Real-time registration tracking (with live counts vs. capacity) will be available once Supabase is connected. Until then, use your email as the log.
              </p>
            </div>
          </div>
        </div>

        {/* ── Capacity reference ── */}
        <div>
          <h2
            className="text-ink text-xl mb-4"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            Capacity Reference
          </h2>
          <div className="border border-ink/15 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink/8">
                  <th className="text-left px-4 py-3 text-ink/60 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Category</th>
                  <th className="text-center px-4 py-3 text-ink/60 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Total Spaces</th>
                  <th className="text-right px-4 py-3 text-ink/60 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Rate</th>
                </tr>
              </thead>
              <tbody>
                {CAPACITY_ROWS.map((row, i) => (
                  <tr key={row.category} className={`border-t border-ink/8 ${i % 2 === 0 ? "bg-cream/40" : "bg-cream/70"}`}>
                    <td className="px-4 py-3 text-ink/80" style={{ fontFamily: "var(--font-garamond, serif)" }}>{row.category}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="text-gold font-bold text-lg"
                        style={{ fontFamily: "var(--font-rye, serif)" }}
                      >
                        {row.total}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-ink/60 text-xs" style={{ fontFamily: "var(--font-garamond, serif)" }}>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            className="text-ink/40 text-xs italic mt-2"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            These are the maximum capacities. Cross-reference with your registration emails to track availability.
          </p>
        </div>

        {/* ── Ticket pricing reference ── */}
        <div>
          <h2
            className="text-ink text-xl mb-4"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            General Admission Pricing
          </h2>
          <div className="border border-ink/15 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink/8">
                  <th className="text-left px-4 py-3 text-ink/60 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Ticket</th>
                  <th className="text-right px-4 py-3 text-ink/60 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {ADMISSION_ROWS.map((row, i) => (
                  <tr key={row.label} className={`border-t border-ink/8 ${i % 2 === 0 ? "bg-cream/40" : "bg-cream/70"}`}>
                    <td className="px-4 py-3 text-ink/80" style={{ fontFamily: "var(--font-garamond, serif)" }}>{row.label}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="text-crimson font-bold"
                        style={{ fontFamily: "var(--font-rye, serif)" }}
                      >
                        {row.price}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            className="text-ink/40 text-xs italic mt-2"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            Online ticket sales activate when Stripe is connected. Door sales at the event are handled directly.
          </p>
        </div>

        {/* ── Quick links ── */}
        <div>
          <h2
            className="text-ink text-xl mb-4"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            Quick Links
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Artist Applications",  href: "/artists" },
              { label: "Vendor Applications",  href: "/vendors#apply-vendor" },
              { label: "Food Truck Apps",       href: "/vendors#apply-food-truck" },
              { label: "Car Show",              href: "/car-show#register" },
              { label: "Competitions",          href: "/competitions" },
              { label: "Sponsor Info",          href: "/sponsors" },
              { label: "Tickets Page",          href: "/tickets" },
              { label: "Event Info",            href: "/event-info" },
              { label: "Contact",               href: "/contact" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block border border-ink/15 bg-cream/60 px-4 py-3 text-ink/70 text-xs uppercase tracking-wider hover:bg-cream hover:text-ink hover:border-gold/40 transition-all text-center"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Tech status ── */}
        <div className="border border-ink/12 bg-cream/50 p-6">
          <h2
            className="text-ink text-xl mb-4"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            System Status
          </h2>
          <div className="space-y-3">
            {[
              { name: "Registration Forms",     status: "live",    note: "Artists, Vendors, Food Trucks, Car Show — email notifications active" },
              { name: "Email (Resend)",          status: "live",    note: "Requires RESEND_API_KEY env var in Vercel" },
              { name: "Ticket Sales (Stripe)",   status: "pending", note: "Awaiting Stripe account setup — add STRIPE_SECRET_KEY to Vercel" },
              { name: "Inventory Tracking",      status: "pending", note: "Awaiting Supabase project setup — tracking via email for now" },
              { name: "VIP Weekend Ticket",      status: "hold",    note: "Pricing unconfirmed — do not publish until Studio 45 approves" },
            ].map((item) => (
              <div key={item.name} className="flex items-start gap-3">
                <span
                  className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${
                    item.status === "live"    ? "bg-green-500" :
                    item.status === "pending" ? "bg-gold" :
                    "bg-crimson"
                  }`}
                />
                <div>
                  <p
                    className="text-ink/80 text-sm font-medium"
                    style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                  >
                    {item.name}
                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 uppercase tracking-wider ${
                      item.status === "live"    ? "bg-green-100 text-green-700" :
                      item.status === "pending" ? "bg-gold/20 text-gold-dark" :
                      "bg-crimson/10 text-crimson"
                    }`}>
                      {item.status === "live" ? "Live" : item.status === "pending" ? "Pending Setup" : "On Hold"}
                    </span>
                  </p>
                  <p
                    className="text-ink/45 text-xs mt-0.5"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
