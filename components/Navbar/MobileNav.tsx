"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiDownload, FiX } from "react-icons/fi";
import { CV_URL, NAV_LINKS } from "@/constants/constants";

type MobileNavProps = {
  showNav: boolean;
  closeNav: () => void;
  activeSection: string | null;
};

export default function MobileNav({ showNav, closeNav, activeSection }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !showNav) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1100px)");
    const onResize = () => { if (desktop.matches) closeNav(); };
    desktop.addEventListener("change", onResize);

    return () => {
      desktop.removeEventListener("change", onResize);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [showNav, closeNav]);

  return (
    <dialog ref={dialogRef} id="mobile-navigation" className="mobile-navigation"
      aria-labelledby="mobile-navigation-title" onCancel={closeNav}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const dialog = event.currentTarget;
        const controls = Array.from(dialog.querySelectorAll<HTMLElement>("a[href], button:not(:disabled), [tabindex='0']"))
          .filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(event) => { if (event.target === event.currentTarget) closeNav(); }}>
      <div className="mobile-nav-panel">
        <div className="mobile-nav-heading">
          <span id="mobile-navigation-title" className="eyebrow">Navigation</span>
          <button type="button" className="icon-button" onClick={closeNav} aria-label="Close navigation menu" autoFocus>
            <FiX aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.id} href={link.url} onClick={closeNav} className="mobile-nav-link"
              aria-current={activeSection === link.id ? "location" : undefined}>
              {link.label}<FiArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <a href={CV_URL} download="Chris-Nwachukwu-CV.pdf" className="button button-secondary" onClick={closeNav}>
          <FiDownload aria-hidden="true" /> Download CV
        </a>
        <p className="mobile-nav-note">Chris Nwachukwu<br /><span>Software Engineer · Lagos, Nigeria</span></p>
      </div>
    </dialog>
  );
}
