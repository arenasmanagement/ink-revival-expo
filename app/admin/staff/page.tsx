export default function StaffPage() {
  return (
    <div className="px-4 py-6 md:px-8 md:py-8 pb-12" style={{ maxWidth: "700px" }}>
      <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
        Admin Portal
      </p>
      <h1 style={{ margin: "0 0 8px", fontSize: "24px", fontFamily: "var(--font-rye, serif)", color: "#1a120a" }}>
        Staff Access
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: "14px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>
        Staff account management will be available here. Currently operating as single-organizer portal.
      </p>

      <div style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "6px", padding: "28px" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: "14px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a", letterSpacing: "0.08em" }}>
          Current Access
        </h2>
        <div style={{ display: "flex", gap: "16px", padding: "12px 0", borderBottom: "1px solid #f0ebe0", alignItems: "center" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#C4902A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "16px", color: "#fff", fontFamily: "var(--font-rye, serif)" }}>O</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a" }}>Organizer (Owner)</p>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>Full access · Invitation-based login</p>
          </div>
          <span style={{ marginLeft: "auto", fontSize: "10px", padding: "3px 10px", borderRadius: "2px", background: "#dcfce7", color: "#166534", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.08em" }}>
            ACTIVE
          </span>
        </div>

        <p style={{ margin: "20px 0 0", fontSize: "12px", color: "#aaa", fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}>
          To add staff access, a multi-role authentication system (e.g. Supabase Auth with role-based policies) will be added in a future update. Contact your developer to enable staff invitations.
        </p>
      </div>

      <div style={{ marginTop: "20px", background: "#fef9ee", border: "1px solid #f0e8c8", borderRadius: "6px", padding: "16px 20px" }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#92400e", fontFamily: "var(--font-garamond, serif)" }}>
          <strong>Security note:</strong> This portal currently uses a single shared admin password (OWNER role). Never share this password. Staff logins with separate accounts and restricted permissions are on the roadmap.
        </p>
      </div>
    </div>
  );
}
