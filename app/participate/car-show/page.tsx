import type { Metadata } from "next";
import CarShowForm from "@/components/registration/CarShowForm";

export const metadata: Metadata = {
  title: "Car Show Registration | West TN Tattoo and Art Festival",
  description:
    "Enter your vehicle in the West TN Tattoo and Art Festival Car Show — March 12–14, 2027. $25 per vehicle. All makes and models welcome. Limited to 75 vehicles.",
};

const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:  0.95,
};

export default function CarShowPage() {
  return (
    <div style={{ backgroundColor: "#1A1008", minHeight: "100vh" }}>
      <section className="py-16 md:py-20" style={{ borderBottom: "1px solid rgba(61,136,120,0.3)", textAlign: "center" }}>
        <div className="container-festival max-w-3xl mx-auto px-4">
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#3D8878", marginBottom: "1rem" }}>
            Participate · Car Show
          </p>
          <h1 style={{ ...DISPLAY, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#F5EDD8", marginBottom: "1.5rem" }}>
            Car Show Entry
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(245,237,216,0.55)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            $25 per vehicle · All makes &amp; models welcome · Limited to 75 vehicles.
            Custom, classic, hot rods, lowriders, trucks — bring your ride.
          </p>
        </div>
      </section>
      <section className="py-14">
        <CarShowForm />
      </section>
    </div>
  );
}
