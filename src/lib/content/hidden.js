/**
 * Frontmatter / YAML `hidden: true` - the single visibility flag.
 *
 * Public surfaces (lists, home featured, HTML sitemap) omit hidden items unless
 * the admin “Show hidden items” toggle is on. Detail pages still build so you
 * can preview via direct URL; MDX pages emit noindex when hidden.
 */
export function isHiddenContent(item) {
  return item?.hidden === true;
}

export function filterVisibleContent(items, { showHidden = false } = {}) {
  if (showHidden || !Array.isArray(items)) return items || [];
  return items.filter((item) => !isHiddenContent(item));
}
