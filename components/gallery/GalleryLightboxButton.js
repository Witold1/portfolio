/**
 * Shared glass control for gallery lightbox (close, carousel prev/next).
 */
export default function GalleryLightboxButton({
  variant = 'close',
  className = '',
  label,
  ...props
}) {
  const icons = {
    close: (
      <svg
        className="gallery-lightbox-btn-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    ),
    prev: (
      <svg
        className="gallery-lightbox-btn-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M15 6l-6 6 6 6" />
      </svg>
    ),
    next: (
      <svg
        className="gallery-lightbox-btn-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    ),
  };

  const defaultLabels = {
    close: 'Close',
    prev: 'Previous slide',
    next: 'Next slide',
  };

  return (
    <button
      type="button"
      className={`gallery-lightbox-btn${className ? ` ${className}` : ''}`}
      aria-label={label || defaultLabels[variant]}
      {...props}
    >
      {icons[variant]}
    </button>
  );
}
