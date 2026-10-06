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
          //   - Stripe payment elements (js.stripe.com, *.stripe.com)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + inline (Next.js hydration) + Google Maps + Stripe JS
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' maps.googleapis.com js.stripe.com",
              // Styles: self + inline (Tailwind/CSS-in-JS) + Google Fonts
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              // Fonts: self + Google Fonts CDN
              "font-src 'self' fonts.gstatic.com",
              // Images: self + data URIs + Google Maps tiles + Stripe card brand logos
              "img-src 'self' data: maps.gstatic.com maps.googleapis.com *.googleapis.com *.stripe.com",
              // Frames: Google Maps + Stripe payment element iframes
              "frame-src maps.google.com www.google.com js.stripe.com *.stripe.com",
              // API fetches: self + Resend + Stripe API
              "connect-src 'self' api.resend.com api.stripe.com *.stripe.com",
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
