"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/constants";
import Nav from "./Nav";
import MobileNav from "./MobileNav";

export default function ReponsiveNav() {
  const [showNav, setShowNav] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const pathname = usePathname();
  const closeNav = useCallback(() => setShowNav(false), []);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = NAV_LINKS.map(({ id }) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section !== null,
    );
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }
    }, { rootMargin: "-20% 0px -60% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <Nav openNav={() => setShowNav(true)} showNav={showNav}
        activeSection={pathname === "/" ? activeSection : "projects"} />
      <MobileNav showNav={showNav} closeNav={closeNav}
        activeSection={pathname === "/" ? activeSection : "projects"} />
    </>
  );
}
