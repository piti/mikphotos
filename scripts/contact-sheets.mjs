// Build a labeled contact-sheet montage per folder so photos can be curated by index.
// Writes montages to /tmp/mik-sheets/ and an index map to /tmp/mik-sheets/map.json
import sharp from 'sharp';
import { readdirSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const SRC = '/Users/peter/macs-shareable/mik_photos';
const OUT = '/tmp/mik-sheets';
mkdirSync(OUT, { recursive: true });

const THUMB = 200, COLS = 6, PAD = 6, LABEL_H = 16;
const folders = readdirSync(SRC, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
const map = {};

for (const folder of folders) {
  const files = readdirSync(join(SRC, folder)).filter(f => /\.jpe?g$/i.test(f)).sort();
  const cellW = THUMB + PAD, cellH = THUMB + LABEL_H + PAD;
  const rows = Math.ceil(files.length / COLS);
  const W = COLS * cellW + PAD, H = rows * cellH + PAD;
  const composites = [];
  map[folder] = [];

  for (let i = 0; i < files.length; i++) {
    const idx = i; // global index within folder
    map[folder].push({ idx, file: files[i] });
    const col = i % COLS, row = Math.floor(i / COLS);
    const x = PAD + col * cellW, y = PAD + row * cellH;
    try {
      const thumb = await sharp(join(SRC, folder, files[i]))
        .rotate() // respect EXIF orientation
        .resize(THUMB, THUMB, { fit: 'cover' })
        .jpeg({ quality: 70 }).toBuffer();
      composites.push({ input: thumb, top: y + LABEL_H, left: x });
    } catch (e) { console.error('skip', files[i], e.message); }
    const label = Buffer.from(
      `<svg width="${THUMB}" height="${LABEL_H}"><rect width="100%" height="100%" fill="#0B1730"/><text x="3" y="12" font-family="monospace" font-size="12" fill="#A7CCE6">${idx}  ${files[i].slice(0,18)}</text></svg>`
    );
    composites.push({ input: label, top: y, left: x });
  }

  const sheet = sharp({ create: { width: W, height: H, channels: 3, background: '#16294D' } });
  await sheet.composite(composites).jpeg({ quality: 72 }).toFile(join(OUT, `${folder.replace(/[^a-z0-9]+/gi,'-')}.jpg`));
  console.log(`${folder}: ${files.length} photos -> ${folder.replace(/[^a-z0-9]+/gi,'-')}.jpg`);
}

writeFileSync(join(OUT, 'map.json'), JSON.stringify(map, null, 2));
console.log('map.json written');
