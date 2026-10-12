# Astro rebuild of roanurquhart.com

## What changed and why

The Elm single-page site was replaced with a one-page Astro site, served by GitHub Pages at `https://roanurquhart.com` (custom domain at `/`). The page is a resume plus project links: intro, experience, projects, skills, education, links, in that order. All content lives in one data file, so the resume can be edited without touching layout code.

Removed:
- The Elm app: `src/Main.elm`, `src/CSSTest.elm`, `elm.js`, `elm.json`.
- The old static page `index.html`.
- `CNAME`. The custom domain is meant to be set in repo Settings instead (that step is outside this diff).

Added or replaced:
- `package.json` now declares Astro only (`astro` pinned to `7.3.8`). `package-lock.json` is new.
- `.npmrc` sets `save-exact=true`, so new dependencies are saved without a range prefix.
- `.gitignore` adds `node_modules/`, `dist/`, `.astro/`.

## Files that carry it

- `src/data/resume.ts`: the single content source. Exports the types and one `resume` object (name, location, intro, experience, projects, skills, education, links).
- `src/pages/index.astro`: the only page. Renders `resume` and holds all CSS. Light/dark colours come from `prefers-color-scheme`. Each section has an id and an `aria-labelledby` heading. The page has a canonical link built from `Astro.site`.
- `astro.config.mjs`: `site: "https://roanurquhart.com"`, no `base`.
- `tsconfig.json`: extends `astro/tsconfigs/strict`.
- `public/favicon.svg`: a blue "RU" tile.
- `.github/workflows/deploy.yml`: on push to `main` or manual `workflow_dispatch`, it runs `withastro/action@v6.1.3` (Node 22) to build, then `actions/deploy-pages@v5.0.1` to publish. `actions/checkout@v7.0.1` is used for the checkout. All are pinned to exact versions.
- `README.md`: where content lives, local commands, and the deploy path.
- `specs/25dc0a82_astro-site-rebuild.md`: the spec this work followed.

## Content decisions visible in the data

- Phone number: absent from the site source.
- Links: email (shown as the bare address), GitHub, and LinkedIn.
- Experience: the resume text is carried over from the prompt. The stop point is September 2024. One placeholder entry sits at the top, flagged `todo: true`, with title `TODO: 2024 – present`, company `TODO: company`, an empty date string, and a single bullet `TODO: fill in`.
- Projects: three stubs (`software-factory`, `spotify-playlist-generator`, `Unity-Fluid-Simulation`) with their GitHub URLs, descriptions `TODO: describe this project`, and `todo: true`.
- Intro: `Roan Urquhart is a software engineer in Raleigh, NC.`
- Skipped: "Relevant Experience" and "Certifications" sections. No PDF resume.

TODO entries render with a "TODO" badge and a dashed border (`.todo` / `.entry.todo` styles in `index.astro`).

## How to use it

Edit `src/data/resume.ts` to change content. Remove a `todo: true` flag once its entry is filled in. Edit `src/pages/index.astro` only for layout or design.

Local:

```sh
npm ci            # exact versions from package-lock.json
npm run dev       # http://localhost:4321
npm run build     # writes dist/
npm run preview
```

Deploy: push to `main`, or run the workflow from the Actions tab.

## How to verify

- `npm ci && npm run build` should succeed and produce `dist/index.html`. This write-up does not record a build run; it was not executed as part of documenting the change.
- Phone check, as listed in the spec: `grep -rnE '\(?[0-9]{3}\)?[-. ][0-9]{3}[-. ][0-9]{4}|tel:' src public astro.config.mjs README.md dist` should find nothing. A grep of the current tree found no phone number in the site source.
- Confirm the TODO entries are flagged: `grep -n "todo: true" src/data/resume.ts` should show four matches (one experience, three projects).

## Open items

- Project descriptions and the 2024–present experience are placeholders. They need real text.
- The custom domain and DNS are set outside this repo.
- The `CNAME` file is deleted. GitHub Pages needs the custom domain set in repo Settings to serve `roanurquhart.com`.
