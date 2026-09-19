import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import galleryConfig from '../../../content/config/gallery-settings.json';
import { getMediaBaseUrl, resolveMediaUrl } from '../mediaUrl';

/** @typedef {import('./types.js').ContentListEntry} ContentListEntry */
/** @typedef {import('./types.js').ContentEntry} ContentEntry */

const CONTENT_ROOT = path.join(process.cwd(), 'content');

/** Content subdirectory under `content/` for blog MDX (`content/blogposts/`). */
export const BLOG_COLLECTION = 'blogposts';

function withResolvedCoverImage(data) {
  if (!data || typeof data !== 'object') return data;
  if (typeof data.coverImage !== 'string' || !data.coverImage.trim()) return data;
  const mediaBaseUrl = getMediaBaseUrl(galleryConfig.mediaBaseUrl);
  return {
    ...data,
    coverImage: resolveMediaUrl(data.coverImage.trim(), mediaBaseUrl),
  };
}

function getDir(type) {
  return path.join(CONTENT_ROOT, type);
}

function walkMdxFiles(dir, rootDir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMdxFiles(full, rootDir, acc);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;
    const rel = path.relative(rootDir, full).replace(/\\/g, '/');
    acc.push(rel);
  }
}

/**
 * @param {string} type Content subdirectory under `content/` (e.g. `blogposts`, `projects`)
 * @returns {string[]} Relative `.mdx` paths
 */
export function getSlugs(type) {
  const dir = getDir(type);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  walkMdxFiles(dir, dir, out);
  return out;
}

/**
 * Frontmatter listings (no MDX body), newest `created` first.
 * @param {string} type
 * @returns {ContentListEntry[]}
 */
export function getAllContent(type) {
  const dir = getDir(type);
  return getSlugs(type)
    .map((filePath) => {
      const slug = filePath.replace(/\.mdx$/, '');
      const fullPath = path.join(dir, filePath);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(raw);
      return /** @type {ContentListEntry} */ ({
        slug,
        ...normalizeContentDates(withResolvedCoverImage(data)),
      });
    })
    .sort((a, b) => String(b.created || '').localeCompare(String(a.created || '')));
}


/**
 * Single MDX entry including raw body for serialize.
 * @param {string} type
 * @param {string | string[]} slug Catch-all route segments or slash path
 * @returns {ContentEntry}
 */
export function getContentBySlug(type, slug) {
  const normalizedSlug = Array.isArray(slug) ? slug.join('/') : slug;
  const fullPath = path.join(getDir(type), `${normalizedSlug}.mdx`);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  return /** @type {ContentEntry} */ ({
    slug: normalizedSlug,
    ...normalizeContentDates(withResolvedCoverImage(data)),
    content,
  });
}

/** Prefer `created`; accept legacy `date` alias; drop `date` from the loaded object. */
function normalizeContentDates(data) {
  if (!data || typeof data !== 'object') return data;
  const created = data.created ?? data.date;
  const { date: _legacyDate, ...rest } = data;
  if (created == null || created === '') return rest;
  return { ...rest, created };
}

