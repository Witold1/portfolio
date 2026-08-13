import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { cdnPreviewUrl } from '../../lib/mediaUrl';
import ContentMetaLine from './ContentMetaLine';

const CTA_BY_KIND = {
  blog: 'Read →',
  project: 'View →',
};

export default function ContentCard({
  href,
  title,
  subtitle,
  excerpt,
  year,
  date,
  image,
  featured = false,
  compact = false,
  /** `'blog'` | `'project'` - sets the footer link copy unless `ctaLabel` is set */
  kind = 'blog',
  /** Override the default editorial CTA for this card */
  ctaLabel,
}) {
  const compactTip = compact ? [title, subtitle].filter(Boolean).join(' - ') : undefined;
  const ctaText = ctaLabel ?? CTA_BY_KIND[kind] ?? CTA_BY_KIND.blog;
  const preferred = image ? cdnPreviewUrl(image) || image : '';
  const [previewSrc, setPreviewSrc] = useState(preferred);

  useEffect(() => {
    setPreviewSrc(preferred);
  }, [preferred]);

  const onPreviewError = useCallback(() => {
    if (previewSrc && image && previewSrc !== image) {
      setPreviewSrc(image);
    }
  }, [previewSrc, image]);

  return (
    <article
      title={compactTip}
      className={`content-card${featured ? ' content-card--featured' : ''}${compact ? ' content-card--compact' : ''}`}
    >
      {featured ? (
        <span className="content-card-badge">Featured</span>
      ) : null}
      {previewSrc ? (
        <Link
          href={href}
          className="content-card-preview-link"
          aria-label={`Open: ${title}`}
        >
          <div className="content-card-preview">
            <img
              src={previewSrc}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={onPreviewError}
            />
          </div>
        </Link>
      ) : null}
      <div className="content-card-body">
        <h3 className="content-card-title">
          <Link href={href} className="content-card-title-link">
            {title}
          </Link>
        </h3>
        {subtitle ? <p className="content-card-subtitle">{subtitle}</p> : null}
        {!compact && excerpt ? <p className="content-card-excerpt">{excerpt}</p> : null}
        {!compact ? (
          <div className="content-card-meta">
            <span>
              <ContentMetaLine date={date} year={year} />
            </span>
            <Link href={href} className="content-card-cta">
              {ctaText}
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
