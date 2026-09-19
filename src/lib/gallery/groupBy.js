/** Year label for undated gallery items when grouping by year. */
export const GALLERY_UNDATED_YEAR_LABEL = 'Undated';

/** Label for items with no `series` when grouping by series. */
export const GALLERY_OTHER_SERIES_LABEL = 'Other';

/** Display names for known series slugs. */
const SERIES_LABELS = {
  dataset: 'Datasets',
  demo: 'Demos',
  experiment: 'Experiments',
  hillshaded: 'Hillshaded',
  lidar: 'LiDAR',
  'metropolitan-scientific-specialization': 'Metropolitan scientific specialization',
  'population-charts': 'Population charts',
  'road-network-chart': 'Road network charts',
  surnames: 'Project Surnames',
};

/**
 * @param {{ created?: string } | null | undefined} item
 * @returns {string | null} Four-digit year, or null if missing/invalid.
 */
export function galleryItemYear(item) {
  const created = item?.created;
  if (created == null || created === '') return null;
  const year = String(created).trim().slice(0, 4);
  return /^\d{4}$/.test(year) ? year : null;
}

/**
 * Explicit YAML `series` only (no slug-prefix fallback).
 * @param {{ series?: string } | null | undefined} item
 * @returns {string | null}
 */
export function galleryItemSeries(item) {
  const series = typeof item?.series === 'string' ? item.series.trim().toLowerCase() : '';
  return series || null;
}

/**
 * @param {string | null | undefined} series
 * @returns {string}
 */
export function formatGallerySeriesLabel(series) {
  if (series == null || series === '') return '';
  const key = String(series).trim().toLowerCase();
  if (!key) return '';
  if (key === GALLERY_OTHER_SERIES_LABEL.toLowerCase()) return GALLERY_OTHER_SERIES_LABEL;
  if (SERIES_LABELS[key]) return SERIES_LABELS[key];
  return key
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Partition gallery items into year sections (newest first; undated last).
 * Within each section, relative order from `items` is preserved.
 *
 * @param {Array<{ created?: string }>} items
 * @returns {{ key: string, label: string, items: typeof items }[]}
 */
export function groupGalleryItemsByYear(items) {
  const list = Array.isArray(items) ? items : [];
  /** @type {Map<string, typeof list>} */
  const buckets = new Map();

  for (const item of list) {
    const key = galleryItemYear(item) || GALLERY_UNDATED_YEAR_LABEL;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(item);
  }

  const keys = [...buckets.keys()].sort((a, b) => {
    if (a === GALLERY_UNDATED_YEAR_LABEL) return 1;
    if (b === GALLERY_UNDATED_YEAR_LABEL) return -1;
    return b.localeCompare(a);
  });

  return keys.map((key) => ({
    key,
    label: key,
    items: buckets.get(key),
  }));
}

/**
 * Newest created string in a section (empty string if none).
 * @param {Array<{ created?: string }>} items
 */
function newestCreatedIn(items) {
  let best = '';
  for (const item of items) {
    const d = String(item?.created || '');
    if (d && d.localeCompare(best) > 0) best = d;
  }
  return best;
}

/**
 * Partition gallery items into series sections (explicit YAML `series` only).
 * Items without `series` land in Other (last). Sections ordered by newest item.
 *
 * @param {Array<{ series?: string, created?: string }>} items
 * @returns {{ key: string, label: string, items: typeof items }[]}
 */
export function groupGalleryItemsBySeries(items) {
  const list = Array.isArray(items) ? items : [];
  /** @type {Map<string, typeof list>} */
  const buckets = new Map();

  for (const item of list) {
    const key = galleryItemSeries(item) || GALLERY_OTHER_SERIES_LABEL;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(item);
  }

  const keys = [...buckets.keys()].sort((a, b) => {
    if (a === GALLERY_OTHER_SERIES_LABEL) return 1;
    if (b === GALLERY_OTHER_SERIES_LABEL) return -1;
    const byDate = newestCreatedIn(buckets.get(b)).localeCompare(newestCreatedIn(buckets.get(a)));
    if (byDate !== 0) return byDate;
    return a.localeCompare(b);
  });

  return keys.map((key) => ({
    key,
    label: formatGallerySeriesLabel(key),
    items: buckets.get(key),
  }));
}

/**
 * Flat list used for pagination when a group mode is active.
 * @param {Array<{ created?: string, series?: string }>} items
 * @param {'none' | 'year' | 'series'} groupBy
 */
export function orderGalleryItemsForGrouping(items, groupBy) {
  if (groupBy === 'year') {
    return groupGalleryItemsByYear(items).flatMap((section) => section.items);
  }
  if (groupBy === 'series') {
    return groupGalleryItemsBySeries(items).flatMap((section) => section.items);
  }
  return Array.isArray(items) ? items : [];
}

/**
 * @param {Array<{ created?: string, series?: string }>} items
 * @param {'none' | 'year' | 'series'} groupBy
 * @returns {{ key: string, label: string, items: typeof items }[] | null}
 */
export function groupGalleryItems(items, groupBy) {
  if (groupBy === 'year') return groupGalleryItemsByYear(items);
  if (groupBy === 'series') return groupGalleryItemsBySeries(items);
  return null;
}
