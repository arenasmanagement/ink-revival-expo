// ─── Central Event Data ───────────────────────────────────────────────────
// Edit this file to update event details across the entire site.

export const EVENT = {
  name: "West TN Ink Revival Expo",
  edition: "First Annual",
  tagline: "Three days of tattoo artistry, art, live entertainment, unique vendors, food, car culture, and community in West Tennessee.",
  // Dual positioning: tattoo convention + art festival
  subtypes: ["Tattoo & Art Festival", "Tattoo Convention", "Car Show"],
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
    fullAddress: "201 Fairgrounds Road, Huntingdon, TN 38344",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=201+Fairgrounds+Road%2C+Huntingdon%2C+TN+38344",
  },
  producer: "Studio 45 Tattoos",
  contact: {
    phone: "731-513-4271",
    email: "contact@westtninkrevival.com",
  },
  social: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
  },
} as const;

// ─── Capacity Limits ──────────────────────────────────────────────────────
// Official capacity set by Studio 45. These are hard limits — registration
// must close when any category hits its cap.
export const CAPACITY = {
  tattooArtistBooths: 35,    // 35 artist booth slots
  vendorBooths: 35,          // 35 vendor booth slots (each 10×10; double = 2 slots)
  foodTrucks: 10,            // 10 food truck spaces
  sponsorBooths: 10,         // 10 sponsor booth slots
  carShowVehicles: 75,       // 75 car show entries
  vipSponsors: 10,           // 10 VIP sponsor slots
} as const;

// ─── Admission / Ticket Pricing ───────────────────────────────────────────
export const ADMISSION = {
  friday:   { label: "Friday Single-Day",   price: 15,  day: "Friday, March 12" },
  saturday: { label: "Saturday Single-Day", price: 20,  day: "Saturday, March 13" },
  sunday:   { label: "Sunday Single-Day",   price: 15,  day: "Sunday, March 14" },
  weekend:  { label: "3-Day Weekend Pass",  price: 40,  days: "March 12–14, 2027" },
  children: { label: "Children (12 & under)", price: 0, note: "FREE with a paying adult" },
  // VIP Weekend at $75 — pricing to be confirmed with Studio 45 before publishing
  // vipWeekend: { label: "VIP Weekend", price: 75 },
} as const;

// ─── Participation Pricing ────────────────────────────────────────────────
export const PRICING = {
  vendor: {
    single: { label: "10×10 Vendor Booth", price: 250, slots: 1 },
    double: { label: "Double Vendor Booth (10×20)", price: 400, slots: 2 },
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
    permitNote: "All tattoo artists must hold a valid Tennessee tattoo permit. Permit fees are the responsibility of the artist.",
  },
  carShow: {
    note: "Car show entry pricing and registration details coming soon. Contact the expo to express interest early.",
  },
  competitions: {
    note: "Competition registration and entry fees coming soon. Categories will include best tattoo styles and car show awards.",
  },
} as const;

// ─── Registration URLs ────────────────────────────────────────────────────
// JotForm links for categories that have external forms.
// On-site forms use /api/register routes.
export const REGISTRATION_URLS = {
  sponsorRegistrationUrl: "https://form.jotform.com/253035510680045",
  vendorRegistrationUrl: "https://form.jotform.com/253028360362047",
  // Internal routes (built into this site):
  artistApplicationPath: "/artists#apply",
  foodTruckApplicationPath: "/vendors#food-trucks",
  carShowApplicationPath: "/car-show#register",
  competitionsPath: "/competitions",
  ticketsPath: "/tickets",
} as const;

// Flat list used by Footer quick links
export const NAV_LINKS = [
  { label: "Event Info", href: "/event-info" },
  { label: "Schedule", href: "/schedule" },
  { label: "Artists", href: "/artists" },
  { label: "Vendors", href: "/vendors" },
  { label: "Car Show", href: "/car-show" },
  { label: "Competitions", href: "/competitions" },
  { label: "Tickets", href: "/tickets" },
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
    a: "West TN Ink Revival Expo will be held at the Carroll County TN Fairgrounds, 201 Fairgrounds Road, Huntingdon, TN 38344. On-site parking is available.",
  },
  {
    q: "What are the ticket prices?",
    a: "General admission: Friday $15, Saturday $20, Sunday $15. A 3-day weekend pass is $40. Children 12 and under are FREE with a paying adult.",
  },
  {
    q: "Where can I buy tickets?",
    a: "Tickets will be available for purchase online at westtninkrevival.com/tickets and at the door. Purchase in advance to guarantee entry.",
  },
  {
    q: "Is the event open to the public?",
    a: "Yes! West TN Ink Revival Expo is open to the public. Families, tattoo enthusiasts, art lovers, car fans, and community members are all welcome.",
  },
  {
    q: "Can I get tattooed at the event?",
    a: "Yes. Attending tattoo artists will be available for walk-ups and scheduled appointments. Contact individual artists directly to book appointments in advance.",
  },
  {
    q: "Is there a car show?",
    a: "Yes! The West TN Ink Revival Expo includes a car show component. Car show entry details and registration will be announced soon. Contact us at 731-513-4271 to express interest early.",
  },
  {
    q: "Are there competitions at the event?",
    a: "Yes. The expo will feature tattoo competitions and car show awards. Competition categories and registration details will be announced closer to the event.",
  },
  {
    q: "How do I apply as a tattoo artist?",
    a: "Visit the Artists page and submit an application. Eligible tattoo artists may receive booth space up to 10×20 at no additional booth fee with the required paid permit. All applications are subject to review and approval. Capacity is limited to 35 artist booths.",
  },
  {
    q: "How do I reserve a vendor booth?",
    a: "Visit the Vendors page to review booth options and submit an application. A 10×10 booth is $250 and a double booth is $400. Only 35 vendor booths are available — apply early.",
  },
  {
    q: "Are food-truck spaces available?",
    a: "Yes! Food truck space is available for $200. Only 10 food truck spaces are available. Visit the Vendors page or contact the expo to apply.",
  },
  {
    q: "How can my business become a sponsor?",
    a: "We offer Basic Sponsorship at $500 and VIP Sponsorship at $1,000. Only 10 sponsor booth slots and 10 VIP sponsor spots are available. Visit the Sponsors page to review packages and apply.",
  },
  {
    q: "Can minors attend?",
    a: "Yes. The event is family-friendly. Children 12 and under are FREE with a paying adult. Note: tattoo services are only available to adults 18 and older per Tennessee law.",
  },
  {
    q: "Is parking available?",
    a: "On-site parking is available at the Carroll County TN Fairgrounds. Additional parking details will be confirmed as the event approaches.",
  },
  {
    q: "Are refunds available?",
    a: "Refund and cancellation policies will be published with registration and ticket details. All policies will be included in purchase and application confirmations.",
  },
  {
    q: "Who is producing the event?",
    a: "West TN Ink Revival Expo is presented and produced by Studio 45 Tattoos. For questions, call 731-513-4271.",
  },
  {
    q: "How many booths / spaces are available?",
    a: "Capacity is strictly limited: 35 tattoo artist booths, 35 vendor booths, 10 food truck spaces, 10 sponsor booths, and 75 car show vehicle entries. Register early to secure your spot.",
  },
] as const;
