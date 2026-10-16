// Converts source portfolio images into responsive WebP + a manifest used by the site.
// Usage: node scripts/images.mjs "<path to Behance Portfolio folder>"
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = process.argv[2];
const OUT = 'public/img';
const WIDTHS = [640, 1280, 2000];
const manifest = {};
sharp.concurrency(4);

async function emit(id, pipelineFactory, srcW, srcH) {
  const widths = WIDTHS.filter((w) => w < srcW).concat(srcW > 2000 ? [] : [srcW]);
  const uniq = [...new Set(widths.map((w) => Math.min(w, 2000)))];
  fs.mkdirSync(path.join(OUT, path.dirname(id)), { recursive: true });
  for (const w of uniq) {
    const file = path.join(OUT, `${id}-${w}.webp`);
    if (!fs.existsSync(file)) await pipelineFactory().resize({ width: w }).webp({ quality: 80, effort: 5 }).toFile(file);
  }
  const lqip = await pipelineFactory().resize({ width: 24 }).blur(1).webp({ quality: 40 }).toBuffer();
  manifest[id] = { w: srcW, h: srcH, widths: uniq, lqip: `data:image/webp;base64,${lqip.toString('base64')}` };
}

for (const dir of fs.readdirSync(SRC).sort()) {
  const full = path.join(SRC, dir);
  if (!fs.statSync(full).isDirectory()) continue;
  const n = dir.slice(0, 2);
  for (const f of fs.readdirSync(full).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort()) {
    const p = path.join(full, f);
    const { width, height } = await sharp(p).metadata();
    const id = `${n}/${path.parse(f).name}`;
    await emit(id, () => sharp(p), width, height);
    console.log(id, width, height);
  }
}

// Crops from the Codex Saltus presentation sheet (real artwork, cropped for storytelling)
const sheet = path.join(SRC, fs.readdirSync(SRC).find((d) => d.startsWith('01')), '01.png');
const crops = {
  '01/artwork': { left: 150, top: 3860, width: 1100, height: 1100 },
  '01/entities': { left: 520, top: 4110, width: 380, height: 380 },
  '01/book': { left: 420, top: 4620, width: 620, height: 300 },
  '01/lockup': { left: 330, top: 1820, width: 760, height: 210 },
  '01/release': { left: 520, top: 3010, width: 860, height: 660 },
};
for (const [id, c] of Object.entries(crops)) {
  await emit(id, () => sharp(sheet).extract(c), c.width, c.height);
  console.log(id);
}

// Open Graph image
await sharp(sheet).extract(crops['01/artwork']).resize(1200, 630, { fit: 'cover', position: 'top' }).jpeg({ quality: 82 }).toFile('public/og.jpg');

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/images.json', JSON.stringify(manifest, null, 1));
console.log('done', Object.keys(manifest).length);
