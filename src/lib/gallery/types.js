/**
 * Shared shapes for gallery YAML after `loadGallery()` normalization.
 * Authoring rules: `content/gallery/items/README.md`.
 *
 * @typedef {'image' | 'video'} GallerySlideType
 *
 * @typedef {Object} GallerySlide
 * @property {GallerySlideType} type
 * @property {string} src Absolute or resolved media URL
 * @property {string} [alt]
 *
 * @typedef {'image' | 'video' | 'carousel'} GalleryItemType
 *
 * @typedef {Object} GalleryItem
 * @property {string} id Filename stem (same as slug)
 * @property {string} slug Filename stem
 * @property {GalleryItemType} type
 * @property {string} src Thumbnail / primary media URL (carousel may use first slide)
 * @property {string} title
 * @property {string[]} categories Values from `content/config/gallery-settings.json`
 * @property {GallerySlide[]} [slides] Present when `type === 'carousel'`
 * @property {string} [subtitle] Also accepted from YAML as `suptitle`
 * @property {string} [created] `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` (YAML alias: `date`)
 * @property {string} [series] Optional series slug (kebab-case); used for diversify + group-by-series
 * @property {string | string[]} [link] Site paths and/or external URLs (normalized); blog/project → toolbar, others → details
 * @property {string[]} [notes] Normalized paragraph list for lightbox Details
 * @property {true} [hidden] Soft-hide from public lists (admin can reveal)
 *
 * @typedef {Object} GalleryLoadResult
 * @property {GalleryItem[]} items Newest-first, then series-diversified (items without `created` last)
 * @property {string[]} categories Allowed category ids from config
 * @property {string} mediaBaseUrl Resolved media base (may be empty)
 */

export {};
