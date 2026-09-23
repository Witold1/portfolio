import { getMdxStaticPaths, getMdxStaticProps } from '../../lib/content/mdxPage';
import { citeMetaForProject } from '../../lib/content/citation';
import MdxDetailPage from '../../components/content/MdxDetailPage';
import ContentMetaLine from '../../components/content/ContentMetaLine';

export async function getStaticPaths() {
  return getMdxStaticPaths('projects');
}

export async function getStaticProps({ params }) {
  return getMdxStaticProps({
    collection: 'projects',
    slug: params.slug,
    citeMeta: citeMetaForProject,
    citationLabel: 'projects',
  });
}

export default function ProjectPost({ entry, tocItems, citePageMeta, parentLink }) {
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
      pathPrefix="/projects"
      sectionHref="/projects/"
      sectionLabel="Projects"
      descriptionFallback="Project entry"
      shareLead="See"
      shareFallback="Check out this project!"
      metaLine={metaLine}
    />
  );
}
