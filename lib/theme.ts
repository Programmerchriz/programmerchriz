export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "programmerchriz-theme";

// Run before first paint. Storage can be unavailable in private browsing.
export const themeInitScript = `(() => {
  let saved;
  try { saved = localStorage.getItem("${THEME_STORAGE_KEY}"); } catch {}
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved === "light" || saved === "dark" ? saved : systemDark ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();`;
