'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import GalleryGrid from '../gallery/GalleryGrid';
import GalleryGridLayoutToolbar from '../gallery/GalleryGridLayoutToolbar';
import GalleryLightbox from '../gallery/GalleryLightbox';
import {
  filterMdxNavItems,
  mdxNavItemToGalleryItem,
  normalizeGalleryGridType,
  useGalleryLightbox,
} from '../../lib/gallery';
import { isExternalUrl } from '../../lib/isExternalUrl';

function navigateFromTile(href, router) {
  if (!href || href === '#') return;
  const s = String(href);
  if (isExternalUrl(s)) {
    if (s.startsWith('mailto:') || s.startsWith('tel:')) {
      window.location.href = s;
      return;
    }
    window.open(s, '_blank', 'noopener,noreferrer');
    return;
  }
  router.push(s);
}

function normalizeMode(mode) {
  return mode === 'modal' ? 'modal' : 'link';
}

function normalizeSize(size) {
  return size === 'sm' ? 'sm' : 'md';
}

export default function MediaGrid({
  title,
  items = [],
  imageFit = 'none',
  grid = 'uniform',
  showGridToggle = true,
  mode = 'modal',
  size = 'md',
}) {
  const router = useRouter();
  const lockedGrid = normalizeGalleryGridType(grid);
  const interactionMode = normalizeMode(mode);
  const sizeMode = normalizeSize(size);
  const [gridType, setGridType] = useState(lockedGrid);
  const { item: modalItem, isOpen, open, close } = useGalleryLightbox();
  const effectiveGrid = showGridToggle ? gridType : lockedGrid;

  const safe = useMemo(
    () => filterMdxNavItems(items, interactionMode),
    [items, interactionMode],
  );

  const galleryItems = useMemo(
    () =>
      safe.map((entry, index) =>
        mdxNavItemToGalleryItem(entry, index, { interactionMode, imageFit }),
      ),
    [safe, imageFit, interactionMode],
  );

  const onCardClick = useCallback(
    (item) => {
      if (interactionMode === 'modal') {
        open(item || null);
        return;
      }
      navigateFromTile(item?.link, router);
    },
    [router, interactionMode, open],
  );

  if (safe.length === 0) return null;

  return (
    <section className={`mdx-navgrid mdx-navgrid--${sizeMode}`}>
      {title ? <h3 className="mdx-navgrid-title">{title}</h3> : null}
      {showGridToggle ? (
        <GalleryGridLayoutToolbar
          className="mdx-navgrid-grid-toolbar"
          gridType={effectiveGrid}
          onUniform={() => setGridType('uniform')}
          onVariable={() => setGridType('variable')}
        />
      ) : null}
      <div className="mdx-navgrid-gallery-root">
        <GalleryGrid items={galleryItems} onCardClick={onCardClick} layout={effectiveGrid} />
      </div>
      {interactionMode === 'modal' ? (
        <GalleryLightbox isOpen={isOpen} onClose={close} item={modalItem} />
      ) : null}
    </section>
  );
}
