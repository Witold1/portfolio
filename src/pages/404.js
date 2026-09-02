import Link from 'next/link';
import PageMeta from '../components/content/PageMeta';

/**
 * Static export emits `out/404.html`. GitHub Pages, GitLab Pages, and most static
 * hosts use that file for unknown URLs. Paths use `next/link` so `basePath` applies.
 */
export default function Custom404() {
  const assetBase = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <div className="flex flex-col">
      <PageMeta
        title="Page not found - Witold's Data Consulting"
        description="The page you requested does not exist or has moved."
        pathname="/404/"
      />
      <div className="flex-grow px-4 py-12 text-zinc-900 dark:text-zinc-50">
        <div className="mx-auto max-w-lg text-center">
          <img
            src={`${assetBase}/cat.svg`}
            alt="Cartoon cat illustration"
            width={200}
            height={200}
            className="mx-auto mb-6 block h-auto w-[min(200px,52vw)] dark:opacity-95"
            decoding="async"
          />
          <h1 className="mb-4 text-3xl font-bold">Error 404: Page not found</h1>
          <p className="mb-8 text-lg">
            The link may be broken, or the page was removed. If you followed a bookmark or an external
            link, try the home page or sitemap.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 text-lg" aria-label="Go to another page">
            <Link href="/" className="underline underline-offset-2 hover:opacity-80">
              Home
            </Link>
            <Link href="/sitemap/" className="underline underline-offset-2 hover:opacity-80">
              Sitemap
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
