import type { MetadataRoute } from "next";
import { SITE_URL, IS_PRODUCTION } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Les déploiements preview ne doivent jamais être indexés : sinon Google peut
  // référencer une URL jetable à la place du domaine canonique.
  if (!IS_PRODUCTION) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
