# roanurquhart.com

Personal one-page site (resume + project links), plain static HTML and CSS, deployed to GitHub Pages at https://roanurquhart.com.

## Where content lives

- **`site/index.html`**: all page content (text, links, experience, projects, skills, education) and the markup. Placeholders are marked with a visible TODO badge, the `todo` class, and an HTML comment beside them. To fill one in, remove the badge, the `todo` class, and the comment. Find them with `grep -n TODO site/index.html`.
- **`site/styles.css`**: layout and styling. Light only, laid out as a newspaper page on off-white newsprint.
- **`site/app.js`**: the zoom viewer for the Experience ads. The page works fully without it: every role and bullet is printed in full.
- **`site/favicon.svg`**: the site icon.

### Experience ads

Each role is one `article.ad` inside `#experience .ads`, newest first. Its `h3` is the job title, `.ad-dates` the dates, `.ad-copy` the bullets and `.wordmark` the company. The figure layers are `<use>` elements that reference symbols in the SVG sprite at the top of `<body>`. Size classes `ad--lg`, `ad--md`, `ad--sm` and `ad--reserved` set the grid spans. `app.js` turns each headline into a button and zooms the ad into a `<dialog>` viewer. Deep links use the ad's id, for example `#role-intern`.

The 2024 to present placeholder is `#role-2024-present`, with a TODO comment. Replace its title, company and bullets, then remove the badge, the `todo` class and the comments.

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
