# Gallery items

One YAML file per visualization. **Slug = filename** (e.g. `korea-road-network.yaml` → `?item=korea-road-network`).

Normalized field shapes (for editors / loaders): `lib/gallery/types.js`.

## Required fields

- `title` - display name
- `src` - image URL or CDN-relative key (see below); optional for `type: carousel` when `slides` has a first `src`
- `categories` - one or more values from `config/gallery-settings.json`

## Optional fields

- `date` - publication date (`YYYY`, `YYYY-MM`, or `YYYY-MM-DD`); items sort **newest first** (same as blog). Undated items appear last. Not shown in the lightbox chrome yet.
- `subtitle` - secondary line (lightbox caption / card hover); `suptitle` is accepted as an alias
- `link` - site paths (`/blog/...`, `/projects/...`) and/or external source URLs; string or array. Relative forms like `blog/...` are normalized to `/blog/...`. Blog/project open from the toolbar; external URLs appear under **Show details** as sources
- `notes` - string or list of strings; opened via **Show details** in the lightbox toolbar (omit for image-only items)
- `hidden` - when `true`, omitted from public lists, home featured picks, and the HTML sitemap; turn on **Show hidden items** in `/admin` to preview in lists. Detail pages still build (direct URL + `noindex`). Same field works on blog/project MDX frontmatter.

## `type` - two levels

Use the same field name at two scopes:

| Scope | Values | Required? |
|-------|--------|-------------|
| **Gallery item** (root) | `image`, `video`, `carousel` | Optional for singles (inferred from `src`); **required** for carousels |
| **Carousel slide** (`slides[]`) | `image`, `video` | Optional (inferred from slide `src`) |

Root `type` controls the **lightbox shape**:

- `image` / `video` - one asset in the grid tile and lightbox
- `carousel` - multi-slide lightbox; list media under `slides` (alias: `items`)

Slide `type` controls **slide media** inside a carousel (`image` vs `video`).

When root `type` is omitted on a single-item entry, it is inferred from `src` (e.g. `.mp4`, `lorem.video` → `video`; otherwise `image`).

## Single-item examples

```yaml
title: Korean Peninsula road network
subtitle: OSM extract
date: 2024-06-15
type: image
src: https://witold1.github.io/gallery/assets/content/Road-Networks/RoadNetwork-Korean-Peninsula-1.jpeg
categories: [cartography, visualizations]
link: /projects/road-networks
```

Both a blog post and a project:

```yaml
link:
  - /blog/viz-building-taxonomy
  - /projects/building-taxonomy
```

```yaml
title: Building taxonomy animation
type: video
src: https://example.com/taxonomy.mp4
categories: [other]
```

Omitting root `type` is fine when `src` makes the kind obvious:

```yaml
title: Parks and parkings
src: https://example.com/map.gif
categories: [cartography]
```

## Carousel items

Set `type: carousel` and a `slides` list. Top-level `src` is optional - if omitted, the first slide is used as the grid thumbnail.

Each slide needs `src`. Optional per slide: `type` (`image` or `video`), `alt` (accessibility label in the lightbox).

```yaml
title: Korean Peninsula road network
type: carousel
categories: [cartography, visualizations]
slides:
  - src: https://example.com/road-network-1.jpeg
    alt: Overview map
  - src: https://example.com/road-network-2.jpeg
    alt: Detail inset
  - src: https://lorem.video/1280x720
    type: video
    alt: Process video
```

## CDN-ready `src`

Use a relative key when `mediaBaseUrl` is set in `config/gallery-settings.json` or `NEXT_PUBLIC_MEDIA_BASE_URL`:

```yaml
src: gallery/road-network-chart-south-koreas/road-network-chart-south-koreas--1.webp
```

Absolute `https://...` URLs still work as-is (third-party hosts, demos).
