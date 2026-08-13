/**
 * Shared video extension detection for CDN thumb/poster mapping and type inference.
 * Includes query/hash terminators so `file.mp4?x=1` and `file.mp4#t=1` match.
 */
export const VIDEO_EXT_RE = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?|#|$)/i;

/** Hosts that serve video at a path without a file extension. */
export const VIDEO_HOST_RE =
  /(?:^|\/\/)(?:[\w-]+\.)?(?:lorem\.video|video\.lorem\.ipsum\.io)(?:\/|$)/i;
