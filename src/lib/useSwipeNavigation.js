'use client';

import { useCallback, useRef } from 'react';

const DEFAULT_THRESHOLD_PX = 48;
const DEFAULT_RATIO = 1.2;

/**
 * Horizontal swipe → onPrev / onNext. Ignores mostly-vertical gestures
 * (so stage scroll still works) and multi-touch.
 *
 * @param {{ onPrev?: () => void, onNext?: () => void, enabled?: boolean, thresholdPx?: number }} options
 * @returns {{ onPointerDown: Function, onPointerUp: Function, onPointerCancel: Function }}
 */
export function useSwipeNavigation({
  onPrev,
  onNext,
  enabled = true,
  thresholdPx = DEFAULT_THRESHOLD_PX,
} = {}) {
  const startRef = useRef(null);
  const onPrevRef = useRef(onPrev);
  const onNextRef = useRef(onNext);
  onPrevRef.current = onPrev;
  onNextRef.current = onNext;

  const canNav = enabled && typeof onPrev === 'function' && typeof onNext === 'function';

  const onPointerDown = useCallback(
    (event) => {
      if (!canNav || (event.pointerType === 'mouse' && event.button !== 0)) return;
      // Only track primary touch/pen; skip secondary fingers.
      if (event.isPrimary === false) return;
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('button, a, input, textarea, select, video, audio, [role="slider"]')
      ) {
        return;
      }
      startRef.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    },
    [canNav],
  );

  const finish = useCallback(
    (event) => {
      const start = startRef.current;
      startRef.current = null;
      if (!canNav || !start || start.id !== event.pointerId) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) < thresholdPx) return;
      if (Math.abs(dx) < Math.abs(dy) * DEFAULT_RATIO) return;

      if (dx < 0) onNextRef.current?.();
      else onPrevRef.current?.();
    },
    [canNav, thresholdPx],
  );

  const onPointerCancel = useCallback(() => {
    startRef.current = null;
  }, []);

  if (!canNav) {
    return {};
  }

  return {
    onPointerDown,
    onPointerUp: finish,
    onPointerCancel,
  };
}
