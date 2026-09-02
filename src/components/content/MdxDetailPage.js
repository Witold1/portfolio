import { MDXRemote } from 'next-mdx-remote';
import ContentLayout from './ContentLayout';
import PageMeta from './PageMeta';
import ContentBreadcrumb from './ContentBreadcrumb';
import WipReveal from './WipReveal';
import { mdxComponents } from '../mdx/mdxComponents';
import { FootnotesProvider } from '../mdx/Footnotes';
import Toc from '../mdx/Toc';
import { CitationProvider } from '../mdx/CitationContext';
import ShareSocialLinks from '../ShareSocialLinks';
import DiscussWithAi from './DiscussWithAi';
import { SITE_ORGANIZATION } from '../../lib/site';
import { isWipContent } from '../../lib/content/wip';

/**
 * Shared chrome for MDX detail routes (blog / projects).
 * Body shortcodes still come from the shared `mdxComponents` map.
 */
export default function MdxDetailPage({
  entry,
  tocItems,
  citePageMeta,
  pathPrefix,
  sectionHref,
  sectionLabel,
  descriptionFallback,
  shareLead,
  shareFallback,
  metaLine,
  showTags = false,
  afterShare = null,
}) {
  const sharePath = `${pathPrefix}/${entry.slug}/`;
  const shareText = entry.title
    ? `${shareLead} "${entry.title}" on ${SITE_ORGANIZATION}!`
    : shareFallback;
  const showWip = isWipContent(entry);
  const wipTitle =
    pathPrefix === '/projects'
      ? 'This project page is still in progress'
      : 'This article is still in progress';

  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: sectionHref, label: sectionLabel },
    { label: entry.title },
  ];

  return (
    <div className="content-page flex flex-col">
      <PageMeta
        title={`${entry.title} - Witold's Data Consulting`}
        description={entry.excerpt || entry.subtitle || descriptionFallback}
        pathname={sharePath}
        image={entry.coverImage}
        noindex={entry.hidden === true}
      />
      <div className="content-main">
        <div className="content-reading">
          <div className="content-breadcrumb-rail">
            <ContentBreadcrumb items={breadcrumbItems} />
          </div>
          <ContentLayout
            title={entry.title}
            subtitle={entry.subtitle}
            metaLine={metaLine}
            tags={showTags ? entry.tags : undefined}
            className="content-article"
          >
            <WipReveal active={showWip} title={wipTitle}>
              <Toc items={tocItems} collapsible defaultOpen={false} />
              <CitationProvider meta={citePageMeta}>
                <FootnotesProvider>
                  <MDXRemote {...entry.mdxSource} components={mdxComponents} />
                </FootnotesProvider>
              </CitationProvider>
            </WipReveal>
            <div className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-700 space-y-4">
              <DiscussWithAi
                pagePath={sharePath}
                title={entry.title}
                pageKind={pathPrefix === '/projects' ? 'page' : 'article'}
              />
              <ShareSocialLinks sharePath={sharePath} shareText={shareText} />
            </div>
            {afterShare}
          </ContentLayout>
        </div>
      </div>
    </div>
  );
}
