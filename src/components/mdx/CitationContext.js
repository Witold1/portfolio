'use client';

import { createContext, useContext } from 'react';

const CitationPageContext = createContext(null);

/** Supplies default `citeMeta` for `<CitationBox />` from post/project frontmatter (built at build time). */
export function CitationProvider({ meta, children }) {
  return <CitationPageContext.Provider value={meta}>{children}</CitationPageContext.Provider>;
}

export function useCitationPageMeta() {
  return useContext(CitationPageContext);
}
