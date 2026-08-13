import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BLOG_COLLECTION, getAllContent } from '../../lib/content';
import { filterVisibleContent } from '../../lib/content/hidden';
import { getPopularPosts } from '../../lib/content/popularPosts';
import { blogIndexHref } from '../../lib/content/blogQuery';
import {
  collectSidebarTagsFromPosts,
  formatTagBreadcrumbLabel,
  postHasTagParam,
  prettyTagLabelFromParam,
  tagToParam,
} from '../../lib/content/tags';
import ContentCard from '../../components/content/ContentCard';
import ContentLayoutToolbar from '../../components/content/ContentLayoutToolbar';
import PageMeta from '../../components/content/PageMeta';
import ContentBreadcrumb from '../../components/content/ContentBreadcrumb';
import { useAdminPrefs } from '../../components/admin/AdminPrefsProvider';

const blogCatSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/cat.svg`;
const BLOG_INDEX_TITLE = 'Data & More blog pages📜';

export async function getStaticProps() {
  return { props: { posts: getAllContent(BLOG_COLLECTION) } };
}

export default function BlogIndex({ posts }) {
  const router = useRouter();
  const { showHiddenGallery } = useAdminPrefs();
  const [layout, setLayout] = useState('grid');
  const visiblePosts = useMemo(
    () => filterVisibleContent(posts, { showHidden: showHiddenGallery }),
    [posts, showHiddenGallery],
  );
  const popularPosts = useMemo(() => getPopularPosts(visiblePosts), [visiblePosts]);
  const tagIndex = useMemo(() => collectSidebarTagsFromPosts(visiblePosts), [visiblePosts]);
  const rawTag =
    router.isReady && router.query.tag
      ? Array.isArray(router.query.tag)
        ? router.query.tag[0]
        : router.query.tag
      : '';
  const activeTagSlug = rawTag ? tagToParam(decodeURIComponent(rawTag)) : '';

  const sortMode =
    router.isReady && router.query.sort === 'time' ? 'time' : 'featured';

  const filteredPosts = useMemo(() => {
    if (!activeTagSlug) return visiblePosts;
    return visiblePosts.filter((p) => postHasTagParam(p, activeTagSlug));
  }, [visiblePosts, activeTagSlug]);

  const filteredPopular = useMemo(() => {
    if (!activeTagSlug) return popularPosts;
    return popularPosts.filter((p) => postHasTagParam(p, activeTagSlug));
  }, [popularPosts, activeTagSlug]);

  const globalPopularSlugs = useMemo(
    () => new Set(popularPosts.map((p) => p.slug)),
    [popularPosts],
  );

  const pinnedSlugs = useMemo(
    () => new Set(filteredPopular.map((p) => p.slug)),
    [filteredPopular],
  );

  const otherPosts = useMemo(() => {
    const rest = filteredPosts.filter((p) => !pinnedSlugs.has(p.slug));
    return [...rest].sort((a, b) =>
      String(b.date || '').localeCompare(String(a.date || '')),
    );
  }, [filteredPosts, pinnedSlugs]);

  const postsChronological = useMemo(
    () =>
      [...filteredPosts].sort((a, b) =>
        String(b.date || '').localeCompare(String(a.date || '')),
      ),
    [filteredPosts],
  );

  useEffect(() => {
    const base = "Blog - Witold's Data Consulting";
    if (!router.isReady || !activeTagSlug) {
      document.title = base;
      return undefined;
    }
    document.title = `Tag: ${prettyTagLabelFromParam(activeTagSlug)} | ${base}`;
    return () => {
      document.title = base;
    };
  }, [router.isReady, activeTagSlug]);

  const breadcrumbItems = useMemo(() => {
    const home = { href: '/', label: 'Home' };
    const blog = { href: '/blog/', label: 'Blog', title: BLOG_INDEX_TITLE };
    if (!activeTagSlug) {
      return [home, { label: 'Blog', title: BLOG_INDEX_TITLE }];
    }
    return [home, blog, { label: formatTagBreadcrumbLabel(activeTagSlug) }];
  }, [activeTagSlug]);

  return (
    <div className="content-page flex flex-col">
      <PageMeta
        title="Blog - Witold's Data Consulting"
        description="Articles and experiments in data visualization."
        pathname="/blog/"
      />
      <div className="content-main">
        <div className="content-reading">
          <div className="content-breadcrumb-rail">
            <ContentBreadcrumb items={breadcrumbItems} />
          </div>
          <div className="content-shell">
            {activeTagSlug ? (
              <div className="blog-tag-filter-banner">
                <p>
                  Showing posts tagged <strong>{prettyTagLabelFromParam(activeTagSlug)}</strong>.{' '}
                  <Link href={blogIndexHref({ sort: sortMode })} className="blog-tag-filter-clear">
                    Clear filter
                  </Link>
                </p>
              </div>
            ) : null}
            <div className="content-primary-stack">
              {filteredPosts.length > 0 ? (
                <div className="content-primary-controls">
                  <div className="content-sort" role="group" aria-label="Sort posts">
                    <span className="content-section-label">Order</span>
                    <Link
                      href={blogIndexHref({ tag: activeTagSlug, sort: 'featured' })}
                      className={`content-sort-link${sortMode === 'featured' ? ' content-sort-link--active' : ''}`}
                      aria-current={sortMode === 'featured' ? 'true' : undefined}
                    >
                      Featured first
                    </Link>
                    <Link
                      href={blogIndexHref({ tag: activeTagSlug, sort: 'time' })}
                      className={`content-sort-link${sortMode === 'time' ? ' content-sort-link--active' : ''}`}
                      aria-current={sortMode === 'time' ? 'true' : undefined}
                    >
                      Newest first
                    </Link>
                  </div>
                  <ContentLayoutToolbar
                    layout={layout}
                    onGrid={() => setLayout('grid')}
                    onList={() => setLayout('list')}
                  />
                </div>
              ) : null}
              <div
                className={`content-primary${layout === 'list' ? ' content-primary--list' : ''}`}
              >
                {sortMode === 'featured' && filteredPopular.length > 0 ? (
                  <section className="content-popular-section" aria-label="Featured posts">
                    {filteredPopular.map((post) => (
                      <ContentCard
                        key={`feat-${post.slug}`}
                        featured
                        href={`/blog/${post.slug}`}
                        title={post.title}
                        subtitle={post.subtitle}
                        excerpt={post.excerpt}
                        date={post.date}
                        image={post.coverImage}
                      />
                    ))}
                  </section>
                ) : null}
                {filteredPosts.length === 0 ? (
                  <p className="blog-tag-empty text-gray-700 dark:text-gray-400">
                    No posts with this tag.{' '}
                    <Link href={blogIndexHref({ sort: sortMode })} className="blog-tag-filter-clear">
                      View all posts
                    </Link>
                  </p>
                ) : sortMode === 'time' ? (
                  postsChronological.map((post) => (
                    <ContentCard
                      key={post.slug}
                      featured={globalPopularSlugs.has(post.slug)}
                      href={`/blog/${post.slug}`}
                      title={post.title}
                      subtitle={post.subtitle}
                      excerpt={post.excerpt}
                      date={post.date}
                      image={post.coverImage}
                    />
                  ))
                ) : (
                  otherPosts.map((post) => (
                    <ContentCard
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      title={post.title}
                      subtitle={post.subtitle}
                      excerpt={post.excerpt}
                      date={post.date}
                      image={post.coverImage}
                    />
                  ))
                )}
              </div>
            </div>
            <aside className="content-aside">
              <div className="content-sidecard">
                <div className="content-sidecard-media">
                  <img
                    src={blogCatSrc}
                    width={512}
                    height={512}
                    alt=""
                    className="content-sidecard-media-img"
                  />
                </div>
                <p>Welcome-meow. Notes, experiments, and the occasional data digression.</p>
              </div>
              <div className="content-sidecard">
                <h2>Tags</h2>
                {tagIndex.length ? (
                  <div className="content-tag-index" role="list" aria-label="Browse by tag">
                    {tagIndex.map(({ param, label }) => (
                      <Link
                        key={param}
                        role="listitem"
                        href={blogIndexHref({ tag: param, sort: sortMode })}
                        className={`blog-tag-chip content-tag-index-link${
                          activeTagSlug === param ? ' blog-tag-chip--active' : ''
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="content-tag-index-empty">No tags in posts yet.</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
