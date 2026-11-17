"use client";

import { useSyncExternalStore } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

const themeEvent = "portfolio-theme-change";
let memoryPreference: Theme | null = null;

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : memoryPreference;
  } catch {
    return memoryPreference;
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.dispatchEvent(new Event(themeEvent));
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot() { return null; }

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const followPreference = () => applyTheme(savedTheme() ?? (media.matches ? "dark" : "light"));
  const onSystemChange = () => { if (!savedTheme()) followPreference(); };
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      memoryPreference = null;
      followPreference();
    }
  };
  window.addEventListener(themeEvent, onChange);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", onSystemChange);
  return () => {
    window.removeEventListener(themeEvent, onChange);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", onSystemChange);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getSnapshot, getServerSnapshot);
  const label = theme ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Toggle color theme";

  return (
    <button type="button" className="icon-button theme-toggle" aria-label={label} title={label}
      onClick={() => {
        const next = getSnapshot() === "dark" ? "light" : "dark";
        memoryPreference = next;
        try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* Switching still works without storage. */ }
        applyTheme(next);
      }}>
      <FiSun className="theme-sun" aria-hidden="true" />
      <FiMoon className="theme-moon" aria-hidden="true" />
    </button>
  );
}
