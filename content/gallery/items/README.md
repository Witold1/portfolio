# Gallery items

One YAML file per visualization. **Slug = filename** (e.g. `korea-road-network.yaml` → `?item=korea-road-network`).

Normalized field shapes (for editors / loaders): `lib/gallery/types.js`.

## Required fields

- `title` - display name
- `src` - image URL or CDN-relative key (see below); optional for `type: carousel` when `slides` has a first `src`
- `categories` - one or more values from `content/config/gallery-settings.json`

## Preferred metadata order

Keep the top of each file in this order (omit keys you do not need). Use a blank line between groups:

```yaml
title: …
subtitle: …
created: …

series: …
categories: […]
tags: […]

type: …
src: …

link: …
notes: …
```

Omit any group you do not need. `hidden` and `slides` sit with the media block (`type` / `src`).

## Optional fields

- `created` - when the work was made (`YYYY`, `YYYY-MM`, or `YYYY-MM-DD`); items sort **newest first**, then a series-diversity pass spreads items that share the same series so they do not clump. Items without `created` appear last. Not shown in the lightbox chrome yet. Legacy alias: `date`.
- `series` - optional kebab-case slug for related works (`lidar`, `population-charts`, `surnames`, …). Used for diversify + **Group → Series** on `/gallery`. Omit on one-offs.
- `subtitle` - secondary line (lightbox caption / card hover); `suptitle` is accepted as an alias
- `tags` - free-form labels for search / filtering
- `link` - site paths (`/blog/...`, `/projects/...`) and/or external source URLs; string or array. Prefer a leading `/` and no trailing slash for site paths (`blog/...` and `../blog/...` are still accepted and normalized). Blog/project open from the toolbar; external URLs appear under **Show details** as sources
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
created: 2024-06-15

series: road-network-chart
categories: [cartography, visualizations]

type: image
src: https://witold1.github.io/gallery/assets/content/Road-Networks/RoadNetwork-Korean-Peninsula-1.jpeg

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

Use a relative key when `mediaBaseUrl` is set in `content/config/gallery-settings.json` or `NEXT_PUBLIC_MEDIA_BASE_URL`:

```yaml
src: gallery/road-network-chart-south-koreas/road-network-chart-south-koreas--1.webp
```

Absolute `https://...` URLs still work as-is (third-party hosts, demos).
