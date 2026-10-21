import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyDR24 by Accufly Healthcare",
    short_name: "MyDR24",
    description: "Talk to a doctor in minutes. AI-powered hybrid healthcare for Bharat.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0F1A",
    theme_color: "#0A0F1A",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
