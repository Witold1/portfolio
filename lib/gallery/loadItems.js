import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';
import galleryConfig from '../../config/gallery-settings.json';
import { GALLERY_CONTENT_TYPE_SET } from './constants';
import { normalizeGalleryNotesParagraphs } from './filters';
import { normalizeGalleryItemLink } from './links';
import { getMediaBaseUrl, resolveMediaUrl } from '../mediaUrl';
import { inferMediaTypeFromSrc } from '../inferMediaType';

const GALLERY_ITEMS_DIR = path.join(process.cwd(), 'content', 'gallery', 'items');
const ALLOWED_CONTENT_TYPES = GALLERY_CONTENT_TYPE_SET;

function normalizeSlides(raw, mediaBaseUrl, fileLabel) {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error(`${fileLabel}: carousel requires a non-empty "slides" or "items" list`);
  }
  const slides = [];
  raw.forEach((entry, i) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`${fileLabel}: slides[${i}] must be an object`);
    }
    const srcRaw = typeof entry.src === 'string' ? entry.src.trim() : '';
    if (!srcRaw) {
      throw new Error(`${fileLabel}: slides[${i}].src is required`);
    }
    const resolvedSrc = resolveMediaUrl(srcRaw, mediaBaseUrl);
    const explicitType = entry.type === 'video' || entry.type === 'image' ? entry.type : undefined;
    const slideType = inferMediaTypeFromSrc(resolvedSrc, explicitType);
    const slide = {
      type: slideType,
      src: resolvedSrc,
    };
    if (typeof entry.alt === 'string' && entry.alt.trim()) {
      slide.alt = entry.alt.trim();
    }
    if (typeof entry.poster === 'string' && entry.poster.trim()) {
      slide.poster = resolveMediaUrl(entry.poster.trim(), mediaBaseUrl);
    }
    slides.push(slide);
  });
  return slides;
}

function normalizeCategories(raw, allowed, fileLabel) {
  if (raw == null || raw === '') return [];
  const list = Array.isArray(raw) ? raw : [raw];
  const out = [];
  for (const entry of list) {
    if (typeof entry !== 'string' || !entry.trim()) continue;
    const cat = entry.trim();
    if (!allowed.includes(cat)) {
      throw new Error(
        `${fileLabel}: unknown category "${cat}". Allowed: ${allowed.join(', ')}`
      );
    }
    if (!out.includes(cat)) out.push(cat);
  }
  return out;
}

function normalizeDate(raw, fileLabel) {
  if (raw == null || raw === '') return null;
  const date = String(raw).trim();
  if (!date) return null;
  if (!/^\d{4}(-\d{2})?(-\d{2})?$/.test(date)) {
    throw new Error(
      `${fileLabel}: "date" must be ISO-like (YYYY, YYYY-MM, or YYYY-MM-DD), got "${date}"`
    );
  }
  return date;
}

function sortGalleryItems(items) {
  return [...items].sort((a, b) => {
    const byDate = String(b.date || '').localeCompare(String(a.date || ''));
    if (byDate !== 0) return byDate;
    return String(a.slug || '').localeCompare(String(b.slug || ''));
  });
}

/**
 * @param {string} filePath Absolute path to a `.yaml` / `.yml` item file
 * @returns {import('./types.js').GalleryItem}
 */
function parseItemFile(filePath) {
  const slug = path.basename(filePath, path.extname(filePath));
  const fileLabel = `content/gallery/items/${path.basename(filePath)}`;
  const raw = fs.readFileSync(filePath, 'utf8');
  const doc = parseYaml(raw);

  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    throw new Error(`${fileLabel}: expected a YAML object`);
  }

  const title = typeof doc.title === 'string' ? doc.title.trim() : '';
  if (!title) throw new Error(`${fileLabel}: "title" is required`);

  const explicitType =
    typeof doc.type === 'string' && ALLOWED_CONTENT_TYPES.has(doc.type) ? doc.type : null;

  const mediaBaseUrl = getMediaBaseUrl(galleryConfig.mediaBaseUrl);
  const srcRaw = typeof doc.src === 'string' ? doc.src.trim() : '';

  let slides;
  let type = explicitType;
  if (type === 'carousel') {
    slides = normalizeSlides(doc.slides ?? doc.items, mediaBaseUrl, fileLabel);
  }

  if (!type) {
    type = srcRaw
      ? inferMediaTypeFromSrc(resolveMediaUrl(srcRaw, mediaBaseUrl))
      : 'image';
  }

  if (type !== 'carousel' && !srcRaw) {
    throw new Error(`${fileLabel}: "src" is required`);
  }
  if (type === 'carousel' && !srcRaw && !slides?.[0]?.src) {
    throw new Error(`${fileLabel}: carousel needs "slides" with at least one "src"`);
  }

  const allowed = galleryConfig.categories || [];
  const categories = normalizeCategories(doc.categories, allowed, fileLabel);
  if (categories.length === 0) {
    throw new Error(`${fileLabel}: at least one valid "categories" entry is required`);
  }

  const subtitleRaw =
    typeof doc.subtitle === 'string'
      ? doc.subtitle
      : typeof doc.suptitle === 'string'
        ? doc.suptitle
        : undefined;
  const subtitle = subtitleRaw?.trim() || undefined;
  const date = normalizeDate(doc.date, fileLabel);
  const notesParas = normalizeGalleryNotesParagraphs(doc.notes);

  const link = normalizeGalleryItemLink(doc.link);

  const src = type === 'carousel'
    ? resolveMediaUrl(srcRaw || slides[0].src, mediaBaseUrl)
    : resolveMediaUrl(srcRaw, mediaBaseUrl);

  /** Omit optional fields when empty - getStaticProps props must be JSON-serializable (no `undefined`). */
  const item = {
    id: slug,
    slug,
    type,
    src,
    title,
    categories,
  };
  if (type === 'carousel') item.slides = slides;
  if (subtitle) item.subtitle = subtitle;
  if (date) item.date = date;
  if (link) item.link = link;
  if (notesParas.length) item.notes = notesParas;
  if (doc.hidden === true) item.hidden = true;
  return item;
}

/**
 * Load gallery items from `content/gallery/items/*.yaml`.
 * Slug/id = filename stem (no manual IDs).
 *
 * @returns {import('./types.js').GalleryLoadResult}
 */
export function loadGallery() {
  if (!fs.existsSync(GALLERY_ITEMS_DIR)) {
    return {
      items: [],
      categories: galleryConfig.categories || [],
      mediaBaseUrl: getMediaBaseUrl(galleryConfig.mediaBaseUrl),
    };
  }

  const files = fs
    .readdirSync(GALLERY_ITEMS_DIR)
    .filter((name) => name.endsWith('.yaml') || name.endsWith('.yml'));

  const items = sortGalleryItems(files.map((name) => parseItemFile(path.join(GALLERY_ITEMS_DIR, name))));

  return {
    items,
    categories: galleryConfig.categories || [],
    mediaBaseUrl: getMediaBaseUrl(galleryConfig.mediaBaseUrl),
  };
}
