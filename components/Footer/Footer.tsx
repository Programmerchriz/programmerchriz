import Link from "next/link";
import { FiArrowUpRight, FiDownload } from "react-icons/fi";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-line bg-surface">
      <div className="site-container flex flex-col gap-7 py-9 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-ink hover:text-accent">
            {SITE.name}<span className="text-accent" aria-hidden="true">.</span>
          </Link>
          <p className="text-xs leading-6 text-muted">Software engineer · </p>
        </div>
        <nav aria-label="Profiles and CV" className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {SITE.profiles.map((profile) => (
            <a
              key={profile.label}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 text-xs text-muted hover:text-accent"
            >
              {profile.label}
              <FiArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
          <a
            href="/pdf/Chris-Software-Engineer.pdf"
            download="Chris-Nwachukwu-CV.pdf"
            className="inline-flex min-h-11 items-center gap-1.5 text-xs text-muted hover:text-accent"
          >
            <FiDownload className="h-3.5 w-3.5" aria-hidden="true" /> Download CV
          </a>
        </nav>
      </div>
    </footer>
  );
}
