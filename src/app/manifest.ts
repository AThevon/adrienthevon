import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} - ${SITE.role.en}`,
    short_name: SITE.shortName,
    description:
      "Creative developer based in Toulouse. Web, CLI and native. Portfolio, projects and experiments.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: SITE.colors.background,
    theme_color: SITE.colors.background,
    orientation: "portrait-primary",
    categories: ["portfolio", "developer", "design"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
