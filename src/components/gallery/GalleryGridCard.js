'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  buildGalleryCardHoverMeta,
  buildGalleryCardImageAlt,
  isGalleryContentType,
  pickGalleryLightboxItem,
} from '../../lib/gallery';
import { usePrimaryInputIsHoverNone } from '../../lib/usePrimaryInputIsHoverNone';
import GalleryGridCardPreview from './GalleryGridCardPreview';

const GalleryGridCard = memo(
  ({
    id,
    type,
    src,
    categories,
    className,
    gridType,
    onClick,
    title,
    alt,
    notes,
    link,
    subtitle,
    slides,
    disabled,
    uniformObjectFit = 'cover',
    showCardSubtitle = false,
    showCategoryOnHover = false,
    showTitleBelow = false,
    showTitleOnMedia = false,
  }) => {
    const isUniform = gridType === 'uniform';
    const isCaptionTile = showTitleBelow || showTitleOnMedia;
    const [peek, setPeek] = useState(false);
    const cardRef = useRef(null);
    const touchUi = usePrimaryInputIsHoverNone();

    useEffect(() => {
      setPeek(false);
    }, [src, id]);

    useEffect(() => {
      if (!touchUi || !peek || showTitleOnMedia) return;
      const onDocPointerDown = (ev) => {
        const el = cardRef.current;
        if (el && ev.target instanceof Node && !el.contains(ev.target)) {
          setPeek(false);
        }
      };
      document.addEventListener('pointerdown', onDocPointerDown, true);
      return () => document.removeEventListener('pointerdown', onDocPointerDown, true);
    }, [touchUi, peek, showTitleOnMedia]);

    const hoverMeta = buildGalleryCardHoverMeta({
      title,
      subtitle,
      categories,
      showCardSubtitle,
      showCategoryOnHover,
    });
    const { showHoverStrip, ...hoverStripProps } = hoverMeta;
    const { titleTrimmed } = hoverMeta;
    const imageAlt = buildGalleryCardImageAlt({ alt, titleTrimmed, categoryLine: hoverMeta.categoryLine, id });
    const slideCount = Array.isArray(slides) ? slides.length : 0;
    const overlayStrip = showTitleOnMedia ? Boolean(titleTrimmed) : showHoverStrip;

    const openModal = useCallback(() => {
      onClick(
        pickGalleryLightboxItem({
          id,
          type,
          src,
          categories,
          title,
          subtitle,
          notes,
          link,
          slides,
        }),
      );
    }, [onClick, id, type, src, categories, title, subtitle, notes, link, slides]);

    const handleCardClick = useCallback(() => {
      if (disabled) return;
      // Persistent on-media titles: skip the touch "peek" step
      if (touchUi && overlayStrip && !showTitleOnMedia) {
        if (!peek) {
          setPeek(true);
          return;
        }
      }
      setPeek(false);
      openModal();
    }, [disabled, touchUi, overlayStrip, showTitleOnMedia, peek, openModal]);

    const peekClass = touchUi && peek && !showTitleOnMedia ? 'gallery-card--peek' : '';
    const chromeClass = isCaptionTile
      ? `gallery-card--caption-tile${showTitleOnMedia ? ' gallery-card--title-on-media' : ' gallery-card--below-title'}`
      : 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';

    return (
      <div
        ref={cardRef}
        className={`gallery-card ${chromeClass} ${className} ${disabled ? 'gallery-card--disabled' : 'cursor-pointer'}${peekClass ? ` ${peekClass}` : ''}`}
        onClick={handleCardClick}
        aria-expanded={
          touchUi && overlayStrip && !showTitleOnMedia && !disabled ? peek : undefined
        }
        aria-disabled={disabled ? true : undefined}
      >
        <GalleryGridCardPreview
          type={type}
          src={src}
          slides={slides}
          isUniform={isUniform}
          useMediaBand={isCaptionTile}
          uniformObjectFit={uniformObjectFit}
          imageAlt={imageAlt}
          slideCount={slideCount}
          showHoverStrip={overlayStrip}
          hoverStripProps={
            showTitleOnMedia
              ? { ...hoverStripProps, titleTrimmed, subTrimmed: '', categoryLine: '', showCategoryMeta: false, hoverMultiline: false }
              : hoverStripProps
          }
        />
        {showTitleBelow && titleTrimmed ? (
          <p className="gallery-card-below-title" title={titleTrimmed}>
            {titleTrimmed}
          </p>
        ) : null}
        {!isGalleryContentType(type) ? (
          <p className="text-gray-700 dark:text-gray-300">Unsupported content type: {type}</p>
        ) : null}
      </div>
    );
  },
);

GalleryGridCard.displayName = 'GalleryGridCard';

export default GalleryGridCard;
