import galleryConfig from '../../../content/config/gallery-settings.json';
import { getMediaBaseUrl, resolveMediaUrl } from '../mediaUrl';
import { getGalleryItemType } from './constants';

const NAV_IMAGE_FIT = {
  cover: 'cover',
  contain: 'contain',
  none: 'none',
};

function resolveMdxMedia(src) {
  if (typeof src !== 'string' || !src.trim()) return '';
  const trimmed = src.trim();
  // App public/ assets (not CDN), e.g. "~/placeholders/here-be-dragons.svg"
  if (trimmed.startsWith('~/') || trimmed.startsWith('public:')) {
    const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
    const path = trimmed.replace(/^(~\/|public:)/, '').replace(/^\/+/, '');
    return `${basePath}/${path}`;
  }
  return resolveMediaUrl(trimmed, getMediaBaseUrl(galleryConfig.mediaBaseUrl));
}

function getMdxNavMediaSource(item) {
  if (!item || typeof item !== 'object') return '';
  if (typeof item.src === 'string' && item.src.trim()) return item.src.trim();
  if (typeof item.image === 'string' && item.image.trim()) return item.image.trim();
  if (typeof item.video === 'string' && item.video.trim()) return item.video.trim();
  return '';
}

/**
 * Map an MDX AssetsGrid entry into a normalized gallery grid item.
 * Prefer `notes` for lightbox Details (flags, caveats, etc.); `flags` is a legacy alias.
 * `@param {'navigate'|'lightbox'} onClick`
 */
export function mdxNavItemToGalleryItem(entry, index, { onClick = 'lightbox', imageFit = 'cover' }) {
  const hrefString = typeof entry.href === 'string' ? entry.href : '';
  const isPlaceholder =
    onClick === 'navigate' &&
    (hrefString === '#' || hrefString.toLowerCase().startsWith('javascript:'));
  const src = resolveMdxMedia(getMdxNavMediaSource(entry));
  const notes = entry.notes ?? entry.flags;
  const label = typeof entry.label === 'string' ? entry.label.trim() : '';
  const title =
    onClick === 'navigate' && label && !isPlaceholder && !/→\s*$/.test(label)
      ? `${label} →`
      : label;

  return {
    id: entry.id ?? `nav-${index}-${entry.label}`,
    type: getGalleryItemType(entry),
    src,
    alt: entry.alt,
    title,
    subtitle: entry.subtitle,
    link: onClick === 'navigate' ? (isPlaceholder ? undefined : entry.href) : entry.link,
    notes,
    disabled: isPlaceholder,
    uniformObjectFit: NAV_IMAGE_FIT[imageFit] ?? 'cover',
    showTitleOnMedia: true,
  };
}

/** `@param {'navigate'|'lightbox'} onClick` */
export function filterMdxNavItems(items, onClick) {
  if (!Array.isArray(items)) return [];
  return items.filter((entry) => {
    if (!entry?.label) return false;
    if (!getMdxNavMediaSource(entry)) return false;
    if (onClick === 'lightbox') return true;
    return Boolean(entry?.href);
  });
}
