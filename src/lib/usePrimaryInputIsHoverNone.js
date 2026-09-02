'use client';

import { useSyncExternalStore } from 'react';

const HOVER_NONE_MQ = '(hover: none)';

const hoverNoneListeners = new Set();
let hoverNoneMql = null;

function notifyHoverNoneListeners() {
  hoverNoneListeners.forEach((cb) => cb());
}

function subscribeHoverNone(callback) {
  if (typeof window === 'undefined') return () => {};
  if (!hoverNoneMql) {
    hoverNoneMql = window.matchMedia(HOVER_NONE_MQ);
    hoverNoneMql.addEventListener('change', notifyHoverNoneListeners);
  }
  hoverNoneListeners.add(callback);
  return () => {
    hoverNoneListeners.delete(callback);
    if (hoverNoneListeners.size === 0 && hoverNoneMql) {
      hoverNoneMql.removeEventListener('change', notifyHoverNoneListeners);
      hoverNoneMql = null;
    }
  };
}

function getHoverNoneSnapshot() {
  return window.matchMedia(HOVER_NONE_MQ).matches;
}

function getHoverNoneServerSnapshot() {
  return false;
}

/** True when primary input cannot hover (typical phones): two-tap card pattern. */
export function usePrimaryInputIsHoverNone() {
  return useSyncExternalStore(subscribeHoverNone, getHoverNoneSnapshot, getHoverNoneServerSnapshot);
}
