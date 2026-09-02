'use client';

import Image from 'next/image';
import { GALLERY_BLUR_DATA_URL } from '../../lib/gallery';
import { inferMediaTypeFromSrc } from '../../lib/inferMediaType';
import { cdnPosterUrl } from '../../lib/mediaUrl';
import GalleryLightboxMediaFrame, {
  galleryLightboxMediaClassName,
  useGalleryMediaStatus,
} from './GalleryLightboxMediaFrame';

/** Single lightbox image or video with shared loading shell. */
export default function GalleryLightboxMedia({
  src,
  alt,
  type,
  priority = false,
  autoPlay = false,
  imageClassName = 'gallery-lightbox-media-img',
  videoClassName = 'gallery-lightbox-media-el',
}) {
  const isVideo = inferMediaTypeFromSrc(src, type) === 'video';
  const poster = isVideo ? cdnPosterUrl(src) : '';
  const { status, markReady, markError } = useGalleryMediaStatus(src);
  const errorMessage = isVideo ? 'Could not load video' : 'Could not load image';

  return (
    <GalleryLightboxMediaFrame src={src} status={status} errorMessage={errorMessage}>
      {isVideo ? (
        <video
          key={src}
          src={src}
          poster={poster || undefined}
          controls
          autoPlay={autoPlay}
          preload="metadata"
          className={galleryLightboxMediaClassName(videoClassName, status)}
          aria-label={alt}
          onLoadedData={markReady}
          onError={markError}
        />
      ) : (
        <Image
          key={src}
          src={src}
          alt={alt}
          width={0}
          height={0}
          sizes="(max-width: 1024px) 100vw, 896px"
          className={galleryLightboxMediaClassName(imageClassName, status)}
          quality={90}
          priority={priority}
          placeholder="blur"
          blurDataURL={GALLERY_BLUR_DATA_URL}
          onLoad={markReady}
          onError={markError}
        />
      )}
    </GalleryLightboxMediaFrame>
  );
}
