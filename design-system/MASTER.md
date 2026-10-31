# Or Asif-Haber — Design System (Master)

Synthesised from the ui-ux-pro-max skill (style: Dark Mode / Swiss editorial; typography: Archivo; motion: standard stagger, no bounce) and adapted to the portfolio. Tokens live in `src/styles/global.css`.

## Positioning
Graphic designer building the visual worlds around psytrance parties, record labels and artists — line-up posters, party branding, cover art — plus brand identities outside the scene.

## Concept
The site is a neutral, dark frame; the saturated work carries the colour. The work is never shown all at once: it is sorted into three categories (party branding / posters & covers / brand & product — see `SPEC.md` §4), each with the same template.

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

Dark only (`color-scheme: dark`). No gradients except the caption scrim over images.

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
- **Home category section** (`CategorySection.astro`): category name at `.h2` with its count in mono, the category line and a link to its page; then the covers on a **coverflow rack** the visitor drives (adapted from ruixen.ui's Coverflow Carousel on 21st.dev): the centre cover faces you flat, the side ones swing their outer edges toward you — the same curve as the earlier cylinder gallery. One frame per category (`frame` in `categories.json`: party branding 1:1, the other two 10:7); every cover fills it (`object-fit: cover`, `cover.focus` for the crop). No loop, right-to-left in Hebrew. Advances by itself every ~4.2s in a 1.5s ease-in-out (sine) glide, one cover at a time, turning back at either end; holds on hover, keyboard focus, off screen, and for 6s after a manual move; a pause/play button; never with reduced motion. After a drag/swipe it settles in 0.65s ease-out from the hand's speed. Manual: drag, sideways swipe, click a side cover, prev/next buttons (44px rings), arrow keys. The caption sits centred right under the centre cover, as wide as it, no rule above: title in its accent and subtitle, cross-fading as each new cover reaches the centre; beneath it, quietly, prev · mono "02 / 04" · next · pause. Card width `min(62vw, 290px)`, from 900px `clamp(250px, 24vw, 400px)`, ×1.25 for landscape frames.
- **Category links** (`CategoryNav.astro`): "All" + each category as plain text links at `--t-lead`, count in mono; inactive `--ink-3`, current `--ink` with a 2px `--signal` underline under the name only. Wraps, never scrolls. On `/work/` and every category page.
- **Work list** (`WorkList.astro`, on `/work/` and category pages): one identical row per project — sticky info column (number within the list, title, subtitle, client/year/discipline, link) beside the cover, which unmasks on scroll.
- **Case study** (`views/ProjectPage.astro`): hero → cover → overview → details (optional) → gallery (`Gallery.astro`, automatic rows) → next project. Same order and behaviour for every project.
