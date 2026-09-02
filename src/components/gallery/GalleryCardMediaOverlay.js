'use client';

import GalleryCardHoverStrip from './GalleryCardHoverStrip';

/** Shared badge, dim, and hover strip layered on grid card media. */
export default function GalleryCardMediaOverlay({
  slideCount = 0,
  showHoverStrip = false,
  hoverStripProps,
}) {
  return (
    <>
      {slideCount > 1 ? (
        <span className="gallery-card-carousel-badge" aria-hidden>
          {slideCount} slides
        </span>
      ) : null}
      <div className="gallery-card-dim absolute inset-0 z-[2]" aria-hidden />
      {showHoverStrip && hoverStripProps ? (
        <GalleryCardHoverStrip {...hoverStripProps} />
      ) : null}
    </>
  );
}
