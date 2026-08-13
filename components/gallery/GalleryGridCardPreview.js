'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { GALLERY_BLUR_DATA_URL } from '../../lib/gallery';
import { inferMediaTypeFromSrc } from '../../lib/inferMediaType';
import { cdnPosterUrl, cdnPreviewUrl } from '../../lib/mediaUrl';
import GalleryCardMediaOverlay from './GalleryCardMediaOverlay';
import GalleryMediaError from './GalleryMediaError';
import { useGalleryMediaStatus } from './GalleryLightboxMediaFrame';

function gridPreviewSrc(type, src, slides) {
  if (type === 'carousel' && slides?.[0]?.src) {
    return cdnPreviewUrl(slides[0].src, slides[0].type);
  }
  return cdnPreviewUrl(src, type === 'video' ? 'video' : undefined);
}

function gridPreviewFallback(type, src, slides, current) {
  const mediaSrc =
    type === 'carousel' && slides?.[0]?.src ? slides[0].src : src;
  const mediaType =
    type === 'carousel' && slides?.[0]
      ? slides[0].type
      : type === 'video'
        ? 'video'
        : undefined;
  const poster = cdnPosterUrl(mediaSrc);
  if (poster && current !== poster) return poster;
  if (mediaSrc && current !== mediaSrc && !/\.(mp4|webm|mov|m4v)(\?|$)/i.test(mediaSrc)) {
    return mediaSrc;
  }
  return '';
}

/**
 * Image, video, or carousel-fallback preview inside a grid card.
 * Uses CDN `.thumb.webp` (incl. video thumbs) when available; lightbox still gets full `src`.
 */
export default function GalleryGridCardPreview({
  type,
  src,
  slides,
  isUniform,
  showTitleBelow,
  uniformObjectFit = 'cover',
  imageAlt,
  slideCount,
  showHoverStrip,
  hoverStripProps,
}) {
  const preferred = gridPreviewSrc(type, src, slides) || src;
  const [displaySrc, setDisplaySrc] = useState(preferred);

  useEffect(() => {
    setDisplaySrc(preferred);
  }, [preferred]);

  const carouselFirstIsVideo =
    type === 'carousel' &&
    slides?.[0] &&
    inferMediaTypeFromSrc(slides[0].src, slides[0].type) === 'video';
  const isVideoPreview = type === 'video' || carouselFirstIsVideo;
  const showsAsImage = type === 'image' || type === 'carousel' || isVideoPreview;
  const { status, markReady, markError } = useGalleryMediaStatus(displaySrc);
  const isLoading = status === 'loading';
  const isReady = status === 'ready';
  const isError = status === 'error';

  const onPreviewError = useCallback(() => {
    const next = gridPreviewFallback(type, src, slides, displaySrc);
    if (next) {
      setDisplaySrc(next);
      return;
    }
    markError();
  }, [displaySrc, src, slides, type, markError]);

  const uniformBackdrop =
    isUniform &&
    showsAsImage &&
    isReady &&
    (uniformObjectFit === 'contain' || uniformObjectFit === 'none');
  const uniformImgClass =
    isUniform && showsAsImage
      ? uniformObjectFit === 'contain'
        ? 'object-contain'
        : uniformObjectFit === 'none'
          ? 'object-none'
          : 'object-cover'
      : null;

  const overlay = (
    <GalleryCardMediaOverlay
      slideCount={slideCount}
      showHoverStrip={showHoverStrip}
      hoverStripProps={hoverStripProps}
    />
  );

  if (type === 'image' || type === 'carousel' || isVideoPreview) {
    if (!displaySrc && type === 'carousel') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-4">
          <p className="text-gray-700 dark:text-zinc-300 text-sm">Carousel (no preview)</p>
        </div>
      );
    }

    return (
      <div
        className={`relative isolate w-full ${isUniform ? (showTitleBelow ? 'aspect-square' : 'h-full') : `h-auto ${isReady || isError ? '' : 'min-h-[12rem] sm:min-h-[14rem]'}`} ${(!isUniform && isReady) || uniformBackdrop || isError ? 'bg-zinc-100 dark:bg-zinc-950/50' : ''}`}
      >
        {isLoading ? (
          <div className="gallery-card-skeleton absolute inset-0 z-[1]" aria-hidden />
        ) : null}
        {isError ? (
          <GalleryMediaError
            message="Could not load image"
            className="absolute inset-0"
          />
        ) : (
          <Image
            src={displaySrc}
            alt={imageAlt}
            fill={isUniform}
            width={!isUniform ? 0 : undefined}
            height={!isUniform ? 0 : undefined}
            sizes={isUniform ? '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw' : '100vw'}
            style={!isUniform ? { width: '100%', height: 'auto' } : undefined}
            className={`gallery-card-img-fade z-[2] ${isUniform && uniformImgClass ? uniformImgClass : !isUniform ? 'object-contain relative block w-full' : ''} ${
              isReady ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            quality={75}
            placeholder="blur"
            blurDataURL={GALLERY_BLUR_DATA_URL}
            onLoad={markReady}
            onError={onPreviewError}
          />
        )}
        {overlay}
      </div>
    );
  }

  return null;
}
