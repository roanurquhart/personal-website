# Plan: Rebuild roanurquhart.com as a one-page Astro site (GitHub Pages)

## Goal
Replace the old Elm site with a static, one-page Astro site (resume + project links) deployed to GitHub Pages at `https://roanurquhart.com/` (custom domain, served at `/`). All resume content lives in `src/data/resume.ts`.

## Current repo state (tracked files)
```
.gitignore      (contains only: elm-stuff/**)
CNAME
elm.js
elm.json
index.html
package.json    (elm-live start script only)
src/CSSTest.elm
src/Main.elm
```
`adws/`, `.claude/`, `justfile`, `HANDOFF.md` — **do not touch** (may or may not exist in the worktree; leave them alone either way).

## 1. Delete old Elm site
Delete: `elm.js`, `elm.json`, `index.html`, `src/Main.elm`, `src/CSSTest.elm`, `CNAME`, and the old `package.json` (replaced in step 2).

## 2. Project scaffolding

### `.npmrc`
```
save-exact=true
```

### `package.json` (new)
```json
{
  "name": "roanurquhart-com",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "<EXACT VERSION>"
  }
}
```
- Resolve the version with `npm install --save-exact astro@latest` (this also generates `package-lock.json`). Confirm the resulting `package.json` entry has **no `^` or `~`**. Astro is the only dependency — no integrations, no UI framework, no Tailwind.
- **Commit `package-lock.json`** — `npm ci` and `withastro/action` need it.
- Check `node_modules/astro/package.json` → `engines.node` and use a Node major in the workflow that satisfies it (22 is expected to work).

### `.gitignore` (replace contents)
```
node_modules/
dist/
.astro/
.DS_Store
```

### `astro.config.mjs`
```js
// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://roanurquhart.com",
});
```
No `base` option.

### `tsconfig.json`
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

### `public/favicon.svg`
Small simple SVG (e.g. rounded square with "RU" text) so browsers don't log a favicon 404. Link it from the layout.

## 3. Content: `src/data/resume.ts`
Single source of truth. Export types and one `resume` object. Copy resume text **verbatim** (bullets exactly as in the prompt, do not "improve" wording). **No phone number anywhere.**

```ts
export interface Link { label: string; href: string; }

export interface Experience {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
  todo?: boolean;
}

export interface Project {
  name: string;
  url: string;
  description: string;
  todo?: boolean;
}

export interface SkillGroup { label: string; items: string[]; }

export interface Education { school: string; degree: string; dates: string; }

export const resume = {
  name: "Roan Urquhart",
  location: "Raleigh, NC",
  intro: "I'm Roan Urquhart, a software engineer based in Raleigh, NC.",
  experience: [ ... ] as Experience[],
  projects: [ ... ] as Project[],
  skills: [ ... ] as SkillGroup[],
  education: [ ... ] as Education[],
  links: [ ... ] as Link[],
};
```
(Use `satisfies`/typed consts as preferred; just keep it typed.)

### experience (in this order)
1. `{ title: "TODO: 2024 – present", company: "TODO", dates: "2024 – present", bullets: ["TODO: fill in"], todo: true }`
2. Senior Software Engineer — Corvus Insurance — "January 2024 – September 2024" — 3 bullets
3. Software Engineer — Corvus Insurance — "January 2022 – January 2024" — 5 bullets
4. Associate Software Engineer — Corvus Insurance — "October 2021 – January 2022" — 2 bullets
5. Associate Software Development Engineer — SentryOne — "June 2020 – October 2021" — 7 bullets
6. Software Engineering Intern — SentryOne — "Summer 2019" — 3 bullets

Bullet text: verbatim from the prompt's resume block (drop the leading "- ").

### projects (all `todo: true`)
- `{ name: "software-factory", url: "https://github.com/roanurquhart/software-factory", description: "TODO: add description", todo: true }`
- `{ name: "spotify-playlist-generator", url: "https://github.com/roanurquhart/spotify-playlist-generator", description: "TODO: add description", todo: true }`
- `{ name: "Unity-Fluid-Simulation", url: "https://github.com/roanurquhart/Unity-Fluid-Simulation", description: "TODO: add description", todo: true }`

### skills
- Programming Languages: Elixir, Elm, C#, Golang
- Database Technologies: Postgres, SQL Server
- Development Tools: AWS Console, Open Search, GitHub, Visual Studio

### education
- `{ school: "The University of North Carolina at Chapel Hill", degree: "Bachelors Degree in Computer Science", dates: "August 2016 – May 2020" }`

### links
- `{ label: "Email", href: "mailto:roanurquhart@gmail.com" }` (display text can show the address)
- `{ label: "GitHub", href: "https://github.com/roanurquhart" }`
- `{ label: "LinkedIn", href: "https://www.linkedin.com/in/roan-urquhart/" }`

Exactly four entries carry `todo: true` (1 experience + 3 projects). Do **not** add Relevant Experience, Certifications, a PDF resume link, a blog, or a contact form.

## 4. Layout & page

### `src/layouts/Base.astro`
- Props: `title`, `description`.
- `<html lang="en">`, `<meta charset>`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<meta name="description">`, `<meta name="color-scheme" content="light dark">`, `<title>`, `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`, `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)}>`.
- Global styles via `<style is:global>`:
  - CSS custom properties for `--bg`, `--fg`, `--muted`, `--accent`, `--border`, `--todo-bg`/`--todo-border` on `:root`; override them inside `@media (prefers-color-scheme: dark) { :root { ... } }`. Set `color-scheme: light dark` on `:root`.
  - System font stack, `line-height: 1.6`, `body` max-width ~42rem centered, horizontal padding ~1.25rem so phones (≥320px wide) have no horizontal scroll. Use `overflow-wrap: anywhere` on long URLs/text.
  - Links use `--accent`, visible `:focus-visible` outline.
  - `.todo` style: dashed border using `--todo-border`, subtle `--todo-bg` background, plus a small "TODO" badge — so placeholder entries are obvious.
- No client-side JavaScript (no `<script>`, no framework islands).

### `src/pages/index.astro`
Import `resume` from `../data/resume` and render inside `Base` (title "Roan Urquhart", description = `resume.intro`). Only layout/markup here — no hard-coded resume strings. Sections in this exact order, each a `<section>` with an `<h2>` (except intro) and an `id`:

1. **intro** (`<header>` or `<section id="intro">`): `<h1>{resume.name}</h1>`, `<p>{resume.intro}</p>`, and location in muted text.
2. **experience** (`id="experience"`, h2 "Experience"): for each entry an `<article>` with `<h3>{title}</h3>`, a line `{company} · {dates}` in muted text, and `<ul>` of bullets. Add `class="todo"` to the article when `todo` is true.
3. **projects** (`id="projects"`, h2 "Projects"): list; each item shows the name as a link to `url`, and `description` below. `class="todo"` when `todo`.
4. **skills** (`id="skills"`, h2 "Skills"): for each group, label (bold / `<dt>`) and comma-joined items (`<dd>`).
5. **education** (`id="education"`, h2 "Education"): school, degree, dates.
6. **links** (`id="links"`, h2 "Links"): `<ul>` of links; email shown as `roanurquhart@gmail.com`. External links (GitHub, LinkedIn, project URLs) get `rel="noopener noreferrer"`; opening in new tab is optional.

Optional: split sections into small components under `src/components/` if it reads better; not required.

## 5. Deploy workflow: `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@vX.Y.Z
      - name: Build with Astro
        uses: withastro/action@vX.Y.Z
        with:
          node-version: 22

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@vX.Y.Z
```
- **Pin every action to an exact full release tag** (e.g. `v4.2.2`, never `v4`). Resolve the current latest release tag for each with `git ls-remote --tags https://github.com/<owner>/<repo>` (or `gh release view -R <owner>/<repo>`). Use the latest major of `withastro/action` and make sure its inputs (`node-version`, etc.) match that version's `action.yml`.
- `withastro/action` builds and uploads the Pages artifact itself; no separate upload step.
- Do **not** add a CNAME file in `public/` — the custom domain is configured in repo Settings.

## 6. `README.md`
Short:
- What it is (personal site for roanurquhart.com, built with Astro, deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`).
- **All content lives in `src/data/resume.ts`**; entries with `todo: true` are placeholders to fill in.
- Local: `npm ci`, `npm run dev` (http://localhost:4321), `npm run build` (outputs `dist/`), `npm run preview`.

## 7. Verification (builder must run)
1. `npm ci && npm run build` exits 0, and `test -f dist/index.html` exits 0.
2. `grep -nE '"[~^]' package.json` finds nothing (exit 1) — versions are exact.
3. `grep -nE 'uses: [^@]+@v[0-9]+$' .github/workflows/deploy.yml` finds nothing — actions pinned to full versions.
4. `grep -c 'todo: true' src/data/resume.ts` prints `4`.
5. `grep -o 'TODO: 2024' dist/index.html`, and grep for `software-factory`, `spotify-playlist-generator`, `Unity-Fluid-Simulation` in `dist/index.html` — all found.
6. Phone check: `grep -rnE '\(?[0-9]{3}\)?[-. ][0-9]{3}[-. ][0-9]{4}|tel:' src public astro.config.mjs README.md dist` finds nothing.
7. `git ls-files` / `git status`: no Elm files, no `CNAME`, `adws/`, `.claude/`, `justfile`, `HANDOFF.md` untouched; `dist/`, `node_modules/`, `.astro/` not staged.
8. `npm run preview` and eyeball the page at narrow (~375px) and desktop widths, in light and dark OS themes.

Judge commands by exit status, not by output text.
