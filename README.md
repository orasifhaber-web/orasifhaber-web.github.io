# Or Asif-Haber — Portfolio

Static portfolio site built with Astro 5. Hebrew is the default language (`/`, RTL); English lives under `/en/`. Content lives in `src/data/` (every text field is `{ he, en }`), UI strings in `src/i18n.ts`, page templates in `src/views/`, design tokens in `src/styles/global.css` (see `design-system/MASTER.md`).

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

Edit `src/data/projects.ts`. Every project uses the same template: metadata, an intro, optional `details` (label + text, optional colour swatches) and a `gallery` list. The gallery lays itself out — wide images run full width, tall and square images are grouped into rows of 2–3. Order in the array = order on the site.

## Contact form

The lead form posts to FormSubmit (`src/components/Contact.astro`), which forwards submissions to the email in `src/data/site.ts`. The first submission triggers an activation email to that inbox; submissions are delivered after it is confirmed.

## Deploying

Live at **https://orasifhaber-web.github.io/** (GitHub Pages, served from the `gh-pages` branch).

```bash
npm run deploy
```

This builds with the production `SITE_URL`, runs the checks and force-pushes `dist/` to `gh-pages`. Push source changes to `main` as usual. For a custom domain later, change `SITE_URL` in `scripts/deploy.mjs` and add the domain in the repo's Pages settings.
