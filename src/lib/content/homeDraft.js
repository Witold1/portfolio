import mosaicConfig from '../../../config/home-mosaic.json';
import { filterVisibleContent } from './hidden';
import { loadGallery } from '../gallery/server';
import { cdnPreviewUrl } from '../mediaUrl';

const MOSAIC_COUNT = 12;

function normalizeTile(item) {
  if (!item?.src) return null;
  const type = item.type || 'image';
  const previewSrc =
    type === 'carousel' && item.slides?.[0]?.src
      ? cdnPreviewUrl(item.slides[0].src, item.slides[0].type)
      : cdnPreviewUrl(item.src, type);
  if (!previewSrc && !item.src) return null;
  return {
    id: String(item.id),
    title: (typeof item.title === 'string' && item.title.trim()) || `Visualization ${item.id}`,
    src: previewSrc || item.src,
  };
}

/**
 * Curated mosaic tiles for the home draft banner.
 * Falls back to newest gallery items when config IDs are missing.
 * Video items use CDN poster/thumb stills (same as gallery cards).
 */
export function getHomeDraftData() {
  let galleryAll = [];
  try {
    galleryAll = filterVisibleContent(loadGallery().items);
  } catch (err) {
    console.error('getHomeDraftData loadGallery:', err);
  }

  const usable = galleryAll.filter((g) => g?.src && !String(g.id).startsWith('demo-'));
  const byId = new Map(usable.map((g) => [String(g.id), g]));
  const wanted = (mosaicConfig.mosaicItemIds || []).map((id) => byId.get(String(id))).filter(Boolean);

  const out = [...wanted];
  for (const g of usable) {
    if (out.length >= MOSAIC_COUNT) break;
    if (!out.some((x) => String(x.id) === String(g.id))) out.push(g);
  }

  return {
    mosaicTiles: out.slice(0, MOSAIC_COUNT).map(normalizeTile).filter(Boolean),
  };
}
