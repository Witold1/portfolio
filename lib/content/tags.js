/** Normalize frontmatter `tags` (string | string[] | missing) to string[]. */
export function normalizeTags(tags) {
  if (tags == null) return [];
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  const s = String(tags).trim();
  return s ? [s] : [];
}

/** Stable slug for URLs and matching: lowercase, spaces/underscores → hyphen, strip other punctuation. */
export function tagToParam(tag) {
  return String(tag)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function postHasTagParam(post, paramSlug) {
  if (!paramSlug) return true;
  const want = tagToParam(paramSlug);
  return normalizeTags(post.tags).some((t) => tagToParam(t) === want);
}

export function prettyTagLabelFromParam(paramSlug) {
  if (!paramSlug) return '';
  return paramSlug.replace(/-/g, ' ');
}

/** Title-style words for breadcrumb / UI (from URL tag param). */
export function formatTagBreadcrumbLabel(paramSlug) {
  const s = prettyTagLabelFromParam(paramSlug);
  if (!s) return 'Tag';
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/** Unique tags across posts: `{ param, label }[]` sorted by label (first-seen label wins per param). */
export function collectSidebarTagsFromPosts(posts) {
  const byParam = new Map();
  for (const post of posts) {
    for (const tag of normalizeTags(post.tags)) {
      const param = tagToParam(tag);
      if (!param) continue;
      if (!byParam.has(param)) byParam.set(param, tag);
    }
  }
  return [...byParam.entries()]
    .map(([param, label]) => ({ param, label }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
}
