import { useState } from 'react';
import { slugifyHeading } from '../../lib/content/toc';

export default function CollapsibleSection({
  title,
  level = 3,
  defaultOpen = false,
  showHint = true,
  hintOpen = 'Click or tap to open section',
  hintClose = 'Click or tap to close section',
  children,
}) {
  const id = slugifyHeading(title);
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const safeLevel = Number.isFinite(level) ? Math.max(2, Math.min(6, level)) : 3;

  return (
    <details
      className="mdx-collapsible"
      data-mdx-level={level}
      open={open}
      onToggle={(e) => {
        // Nested <details>: toggle bubbles; e.target is the innermost <details> that fired.
        // Always read this element's open state so closing level={4} does not sync parent level={3} to the child's open.
        setOpen(e.currentTarget.open);
      }}
    >
      <summary className="mdx-collapsible-summary">
        <div className="mdx-collapsible-summary-heading-row">
          <span id={id} className="mdx-heading" data-mdx-heading-level={safeLevel}>
            {title}
          </span>
          <span className="mdx-collapsible-caret" aria-hidden="true">
            {open ? '▴' : '▾'}
          </span>
        </div>
        {showHint ? (
          <span className="mdx-collapsible-hint">{open ? hintClose : hintOpen}</span>
        ) : null}
      </summary>
      <div className="mdx-collapsible-body">{children}</div>
    </details>
  );
}
