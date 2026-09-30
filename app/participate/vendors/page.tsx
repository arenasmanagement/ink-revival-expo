import type { Metadata } from "next";
import VendorForm from "@/components/registration/VendorForm";

export const metadata: Metadata = {
  title: "Vendor Registration | West TN Tattoo and Art Festival",
  description:
    "Reserve a vendor booth at the West TN Tattoo and Art Festival — March 12–14, 2027. 10×10 and 10×20 spaces available. Register and pay online.",
};

const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:  0.95,
};

export default function VendorPage() {
  return (
    <div style={{ backgroundColor: "#1A1008", minHeight: "100vh" }}>
      <section
        className="py-16 md:py-20"
        style={{ borderBottom: "1px solid rgba(61,136,120,0.3)", textAlign: "center" }}
      >
        <div className="container-festival max-w-3xl mx-auto px-4">
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#3D8878", marginBottom: "1rem" }}>
            Participate · Vendors
          </p>
          <h1 style={{ ...DISPLAY, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#F5EDD8", marginBottom: "1.5rem" }}>
            Vendor Registration
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(245,237,216,0.55)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Art, jewelry, tattoo aftercare, clothing, festival goods, and more.
            Reserve your space and pay securely online via Stripe.
          </p>
        </div>
      </section>
      <section className="py-14">
        <VendorForm />
      </section>
    </div>
  );
}
