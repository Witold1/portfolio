import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import { getSlugs, getContentBySlug } from './index';
import { extractTocFromMdx } from './toc';
import { warnIfCitationAuthorMissing } from './citation';

/** Shared catch-all paths for MDX collections under `content/<collection>/`. */
export function getMdxStaticPaths(collection) {
  const paths = getSlugs(collection).map((filePath) => ({
    params: { slug: filePath.replace(/\.mdx$/, '').split('/') },
  }));
  return { paths, fallback: false };
}

/**
 * Load + serialize one MDX entry for a detail page.
 * @param {object} opts
 * @param {string} opts.collection content subdirectory (`blogposts`, `projects`, …)
 * @param {string|string[]} opts.slug from catch-all params
 * @param {(entry: object) => object} opts.citeMeta citation page meta builder
 * @param {string} opts.citationLabel warn label (e.g. `blog`, `projects`)
 */
export async function getMdxStaticProps({ collection, slug, citeMeta, citationLabel }) {
  const entry = getContentBySlug(collection, slug);
  warnIfCitationAuthorMissing(entry, citationLabel);
  const citePageMeta = citeMeta(entry);
  const tocItems = extractTocFromMdx(entry.content);
  const mdxSource = await serialize(entry.content, {
    mdxOptions: { remarkPlugins: [remarkGfm] },
  });
  return {
    props: {
      entry: { ...entry, mdxSource },
      tocItems,
      citePageMeta,
    },
  };
}
