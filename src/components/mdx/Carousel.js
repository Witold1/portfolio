import { useMemo, useState } from 'react';
import ImageLightbox from './ImageLightbox';
import galleryConfig from '../../../config/gallery-settings.json';
import { inferMediaTypeFromSrc } from '../../lib/inferMediaType';
import { getMediaBaseUrl, resolveMediaUrl } from '../../lib/mediaUrl';

export default function Carousel({ items = [], startIndex = 0, caption, aspect = 'wide' }) {
  const mediaBaseUrl = getMediaBaseUrl(galleryConfig.mediaBaseUrl);
  const safeItems = useMemo(
    () =>
      (Array.isArray(items) ? items.filter(Boolean) : []).map((item) => ({
        ...item,
        src: typeof item?.src === 'string' ? resolveMediaUrl(item.src, mediaBaseUrl) : item?.src,
      })),
    [items, mediaBaseUrl],
  );
  const [index, setIndex] = useState(Math.min(Math.max(startIndex, 0), Math.max(safeItems.length - 1, 0)));
  const [modalSrc, setModalSrc] = useState(null);

  if (safeItems.length === 0) return null;

  const current = safeItems[index];
  const src = current?.src;
  const isVideo = inferMediaTypeFromSrc(src, current?.type) === 'video';
  const alt = current?.alt || caption || 'Carousel item';

  const prev = () => setIndex((i) => (i === 0 ? safeItems.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === safeItems.length - 1 ? 0 : i + 1));

  return (
    <section className="mdx-carousel">
      {caption ? <p className="mdx-carousel-caption">{caption}</p> : null}
      <div className={`mdx-carousel-frame mdx-carousel-${aspect}`}>
        {isVideo ? (
          <video
            src={src}
            controls
            className="mdx-carousel-media"
            aria-label={alt}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="mdx-carousel-media mdx-carousel-clickable"
            onClick={() => src && setModalSrc(src)}
          />
        )}

        {safeItems.length > 1 ? (
          <>
            <button type="button" className="mdx-carousel-btn mdx-carousel-btn-left" onClick={prev} aria-label="Previous">
              ❮
            </button>
            <button type="button" className="mdx-carousel-btn mdx-carousel-btn-right" onClick={next} aria-label="Next">
              ❯
            </button>
            <div className="mdx-carousel-counter" aria-label="Carousel position">
              {index + 1} / {safeItems.length}
            </div>
          </>
        ) : null}
      </div>

      <ImageLightbox src={modalSrc} alt={alt} onClose={() => setModalSrc(null)} />
    </section>
  );
}
