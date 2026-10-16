# Or Asif-Haber — Portfolio

Static portfolio site built with Astro 5. Content lives in `src/data/`; design tokens in `src/styles/global.css` (see `design-system/MASTER.md`).

## Commands

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm run preview
node scripts/check.mjs   # after build: links, images, alt text, h1, meta
```

## Images

Source images come from the `Behance Portfolio` folder. To regenerate the optimised WebP files and `src/data/images.json`:

```bash
npm run images -- "../‏‏Behance Portfolio - עותק/Behance Portfolio"
```

Existing outputs are skipped; delete `public/img` to rebuild everything.

## Adding or editing a project

Edit `src/data/projects.ts`. Each project has metadata, an intro, and a `blocks` array that composes the case study (`full`, `pair`, `grid`, `text`, `split`, `chapter`, `palette`, `type`, `trio`). Set `featured: true` to consider it for the home page; the home compositions themselves are in `src/pages/index.astro`.

## Deploying

Live at **https://orasifhaber-web.github.io/** (GitHub Pages, served from the `gh-pages` branch).

```bash
npm run deploy
```

This builds with the production `SITE_URL`, runs the checks and force-pushes `dist/` to `gh-pages`. Push source changes to `main` as usual. For a custom domain later, change `SITE_URL` in `scripts/deploy.mjs` and add the domain in the repo's Pages settings.
