# Migration Audit

Legacy source reviewed: `d:\Witold1.github.io-master - Copy\`.

## Route Mapping

- `/index.html` -> `/`
- `/blog/index.html` -> `/blog`
- `/blog/posts/*/post.html` -> `/blog/[slug]`
- `/gallery/index.html` -> `/gallery`
- `/sitemap.html` -> `/sitemap`

## Content Inventory

- Blog listing contains major + auxiliary entries with title, subtitle, year, preview image, description.
- Blog posts are long-form HTML with rich media and some embedded chart scripts.
- Gallery contains image/video/carousel items with category filters and optional links.

## Migration Notes

- Preserve slugs where possible to avoid broken links.
- Convert old post metadata into frontmatter.
- Move heavy media refs to `public/` JSON or external URLs.
