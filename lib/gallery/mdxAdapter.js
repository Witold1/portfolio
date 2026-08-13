import galleryConfig from '../../config/gallery-settings.json';
import { getMediaBaseUrl, resolveMediaUrl } from '../mediaUrl';
import { getGalleryItemType } from './constants';

const NAV_IMAGE_FIT = {
  cover: 'cover',
  contain: 'contain',
  none: 'none',
};

function resolveMdxMedia(src) {
  if (typeof src !== 'string' || !src.trim()) return '';
  return resolveMediaUrl(src.trim(), getMediaBaseUrl(galleryConfig.mediaBaseUrl));
}

function getMdxNavMediaSource(item) {
  if (!item || typeof item !== 'object') return '';
  if (typeof item.src === 'string' && item.src.trim()) return item.src.trim();
  if (typeof item.image === 'string' && item.image.trim()) return item.image.trim();
  if (typeof item.video === 'string' && item.video.trim()) return item.video.trim();
  return '';
}

/**
 * Map an MDX MediaGrid entry into a normalized gallery grid item.
 */
export function mdxNavItemToGalleryItem(entry, index, { interactionMode, imageFit = 'none' }) {
  const hrefString = typeof entry.href === 'string' ? entry.href : '';
  const isPlaceholder =
    interactionMode === 'link' &&
    (hrefString === '#' || hrefString.toLowerCase().startsWith('javascript:'));
  const src = resolveMdxMedia(getMdxNavMediaSource(entry));

  return {
    id: entry.id ?? `nav-${index}-${entry.label}`,
    type: getGalleryItemType(entry),
    src,
    alt: entry.alt,
    title: entry.label,
    subtitle: entry.subtitle,
    link: interactionMode === 'link' ? (isPlaceholder ? undefined : entry.href) : entry.link,
    notes: entry.notes ?? entry.subtitle,
    disabled: isPlaceholder,
    uniformObjectFit: NAV_IMAGE_FIT[imageFit] ?? 'none',
    showTitleBelow: true,
  };
}

export function filterMdxNavItems(items, interactionMode) {
  if (!Array.isArray(items)) return [];
  return items.filter((entry) => {
    if (!entry?.label) return false;
    if (!getMdxNavMediaSource(entry)) return false;
    if (interactionMode === 'modal') return true;
    return Boolean(entry?.href);
  });
}
