import Head from 'next/head';
import { absolutePageUrl, SITE_ORGANIZATION } from '../../lib/site';

export default function PageMeta({ title, description, pathname, image, noindex = false }) {
  const canonical = absolutePageUrl(pathname);
  const imageUrl =
    image && (image.startsWith('http') ? image : absolutePageUrl(image));

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_ORGANIZATION} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
    </Head>
  );
}
