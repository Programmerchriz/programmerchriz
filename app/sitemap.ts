import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getFeaturedProjects } from "@/lib/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url }, ...getFeaturedProjects().map(({ slug }) => ({ url: `${SITE.url}/projects/${slug}` }))];
}
