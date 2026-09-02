'use client';

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePrimaryInputIsHoverNone } from '../../lib/usePrimaryInputIsHoverNone';
import { useEscapeToClose } from '../../lib/useEscapeToClose';

const FootnotesContext = createContext(null);

function FootnoteDrawer() {
  const { drawerId, closeDrawer, get } = useFootnotes();
  const drawerBodyId = useId();

  useEscapeToClose(closeDrawer, { enabled: Boolean(drawerId) });

  if (!drawerId) return null;

  const entry = get(drawerId);
  if (!entry?.content) return null;

  return createPortal(
    <>
      <button
        type="button"
        className="mdx-footnote-drawer-backdrop"
        onClick={closeDrawer}
        aria-label="Close footnote"
      />
      <div
        className="mdx-footnote-drawer"
        role="dialog"
        aria-label={`Footnote ${drawerId}`}
        aria-modal="true"
      >
        <button
          type="button"
          className="mdx-footnote-drawer-toggle"
          onClick={closeDrawer}
          aria-expanded="true"
          aria-controls={drawerBodyId}
          aria-label="Hide footnote"
        >
          <svg
            className="mdx-footnote-drawer-chevron is-open"
            viewBox="0 0 24 12"
            width="28"
            height="14"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M4 9.5 12 2.5l8 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div id={drawerBodyId} className="mdx-footnote-drawer-body">
          {entry.content}
        </div>
      </div>
    </>,
    document.body,
  );
}

export function FootnotesProvider({ children }) {
  const [registry, setRegistry] = useState(() => new Map()); // id -> { id, content }
  const [drawerId, setDrawerId] = useState(null);

  const register = useCallback((id, content) => {
    if (!id) return;
    const key = String(id);
    setRegistry((prev) => {
      const next = new Map(prev);
      next.set(key, { id: key, content });
      return next;
    });
  }, []);
  const unregister = useCallback((id) => {
    if (!id) return;
    const key = String(id);
    setRegistry((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);
  const get = useCallback((id) => registry.get(String(id)), [registry]);
  const list = useCallback(() => Array.from(registry.values()), [registry]);
  const closeDrawer = useCallback(() => setDrawerId(null), []);
  const toggleDrawer = useCallback((id) => {
    const key = String(id);
    setDrawerId((prev) => (prev === key ? null : key));
  }, []);

  const value = useMemo(
    () => ({ register, unregister, get, list, drawerId, closeDrawer, toggleDrawer }),
    [register, unregister, get, list, drawerId, closeDrawer, toggleDrawer],
  );

  return (
    <FootnotesContext.Provider value={value}>
      {children}
      <FootnoteDrawer />
    </FootnotesContext.Provider>
  );
}

function useFootnotes() {
  const ctx = useContext(FootnotesContext);
  if (!ctx) {
    throw new Error('Footnote components must be used inside <FootnotesProvider>.');
  }
  return ctx;
}

export function FootnoteDefinition({ id, children }) {
  const { register, unregister } = useFootnotes();
  useEffect(() => {
    register(id, children);
    return () => unregister(id);
  }, [id, children, register, unregister]);
  return null;
}

export function Footnotes({ title = 'Footnotes', children }) {
  // This component is mostly a semantic wrapper that lets you colocate
  // <FootnoteDefinition /> blocks near the section they belong to.
  return (
    <section className="mdx-footnotes">
      <div className="mdx-footnotes-header">
        <strong>{title}</strong>
      </div>
      <div className="mdx-footnotes-body">{children}</div>
      <FootnotesSection />
    </section>
  );
}

function FootnotesSection() {
  const { list } = useFootnotes();
  const items = list();
  if (items.length === 0) return null;

  return (
    <ol className="mdx-footnotes-list">
      {items.map((it) => (
        <li key={it.id} id={`fn-${it.id}`} className="mdx-footnotes-item">
          <div className="mdx-footnotes-body-row">
            {it.content}
            <a className="mdx-footnotes-back" href={`#fnref-${it.id}`} aria-label="Back to reference">
              {'\u21A9\uFE0E'}
            </a>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function FootnoteRef({ id }) {
  const { get, drawerId, toggleDrawer } = useFootnotes();
  const touchUi = usePrimaryInputIsHoverNone();
  const [open, setOpen] = useState(false);
  const entry = get(id);

  const label = String(id);
  const hasPreview = Boolean(entry?.content);
  const isDrawerOpen = touchUi && drawerId === label;

  return (
    <span className="mdx-footnote-refwrap">
      <sup>
        <a
          id={`fnref-${label}`}
          href={`#fn-${label}`}
          className={`mdx-footnote-ref${isDrawerOpen ? ' mdx-footnote-ref--active' : ''}`}
          onMouseEnter={() => !touchUi && hasPreview && setOpen(true)}
          onMouseLeave={() => !touchUi && setOpen(false)}
          onFocus={() => !touchUi && hasPreview && setOpen(true)}
          onBlur={() => !touchUi && setOpen(false)}
          onClick={(event) => {
            if (touchUi && hasPreview) {
              event.preventDefault();
              toggleDrawer(label);
              return;
            }
            setOpen(false);
          }}
          aria-label={`Footnote ${label}`}
          aria-expanded={touchUi && hasPreview ? isDrawerOpen : undefined}
        >
          {label}
        </a>
      </sup>

      {hasPreview && open && !touchUi ? (
        <span className="mdx-footnote-popover" role="note">
          {entry.content}
        </span>
      ) : null}
    </span>
  );
}
