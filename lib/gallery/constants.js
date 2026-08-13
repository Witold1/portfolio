/** Gallery item types at YAML load (`type` on the item or on a carousel slide). */
const GALLERY_CONTENT_TYPES = Object.freeze(['image', 'video', 'carousel']);

export const GALLERY_CONTENT_TYPE_SET = new Set(GALLERY_CONTENT_TYPES);

export function isGalleryContentType(value) {
  return GALLERY_CONTENT_TYPE_SET.has(value);
}

/** Read normalized `item.type`; MDX adapters may infer from a `video` field. */
export function getGalleryItemType(item) {
  if (isGalleryContentType(item?.type)) return item.type;
  if (typeof item?.video === 'string' && item.video.trim()) return 'video';
  return 'image';
}

export function normalizeGalleryGridType(grid) {
  return grid === 'variable' ? 'variable' : 'uniform';
}

/** Deep-link path for opening a gallery item in the lightbox. */
export function buildGalleryItemHref(id) {
  return `/gallery/?item=${encodeURIComponent(String(id))}`;
}

/** Subset of card fields passed into the lightbox. */
export function pickGalleryLightboxItem(item) {
  if (!item || typeof item !== 'object') return item;
  const out = {
    id: item.id,
    slug: item.slug,
    type: getGalleryItemType(item),
    src: item.src,
    title: item.title,
    categories: item.categories,
  };
  if (item.subtitle) out.subtitle = item.subtitle;
  if (item.notes) out.notes = item.notes;
  if (item.link) out.link = item.link;
  if (item.slides) out.slides = item.slides;
  if (item.date) out.date = item.date;
  if (item.shareUrl) out.shareUrl = item.shareUrl;
  return out;
}
