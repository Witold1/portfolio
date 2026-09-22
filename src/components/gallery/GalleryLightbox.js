'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import GalleryLightboxChrome from './GalleryLightboxChrome';
import GalleryLightboxItemMedia from './GalleryLightboxItemMedia';
import GalleryLightboxNavBar from './GalleryLightboxNavBar';
import {
  buildGalleryShareText,
  buildGalleryShareUrl,
  getGalleryItemType,
  resolveGalleryLightboxLayers,
} from '../../lib/gallery';
import { useEscapeToClose } from '../../lib/useEscapeToClose';
import { useSwipeNavigation } from '../../lib/useSwipeNavigation';

function getCarouselSlides(item) {
  if (getGalleryItemType(item) !== 'carousel') return [];
  return Array.isArray(item?.slides)
    ? item.slides.filter((s) => typeof s?.src === 'string' && s.src.trim())
    : [];
}

export default function GalleryLightbox({ isOpen, onClose, item }) {
  const [mounted, setMounted] = useState(false);
  useEscapeToClose(onClose, { enabled: isOpen });

  const shareUrl = useMemo(() => buildGalleryShareUrl(item), [item]);
  const slides = useMemo(() => getCarouselSlides(item), [item]);
  const slideCount = slides.length;
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSlideIndex(0);
  }, [item?.id]);

  const goPrev = useCallback(() => {
    setSlideIndex((i) => (slideCount <= 1 ? 0 : i === 0 ? slideCount - 1 : i - 1));
  }, [slideCount]);

  const goNext = useCallback(() => {
    setSlideIndex((i) => (slideCount <= 1 ? 0 : i === slideCount - 1 ? 0 : i + 1));
  }, [slideCount]);

  useEffect(() => {
    if (!isOpen || slideCount <= 1) return undefined;
    const onKey = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, slideCount, goPrev, goNext]);

  const hasSlideNav = slideCount > 1;
  const swipeHandlers = useSwipeNavigation({
    enabled: isOpen && hasSlideNav,
    onPrev: goPrev,
    onNext: goNext,
  });

  if (!mounted || !isOpen || !item) return null;

  const layers = resolveGalleryLightboxLayers(item);
  const shareText = buildGalleryShareText(item);

  return createPortal(
    <div
      className="gallery-lightbox-backdrop fixed inset-0 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title || 'Enlarged gallery item'}
    >
      <div className="gallery-lightbox-frame" onClick={(e) => e.stopPropagation()}>
        <div className="gallery-lightbox-stack">
          <GalleryLightboxNavBar
            onClose={onClose}
            slideCount={slideCount}
            slideIndex={slideIndex}
            onPrev={hasSlideNav ? goPrev : undefined}
            onNext={hasSlideNav ? goNext : undefined}
          />
          <div className="gallery-lightbox-stage-wrap">
            <div className="gallery-lightbox-stage" {...swipeHandlers}>
              <GalleryLightboxItemMedia item={item} slideIndex={slideIndex} />
            </div>
          </div>
          <GalleryLightboxChrome
            item={item}
            layers={layers}
            shareUrl={shareUrl}
            shareText={shareText}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
