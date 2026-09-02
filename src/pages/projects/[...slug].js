import Link from 'next/link';
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

export default function ProjectPost({ entry, tocItems, citePageMeta }) {
  const metaLine =
    entry.date || entry.year || entry.version ? (
      <ContentMetaLine date={entry.date} year={entry.year} version={entry.version} />
    ) : undefined;

  const afterShare = entry.repoUrl ? (
    <p className="mt-6">
      Repository:{' '}
      <Link
        href={entry.repoUrl}
        className="content-link content-link--external"
        target="_blank"
        rel="noopener noreferrer"
      >
        {entry.repoUrl}
      </Link>
    </p>
  ) : null;

  return (
    <MdxDetailPage
      entry={entry}
      tocItems={tocItems}
      citePageMeta={citePageMeta}
      pathPrefix="/projects"
      sectionHref="/projects/"
      sectionLabel="Projects"
      descriptionFallback="Project entry"
      shareLead="See"
      shareFallback="Check out this project!"
      metaLine={metaLine}
      afterShare={afterShare}
    />
  );
}
