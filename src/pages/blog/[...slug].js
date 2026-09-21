import { BLOG_COLLECTION } from '../../lib/content';
import { citeMetaForBlogPost } from '../../lib/content/citation';
import { getMdxStaticPaths, getMdxStaticProps } from '../../lib/content/mdxPage';
import MdxDetailPage from '../../components/content/MdxDetailPage';
import ContentMetaLine from '../../components/content/ContentMetaLine';

export async function getStaticPaths() {
  return getMdxStaticPaths(BLOG_COLLECTION);
}

export async function getStaticProps({ params }) {
  return getMdxStaticProps({
    collection: BLOG_COLLECTION,
    slug: params.slug,
    citeMeta: citeMetaForBlogPost,
    citationLabel: 'blog',
  });
}

export default function BlogPost({ entry, tocItems, citePageMeta, parentLink }) {
  const metaLine =
    entry.created || entry.edited || entry.polished || entry.version ? (
      <ContentMetaLine
        created={entry.created}
        edited={entry.edited}
        polished={entry.polished}
        version={entry.version}
      />
    ) : undefined;

  return (
    <MdxDetailPage
      entry={entry}
      tocItems={tocItems}
      citePageMeta={citePageMeta}
      parentLink={parentLink}
      pathPrefix="/blog"
      sectionHref="/blog/"
      sectionLabel="Blog"
      descriptionFallback="Blog post"
      shareLead="Read"
      shareFallback="Check out this post!"
      metaLine={metaLine}
      showTags
    />
  );
}
