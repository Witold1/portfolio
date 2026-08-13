import { SITE_ORGANIZATION } from '../site';
import { buildGalleryItemHref, getGalleryItemType } from './constants';
import { normalizeGalleryNotesParagraphs } from './filters';
import {
  galleryDetailLinkEntries,
  galleryDetailsLinkLabel,
  galleryToolbarLinkEntries,
  partitionGalleryLinks,
} from './links';

const EMPTY_LAYERS = {
  title: '',
  subtitle: '',
  hasAbout: false,
  hasLinks: false,
  canShare: false,
  showCaption: false,
  showChrome: false,
  noteParagraphs: [],
  toolbarLinks: [],
  detailLinks: [],
  detailsLinkLabel: '',
};

/**
 * Derives which lightbox UI layers to show for a gallery item.
 * Also resolves toolbar/details link entries once for chrome.
 */
export function resolveGalleryLightboxLayers(item) {
  if (!item || typeof item !== 'object') return { ...EMPTY_LAYERS };

  const title = typeof item.title === 'string' ? item.title.trim() : '';
  const subtitle = typeof item.subtitle === 'string' ? item.subtitle.trim() : '';
  const noteParagraphs = normalizeGalleryNotesParagraphs(item.notes);
  const { site, detail } = partitionGalleryLinks(item.link);
  const toolbarLinks = galleryToolbarLinkEntries(site);
  const detailLinks = galleryDetailLinkEntries(detail);
  const detailsLinkLabel = galleryDetailsLinkLabel(detail);

  const hasAbout = noteParagraphs.length > 0 || detailLinks.length > 0;
  const hasLinks = toolbarLinks.length > 0;
  const type = getGalleryItemType(item);
  const canShare =
    ((type === 'image' || type === 'video') && item.src) ||
    (type === 'carousel' &&
      Array.isArray(item.slides) &&
      item.slides.length > 0 &&
      item.src);

  const showCaption = Boolean(title || subtitle);
  const showChrome = showCaption || hasAbout || hasLinks || canShare;

  return {
    title,
    subtitle,
    hasAbout,
    hasLinks,
    canShare,
    showCaption,
    showChrome,
    noteParagraphs,
    toolbarLinks,
    detailLinks,
    detailsLinkLabel,
  };
}

/** Canonical share URL for a gallery item in context of the current page. */
export function buildGalleryShareUrl(item, router) {
  if (typeof window === 'undefined' || !item) return '';
  if (typeof item.shareUrl === 'string' && item.shareUrl.trim() !== '') {
    return item.shareUrl.trim();
  }
  const baseUrl = window.location.origin;
  const pathPrefix = router?.basePath || '';
  if (router?.pathname === '/gallery' && item.id != null) {
    return `${baseUrl}${pathPrefix}${buildGalleryItemHref(item.id)}`;
  }
  return window.location.href;
}

export function buildGalleryShareText(item, siteName = SITE_ORGANIZATION) {
  return item?.title
    ? `See "${item.title}" on ${siteName}!`
    : `See this gallery item on ${siteName}!`;
}
