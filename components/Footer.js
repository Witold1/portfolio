import Link from 'next/link';

const footerNavClass =
  'text-sm text-zinc-700 underline-offset-4 decoration-zinc-300/0 hover:underline hover:decoration-zinc-400 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 dark:decoration-zinc-600/0 dark:hover:decoration-zinc-500';

export default function Footer() {
  return (
    <footer className="site-chrome px-4 py-4">
      <div className="mx-auto max-w-5xl">
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5 sm:gap-x-6" aria-label="Footer">
          <Link href="/" className={footerNavClass}>
            Home
          </Link>
          <Link href="/gallery" className={footerNavClass}>
            Gallery
          </Link>
          <Link href="/projects" className={footerNavClass}>
            Projects
          </Link>
          <Link href="/blog" className={footerNavClass}>
            Blog
          </Link>
          <Link href="/about" className={footerNavClass}>
            About
          </Link>
          <Link href="/sitemap" className={footerNavClass}>
            Sitemap
          </Link>
        </nav>

        <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} Witold&apos;s Data Consulting. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
