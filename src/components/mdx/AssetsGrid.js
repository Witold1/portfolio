'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ContentLayoutToolbar from '../content/ContentLayoutToolbar';
import GalleryGrid from '../gallery/GalleryGrid';
import GalleryLightbox from '../gallery/GalleryLightbox';
import {
  filterMdxNavItems,
  mdxNavItemToGalleryItem,
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

/** `@param {'navigate'|'lightbox'} onClick` — tile click behavior. */
function normalizeOnClick(onClick) {
  return onClick === 'navigate' ? 'navigate' : 'lightbox';
}

function normalizeSize(size) {
  return size === 'sm' ? 'sm' : 'md';
}

function normalizeView(view) {
  return view === 'list' ? 'list' : 'grid';
}

export default function AssetsGrid({
  items = [],
  imageFit = 'cover',
  /** @deprecated unused; kept so old MDX `grid=` props do not throw. */
  grid: _grid = 'uniform',
  showGridToggle = true,
  /**
   * Tile click behavior:
   * - `lightbox` (default) — open media lightbox
   * - `navigate` — follow each item's `href`
   */
  onClick = 'lightbox',
  size = 'md',
  /** Initial layout: `grid` (media tiles) or `list` (titles only). */
  defaultView = 'grid',
}) {
  const router = useRouter();
  const clickAction = normalizeOnClick(onClick);
  const sizeMode = normalizeSize(size);
  const [view, setView] = useState(() => normalizeView(defaultView));
  const { item: modalItem, isOpen, open, close } = useGalleryLightbox();

  const safe = useMemo(
    () => filterMdxNavItems(items, clickAction),
    [items, clickAction],
  );

  const galleryItems = useMemo(
    () =>
      safe.map((entry, index) =>
        mdxNavItemToGalleryItem(entry, index, { onClick: clickAction, imageFit }),
      ),
    [safe, imageFit, clickAction],
  );

  const onCardClick = useCallback(
    (item) => {
      if (clickAction === 'lightbox') {
        open(item || null);
        return;
      }
      navigateFromTile(item?.link, router);
    },
    [router, clickAction, open],
  );

  if (safe.length === 0) return null;

  return (
    <section className={`mdx-assets-grid mdx-assets-grid--${sizeMode}`}>
      {showGridToggle ? (
        <ContentLayoutToolbar
          className="mdx-assets-grid-toolbar"
          layout={view}
          onGrid={() => setView('grid')}
          onList={() => setView('list')}
        />
      ) : null}
      {view === 'list' ? (
        <ul className="mdx-assets-grid-list">
          {galleryItems.map((item) => {
            const label = item.title || 'Untitled';
            if (item.disabled) {
              return (
                <li
                  key={item.id}
                  className="mdx-assets-grid-list-item mdx-assets-grid-list-item--disabled"
                >
                  <span className="mdx-assets-grid-list-label">{label}</span>
                </li>
              );
            }
            if (clickAction === 'navigate' && item.link) {
              if (isExternalUrl(item.link)) {
                return (
                  <li key={item.id} className="mdx-assets-grid-list-item">
                    <a
                      href={item.link}
                      className="mdx-assets-grid-list-label"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label}
                    </a>
                  </li>
                );
              }
              return (
                <li key={item.id} className="mdx-assets-grid-list-item">
                  <Link href={item.link} className="mdx-assets-grid-list-label">
                    {label}
                  </Link>
                </li>
              );
            }
            return (
              <li key={item.id} className="mdx-assets-grid-list-item">
                <button
                  type="button"
                  className="mdx-assets-grid-list-label"
                  onClick={() => onCardClick(item)}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mdx-assets-grid-gallery-root">
          <GalleryGrid items={galleryItems} onCardClick={onCardClick} layout="uniform" />
        </div>
      )}
      {clickAction === 'lightbox' ? (
        <GalleryLightbox isOpen={isOpen} onClose={close} item={modalItem} />
      ) : null}
    </section>
  );
}
