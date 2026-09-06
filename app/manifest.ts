import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "199X Coffee+Bar POS",
    short_name: "199X POS",
    description: "Coffee and bar point of sale for 199X Coffee+Bar",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    categories: ["business", "productivity"],
    orientation: "any",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
