import Link from 'next/link';
import ContentMetaPanel from './ContentMetaPanel';

export default function ContentLayout({
  title,
  subtitle,
  metaLine,
  tags,
  parentLink = null,
  children,
  className = '',
}) {
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
        <ContentMetaPanel metaLine={metaLine} tags={tags} />
        <div className="mdx-article-body text-gray-800 dark:text-gray-200">{children}</div>
      </article>
    </div>
  );
}
