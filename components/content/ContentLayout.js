import Link from 'next/link';
import { blogIndexHref } from '../../lib/content/blogQuery';
import { normalizeTags, tagToParam } from '../../lib/content/tags';

export default function ContentLayout({ title, subtitle, metaLine, tags, children, className = '' }) {
  const tagList = normalizeTags(tags);
  return (
    <div className={`flex-grow py-8 ${className}`}>
      <article className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{title}</h1>
        {subtitle ? <p className="text-gray-700 dark:text-gray-300 mb-2">{subtitle}</p> : null}
        {metaLine ? (
          <p
            className={`text-sm text-gray-600 dark:text-gray-400 ${tagList.length ? 'mb-2' : 'mb-6'}`}
          >
            {metaLine}
          </p>
        ) : null}
        {tagList.length ? (
          <div className="flex flex-wrap gap-2 mb-6" role="list" aria-label="Tags">
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
        <div className="mdx-article-body space-y-4 text-gray-800 dark:text-gray-200">{children}</div>
      </article>
    </div>
  );
}
