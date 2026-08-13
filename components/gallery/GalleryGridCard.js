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
  }) => {
    const isUniform = gridType === 'uniform';
    const [peek, setPeek] = useState(false);
    const cardRef = useRef(null);
    const touchUi = usePrimaryInputIsHoverNone();

    useEffect(() => {
      setPeek(false);
    }, [src, id]);

    useEffect(() => {
      if (!touchUi || !peek) return;
      const onDocPointerDown = (ev) => {
        const el = cardRef.current;
        if (el && ev.target instanceof Node && !el.contains(ev.target)) {
          setPeek(false);
        }
      };
      document.addEventListener('pointerdown', onDocPointerDown, true);
      return () => document.removeEventListener('pointerdown', onDocPointerDown, true);
    }, [touchUi, peek]);

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
      if (touchUi && showHoverStrip) {
        if (!peek) {
          setPeek(true);
          return;
        }
      }
      setPeek(false);
      openModal();
    }, [disabled, touchUi, showHoverStrip, peek, openModal]);

    const peekClass = touchUi && peek ? 'gallery-card--peek' : '';

    return (
      <div
        ref={cardRef}
        className={`gallery-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className} ${disabled ? 'gallery-card--disabled' : 'cursor-pointer'}${peekClass ? ` ${peekClass}` : ''}`}
        onClick={handleCardClick}
        aria-expanded={touchUi && showHoverStrip && !disabled ? peek : undefined}
        aria-disabled={disabled ? true : undefined}
      >
        <GalleryGridCardPreview
          type={type}
          src={src}
          slides={slides}
          isUniform={isUniform}
          showTitleBelow={showTitleBelow}
          uniformObjectFit={uniformObjectFit}
          imageAlt={imageAlt}
          slideCount={slideCount}
          showHoverStrip={showHoverStrip}
          hoverStripProps={hoverStripProps}
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
