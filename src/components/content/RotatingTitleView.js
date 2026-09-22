'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Sequential fade-out → swap text → fade-in (archive jQuery fadeOut/fadeIn).
 */
export default function RotatingTitleView({
  variants = [],
  intervalMs = 2500,
  fadeMs = 800,
  className = 'content-title',
}) {
  const list = Array.isArray(variants)
    ? variants.filter((v) => typeof v === 'string' && v.trim())
    : [];
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('in'); // 'in' | 'out'
  const [reducedMotion, setReducedMotion] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (reducedMotion || list.length < 2) return undefined;

    let fadeTimer = 0;
    const tick = () => {
      setPhase('out');
      fadeTimer = window.setTimeout(() => {
        const next = (indexRef.current + 1) % list.length;
        indexRef.current = next;
        setIndex(next);
        setPhase('in');
      }, fadeMs);
    };

    const id = window.setInterval(tick, Math.max(fadeMs * 2 + 200, intervalMs));
    return () => {
      window.clearInterval(id);
      window.clearTimeout(fadeTimer);
    };
  }, [reducedMotion, list.length, intervalMs, fadeMs]);

  if (!list.length) return null;

  const text = list[index] || list[0];

  if (reducedMotion || list.length === 1) {
    return <h1 className={className}>{list[0]}</h1>;
  }

  return (
    <h1
      className={`${className} rotating-title rotating-title--${phase}`}
      style={{ transitionDuration: `${fadeMs}ms` }}
      aria-live="off"
    >
      {text}
    </h1>
  );
}
