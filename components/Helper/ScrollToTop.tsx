"use client";

import { useSyncExternalStore } from "react";
import { FiArrowUp } from "react-icons/fi";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getSnapshot = () => window.scrollY > 300;
const getServerSnapshot = () => false;

export default function ScrollToTop() {
  const isVisible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function scrollToTop() {
    // Preserve a useful keyboard position when this control leaves the page.
    document.getElementById("main-content")?.focus({ preventScroll: true });
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  if (!isVisible) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-sm hover:border-accent hover:bg-raised hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <FiArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
