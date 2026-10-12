# roanurquhart.com

Personal one-page site (resume + project links), plain static HTML, CSS and vanilla JS, deployed to GitHub Pages at https://roanurquhart.com.

## Where content lives

- **`site/index.html`**: all page content (text, links, experience, projects, skills, education) and the markup. Placeholders are marked with a visible TODO badge, the `todo` class, and an HTML comment beside them. To fill one in, remove the badge, the `todo` class, and the comment. Find them with `grep -n TODO site/index.html`.
- **`site/styles.css`**: layout and styling. Light only, laid out as a broadsheet page on yellowed newsprint (grain, tone and edge shading are all CSS).
- **`site/app.js`**: the article reader for the Experience stories. The page works fully without it: every story is printed in full, at a readable size.
- **`site/favicon.svg`**: the site icon.

### Experience stories

Each role is one `article.story` inside `#experience .stories`, newest first. The lead story is `story--lead`; the others are `story--md` or `story--sm` and set their column span. Each story has:

- `.story-logo`: an inline SVG `<use>` of the company mark in the sprite at the top of `<body>` (`#logo-corvus` or `#logo-sentryone`).
- `.story-title`: the job title, `.story-byline`: the company and dates, `.story-copy`: the bullets.

`app.js` turns each title into a button and opens the story in a reading frame. Deep links use the story's id, for example `#role-intern`.

The 2024 to present placeholder is `#role-2024-present`, a small `.notice` with a TODO comment. It is not part of the reader. Replace its title, company and bullets, then remove the badge, the `todo` class and the comments.

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
