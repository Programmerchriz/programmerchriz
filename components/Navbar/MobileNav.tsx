import { NAV_LINKS } from "@/constants/constants";
import Link from "next/link";
import React from "react";
import { CgClose } from "react-icons/cg";

type MobileNavProps = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ showNav, closeNav }: MobileNavProps) => {
  const overlayState = showNav
    ? "opacity-70 pointer-events-auto"
    : "opacity-0 pointer-events-none";

  const navState = showNav ? "translate-x-0" : "translate-x-full";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeNav}
        aria-hidden="true"
        className={`fixed inset-0 z-[100002] h-screen w-full bg-black transition-opacity duration-500 ${overlayState}`}
      />

      {/* Navigation Panel */}
      <div
        className={`fixed right-0 top-0 z-[100050] flex h-full w-[80%] flex-col justify-center space-y-6 bg-cyan-800 text-white transition-transform duration-500 sm:w-[60%] ${navState}`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            onClick={closeNav}
            className="ml-12 w-fit border-b-[1.5px] border-white pb-1 text-xl font-medium text-white transition-all duration-200 hover:text-cyan-200 sm:text-[30px]"
          >
            {link.label}
          </Link>
        ))}

        {/* Close Button */}
        <button
          type="button"
          onClick={closeNav}
          aria-label="Close navigation menu"
          className="absolute right-[1.4rem] top-[2.1rem] cursor-pointer"
        >
          <CgClose className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
      </div>
    </>
  );
};

export default MobileNav;
