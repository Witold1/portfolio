function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[`"'“”’]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * @param {string} text full MDX
 * @param {number} start index of '<CitationBox'
 * @returns {string | null} opening tag slice including closing /> or >
 */
function extractCitationBoxOpenTag(text, start) {
  if (text.slice(start, start + 12) !== '<CitationBox') return null;
  const slice = text.slice(start, Math.min(text.length, start + 2500));
  const selfClose = slice.match(/^<CitationBox[\s\S]*?\/>/);
  if (selfClose) return selfClose[0];
  const openOnly = slice.match(/^<CitationBox[\s\S]*?>/);
  return openOnly ? openOnly[0] : null;
}

function citationTitleFromOpenTag(tag) {
  const m1 = /\btitle=\{"([^"]*)"\}/.exec(tag);
  if (m1) return m1[1].trim();
  const m2 = /\btitle=["']([^"']*)["']/.exec(tag);
  if (m2) return m2[1].trim();
  return 'How to cite';
}

/**
 * @param {string} text full MDX
 * @param {number} start index of '<MediaPresence'
 * @returns {string | null} opening tag slice including closing /> or >
 */
function extractMediaPresenceOpenTag(text, start) {
  if (text.slice(start, start + 15) !== '<MediaPresence') return null;
  const slice = text.slice(start, Math.min(text.length, start + 2500));
  const selfClose = slice.match(/^<MediaPresence[\s\S]*?\/>/);
  if (selfClose) return selfClose[0];
  const openOnly = slice.match(/^<MediaPresence[\s\S]*?>/);
  return openOnly ? openOnly[0] : null;
}

function mediaPresenceTitleFromOpenTag(tag) {
  const m1 = /\btitle=\{"([^"]*)"\}/.exec(tag);
  if (m1) return m1[1].trim();
  const m2 = /\btitle=["']([^"']*)["']/.exec(tag);
  if (m2) return m2[1].trim();
  return 'Media presence';
}

/**
 * End index (exclusive) of a JSX opening tag, handling `level={2}`-style `>` inside attributes.
 * @param {string} text
 * @param {number} startIdx index of '<'
 * @returns {number}
 */
function findJsxOpeningTagEnd(text, startIdx) {
  let i = startIdx;
  if (text[i] !== '<') return -1;
  i++;
  if (text[i] === '/') return -1;
  while (i < text.length && /[A-Za-z0-9]/.test(text[i])) i++;
  while (i < text.length && /\s/.test(text[i])) i++;
  let braceDepth = 0;
  let inString = null;
  while (i < text.length) {
    const c = text[i];
    if (inString) {
      if (c === '\\' && i + 1 < text.length) {
        i += 2;
        continue;
      }
      if (c === inString) inString = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      inString = c;
      i++;
      continue;
    }
    if (c === '{') {
      braceDepth++;
      i++;
      continue;
    }
    if (c === '}') {
      if (braceDepth > 0) braceDepth--;
      i++;
      continue;
    }
    if (braceDepth === 0) {
      if (c === '/' && text[i + 1] === '>') return i + 2;
      if (c === '>') return i + 1;
    }
    i++;
  }
  return -1;
}

function extractCollapsibleSectionOpenTag(text, start) {
  const prefix = '<CollapsibleSection';
  if (text.slice(start, start + prefix.length) !== prefix) return null;
  const end = findJsxOpeningTagEnd(text, start);
  if (end === -1) return null;
  return text.slice(start, end);
}

/**
 * @param {string} tag opening tag slice
 * @returns {{ title: string, level: number } | null}
 */
function collapsibleSectionMetaFromOpenTag(tag) {
  const m1 = /\btitle=\{"([^"]*)"\}/.exec(tag);
  const m2 = /\btitle=["']([^"']*)["']/.exec(tag);
  const title = (m1 ? m1[1] : m2 ? m2[1] : '').trim();
  if (!title) return null;
  const lm = /\blevel=\{(\d+)\}/.exec(tag) || /\blevel=["'](\d)["']/.exec(tag);
  let level = 3;
  if (lm) {
    const n = parseInt(lm[1], 10);
    if (n >= 2 && n <= 6) level = n;
  }
  return { title, level };
}

/**
 * Best-effort ToC extraction for MDX content.
 * - Skips fenced code blocks
 * - Extracts ## … ###### headings
 * - Extracts `<CitationBox … />`, `<MediaPresence … />`, and `<CollapsibleSection …>` titles (levels 2–6 for collapsible)
 */
export function extractTocFromMdx(mdxContent) {
  const text = String(mdxContent || '');
  const lines = text.split(/\r?\n/);
  /** @type {{ pos: number, level: number, label: string, href: string, id: string }[]} */
  const entries = [];
  let offset = 0;
  let inFence = false;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inFence = !inFence;
      offset += line.length + 1;
      continue;
    }
    if (!inFence) {
      const hm = /^(#{2,6})\s+(.+?)\s*$/.exec(trimmed);
      if (hm) {
        const rawLabel = hm[2].replace(/\s+\{#.*\}\s*$/, '').trim();
        const id = slugify(rawLabel);
        if (id) {
          entries.push({
            pos: offset,
            level: hm[1].length,
            label: rawLabel,
            href: `#${id}`,
            id,
          });
        }
      }

      const cbIdx = line.indexOf('<CitationBox');
      if (cbIdx !== -1) {
        const absStart = offset + cbIdx;
        const tag = extractCitationBoxOpenTag(text, absStart);
        if (tag) {
          const label = citationTitleFromOpenTag(tag);
          const id = slugify(label);
          if (id) {
            entries.push({
              pos: absStart,
              level: 2,
              label,
              href: `#${id}`,
              id,
            });
          }
        }
      }

      const mpIdx = line.indexOf('<MediaPresence');
      if (mpIdx !== -1) {
        const absStart = offset + mpIdx;
        const tag = extractMediaPresenceOpenTag(text, absStart);
        if (tag) {
          const label = mediaPresenceTitleFromOpenTag(tag);
          const id = slugify(label);
          if (id) {
            entries.push({
              pos: absStart,
              level: 2,
              label,
              href: `#${id}`,
              id,
            });
          }
        }
      }

      const csIdx = line.indexOf('<CollapsibleSection');
      if (csIdx !== -1) {
        const absStart = offset + csIdx;
        const tag = extractCollapsibleSectionOpenTag(text, absStart);
        if (tag) {
          const meta = collapsibleSectionMetaFromOpenTag(tag);
          if (meta) {
            const id = slugify(meta.title);
            if (id) {
              entries.push({
                pos: absStart,
                level: meta.level,
                label: meta.title,
                href: `#${id}`,
                id,
              });
            }
          }
        }
      }
    }
    offset += line.length + 1;
  }

  entries.sort((a, b) => a.pos - b.pos);
  return entries.map(({ pos: _p, ...item }) => item);
}

export function slugifyHeading(text) {
  return slugify(text);
}
