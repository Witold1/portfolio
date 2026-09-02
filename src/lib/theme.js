/** System / dark / light preference (resolved to light|dark via `html.dark`). */

/** Pref key (not legacy `theme` light|dark from the old binary toggle). */
const THEME_STORAGE_KEY = 'theme-pref';
export const THEME_PREFS = ['system', 'dark', 'light'];
export const THEME_DEFAULT = 'system';

function systemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function readStoredPreference() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (THEME_PREFS.includes(stored)) return stored;
  } catch {
    /* private mode / blocked storage */
  }
  return THEME_DEFAULT;
}

function resolveTheme(preference) {
  return preference === 'system' ? systemTheme() : preference;
}

/** Apply preference to <html>; returns { preference, resolved }. */
export function applyThemePreference(preference) {
  const pref = THEME_PREFS.includes(preference) ? preference : THEME_DEFAULT;
  const resolved = resolveTheme(pref);
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.dataset.themePref = pref;
  root.style.colorScheme = resolved;
  return { preference: pref, resolved };
}

export function setThemePreference(preference) {
  const result = applyThemePreference(preference);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, result.preference);
  } catch {
    /* ignore */
  }
  return result;
}

/** Inline FOUC script for _document (keeps storage key / prefs in sync). */
export function themeInitScript() {
  const k = JSON.stringify(THEME_STORAGE_KEY);
  const d = JSON.stringify(THEME_DEFAULT);
  return `(function(){try{var k=${k};var d=${d};var stored=localStorage.getItem(k);var pref=stored==="light"||stored==="dark"||stored==="system"?stored:d;var theme=pref==="system"?(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):pref;var r=document.documentElement;r.classList.toggle("dark",theme==="dark");r.dataset.themePref=pref;r.style.colorScheme=theme;}catch(e){var r=document.documentElement;r.dataset.themePref=${d};var theme=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";r.classList.toggle("dark",theme==="dark");r.style.colorScheme=theme;}})();`;
}
