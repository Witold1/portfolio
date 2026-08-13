import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const FootnotesContext = createContext(null);

export function FootnotesProvider({ children }) {
  const [registry, setRegistry] = useState(() => new Map()); // id -> { id, content }
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

  const value = useMemo(() => ({ register, unregister, get, list }), [register, unregister, get, list]);
  return <FootnotesContext.Provider value={value}>{children}</FootnotesContext.Provider>;
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
  const { get } = useFootnotes();
  const [open, setOpen] = useState(false);
  const entry = get(id);

  const label = String(id);
  const hasPreview = Boolean(entry?.content);

  return (
    <span className="mdx-footnote-refwrap">
      <sup>
        <a
          id={`fnref-${label}`}
          href={`#fn-${label}`}
          className="mdx-footnote-ref"
          onMouseEnter={() => hasPreview && setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => hasPreview && setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={() => {
            // Keep default anchor behavior, but close preview
            setOpen(false);
          }}
          aria-label={`Footnote ${label}`}
        >
          {label}
        </a>
      </sup>

      {hasPreview && open ? (
        <span className="mdx-footnote-popover" role="note">
          {entry.content}
        </span>
      ) : null}
    </span>
  );
}

