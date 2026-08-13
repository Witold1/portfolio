import Head from 'next/head';
import { getAllContent, BLOG_COLLECTION } from '../lib/content';
import { isHiddenContent } from '../lib/content/hidden';
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

export async function getStaticProps() {
  const posts = getAllContent(BLOG_COLLECTION)
    .filter((p) => !isHiddenContent(p))
    .map((p) => ({
      href: publicHref(`/blog/${p.slug}`),
      label: pickTitle(p),
    }));

  const projects = getAllContent('projects')
    .filter((p) => !isHiddenContent(p))
    .map((p) => ({
      href: publicHref(`/projects/${p.slug}`),
      label: pickTitle(p),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    props: {
      posts,
      projects,
      builtAt: new Date().toISOString().slice(0, 10),
    },
  };
}

export default function Sitemap({ posts, projects, builtAt }) {
  const canonical = absolutePageUrl('/sitemap/');
  const title = "Sitemap - Witold's Data Consulting";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Flat index of main pages, blog posts, and projects (static)." />
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
          <h2 className="mb-2 text-lg font-bold">
            Blog posts ({posts.length})
          </h2>
          <ul className="list-none space-y-0.5 p-0 text-lg">
            {posts.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="underline underline-offset-2 hover:opacity-80">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-bold">
            Projects ({projects.length})
          </h2>
          <ul className="list-none space-y-0.5 p-0 text-lg">
            {projects.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="underline underline-offset-2 hover:opacity-80">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>

      </main>
    </>
  );
}
