'use client';

export default function GalleryGridLayoutToolbar({
  gridType,
  onUniform,
  onVariable,
  className = '',
}) {
  return (
    <div
      className={`gallery-grid-toolbar${className ? ` ${className}` : ''}`}
      role="group"
      aria-label="Grid layout"
    >
      <span className="content-section-label">Grid</span>
      <button
        type="button"
        onClick={onUniform}
        className={`gallery-grid-toggle${gridType === 'uniform' ? ' gallery-grid-toggle--active' : ''}`}
        aria-pressed={gridType === 'uniform'}
        aria-label="Uniform grid: same width, same height"
        title="Same width, same height"
      >
        <svg
          className="gallery-grid-toggle-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        <span>Uniform</span>
      </button>
      <button
        type="button"
        onClick={onVariable}
        className={`gallery-grid-toggle${gridType === 'variable' ? ' gallery-grid-toggle--active' : ''}`}
        aria-pressed={gridType === 'variable'}
        aria-label="Variable grid: same width, but height changes"
        title="Same width, but height changes"
      >
        <svg
          className="gallery-grid-toggle-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="3" y="5" width="7" height="4" />
          <rect x="16" y="3" width="3" height="7" />
          <rect x="5" y="14" width="3" height="7" />
          <rect x="14" y="16" width="7" height="4" />
        </svg>
        <span>Variable</span>
      </button>
    </div>
  );
}
