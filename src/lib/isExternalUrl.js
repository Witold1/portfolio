const ABSOLUTE_OR_PROTOCOL_RE = /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i;
const INTERNAL_RE = /^(#|\/)/;

export function isExternalUrl(url) {
  if (typeof url !== 'string' || url.trim() === '') return false;
  if (INTERNAL_RE.test(url)) return false;
  return ABSOLUTE_OR_PROTOCOL_RE.test(url);
}

/** Public git forges (not Pages/demo hosts like github.io / gitlab.io). */
function isGitForgeHost(host) {
  if (host === 'github.com' || host.endsWith('.github.com')) return true;
  if (host === 'gitlab.com' || host.endsWith('.gitlab.com')) return true;
  if (host === 'bitbucket.org' || host.endsWith('.bitbucket.org')) return true;
  if (host === 'codeberg.org' || host.endsWith('.codeberg.org')) return true;
  if (host === 'sr.ht' || host.endsWith('.sr.ht')) return true;
  return false;
}

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

/** True for common git-hosting URLs (GitHub, GitLab, Bitbucket, …). */
export function isGitHostUrl(url) {
  if (!isExternalUrl(url)) return false;
  return isGitForgeHost(hostOf(url));
}

/** True for LinkedIn profile / company / post URLs. */
export function isLinkedInUrl(url) {
  if (!isExternalUrl(url)) return false;
  const host = hostOf(url);
  return host === 'linkedin.com' || host.endsWith('.linkedin.com');
}

/**
 * Brand glyph for known external hosts.
 * @returns {{ icon: string, modifier: string, wordmark?: boolean } | null}
 */
export function getLinkBrand(url) {
  if (isGitHostUrl(url)) return { icon: 'brand-git', modifier: 'git', wordmark: true };
  if (isLinkedInUrl(url)) return { icon: 'brand-linkedin', modifier: 'linkedin' };
  return null;
}
