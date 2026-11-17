import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowUpRight, FiHome } from "react-icons/fi";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Page not found | ${SITE.name}` },
  description: "This page could not be found. Explore Chris Nwachukwu's engineering projects or return to the homepage.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: { title: `Page not found | ${SITE.name}`, description: "Explore Chris Nwachukwu's engineering projects or return home.", images: [{ url: "/images/s1-og-premium-img.jpg", alt: SITE.title }] },
  twitter: { card: "summary_large_image", title: `Page not found | ${SITE.name}`, description: "Explore the projects or return to the homepage.", images: ["/images/s1-twitter-premium-img.jpg"] },
};

export default function NotFoundPage() {
  return (
    <main id="main-content" tabIndex={-1} className="relative isolate flex min-h-[65svh] items-center py-20 text-ink sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage: "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />
      <div className="site-container">
        <p className="eyebrow text-accent">404 / Page not found</p>
        <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          This page could not be found.
        </h1>
        <p className="mt-6 max-w-lg text-sm leading-7 text-muted sm:text-base">
          The link may have changed or the address may be incorrect. You can return home or explore my project case studies.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="button button-primary"><FiHome aria-hidden="true" /> Return home</Link>
          <Link href="/#projects" className="button button-secondary">Browse projects <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
      </div>
    </main>
  );
}
