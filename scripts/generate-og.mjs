/**
 * Generates the Open Graph social card (og-card.png, 1200×630)
 * Run: node scripts/generate-og.mjs
 * Output: public/og-card.png
 */
import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const W = 1200;
const H = 630;

// ── SVG left-panel (text + borders + ornaments) ──────────────────────────────
const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1A1008"/>
      <stop offset="100%" style="stop-color:#0D0804"/>
    </linearGradient>
    <!-- Right-side fade to let hero blend in -->
    <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#1A1008;stop-opacity:1"/>
      <stop offset="35%" style="stop-color:#1A1008;stop-opacity:0.6"/>
      <stop offset="100%" style="stop-color:#1A1008;stop-opacity:0.05"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Outer gold border -->
  <rect x="8" y="8" width="${W - 16}" height="${H - 16}"
        fill="none" stroke="#C4902A" stroke-width="2.5"/>
  <!-- Inner accent border -->
  <rect x="16" y="16" width="${W - 32}" height="${H - 32}"
        fill="none" stroke="rgba(196,144,42,0.25)" stroke-width="1"/>

  <!-- Corner diamonds -->
  <polygon points="26,20 32,26 26,32 20,26" fill="#C4902A"/>
  <polygon points="${W - 26},20 ${W - 20},26 ${W - 26},32 ${W - 32},26" fill="#C4902A"/>
  <polygon points="26,${H - 20} 32,${H - 26} 26,${H - 32} 20,${H - 26}" fill="#C4902A"/>
  <polygon points="${W - 26},${H - 20} ${W - 20},${H - 26} ${W - 26},${H - 32} ${W - 32},${H - 26}" fill="#C4902A"/>

  <!-- ── LEFT TEXT PANEL ── -->

  <!-- Eyebrow row -->
  <text x="46" y="96"
        font-family="Georgia,'Times New Roman',serif"
        font-size="12" fill="#C4902A" letter-spacing="7">
    ★  TATTOO CONVENTION  ★  HUNTINGDON, TN
  </text>
  <!-- Thin rule under eyebrow -->
  <line x1="46" y1="108" x2="560" y2="108" stroke="#C4902A" stroke-width="1.2"/>

  <!-- Main title — three lines -->
  <text x="46" y="196"
        font-family="Georgia,'Times New Roman',serif"
        font-size="68" fill="#F5E6C8" font-weight="bold">WEST TN</text>
  <text x="46" y="272"
        font-family="Georgia,'Times New Roman',serif"
        font-size="68" fill="#F5E6C8" font-weight="bold">INK REVIVAL</text>
  <text x="46" y="348"
        font-family="Georgia,'Times New Roman',serif"
        font-size="68" fill="#C4902A" font-weight="bold">EXPO</text>

  <!-- Rule under title -->
  <line x1="46" y1="368" x2="560" y2="368" stroke="#C4902A" stroke-width="1.5"/>

  <!-- Dates -->
  <text x="46" y="412"
        font-family="Georgia,'Times New Roman',serif"
        font-size="28" fill="#F5E6C8" font-weight="bold">MARCH 12 – 14, 2027</text>

  <!-- Location lines -->
  <text x="46" y="456"
        font-family="Georgia,'Times New Roman',serif"
        font-size="18" fill="rgba(245,230,200,0.72)">Carroll County TN Fairgrounds</text>
  <text x="46" y="484"
        font-family="Georgia,'Times New Roman',serif"
        font-size="18" fill="rgba(245,230,200,0.52)">Huntingdon, Tennessee</text>

  <!-- Thin rule -->
  <line x1="46" y1="508" x2="480" y2="508" stroke="rgba(196,144,42,0.3)" stroke-width="1"/>

  <!-- Domain -->
  <text x="46" y="534"
        font-family="Georgia,'Times New Roman',serif"
        font-size="14" fill="rgba(196,144,42,0.65)" letter-spacing="1.5">
    westtninkrevival.com
  </text>

  <!-- Star row -->
  <text x="46" y="572"
        font-family="Georgia,'Times New Roman',serif"
        font-size="11" fill="rgba(196,144,42,0.35)" letter-spacing="5">
    ★  ★  ★  ★  ★  ★  ★  ★  ★  ★
  </text>

  <!-- Fade overlay so right-side hero blends into the dark bg -->
  <rect x="420" y="0" width="${W - 420}" height="${H}" fill="url(#fade)"/>
</svg>`;

// ── Composite ────────────────────────────────────────────────────────────────
const heroPath = resolve(ROOT, "public", "hero-trans.png");
const heroBuffer = readFileSync(heroPath);

// Scale hero to fit inside 680×600 (right side), keep aspect ratio
// Original: 1536×1024 → ratio 3:2
// Target height: 600 → width = 900  (too wide)
// Target width:  680 → height = 453 (fits)
const heroResized = await sharp(heroBuffer)
  .resize({ width: 700, height: 600, fit: "inside" })
  .png()
  .toBuffer();

const heroMeta = await sharp(heroResized).metadata();
const heroW = heroMeta.width ?? 700;
const heroH = heroMeta.height ?? 467;

// Position hero: right-aligned, vertically centered, slight overhang allowed
const heroLeft = W - heroW - 18;
const heroTop = Math.round((H - heroH) / 2);

const output = resolve(ROOT, "public", "og-card.png");

await sharp(Buffer.from(svg))
  .resize(W, H)
  .composite([
    {
      input: heroResized,
      left: heroLeft,
      top: heroTop,
      blend: "over",
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(`✅ OG card generated → public/og-card.png (${W}×${H})`);
