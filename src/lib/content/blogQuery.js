/** Build blog index URL with optional tag + sort (matches trailingSlash: true). */
export function blogIndexHref({ tag = '', sort = 'time' } = {}) {
  const q = new URLSearchParams();
  if (tag) q.set('tag', tag);
  if (sort === 'featured') q.set('sort', 'featured');
  const s = q.toString();
  return s ? `/blog/?${s}` : '/blog/';
}
