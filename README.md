# stuartlee.dev

Stuart Lee’s personal portfolio. Astro + TypeScript; static HTML with small, browser-native enhancements. English at `/`, German at `/de/`. No backend, external fonts, analytics or runtime content requests.

## Develop and verify

Use Node.js 24 LTS. The repository includes an `.nvmrc` for this version.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

The dev server is at http://127.0.0.1:4321. Production files are written to `dist/`.

Browser checks use Playwright and axe. Install the browser binaries once:

```sh
npx playwright install chromium firefox webkit
npm test
```

Tests preview the production build, so run `npm run build` first. Automated accessibility checks are complemented by manual keyboard, zoom and screen-reader review; they do not constitute an accessibility certification.

## Source layout

- `src/pages/` — English and German route entry points.
- `src/layouts/SiteLayout.astro` — document structure, metadata and initial appearance.
- `src/components/Portfolio.astro` — assembles the page from section components.
- `src/components/` — page sections, navigation, footer, theme control and discoveries dialog.
- `src/content/` — translated copy, shared types and project data.
- `src/scripts/` — browser behaviour for discoveries, the dialog and appearance.
- `src/styles/global.css` — shared styles and light/dark colour tokens.
- `tests/portfolio.spec.ts` — behaviour, responsive layout and accessibility checks in Chromium, Firefox and WebKit.

Astro renders the pages to static HTML at build time. Small TypeScript modules handle browser interactions; there is no React runtime or request-time server rendering.

VS Code will recommend the Astro and Prettier extensions when opening this repository. Run `npm run format` to format source files, or `npm run format:check` to check formatting without changing files.

## Content

Edit `src/content/locales/en.ts` or `src/content/locales/de.ts`. Both locales share the types in `src/content/types.ts` and the same components. German copy is a draft for review.

The `projects` arrays in `src/content/site.ts` are initially empty. Add an approved `Project` in each locale with the same stable `id`, and translated `title`, `context`, `contribution`, `decisions` and `outcomes`. Populated lists replace the coming-soon body. Update the section title and introduction when publishing real case studies. No sample outcomes are shown publicly.

## Deploy through Cloudflare

Build with `npm run build`. In Cloudflare Pages, create a project using either:

- **Git integration:** connect this repository, select Astro (or set `npm run build` as the build command), use `dist` as the output directory, and select a supported Node.js LTS version.
- **Direct Upload:** upload the contents of the generated `dist` directory through the dashboard. Upload the built site, not the repository source.

Add `stuartlee.dev` as a custom domain in the Pages project and follow the dashboard’s DNS instructions. No Worker, adapter, secrets or database are needed. Verify `/`, `/de/`, local assets, `/robots.txt` and `/sitemap.xml` after deployment. Preview domains intentionally retain production canonical URLs.

This repository has not been deployed by Codex.

## Discovery achievements

Six exploration achievements earn an Explorer badge: switch locale, activate an element other than the skip link after Tab navigation, use the skip link, view all five main sections, change the appearance setting, and greet the little Beeglebug in About. Two optional bonuses are earned through the console and a source comment. The first unlock exposes a control in the footer that opens the discoveries modal.

Progress is stored only in this browser under `stuartlee:discoveries:v1`; it is not transmitted. Storage failure falls back to memory. An ephemeral `explore` URL parameter records arrival after language switching, including when storage is unavailable, and is removed on arrival. Locale changes preserve saved achievements and section progress. Reset clears both. Collecting all eight discoveries adds a persistent star beside the total and shows a separate completion toast after the final discovery toast. Reloading restores the star without repeating the celebration.

Keyboard navigation follows browser settings. On macOS Safari, use Option–Tab if ordinary Tab does not focus links; the site does not intercept or replace native navigation.

The console exposes only `helloThere()`. Source codes are playful discoveries, not secrets. HTML compression is disabled to retain the source clue. Without JavaScript, content, skip navigation and locale links work; game controls stay hidden.

## Appearance

Light, dark and system controls are in the footer. System is the default and follows OS changes. An explicit choice is stored locally under `stuartlee:theme` and applied before rendering. Without JavaScript, the site follows system appearance.
