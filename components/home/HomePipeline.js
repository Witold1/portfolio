'use client';

import { useLayoutEffect, useRef, useState } from 'react';

const BUZZWORDS = [
  { text: 'ROI', size: '1.85rem', weight: 700 },
  { text: 'expert guidance', size: '1.35rem', weight: 600 },
  { text: 'experience', size: '1.7rem', weight: 700 },
  { text: 'data visualization', size: '1.05rem', weight: 500 },
  { text: 'charts & maps', size: '1.35rem', weight: 600 },
  { text: 'reproducible reports', size: '0.95rem', weight: 500 },
  { text: 'LLMs', size: '1.35rem', weight: 700 },
  { text: 'AI assistants', size: '1.15rem', weight: 600 },
  { text: 'clear storytelling', size: '0.95rem', weight: 500 },
  { text: 'dashboards', size: '1.1rem', weight: 500 },
  { text: 'model evaluation', size: '1.05rem', weight: 500 },
  { text: 'prompt pipelines', size: '1rem', weight: 500 },
  { text: 'pattern finding', size: '1.05rem', weight: 500 },
  { text: 'KPIs', size: '1.4rem', weight: 700 },
  { text: 'exploratory analysis', size: '0.9rem', weight: 500 },
  { text: 'decision support', size: '0.9rem', weight: 500 },
  { text: 'automated workflows', size: '1rem', weight: 500 },
  { text: 'trusted outputs', size: '1.05rem', weight: 600 },
];

const GAP = 12;
const MAX_ROTATE = 12;
const PLACE_ATTEMPTS = 140;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function remToPx(size) {
  return parseFloat(size) * 16;
}

function estimateSize(word) {
  const fontPx = remToPx(word.size);
  return {
    w: word.text.length * fontPx * 0.54 + 6,
    h: fontPx * 1.25,
  };
}

/** Axis-aligned box after rotation around center. */
function rotatedBox(w, h, rotateDeg) {
  const rad = (Math.abs(rotateDeg) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    w: w * cos + h * sin,
    h: w * sin + h * cos,
  };
}

function overlaps(a, b, pad) {
  return !(
    a.x + a.w + pad <= b.x ||
    b.x + b.w + pad <= a.x ||
    a.y + a.h + pad <= b.y ||
    b.y + b.h + pad <= a.y
  );
}

function placeBuzzwords(containerW, containerH) {
  const width = Math.max(containerW, 320);
  const height = Math.max(containerH, 220);

  const ordered = [...BUZZWORDS].sort(
    (a, b) => remToPx(b.size) * b.text.length - remToPx(a.size) * a.text.length
  );

  const boxes = [];
  const placed = [];

  for (const word of ordered) {
    const rotate = randomBetween(-MAX_ROTATE, MAX_ROTATE);
    const raw = estimateSize(word);
    const { w, h } = rotatedBox(raw.w, raw.h, rotate);
    const maxX = Math.max(0, width - w);
    const maxY = Math.max(0, height - h);

    let found = null;

    for (let i = 0; i < PLACE_ATTEMPTS; i += 1) {
      const x = randomBetween(0, maxX);
      const y = randomBetween(0, maxY);
      const box = { x, y, w, h };
      if (!boxes.some((other) => overlaps(box, other, GAP))) {
        found = box;
        break;
      }
    }

    if (!found) {
      const stepX = Math.max(10, w * 0.3);
      const stepY = Math.max(10, h * 0.3);
      outer: for (let y = 0; y <= maxY; y += stepY) {
        for (let x = 0; x <= maxX; x += stepX) {
          const box = { x, y, w, h };
          if (!boxes.some((other) => overlaps(box, other, GAP * 0.6))) {
            found = box;
            break outer;
          }
        }
      }
    }

    if (!found) {
      // Soft fallback: still place, slightly prefer emptier edges
      found = {
        x: randomBetween(0, maxX),
        y: randomBetween(0, maxY),
        w,
        h,
      };
    }

    boxes.push(found);

    const cx = found.x + w / 2;
    const cy = found.y + h / 2;
    placed.push({
      ...word,
      x: `${((cx / width) * 100).toFixed(2)}%`,
      y: `${((cy / height) * 100).toFixed(2)}%`,
      rotate: `${rotate.toFixed(1)}deg`,
    });
  }

  return placed;
}

/**
 * Draft pipeline — Sunflower stage structure, site visual language.
 * Decorative buzzword cloud sits behind the flow (aria-hidden);
 * positions shuffle on each client load without overlap when possible.
 */
export default function HomePipeline() {
  const shellRef = useRef(null);
  const [words, setWords] = useState(null);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const { width, height } = shell.getBoundingClientRect();
    setWords(placeBuzzwords(width, height));
  }, []);

  return (
    <div ref={shellRef} className="content-rail pipeline-flow-shell" role="presentation">
      <div
        className={`pipeline-wordcloud${words ? ' pipeline-wordcloud--ready' : ''}`}
        aria-hidden="true"
      >
        {(words || []).map((word) => (
          <span
            key={word.text}
            className="pipeline-wordcloud__word"
            style={{
              left: word.x,
              top: word.y,
              fontSize: word.size,
              fontWeight: word.weight,
              transform: `translate(-50%, -50%) rotate(${word.rotate})`,
            }}
          >
            {word.text}
          </span>
        ))}
      </div>

      <div className="pipeline-flow-grid">
        <article className="flow-node">
          <p className="flow-kicker">Get and set data</p>
          <h3>Raw sources</h3>
          <div className="flow-chip-list">
            <span className="flow-chip">Databases</span>
            <span className="flow-chip">Excel spreadsheets</span>
            <span className="flow-chip">CSV and JSON exports</span>
            <span className="flow-chip">APIs</span>
            <span className="flow-chip">Google Sheets</span>
          </div>
        </article>

        <div className="flow-connector" aria-hidden="true">
          <span className="flow-track" />
          <span className="flow-dot" />
        </div>

        <article className="flow-node">
          <p className="flow-kicker">Transform</p>
          <h3>Automated workflows</h3>
          <div className="flow-chip-list">
            <span className="flow-chip">Python and Low-Code pipelines</span>
            <span className="flow-chip">Custom scripts and modules</span>
            <span className="flow-chip">Scheduled automations</span>
          </div>
        </article>

        <div className="flow-connector" aria-hidden="true">
          <span className="flow-track" />
          <span className="flow-dot" />
        </div>

        <article className="flow-node">
          <p className="flow-kicker">Deliver value</p>
          <h3>Products for people</h3>
          <div className="flow-chip-list">
            <span className="flow-chip">Production-ready visualizations</span>
            <span className="flow-chip">Web reports and dashboards</span>
            <span className="flow-chip">Reliable recurring delivery</span>
          </div>
        </article>
      </div>
    </div>
  );
}
