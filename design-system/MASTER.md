# Or Asif-Haber — Design System (Master)

Synthesised from the ui-ux-pro-max skill (style: Dark Mode / Swiss editorial; typography: Archivo; motion: standard stagger, no bounce) and adapted to the portfolio. Tokens live in `src/styles/global.css`.

## Positioning
Graphic designer building the visual worlds around psytrance parties, record labels and artists — line-up posters, party branding, cover art — plus brand identities outside the scene.

## Concept
The site is a neutral, dark frame; the saturated work carries the colour. The work is never shown all at once: it is sorted into three categories (party branding / posters & covers / brand & product — see `SPEC.md` §4); the home page offers them as one wheel, a card each, so the page stays short. Light is the recurring motif: pictures "switch on" when chosen, and each home page rises over the last with a line of light.

## Colour
| Token | Value | Use |
|---|---|---|
| `--bg` | `#0e0e0c` | page background (warm near-black) |
| `--bg-2` | `#161613` | image placeholders |
| `--ink` | `#edeae3` | primary text (≈16:1) |
| `--ink-2` | `#a8a49a` | secondary text (≈7.9:1) |
| `--ink-3` | `#827f76` | separators / tertiary (≥4.5:1) |
| `--line` | `#2b2a25` | rules |
| `--signal` | `#d4ee63` | focus ring, hover on the home zoom title |
| `--accent` | per project | taken from each project's own palette (`accent` in `projects.ts`) |

Dark only (`color-scheme: dark`). Gradients only for light: the caption scrim over images, the light line and its spill at the top of each home page, the warm glow of a lit picture, and the stage light behind the category wheel.

Home page tones (one per "page"): `#0e0e0c` opening, `#12110e` the work (plus a radial glow at 22% of the centre card's accent, `--wa`, registered with `@property` so it glides between colours), `#201e19` about me (a clearly lighter, warmer surface, so the page is seen rising), `#0e0e0c` contact.

**Covers:** one frame for every cover on the site — Behance's project cover, 808 × 632 (`coverFrame` in `data/projects.ts`), `object-fit: cover`, `cover.focus` for the crop.

**Buttons (`.btn`):** the actions that matter are real buttons, solid rectangles in the site's square language (56px, `.btn--sm` 44px), sans 600. `.btn--primary`: `--ink` fill, `--bg` text; on hover `--signal` fill with a green glow and a band of light sweeping across (0.9s). `.btn--ghost`: 1px frame at 28% ink on a 3% wash, lighting up to full ink. Reduced motion: no sweep. Used for the hero's two actions, "More about me" and the form's send button. Wording: the contact action is "Let's work together" / "בואו נעבוד יחד".

**Light on (`.lit`):** a picture you can open sits at `brightness(0.8) saturate(0.92)`; on hover / focus it switches on — a 1s neon-tube flicker (`@keyframes ignite`) up to `brightness(1.04)`, with a warm radial glow from above (`rgb(255 242 210 / 0.2)`, screen). Reduced motion: it just brightens.

## Typography
- **Hebrew (default language, RTL):** Karantina 700 for display (Latin glyphs in the same headline stay in Archivo), IBM Plex Sans Hebrew 400/600 for text and labels — both picked from the ui-ux-pro-max Google Fonts data.
- **Archivo Variable** (wdth 62–125, wght 100–900), one family:
  - Display: wdth 62, wght 800, uppercase, line-height 0.8–0.9 (`.mega`, `.display`, `.h1`, `.h2`)
  - Subheads: wdth 88, wght 600 (`.h3`)
  - Body: wdth 100, wght 400, 17px / 1.55, measure ≤ 62ch
- **JetBrains Mono** 400, 12px uppercase, +0.06em — labels, metadata, nav (`.label`)
- Pirata One is loaded only as a specimen on the Codex Saltus page.

## Space & grid
4px base: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144 · 208. Section rhythm `--section` (96–208px).
12-column grid, margin `clamp(16px, 4vw, 56px)`, gutter 12–24px, max 1680px. Full-bleed images break the container on purpose.

## Images
Pre-processed by `scripts/images.mjs` → WebP at 640 / 1280 / 2000 (capped at the source width), plus a blurred 24px LQIP used as placeholder and ambient fill. Width/height always set (no CLS). Below-the-fold images lazy-load.

## Motion
- Reveal: fade + 28px rise or clip-path mask, 0.9–1.1s, `cubic-bezier(0.16, 1, 0.3, 1)`, 70–90ms stagger. No bounce.
- Home: every project row reveals the same way (image mask + text rise); no per-project effects.
- Page transitions: Astro `ClientRouter`, shared `transition:name` on project titles.
- `prefers-reduced-motion: reduce` → everything static, content fully visible. No JS → content fully visible.

## Accessibility checklist
- Skip link, semantic landmarks, one `h1` per page, breadcrumb nav on projects
- Visible `:focus-visible` ring (signal colour), 44px minimum targets on links
- Meaningful alt on every content image; decorative duplicates use empty alt + `aria-hidden` links with `tabindex="-1"`
- Text contrast ≥ 4.5:1 throughout

## Templates
- **Stacked home pages** (`views/HomePage.astro`, `.hp__panel`): opening → portfolio → about me; each rises over the one before, the one beneath dims gently to 45% black and scales to 0.97 (GSAP ScrollTrigger scrub, `gsap.matchMedia` for reduced motion, reverted on `astro:before-swap`). A panel taller than the screen sticks by its foot. Every passage is its own (`data-enter`): **melt** into the portfolio — the page rises with a feathered top edge (a mask gradient 260px deep, sharpening as it settles) that melts into the opening, while the wheel floats up 48px and fades in from 25% (ease-in-out sine, done by 80% of the way; a circular "lens" was tried here and dropped as too heavy); then a short **easing-away** (`.hp__dwell`, 40svh of scroll with the portfolio held in place and still usable, but answering the scroll: the wheel drifts up 5vh and dims to 82%, the "About me ↓" cue at its foot fades out — never a stretch where scrolling shows nothing); **tilt** into about me — a gentle slanted leading edge, 12% lower on the far side, levelling out; and the 2px warm **light line** with its halo only where about me meets the contact.
- **Header**: just the name, "Portfolio" (to the wheel, `/#work`), "About me" and the language switch.
- **Category wheel** (`CategoryWheel.astro` + `lib/cover-flow.ts`): three cards, one per category — the lead project's cover in the cover frame at `brightness(0.42)`, the category name centred near the foot of the picture (nothing laid over the picture itself — only a layered text-shadow hugging the letters) so the middle of the work stays clear; display face `clamp(1.8rem, 3.4vw, 3rem)`, uppercase Latin / Karantina Hebrew. Coverflow geometry from ruixen.ui's Coverflow Carousel (21st.dev): centre flat, sides swing toward you. The centre card switches on as it arrives (flicker to `brightness(0.74)`, kept a little dim for the name) and goes full under the pointer. Under it: the category line (`--ink-2`) and "Pictured: …" (label), then prev · next · pause (44px rings). No numbering. Autoplay as the engine: ~4.2s per step in a 1.5s ease-in-out glide, turning back at the ends; holds on hover, focus, off screen, 6s after a manual move; never with reduced motion. Card `min(84vw, 380px)`, from 900px `clamp(340px, 34vw, 580px)`. Head: the "Portfolio" label only — the wheel itself is the way into the work.
- **Category links** (`CategoryNav.astro`): "All" + each category as plain text links at `--t-lead`, no counts; inactive `--ink-3`, current `--ink` with a 2px `--signal` underline under the name only. Wraps, never scrolls. On `/work/` and every category page.
- **Cover grid** (`WorkGrid.astro`, on category pages and `/work/`): like a Behance profile — every cover in the cover frame, only the name (`--t-lead`, 600, turns the project's accent on hover) and the year (mono label) beneath; 1 / 2 (≥700px) / 3 (≥1100px) columns; each card `.lit`. Details wait inside the project. (Replaced the heavier work list of sticky rows.)
- **About me** (`views/AboutPage.astro`): opening (the interactive portrait without its demo, the `.h1` headline, the first paragraph as `.lead`, primary + ghost buttons) → a facts strip (three columns between rules: now, studies, worked with) → the story in one column beside the Trance Tribe stand (`.lit`) on `#201e19` → what I do (unnumbered, 2–3 columns, each with a link to its category) → background and tools side by side. Each part melts from the previous tone into its own (`.ab-tone`, `--from`/`--to`, 180px); the light line marks the step into the contact form (shared rule in `global.css`).
- **Case study** (`views/ProjectPage.astro`): hero → cover → overview → details (optional) → gallery (`Gallery.astro`, automatic rows) → next project. Same order and behaviour for every project.
