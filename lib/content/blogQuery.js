/** Build blog index URL with optional tag + sort (matches trailingSlash: true). */
export function blogIndexHref({ tag = '', sort = 'featured' } = {}) {
  const q = new URLSearchParams();
  if (tag) q.set('tag', tag);
  if (sort === 'time') q.set('sort', 'time');
  const s = q.toString();
  return s ? `/blog/?${s}` : '/blog/';
}
