'use client';

import GalleryLightboxCarousel from './GalleryLightboxCarousel';
import GalleryLightboxMedia from './GalleryLightboxMedia';
import { getGalleryItemType, isGalleryContentType } from '../../lib/gallery';

function GalleryLightboxError({ children }) {
  return <p className="gallery-lightbox-error">{children}</p>;
}

/** Renders the correct media for a gallery lightbox item. */
export default function GalleryLightboxItemMedia({ item }) {
  const type = getGalleryItemType(item);

  if (item?.type && !isGalleryContentType(item.type)) {
    return <GalleryLightboxError>Unsupported content type: {item.type}</GalleryLightboxError>;
  }

  if (type === 'carousel') {
    return <GalleryLightboxCarousel slides={item.slides} title={item.title} />;
  }

  if (!item?.src) {
    return (
      <GalleryLightboxError>
        Error: Invalid {type === 'video' ? 'video' : 'image'} source
      </GalleryLightboxError>
    );
  }

  return (
    <GalleryLightboxMedia
      src={item.src}
      alt={item.title || `${type === 'video' ? 'Video' : 'Gallery'} item ${item.id}`}
      type={type}
      autoPlay={type === 'video'}
    />
  );
}
