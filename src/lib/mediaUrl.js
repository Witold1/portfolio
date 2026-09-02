import { VIDEO_EXT_RE } from './videoExt';

const ABSOLUTE_RE = /^(?:https?:)?\/\//i;
const RASTER_EXT_RE = /\.(webp|jpe?g|png|gif)(\?|$)/i;

/**
 * Resolve a media path for gallery and other content.
 * - Absolute URLs pass through unchanged.
 * - Relative keys resolve against `mediaBaseUrl` when set (CDN).
 * - Without a base, relative keys become root-relative paths (`/key`).
 */
export function resolveMediaUrl(src, mediaBaseUrl = '') {
  if (typeof src !== 'string') return '';
  const trimmed = src.trim();
  if (!trimmed) return '';

  if (ABSOLUTE_RE.test(trimmed)) {
    return trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;
  }

  const base = String(mediaBaseUrl || '').replace(/\/+$/, '');
  const path = trimmed.replace(/^\/+/, '');

  if (base) return `${base}/${path}`;
  return `/${path}`;
}

/** Prefer env override, then config file value. */
export function getMediaBaseUrl(configValue = '') {
  const fromEnv = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim()) return fromEnv.trim();
  return typeof configValue === 'string' ? configValue.trim() : '';
}

function splitQuery(url) {
  const i = url.indexOf('?');
  if (i === -1) return { path: url, query: '' };
  return { path: url.slice(0, i), query: url.slice(i) };
}

/**
 * Map a full CDN asset URL to its `.thumb.webp` sibling (optimize pipeline).
 * SVG unchanged; videos / posters → `.thumb.webp`; rasters → `.thumb.webp`.
 */
function cdnThumbUrl(src) {
  if (typeof src !== 'string' || !src.trim()) return '';
  const trimmed = src.trim();
  if (/\.thumb\.webp(\?|$)/i.test(trimmed)) return trimmed;
  if (/\.svg(\?|$)/i.test(trimmed)) return trimmed;

  const { path, query } = splitQuery(trimmed);
  // Full video poster → small card thumb (same frame, ~480px)
  if (/\.poster\.webp$/i.test(path)) {
    return `${path.replace(/\.poster\.webp$/i, '')}.thumb.webp${query}`;
  }
  if (VIDEO_EXT_RE.test(path)) {
    return `${path.replace(/\.(mp4|webm|ogg|ogv|mov|m4v)$/i, '')}.thumb.webp${query}`;
  }
  if (RASTER_EXT_RE.test(path)) {
    return `${path.replace(/\.(webp|jpe?g|png|gif)$/i, '')}.thumb.webp${query}`;
  }
  return trimmed;
}

/**
 * Map a video CDN URL to its `.poster.webp` sibling (ffmpeg in CI).
 */
export function cdnPosterUrl(src) {
  if (typeof src !== 'string' || !src.trim()) return '';
  const trimmed = src.trim();
  if (/\.poster\.webp(\?|$)/i.test(trimmed)) return trimmed;
  const { path, query } = splitQuery(trimmed);
  if (!VIDEO_EXT_RE.test(path)) return '';
  return `${path.replace(/\.(mp4|webm|ogg|ogv|mov|m4v)$/i, '')}.poster.webp${query}`;
}

/**
 * Best still for a grid/mosaic tile: small thumb when available (incl. video thumbs),
 * else full poster for video, else original. Lightbox still uses full `src` / poster.
 */
export function cdnPreviewUrl(src, explicitType) {
  if (typeof src !== 'string' || !src.trim()) return '';
  const trimmed = src.trim();
  const isVideo =
    explicitType === 'video' ||
    VIDEO_EXT_RE.test(splitQuery(trimmed).path) ||
    /\.poster\.webp(\?|$)/i.test(trimmed);
  if (isVideo) {
    return cdnThumbUrl(trimmed) || cdnPosterUrl(trimmed) || trimmed;
  }
  return cdnThumbUrl(trimmed) || trimmed;
}
