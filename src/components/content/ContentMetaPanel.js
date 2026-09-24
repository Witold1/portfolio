'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { blogIndexHref } from '../../lib/content/blogQuery';
import { normalizeTags, tagToParam } from '../../lib/content/tags';

const DESKTOP_MQ = '(min-width: 768px)';

/**
 * Date / version / tags under the title.
 * Narrow screens: collapsed by default behind a show/hide toggle.
 * md+: always visible (no toggle).
 */
export default function ContentMetaPanel({ metaLine, tags }) {
  const tagList = normalizeTags(tags);
  const hasMeta = Boolean(metaLine);
  const hasTags = tagList.length > 0;
  const [isDesktop, setIsDesktop] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const sync = () => {
      const desktop = mq.matches;
      setIsDesktop(desktop);
      if (desktop) setOpen(false);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (!hasMeta && !hasTags) return null;

  const body = (
    <div className="content-meta-panel__body">
      {hasMeta ? (
        <div
          className={`content-meta-line${hasTags ? ' content-meta-line--before-tags' : ' content-meta-line--before-body'}`}
        >
          {metaLine}
        </div>
      ) : null}
      {hasTags ? (
        <div className="content-tag-index content-tag-index--in-panel" role="list" aria-label="Tags">
          {tagList.map((tag) => (
            <Link
              key={tag}
              role="listitem"
              href={blogIndexHref({ tag: tagToParam(tag) })}
              className="blog-tag-chip"
            >
              {tag}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );

  if (isDesktop) {
    return <div className="content-meta-panel">{body}</div>;
  }

  return (
    <details
      className="content-meta-panel content-meta-panel--collapsible"
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary className="content-meta-panel__summary">
        {open ? 'Hide article metadata and tags' : 'Show article metadata and tags'}
      </summary>
      {body}
    </details>
  );
}
