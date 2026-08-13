'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import ShareSocialLinks from '../ShareSocialLinks';
import { isExternalUrl } from '../../lib/isExternalUrl';
import { useCopyToClipboard } from '../../lib/useCopyToClipboard';

function TextLink({ href, label, ariaLabel, className }) {
  const external = isExternalUrl(href);
  return (
    <Link
      href={href}
      className={`${className}${external ? ' content-link--external' : ''}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel}
    >
      {label}
    </Link>
  );
}

/**
 * Floating caption + minimal toolbar below gallery media (on backdrop, not attached slab).
 */
export default function GalleryLightboxChrome({
  item,
  layers,
  shareUrl,
  shareText,
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { copied, copy } = useCopyToClipboard();

  useEffect(() => {
    setDetailsOpen(false);
    setShareOpen(false);
  }, [item?.id]);

  const copyLink = () => {
    void copy(shareUrl);
  };

  if (!layers?.showChrome) return null;

  const {
    title,
    subtitle,
    hasAbout,
    hasLinks,
    canShare,
    showCaption,
    noteParagraphs,
    toolbarLinks,
    detailLinks,
    detailsLinkLabel,
  } = layers;
  const showToolbar = hasAbout || hasLinks || canShare;

  return (
    <footer className="gallery-lightbox-chrome">
      {showCaption ? (
        <div className="gallery-lightbox-caption">
          {title ? <p className="gallery-lightbox-title">{title}</p> : null}
          {subtitle ? <p className="gallery-lightbox-subtitle">{subtitle}</p> : null}
        </div>
      ) : null}

      {showToolbar ? (
        <div className="gallery-lightbox-toolbar" role="toolbar" aria-label="Gallery item actions">
          {toolbarLinks.map((entry, index) => (
            <TextLink
              key={`${entry.href}-${index}`}
              href={entry.href}
              label={entry.label}
              ariaLabel={entry.ariaLabel}
              className="gallery-lightbox-toolbar-btn gallery-lightbox-toolbar-link"
            />
          ))}
          {hasAbout ? (
            <button
              type="button"
              className={`gallery-lightbox-toolbar-btn${detailsOpen ? ' gallery-lightbox-toolbar-btn--active' : ''}`}
              onClick={() => {
                setDetailsOpen((open) => !open);
                setShareOpen(false);
              }}
              aria-expanded={detailsOpen}
            >
              {detailsOpen ? 'Hide details' : 'Show details'}
            </button>
          ) : null}
          {canShare ? (
            <>
              <button
                type="button"
                className="gallery-lightbox-toolbar-btn"
                onClick={copyLink}
              >
                {copied ? 'Copied' : 'Copy link'}
              </button>
              <button
                type="button"
                className={`gallery-lightbox-toolbar-btn${shareOpen ? ' gallery-lightbox-toolbar-btn--active' : ''}`}
                onClick={() => {
                  setShareOpen((open) => !open);
                  setDetailsOpen(false);
                }}
                aria-expanded={shareOpen}
              >
                Share
              </button>
            </>
          ) : null}
        </div>
      ) : null}

      {canShare && shareOpen ? (
        <div className="gallery-lightbox-share-row">
          <ShareSocialLinks
            shareUrl={shareUrl}
            shareText={shareText}
            hideLabel
            variant="lightbox"
            className="gallery-lightbox-share-pop"
          />
        </div>
      ) : null}

      {hasAbout && detailsOpen ? (
        <div
          id={`gallery-lightbox-details-${item.id}`}
          className="gallery-lightbox-details"
        >
          {noteParagraphs.map((note, index) => (
            <p key={index}>{note}</p>
          ))}
          {detailLinks.length ? (
            <p className="gallery-lightbox-details-links">
              <span className="gallery-lightbox-details-label">{detailsLinkLabel}</span>{' '}
              {detailLinks.map((entry, index) => (
                <Fragment key={`${entry.href}-${index}`}>
                  {index > 0 ? (
                    <span className="gallery-lightbox-details-sep" aria-hidden>
                      {' '}
                      ·{' '}
                    </span>
                  ) : null}
                  <TextLink
                    href={entry.href}
                    label={entry.label}
                    ariaLabel={entry.ariaLabel}
                    className="gallery-lightbox-details-link"
                  />
                </Fragment>
              ))}
            </p>
          ) : null}
        </div>
      ) : null}
    </footer>
  );
}
