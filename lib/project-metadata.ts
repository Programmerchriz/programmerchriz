import type { Metadata } from "next";
import type { Project } from "./data/projects";
import { SITE } from "@/lib/site";

export function projectMetadata(project: Project): Metadata {
  const title = `${project.displayName} | Chris Nwachukwu`;
  const path = `/projects/${project.slug}`;
  const image = project.images?.[0] ?? { src: "/images/s1-og-premium-img.jpg", alt: "Chris Nwachukwu — Software Engineer" };
  return {
    title, description: project.shortDescription, alternates: { canonical: path },
    openGraph: { type: "article", siteName: SITE.name, title, description: project.shortDescription, url: path, images: [{ url: image.src, alt: image.alt }] },
    twitter: { card: "summary_large_image", title, description: project.shortDescription, images: [{ url: image.src, alt: image.alt }] },
  };
}
