/**
 * Shared shapes for MDX frontmatter loaded via `lib/content`.
 * Authoring overview: `content/content-schema.md`.
 *
 * @typedef {Object} ContentFrontmatterBase
 * @property {string} slug Derived from file path (no `.mdx`)
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {string} [created] Prefer `YYYY-MM-DD` (frontmatter alias: `date`)
 * @property {string} [edited] Optional revisit date (`YYYY` / `YYYY-MM` / `YYYY-MM-DD`) → “Edited during …”
 * @property {string} [polished] Softer alias of `edited` → “Polished during …” (wins if both set)
 * @property {string} [excerpt]
 * @property {string | string[]} [tags]
 * @property {string} [coverImage] Absolute or site-relative URL
 * @property {boolean} [hidden] Draft/preview: omit from public lists + sitemap; detail HTML still builds + noindex
 * @property {boolean} [listed] When `false`, omit from chronological lists/home but keep indexable + sitemap
 * @property {string} [parent] Hub slug (`project-…` or `projects/…` / `blog/…`); nests in sitemap + “Part of” chip
 * @property {boolean} [wip] Force under-construction reveal cover on the detail page
 * @property {{ name: string, affiliation?: string }[]} [creators] Preferred citation creators (per-person affiliation)
 * @property {string} [citationAuthor] Single-author shorthand when `creators` omitted
 * @property {string} [author] Fallback citation author
 * @property {string} [citationOrganization] Default affiliation for creators / citationAuthor
 * @property {string} [citationUrl]
 * @property {string} [citeKey]
 * @property {'misc' | 'online'} [citationEntryType]
 *
 * @typedef {ContentFrontmatterBase & {
 *   kind?: 'post' | string,
 *   major?: boolean,
 * }} BlogFrontmatter
 *
 * @typedef {ContentFrontmatterBase & {
 *   kind?: 'project' | string,
 *   version?: string,
 *   demoUrl?: string,
 * }} ProjectFrontmatter
 *
 * @typedef {BlogFrontmatter | ProjectFrontmatter} ContentListEntry
 * List/index props from `getAllContent` (frontmatter + slug only).
 *
 * @typedef {ContentListEntry & { content: string }} ContentEntry
 * Detail props from `getContentBySlug` (includes MDX body).
 */

export {};
