'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Clipboard write helper with a temporary "copied" flag.
 * @param {number} [resetMs=1600]
 * @returns {{ copied: boolean, copy: (text: string) => Promise<boolean> }}
 */
export function useCopyToClipboard(resetMs = 1600) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text) => {
      if (text == null || text === '') return false;
      try {
        await navigator.clipboard.writeText(String(text));
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setCopied(false);
          timerRef.current = null;
        }, resetMs);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [resetMs],
  );

  return { copied, copy };
}
