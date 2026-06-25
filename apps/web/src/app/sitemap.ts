import type { MetadataRoute } from "next";
import { getAllStaticRoutes } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const routes = getAllStaticRoutes();

  return routes.map((route) => ({
    url: `${baseUrl}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority:
      route === "/" ? 1 : route.startsWith("/blog") || route.startsWith("/glossary") ? 0.7 : 0.8,
  }));
}
