'use client';

import galleryConfig from '../../../config/gallery-settings.json';
import { getMediaBaseUrl, resolveMediaUrl } from '../../lib/mediaUrl';

/** MDX `img` — resolves CDN-relative keys via mediaBaseUrl. */
export default function MdxImg({ src, alt = '', ...rest }) {
  const resolved =
    typeof src === 'string' && src.trim()
      ? resolveMediaUrl(src.trim(), getMediaBaseUrl(galleryConfig.mediaBaseUrl))
      : src;
  // eslint-disable-next-line @next/next/no-img-element -- MDX body images; host varies (CDN)
  return <img src={resolved} alt={alt} {...rest} />;
}
