import Link from 'next/link';
import { blogIndexHref } from '../../lib/content/blogQuery';
import { normalizeTags, tagToParam } from '../../lib/content/tags';

export default function ContentLayout({
  title,
  subtitle,
  metaLine,
  tags,
  parentLink = null,
  children,
  className = '',
}) {
  const tagList = normalizeTags(tags);
  return (
    <div className={`flex-grow py-8 ${className}`}>
      <article className="max-w-5xl mx-auto px-4">
        {parentLink?.href && parentLink?.title ? (
          <p className="content-part-of">
            Part of{' '}
            <Link href={parentLink.href} className="content-part-of-link">
              {parentLink.title}
            </Link>
          </p>
        ) : null}
        {typeof title === 'string' || typeof title === 'number' ? (
          <h1 className="content-title">{title}</h1>
        ) : (
          title
        )}
        {subtitle ? <p className="content-subtitle">{subtitle}</p> : null}
        {metaLine ? (
          <div
            className={`content-meta-line${tagList.length ? ' content-meta-line--before-tags' : ' content-meta-line--before-body'}`}
          >
            {metaLine}
          </div>
        ) : null}
        {tagList.length ? (
          <div className="content-tag-index mb-3" role="list" aria-label="Tags">
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
        <div className="mdx-article-body text-gray-800 dark:text-gray-200">{children}</div>
      </article>
    </div>
  );
}
