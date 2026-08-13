'use client';

export default function ContentLayoutToolbar({
  layout = 'grid',
  onGrid,
  onList,
  className = '',
}) {
  return (
    <div
      className={`gallery-grid-toolbar content-layout-toolbar${className ? ` ${className}` : ''}`}
      role="group"
      aria-label="Post layout"
    >
      <span className="content-section-label">Layout</span>
      <button
        type="button"
        onClick={onGrid}
        className={`gallery-grid-toggle${layout === 'grid' ? ' gallery-grid-toggle--active' : ''}`}
        aria-pressed={layout === 'grid'}
        aria-label="Grid layout"
        title="Grid"
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
        <span>Grid</span>
      </button>
      <button
        type="button"
        onClick={onList}
        className={`gallery-grid-toggle${layout === 'list' ? ' gallery-grid-toggle--active' : ''}`}
        aria-pressed={layout === 'list'}
        aria-label="List layout"
        title="List"
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
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span>List</span>
      </button>
    </div>
  );
}
