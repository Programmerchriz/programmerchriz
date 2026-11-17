"use client";

import Link from "next/link";
import { FiArrowUpRight, FiCode, FiDownload, FiMenu } from "react-icons/fi";
import { CV_URL, NAV_LINKS } from "@/constants/constants";
import ThemeToggle from "@/components/Theme/ThemeToggle";

type NavProps = {
  openNav: () => void;
  showNav: boolean;
  activeSection: string | null;
};

export default function Nav({ openNav, showNav, activeSection }: NavProps) {
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="wordmark" aria-label="Chris Nwachukwu, home">
          <span className="wordmark-icon"><FiCode aria-hidden="true" /></span>
          <span>chris<span className="wordmark-period">.</span></span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {NAV_LINKS.map((link) => (
            <Link key={link.id} href={link.url} className="nav-link"
              aria-current={activeSection === link.id ? "location" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a href={CV_URL} download="Chris-Nwachukwu-CV.pdf" className="header-cv">
            <FiDownload aria-hidden="true" /> <span>CV</span>
          </a>
          <ThemeToggle />
          <Link href="/#contact" className="button button-primary header-contact">
            Get in touch <FiArrowUpRight aria-hidden="true" />
          </Link>
          <button type="button" className="icon-button menu-trigger" onClick={openNav}
            aria-label="Open navigation menu" aria-expanded={showNav} aria-controls="mobile-navigation" aria-haspopup="dialog">
            <FiMenu aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
