'use client';

import { useState } from 'react';

const DEFAULT_KICKER = 'Under construction';
const DEFAULT_HINT = 'Click to peek anyway';

/**
 * Kinopoisk-style blurry cover over unfinished content.
 * Click once to dismiss and reveal the body.
 */
export default function WipReveal({
  active = true,
  kicker = DEFAULT_KICKER,
  title = 'This page is still in progress',
  hint = DEFAULT_HINT,
  children,
}) {
  const [open, setOpen] = useState(false);

  if (!active) return children;

  return (
    <div className={`wip-reveal${open ? ' is-open' : ''}`}>
      <div className="wip-reveal-content">{children}</div>
      {!open ? (
        <button
          type="button"
          className="wip-reveal-cover"
          onClick={() => setOpen(true)}
          aria-label={`${title}. ${hint}`}
        >
          <span className="wip-reveal-kicker">{kicker}</span>
          <span className="wip-reveal-title">{title}</span>
          <span className="wip-reveal-hint">{hint}</span>
        </button>
      ) : null}
    </div>
  );
}
