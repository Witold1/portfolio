# Content Schema

Canonical field shapes also live as JSDoc in code:

- MDX: `lib/content/types.js` (`BlogFrontmatter`, `ProjectFrontmatter`, `ContentEntry`)
- Gallery: `lib/gallery/types.js` (`GalleryItem`, `GallerySlide`, `GalleryLoadResult`)

## Common fields

- `title`: string
- `slug`: string (derived from file path for MDX; filename stem for gallery YAML)
- `date`: YYYY-MM-DD (gallery also accepts YYYY / YYYY-MM)
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
- `year`: number
- `version`: string (display label only, e.g. `"draft"` / `draft-alpha` - not a visibility flag)
- `repoUrl`: URL (optional)
- `demoUrl`: URL (optional)
