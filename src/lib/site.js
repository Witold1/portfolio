/** Site-wide defaults for citations and canonical URLs. */

export const SITE_ORGANIZATION = "Witold's Data Consulting";

/** Absolute page URL for canonical / Open Graph / share links (aligned with PageMeta). */
export function absolutePageUrl(pathname) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://witold1.github.io';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/portfolio';
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${site}${basePath}${p}`;
}

function isLocalDevHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * URL for share / copy / QR: current origin on localhost (unpublished dev content),
 * canonical production URL otherwise.
 */
export function sharePageUrl(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/portfolio';

  if (typeof window !== 'undefined' && isLocalDevHost(window.location.hostname)) {
    const origin = window.location.origin.replace(/\/$/, '');
    const bp = basePath.replace(/\/$/, '');
    return `${origin}${bp}${path}`;
  }

  return absolutePageUrl(path);
}

/** BibTeX / plain-text author when frontmatter omits `citationAuthor` and `author`. */
export function defaultCitationAuthor() {
  return process.env.NEXT_PUBLIC_DEFAULT_CITATION_AUTHOR || 'Yevtushenko, Vitaliy';
}

/**
 * Absolute page URL when `NEXT_PUBLIC_SITE_URL` is set (e.g. https://witold1.github.io).
 * Otherwise returns a root-relative path including `basePath` (works with next/link).
 */
export function pageCitationHref(pathname) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const bp = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withBase = `${bp}${path}`.replace(/\/{2,}/g, '/') || '/';
  if (!site) return withBase.startsWith('/') ? withBase : `/${withBase}`;
  return `${site}${withBase}`.replace(/([^/])\/?$/, '$1/');
}
