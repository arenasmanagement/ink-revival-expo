/**
 * scripts/invite-admin.js
 * ─────────────────────────────────────────────────────────────────────────────
 * ONE-TIME script: sends a Supabase Auth invitation to the admin email.
 * The user receives a "Set Password" email and creates their own password
 * privately — no password is generated or stored here.
 *
 * USAGE (from project root):
 *   SUPABASE_URL=https://lhifiwrtznsjzetgdrnr.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
 *   node scripts/invite-admin.js
 *
 * Or, if .env.local is present:
 *   npx dotenv -e .env.local -- node scripts/invite-admin.js
 *
 * DO NOT commit .env.local or expose the service role key.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://westtninkrevival.com";

const INVITE_EMAIL = "arenasmanagementco@gmail.com";
const REDIRECT_TO = `${SITE_URL}/admin/login/new-password`;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  console.error("    Set them as environment variables before running this script.");
  process.exit(1);
}

async function inviteAdmin() {
  console.log(`\n📨  Sending invitation to ${INVITE_EMAIL}…`);
  console.log(`    Redirect after password setup: ${REDIRECT_TO}\n`);

  const res = await fetch(`${SUPABASE_URL}/auth/v1/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      email: INVITE_EMAIL,
      data: { role: "owner" },
      redirect_to: REDIRECT_TO,
    }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = body?.msg || body?.message || body?.error_description || JSON.stringify(body);
    console.error(`❌  Invite failed (${res.status}): ${msg}`);
    process.exit(1);
  }

  console.log("✅  Invitation sent successfully!");
  console.log(`    ${INVITE_EMAIL} will receive an email with a "Set Password" button.`);
  console.log("    Once clicked, they will be redirected to:", REDIRECT_TO);
  console.log("\n⚠️   Run this script only once per email address.");
}

inviteAdmin().catch((err) => {
  console.error("❌  Unexpected error:", err.message);
  process.exit(1);
});
