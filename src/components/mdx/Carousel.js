'use client';

import { useMemo, useRef, useState } from 'react';
import ImageLightbox from './ImageLightbox';
import galleryConfig from '../../../content/config/gallery-settings.json';
import { inferMediaTypeFromSrc } from '../../lib/inferMediaType';
import { getMediaBaseUrl, resolveMediaUrl } from '../../lib/mediaUrl';

function CarouselChevron({ direction }) {
  return (
    <svg
      className="mdx-carousel-btn-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === 'prev' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

export default function Carousel({ items = [], startIndex = 0, caption, aspect }) {
  const mediaBaseUrl = getMediaBaseUrl(galleryConfig.mediaBaseUrl);
  const captionRef = useRef(null);
  const safeItems = useMemo(
    () =>
      (Array.isArray(items) ? items.filter(Boolean) : []).map((item) => ({
        ...item,
        src: typeof item?.src === 'string' ? resolveMediaUrl(item.src, mediaBaseUrl) : item?.src,
      })),
    [items, mediaBaseUrl],
  );
  const [index, setIndex] = useState(Math.min(Math.max(startIndex, 0), Math.max(safeItems.length - 1, 0)));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [figureNumber, setFigureNumber] = useState(null);

  const syncFigureNumber = () => {
    const el = captionRef.current;
    if (!el) {
      setFigureNumber(null);
      return;
    }
    const captions = document.querySelectorAll('.mdx-carousel-caption');
    const n = Array.prototype.indexOf.call(captions, el) + 1;
    setFigureNumber(n > 0 ? n : null);
  };

  if (safeItems.length === 0) return null;

  const current = safeItems[index];
  const src = current?.src;
  const isVideo = inferMediaTypeFromSrc(src, current?.type) === 'video';
  const alt = current?.alt || caption || 'Carousel item';
  const hasFixedAspect = typeof aspect === 'string' && aspect.trim().length > 0;
  const hasNav = safeItems.length > 1;
  const captionText = typeof caption === 'string' ? caption.trim() : '';
  const lightboxCaption =
    captionText && figureNumber
      ? `Figure ${figureNumber}. ${captionText}`
      : captionText;

  const prev = () => setIndex((i) => (i === 0 ? safeItems.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === safeItems.length - 1 ? 0 : i + 1));

  const openLightbox = () => {
    if (!src) return;
    syncFigureNumber();
    setLightboxOpen(true);
  };

  return (
    <section className="mdx-carousel">
      {captionText ? (
        <p ref={captionRef} className="mdx-carousel-caption">
          {captionText}
        </p>
      ) : null}
      <div
        className={`mdx-carousel-frame${hasFixedAspect ? ' mdx-carousel-frame--fixed' : ''}${hasNav ? ' mdx-carousel-frame--nav' : ''}`}
        style={hasFixedAspect ? { aspectRatio: aspect } : undefined}
      >
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
            onClick={openLightbox}
          />
        )}

        {hasNav ? (
          <>
            <button
              type="button"
              className="mdx-carousel-btn mdx-carousel-btn-left"
              onClick={prev}
              aria-label="Previous slide"
            >
              <CarouselChevron direction="prev" />
            </button>
            <button
              type="button"
              className="mdx-carousel-btn mdx-carousel-btn-right"
              onClick={next}
              aria-label="Next slide"
            >
              <CarouselChevron direction="next" />
            </button>
            <div className="mdx-carousel-counter" aria-live="polite">
              {index + 1} / {safeItems.length}
            </div>
          </>
        ) : null}
      </div>

      <ImageLightbox
        open={lightboxOpen}
        items={safeItems}
        index={index}
        onPrev={hasNav ? prev : undefined}
        onNext={hasNav ? next : undefined}
        onClose={() => setLightboxOpen(false)}
        caption={lightboxCaption}
        fallbackAlt={captionText || 'Carousel item'}
      />
    </section>
  );
}
