import { defaultCitationAuthor, pageCitationHref, SITE_ORGANIZATION } from '../site';

function yearFromFrontmatter(data) {
  if (data.year != null && data.year !== '') {
    const y = Number(data.year);
    return Number.isFinite(y) ? y : undefined;
  }
  if (data.date) {
    const m = String(data.date).match(/^(\d{4})/);
    if (m) return parseInt(m[1], 10);
  }
  return undefined;
}

/** Base BibTeX key segment (no `witold_`); `citationFormats` prefixes `witold_` when building BibTeX. */
function citeKeyFrom(data, prefix) {
  if (data.citeKey) return String(data.citeKey).replace(/[^a-zA-Z0-9_-]/g, '');
  const s = String(data.slug || 'entry').replace(/[^a-zA-Z0-9_-]/g, '');
  return `${prefix}_${s}`;
}

/**
 * @param {object} data gray-matter fields + slug
 * @param {{ pathnamePrefix: string }} opts `/blog` or `/projects` (no trailing slash)
 */
export function citeMetaFromContent(data, { pathnamePrefix }) {
  const pathname = `${pathnamePrefix}/${data.slug}/`;
  const workTitle = data.title || 'Untitled';
  const author = data.citationAuthor || data.author || defaultCitationAuthor();
  const year = yearFromFrontmatter(data);
  const organization = data.citationOrganization ?? SITE_ORGANIZATION;
  const url = data.citationUrl || pageCitationHref(pathname);
  const citeKey = citeKeyFrom(data, pathnamePrefix.replace(/^\//, ''));
  const entryType = data.citationEntryType === 'online' ? 'online' : 'misc';

  return {
    workTitle,
    author,
    year,
    url,
    organization,
    citeKey,
    entryType,
  };
}

export function citeMetaForBlogPost(post) {
  return citeMetaFromContent(post, { pathnamePrefix: '/blog' });
}

export function citeMetaForProject(project) {
  return citeMetaFromContent(project, { pathnamePrefix: '/projects' });
}

/**
 * Page meta (CitationProvider) merged with optional MDX `citeMeta` prop; undefined patch keys do not overwrite.
 * @param {object | null | undefined} base
 * @param {object | null | undefined} patch
 */
export function mergeCitationPageMeta(base, patch) {
  const b = base && typeof base === 'object' ? { ...base } : null;
  const p =
    patch && typeof patch === 'object'
      ? Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined))
      : null;
  if (!b && !p) return null;
  return { ...(b || {}), ...(p || {}) };
}

export function warnIfCitationAuthorMissing(doc, label) {
  if (process.env.NODE_ENV !== 'development') return;
  const has = doc.citationAuthor || doc.author;
  if (!has) {
    console.warn(
      `[citation] ${label}/${doc.slug}: add frontmatter citationAuthor (or author) for accurate attribution; using NEXT_PUBLIC_DEFAULT_CITATION_AUTHOR / built-in default.`
    );
  }
}
