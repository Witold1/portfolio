'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ToolbarIcon from './content/ToolbarIcon';
import { useEscapeToClose } from '../lib/useEscapeToClose';

const QRCode = dynamic(() => import('react-qr-code'), { ssr: false });

const iconBtnClass =
  'inline-flex items-center justify-center w-8 h-8 rounded text-inherit opacity-90 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors';

const iconBtnLightboxClass =
  'gallery-lightbox-share-btn inline-flex items-center justify-center w-8 h-8 rounded-full text-inherit transition-colors';

/**
 * QR code share control — opens a small popover on click.
 */
export default function ShareQrCodeButton({ url, variant = 'default', labeled = false }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef(null);
  const popoverRef = useRef(null);
  const popoverId = useId();
  const isLightbox = variant === 'lightbox';
  const btnClass = labeled
    ? 'gallery-lightbox-actions-item gallery-lightbox-share-stack-item'
    : isLightbox
      ? iconBtnLightboxClass
      : iconBtnClass;
  const iconSize = '1rem';

  const close = useCallback(() => setOpen(false), []);
  useEscapeToClose(close, { enabled: open });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event) => {
      const target = event.target;
      if (rootRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const popoverClass = isLightbox
    ? 'share-qr-popover share-qr-popover--lightbox share-qr-popover--lightbox-fixed'
    : 'share-qr-popover share-qr-popover--above';

  const popover = open ? (
    <div
      ref={popoverRef}
      id={popoverId}
      role="dialog"
      aria-label="QR code to open this page"
      className={popoverClass}
    >
      <div className="share-qr-popover__code">
        <QRCode value={url} size={128} bgColor="#ffffff" fgColor="#000000" />
      </div>
      <p className="share-qr-popover__url" title={url}>
        {url}
      </p>
    </div>
  ) : null;

  return (
    <div className={labeled ? 'gallery-lightbox-share-stack-qr' : 'relative'} ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={btnClass}
        title="Show QR code"
        aria-label="Show QR code"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        role={labeled ? 'menuitem' : undefined}
      >
        <ToolbarIcon name="share-qr" size={iconSize} />
        {labeled ? <span>QR code</span> : null}
      </button>
      {open
        ? isLightbox && mounted
          ? createPortal(popover, document.body)
          : !isLightbox
            ? popover
            : null
        : null}
    </div>
  );
}
