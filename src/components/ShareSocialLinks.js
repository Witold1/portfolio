'use client';

import ShareQrCodeButton from './ShareQrCodeButton';
import ToolbarIcon from './content/ToolbarIcon';
import { useCopyToClipboard } from '../lib/useCopyToClipboard';
import { useSharePageUrl } from '../lib/useSharePageUrl';

const iconBtnClass =
  'inline-flex items-center justify-center w-8 h-8 rounded text-inherit opacity-90 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors';

const iconBtnLightboxClass =
  'gallery-lightbox-share-btn inline-flex items-center justify-center w-8 h-8 rounded-full text-inherit transition-colors';

const iconSize = '1rem';
const iconSizeLightbox = '1rem';

function CopyLinkButton({ url, variant = 'default' }) {
  const { copied, copy } = useCopyToClipboard();
  const btnClass = variant === 'lightbox' ? iconBtnLightboxClass : iconBtnClass;
  const size = variant === 'lightbox' ? iconSizeLightbox : iconSize;

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
      <ToolbarIcon name={copied ? 'share-check' : 'share-copy'} size={size} />
    </button>
  );
}

/**
 * Social share row (gallery modal, blog, projects).
 */
export default function ShareSocialLinks({
  shareUrl: shareUrlProp,
  sharePath,
  shareText,
  label = 'Share',
  hideLabel = false,
  variant = 'default',
  className = '',
}) {
  const shareUrlFromPath = useSharePageUrl(sharePath || null);
  const shareUrl = shareUrlProp || shareUrlFromPath;

  if (!shareUrl) return null;

  const isLightbox = variant === 'lightbox';
  const linkBtnClass = isLightbox ? iconBtnLightboxClass : iconBtnClass;
  const size = isLightbox ? iconSizeLightbox : iconSize;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const whatsappText = encodeURIComponent(`${shareText} ${shareUrl}`.trim());

  const shareItems = [
    {
      key: 'x',
      platform: 'Twitter (X)',
      url: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      icon: 'share-x',
    },
    {
      key: 'bsky',
      platform: 'Bluesky',
      url: `https://bsky.app/intent/compose?text=${encodedText}%20${encodedUrl}`,
      icon: 'share-bluesky',
    },
    {
      key: 'fb',
      platform: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      icon: 'share-facebook',
    },
    {
      key: 'wa',
      platform: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${whatsappText}`,
      icon: 'share-whatsapp',
    },
    {
      key: 'tg',
      platform: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: 'share-telegram',
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
            <ToolbarIcon name={item.icon} size={size} />
          </a>
        ))}
        <ShareQrCodeButton url={shareUrl} variant={variant} />
        {isLightbox ? null : <CopyLinkButton url={shareUrl} variant={variant} />}
      </div>
    </div>
  );
}
