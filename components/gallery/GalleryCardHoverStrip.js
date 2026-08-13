'use client';

export default function GalleryCardHoverStrip({
  titleTrimmed,
  subTrimmed,
  categoryLine,
  showCategoryMeta,
  hoverSummary,
  hoverMultiline,
}) {
  return (
    <div
      className={`gallery-card-hoverstrip absolute inset-0 z-[3] text-white px-3${hoverMultiline ? ' gallery-card-hoverstrip--stack' : ''}`}
      title={hoverSummary || undefined}
    >
      {titleTrimmed ? (
        <>
          <p className="gallery-card-hoverstrip-label">{titleTrimmed}</p>
          {subTrimmed ? <p className="gallery-card-hoverstrip-sub">{subTrimmed}</p> : null}
          {showCategoryMeta ? <p className="gallery-card-hoverstrip-meta">{categoryLine}</p> : null}
        </>
      ) : categoryLine ? (
        <>
          <p className="gallery-card-hoverstrip-label">{categoryLine}</p>
          {subTrimmed ? <p className="gallery-card-hoverstrip-sub">{subTrimmed}</p> : null}
        </>
      ) : (
        <p className="gallery-card-hoverstrip-label">{subTrimmed}</p>
      )}
    </div>
  );
}
