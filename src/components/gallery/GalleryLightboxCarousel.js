'use client';

import { useCallback, useEffect, useState } from 'react';
import GalleryLightboxButton from './GalleryLightboxButton';
import GalleryLightboxMedia from './GalleryLightboxMedia';

/** Multi-slide viewer inside the gallery lightbox (images + videos). */
export default function GalleryLightboxCarousel({ slides = [], title = '' }) {
  const safe = Array.isArray(slides) ? slides.filter((s) => typeof s?.src === 'string' && s.src.trim()) : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [slides]);

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? safe.length - 1 : i - 1));
  }, [safe.length]);

  const next = useCallback(() => {
    setIndex((i) => (i === safe.length - 1 ? 0 : i + 1));
  }, [safe.length]);

  useEffect(() => {
    if (safe.length <= 1) return undefined;
    const onKey = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [safe.length, prev, next]);

  if (safe.length === 0) {
    return <p className="p-4 text-gray-700 dark:text-gray-300">No slides in this carousel.</p>;
  }

  const current = safe[index];
  const alt = current.alt || title || `Slide ${index + 1}`;
  const hasNav = safe.length > 1;

  return (
    <div
      className={`gallery-lightbox-carousel${hasNav ? ' gallery-lightbox-carousel--nav' : ''}`}
      aria-roledescription="carousel"
    >
      <div className="gallery-lightbox-carousel-frame">
        <GalleryLightboxMedia
          src={current.src}
          alt={alt}
          type={current.type}
          priority={index === 0}
        />
        {hasNav ? (
          <div className="gallery-lightbox-carousel-counter" aria-live="polite">
            {index + 1} / {safe.length}
          </div>
        ) : null}
      </div>
      {hasNav ? (
        <>
          <GalleryLightboxButton
            variant="prev"
            className="gallery-lightbox-carousel-btn gallery-lightbox-carousel-btn-left"
            onClick={prev}
          />
          <GalleryLightboxButton
            variant="next"
            className="gallery-lightbox-carousel-btn gallery-lightbox-carousel-btn-right"
            onClick={next}
          />
        </>
      ) : null}
    </div>
  );
}
