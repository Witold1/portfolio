'use client';

import { useMemo } from 'react';
import GalleryLightboxButton from './GalleryLightboxButton';
import GalleryLightboxChrome from './GalleryLightboxChrome';
import GalleryLightboxItemMedia from './GalleryLightboxItemMedia';
import {
  buildGalleryShareText,
  buildGalleryShareUrl,
  resolveGalleryLightboxLayers,
} from '../../lib/gallery';
import { useEscapeToClose } from '../../lib/useEscapeToClose';

export default function GalleryLightbox({ isOpen, onClose, item }) {
  useEscapeToClose(onClose, { enabled: isOpen });

  const shareUrl = useMemo(() => buildGalleryShareUrl(item), [item]);

  if (!isOpen || !item) return null;

  const layers = resolveGalleryLightboxLayers(item);
  const shareText = buildGalleryShareText(item);

  return (
    <div
      className="gallery-lightbox-backdrop fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title || 'Enlarged gallery item'}
    >
      <div className="gallery-lightbox-frame" onClick={(e) => e.stopPropagation()}>
        <div className="gallery-lightbox-stack">
          <div className="gallery-lightbox-stage-wrap">
            <GalleryLightboxButton
              variant="close"
              className="gallery-lightbox-close"
              onClick={onClose}
            />
            <div className="gallery-lightbox-stage">
              <GalleryLightboxItemMedia item={item} />
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
    </div>
  );
}
