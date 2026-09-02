/**
 * Frontmatter `wip: true`, or a `version` that looks like a draft,
 * triggers the click-to-reveal under-construction cover on detail pages.
 *
 * Explicit `wip: false` opts out even if version mentions draft.
 */
export function isWipContent(item) {
  if (!item || typeof item !== 'object') return false;
  if (item.wip === false) return false;
  if (item.wip === true) return true;
  const version = typeof item.version === 'string' ? item.version.trim() : '';
  if (!version) return false;
  return /\bdraft\b/i.test(version) || /^draft[-_\s]/i.test(version);
}
