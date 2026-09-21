import fs from 'fs';
import path from 'path';
import { BLOG_COLLECTION, getContentBySlug } from './index';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

/**
 * Normalize frontmatter `parent` to a collection + slug.
 * Accepts bare slugs or `projects/…` / `blog/…` / `blogposts/…` prefixes.
 * @param {unknown} parent
 * @returns {{ collection: 'projects' | typeof BLOG_COLLECTION | null, slug: string } | null}
 */
export function normalizeParentRef(parent) {
  if (typeof parent !== 'string') return null;
  const raw = parent.trim().replace(/^\/+|\/+$/g, '');
  if (!raw) return null;

  const prefixed = raw.match(/^(projects|blog|blogposts)\/(.+)$/i);
  if (prefixed) {
    const kind = prefixed[1].toLowerCase();
    const collection = kind === 'projects' ? 'projects' : BLOG_COLLECTION;
    return { collection, slug: prefixed[2] };
  }
  return { collection: null, slug: raw };
}

function entryExists(collection, slug) {
  const fullPath = path.join(CONTENT_ROOT, collection, `${slug}.mdx`);
  return fs.existsSync(fullPath);
}

function toParentLink(collection, entry) {
  const pathPrefix = collection === 'projects' ? '/projects' : '/blog';
  const title =
    entry.title && String(entry.title).trim()
      ? String(entry.title).trim()
      : entry.slug;
  return {
    slug: entry.slug,
    title,
    href: `${pathPrefix}/${entry.slug}/`,
    collection,
  };
}

/**
 * Resolve frontmatter `parent` to a link target (build-time).
 * Bare slugs prefer projects, then blogposts.
 * @param {unknown} parent
 * @returns {{ slug: string, title: string, href: string, collection: string } | null}
 */
export function resolveParentLink(parent) {
  const ref = normalizeParentRef(parent);
  if (!ref) return null;

  const tryCollections =
    ref.collection != null
      ? [ref.collection]
      : ['projects', BLOG_COLLECTION];

  for (const collection of tryCollections) {
    if (!entryExists(collection, ref.slug)) continue;
    try {
      const entry = getContentBySlug(collection, ref.slug);
      return toParentLink(collection, entry);
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Find a parent among already-loaded list entries (sitemap / indexes).
 * @param {unknown} parent
 * @param {Array<{ slug: string }>} projects
 * @param {Array<{ slug: string }>} posts
 */
export function findParentAmong(parent, projects, posts) {
  const ref = normalizeParentRef(parent);
  if (!ref) return null;

  const inProjects = (projects || []).find((p) => p.slug === ref.slug);
  const inPosts = (posts || []).find((p) => p.slug === ref.slug);

  if (ref.collection === 'projects') return inProjects || null;
  if (ref.collection === BLOG_COLLECTION) return inPosts || null;
  return inProjects || inPosts || null;
}
