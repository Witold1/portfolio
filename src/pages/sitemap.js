import Head from 'next/head';
import { getAllContent, BLOG_COLLECTION } from '../lib/content';
import { isHiddenContent } from '../lib/content/hidden';
import { findParentAmong } from '../lib/content/parent';
import { absolutePageUrl } from '../lib/site';

/** Root-relative path with trailing slash, for static export + basePath. */
function publicHref(pathFromAppRoot) {
  const bp = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const p0 = pathFromAppRoot.startsWith('/') ? pathFromAppRoot : `/${pathFromAppRoot}`;
  const p = p0.endsWith('/') ? p0 : `${p0}/`;
  return `${bp}${p}`.replace(/\/{2,}/g, '/');
}

const STATIC_PAGES = [
  { path: '/', label: 'Home' },
  { path: '/admin/', label: 'Admin' },
  { path: '/gallery/', label: 'Gallery' },
  { path: '/blog/', label: 'Blog' },
  { path: '/projects/', label: 'Projects' },
  { path: '/about/', label: 'About' },
];

function pickTitle(entry) {
  if (entry.title && String(entry.title).trim()) return String(entry.title).trim();
  return entry.slug.replace(/\//g, ' / ');
}

function toSitemapNode(entry, href) {
  return {
    href,
    label: pickTitle(entry),
    slug: entry.slug,
    children: [],
  };
}

/**
 * Build nested sitemap trees: children with `parent` nest under that hub;
 * orphaned / unresolved parents stay top-level in their own section.
 */
function buildSitemapTrees(posts, projects) {
  const postNodes = new Map(
    posts.map((p) => [p.slug, toSitemapNode(p, publicHref(`/blog/${p.slug}`))]),
  );
  const projectNodes = new Map(
    projects.map((p) => [p.slug, toSitemapNode(p, publicHref(`/projects/${p.slug}`))]),
  );

  const childSlugs = new Set();

  for (const entry of [...projects, ...posts]) {
    if (!entry.parent) continue;
    const parent = findParentAmong(entry.parent, projects, posts);
    if (!parent) continue;

    const childNode =
      projectNodes.get(entry.slug) || postNodes.get(entry.slug);
    const parentNode =
      projectNodes.get(parent.slug) || postNodes.get(parent.slug);
    if (!childNode || !parentNode || childNode === parentNode) continue;

    parentNode.children.push(childNode);
    childSlugs.add(entry.slug);
  }

  const sortNodes = (nodes) =>
    nodes
      .map((n) => ({
        ...n,
        children: sortNodes(n.children),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

  const topPosts = sortNodes(
    [...postNodes.values()].filter((n) => !childSlugs.has(n.slug)),
  );
  const topProjects = sortNodes(
    [...projectNodes.values()].filter((n) => !childSlugs.has(n.slug)),
  );

  return { posts: topPosts, projects: topProjects };
}

function countNodes(nodes) {
  return nodes.reduce((sum, n) => sum + 1 + countNodes(n.children || []), 0);
}

function SitemapList({ nodes, nested = false }) {
  if (!nodes?.length) return null;
  return (
    <ul
      className={
        nested
          ? 'mt-0.5 list-none space-y-0.5 p-0 pl-5 text-base'
          : 'list-none space-y-0.5 p-0 text-lg'
      }
    >
      {nodes.map((node) => (
        <li key={node.href}>
          <a href={node.href} className="underline underline-offset-2 hover:opacity-80">
            {node.label}
          </a>
          {node.children?.length ? <SitemapList nodes={node.children} nested /> : null}
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const postsRaw = getAllContent(BLOG_COLLECTION).filter((p) => !isHiddenContent(p));
  const projectsRaw = getAllContent('projects').filter((p) => !isHiddenContent(p));
  const { posts, projects } = buildSitemapTrees(postsRaw, projectsRaw);

  return {
    props: {
      posts,
      projects,
      postCount: countNodes(posts),
      projectCount: countNodes(projects),
      builtAt: new Date().toISOString().slice(0, 10),
    },
  };
}

export default function Sitemap({ posts, projects, postCount, projectCount, builtAt }) {
  const canonical = absolutePageUrl('/sitemap/');
  const title = "Sitemap - Witold's Data Consulting";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Index of main pages, blog posts, and projects. Hub children nest under their parent."
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={canonical} />
      </Head>

      <main className="mx-auto max-w-3xl px-4 py-8 text-base leading-normal text-zinc-900 dark:text-zinc-50">
        <h1 className="mb-1 text-3xl font-bold">Site map</h1>
        <p className="mb-6 break-all text-lg">
          Static index, generated {builtAt}
          <br />
          Canonical{' '}
          <a className="underline underline-offset-2 hover:opacity-80" href={canonical}>
            {canonical}
          </a>
        </p>

        <hr className="mb-6 border-zinc-300 dark:border-zinc-700" />

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-bold">Pages</h2>
          <ul className="list-none space-y-0.5 p-0 text-lg">
            {STATIC_PAGES.map(({ path, label }) => (
              <li key={path}>
                <a
                  href={publicHref(path)}
                  className="underline underline-offset-2 hover:opacity-80"
                >
                  {label}
                </a>
                <span> - {path}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-bold">Blog posts ({postCount})</h2>
          <SitemapList nodes={posts} />
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-bold">Projects ({projectCount})</h2>
          <SitemapList nodes={projects} />
        </section>
      </main>
    </>
  );
}
