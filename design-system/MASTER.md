# Or Asif-Haber — Design System (Master)

Synthesised from the ui-ux-pro-max skill (style: Dark Mode / Swiss editorial; typography: Archivo; motion: standard stagger, no bounce) and adapted to the portfolio. Tokens live in `src/styles/global.css`.

## Positioning
Graphic designer building the visual worlds around psytrance parties, record labels and artists — line-up posters, party branding, cover art — plus brand identities outside the scene.

## Concept
The site is a neutral, dark frame; the saturated work carries the colour. The work is never shown all at once: it is sorted into three categories (party branding / posters & covers / brand & product — see `SPEC.md` §4); the home page offers them as three cards, one each, so the page stays short. Light is the recurring motif: pictures "switch on" when chosen, and each home page rises over the last with a line of light.

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

Dark only (`color-scheme: dark`). Gradients only for light: the caption scrim over images, the light line and its spill at the top of each home page, and the warm glow of a lit picture.

Home page tones (one per "page"): `#0e0e0c` opening, `#12110e` the portfolio (each category card casts a soft shadow in its project's accent, `--wa`), `#201e19` about me (a clearly lighter, warmer surface, so the page is seen rising), `#0e0e0c` contact.

**Covers:** one frame for every cover on the site — Behance's project cover, 808 × 632 (`coverFrame` in `data/projects.ts`). The covers are Or's own Behance crops (`NN/behance`, generated from the crop encoded in `portfolio.json`), so nothing is cropped by guesswork.

**Buttons (`.btn`):** the actions that matter are real buttons, solid rectangles in the site's square language (56px, `.btn--sm` 44px), sans 600. `.btn--primary`: `--ink` fill, `--bg` text; on hover `--signal` fill with a green glow and a band of light sweeping across (0.9s). `.btn--ghost`: 1px frame at 28% ink on a 3% wash, lighting up to full ink. Reduced motion: no sweep. Used for the hero's two actions, "More about me", "Let's work together" (ghost) at the end of every project's overview, and the form's send button. Wording: the contact action is "Let's work together" / "בואו נעבוד יחד".

**Darken on hover, for every category or project picture** (category cards, grid, next-project thumbnail): the picture darkens and the action appears ("See the work →" / "View project →"); the name stays where it always is — never repeated. **Light on (`.lit`)** is now used only for the picture on About me: it sits at `brightness(0.8) saturate(0.92)`; on hover / focus the light comes up smoothly — a 0.8s ease-out to `brightness(1.04)`, like a dimmer — with a warm radial glow from above (`rgb(255 242 210 / 0.2)`, screen) fading in. No flicker anywhere: it read as a glitch. (Revealed images keep their own `filter` transition next to the reveal's clip-path/transform.)

**Hover and touch (mobile-native):** every `:hover` style sits inside `@media (hover: hover) and (pointer: fine)`, so a tap on a phone never leaves a hover look stuck on. Touch gets the same look while the finger is down (`:active`), and keyboard focus keeps it too (`:focus-visible`). The browser's grey tap flash is off (`-webkit-tap-highlight-color: transparent` on `html`); links and buttons use `touch-action: manipulation` (no double-tap delay); `.btn` labels can't be selected by a long press. iOS needs a passive `touchstart` listener for `:active` to show, set in `Base.astro`. New hover styles follow the same pattern.

**Slow in, quick out; keyboard at once (emil-design-eng, approved 19.11.2026):** a hover keeps its slow, soft entry (0.6s for the picture darkening, `--d-base` 420ms for colours, underlines and arrows, `--d-slow` for the next-project tilt), set on the hover state itself; the resting state carries the exit, `--d-out` (200ms), so a pointer sweeping across a grid leaves no trail of dark covers. A finger press (`:active`) arrives at the same quick 200ms. Keyboard focus (`:focus-visible`) shows instantly, no transition, so someone tabbing sees where they are. Not changed: the entry durations themselves, the `.lit` dimmer on About me, the reveals and the page entrances.

## Typography
- **Hebrew (default language, RTL):** Karantina 700 for display (Latin glyphs in the same headline stay in Archivo), IBM Plex Sans Hebrew 400/600 for text and labels — both picked from the ui-ux-pro-max Google Fonts data.
- **Archivo Variable** (wdth 62–125, wght 100–900), one family:
  - Display: wdth 62, wght 800, uppercase, line-height 0.8–0.9 (`.mega`, `.display`, `.h1`, `.h2`)
  - Subheads: wdth 88, wght 600 (`.h3`)
  - Body: wdth 100, wght 400, 17px / 1.55, measure ≤ 62ch
- **JetBrains Mono** 400, 12px uppercase, +0.06em — labels, metadata, nav (`.label`)
- **Section titles** (`.sec-title`, 19.11.2026): the display face (Karantina 700 / Archivo 800 wdth 62, uppercase) at `--t-sec` `clamp(2rem, 3.4vw, 3.25rem)`, a step between `.h3` and `.h2`. Used for "Portfolio" and "About me" on the home page, "Overview", the project details and "Gallery", and "Background" / "Tools" on About me. They used to be mono labels and read too small. Beside a column of text (desktop), title and text share their first baseline (`align-items: first baseline`), measured equal. The small label above "Got a project?" stays a label, since the big heading is right under it.
- Pirata One is loaded only as a specimen on the Codex Saltus page.

## Space & grid
4px base: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144 · 208. Section rhythm `--section` (96–208px).
Page openings start at `--page-top` (`clamp(92px, 11vh, 124px)`, just clear of the fixed header) on every inner page. 12-column grid, margin `clamp(16px, 4vw, 56px)`, gutter 12–24px, max 1680px. Full-bleed images break the container on purpose.

## Images
Pre-processed by `scripts/images.mjs` → WebP at 640 / 1280 / 2000 (capped at the source width), plus a blurred 24px LQIP used as placeholder and ambient fill. Width/height always set (no CLS). Below-the-fold images lazy-load.

## Motion
- Reveal: fade + 28px rise or clip-path mask, 0.9–1.1s, `cubic-bezier(0.16, 1, 0.3, 1)`, 70–90ms stagger. No bounce.
- **Reveal is for content, not navigation (decided 19.11.2026):** the clip-path "curtain" runs on the project gallery and the picture on About me, where a visitor stops to look. The cover grid (`WorkGrid.astro`, category pages and `/work/`) shows its covers at once, with no curtain. It is where people scan and choose, and they come back to it between projects, so a replayed second-long reveal would only slow them down. (`WorkGrid`'s own `transition: filter …` is what leaves the mask without a transition. Keep it that way.)
- Home: every project row reveals the same way (image mask + text rise); no per-project effects.
- Page transitions: Astro `ClientRouter`, shared `transition:name` on project titles.
- `prefers-reduced-motion: reduce` → everything static, content fully visible. No JS → content fully visible.

## Accessibility checklist
- Skip link, semantic landmarks, one `h1` per page, breadcrumb nav on projects
- Visible `:focus-visible` ring (signal colour), 44px minimum targets on links
- Meaningful alt on every content image; decorative duplicates use empty alt + `aria-hidden` links with `tabindex="-1"`
- Text contrast ≥ 4.5:1 throughout

## Templates
- **Hero copy**: name (`h1`) → a **tagline** right under it, like the line under a logo (mono label, `--ink`, wide tracking) → the **pitch**: a short claim (`h2`, sans 600, `clamp(1.6rem, 2.7vw, 2.7rem)`) and its line (`--t-lead`, `--ink-2`, ≤40ch) → the two buttons, "Let's work together" primary and "Portfolio" ghost (the pitch leads to leaving details). Desktop grid rows: top · name · tag · bottom. **One alignment line, judged by the letters, not the boxes:** the name no longer tucks behind the portrait (`--tuck: 0` — its faded edge let the first letter show past the line), so in Hebrew the name, top labels, tagline, pitch, its line and the buttons all start exactly at the portrait's edge; English mirrors it on the left margin, with an optical correction of `-0.03em` on the first name line (the round O sits that far in from its box). The tagline sits close under the name (`--s-1`), like the line under a logo.
- **Hero entrance** (`views/HomePage.astro`): one ~2.3s sequence in the light motif — stars fade up (0s) → the portrait *develops*: a clip from below while the light slowly comes up on it, a smooth ease-in-out ramp with no flicker (0.2s, 2s) → name lines rise (0.6s / 0.74s) → the tagline (0.95s) → labels, the pitch (1.15s) and its line (1.3s), then the two buttons (1.5–1.62s) → the header last (1.7s). The portrait's own demo waits (`demoDelay` 4200ms) so the face is seen as itself first. The portrait is a cut-out (transparent around the hair), so the head and hair stay fully solid and the flock never shows through them. Only the body fades where the frame crops it: the side fade applies below the shoulders (phone: below 50–66% of its height; desktop: the inner side, below 62–80%). On a phone the pitch has no measure cap, so the Hebrew line (283px) stays on one line from 320px up. On a phone the hero scrolls normally (not sticky — it is taller than the screen) and the two buttons share one row.
- **Stacked home pages** (`views/HomePage.astro`, `.hp__panel`): opening → portfolio → about me; each rises over the one before, the one beneath dims gently to 45% black and scales to 0.97 (GSAP ScrollTrigger scrub, `gsap.matchMedia` for reduced motion, reverted on `astro:before-swap`). A panel taller than the screen sticks by its foot. Every passage is its own (`data-enter`): **melt** into the portfolio — the page rises with a feathered top edge (a mask gradient 260px deep, sharpening as it settles) that melts into the opening, while the category cards float up 48px and fades in from 25% (ease-in-out sine, done by 80% of the way; a circular "lens" was tried here and dropped as too heavy); then a short **easing-away** (`.hp__dwell`, 40svh of scroll with the portfolio held in place and still usable, but answering the scroll: the category cards drift up 5vh and dim to 82%, the "About me ↓" cue at its foot fades out — never a stretch where scrolling shows nothing); **tilt** into about me — a gentle slanted leading edge, 12% lower on the far side, levelling out; and the 2px warm **light line** with its halo only where about me meets the contact.
- **Header**: just the name, "Portfolio" (to the category cards, `/#work`), "About me" and the language switch.
- **Category cards** (`CategoryCards.astro`): three large cards in a row (stacked on a phone) — all three choices visible at once; with only three, the earlier coverflow wheel hid more than it showed. Each: the lead project's cover in the cover frame at `brightness(0.86)`, the category name always set near its foot in the display face (`clamp(1.9rem, 2.9vw, 2.8rem)`, layered text-shadow), over a caption scrim: the lower 64% of the picture darkens to `rgb(10 10 9 / 0.88)` at the foot, so the name reads on any cover, a bright busy one too, and the category line centred beneath the card (`--t-small`, `--ink-2`); a soft shadow in the project's accent under the picture. Hover / focus darkens it to `brightness(0.32)` and "See the work →" appears under the name (room is kept, so the name never moves or repeats). No autoplay, no controls. Head: the "Portfolio" label.
- **Category links** (`CategoryNav.astro`): "All" + each category as plain text links at `--t-lead`, no counts; inactive `--ink-3`, current `--ink` with a 2px `--signal` underline under the name only. Wraps, never scrolls. On `/work/` and every category page.
- **Cover grid** (`WorkGrid.astro`, on category pages and `/work/`): like a Behance profile — every cover in the cover frame, only the name (`--t-lead`, 600) and the year (mono label, on its own line) centred beneath; 1 / 2 (≥700px) / 3 (≥1100px) columns. **Hover / focus darkens the picture** (`brightness(0.3)`) and shows "View project →" over it (arrow in the project's accent); the name stays beneath. Details wait inside the project. (Replaced the heavier work list of sticky rows.)
- **About me** (`views/AboutPage.astro`): opening (the interactive portrait without its demo, the `.h1` headline, the first paragraph as `.lead`, primary + ghost buttons) → a facts strip (three columns between rules: now, studies, worked with) → the story in one column beside the Trance Tribe stand (`.lit`) on `#201e19` → what I do (unnumbered, 2–3 columns, each with a link to its category) → background and tools side by side. Each part melts from the previous tone into its own (`.ab-tone`, `--from`/`--to`, 180px); the light line marks the step into the contact form (shared rule in `global.css`).
- **Case study** (`views/ProjectPage.astro`): hero → cover → overview → details (optional) → gallery (`Gallery.astro`, automatic rows) → next project. Same order and behaviour for every project.
