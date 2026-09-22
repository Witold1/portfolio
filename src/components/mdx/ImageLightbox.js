'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { inferMediaTypeFromSrc } from '../../lib/inferMediaType';
import { useEscapeToClose } from '../../lib/useEscapeToClose';
import { useSwipeNavigation } from '../../lib/useSwipeNavigation';

function LightboxIcon({ name }) {
  const paths = {
    close: 'M18 6L6 18M6 6l12 12',
    prev: 'M15 6l-6 6 6 6',
    next: 'M9 6l6 6-6 6',
  };
  return (
    <svg
      className="mdx-image-lightbox-btn-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={paths[name]} />
    </svg>
  );
}

function LightboxBtn({ name, label, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`mdx-image-lightbox-btn${className ? ` ${className}` : ''}`}
      aria-label={label}
      {...props}
    >
      <LightboxIcon name={name} />
    </button>
  );
}

/**
 * Full-viewport MDX image lightbox. Optional slide nav mirrors gallery-lightbox-nav.
 */
export default function ImageLightbox({
  open = false,
  items = [],
  index = 0,
  onPrev,
  onNext,
  onClose,
  caption = '',
  fallbackAlt = 'Enlarged image',
}) {
  const [mounted, setMounted] = useState(false);
  const slides = Array.isArray(items)
    ? items.filter((item) => typeof item?.src === 'string' && item.src.trim())
    : [];
  const slideCount = slides.length;
  const hasSlideNav = slideCount > 1 && typeof onPrev === 'function' && typeof onNext === 'function';
  const safeIndex = slideCount ? ((index % slideCount) + slideCount) % slideCount : 0;
  const current = slides[safeIndex];
  const src = current?.src || '';
  const isVideo = inferMediaTypeFromSrc(src, current?.type) === 'video';
  const title = typeof caption === 'string' ? caption.trim() : '';
  const alt = current?.alt || title || fallbackAlt;
  const showChrome = Boolean(title);

  useEscapeToClose(onClose, { enabled: open && Boolean(src) });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !hasSlideNav) return undefined;
    const onKey = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, hasSlideNav, onPrev, onNext]);

  const swipeHandlers = useSwipeNavigation({
    enabled: open && hasSlideNav,
    onPrev,
    onNext,
  });

  const stop = useCallback((e) => e.stopPropagation(), []);

  if (!mounted || !open || !src) return null;

  return createPortal(
    <div
      className="mdx-image-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <div className="mdx-image-lightbox-stack" onClick={stop} {...swipeHandlers}>
        <div
          className={`mdx-image-lightbox-nav${hasSlideNav ? '' : ' mdx-image-lightbox-nav--close-only'}`}
          role="toolbar"
          aria-label="Lightbox controls"
        >
          {hasSlideNav ? (
            <div className="mdx-image-lightbox-nav-group" aria-label="Slides">
              <LightboxBtn name="prev" label="Previous slide" onClick={onPrev} />
              <span className="mdx-image-lightbox-nav-counter" aria-live="polite">
                {safeIndex + 1} / {slideCount}
              </span>
              <LightboxBtn name="next" label="Next slide" onClick={onNext} />
            </div>
          ) : (
            <span className="mdx-image-lightbox-nav-spacer" aria-hidden />
          )}
          <LightboxBtn name="close" label="Close" className="mdx-image-lightbox-nav-close" onClick={onClose} />
        </div>
        <div className="mdx-image-lightbox-frame">
          {isVideo ? (
            <video
              key={src}
              src={src}
              controls
              autoPlay
              className="mdx-image-lightbox-img"
              aria-label={alt}
            />
          ) : (
            <img key={src} src={src} alt={alt} className="mdx-image-lightbox-img" />
          )}
        </div>
        {showChrome ? (
          <footer className="mdx-image-lightbox-chrome">
            <p className="mdx-image-lightbox-title">{title}</p>
          </footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
