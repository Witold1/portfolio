/**
 * Public gallery API for pages + components.
 * Internals (links, notes paragraphs, content-type set, etc.) stay module-private.
 * Server load: `import { loadGallery } from '../lib/gallery/server'` (keeps fs out of the client bundle).
 */
export {
  isGalleryContentType,
  getGalleryItemType,
  normalizeGalleryGridType,
  buildGalleryItemHref,
  pickGalleryLightboxItem,
} from './constants';

export {
  getGalleryCategories,
  filterGalleryItems,
  filterVisibleGalleryItems,
  formatGalleryCategoryLabel,
  galleryNotesToMetaString,
} from './filters';

export {
  GALLERY_UNDATED_YEAR_LABEL,
  GALLERY_OTHER_SERIES_LABEL,
  galleryItemYear,
  galleryItemSeries,
  formatGallerySeriesLabel,
  groupGalleryItemsByYear,
  groupGalleryItemsBySeries,
  groupGalleryItems,
  orderGalleryItemsForGrouping,
} from './groupBy';

export {
  resolveGalleryLightboxLayers,
  resolveGalleryShare,
  buildGalleryShareUrl,
  buildGalleryShareText,
} from './lightbox';

export { buildGalleryCardHoverMeta, buildGalleryCardImageAlt } from './cardMeta';

export { GALLERY_BLUR_DATA_URL } from './placeholders';

export {
  mdxNavItemToGalleryItem,
  filterMdxNavItems,
  normalizeMediaBackground,
} from './mdxAdapter';

export { useGalleryLightbox } from './useGalleryLightbox';

/** @typedef {import('./types.js').GalleryItem} GalleryItem */
/** @typedef {import('./types.js').GallerySlide} GallerySlide */
/** @typedef {import('./types.js').GalleryLoadResult} GalleryLoadResult */
