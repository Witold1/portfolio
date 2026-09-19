# Content Schema

Canonical field shapes also live as JSDoc in code:

- MDX: `lib/content/types.js` (`BlogFrontmatter`, `ProjectFrontmatter`, `ContentEntry`)
- Gallery: `lib/gallery/types.js` (`GalleryItem`, `GallerySlide`, `GalleryLoadResult`)

## Preferred frontmatter order

Keep fields in this order (omit keys you do not need). Indent all frontmatter keys by **2 spaces**. Use a blank line between groups:

```yaml
  kind: post   # or project / visualization

  title: …
  subtitle: …
  excerpt: …

  created: …
  edited: …    # or polished
  version: …

  tags:
    - …
  major: true

  coverImage: …

  repoUrl: …
  demoUrl: …

  citationAuthor: …

  hidden: true
```

## Common fields

- `title`: string
- `slug`: string (derived from file path for MDX; filename stem for gallery YAML)
- `created`: YYYY-MM-DD (gallery also accepts YYYY / YYYY-MM) - shown as “Created during …”. Legacy alias: `date`.
- `edited`: optional revisit date (YYYY / YYYY-MM / YYYY-MM-DD) - “Edited during …”
- `polished`: softer alias of `edited` - “Polished during …” (used instead of `edited` when both are set)
- `excerpt`: short summary
- `tags`: string[]
- `coverImage`: absolute or site-relative URL
- `hidden`: boolean - omit from public lists, home featured picks, and the HTML sitemap; still builds a detail page for preview (admin **Show hidden items**). Hidden MDX pages emit `noindex`.

## Blog post frontmatter

- `kind`: `post`
- `subtitle`: string
- `major`: boolean

## Project frontmatter

- `kind`: `project`
- `subtitle`: string
- `version`: string (display label only, e.g. `"draft"` / `draft-alpha` - not a visibility flag)
- `repoUrl`: URL (optional)
- `demoUrl`: URL (optional)
