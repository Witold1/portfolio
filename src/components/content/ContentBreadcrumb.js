import Link from 'next/link';

/** Remove emoji / pictographic symbols from displayed labels (full string in `title` when needed). */
function stripEmojis(text) {
  if (typeof text !== 'string') return text;
  const out = text
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\uFE0F/g, '')
    .replace(/\u200D/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return out || text;
}

/**
 * Editorial breadcrumb: ordered list, slash separators, no decorative icons.
 * @param {{ items: Array<{ label: string, href?: string, title?: string }> }} props
 * Last item must omit `href` (current page). Earlier items must include `href`.
 */
export default function ContentBreadcrumb({ items }) {
  if (!items?.length) return null;

  return (
    <nav className="content-breadcrumb" aria-label="Breadcrumb">
      <ol className="content-breadcrumb-list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const display = stripEmojis(item.label);
          const titleAttr =
            typeof item.title === 'string' && item.title.trim()
              ? item.title.trim()
              : isLast && typeof item.label === 'string' && item.label !== display
                ? item.label
                : undefined;
          return (
            <li key={`${i}-${item.href || display}`} className="content-breadcrumb-item">
              {isLast ? (
                <span className="content-breadcrumb-current" aria-current="page" title={titleAttr}>
                  {display}
                </span>
              ) : (
                <Link href={item.href} className="content-breadcrumb-link" title={titleAttr}>
                  {display}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
