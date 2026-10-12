# roanurquhart.com

Personal one-page site (resume + project links), built with [Astro](https://astro.build) and deployed to GitHub Pages at https://roanurquhart.com.

## Where content lives

- **`src/data/resume.ts`**: all text, links, experience, projects, skills, and education. Edit this file to change the site content.
- **`src/pages/index.astro`**: page layout and styling. Only touch this for design changes.
- **`public/`**: static files served as-is (currently `favicon.svg`).
- **`astro.config.mjs`**: sets the site URL (`https://roanurquhart.com`).

Entries marked `todo: true` in `resume.ts` are placeholders and render with a TODO badge. Remove the flag once the entry is filled in.

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm ci           # install exact dependency versions
npm run dev      # dev server at http://localhost:4321
npm run build    # production build into dist/
npm run preview  # serve the built dist/ locally
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site with `withastro/action` and publishes `dist/` with `actions/deploy-pages`. It can also be run manually from the Actions tab (`workflow_dispatch`).
