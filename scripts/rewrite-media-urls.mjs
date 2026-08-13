/**
 * One-shot / historical: rewrite content media URLs → CDN-relative keys for witold1-blog-assets.
 *
 * This is a finished migration helper (hard-coded URL map), not part of the app runtime.
 * Re-run only if you need to re-apply the same substitutions against content files.
 *
 * From my-next-app: node scripts/rewrite-media-urls.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');

/** Exact old URL (normalized) → new key */
const EXACT = new Map();

function normUrl(u) {
  return String(u)
    .trim()
    .replace(/https:\/\/witold1\.github\.io\/+/g, 'https://witold1.github.io/')
    .replace(/%20/g, ' ');
}

function add(oldUrl, key) {
  EXACT.set(normUrl(oldUrl), key);
}

// --- datasets (new downloads) ---
add(
  'https://github.com/Witold1/CAV_data_case/raw/master/figures/internal/slide_mixed.png?raw=true',
  'gallery/dataset-self-driving-triage/dataset-self-driving-triage--mixed.webp',
);
add(
  'https://github.com/Witold1/CAV_data_case/raw/master/figures/internal/slide_lines.png?raw=true',
  'gallery/dataset-self-driving-triage/dataset-self-driving-triage--lines.webp',
);
add(
  'https://github.com/Witold1/CAV_data_case/raw/master/figures/internal/slide_clouds.png?raw=true',
  'gallery/dataset-self-driving-triage/dataset-self-driving-triage--clouds.webp',
);
add(
  'https://github.com/Witold1/mta_data_research/raw/master/figures/internal/DA6.png?raw=true',
  'gallery/dataset-mta-turnstile-usage/dataset-mta-turnstile-usage--DA6.webp',
);
add(
  'https://github.com/Witold1/mta_data_research/raw/master/figures/internal/VIZ5.png?raw=true',
  'gallery/dataset-mta-turnstile-usage/dataset-mta-turnstile-usage--VIZ5.webp',
);
add(
  'https://raw.githubusercontent.com/Witold1/mta_data_research/master/figures/internal/DA4.png',
  'gallery/dataset-mta-turnstile-usage/dataset-mta-turnstile-usage--DA4.webp',
);
add(
  'https://raw.githubusercontent.com/Witold1/quilt_test_task/master/figures/CitiesAndProblems.png',
  'gallery/dataset-social-problems-sweden/dataset-social-problems-sweden.webp',
);

add(
  'https://witold1.github.io/blog/posts/small-project-blood-tool/figures/project-bloody-toll_preview.jpeg',
  'gallery/dataset-ukraine-bloody-toll/dataset-ukraine-bloody-toll.webp',
);
add(
  'https://witold1.github.io/blog/posts/small-project-building-taxonomy/figures/building-taxanomy-collage_preview.jpeg',
  'gallery/experiment-osm-building-taxonomy/experiment-osm-building-taxonomy.webp',
);
add('https://i.imgur.com/vvYNPWp.mp4', 'gallery/experiment-osm-building-taxonomy/experiment-osm-building-taxonomy.mp4');

add(
  'https://witold1.github.io/blog/posts/project-country-rulers/figures/rullers_chart_kazakh-khanate-dark.png',
  'gallery/experiment-timeline-kazakh-rulers/experiment-timeline-kazakh-rulers--dark.webp',
);
add(
  'https://witold1.github.io/blog/posts/project-country-rulers/figures/rullers_chart_kazakh-khanate-dark.svg',
  'gallery/experiment-timeline-kazakh-rulers/experiment-timeline-kazakh-rulers--dark.svg',
);
add(
  'https://witold1.github.io/blog/posts/project-country-rulers/figures/rullers_chart_kazakh-khanate-white.png',
  'gallery/experiment-timeline-kazakh-rulers/experiment-timeline-kazakh-rulers--white.webp',
);
add(
  'https://witold1.github.io/blog/posts/project-country-rulers/figures/rullers_chart_kazakh-khanate-white.svg',
  'gallery/experiment-timeline-kazakh-rulers/experiment-timeline-kazakh-rulers--white.svg',
);

add(
  'https://witold1.github.io/gallery/assets/content/USA Parks and Parkings.gif',
  'gallery/project-parks-and-parkings/project-parks-and-parkings.gif',
);
add(
  'https://witold1.github.io/gallery/assets/content/USA%20Parks%20and%20Parkings.gif',
  'gallery/project-parks-and-parkings/project-parks-and-parkings.gif',
);

// navigator figures
const nav = 'projects/project-surnames-navigator-meta/figures';
add('https://witold1.github.io/blog/posts/project-surnames-navigator/figures/post-banner.jpeg', `${nav}/banner.webp`);
add('https://witold1.github.io/blog/posts/project-surnames-navigator/figures/wordcloud_example.jpeg', `${nav}/wordcloud-example.webp`);
add('https://witold1.github.io/blog/posts/project-surnames-navigator/figures/dag_hide-inputs.svg', `${nav}/dag-hide-inputs.svg`);
add('https://witold1.github.io/blog/posts/project-surnames-navigator/figures/pipeline-overview.jpeg', `${nav}/pipeline-overview.webp`);
add('https://witold1.github.io/blog/posts/project-surnames-navigator/figures/dag.svg', `${nav}/dag.svg`);

// surname merged previews → merged.webp
const surnameRegions = [
  ['central-america', 'Central-America'],
  ['central-asia', 'Central-Asia'],
  ['middle-east', 'Middle-East'],
  ['indian-subcontinent', 'Indian-Subcontinent'],
  ['central-europe', 'Central-Europe'],
  ['iberian-peninsula', 'Iberian-Peninsula'],
  ['balkan-peninsula', 'Balkan Peninsula'],
  ['baltic-states', 'Baltic-States'],
];
for (const [slug, file] of surnameRegions) {
  add(
    `https://witold1.github.io/blog/posts/project-surnames-${slug}/figures/${file}_merged_preview.jpeg`,
    `blogposts/project-surnames/viz-surnames-${slug}/viz-surnames-${slug}--merged.webp`,
  );
}

// central america country SVGs in MDX
for (const iso of ['GTM', 'PAN', 'BLZ', 'SLV', 'CRI', 'HND', 'NIC']) {
  add(
    `https://witold1.github.io/blog/posts/project-surnames-central-america/figures/${iso}_wordcloud_tight.svg`,
    `blogposts/project-surnames/viz-surnames-central-america/viz-surnames-central-america--${iso}.svg`,
  );
}

// forenames dropbox
const forenameDropbox = [
  ['fnnbb5ygq3osynrojkr4q', 'central-america', 'e84fzlb8r74gdillzgkg7yapz'],
  ['htycwoiabefmdd6dpwj09', 'middle-east', 's08wyobl0tl8pa1ukelrtim80'],
  ['k4vpwnveehdueydkh0qti', 'indian-subcontinent', 'zq4b048swzsuce7f6ys4595v5'],
  ['lyed16glty5vem2kyfy2k', 'central-asia', 't9c6ttrzs968xgocn3qyd4ee2'],
  ['owpvfjur06u81u16lmcf7', 'balkan-peninsula', 'liyy7n79ups3mm3whdfil4df7'],
];
// Use pattern match for dropbox forenames instead

// LiDAR stills + posters + dropbox videos
const lidars = [
  ['breckenridge-colorado', 'LiDAR-Breckenridge-Ski-Resort-Colorado', '0ipmxtw4kh79j9surar0y', 'd6w8tn0vb4lovajyok6epjjc0'],
  ['downtown-cleveland-ohio', 'LiDAR-Cleveland-Downtown-Ohio', 'yvyl1jmta46bnt6u55qc8', 'ihn4a5z1r9roh4shtoctghd4h'],
  ['downtown-columbus-ohio', 'LiDAR-Columbus-Downtown-Ohio', 'tcng9jsd7elukqs3405s7', 'izwmcozzznr9qxi9huy16hgdp'],
  ['downtown-detroit-michigan', 'LiDAR-Detroit-Downtown-Michigan', 'wrskk04spij4u09do3pcw', 'q2xa7ln5w6wdjv36mbjmmnulo'],
  ['downtown-seattle-washington', 'LiDAR-Seattle-Downtown-Washington', '8clylcd7zz5i5sixeufr0', 'y06g0prs9ahr0j1tzigx283h8'],
  ['miami-beach-florida', 'LiDAR-Miami-Beach-Florida', 'hil164tepn719wij91ftw', 'e1ia5ky94cus2j2m1xv6irkf7'],
  ['msu-campus-michigan', 'LiDAR-Michigan-State-University-Lansing-Michigan', 'og0e4qu79s5og402pgy08', 'svjm4u3pybemgj4wtarwtj65y'],
  ['nordic-valley-ut', 'LiDAR-Nordic-Valley-Ski-Resort-Utah', '03byuy1m7lgvjf8s6pk9n', 'd3x42cv8g1udc16hi0lrf9dui'],
];
for (const [slug, old, dropId, rlkey] of lidars) {
  const base = `gallery/lidar-${slug}/lidar-${slug}`;
  add(`https://witold1.github.io/gallery/assets/content/3D-LiDAR-Charts/${old}.jpeg`, `${base}.webp`);
  add(`https://witold1.github.io/gallery/assets/content/3D-LiDAR-Charts/${old}-poster.jpeg`, `${base}.poster.webp`);
  add(`https://www.dropbox.com/scl/fi/${dropId}/${old}.mp4?rlkey=${rlkey}&raw=1`, `${base}.mp4`);
}
add(
  'https://www.dropbox.com/scl/fi/veyc2okx8woij9qz8pv53/LiDAR-SaoPaulo-City-Center-Brazil-Colored-Smaller.mp4?rlkey=1dowfcsj7auj8clz5o9c9m2zf&raw=1',
  'gallery/lidar-central-sao-paulo-brazil/lidar-central-sao-paulo-brazil--colored-smaller.mp4',
);

// geography
add(
  'https://witold1.github.io/gallery/assets/content/Geography-Terrain/Ridge-Plot-Ferghana-Valley.jpeg',
  'gallery/experiment-ridge-plot-ferghana-central-asia/experiment-ridge-plot-ferghana-central-asia.webp',
);
add(
  'https://witold1.github.io/gallery/assets/content/Geography-Terrain/TerrainHillshade-Afghanistan.mp4',
  'gallery/hillshaded-afghanistan/hillshaded-afghanistan.mp4',
);
add(
  'https://witold1.github.io/gallery/assets/content/Geography-Terrain/TerrainHillshade-Afghanistan-1.jpeg',
  'gallery/hillshaded-afghanistan/hillshaded-afghanistan--1.webp',
);
add(
  'https://witold1.github.io/gallery/assets/content/Geography-Terrain/TerrainHillshade-Afghanistan-2.jpeg',
  'gallery/hillshaded-afghanistan/hillshaded-afghanistan--2.webp',
);
add(
  'https://witold1.github.io/gallery/assets/content/Geography-Terrain/TerrainHillshade-Romania.mp4',
  'gallery/hillshaded-romania/hillshaded-romania.mp4',
);
add(
  'https://witold1.github.io/gallery/assets/content/Geography-Terrain/TerrainHillshaded-BalticStates.mp4',
  'gallery/hillshaded-road-network-baltic-states/hillshaded-road-network-baltic-states--terrain.mp4',
);
add(
  'https://witold1.github.io/gallery/assets/content/RoadNetwork-BalticStates.mp4',
  'gallery/hillshaded-road-network-baltic-states/hillshaded-road-network-baltic-states--roads.mp4',
);
add(
  'https://witold1.github.io/gallery/assets/content/RoadNetwork-France.mp4',
  'gallery/road-network-chart-european-france/road-network-chart-european-france.mp4',
);
add(
  'https://witold1.github.io/gallery/assets/content/RoadNetwork-WesternRussia.mp4',
  'gallery/road-network-chart-western-russia/road-network-chart-western-russia.mp4',
);

// population charts
const pops = [
  ['asia', 'Population-All-Asia', ['hot', 'ice', 'plasma', 'coloredterrain']],
  ['south-america', 'Population-All-South-America', ['ice', 'plasma', 'coloredterrain']],
  ['central-asia', 'Population-Central-Asia', ['hot', 'ice', 'plasma', 'white']],
  ['eastern-asia', 'Population-Eastern-Asia', ['hot', 'ice', 'plasma', 'white']],
  ['southeast-asia', 'Population-Southeast-Asia', ['hot', 'ice', 'plasma', 'white']],
  ['southern-asia', 'Population-Southern-Asia', ['hot', 'ice', 'plasma', 'coloredterrain']],
  ['western-asia', 'Population-Western-Asia', ['hot', 'ice', 'plasma', 'white']],
  ['alternative-asia', 'Population-Custom-Alternative-Asia', ['ice', 'plasma', 'white']],
  ['eastern-europe', 'Population-Custom-Eastern-Europe', ['ice', 'plasma', 'coloredterrain']],
];
for (const [slug, oldBase, pals] of pops) {
  for (const p of pals) {
    add(
      `https://witold1.github.io/gallery/assets/content/Population-Charts/${oldBase}-${p}_preview.jpeg`,
      `gallery/population-charts-${slug}/population-charts-${slug}--${p}.webp`,
    );
  }
}

// road network previews
const roads = [
  ['central-asia', 'RoadNetwork-Central-Asia', 4],
  ['former-yugoslavia', 'RoadNetwork-Post-Yugoslavia', 4],
  ['northern-africa-states', 'RoadNetwork-Northern-Africa', 4],
  ['indian-subcontinent', 'RoadNetwork-Indian-Peninsula', 5],
  ['south-koreas', 'RoadNetwork-Korean-Peninsula', 2],
];
for (const [slug, oldBase, n] of roads) {
  for (let i = 1; i <= n; i++) {
    add(
      `https://witold1.github.io/gallery/assets/content/Road-Networks/${oldBase}-${i}_preview.jpeg`,
      `gallery/road-network-chart-${slug}/road-network-chart-${slug}--${i}.webp`,
    );
  }
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(yaml|yml|mdx)$/i.test(e.name)) acc.push(p);
  }
  return acc;
}

function replaceInText(text) {
  let out = text;
  let hits = 0;
  // Sort longest first so longer URLs win
  const entries = [...EXACT.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [oldUrl, key] of entries) {
    if (!out.includes(oldUrl) && !out.includes(oldUrl.replace(/ /g, '%20'))) continue;
    const variants = [oldUrl, oldUrl.replace(/ /g, '%20')];
    // also double-slash host variants already normalized in map keys via add()
    for (const v of variants) {
      if (out.includes(v)) {
        const n = out.split(v).length - 1;
        out = out.split(v).join(key);
        hits += n;
      }
    }
  }

  // Dropbox forenames (query order may vary)
  out = out.replace(
    /https:\/\/www\.dropbox\.com\/scl\/fi\/[^"'\\\s]+?\/(Balkan-Peninsula|Central-America|Central-Asia|Indian-Subcontinent|Middle-East)-forenames_merged\.jpeg\?[^"'\\\s]+/g,
    (_, region) => {
      hits += 1;
      const slug = region.toLowerCase();
      return `blogposts/project-surnames/forenames/forenames--${slug}-merged.webp`;
    },
  );

  // Any remaining witold1.github.io double-slash → single (cleanup)
  out = out.replace(/https:\/\/witold1\.github\.io\/+/g, 'https://witold1.github.io/');

  return { out, hits };
}

const skip = /_mdx-showcase|blanks\/|README\.md/;
const files = walk(CONTENT).filter((f) => !skip.test(f.replace(/\\/g, '/')));
let totalHits = 0;
let filesChanged = 0;
const leftover = [];

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const { out, hits } = replaceInText(before);
  if (out !== before) {
    fs.writeFileSync(file, out, 'utf8');
    filesChanged += 1;
    totalHits += hits;
    console.log(`updated (${hits}) ${path.relative(ROOT, file)}`);
  }
  // leftover media hosts we care about
  const re = /https?:\/\/(?:witold1\.github\.io|www\.dropbox\.com|i\.imgur\.com|raw\.githubusercontent\.com|github\.com\/Witold1)[^"'\\\s)]+/g;
  let m;
  while ((m = re.exec(out))) {
    const u = m[0];
    if (/\/post\/?$|forebears|familysearch|naturalearth|python\.org|geopandas|hamilton|adobe|wikipedia|gallery\.pyecharts|docs\.google|simonscarr|briefing|zsu\.gov/i.test(u))
      continue;
    if (/\.(jpe?g|png|gif|webp|svg|mp4)(\?|$)/i.test(u) || /dropbox\.com.*raw=1/i.test(u) || /githubusercontent|github\.com\/Witold1\/.+\.(png|jpe?g)/i.test(u)) {
      leftover.push(`${path.relative(ROOT, file)} :: ${u}`);
    }
  }
}

console.log(`\nDone. filesChanged=${filesChanged} replacements=${totalHits}`);
if (leftover.length) {
  console.log('\nLeftover media-like URLs (review):');
  for (const line of [...new Set(leftover)].sort()) console.log(' ', line);
}
