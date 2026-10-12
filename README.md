# roanurquhart.com

Personal one-page site (resume + project links), plain static HTML and CSS, deployed to GitHub Pages at https://roanurquhart.com.

## Where content lives

- **`site/index.html`**: all page content (text, links, experience, projects, skills, education) and the markup. Placeholders are marked with a visible TODO badge, the `todo` class, and an HTML comment beside them. To fill one in, remove the badge, the `todo` class, and the comment. Find them with `grep -n TODO site/index.html`.
- **`site/styles.css`**: layout and styling, including light/dark mode via `prefers-color-scheme`.
- **`site/favicon.svg`**: the site icon.

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
