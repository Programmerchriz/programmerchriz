import type { Metadata } from "next";
import Home from "@/components/Home/Home";
import { SITE } from "@/lib/site";
import { homeStructuredData, jsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: SITE.title, description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: SITE.name, title: SITE.title, description: SITE.description, images: [{ url: "/images/s1-og-premium-img.jpg", width: 1200, height: 630, alt: SITE.title }] },
};

export default function HomePage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeStructuredData()) }} /><Home /></>;
}
