'use client';

import GalleryLightboxButton from './GalleryLightboxButton';

/**
 * Top bar above lightbox media: slide prev/next (when carousel) + close.
 * Desktop carousel: compact centered pill.
 * Desktop single item: close only, top-right (no lonely centered pill).
 * Mobile: full-width bar (see gallery.css).
 */
export default function GalleryLightboxNavBar({
  onClose,
  slideCount = 0,
  slideIndex = 0,
  onPrev,
  onNext,
}) {
  const hasSlideNav = slideCount > 1 && typeof onPrev === 'function' && typeof onNext === 'function';

  return (
    <div
      className={`gallery-lightbox-nav${hasSlideNav ? '' : ' gallery-lightbox-nav--close-only'}`}
      role="toolbar"
      aria-label="Lightbox controls"
    >
      {hasSlideNav ? (
        <div className="gallery-lightbox-nav-group" aria-label="Slides">
          <GalleryLightboxButton variant="prev" onClick={onPrev} />
          <span className="gallery-lightbox-nav-counter" aria-live="polite">
            {slideIndex + 1} / {slideCount}
          </span>
          <GalleryLightboxButton variant="next" onClick={onNext} />
        </div>
      ) : (
        <span className="gallery-lightbox-nav-spacer" aria-hidden />
      )}
      <GalleryLightboxButton variant="close" className="gallery-lightbox-nav-close" onClick={onClose} />
    </div>
  );
}
