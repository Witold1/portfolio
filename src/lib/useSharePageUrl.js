'use client';

import { useEffect, useState } from 'react';
import { absolutePageUrl, sharePageUrl } from './site';

/** Client-side share URL; switches to localhost in local dev after mount. */
export function useSharePageUrl(pathname) {
  const canonical = pathname ? absolutePageUrl(pathname) : '';
  const [url, setUrl] = useState(canonical);

  useEffect(() => {
    if (!pathname) return;
    setUrl(sharePageUrl(pathname));
  }, [pathname]);

  return url;
}
