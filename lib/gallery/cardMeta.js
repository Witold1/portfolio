import { formatGalleryCategories } from './filters';

/** Hover overlay text derived from gallery card fields. */
export function buildGalleryCardHoverMeta({
  title,
  subtitle,
  categories,
  showCardSubtitle = false,
  showCategoryOnHover = false,
}) {
  const titleTrimmed = typeof title === 'string' ? title.trim() : '';
  const subTrimmed =
    showCardSubtitle && typeof subtitle === 'string' ? subtitle.trim() : '';
  const categoryLine = formatGalleryCategories(categories);
  const showHoverStrip = Boolean(titleTrimmed || categoryLine || subTrimmed);
  const hoverSummary = [titleTrimmed, subTrimmed, categoryLine].filter(Boolean).join(' - ');
  const showCategoryMeta = Boolean(
    titleTrimmed && categoryLine && (subTrimmed || showCategoryOnHover),
  );
  const hoverMultiline =
    (titleTrimmed && (Boolean(subTrimmed) || showCategoryMeta)) ||
    (!titleTrimmed && Boolean(categoryLine) && Boolean(subTrimmed));

  return {
    titleTrimmed,
    subTrimmed,
    categoryLine,
    showHoverStrip,
    hoverSummary,
    showCategoryMeta,
    hoverMultiline,
  };
}

export function buildGalleryCardImageAlt({ alt, titleTrimmed, categoryLine, id }) {
  const altTrimmed = typeof alt === 'string' ? alt.trim() : '';
  return (
    altTrimmed ||
    titleTrimmed ||
    (categoryLine ? `Gallery item ${id} - ${categoryLine}` : `Gallery item ${id}`)
  );
}
