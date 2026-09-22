'use client';

import { Fragment, useEffect, useId, useState } from 'react';
import Link from 'next/link';
import ShareSocialLinks from '../ShareSocialLinks';
import { downloadSvgFromUrl } from '../../lib/downloadSvg';
import { isExternalUrl, getLinkBrand } from '../../lib/isExternalUrl';
import { useCopyToClipboard } from '../../lib/useCopyToClipboard';
import BrandLinkIcon from '../content/BrandLinkIcon';

function TextLink({ href, label, ariaLabel, className }) {
  const external = isExternalUrl(href);
  const brand = getLinkBrand(href);
  return (
    <Link
      href={href}
      className={`${className}${external ? ' content-link--external' : ''}${brand ? ` content-link--${brand.modifier}` : ''}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel}
    >
      {brand ? (
        <BrandLinkIcon name={brand.icon} wordmark={brand.wordmark} variant="content" />
      ) : null}
      {label}
    </Link>
  );
}

/**
 * Caption + toolbar below gallery media.
 * Desktop: floating caption + pill buttons.
 * Small screens: bottom dock with primary action + overflow More menu.
 */
export default function GalleryLightboxChrome({
  item,
  layers,
  shareUrl,
  shareText,
}) {
  const actionsMenuId = useId();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [svgSaving, setSvgSaving] = useState(false);
  const { copied, copy } = useCopyToClipboard();

  useEffect(() => {
    setDetailsOpen(false);
    setShareOpen(false);
    setActionsOpen(false);
    setSvgSaving(false);
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
    canDownloadSvg,
    svgDownloadUrl,
    showCaption,
    noteParagraphs,
    toolbarLinks,
    detailLinks,
    detailsLinkLabel,
  } = layers;
  const showToolbar = hasAbout || hasLinks || canShare || canDownloadSvg;
  const primaryLink = toolbarLinks[0] || null;
  const secondaryLinks = toolbarLinks.slice(1);
  /** Prefer site link; else details; else copy — keeps the dock useful without a blog link. */
  const mobilePrimary = primaryLink
    ? 'link'
    : hasAbout
      ? 'details'
      : canShare
        ? 'copy'
        : null;
  const showMobileMore =
    secondaryLinks.length > 0 ||
    canDownloadSvg ||
    canShare ||
    (hasAbout && mobilePrimary !== 'details');

  const saveSvg = async () => {
    if (!svgDownloadUrl || svgSaving) return;
    setSvgSaving(true);
    try {
      await downloadSvgFromUrl(svgDownloadUrl);
    } catch {
      window.open(svgDownloadUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setSvgSaving(false);
    }
  };

  const openDetails = () => {
    setDetailsOpen((open) => !open);
    setShareOpen(false);
    setActionsOpen(false);
  };

  const openShare = () => {
    setShareOpen((open) => !open);
    setDetailsOpen(false);
    setActionsOpen(false);
  };

  const renderToolbarLinks = (links, className) =>
    links.map((entry, index) => (
      <TextLink
        key={`${entry.href}-${index}`}
        href={entry.href}
        label={entry.label}
        ariaLabel={entry.ariaLabel}
        className={className}
      />
    ));

  const detailsPanel =
    hasAbout && detailsOpen ? (
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
    ) : null;

  const sharePanel =
    canShare && shareOpen ? (
      <div className="gallery-lightbox-share-row">
        <ShareSocialLinks
          shareUrl={shareUrl}
          shareText={shareText}
          hideLabel
          variant="lightbox"
          className="gallery-lightbox-share-pop"
        />
      </div>
    ) : null;

  let mobilePrimaryControl = null;
  if (mobilePrimary === 'link' && primaryLink) {
    mobilePrimaryControl = (
      <TextLink
        href={primaryLink.href}
        label={primaryLink.label}
        ariaLabel={primaryLink.ariaLabel}
        className="gallery-lightbox-toolbar-btn gallery-lightbox-toolbar-link gallery-lightbox-toolbar-btn--primary"
      />
    );
  } else if (mobilePrimary === 'details') {
    mobilePrimaryControl = (
      <button
        type="button"
        className={`gallery-lightbox-toolbar-btn gallery-lightbox-toolbar-btn--primary${detailsOpen ? ' gallery-lightbox-toolbar-btn--active' : ''}`}
        onClick={openDetails}
        aria-expanded={detailsOpen}
      >
        {detailsOpen ? 'Hide details' : 'Show details'}
      </button>
    );
  } else if (mobilePrimary === 'copy') {
    mobilePrimaryControl = (
      <button
        type="button"
        className="gallery-lightbox-toolbar-btn gallery-lightbox-toolbar-btn--primary"
        onClick={copyLink}
      >
        {copied ? 'Copied' : 'Copy link'}
      </button>
    );
  }

  return (
    <footer className="gallery-lightbox-chrome">
      {showCaption ? (
        <div className="gallery-lightbox-caption">
          {title ? <p className="gallery-lightbox-title">{title}</p> : null}
          {subtitle ? <p className="gallery-lightbox-subtitle">{subtitle}</p> : null}
        </div>
      ) : null}

      {showToolbar ? (
        <div
          className="gallery-lightbox-toolbar gallery-lightbox-toolbar--desktop"
          role="toolbar"
          aria-label="Gallery item actions"
        >
          {renderToolbarLinks(
            toolbarLinks,
            'gallery-lightbox-toolbar-btn gallery-lightbox-toolbar-link',
          )}
          {hasAbout ? (
            <button
              type="button"
              className={`gallery-lightbox-toolbar-btn${detailsOpen ? ' gallery-lightbox-toolbar-btn--active' : ''}`}
              onClick={openDetails}
              aria-expanded={detailsOpen}
            >
              {detailsOpen ? 'Hide details' : 'Show details'}
            </button>
          ) : null}
          {canDownloadSvg ? (
            <button
              type="button"
              className="gallery-lightbox-toolbar-btn"
              onClick={() => {
                void saveSvg();
                setShareOpen(false);
                setDetailsOpen(false);
              }}
              disabled={svgSaving}
            >
              {svgSaving ? 'Downloading…' : 'Download SVG'}
            </button>
          ) : null}
          {canShare ? (
            <>
              <button type="button" className="gallery-lightbox-toolbar-btn" onClick={copyLink}>
                {copied ? 'Copied' : 'Copy link'}
              </button>
              <button
                type="button"
                className={`gallery-lightbox-toolbar-btn${shareOpen ? ' gallery-lightbox-toolbar-btn--active' : ''}`}
                onClick={openShare}
                aria-expanded={shareOpen}
              >
                Share
              </button>
            </>
          ) : null}
        </div>
      ) : null}

      {showToolbar ? (
        <div
          className="gallery-lightbox-toolbar gallery-lightbox-toolbar--mobile"
          role="toolbar"
          aria-label="Gallery item actions"
        >
          {mobilePrimaryControl}
          {showMobileMore ? (
            <div className="gallery-lightbox-actions">
              <button
                type="button"
                className={`gallery-lightbox-toolbar-btn${actionsOpen ? ' gallery-lightbox-toolbar-btn--active' : ''}`}
                onClick={() => {
                  setActionsOpen((open) => !open);
                  setShareOpen(false);
                }}
                aria-expanded={actionsOpen}
                aria-controls={actionsMenuId}
              >
                {actionsOpen ? 'Close' : 'More'}
              </button>
              {actionsOpen ? (
                <div id={actionsMenuId} className="gallery-lightbox-actions-menu" role="menu">
                  {renderToolbarLinks(
                    secondaryLinks,
                    'gallery-lightbox-actions-item gallery-lightbox-toolbar-link',
                  )}
                  {hasAbout && mobilePrimary !== 'details' ? (
                    <button
                      type="button"
                      role="menuitem"
                      className={`gallery-lightbox-actions-item${detailsOpen ? ' gallery-lightbox-actions-item--active' : ''}`}
                      onClick={openDetails}
                      aria-expanded={detailsOpen}
                    >
                      {detailsOpen ? 'Hide details' : 'Show details'}
                    </button>
                  ) : null}
                  {canDownloadSvg ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="gallery-lightbox-actions-item"
                      onClick={() => {
                        void saveSvg();
                        setActionsOpen(false);
                      }}
                      disabled={svgSaving}
                    >
                      {svgSaving ? 'Downloading…' : 'Download SVG'}
                    </button>
                  ) : null}
                  {canShare ? (
                    <>
                      {mobilePrimary !== 'copy' ? (
                        <button
                          type="button"
                          role="menuitem"
                          className="gallery-lightbox-actions-item"
                          onClick={copyLink}
                        >
                          {copied ? 'Copied' : 'Copy link'}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        role="menuitem"
                        className={`gallery-lightbox-actions-item${shareOpen ? ' gallery-lightbox-actions-item--active' : ''}`}
                        onClick={openShare}
                        aria-expanded={shareOpen}
                      >
                        Share
                      </button>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {sharePanel}
      {detailsPanel}
    </footer>
  );
}
