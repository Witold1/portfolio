'use client';

import { useEffect, useState } from 'react';
import GalleryMediaError from './GalleryMediaError';

export function useGalleryMediaStatus(src) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
  }, [src]);

  return {
    status,
    isLoading: status === 'loading',
    isReady: status === 'ready',
    isError: status === 'error',
    markReady: () => setStatus('ready'),
    markError: () => setStatus('error'),
  };
}

export function galleryLightboxMediaClassName(className, status) {
  return `${className} gallery-card-img-fade gallery-lightbox-media-el${status === 'ready' ? ' gallery-lightbox-media-el--visible' : ''}`;
}

/**
 * Shared loading shell for lightbox images and videos.
 */
export default function GalleryLightboxMediaFrame({
  src,
  status,
  errorMessage,
  children,
}) {
  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isReady = status === 'ready';

  return (
    <div
      className={[
        'gallery-lightbox-media',
        'gallery-lightbox-media-wrap',
        isReady ? 'gallery-lightbox-media-wrap--ready' : 'gallery-lightbox-media-wrap--loading',
        isError ? 'gallery-lightbox-media-wrap--error' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading ? <div className="gallery-card-skeleton gallery-lightbox-skeleton" aria-hidden /> : null}
      {isError ? (
        <GalleryMediaError message={errorMessage} variant="lightbox" />
      ) : (
        children
      )}
    </div>
  );
}
