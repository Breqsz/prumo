import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/planos", "/sobre", "/trabalhos", "/contato"].map(
    (path) => ({ url: `${SITE_URL}${path}`, lastModified: now }),
  );
  const caseRoutes = projects.map((p) => ({
    url: `${SITE_URL}/trabalhos/${p.slug}`,
    lastModified: now,
  }));
  return [...staticRoutes, ...caseRoutes];
}
