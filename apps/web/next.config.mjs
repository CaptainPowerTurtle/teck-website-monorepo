import { withPayload } from "@payloadcms/next/withPayload";
// @ts-check
import bundleAnalyzer from "@next/bundle-analyzer";
// import { env } from "./src/env";

// import { fileURLToPath } from "node:url";
// import createJiti from "jiti";
// const jiti = createJiti(fileURLToPath(import.meta.url));

// jiti("./src/env");

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const NEXT_PUBLIC_SERVER_URL = process.env.PROJECT_PRODUCTION_URL
  ? `https://${process.env.PROJECT_PRODUCTION_URL}`
  : undefined || process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@t3-oss/env-nextjs", "@t3-oss/env-core"],
  reactStrictMode: true,
  output: "standalone",
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  cacheHandler:
    process.env.NODE_ENV === "production" ? "./cache-handler.mjs" : undefined,
  experimental: {
    reactCompiler: true,
    ppr: "incremental",
  },
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item);

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(":", ""),
        };
      }),
    ],
  },
};
export default withPayload(withBundleAnalyzer(nextConfig));
