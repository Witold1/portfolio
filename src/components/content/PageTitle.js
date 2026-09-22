'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import RotatingTitleView from './RotatingTitleView';

const PageTitleSetContext = createContext(null);
const PageTitleValueContext = createContext(null);

/**
 * Lets MDX shortcodes (e.g. `<RotatingTitle />`) replace the article h1
 * without putting the animated title down in the body flow.
 */
export function PageTitleProvider({ fallbackTitle, children }) {
  const [rotate, setRotate] = useState(null);
  const value = useMemo(() => ({ fallbackTitle, rotate }), [fallbackTitle, rotate]);
  return (
    <PageTitleSetContext.Provider value={setRotate}>
      <PageTitleValueContext.Provider value={value}>{children}</PageTitleValueContext.Provider>
    </PageTitleSetContext.Provider>
  );
}

/** Renders frontmatter title, or the MDX-configured rotating title when present. */
export function PageTitle() {
  const ctx = useContext(PageTitleValueContext);
  const fallbackTitle = ctx?.fallbackTitle;
  const rotate = ctx?.rotate;

  if (rotate?.variants?.length) {
    return (
      <RotatingTitleView
        variants={rotate.variants}
        intervalMs={rotate.intervalMs}
        fadeMs={rotate.fadeMs}
      />
    );
  }

  if (fallbackTitle == null || fallbackTitle === '') return null;
  return <h1 className="content-title">{fallbackTitle}</h1>;
}

/**
 * MDX shortcode: configure the page h1 rotation. Renders nothing in the body.
 *
 * @example
 * <RotatingTitle
 *   variants={["Ukraine's bloody tool", "Кровавая цена Украины", "Криваві ціна України"]}
 * />
 */
export function RotatingTitle({ variants = [], intervalMs = 2500, fadeMs = 800 }) {
  const setRotate = useContext(PageTitleSetContext);
  const key = Array.isArray(variants) ? variants.join('\0') : '';

  useEffect(() => {
    if (!setRotate) return undefined;
    const list = Array.isArray(variants)
      ? variants.filter((v) => typeof v === 'string' && v.trim())
      : [];
    if (!list.length) {
      setRotate(null);
      return undefined;
    }
    setRotate({ variants: list, intervalMs, fadeMs });
    return () => setRotate(null);
    // key stands in for variants contents
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRotate, key, intervalMs, fadeMs]);

  return null;
}
