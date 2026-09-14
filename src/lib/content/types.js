/**
 * Shared shapes for MDX frontmatter loaded via `lib/content`.
 * Authoring overview: `content/content-schema.md`.
 *
 * @typedef {Object} ContentFrontmatterBase
 * @property {string} slug Derived from file path (no `.mdx`)
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {string} [date] Prefer `YYYY-MM-DD`
 * @property {string} [edited] Optional revisit date (`YYYY` / `YYYY-MM` / `YYYY-MM-DD`) → “Edited during …”
 * @property {string} [polished] Softer alias of `edited` → “Polished during …” (wins if both set)
 * @property {string} [excerpt]
 * @property {string | string[]} [tags]
 * @property {string} [coverImage] Absolute or site-relative URL
 * @property {boolean} [hidden] Soft-hide from public lists; detail HTML still builds + noindex
 * @property {boolean} [wip] Force under-construction reveal cover on the detail page
 * @property {string} [citationAuthor]
 * @property {string} [author] Fallback citation author
 * @property {string} [citationOrganization]
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
 *   repoUrl?: string,
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
