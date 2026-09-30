import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";
import { EVENT, REGISTRATION_URLS } from "@/lib/eventData";

const { sponsorRegistrationUrl, vendorRegistrationUrl } = REGISTRATION_URLS;

export const metadata: Metadata = {
  title: "Contact — Reach the West TN Ink Revival Expo Team | Huntingdon, TN",
  description:
    "Contact West TN Ink Revival Expo — call 731-513-4271 or send a message. Questions about attending, tattoo artist applications, vendor booths, food truck spaces, or sponsoring West Tennessee's first tattoo convention (March 12–14, 2027, Huntingdon, TN).",
  alternates: { canonical: "https://www.westtninkrevival.com/contact" },
  openGraph: {
    title: "Contact — West TN Ink Revival Expo 2027",
    description: "Call 731-513-4271 or send a message. Artist applications, vendor booths, sponsorships, and general questions about West Tennessee's first tattoo convention.",
    url: "https://www.westtninkrevival.com/contact",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.westtninkrevival.com" },
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://www.westtninkrevival.com/contact" },
  ],
};

export default function ContactPage() {
  return (
    <div className="bg-parchment-light-texture min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Header */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg,transparent,#C4902A,transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg,transparent,#C4902A,transparent)",
          }}
        />
        <SectionHeading
          eyebrow="Reach Out"
          title="Contact West TN Ink Revival Expo"
          subtitle="Get in touch with the West TN Ink Revival Expo team."
          light
          as="h1"
          className="max-w-4xl mx-auto"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Contact info ── */}
          <div>
            <h2
              className="text-ink text-2xl mb-6"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              Get in Touch
            </h2>
            <div className="divider-ink mb-6" style={{ width: "80px" }} />

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-crimson text-xl flex-shrink-0">★</span>
                <div>
                  <p
                    className="text-ink font-semibold text-sm uppercase tracking-wider mb-1"
                    style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                  >
                    Phone
                  </p>
                  <a
                    href={`tel:${EVENT.contact.phone}`}
                    className="text-ink/70 text-lg hover:text-crimson transition-colors"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {EVENT.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-crimson text-xl flex-shrink-0">★</span>
                <div>
                  <p
                    className="text-ink font-semibold text-sm uppercase tracking-wider mb-1"
                    style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                  >
                    Producer
                  </p>
                  <p
                    className="text-ink/70 text-lg"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {EVENT.producer}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-crimson text-xl flex-shrink-0">★</span>
                <div>
                  <p
                    className="text-ink font-semibold text-sm uppercase tracking-wider mb-1"
                    style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                  >
                    Event
                  </p>
                  <p
                    className="text-ink/70"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {EVENT.dates.display}
                  </p>
                  <p
                    className="text-ink/70"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {EVENT.venue.name}
                  </p>
                  <p
                    className="text-ink/70"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {EVENT.venue.city}, {EVENT.venue.state}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-8 border-t border-ink/10 pt-8">
              <p
                className="text-ink/50 text-xs tracking-[0.2em] uppercase mb-4"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                Quick Links
              </p>
              <div className="space-y-2">
                {[
                  {
                    label: "Apply as a Tattoo Artist",
                    href: "/artists#apply",
                    external: false,
                  },
                  {
                    label: "Reserve a Vendor Booth",
                    href: vendorRegistrationUrl,
                    external: true,
                  },
                  {
                    label: "Food Truck Application",
                    href: "/vendors#food-trucks",
                    external: false,
                  },
                  {
                    label: "Register as a Sponsor",
                    href: sponsorRegistrationUrl,
                    external: true,
                  },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    {...(l.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-center gap-2 text-ink/60 hover:text-crimson text-sm transition-colors"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    <span className="text-crimson text-xs">→</span> {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column: contact form ── */}
          <div>
            <h2
              className="text-ink text-2xl mb-6"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              Send a Message
            </h2>
            <div className="divider-ink mb-6" style={{ width: "80px" }} />
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  );
}
