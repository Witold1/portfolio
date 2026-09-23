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
  wip: false   # optional; true forces WIP cover, false opts out even if version says draft

  tags:
    - …
  major: true

  coverImage: …

  demoUrl: …

  creators:
    - name: Vitaliy Yevtushenko
      # affiliation defaults to site org when omitted
    - name: Ada Smith
      affiliation: Example University

  # Or single-author shorthand (same default affiliation):
  # citationAuthor: Vitaliy Yevtushenko

  listed: false
  parent: project-surnames-navigator

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
- `listed`: when `false`, omit from chronological blog/project grids and home featured picks, but keep the page indexable and list it on the HTML sitemap (nested under `parent` when set). Use for hub children / sub-projects. Not revealed by admin **Show hidden items**.
- `parent`: hub slug this page belongs to (bare project/blog slug, or `projects/…` / `blog/…`). Drives sitemap nesting and the detail-page “Part of …” link.
- `hidden`: boolean - draft/preview only: omit from public lists, home featured picks, and the HTML sitemap; still builds a detail page for preview (admin **Show hidden items**). Hidden MDX pages emit `noindex`. Prefer `listed: false` + `parent` for public sub-pages.
- `creators`: list of `{ name, affiliation? }` for citations. Prefer **given name then family name** (`Vitaliy Yevtushenko`) — works for plain text, arXiv-style lists, and BibTeX (last token = surname). Plain: `Name (Affil); Name2 (Affil2)`. BibTeX joins with `and`. Omitted `affiliation` uses `citationOrganization` or the site default (`Witold's Data Consulting`).
- `citationAuthor`: single-author shorthand when you do not need `creators` (same `Given Family` order).
- `citationOrganization`: default affiliation override for creators / `citationAuthor`.

## Blog post frontmatter

- `kind`: `post`
- `subtitle`: string
- `major`: boolean

## Project frontmatter

- `kind`: `project`
- `subtitle`: string
- `version`: string (display label only, e.g. `"draft"` / `draft-alpha` - not a visibility flag)
- `demoUrl`: URL (optional)
