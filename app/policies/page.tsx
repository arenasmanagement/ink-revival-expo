import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies | West TN Tattoo and Art Festival",
  description:
    "Refund policy, privacy policy, terms of service, and participant terms for the West TN Tattoo and Art Festival.",
  robots: { index: false }, // keep out of Google until organizer details are finalized
};

const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
  lineHeight:  0.95,
};

const HEADING: React.CSSProperties = {
  ...DISPLAY,
  fontSize:     "1.75rem",
  color:        "#E07830",
  marginBottom: "0.75rem",
  marginTop:    "2.5rem",
};

const BODY: React.CSSProperties = {
  fontFamily: "var(--font-body, system-ui, sans-serif)",
  fontSize:   "0.95rem",
  color:      "rgba(245,237,216,0.65)",
  lineHeight: 1.75,
};

const NOTE_BOX = {
  backgroundColor: "rgba(200,144,48,0.08)",
  border:          "1px solid rgba(200,144,48,0.3)",
  padding:         "1rem 1.25rem",
  marginBottom:    "1.5rem",
};

export default function PoliciesPage() {
  return (
    <div style={{ backgroundColor: "#1A1008", minHeight: "100vh" }}>
      {/* Header */}
      <section className="py-14 md:py-20" style={{ borderBottom: "1px solid rgba(224,120,48,0.2)", textAlign: "center" }}>
        <div className="container-festival max-w-3xl mx-auto px-4">
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#E07830", marginBottom: "1rem" }}>
            West TN Tattoo &amp; Art Festival
          </p>
          <h1 style={{ ...DISPLAY, fontSize: "clamp(3rem, 7vw, 5rem)", color: "#F5EDD8" }}>Policies</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="container-festival max-w-3xl mx-auto px-4">

          <div style={NOTE_BOX}>
            <p style={{ ...BODY, color: "rgba(200,144,48,0.9)", fontSize: "0.85rem" }}>
              <strong>Note:</strong> These policies are placeholders and must be reviewed and finalized before the site goes live with paid registrations. Sections marked [DEFINE] require confirmation of the legal organizing entity and its specific terms.
            </p>
          </div>

          {/* Refund Policy */}
          <h2 style={HEADING}>Refund Policy</h2>
          <div style={BODY}>
            <p className="mb-3">All sales are final unless otherwise stated. The following refund guidelines apply:</p>
            <p className="mb-2"><strong style={{ color: "#F5EDD8" }}>Artist / Food Truck applications:</strong> No payment is collected until after approval. Once payment is made, [DEFINE — e.g., refundable up to X days before event date].</p>
            <p className="mb-2"><strong style={{ color: "#F5EDD8" }}>Vendor booth fees:</strong> [DEFINE — e.g., 50% refund if cancelled 30+ days before event. No refund within 30 days].</p>
            <p className="mb-2"><strong style={{ color: "#F5EDD8" }}>Car show entry fee ($25):</strong> [DEFINE].</p>
            <p className="mb-2"><strong style={{ color: "#F5EDD8" }}>Sponsor packages:</strong> [DEFINE].</p>
            <p className="mb-2"><strong style={{ color: "#F5EDD8" }}>General admission tickets:</strong> [DEFINE].</p>
            <p className="mb-2">In the event the festival is cancelled due to circumstances outside our control, [DEFINE — refund or credit policy].</p>
            <p>To request a refund, contact us at <a href="mailto:contact@westtninkrevival.com" style={{ color: "#3D8878" }}>contact@westtninkrevival.com</a>.</p>
          </div>

          {/* Privacy Policy */}
          <h2 style={HEADING}>Privacy Policy</h2>
          <div style={BODY}>
            <p className="mb-3">The West TN Tattoo &amp; Art Festival (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your personal information. [DEFINE — insert legal operating entity name once confirmed.]</p>
            <p className="mb-2"><strong style={{ color: "#F5EDD8" }}>Information we collect:</strong> Name, email address, phone number, mailing address, and payment information when you register or purchase tickets. We do not store payment card details — all payments are processed securely by Stripe.</p>
            <p className="mb-2"><strong style={{ color: "#F5EDD8" }}>How we use it:</strong> To process registrations, send confirmation emails, communicate festival updates, and improve our services.</p>
            <p className="mb-2"><strong style={{ color: "#F5EDD8" }}>Email marketing:</strong> If you join our email list or register for the festival, you may receive updates about the event. You can unsubscribe at any time.</p>
            <p className="mb-2"><strong style={{ color: "#F5EDD8" }}>Third parties:</strong> We use Stripe for payment processing and Supabase for secure data storage. We do not sell your information.</p>
            <p>[DEFINE — add any additional privacy terms required for Tennessee or your specific data handling].</p>
          </div>

          {/* Terms of Service */}
          <h2 style={HEADING}>Terms of Service</h2>
          <div style={BODY}>
            <p className="mb-3">By accessing this website or registering for the West TN Tattoo &amp; Art Festival, you agree to these terms.</p>
            <p className="mb-2">The information on this site is provided for general information purposes. [DEFINE — add full terms].</p>
            <p className="mb-2">We reserve the right to refuse service to anyone for any reason at any time.</p>
            <p>[DEFINE — complete terms of service to be drafted by the organizing entity or their legal counsel].</p>
          </div>

          {/* Participant Terms */}
          <h2 style={HEADING}>Participant Terms</h2>
          <div style={BODY}>
            <p className="mb-3">All participants (artists, vendors, food trucks, sponsors, car show entrants) agree to the following:</p>
            <p className="mb-2">• Participants must comply with all applicable local, state, and federal laws and regulations.</p>
            <p className="mb-2">• Artists must hold a valid tattoo artist license for the state in which they are licensed.</p>
            <p className="mb-2">• Participants are responsible for their own equipment, merchandise, and booth setup.</p>
            <p className="mb-2">• The festival is not responsible for theft, loss, or damage to participant property.</p>
            <p className="mb-2">• Participants grant the West TN Tattoo &amp; Art Festival permission to photograph and video their booth/vehicle for promotional use.</p>
            <p className="mb-2">• The festival reserves the right to remove any participant who violates these terms without refund.</p>
            <p>[DEFINE — complete participant terms, booth rules, load-in/load-out times, insurance requirements, etc.].</p>
          </div>

          {/* Contact */}
          <h2 style={HEADING}>Contact</h2>
          <div style={BODY}>
            <p>Questions about these policies? Email us at{" "}
              <a href="mailto:contact@westtninkrevival.com" style={{ color: "#3D8878" }}>
                contact@westtninkrevival.com
              </a>{" "}
              or use our{" "}
              <a href="/contact" style={{ color: "#3D8878" }}>
                contact form
              </a>.
            </p>
            <p style={{ marginTop: "1rem", color: "rgba(245,237,216,0.3)", fontSize: "0.8rem" }}>
              Last updated: [DATE — to be finalized before launch]
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
