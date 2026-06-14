// Produce web-optimized versions of the curated selection + a manifest for Astro.
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const SRC = '/Users/peter/macs-shareable/mik_photos';
const ASSETS = '/Users/peter/dev/mikphotos/src/assets/photos';
const DATA = '/Users/peter/dev/mikphotos/src/data';
mkdirSync(join(ASSETS, 'hero'), { recursive: true });
mkdirSync(DATA, { recursive: true });

// role: 'hero-main' | 'hero-inset' | 'gallery'
const HERO = [
  { folder: 'PNW_trip_april_2026', file: 'DSCF0359.JPG', role: 'hero-main', out: 'hero/hero-main' },
  { folder: 'Owen session',        file: 'DSCF0096.JPG', role: 'hero-inset', out: 'hero/hero-inset' },
];

// Display order interleaves portraits + outdoor for visual rhythm in the "All" view.
const GALLERY = [
  { folder: 'Owen session',                 file: 'DSCF0159.JPG', cat: 'portraits', cap: 'Golden hour, the long light' },
  { folder: 'PNW_trip_april_2026',          file: 'DSCF0269.JPG', cat: 'outdoor',   cap: 'Beneath the redwoods' },
  { folder: 'Victoria and Shanoli Photos',  file: 'DSCF1033.JPG', cat: 'portraits', cap: 'Sun flare, summer field' },
  { folder: 'PNW_trip_april_2026',          file: 'DSCF0733.JPG', cat: 'outdoor',   cap: 'Waterfall, Pacific Northwest' },
  { folder: 'Owen session',                 file: 'DSCF0045.JPG', cat: 'portraits', cap: 'Wildflowers at dusk' },
  { folder: 'PNW_trip_april_2026',          file: 'DSCF0359.JPG', cat: 'outdoor',   cap: 'Where the coast meets the light' },
  { folder: 'Victoria and Shanoli Photos',  file: 'DSCF0889.JPG', cat: 'portraits', cap: 'Two friends, golden field' },
  { folder: 'PNW_trip_april_2026',          file: 'DSCF0401.JPG', cat: 'outdoor',   cap: 'Fog on the headland' },
  { folder: 'Owen session',                 file: 'DSCF0034.JPG', cat: 'portraits', cap: 'A quiet portrait' },
  { folder: 'Victoria and Shanoli Photos',  file: 'DSCF0944.JPG', cat: 'portraits', cap: 'Caught laughing' },
  { folder: 'PNW_trip_april_2026',          file: 'DSCF0670.JPG', cat: 'outdoor',   cap: 'Falling water, long exposure' },
  { folder: 'Victoria and Shanoli Photos',  file: 'DSCF0906.JPG', cat: 'portraits', cap: 'Movement in the grass' },
  { folder: 'Owen session',                 file: 'DSCF0040.JPG', cat: 'portraits', cap: 'Evening warmth' },
  { folder: 'PNW_trip_april_2026',          file: 'DSCF0206.JPG', cat: 'outdoor',   cap: 'The scale of old growth' },
  { folder: 'Victoria and Shanoli Photos',  file: 'DSCF1043.JPG', cat: 'portraits', cap: 'Last light through the trees' },
  { folder: 'Owen session',                 file: 'DSCF0063.JPG', cat: 'portraits', cap: 'Under the oak' },
  { folder: 'PNW_trip_april_2026',          file: 'DSCF0618.JPG', cat: 'outdoor',   cap: 'A thread of water' },
  { folder: 'Victoria and Shanoli Photos',  file: 'DSCF0951.JPG', cat: 'portraits', cap: 'Walking the field' },
];

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function opt(srcPath, outBase, maxEdge, q) {
  const outRel = `${outBase}.jpg`;
  await sharp(srcPath).rotate()
    .resize(maxEdge, maxEdge, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: q, mozjpeg: true })
    .toFile(join(ASSETS, outRel));
  const meta = await sharp(join(ASSETS, outRel)).metadata();
  return { src: outRel, w: meta.width, h: meta.height };
}

for (const h of HERO) {
  const max = h.role === 'hero-main' ? 2400 : 1300;
  const r = await opt(join(SRC, h.folder, h.file), h.out, max, 82);
  console.log(`hero ${h.role}: ${r.w}x${r.h}`);
}

const manifest = [];
for (let i = 0; i < GALLERY.length; i++) {
  const g = GALLERY[i];
  const base = `g-${String(i + 1).padStart(2, '0')}-${slug(g.cap)}`;
  const r = await opt(join(SRC, g.folder, g.file), base, 1600, 80);
  manifest.push({ src: `${base}.jpg`, category: g.cat, caption: g.cap, w: r.w, h: r.h });
  console.log(`gallery ${i + 1}/${GALLERY.length}: ${base}.jpg ${r.w}x${r.h}`);
}

writeFileSync(join(DATA, 'photos.json'), JSON.stringify(manifest, null, 2));
console.log(`\nmanifest: ${manifest.length} gallery photos -> src/data/photos.json`);
