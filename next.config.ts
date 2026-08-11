import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Les routes OG lisent les polices et le logo depuis assets/og au runtime.
  // Le file tracing ne détecte pas ces lectures, il faut les inclure explicitement
  // sinon l'image plante en prod avec un ENOENT.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/og/**"],
    "/twitter-image": ["./assets/og/**"],
    "/work/[slug]/opengraph-image": ["./assets/og/**"],
    "/work/[slug]/twitter-image": ["./assets/og/**"],
  },
};

export default withNextIntl(nextConfig);
