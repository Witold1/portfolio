'use client';

import GalleryLightboxMedia from './GalleryLightboxMedia';

/**
 * Multi-slide viewer inside the gallery lightbox (images + videos).
 * Navigation lives in GalleryLightboxNavBar; this only renders the active slide.
 */
export default function GalleryLightboxCarousel({
  slides = [],
  title = '',
  index = 0,
}) {
  const safe = Array.isArray(slides) ? slides.filter((s) => typeof s?.src === 'string' && s.src.trim()) : [];

  if (safe.length === 0) {
    return <p className="gallery-lightbox-error">No slides in this carousel.</p>;
  }

  const clamped = ((index % safe.length) + safe.length) % safe.length;
  const current = safe[clamped];
  const alt = current.alt || title || `Slide ${clamped + 1}`;

  return (
    <div className="gallery-lightbox-carousel" aria-roledescription="carousel">
      <div className="gallery-lightbox-carousel-frame">
        <GalleryLightboxMedia
          src={current.src}
          alt={alt}
          type={current.type}
          priority={clamped === 0}
        />
      </div>
    </div>
  );
}
