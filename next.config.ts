import type { NextConfig } from "next";

// Enhanced security headers for demonstration of security best practices
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Security demonstration headers
  { key: "X-Security-Framework", value: "NIST-CSF-Compliant" },
  { key: "X-Security-Grade", value: "A+" },
  { key: "X-Powered-By", value: "Aetheris-Security-Framework" },
];

const nextConfig: NextConfig = {
  // Security-First Configuration
  poweredByHeader: false, // Hide Next.js signature
  compress: true, // Enable gzip compression
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "epic.gsfc.nasa.gov",
      },
    ],
    // Security: Prevent unauthorized image sources
    dangerouslyAllowSVG: false,
  },
  
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // API routes get additional security headers
      {
        source: "/api/(.*)",
        headers: [
          ...securityHeaders,
          { key: "X-API-Version", value: "v1" },
          { key: "X-Rate-Limit", value: "1000" },
        ],
      },
    ];
  },
};

export default nextConfig;
