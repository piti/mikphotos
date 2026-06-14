// Paged contact sheet for one folder (bigger thumbs, split across pages).
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'fs';
import { join } from 'path';

const folder = process.argv[2];
const PER_PAGE = parseInt(process.argv[3] || '50');
const SRC = join('/Users/peter/macs-shareable/mik_photos', folder);
const OUT = '/tmp/mik-sheets';
mkdirSync(OUT, { recursive: true });

const THUMB = 230, COLS = 5, PAD = 6, LABEL_H = 16;
const files = readdirSync(SRC).filter(f => /\.jpe?g$/i.test(f)).sort();
const cellW = THUMB + PAD, cellH = THUMB + LABEL_H + PAD;
const pages = Math.ceil(files.length / PER_PAGE);

for (let p = 0; p < pages; p++) {
  const slice = files.slice(p * PER_PAGE, (p + 1) * PER_PAGE);
  const rows = Math.ceil(slice.length / COLS);
  const W = COLS * cellW + PAD, H = rows * cellH + PAD;
  const composites = [];
  for (let i = 0; i < slice.length; i++) {
    const gIdx = p * PER_PAGE + i;
    const col = i % COLS, row = Math.floor(i / COLS);
    const x = PAD + col * cellW, y = PAD + row * cellH;
    try {
      const thumb = await sharp(join(SRC, slice[i])).rotate()
        .resize(THUMB, THUMB, { fit: 'cover' }).jpeg({ quality: 72 }).toBuffer();
      composites.push({ input: thumb, top: y + LABEL_H, left: x });
    } catch (e) { console.error('skip', slice[i], e.message); }
    const label = Buffer.from(`<svg width="${THUMB}" height="${LABEL_H}"><rect width="100%" height="100%" fill="#0B1730"/><text x="3" y="12" font-family="monospace" font-size="12" fill="#A7CCE6">${gIdx}  ${slice[i].slice(0,20)}</text></svg>`);
    composites.push({ input: label, top: y, left: x });
  }
  const name = `${folder.replace(/[^a-z0-9]+/gi,'-')}-p${p+1}.jpg`;
  await sharp({ create: { width: W, height: H, channels: 3, background: '#16294D' } })
    .composite(composites).jpeg({ quality: 74 }).toFile(join(OUT, name));
  console.log(`page ${p+1}/${pages}: ${slice.length} -> ${name}`);
}
