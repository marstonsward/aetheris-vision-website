import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent browsers from guessing MIME types
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent clickjacking — site cannot be embedded in iframes on other domains
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stop sending referrer info to third-party domains
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for 2 years, include subdomains
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Disable browser features not needed on this site
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Content Security Policy — whitelist all sources used by the site
  {
    key: "Content-Security-Policy",
    value: [
      // Only load scripts from own domain + Giscus + Cal.com
      "script-src 'self' 'unsafe-inline' https://giscus.app https://cal.com https://app.cal.com",
      // Allow iframes from Giscus + Cal.com
      "frame-src 'self' https://giscus.app https://cal.com https://app.cal.com",
      // Allow styles from own domain + inline (needed for Tailwind)
      "style-src 'self' 'unsafe-inline' https://giscus.app",
      // Allow images from own domain + GitHub (Giscus avatars) + data URIs
      "img-src 'self' data: https://avatars.githubusercontent.com https://github.githubassets.com",
      // Allow connections to Giscus API + Formspree (handled server-side but kept for fetch)
      "connect-src 'self' https://giscus.app https://api.github.com",
      // fonts
      "font-src 'self'",
      // default fallback
      "default-src 'self'",
    ]
      .join("; ")
      .trim(),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
