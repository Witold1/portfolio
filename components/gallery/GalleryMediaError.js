'use client';

function BrokenMediaIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <circle cx="8.5" cy="9.5" r="1.25" fill="currentColor" stroke="none" />
      <path d="M7 15l3.25-3.25L13.5 15l2.75-2.75L19 15" />
    </svg>
  );
}

/** Broken image / video placeholder with icon + message (grid cards and lightbox). */
export default function GalleryMediaError({ message, variant = 'card', className = '' }) {
  const rootClass =
    variant === 'lightbox' ? 'gallery-lightbox-media-error' : 'gallery-card-media-error';

  return (
    <div className={[rootClass, className].filter(Boolean).join(' ')} role="status">
      <BrokenMediaIcon className="gallery-media-error-icon" />
      <p className="gallery-media-error-text">{message}</p>
    </div>
  );
}
