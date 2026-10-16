// Web copies of the three aligned portrait layers for the Hero (components/PortraitReveal.astro).
// Reads the final, aligned PNGs in ../portrait-alignment/final (left untouched) and writes WebP files of the same size
// to public/portrait/. Quality 90 with full-quality alpha: ~0.85 MB for all three instead of ~6.5 MB of PNG,
// visually identical; switch to { lossless: true } for bit-exact pixels (~3 MB).
// Usage: npm run portrait
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = '../portrait-alignment/final';
const OUT = 'public/portrait';
const FILES = ['01_MASTER_aligned', '02_GOTHIC', '03_SURREALISM'];

fs.mkdirSync(OUT, { recursive: true });
for (const name of FILES) {
  const from = path.join(SRC, `${name}.png`);
  const to = path.join(OUT, `${name}.webp`);
  const info = await sharp(from).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(to);
  console.log(`${to}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
}
