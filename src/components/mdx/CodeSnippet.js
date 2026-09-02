'use client';

import { useMemo } from 'react';
import { useCopyToClipboard } from '../../lib/useCopyToClipboard';

const KEYWORDS = {
  python: new Set([
    'def', 'class', 'import', 'from', 'as', 'return', 'for', 'while', 'if', 'elif', 'else',
    'try', 'except', 'finally', 'with', 'in', 'and', 'or', 'not', 'True', 'False', 'None',
    'yield', 'pass', 'break', 'continue', 'lambda', 'print',
  ]),
  javascript: new Set([
    'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'switch',
    'case', 'break', 'continue', 'class', 'new', 'import', 'from', 'export', 'default',
    'try', 'catch', 'finally', 'async', 'await', 'true', 'false', 'null', 'undefined',
  ]),
};

function renderHighlighted(code, language) {
  const lang = String(language || '').toLowerCase();
  const kw = KEYWORDS[lang] || KEYWORDS.javascript;
  const tokenRe =
    /(#.*$|\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/gm;

  const parts = [];
  let last = 0;
  let m;
  while ((m = tokenRe.exec(code)) !== null) {
    const idx = m.index;
    const token = m[0];
    if (idx > last) parts.push({ t: 'plain', v: code.slice(last, idx) });

    if (token.startsWith('#') || token.startsWith('//')) {
      parts.push({ t: 'comment', v: token });
    } else if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
      parts.push({ t: 'string', v: token });
    } else if (/^\d/.test(token)) {
      parts.push({ t: 'number', v: token });
    } else if (kw.has(token)) {
      parts.push({ t: 'keyword', v: token });
    } else {
      parts.push({ t: 'plain', v: token });
    }
    last = idx + token.length;
  }
  if (last < code.length) parts.push({ t: 'plain', v: code.slice(last) });
  return parts;
}

export default function CodeSnippet({
  title = 'Code snippet',
  language = 'text',
  code = '',
  collapsible = true,
  defaultOpen = false,
}) {
  const { copied, copy } = useCopyToClipboard(1500);
  const highlighted = useMemo(() => renderHighlighted(code, language), [code, language]);

  if (!code) return null;

  const block = (
    <div className="mdx-code">
      <div className="mdx-code-toolbar">
        <button
          type="button"
          className="mdx-code-copy"
          onClick={() => {
            void copy(code);
          }}
          aria-label="Copy code"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <span className="mdx-code-lang">{language}</span>
      </div>
      <pre className="mdx-code-pre">
        <code>
          {highlighted.map((p, i) => (
            <span key={i} className={`mdx-code-${p.t}`}>
              {p.v}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );

  if (!collapsible) {
    return (
      <section className="mdx-code-section">
        <div className="mdx-code-title">{title}</div>
        {block}
      </section>
    );
  }

  return (
    <details className="mdx-code-details" open={defaultOpen}>
      <summary className="mdx-code-summary">
        <mark>
          <b>{title}</b>
        </mark>
      </summary>
      {block}
    </details>
  );
}

