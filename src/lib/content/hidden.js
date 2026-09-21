/**
 * Visibility flags for MDX / gallery items.
 *
 * - `hidden: true` — drafts/previews: omit from public lists + HTML sitemap;
 *   detail pages still build but emit `noindex`. Admin “Show hidden items”
 *   reveals them in lists.
 * - `listed: false` — public hub children: omit from chronological blog/project
 *   grids and home featured picks, but remain indexable and appear in the
 *   sitemap (nested under `parent` when set). Not revealed by the admin toggle.
 */

export function isHiddenContent(item) {
  return item?.hidden === true;
}

/** Soft-omit from public lists while staying crawlable (`listed: false`). */
export function isUnlistedContent(item) {
  return item?.listed === false;
}

/**
 * Public list surfaces (blog, projects, gallery, home picks).
 * Always drops `listed: false`. Drops `hidden` unless `showHidden`.
 */
export function filterVisibleContent(items, { showHidden = false } = {}) {
  if (!Array.isArray(items)) return items || [];
  return items.filter((item) => {
    if (isUnlistedContent(item)) return false;
    if (isHiddenContent(item) && !showHidden) return false;
    return true;
  });
}
