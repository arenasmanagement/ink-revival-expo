import type { Metadata } from "next";
import FoodTruckForm from "@/components/registration/FoodTruckForm";

export const metadata: Metadata = {
  title: "Food Truck Application | West TN Tattoo and Art Festival",
  description:
    "Apply for a food truck space at the West TN Tattoo and Art Festival — March 12–14, 2027 in Huntingdon, Tennessee. $250 per space. Limited availability.",
};

const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:  0.95,
};

export default function FoodTruckPage() {
  return (
    <div style={{ backgroundColor: "#1A1008", minHeight: "100vh" }}>
      <section
        className="py-16 md:py-20"
        style={{ borderBottom: "1px solid rgba(224,120,48,0.2)", textAlign: "center" }}
      >
        <div className="container-festival max-w-3xl mx-auto px-4">
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#E07830", marginBottom: "1rem" }}>
            Participate · Food Trucks
          </p>
          <h1 style={{ ...DISPLAY, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#F5EDD8", marginBottom: "1.5rem" }}>
            Food Truck Application
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(245,237,216,0.55)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            $250 per space · Limited to 10 trucks · Applications reviewed individually.
            Fees are collected after approval. Diverse food offerings prioritized.
          </p>
        </div>
      </section>
      <section className="py-14">
        <FoodTruckForm />
      </section>
    </div>
  );
}
