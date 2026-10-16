// Post-build check: internal links, image sources, alt attributes, one h1 per page, meta tags.
import fs from 'node:fs'; import path from 'node:path';
const dist = 'dist'; const pages = [];
const walk = (d) => fs.readdirSync(d).forEach((f) => { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p); });
walk(dist);
const exists = (u) => { const clean = decodeURI(u.split('#')[0].split('?')[0]); if (!clean) return true; const p = path.join(dist, clean); return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html'))); };
let problems = 0;
for (const f of pages) {
  const h = fs.readFileSync(f, 'utf8'); const out = [];
  for (const m of h.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!exists(m[1])) out.push('missing ' + m[1]);
  for (const m of h.matchAll(/srcset="([^"]+)"/g)) m[1].split(',').map((s) => s.trim().split(' ')[0]).forEach((u) => !exists(u) && out.push('missing ' + u));
  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\salt(="|[\s>])/.test(m[0])) out.push('img without alt');
  const h1 = (h.match(/<h1\b/g) || []).length; if (h1 !== 1) out.push(`${h1} h1`);
  if (!/<meta name="description" content="[^"]{20,}/.test(h)) out.push('no description');
  if (!/property="og:image"/.test(h)) out.push('no og:image');
  problems += out.length;
  console.log(f.split(path.sep).join('/'),out.length ? out.slice(0, 6) : 'ok');
}
console.log(problems ? `${problems} problem(s)` : 'all good');
if (problems) process.exit(1);
