import manifest from '../data/images.json';

type Entry = { w: number; h: number; widths: number[]; lqip: string };
const data = manifest as Record<string, Entry>;

export function image(id: string) {
  const e = data[id];
  if (!e) throw new Error(`Unknown image id: ${id}`);
  const src = (w: number) => `/img/${id}-${w}.webp`;
  return {
    ...e,
    ratio: e.w / e.h,
    src: src(e.widths.find((w) => w >= 1280) ?? e.widths[e.widths.length - 1]),
    srcset: e.widths.map((w) => `${src(w)} ${w}w`).join(', '),
    largest: src(e.widths[e.widths.length - 1]),
  };
}
