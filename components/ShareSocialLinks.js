'use client';

import { cloneElement } from 'react';
import { useCopyToClipboard } from '../lib/useCopyToClipboard';

const iconBtnClass =
  'inline-flex items-center justify-center w-8 h-8 rounded text-inherit opacity-90 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors';

const iconBtnLightboxClass =
  'gallery-lightbox-share-btn inline-flex items-center justify-center w-7 h-7 rounded-full text-inherit transition-colors';

const iconClass = 'w-4 h-4 shrink-0';

const iconClassLightbox = 'w-3.5 h-3.5 shrink-0';

function CopyLinkButton({ url, variant = 'default' }) {
  const { copied, copy } = useCopyToClipboard();
  const btnClass = variant === 'lightbox' ? iconBtnLightboxClass : iconBtnClass;
  const svgClass = variant === 'lightbox' ? iconClassLightbox : iconClass;

  return (
    <button
      type="button"
      onClick={() => {
        void copy(url);
      }}
      className={btnClass}
      title={copied ? 'Copied' : 'Copy link'}
      aria-label={copied ? 'Link copied' : 'Copy link to clipboard'}
    >
      {copied ? (
        <svg className={svgClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className={svgClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  );
}

/**
 * Social share row (gallery modal, blog, projects).
 */
export default function ShareSocialLinks({
  shareUrl,
  shareText,
  label = 'Share',
  hideLabel = false,
  variant = 'default',
  className = '',
}) {
  if (!shareUrl) return null;

  const isLightbox = variant === 'lightbox';
  const linkBtnClass = isLightbox ? iconBtnLightboxClass : iconBtnClass;
  const svgClass = isLightbox ? iconClassLightbox : iconClass;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const whatsappText = encodeURIComponent(`${shareText} ${shareUrl}`.trim());

  const shareItems = [
    {
      key: 'x',
      platform: 'Twitter (X)',
      url: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      icon: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M18.9 2.2h3.3l-7.2 8.3 8.5 11.3h-6.7l-5.3-6.9-6 6.9H2.2l7.7-8.8L1.7 2.2h6.8l4.8 6.4 5.6-6.4zm-1.2 17.6h1.8L6.7 4.1H4.8l12.9 15.7z" />
        </svg>
      ),
    },
    {
      key: 'bsky',
      platform: 'Bluesky',
      url: `https://bsky.app/intent/compose?text=${encodedText}%20${encodedUrl}`,
      icon: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 568 501" aria-hidden>
          <path d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 553.277 224.709C530.521 326.554 435.815 355.976 353.983 343.693C453.275 359.706 525.204 396.718 477.723 453.261C364.385 584.049 312.369 415.692 284 278.863C255.631 415.692 203.615 584.049 90.2773 453.261C42.7963 396.718 114.725 359.706 214.017 343.693C132.185 355.976 37.479 326.554 14.7231 224.709C9.94545 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1344 1.61183 123.121 33.6637Z" />
        </svg>
      ),
    },
    {
      key: 'fb',
      platform: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      icon: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4h-3V12.1h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.9v8.4c5.7-.9 10.1-5.9 10.1-11.9z" />
        </svg>
      ),
    },
    {
      key: 'wa',
      platform: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${whatsappText}`,
      icon: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
    },
    {
      key: 'tg',
      platform: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
  ];

  const rootClass = isLightbox
    ? className
    : `flex flex-wrap items-center gap-x-2.5 gap-y-1 ${className}`.trim();

  return (
    <div className={rootClass}>
      {hideLabel ? null : <span className="shrink-0">{label}</span>}
      <div className="flex flex-wrap items-center gap-0.5">
        {shareItems.map((item) => (
          <a
            key={item.key}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkBtnClass}
            title={`Share on ${item.platform}`}
            aria-label={`Share on ${item.platform}`}
          >
            {cloneElement(item.icon, { className: svgClass })}
          </a>
        ))}
        {isLightbox ? null : <CopyLinkButton url={shareUrl} variant={variant} />}
      </div>
    </div>
  );
}
