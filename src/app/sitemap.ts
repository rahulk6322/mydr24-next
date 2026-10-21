import type { MetadataRoute } from "next";
import { SERVICE_SLUGS } from "@/data/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/services", ...SERVICE_SLUGS.map((s) => `/services/${s}`), "/doctors", "/about", "/contact", "/legal"];
  const lastModified = new Date();
  return paths.map(
    (p): MetadataRoute.Sitemap[number] => ({
      url: `${site.url}${p}`,
      lastModified,
      changeFrequency: p === "/doctors" ? "hourly" : "weekly",
      priority: p === "" ? 1 : p.startsWith("/services") ? 0.8 : 0.6,
    }),
  );
}
