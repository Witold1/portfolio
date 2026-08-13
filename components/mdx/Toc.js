export default function Toc({
  title = 'Table of contents',
  items = [],
  collapsible = true,
  defaultOpen = false,
}) {
  const safe = Array.isArray(items) ? items.filter((x) => x?.href && x?.label) : [];
  if (safe.length === 0) return null;

  // Hierarchical numbering, e.g.:
  // level 2 -> 1
  // level 3 -> 1.1
  // level 4 -> 1.1.1
  // level 5 -> 1.1.1.1
  // level 6 -> 1.1.1.1.1
  const MIN_LEVEL = 2;
  const MAX_LEVEL = 6;
  const counters = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  const content = (
    <div className="mdx-toc-items">
      {safe.map((it) => {
        const rawLevel = Number.isFinite(it.level) ? it.level : MIN_LEVEL;
        const level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, rawLevel));

        if (level === MIN_LEVEL) {
          counters[MIN_LEVEL] += 1;
          for (let i = MIN_LEVEL + 1; i <= MAX_LEVEL; i += 1) counters[i] = 0;
        } else {
          for (let i = MIN_LEVEL; i < level; i += 1) {
            if (counters[i] === 0) counters[i] = 1;
          }
          counters[level] += 1;
          for (let i = level + 1; i <= MAX_LEVEL; i += 1) counters[i] = 0;
        }

        const numeration = `${Array.from({ length: level - MIN_LEVEL + 1 }, (_, idx) => counters[idx + MIN_LEVEL]).join('.')}.`;

        return (
          <div key={it.href} className={`mdx-toc-row mdx-toc-level-${level}`}>
            <span className="mdx-toc-num" aria-hidden="true">
              {numeration}
            </span>
          <a href={it.href} className="mdx-link">
            {it.label}
          </a>
        </div>
        );
      })}
    </div>
  );

  if (!collapsible) {
    return (
      <nav className="mdx-toc" aria-label="Table of contents">
        <div className="mdx-toc-header">
          <strong>{title}</strong>
        </div>
        {content}
      </nav>
    );
  }

  return (
    <details className="mdx-toc mdx-toc-details" open={defaultOpen}>
      <summary className="mdx-toc-summary">
        <strong>{title}</strong>
      </summary>
      {content}
    </details>
  );
}
