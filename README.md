# Or Asif-Haber — Portfolio

Static portfolio site built with Astro 5. Hebrew is the default language (`/`, RTL); English lives under `/en/`. All texts live in `src/content/*.json` (every text field is `{ he, en }`) and can be edited in Pages CMS (below); page templates in `src/views/`, design tokens in `src/styles/global.css` (see `design-system/MASTER.md`). The full site spec (goals, pages, behaviour, open items) is in `SPEC.md` (Hebrew).

## Editing texts (Pages CMS)

Open **https://app.pagescms.org**, sign in with GitHub and pick this repository (`main` branch). Four sections:

- **פרויקטים** — every project's texts, order (drag) and image descriptions — `src/content/projects.json`
- **עמוד אודות** — `src/content/about.json`
- **טקסטים כלליים** — hero, menu, contact form, buttons, 404 — `src/content/ui.json`
- **פרטים אישיים** — email, Behance link, "worked with" — `src/content/site.json`

Saving commits to `main`; the **Deploy** workflow (`.github/workflows/deploy.yml`) then builds, checks and publishes the site in about two minutes. If the build or checks fail, nothing is published (see the repo's Actions tab). The editor's fields are defined in `.pages.yml`. Images and brand-new projects still go through the steps below.

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

## Categories

Every project has a `category` (slug from `src/content/categories.json`: `party-branding`, `posters-covers`, `brand-identity`). The order on the site is computed in `src/data/projects.ts` (`inCategory`): newest year first, several projects for the same client kept together; the order in `projects.json` only breaks ties. Each category also names a `lead` project, whose cover stands for it on the home page's category cards. The build fails if a project has an unknown category, a category is empty, a category's lead is not one of its projects, or a category slug equals a project slug (both live under `/work/`). Category names, lines and leads are editable in Pages CMS (**קטגוריות**). Every cover is the project's Behance cover, cropped exactly as on Behance: `scripts/images.mjs` reads the crop encoded in the cover's file name in `portfolio.json` (base64 of `crop,w,h,x,y`) and writes `public/img/NN/behance-*.webp`; projects point to `NN/behance`. (`cover.focus` is only needed for a cover that is not a Behance crop.) Full rules: `SPEC.md` §4.

## Adding or editing a project

Edit `src/content/projects.json` (or the **פרויקטים** section in Pages CMS); types are in `src/data/projects.ts`. Give it a `category`. Every project uses the same template: metadata, an intro, optional `details` (label + text, optional colour swatches) and a `gallery` list. The gallery lays itself out — wide images run full width, tall and square images are grouped into rows of 2–3. The array order only breaks ties within a category (see above).

## Contact form

The lead form posts to FormSubmit (`src/components/Contact.astro`), which forwards submissions to the email in `src/content/site.json`. The first submission triggers an activation email to that inbox; submissions are delivered after it is confirmed.

## Deploying

Live at **https://orasifhaber-web.github.io/** (GitHub Pages, served from the `gh-pages` branch).

```bash
npm run deploy
```

This builds with the production `SITE_URL`, runs the checks and force-pushes `dist/` to `gh-pages`. Pushing to `main` does the same automatically through the Deploy workflow. For a custom domain later, change `SITE_URL` in `scripts/deploy.mjs` and add the domain in the repo's Pages settings.
