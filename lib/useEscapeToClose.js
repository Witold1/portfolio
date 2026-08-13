'use client';

import { useEffect, useRef } from 'react';

/** Call `onEscape` when the user presses Escape (window listener). */
export function useEscapeToClose(onEscape, { enabled = true } = {}) {
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!enabled) return undefined;
    const handleEsc = (event) => {
      if (event.key === 'Escape') onEscapeRef.current?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [enabled]);
}
