const ABSOLUTE_OR_PROTOCOL_RE = /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i;
const INTERNAL_RE = /^(#|\/)/;

export function isExternalUrl(url) {
  if (typeof url !== 'string' || url.trim() === '') return false;
  if (INTERNAL_RE.test(url)) return false;
  return ABSOLUTE_OR_PROTOCOL_RE.test(url);
}
