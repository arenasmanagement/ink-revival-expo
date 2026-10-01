// ─── Central Event Data ───────────────────────────────────────────────────
// Edit this file to update event details across the entire site.

export const EVENT = {
  name: "West TN Tattoo and Art Festival",
  shortName: "West TN Tattoo & Art Festival",
  edition: "First Annual",
  tagline: "Three days of tattoo artistry, fine art, live entertainment, vendors, food, car culture, and community in West Tennessee.",
  // Dual positioning: tattoo festival + art festival
  subtypes: ["Tattoo & Art Festival", "Tattoo Convention", "Car Show"],
  dates: {
    start: new Date("2027-03-12T09:00:00"),
    end:   new Date("2027-03-14T18:00:00"),
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
  contact: {
    phone: "731-513-4271",
    email: "contact@westtninkrevival.com",
  },
  social: {
    facebook:  "#",
    instagram: "#",
    tiktok:    "#",
  },
} as const;

// ─── Capacity Limits ──────────────────────────────────────────────────────
export const CAPACITY = {
  tattooArtistBooths: 35,   // 35 artist booth slots
  vendorBooths:       35,   // 35 vendor booth slots (each 10×10; double = 2 slots)
  foodTrucks:         10,   // 10 food truck spaces
  sponsorBooths:      10,   // 10 sponsor booth slots
  carShowVehicles:    75,   // 75 car show entries
  vipSponsors:        10,   // 10 VIP sponsor slots
} as const;

// ─── Admission / Ticket Pricing ───────────────────────────────────────────
export const ADMISSION = {
  friday:        { label: "Friday Single-Day",      price: 15,  day: "Friday, March 12" },
  saturday:      { label: "Saturday Single-Day",    price: 20,  day: "Saturday, March 13" },
  sunday:        { label: "Sunday Single-Day",      price: 15,  day: "Sunday, March 14" },
  weekend:       { label: "3-Day Weekend Pass",     price: 40,  days: "March 12–14, 2027" },
  children:      { label: "Children (12 & under)",  price: 0,   note: "FREE with a paying adult" },
  // ─ VIP ATTENDEE TICKET (internal ID: ticket_vip_weekend) ─────────────────
  // Confirmed price: $75. Confirmed benefits: NOT YET PROVIDED by organizers.
  // Do NOT advertise specific benefits until confirmed. Show "details coming soon."
  // Distinct from sponsorship_vip ($1,000 VIP Sponsor package).
  // Do NOT open online sales until benefits are confirmed and organizer approves.
  // ─ UNRESOLVED ITEM: "ad 100" from source material — meaning unknown ──────
  // A "$100" line item appears in source material context "Vip weekend ad 100".
  // This has NOT been confirmed as any ticket, add-on, or package.
  // FLAG FOR ORGANIZER CLARIFICATION before associating with any product.
  // ─────────────────────────────────────────────────────────────────────────
  ticketVipWeekend: {
    label:       "VIP Weekend Pass",
    internalId:  "ticket_vip_weekend",  // NEVER use bare "vip" — see sponsorship_vip below
    price:       75,
    days:        "March 12–14, 2027",
    benefits:    null,  // Benefits not yet confirmed by organizer — do not invent
    salesActive: false, // Set true only when organizer confirms benefits + approves sales
    note:        "VIP package details coming soon.",
  },
} as const;

// ─── Participation Pricing ────────────────────────────────────────────────
// Confirmed pricing for 2027 event.
export const PRICING = {
  tattooArtist: {
    single: { label: "Artist Booth 10×10",       price: 150 },
    double: { label: "Artist Double Booth 10×20", price: 300 },
    additionalSpace: { label: "Additional 10×10 Space", price: 150 },
    permit: {
      inState:    { label: "TN Tattoo Permit (In-State)",    price: 50 },
      outOfState: { label: "TN Tattoo Permit (Out-of-State)", price: 100 },
    },
    note: "All tattoo artists must hold a valid Tennessee tattoo permit. Artist booth fee is separate from the permit fee. All applications subject to review and approval.",
  },
  vendor: {
    single: { label: "Vendor Booth 10×10",       price: 150, slots: 1 },
    double: { label: "Double Vendor Booth 10×20", price: 300, slots: 2 },
    additionalSpace: { label: "Additional 10×10 Space", price: 150 },
  },
  foodTruck: {
    space: { label: "Food Truck / Food Vendor Space", price: 250 },
  },
  carShow: {
    registration: { label: "Car Show Vehicle Registration", price: 25 },
    note: "Spectator access included with general festival admission. Vehicle registration required for all car show entries.",
  },
  competitions: {
    entry: { label: "Competition Entry (per category)", price: 25 },
    note: "Entry fee is $25 per competition category. Categories include tattoo style competitions and car show awards.",
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
      label:      "VIP Sponsorship",
      internalId: "sponsorship_vip",  // NEVER use bare "vip" — distinct from ticket_vip_weekend
      price: 1000,
      benefits: [
        "Everything in Basic Sponsorship",
        "Larger featured placement in all advertising",
        "Premium logo placement on event merchandise",
        "10×10 sponsor booth at the event",
        "VIP sponsor recognition throughout the festival",
      ],
    },
    booth: { label: "Sponsor Booth 10×10", price: 50 },
  },
} as const;

// ─── Registration URLs ────────────────────────────────────────────────────
export const REGISTRATION_URLS = {
  // Internal routes (built into this site):
  artistApplicationPath:    "/artists#apply",
  vendorApplicationPath:    "/vendors#apply-vendor",
  foodTruckApplicationPath: "/vendors#apply-food-truck",
  carShowApplicationPath:   "/car-show#register",
  competitionsPath:         "/competitions",
  sponsorPath:              "/sponsors",
  ticketsPath:              "/tickets",
} as const;

// Flat list used by Footer quick links
export const NAV_LINKS = [
  { label: "Event Info",    href: "/event-info" },
  { label: "Schedule",      href: "/schedule" },
  { label: "Artists",       href: "/artists" },
  { label: "Vendors",       href: "/vendors" },
  { label: "Car Show",      href: "/car-show" },
  { label: "Competitions",  href: "/competitions" },
  { label: "Tickets",       href: "/tickets" },
  { label: "Sponsors",      href: "/sponsors" },
  { label: "FAQ",           href: "/faq" },
  { label: "Contact",       href: "/contact" },
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
    q: "Where will the festival be held?",
    a: "West TN Tattoo and Art Festival will be held at the Carroll County TN Fairgrounds, 201 Fairgrounds Road, Huntingdon, TN 38344. On-site parking is available.",
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
    a: "Yes! West TN Tattoo and Art Festival is open to the public. Families, tattoo enthusiasts, art lovers, car fans, and community members are all welcome.",
  },
  {
    q: "Can I get tattooed at the event?",
    a: "Yes. Attending tattoo artists will be available for walk-ups and scheduled appointments. Contact individual artists directly to book appointments in advance.",
  },
  {
    q: "Is there a car show?",
    a: "Yes! The festival includes a full car show. Vehicle registration is $25. Spectator access is included with general festival admission. Contact us at 731-513-4271 to register your vehicle early.",
  },
  {
    q: "Are there competitions at the event?",
    a: "Yes. The festival will feature tattoo competitions and car show awards. Competition entry is $25 per category. Categories and registration details will be announced closer to the event.",
  },
  {
    q: "How do I apply as a tattoo artist?",
    a: "Visit the Artists page and submit an application. Artist booth space is $150 for a 10×10 or $300 for a 10×20. All artists must also hold a valid Tennessee tattoo permit ($50 in-state, $100 out-of-state). All applications are subject to review and approval. Capacity is limited to 35 artist booths.",
  },
  {
    q: "How do I reserve a vendor booth?",
    a: "Visit the Vendors page to review booth options and submit an application. A 10×10 booth is $150 and a double booth is $300. Only 35 vendor booths are available — apply early.",
  },
  {
    q: "Are food truck spaces available?",
    a: "Yes! Food truck and food vendor space is $250. Only 10 spaces are available. Visit the Vendors page or contact the festival to apply.",
  },
  {
    q: "How can my business become a sponsor?",
    a: "We offer Basic Sponsorship at $500 and VIP Sponsorship at $1,000. Sponsor booth space is $50 for a 10×10. Visit the Sponsors page to review packages and apply.",
  },
  {
    q: "Can minors attend?",
    a: "Yes. The event is family-friendly. Children 12 and under are FREE with a paying adult. Tattoo services are only available to adults 18 and older per Tennessee law.",
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
    q: "How can I contact the festival?",
    a: "For questions, email contact@westtninkrevival.com or use the Contact page on this website.",
  },
  {
    q: "How many booths and spaces are available?",
    a: "Capacity is strictly limited: 35 tattoo artist booths, 35 vendor booths, 10 food truck spaces, 10 sponsor booths, and 75 car show vehicle entries. Register early to secure your spot.",
  },
] as const;
