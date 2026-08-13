import { SITE_ORGANIZATION, absolutePageUrl } from '../site';

/** Host + basePath used when asking AIs to search related site pages. */
function siteSearchScope() {
  try {
    const { hostname, pathname } = new URL(absolutePageUrl('/'));
    const base = pathname.replace(/\/+$/, '');
    return base && base !== '/' ? `${hostname}${base}` : hostname;
  } catch {
    return 'witold1.github.io/my-portfolio-test';
  }
}

/**
 * Prompt prefilled into Perplexity / ChatGPT / Claude / Gemini discuss links.
 * @param {{ pageUrl: string, title?: string, pageKind?: 'article' | 'page' }} opts
 */
export function buildDiscussWithAiPrompt({ pageUrl, title, pageKind = 'article' }) {
  const scope = siteSearchScope();
  const kind = pageKind === 'page' ? 'page' : 'article';
  const titled = title ? ` (“${title}”)` : '';

  return [
    `Start by reading this ${kind}${titled}: ${pageUrl}`,
    '',
    `Then search ${scope} for related writing on the same topic, people, tools, and broader context from ${SITE_ORGANIZATION}. Use at least 2–3 additional pages from ${scope} when available to build a fuller picture.`,
    '',
    'Give the reader a clear overview that combines the original with what you find - covering the main ideas, background, and why it matters. End with 3–5 angles the reader can dig into further, each tied to specific coverage on the same site when possible.',
  ].join('\n');
}

const PROVIDERS = [
  {
    key: 'perplexity',
    label: 'Perplexity',
    href: (q) => `https://www.perplexity.ai/?q=${q}`,
  },
  {
    key: 'chatgpt',
    label: 'ChatGPT',
    href: (q) => `https://chatgpt.com/?q=${q}`,
  },
  {
    key: 'claude',
    label: 'Claude',
    href: (q) => `https://claude.ai/new?q=${q}`,
  },
  {
    key: 'gemini',
    label: 'Gemini',
    href: (q) => `https://www.google.com/search?udm=50&q=${q}`,
  },
];

/**
 * @param {{ pageUrl: string, title?: string, pageKind?: 'article' | 'page' }} opts
 */
export function discussWithAiLinks(opts) {
  const encoded = encodeURIComponent(buildDiscussWithAiPrompt(opts));
  return PROVIDERS.map((p) => ({
    key: p.key,
    label: p.label,
    href: p.href(encoded),
  }));
}
