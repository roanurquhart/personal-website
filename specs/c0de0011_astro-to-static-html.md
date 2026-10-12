# Plan: Convert roanurquhart.com from Astro to plain HTML + CSS

## Goal

Replace the Astro project with two hand-written static files (`site/index.html`, `site/styles.css`) plus `site/favicon.svg`, published to GitHub Pages without a build step. **This is a port, not a redesign:** text, structure, styles, light/dark mode, meta tags and canonical link stay as the Astro page renders them today. No JavaScript.

## Current state (read before you delete anything)

- `src/data/resume.ts`: **the only source of text.** Every string on the page comes from here. Read it in full before writing `site/index.html`, and copy strings **character for character**. That includes the en dashes `–`, the middle dot `·`, and the original wording and punctuation. Some bullets end without a period, `Elixir and Elm.` uses a semicolon before it, and so on. Do **not** fix grammar.
- `src/pages/index.astro`: markup template plus the complete `<style>` block. The CSS moves verbatim into `site/styles.css`.
- `public/favicon.svg`: the blue "RU" tile, moved unchanged.
- Astro-only files to delete: `package.json`, `package-lock.json`, `.npmrc`, `tsconfig.json`, `astro.config.mjs`, `src/`, `public/`.
- `.gitignore` contains only `node_modules/`, `dist/`, `.astro/`. All three were added for Astro (see `app_docs/25dc0a82_astro-site-rebuild.md`: "`.gitignore` adds `node_modules/`, `dist/`, `.astro/`").
- Leave alone: `adws/`, `.claude/`, `justfile`, `HANDOFF.md`, plus the historical records `specs/25dc0a82_astro-site-rebuild.md` and `app_docs/25dc0a82_astro-site-rebuild.md`.

## Step 1: `site/favicon.svg`

Move it with `git mv public/favicon.svg site/favicon.svg` so the bytes and history are preserved. Do not edit it.

## Step 2: `site/styles.css`

- Copy the whole contents of the `<style>` element in `src/pages/index.astro` into `site/styles.css`. Keep every rule, value and selector, in the same order. Only drop the 6-space template indentation.
- Rules that must survive unchanged: the `:root` variables, the `@media (prefers-color-scheme: dark)` override, `.badge`, `.entry.todo, .todo` (dashed border), `.skills` grid with the `@media (min-width: 40rem)` two-column rule, and `.links` flex.
- Astro scoped these styles with `:where([data-astro-cid-…])`, which adds no specificity. Everything is on one page, so plain unscoped selectors behave the same. Do **not** add any `data-astro-cid-*` attributes.
- No trailing whitespace. End the file with a newline.

## Step 3: `site/index.html`

Write the markup by hand. It must match what `index.astro` rendered from `resume.ts`. Rules:

- Use void elements without a trailing slash (`<meta charset="utf-8">`), double-quoted attributes, and no inline `style`.
- Put each text string (each bullet in particular) on **one line**, so the verification grep in Step 7 can find it.
- Leave out the `data-astro-cid` attributes.
- Use relative `href`s for the local assets: `styles.css` and `favicon.svg`. They resolve the same at the domain root and also work under `python3 -m http.server -d site`.

### Head (exact)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">
    <meta name="description" content="Roan Urquhart is a software engineer in Raleigh, NC.">
    <title>Roan Urquhart</title>
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
    <link rel="canonical" href="https://roanurquhart.com/">
    <link rel="stylesheet" href="styles.css">
  </head>
```

(Astro built the canonical as `new URL("/", "https://roanurquhart.com")`, which is `https://roanurquhart.com/` with the trailing slash.)

### Body structure

```html
  <body>
    <main>
      <header>
        <h1>Roan Urquhart</h1>
        <p class="meta">Raleigh, NC</p>
        <p class="intro">Roan Urquhart is a software engineer in Raleigh, NC.</p>
      </header>

      <section id="experience" aria-labelledby="experience-heading">
        <h2 id="experience-heading">Experience</h2>
        <!-- TODO: fill in the 2024–present role (title, company, dates, bullets), then remove the "todo" class and the badge. -->
        <article class="entry todo">
          <h3>TODO: 2024 – present <span class="badge">TODO</span></h3>
          <p class="meta">TODO: company</p>
          <ul>
            <li>TODO: fill in</li>
          </ul>
        </article>
        <article class="entry">
          <h3>Senior Software Engineer</h3>
          <p class="meta">Corvus Insurance · January 2024 – September 2024</p>
          <ul>
            <li>…bullet 1 verbatim…</li>
            …
          </ul>
        </article>
        … (remaining entries, see below)
      </section>
```

**Experience.** Use one `<article class="entry">` per entry in `resume.experience`, in the same order:

1. TODO placeholder (shown above). It has no dates, so the meta line is just `TODO: company` with no ` · `.
2. Senior Software Engineer, Corvus Insurance, January 2024 – September 2024 (3 bullets)
3. Software Engineer, Corvus Insurance, January 2022 – January 2024 (5 bullets)
4. Associate Software Engineer, Corvus Insurance, October 2021 – January 2022 (2 bullets)
5. Associate Software Development Engineer, SentryOne, June 2020 – October 2021 (7 bullets)
6. Software Engineering Intern, SentryOne, Summer 2019 (3 bullets)

The meta line format is `{company} · {dates}`: a space, a middle dot U+00B7, then a space. Copy the bullets verbatim, in order.

**Projects.** All three are placeholders. Put one TODO comment directly before each article:

```html
      <section id="projects" aria-labelledby="projects-heading">
        <h2 id="projects-heading">Projects</h2>
        <!-- TODO: describe software-factory, then remove the "todo" class and the badge. -->
        <article class="entry todo">
          <h3><a href="https://github.com/roanurquhart/software-factory" rel="noopener noreferrer">software-factory</a> <span class="badge">TODO</span></h3>
          <p>TODO: describe this project</p>
        </article>
        <!-- TODO: describe spotify-playlist-generator, then remove the "todo" class and the badge. -->
        <article class="entry todo">
          <h3><a href="https://github.com/roanurquhart/spotify-playlist-generator" rel="noopener noreferrer">spotify-playlist-generator</a> <span class="badge">TODO</span></h3>
          <p>TODO: describe this project</p>
        </article>
        <!-- TODO: describe Unity-Fluid-Simulation, then remove the "todo" class and the badge. -->
        <article class="entry todo">
          <h3><a href="https://github.com/roanurquhart/Unity-Fluid-Simulation" rel="noopener noreferrer">Unity-Fluid-Simulation</a> <span class="badge">TODO</span></h3>
          <p>TODO: describe this project</p>
        </article>
      </section>
```

**Skills.** Use one `<dl class="skills">` with `<dt>`/`<dd>` pairs. Join the items with `, `:

```html
      <section id="skills" aria-labelledby="skills-heading">
        <h2 id="skills-heading">Skills</h2>
        <dl class="skills">
          <dt>Programming Languages</dt>
          <dd>Elixir, Elm, C#, Golang</dd>
          <dt>Database Technologies</dt>
          <dd>Postgres, SQL Server</dd>
          <dt>Development Tools</dt>
          <dd>AWS Console, Open Search, GitHub, Visual Studio</dd>
        </dl>
      </section>
```

**Education:**

```html
      <section id="education" aria-labelledby="education-heading">
        <h2 id="education-heading">Education</h2>
        <article class="entry">
          <h3>The University of North Carolina at Chapel Hill</h3>
          <p class="meta">Bachelors Degree in Computer Science</p>
          <p class="meta">August 2016 – May 2020</p>
        </article>
      </section>
```

**Links.** The email link shows the bare address and has **no** `rel`. The other two have `rel="noopener noreferrer"`:

```html
      <section id="links" aria-labelledby="links-heading">
        <h2 id="links-heading">Links</h2>
        <ul class="links">
          <li><a href="mailto:roanurquhart@gmail.com">roanurquhart@gmail.com</a></li>
          <li><a href="https://github.com/roanurquhart" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="https://www.linkedin.com/in/roan-urquhart/" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
      </section>
    </main>
  </body>
</html>
```

Put no `<script>` anywhere and no phone number or `tel:` link. Add no text beyond what is in `resume.ts`. The only additions allowed are the TODO comments.

Optionally, put a short top-of-file comment after `<!doctype html>`, such as `<!-- All site content lives in this file. Placeholders are marked with TODO comments and badges. -->`. It is allowed but not required.

## Step 4: Delete the Astro/Node pieces

Run `git rm -r package.json package-lock.json .npmrc tsconfig.json astro.config.mjs src public`. `public/favicon.svg` will already have been moved by then. Also delete any untracked `node_modules/`, `dist/`, `.astro/` directories if they exist locally (they are not tracked).

`.gitignore`: all three of its entries are Astro/Node entries. Remove them. The file is then empty, so delete it (`git rm .gitignore`).

## Step 5: Rewrite `.github/workflows/deploy.yml`

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
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v7.0.1
      - name: Configure Pages
        uses: actions/configure-pages@v6.0.0
      - name: Upload site
        uses: actions/upload-pages-artifact@v5.0.0
        with:
          path: site
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5.0.1
```

Use these exact version pins. Do not add a Node setup step or any build step.

## Step 6: Rewrite `README.md`

Keep it short and remove every Astro/npm reference. Content:

- Title `# roanurquhart.com`, then one line: personal one-page site (resume + project links), plain HTML and CSS, deployed to GitHub Pages at https://roanurquhart.com.
- **Where content lives:**
  - `site/index.html` holds all text, links, experience, projects, skills and education.
  - `site/styles.css` holds styling, including light/dark mode via `prefers-color-scheme`.
  - `site/favicon.svg` is the favicon.
  - Placeholders carry a visible TODO badge, the `todo` class and an `<!-- TODO: ... -->` comment. Remove all three once an entry is filled in. Tip: `grep -n TODO site/index.html` finds them.
- **Preview locally:** `python3 -m http.server -d site`, then open http://localhost:8000.
- **Validate (optional):** `npx --yes html-validate@11.15.0 --preset standard site/`
- **Deploy:** pushing to `main` runs `.github/workflows/deploy.yml`, which uploads `site/` as-is (no build step) and publishes it with `actions/deploy-pages`. It can also be run manually from the Actions tab (`workflow_dispatch`).

## Step 7: Verify

Judge each check by its exit status.

1. **Validator (the done-when gate):** `npx --yes html-validate@11.15.0 --preset standard site/` must exit 0.
   - If the `require-sri` rule fires on the local `<link rel="stylesheet" href="styles.css">`, do **not** inline the CSS and do not add a config file that changes the gate. Report it in your notes instead.
   - Fix any other findings in the markup itself, without changing content.
2. **Every content string survived.** Compare against the pre-port data file from git. Use `HEAD`, or the base commit if HEAD has already moved past the deletion:
   ```sh
   git show HEAD:src/data/resume.ts | python3 -c '
   import re, sys
   src = sys.stdin.read().split("export const resume", 1)[1]
   html = open("site/index.html", encoding="utf-8").read()
   missing = [s for s in re.findall(r"\"([^\"]*)\"", src) if s and s not in html]
   print("\n".join(missing) or "all strings present")
   sys.exit(1 if missing else 0)
   '
   ```
   This must exit 0.
3. **TODO markers:** `grep -c 'class="badge">TODO<' site/index.html` gives 4, and `grep -c '<!-- TODO:' site/index.html` gives at least 4 (one experience entry, three projects).
4. **No phone number, no JS:** `grep -rnE '\(?[0-9]{3}\)?[-. ][0-9]{3}[-. ][0-9]{4}|tel:|<script' site README.md .github` finds nothing. grep exits 1 when nothing matches, and that is the pass.
5. **Astro/Node gone:** `ls package.json package-lock.json .npmrc tsconfig.json astro.config.mjs src public .gitignore` reports that every one of them is missing. `git grep -niE 'astro|npm|node' -- README.md .github site` should return nothing.
6. **Visual parity:** run `python3 -m http.server -d site` and check the items below in a browser.
   - All six sections appear in order.
   - The badges render as amber pills, and the dashed borders appear on the 4 TODO entries.
   - Toggling the OS or devtools color scheme switches to the dark palette.
   - Skills shows two columns at widths of 40rem and above, and one column below that.
   - The favicon loads.
   - The CSS is unchanged from `index.astro`, so the rendering should match the old site.

## Files touched (summary)

| Action | Path |
|---|---|
| add | `site/index.html`, `site/styles.css` |
| move | `public/favicon.svg` → `site/favicon.svg` |
| delete | `package.json`, `package-lock.json`, `.npmrc`, `tsconfig.json`, `astro.config.mjs`, `src/` (`data/resume.ts`, `pages/index.astro`), `public/`, `.gitignore` |
| rewrite | `.github/workflows/deploy.yml`, `README.md` |
| untouched | `adws/`, `.claude/`, `justfile`, `HANDOFF.md`, `specs/25dc0a82_*`, `app_docs/25dc0a82_*` |
