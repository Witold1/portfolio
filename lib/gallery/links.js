import { isExternalUrl } from '../isExternalUrl';

/**
 * @param {string} href
 * @returns {'blog' | 'project' | 'external' | 'more'}
 */
export function galleryLinkKind(href) {
  if (typeof href !== 'string' || !href.trim()) return 'more';
  if (isExternalUrl(href)) return 'external';
  const path = href.replace(/^\/+/, '');
  if (/^blog(\/|$)/i.test(path)) return 'blog';
  if (/^projects(\/|$)/i.test(path)) return 'project';
  return 'more';
}

/**
 * Canonicalize authored gallery links: `blog/x`, `../blog/x` → `/blog/x`.
 * External URLs are left as-is.
 * @param {unknown} href
 * @returns {string}
 */
export function normalizeGalleryLinkHref(href) {
  const raw = typeof href === 'string' ? href.trim() : String(href ?? '').trim();
  if (!raw) return '';
  if (isExternalUrl(raw)) return raw;
  const path = raw.replace(/^(?:\.\.\/|\.\/)+/, '').replace(/^\/+/, '');
  return path ? `/${path}` : '';
}

/** @param {string | string[] | undefined | null} link */
export function normalizeGalleryLinkList(link) {
  if (!link) return [];
  const list = Array.isArray(link) ? link : [link];
  return list.map(normalizeGalleryLinkHref).filter(Boolean);
}

/**
 * Site destinations (blog/project) → lightbox toolbar.
 * Everything else (external sources, misc paths) → details panel.
 *
 * @param {string | string[] | undefined | null} link
 * @returns {{ site: { href: string, kind: 'blog' | 'project' }[], detail: { href: string, kind: 'external' | 'more' }[] }}
 */
export function partitionGalleryLinks(link) {
  const site = [];
  const detail = [];
  for (const href of normalizeGalleryLinkList(link)) {
    const kind = galleryLinkKind(href);
    if (kind === 'blog' || kind === 'project') site.push({ href, kind });
    else detail.push({ href, kind });
  }
  return { site, detail };
}

function externalHostLabel(href) {
  try {
    return new URL(href).hostname.replace(/^www\./, '') || 'Source';
  } catch {
    return 'Source';
  }
}

function numberedLabel(base, ariaBase, index, total) {
  if (total <= 1) return { label: base, ariaLabel: ariaBase };
  return {
    label: `${base} ${index}`,
    ariaLabel: `${ariaBase}, link ${index}`,
  };
}

const SITE_LINK_COPY = {
  blog: { label: 'Open in blog', aria: 'Open related blog post' },
  project: { label: 'Open in projects', aria: 'Open related project' },
};

/**
 * Toolbar labels for site links only. Numbers only when the same kind repeats.
 * @param {{ href: string, kind: 'blog' | 'project' }[]} siteLinks
 */
export function galleryToolbarLinkEntries(siteLinks) {
  const kindTotals = Object.create(null);
  for (const { kind } of siteLinks) kindTotals[kind] = (kindTotals[kind] || 0) + 1;
  const kindSeen = Object.create(null);

  return siteLinks.map(({ href, kind }) => {
    const copy = SITE_LINK_COPY[kind];
    kindSeen[kind] = (kindSeen[kind] || 0) + 1;
    return {
      href,
      ...numberedLabel(copy.label, copy.aria, kindSeen[kind], kindTotals[kind]),
    };
  });
}

/**
 * Details panel link labels (sources / misc).
 * @param {{ href: string, kind: 'external' | 'more' }[]} detailLinks
 */
export function galleryDetailLinkEntries(detailLinks) {
  const moreTotal = detailLinks.reduce((n, l) => n + (l.kind === 'more' ? 1 : 0), 0);
  let moreSeen = 0;

  return detailLinks.map(({ href, kind }) => {
    if (kind === 'external') {
      const host = externalHostLabel(href);
      return {
        href,
        label: host,
        ariaLabel: `Open external source: ${host}`,
      };
    }
    moreSeen += 1;
    return {
      href,
      ...numberedLabel('Read more', 'Read more about this item', moreSeen, moreTotal),
    };
  });
}

/** @param {{ kind: string }[]} detailLinks */
export function galleryDetailsLinkLabel(detailLinks) {
  if (detailLinks.length === 0) return '';
  return detailLinks.every((entry) => entry.kind === 'external') ? 'Source:' : 'Links:';
}

/**
 * Normalize YAML `link` for storage on a gallery item (string | string[] | omit).
 * @param {unknown} link
 * @returns {string | string[] | undefined}
 */
export function normalizeGalleryItemLink(link) {
  if (link == null) return undefined;
  if (typeof link === 'string' && !link.trim()) return undefined;
  const list = normalizeGalleryLinkList(
    Array.isArray(link) ? link : typeof link === 'string' ? link : undefined,
  );
  if (list.length === 0) return undefined;
  return list.length === 1 && !Array.isArray(link) ? list[0] : list;
}
