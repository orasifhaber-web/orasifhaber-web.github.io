// Layered portrait for the hover-reveal animation in the home Hero (components/PortraitReveal.astro).
// Use these three files as they are — they are already aligned, so no transform is applied at runtime.
// The site serves same-size WebP copies from public/portrait/, made by `npm run portrait` (scripts/portrait.mjs).
//
// Source: portrait-alignment/final/ in the project root (the original magnific__*.png files stay untouched).
//   01_MASTER_aligned.png — the photo with the alignment baked in: zoom ×1.0909, shift −45.3px / −4.2px
//                           (Lanczos-resampled, cropped back to 1086×1448). ~4% of the photo was cropped per edge.
//   02_GOTHIC.png, 03_SURREALISM.png — unchanged copies of the artworks.
// How the numbers were found: facial landmarks (eyes, nose ring, mouth, mouth corner) marked on all three images;
// the artworks agree with each other within ~5px, so only the photo moved. Remaining face offset: 3–14px.
// Scripts and comparison images: portrait-alignment/scripts and portrait-alignment/comparison.

export const PORTRAIT_BASE = '/portrait/';

export const PORTRAIT_SIZE = { width: 1086, height: 1448 } as const;

export const portraitLayers = {
  master: '01_MASTER_aligned.webp',
  gothic: '02_GOTHIC.webp',
  surrealism: '03_SURREALISM.webp',
} as const;

// Where the reveal is allowed: the patterned face + neck that both artworks share (hair, ear and shirt excluded).
// Traced by hand in image pixels along the pattern edge of 02_GOTHIC / 03_SURREALISM, clockwise from the left temple;
// drawn as a smooth closed curve through these points.
export const faceOutline: [number, number][] = [
  [300, 210], [350, 175], [450, 150], [550, 152], [620, 185], [675, 240], [715, 310], [735, 400], [745, 500], [750, 590],
  [760, 670], [800, 730], [845, 790], [830, 860], [770, 940], [710, 1005], [650, 1065], [580, 1095], [520, 1090], [495, 1000],
  [470, 900], [450, 830], [400, 790], [350, 735], [310, 670], [280, 580], [260, 490], [253, 400], [260, 320], [275, 260],
];
