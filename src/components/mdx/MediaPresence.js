import { slugifyHeading } from '../../lib/content/toc';
import MdxLink from './MdxLink';

export default function MediaPresence({ title = 'Media presence', items = [] }) {
  const safe = Array.isArray(items) ? items.filter((x) => x?.href) : [];
  const headingId = slugifyHeading(title);

  return (
    <section className="mdx-media">
      <h2 id={headingId} className="mdx-media-header">
        {title}
      </h2>
      {safe.length > 0 ? (
        <ul className="mdx-media-list">
          {safe.map((it, idx) => (
            <li key={`${it.href}-${idx}`}>
              <MdxLink href={it.href}>{it.label || it.href}</MdxLink>
              {it.note ? <span className="mdx-media-note"> {it.note}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mdx-media-note">No external mentions listed.</p>
      )}
    </section>
  );
}
