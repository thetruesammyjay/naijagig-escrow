import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@naijagig/ui", "@naijagig/types", "@naijagig/config"],

  // Keep native Node.js packages out of the server bundle.
  // @stellar/stellar-sdk → sodium-native uses native addons that webpack
  // cannot statically analyze. These are ONLY used client-side via dynamic
  // import inside lib/stellar.ts, never in server components or API routes.
  serverExternalPackages: [
    "@stellar/stellar-sdk",
    "@stellar/stellar-base",
    "sodium-native",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev.api.trustlesswork.com",
      },
      {
        protocol: "https",
        hostname: "api.trustlesswork.com",
      },
      {
        protocol: "https",
        hostname: "stellar.org",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  productionBrowserSourceMaps: false,
};

export default nextConfig;
