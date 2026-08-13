'use client';

import { memo } from 'react';
import GalleryGridCard from './GalleryGridCard';

const GalleryGrid = memo(({ items, onCardClick, layout = 'uniform' }) => {
  if (layout === 'variable') {
    return (
      <div className="columns-1 sm:columns-2 md:columns-3 gap-2">
        {items.map((item) => {
          const { className: itemClassName, ...cardProps } = item;
          return (
            <div key={item.id} className="break-inside-avoid mb-2">
              <GalleryGridCard
                {...cardProps}
                className={itemClassName || ''}
                gridType="variable"
                onClick={onCardClick}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {items.map((item) => {
        const { className: itemClassName, ...cardProps } = item;
        const showTitleBelow = Boolean(item.showTitleBelow);
        return (
          <div
            key={item.id}
            className={
              showTitleBelow
                ? 'relative w-full'
                : 'relative w-full aspect-square overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800'
            }
          >
            <GalleryGridCard
              {...cardProps}
              className={[showTitleBelow ? '' : 'absolute inset-0', itemClassName].filter(Boolean).join(' ')}
              gridType="uniform"
              onClick={onCardClick}
            />
          </div>
        );
      })}
    </div>
  );
});

GalleryGrid.displayName = 'GalleryGrid';

export default GalleryGrid;
