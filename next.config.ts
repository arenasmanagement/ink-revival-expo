import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Prevent MIME sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Control referrer info
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions policy — disable unused browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Content Security Policy
          // Allows:
          //   - Google Maps iframes (maps.googleapis.com, maps.gstatic.com, www.google.com)
          //   - Google Fonts (fonts.googleapis.com, fonts.gstatic.com)
          //   - Resend API calls (api.resend.com)
          //   - Jotform embeds (form.jotform.com, *.jotform.com)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + inline (Next.js needs unsafe-inline for hydration) + Google Maps
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' maps.googleapis.com",
              // Styles: self + inline (Tailwind/CSS-in-JS) + Google Fonts
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              // Fonts: self + Google Fonts CDN
              "font-src 'self' fonts.gstatic.com",
              // Images: self + data URIs + Google Maps tiles
              "img-src 'self' data: maps.gstatic.com maps.googleapis.com *.googleapis.com",
              // Frames: Google Maps + Jotform
              "frame-src maps.google.com www.google.com form.jotform.com *.jotform.com",
              // API fetches: self + Resend + Jotform (for form submissions)
              "connect-src 'self' api.resend.com *.jotform.com",
              // Workers (Next.js service worker)
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
