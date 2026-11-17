import { SITE } from "@/lib/site";
import type { Project } from "@/lib/data/projects";

export function homeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE.url}/#website`, url: SITE.url, name: SITE.title, description: SITE.description, about: { "@id": `${SITE.url}/#person` } },
      { "@type": "Person", "@id": `${SITE.url}/#person`, name: SITE.name, url: SITE.url, jobTitle: "Software Engineer", image: `${SITE.url}/images/headline.jpg`, homeLocation: { "@type": "Place", name: SITE.location }, sameAs: SITE.profiles.map(({ url }) => url) },
    ],
  };
}

export function caseStudyStructuredData(project: Project) {
  const url = `${SITE.url}/projects/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CreativeWork", "@id": `${url}#case-study`, url, name: `${project.title} — engineering case study`, description: project.shortDescription, author: { "@id": `${SITE.url}/#person` }, ...(project.images?.length ? { image: project.images.map(({ src }) => `${SITE.url}${src}`) } : {}) },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE.url}/#projects` },
        { "@type": "ListItem", position: 3, name: project.displayName, item: url },
      ] },
    ],
  };
}

export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
