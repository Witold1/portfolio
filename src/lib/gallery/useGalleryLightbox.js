'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Lightbox open/close state. When `syncQuery` is true, keeps `?item=` in sync (gallery page).
 */
export function useGalleryLightbox({ syncQuery = false, queryKey = 'item', catalog = null } = {}) {
  const router = useRouter();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!syncQuery) return;
    const queryId = router.query[queryKey];
    if (!queryId) {
      setItem(null);
      return;
    }
    if (!Array.isArray(catalog) || catalog.length === 0) return;
    const found = catalog.find((entry) => String(entry.id) === String(queryId));
    setItem(found || null);
  }, [syncQuery, router.query, queryKey, catalog]);

  const open = useCallback(
    (nextItem) => {
      setItem(nextItem || null);
      if (syncQuery && nextItem?.id != null) {
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, [queryKey]: String(nextItem.id) },
          },
          undefined,
          { shallow: true },
        );
      }
    },
    [syncQuery, router, queryKey],
  );

  const close = useCallback(() => {
    setItem(null);
    if (!syncQuery) return;
    const nextQuery = { ...router.query };
    delete nextQuery[queryKey];
    router.push(
      { pathname: router.pathname, query: nextQuery },
      undefined,
      { shallow: true },
    );
  }, [syncQuery, router, queryKey]);

  return {
    item,
    isOpen: Boolean(item),
    open,
    close,
  };
}
