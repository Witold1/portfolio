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

/**
 * @param {object} m
 * @param {string} m.workTitle
 * @param {string} [m.author]
 * @param {string|number} [m.year]
 * @param {string} [m.url]
 * @param {string} [m.organization] Used for plain-text citation only (not written to BibTeX).
 * @param {string} [m.citeKey] Base key (e.g. blog_slug); normalized to witold_blog_slug.
 * @param {'misc'|'online'} [m.entryType]
 */
export function buildPlainCitation(m) {
  const author = m.author || 'Author';
  const year = m.year != null ? String(m.year) : 'n.d.';
  const title = m.workTitle || 'Untitled';
  const org = m.organization ? ` ${m.organization}.` : '';
  const url = m.url ? ` ${m.url}` : '';
  return `${title} (${year}), ${author}.${org}${url}`.trim();
}

export function buildBibTeX(m) {
  const key = bibtexCitationKey(m);
  const type = m.entryType === 'online' ? 'online' : 'misc';
  const lines = [
    `@${type}{${key},`,
    `  author = ${bibtexBrace(m.author || 'Unknown')},`,
    `  title = ${bibtexTitle(m.workTitle || 'Untitled')},`,
  ];
  if (m.year != null) lines.push(`  year = ${bibtexBrace(String(m.year))},`);
  if (m.url) lines.push(`  url = ${bibtexBrace(m.url)},`);
  lines.push('}');
  return lines.join('\n');
}
