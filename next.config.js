const pkg = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/my-portfolio-test',
  assetPrefix: '/my-portfolio-test/',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_BASE_PATH: '/my-portfolio-test',
    /** Full site origin for BibTeX `url` + citation links, e.g. https://witold1.github.io */
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
    /** Fallback when frontmatter has no citationAuthor / author */
    NEXT_PUBLIC_DEFAULT_CITATION_AUTHOR: process.env.NEXT_PUBLIC_DEFAULT_CITATION_AUTHOR || '',
    /** Optional CDN/origin prefix for relative media keys (gallery, future MDX assets). */
    NEXT_PUBLIC_MEDIA_BASE_URL: process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '',
  },
  images: {
    unoptimized: true,
    /** Allow gallery `src` hotlinks; extend when you add new hosts. */
    remotePatterns: [
      { protocol: 'https', hostname: 'witold1.github.io', pathname: '/**' },
      { protocol: 'https', hostname: '*.github.io', pathname: '/**' },
      { protocol: 'https', hostname: 'dl.dropboxusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.dropboxusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.dropbox.com', pathname: '/**' },
      { protocol: 'https', hostname: 'storage.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.s3.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.cloudfront.net', pathname: '/**' },
      { protocol: 'https', hostname: '*.blob.core.windows.net', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;