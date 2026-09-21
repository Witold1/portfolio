import { defaultCitationAuthor, pageCitationHref, SITE_ORGANIZATION } from '../site';

/**
 * @typedef {{ name: string, affiliation?: string }} CitationCreator
 */

function yearFromDate(data) {
  if (!data.created && !data.date) return undefined;
  const m = String(data.created ?? data.date).match(/^(\d{4})/);
  return m ? parseInt(m[1], 10) : undefined;
}

/** Base BibTeX key segment (no `witold_`); `citationFormats` prefixes `witold_` when building BibTeX. */
function citeKeyFrom(data, prefix) {
  if (data.citeKey) return String(data.citeKey).replace(/[^a-zA-Z0-9_-]/g, '');
  const s = String(data.slug || 'entry').replace(/[^a-zA-Z0-9_-]/g, '');
  return `${prefix}_${s}`;
}

/**
 * Normalize frontmatter `creators` entries.
 * @param {unknown} raw
 * @param {string | null | undefined} defaultAffiliation
 * @returns {CitationCreator[]}
 */
export function normalizeCreators(raw, defaultAffiliation) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const entry of raw) {
    if (typeof entry === 'string') {
      const name = entry.trim();
      if (!name) continue;
      out.push({
        name,
        ...(defaultAffiliation ? { affiliation: defaultAffiliation } : {}),
      });
      continue;
    }
    if (!entry || typeof entry !== 'object') continue;
    const name =
      typeof entry.name === 'string'
        ? entry.name.trim()
        : typeof entry.author === 'string'
          ? entry.author.trim()
          : '';
    if (!name) continue;
    const affiliationRaw =
      typeof entry.affiliation === 'string'
        ? entry.affiliation.trim()
        : typeof entry.organization === 'string'
          ? entry.organization.trim()
          : '';
    const affiliation = affiliationRaw || defaultAffiliation || undefined;
    out.push(affiliation ? { name, affiliation } : { name });
  }
  return out;
}

/**
 * Prefer `creators`; else one creator from `citationAuthor` / `author` / default.
 * @param {object} data
 * @returns {CitationCreator[]}
 */
export function resolveCreators(data) {
  const defaultAffiliation = data.citationOrganization ?? SITE_ORGANIZATION;
  const fromList = normalizeCreators(data.creators, defaultAffiliation);
  if (fromList.length) return fromList;

  const name = data.citationAuthor || data.author || defaultCitationAuthor();
  return defaultAffiliation
    ? [{ name, affiliation: defaultAffiliation }]
    : [{ name }];
}

/** Plain: `Name (Affil); Name2 (Affil2)` */
export function formatCreatorsPlain(creators) {
  if (!Array.isArray(creators) || !creators.length) return 'Author';
  return creators
    .map((c) => {
      const name = c?.name || 'Author';
      return c?.affiliation ? `${name} (${c.affiliation})` : name;
    })
    .join('; ');
}

/** BibTeX `author` field: `Name1 and Name2` */
export function formatCreatorsBibTeX(creators) {
  if (!Array.isArray(creators) || !creators.length) return 'Unknown';
  return creators.map((c) => c?.name || 'Unknown').join(' and ');
}

/**
 * @param {object} data gray-matter fields + slug
 * @param {{ pathnamePrefix: string }} opts `/blog` or `/projects` (no trailing slash)
 */
export function citeMetaFromContent(data, { pathnamePrefix }) {
  const pathname = `${pathnamePrefix}/${data.slug}/`;
  const workTitle = data.title || 'Untitled';
  const creators = resolveCreators(data);
  const author = formatCreatorsBibTeX(creators);
  const year = yearFromDate(data);
  const organization = data.citationOrganization ?? SITE_ORGANIZATION;
  const url = data.citationUrl || pageCitationHref(pathname);
  const citeKey = citeKeyFrom(data, pathnamePrefix.replace(/^\//, ''));
  const entryType = data.citationEntryType === 'online' ? 'online' : 'misc';

  return {
    workTitle,
    creators,
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
  const merged = { ...(b || {}), ...(p || {}) };

  // If patch supplies creators, re-derive author string; if only author/organization, rebuild creators.
  if (Array.isArray(merged.creators) && merged.creators.length) {
    const creators = normalizeCreators(merged.creators, merged.organization);
    merged.creators = creators;
    merged.author = formatCreatorsBibTeX(creators);
  } else if (merged.author || merged.organization) {
    merged.creators = resolveCreators({
      citationAuthor: merged.author,
      citationOrganization: merged.organization,
    });
  }

  return merged;
}

export function warnIfCitationAuthorMissing(doc, label) {
  if (process.env.NODE_ENV !== 'development') return;
  const hasCreators = Array.isArray(doc.creators) && doc.creators.length > 0;
  const has = hasCreators || doc.citationAuthor || doc.author;
  if (!has) {
    console.warn(
      `[citation] ${label}/${doc.slug}: add frontmatter creators (or citationAuthor) for accurate attribution; using NEXT_PUBLIC_DEFAULT_CITATION_AUTHOR / built-in default.`
    );
  }
}
