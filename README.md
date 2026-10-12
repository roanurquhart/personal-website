# roanurquhart.com

Personal one-page site (resume + project links), plain static HTML and CSS, deployed to GitHub Pages at https://roanurquhart.com.

## Where content lives

- **`site/index.html`**: all page content (text, links, experience, projects, skills, education) and the markup. Placeholders are marked with a visible TODO badge, the `todo` class, and an HTML comment beside them. To fill one in, remove the badge, the `todo` class, and the comment. Find them with `grep -n TODO site/index.html`.
- **`site/styles.css`**: layout and styling, including light/dark mode via `prefers-color-scheme` (morning edition in light, night edition in dark).
- **`site/app.js`**: progressive enhancement for the Experience catalog. The page works fully without it: every role and bullet is printed in order, and the ticket links jump to their plates.
- **`site/favicon.svg`**: the site icon.

### Experience catalog

Each Experience role appears twice: as a numbered ticket in `nav.plate-index` and as an `article.plate` below it. They are matched by `href="#id"` on the ticket and `id` on the plate. When a role changes, edit both, and update the ticket number, tagline, garment layers (`<use>` elements) and ticket tag to match. The garment shapes live in the SVG sprite at the top of `<body>`.

The 2024 to present ticket and plate carry a TODO comment. Replace the title, company, bullets and tagline there, then remove the badge, the `todo` class and the comments.

## Preview locally

```sh
python3 -m http.server -d site
```

Then open http://localhost:8000.

## Validate (optional)

```sh
npx --yes html-validate@11.15.0 --preset standard site/
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which uploads `site/` as a Pages artifact and publishes it with `actions/deploy-pages`. It can also be run manually from the Actions tab (`workflow_dispatch`). There is no build step.
