import Link from 'next/link';
import { getMdxStaticPaths, getMdxStaticProps } from '../../lib/content/mdxPage';
import { citeMetaForProject } from '../../lib/content/citation';
import MdxDetailPage from '../../components/content/MdxDetailPage';
import ContentMetaLine from '../../components/content/ContentMetaLine';
import BrandLinkIcon from '../../components/content/BrandLinkIcon';
import { getLinkBrand } from '../../lib/isExternalUrl';

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
    entry.created || entry.edited || entry.polished || entry.version ? (
      <ContentMetaLine
        created={entry.created}
        edited={entry.edited}
        polished={entry.polished}
        version={entry.version}
      />
    ) : undefined;

  const repoBrand = entry.repoUrl ? getLinkBrand(entry.repoUrl) : null;
  const afterShare = entry.repoUrl ? (
    <p className="mt-6">
      Repository:{' '}
      <Link
        href={entry.repoUrl}
        className={`content-link content-link--external${repoBrand ? ` content-link--${repoBrand.modifier}` : ''}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {repoBrand ? (
          <BrandLinkIcon name={repoBrand.icon} wordmark={repoBrand.wordmark} variant="content" />
        ) : null}
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
