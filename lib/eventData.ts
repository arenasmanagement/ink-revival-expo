// ─── Central Event Data ───────────────────────────────────────────────────
// Edit this file to update event details across the entire site.

export const EVENT = {
  name: "West TN Ink Revival Expo",
  edition: "First Annual",
  tagline: "Three days of tattoo artistry, live entertainment, unique vendors, food, community, and traditional tattoo culture in West Tennessee.",
  dates: {
    start: new Date("2027-03-12T09:00:00"),
    end: new Date("2027-03-14T18:00:00"),
    display: "March 12–14, 2027",
    year: "2027",
    days: ["Friday, March 12", "Saturday, March 13", "Sunday, March 14"],
  },
  venue: {
    name: "Carroll County TN Fairgrounds",
    address: "201 Fairgrounds Road",
    city: "Huntingdon",
    state: "Tennessee",
    zip: "38344",
    // Full formatted address for maps / travel copy
    fullAddress: "201 Fairgrounds Road, Huntingdon, TN 38344",
    // Encoded Google Maps directions URL
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=201+Fairgrounds+Road%2C+Huntingdon%2C+TN+38344",
  },
  producer: "Studio 45 Tattoos",
  contact: {
    phone: "731-513-4271",
    // email: not published yet
  },
  social: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
  },
} as const;

export const PRICING = {
  vendor: {
    single: { label: "10×10 Vendor Booth", price: 250 },
    double: { label: "Double Vendor Booth", price: 400 },
  },
  foodTruck: {
    space: { label: "Food Truck Space", price: 200 },
  },
  sponsorship: {
    basic: {
      label: "Basic Sponsorship",
      price: 500,
      benefits: [
        "Logo featured in event advertising",
        "Business included on event merchandise",
        "Sponsor recognition during promotional campaigns",
        "Social-media sponsor recognition",
      ],
    },
    vip: {
      label: "VIP Sponsorship",
      price: 1000,
      benefits: [
        "Everything in Basic Sponsorship",
        "Larger featured placement in all advertising",
        "Premium logo placement on event merchandise",
        "10×10 vendor booth at the event",
        "VIP sponsor recognition throughout the convention",
      ],
    },
  },
  tattooArtist: {
    note: "Eligible tattoo artists may receive booth space up to 10×20 at no additional booth fee with the required paid permit. All artists are subject to approval and must meet convention and health-department requirements.",
  },
} as const;

// ─── Registration URLs ────────────────────────────────────────────────────
// Update these to change registration links site-wide.
export const REGISTRATION_URLS = {
  sponsorRegistrationUrl: "https://form.jotform.com/253035510680045",
  vendorRegistrationUrl: "https://form.jotform.com/253028360362047",
} as const;

// Flat list used by Footer quick links — Navbar defines its own nested structure
export const NAV_LINKS = [
  { label: "Event Info", href: "/event-info" },
  { label: "Schedule", href: "/schedule" },
  { label: "Artists", href: "/artists" },
  { label: "Vendors", href: "/vendors" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const TATTOO_SPECIALTIES = [
  "American Traditional",
  "Black and Gray",
  "Realism",
  "Neo-Traditional",
  "Fine Line",
  "Lettering",
  "Color",
  "Blackwork",
  "Illustrative",
  "Japanese",
] as const;

export const FAQ_ITEMS = [
  {
    q: "Where will the expo be held?",
    a: "West TN Ink Revival Expo will be held at the Carroll County TN Fairgrounds, 201 Fairgrounds Road, Huntingdon, TN 38344. On-site parking is available. Additional details will be confirmed closer to the event.",
  },
  {
    q: "When will tickets become available?",
    a: "Ticket information will be announced soon. Sign up for our email list to be the first to know when tickets go on sale.",
  },
  {
    q: "Is the event open to the public?",
    a: "Yes! West TN Ink Revival Expo is open to the public. Families, tattoo enthusiasts, collectors, and community members are all welcome.",
  },
  {
    q: "Can I get tattooed at the event?",
    a: "Yes. Attending tattoo artists will be available for walk-ups and scheduled appointments. Contact individual artists directly to book appointments in advance.",
  },
  {
    q: "How do I book with an attending artist?",
    a: "Once our artist lineup is announced, each artist's portfolio and contact information will be listed on the Artists page. We recommend reaching out directly to book in advance.",
  },
  {
    q: "Can minors attend?",
    a: "Age policy details will be confirmed and posted prior to the event. Check back soon or join our email list for updates.",
  },
  {
    q: "How do I apply as a tattoo artist?",
    a: "The official tattoo artist application is coming soon. In the meantime, visit the Artists page and contact the West TN Ink Revival team directly to express interest. Eligible tattoo artists may receive booth space up to 10×20 at no additional booth fee with the required paid permit. All applications are subject to review and approval.",
  },
  {
    q: "How do I reserve a vendor booth?",
    a: "Visit the Vendors page to review booth options and submit an application. A 10×10 booth is $250 and a double booth is $400. Spaces are limited — apply early.",
  },
  {
    q: "Are food-truck spaces available?",
    a: "Yes! Food truck space is available for $200. The official food truck application is coming soon — contact the West TN Ink Revival team to express interest early.",
  },
  {
    q: "How can my business become a sponsor?",
    a: "We offer Basic Sponsorship at $500 and VIP Sponsorship at $1,000. Visit the Sponsors page to review packages and submit an inquiry.",
  },
  {
    q: "Is parking available?",
    a: "Parking details will be confirmed as the event approaches. The Carroll County TN Fairgrounds typically offers on-site parking. Check back for updates.",
  },
  {
    q: "Are refunds available?",
    a: "Refund and cancellation policies will be published when tickets and applications are finalized. Details will be included in all purchase and application confirmations.",
  },
  {
    q: "Who is producing the event?",
    a: "West TN Ink Revival Expo is presented and produced by Studio 45 Tattoos. For questions, call 731-513-4271.",
  },
] as const;
