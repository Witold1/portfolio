import { useEscapeToClose } from '../../lib/useEscapeToClose';

export default function ImageLightbox({ src, alt = 'Enlarged image', onClose }) {
  useEscapeToClose(onClose, { enabled: Boolean(src) });

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <div
        className="relative w-[80vw] max-h-[80vh] max-w-4xl overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt} className="w-full h-auto object-contain rounded-lg" />
        <button
          type="button"
          onClick={onClose}
          className="overlay-close-btn absolute top-2 right-2 z-20"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="overlay-close-icon"
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
        </button>
      </div>
    </div>
  );
}
