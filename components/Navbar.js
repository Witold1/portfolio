import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import {
  THEME_DEFAULT,
  THEME_PREFS,
  readStoredPreference,
  setThemePreference,
} from '../lib/theme';

const navLogoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/icons/nav-logo.svg`;

const THEME_META = {
  system: { label: 'System theme', nextHint: 'switch to dark' },
  dark: { label: 'Dark theme', nextHint: 'switch to light' },
  light: { label: 'Light theme', nextHint: 'switch to system' },
};

function IconSun({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconMoon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconSystem({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

const THEME_ICONS = {
  system: IconSystem,
  dark: IconMoon,
  light: IconSun,
};

function nextThemePref(current) {
  const i = THEME_PREFS.indexOf(current);
  return THEME_PREFS[i < 0 ? 0 : (i + 1) % THEME_PREFS.length];
}

export default function Navbar() {
  const [themePref, setThemePref] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setThemePref(readStoredPreference());
  }, []);

  const cycleTheme = useCallback(() => {
    const next = nextThemePref(themePref ?? readStoredPreference());
    const { preference } = setThemePreference(next);
    setThemePref(preference);
  }, [themePref]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const pref = themePref ?? THEME_DEFAULT;
  const Icon = THEME_ICONS[pref];
  const meta = THEME_META[pref];

  return (
    <nav className="site-chrome site-chrome-header px-4 py-3 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-bold font-mono hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-800 dark:focus-visible:outline-zinc-200 rounded-sm"
        >
          <img src={navLogoSrc} width={40} height={40} alt="" className="h-9 w-9 shrink-0" />
          <span>Witold&apos;s Data</span>
        </Link>
        <div className="flex items-center gap-3 md:gap-5">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-5 text-[1.0625rem] font-semibold tracking-tight">
            <Link href="/gallery" className="hover:underline">Gallery</Link>
            <Link href="/projects" className="hover:underline">Projects</Link>
            <Link href="/blog" className="hover:underline">Blog</Link>
            <Link href="/about" className="hover:underline">About</Link>
          </div>
          <button
            type="button"
            onClick={cycleTheme}
            aria-label={`${meta.label}, ${meta.nextHint}`}
            title={meta.label}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
          >
            <Icon className="h-6 w-6" />
          </button>
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 flex flex-col space-y-2.5 border-t border-zinc-200 dark:border-zinc-800 pt-3 text-[1.0625rem] font-semibold tracking-tight transition-all duration-300">
          <Link href="/gallery" className="hover:underline" onClick={toggleMenu}>Gallery</Link>
          <Link href="/projects" className="hover:underline" onClick={toggleMenu}>Projects</Link>
          <Link href="/blog" className="hover:underline" onClick={toggleMenu}>Blog</Link>
          <Link href="/about" className="hover:underline" onClick={toggleMenu}>About</Link>
        </div>
      )}
    </nav>
  );
}
