import popularEntries from '../../config/popular-posts.json';

/**
 * Editorial “popular” order (Phase A). Same slugs can later be merged with API stats in this module only.
 * @param {Array<{ slug: string }>} allPosts from getAllContent(BLOG_COLLECTION)
 * @returns {typeof allPosts}
 */
export function getPopularPosts(allPosts) {
  const bySlug = new Map(allPosts.map((p) => [p.slug, p]));
  return popularEntries.map((entry) => bySlug.get(entry.slug)).filter(Boolean);
}
