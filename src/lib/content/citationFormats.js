/** BibTeX / LaTeX helpers - no runtime dependency. Optional npm: `citation-js` for CSL → APA/Chicago. */

function slugifyKey(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 40);
}

function bibtexBrace(s) {
  return `{${String(s).replace(/\\/g, '\\\\').replace(/([{}])/g, '\\$1')}}`;
}

/** Title in BibTeX: double braces preserve capitalization. */
function bibtexTitle(s) {
  const inner = String(s).replace(/\\/g, '\\\\').replace(/([{}])/g, '\\$1');
  return `{{${inner}}}`;
}

/**
 * BibTeX citation key: always under `witold_` namespace.
 * If `raw` already starts with `witold_` (any case), it is kept after sanitizing.
 */
function normalizeWitoldCiteKey(raw) {
  let k = String(raw || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '');
  if (!k) k = 'entry';
  if (/^witold_/i.test(k)) return k;
  return `witold_${k}`;
}

function bibtexCitationKey(m) {
  const titlePart = slugifyKey(m.workTitle) || 'entry';
  const fallback =
    m.year != null ? `${String(m.year)}_${titlePart}` : titlePart;
  const raw = m.citeKey || fallback;
  return normalizeWitoldCiteKey(raw);
}

/** ISO `YYYY-MM-DD` for BibTeX `urldate`; long en-US for plain “Accessed …”. */
export function formatAccessedDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const human = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return { iso, human };
}

/**
 * @param {object} m
 * @param {string} m.workTitle
 * @param {Array<{ name: string, affiliation?: string }>} [m.creators]
 * @param {string} [m.author] BibTeX-style author string (fallback when creators absent)
 * @param {string|number} [m.year]
 * @param {string} [m.url]
 * @param {string} [m.organization] Fallback single affiliation when using `author` only
 * @param {string} [m.citeKey] Base key (e.g. blog_slug); normalized to witold_blog_slug.
 * @param {'misc'|'online'} [m.entryType]
 * @param {string} [m.accessed] Human access date (e.g. September 10, 2026)
 * @param {string} [m.urldate] ISO access date for BibTeX (e.g. 2026-09-10)
 */
export function buildPlainCitation(m) {
  const year = m.year != null ? String(m.year) : 'n.d.';
  const title = m.workTitle || 'Untitled';
  let people;
  if (Array.isArray(m.creators) && m.creators.length) {
    people = m.creators
      .map((c) => {
        const name = c?.name || 'Author';
        return c?.affiliation ? `${name} (${c.affiliation})` : name;
      })
      .join('; ');
  } else {
    const author = m.author || 'Author';
    const org = m.organization ? ` (${m.organization})` : '';
    people = `${author}${org}`;
  }
  const url = m.url ? ` ${m.url}` : '';
  const accessed = m.accessed ? ` Accessed ${m.accessed}.` : '';
  return `${title} (${year}), ${people}.${url}${accessed}`.trim();
}

export function buildBibTeX(m) {
  const key = bibtexCitationKey(m);
  const type = m.entryType === 'online' ? 'online' : 'misc';
  const authorField =
    Array.isArray(m.creators) && m.creators.length
      ? m.creators.map((c) => c?.name || 'Unknown').join(' and ')
      : m.author || 'Unknown';
  const lines = [
    `@${type}{${key},`,
    `  author = ${bibtexBrace(authorField)},`,
    `  title = ${bibtexTitle(m.workTitle || 'Untitled')},`,
  ];
  if (m.year != null) lines.push(`  year = ${bibtexBrace(String(m.year))},`);
  if (m.url) lines.push(`  url = ${bibtexBrace(m.url)},`);
  if (m.urldate) lines.push(`  urldate = ${bibtexBrace(String(m.urldate))},`);
  lines.push('}');
  return lines.join('\n');
}
