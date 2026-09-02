import { VIDEO_EXT_RE, VIDEO_HOST_RE } from './videoExt';

/**
 * Infer image vs video from a media URL when YAML/MDX omits `type`.
 */
export function inferMediaTypeFromSrc(src, explicitType) {
  if (explicitType === 'video' || explicitType === 'image') return explicitType;
  if (typeof src !== 'string') return 'image';
  const s = src.trim();
  if (!s) return 'image';
  if (VIDEO_EXT_RE.test(s)) return 'video';
  if (VIDEO_HOST_RE.test(s)) return 'video';
  return 'image';
}
