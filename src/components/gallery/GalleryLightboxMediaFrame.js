'use client';

import { useCallback, useState } from 'react';
import GalleryMediaError from './GalleryMediaError';

/**
 * Track gallery media load state for skeletons / fade-in.
 * Resets synchronously when `src` changes (avoids a useEffect race that can
 * overwrite a cached `onLoad` and leave the cell stuck on the skeleton).
 * `mediaRef` also catches already-complete cached img/video that never re-fire load.
 */
export function useGalleryMediaStatus(src) {
  const [state, setState] = useState({ src, status: 'loading' });

  if (src !== state.src) {
    setState({ src, status: 'loading' });
  }

  const status = src !== state.src ? 'loading' : state.status;

  const markReady = useCallback(() => {
    setState((prev) =>
      prev.src === src && prev.status !== 'ready' ? { src, status: 'ready' } : prev,
    );
  }, [src]);

  const markError = useCallback(() => {
    setState((prev) =>
      prev.src === src && prev.status !== 'error' ? { src, status: 'error' } : prev,
    );
  }, [src]);

  const mediaRef = useCallback(
    (el) => {
      if (!el) return;
      if (el.tagName === 'VIDEO') {
        // Mobile browsers often stop at HAVE_METADATA with preload="metadata"
        // and never fire loadeddata until play — treat metadata as ready.
        if (el.readyState >= HTMLMediaElement.HAVE_METADATA) markReady();
        return;
      }
      if (el.tagName === 'IMG' && el.complete && el.naturalWidth > 0) {
        markReady();
      }
    },
    [markReady],
  );

  return {
    status,
    isLoading: status === 'loading',
    isReady: status === 'ready',
    isError: status === 'error',
    markReady,
    markError,
    mediaRef,
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
