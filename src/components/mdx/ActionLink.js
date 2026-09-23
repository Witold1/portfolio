import { isExternalUrl } from '../../lib/isExternalUrl';

/**
 * Block CTA for MDX “try the tool / open demo” actions.
 * Zigzag edge (blockquote kinship) + surface fill so it reads as a button.
 * Prefer `title` / `action` props — children can get wrapped in `<p>` by MDX.
 *
 * @example
 * <ActionLink
 *   href="https://example.com/tool"
 *   action="Open interactive web tool"
 *   title="Rulers of the Kazakh Khanate"
 * />
 */
export default function ActionLink({
  href,
  action = 'Open',
  title,
  children,
  className = '',
}) {
  if (!href || typeof href !== 'string') return null;

  const external = isExternalUrl(href);
  const resolvedTitle =
    typeof title === 'string' || typeof title === 'number'
      ? String(title).trim()
      : typeof children === 'string' || typeof children === 'number'
        ? String(children).trim()
        : null;

  if (!action && !resolvedTitle) return null;

  return (
    <a
      href={href}
      className={`mdx-action-link${className ? ` ${className}` : ''}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {action ? <span className="mdx-action-link-action">{action}</span> : null}
      {resolvedTitle ? <span className="mdx-action-link-title">{resolvedTitle}</span> : null}
    </a>
  );
}
