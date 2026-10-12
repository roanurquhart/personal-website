# Astro site replaced with plain HTML and CSS

## What changed and why

The personal site (roanurquhart.com) was an Astro project. This change ports it to two hand-written static files in `site/` and removes the Astro and Node tooling. The site is published straight from `site/` with no build step. Per the task, this is a port, not a redesign: the text, structure, styles, light/dark mode, meta tags and canonical link are meant to match the Astro output.

What the diff shows:

- **Static site added:** `site/index.html` (all content and markup, 154 lines) and `site/styles.css` (137 lines). No JavaScript.
- **Favicon moved:** `public/favicon.svg` → `site/favicon.svg`, unchanged (the diff shows a rename with 0 changed lines).
- **Astro/Node removed:** `package.json`, `package-lock.json`, `.npmrc`, `tsconfig.json`, `astro.config.mjs`, `src/data/resume.ts`, `src/pages/index.astro`, and `.gitignore`. The deleted `.gitignore` held only `node_modules/`, `dist/` and `.astro/`, all Astro/Node entries.
- **Deploy workflow:** `.github/workflows/deploy.yml` no longer has a `build` job. The single `deploy` job now checks out, runs `configure-pages`, uploads `site/` as the Pages artifact, and deploys.
- **README:** rewritten to describe `site/`, local preview, optional validation and the deploy flow.
- **Spec added:** `specs/c0de0011_astro-to-static-html.md` (the plan this change followed).

## Files that carry it

| Path | Role |
|---|---|
| `site/index.html` | All page content and markup. Four placeholders are marked (see below). |
| `site/styles.css` | Styling, including `prefers-color-scheme` dark mode and the two-column skills grid at 40rem and up. |
| `site/favicon.svg` | Site icon. |
| `.github/workflows/deploy.yml` | Publishes `site/` on push to `main` and on `workflow_dispatch`. |
| `README.md` | Where content lives, preview and deploy steps. |
| `specs/c0de0011_astro-to-static-html.md` | Plan and verification checklist for this port. |

Placeholders: the 2024–present experience entry and the three project stubs (software-factory, spotify-playlist-generator, Unity-Fluid-Simulation). Each has a visible `TODO` badge, the `todo` class, and an `<!-- TODO: ... -->` comment.

Workflow pins: `actions/checkout@v7.0.1`, `actions/configure-pages@v6.0.0`, `actions/upload-pages-artifact@v5.0.0` (`path: site`), `actions/deploy-pages@v5.0.1`. Permissions are `contents: read`, `pages: write`, `id-token: write`.

## How to use or verify it

Preview locally:

```sh
python3 -m http.server -d site
```

Then open http://localhost:8000.

Validate the markup (the task's done-when gate):

```sh
npx --yes html-validate@11.15.0 --preset standard site/
```

Find the placeholders still to fill in:

```sh
grep -n TODO site/index.html
```

To fill one in, remove its badge, the `todo` class and its comment.

Checks in the spec that are worth re-running: no phone number or `tel:` link, no `<script>`, no Astro/npm/node references in `README.md`, `.github` or `site/`, and the four TODO badges are present.

## Notes and limits

- **Not verified in this run.** The Bash tool was denied, so I did not run the validator, the string-parity check, the greps, or a browser visual comparison. The statements above come from reading the diff and the new files, not from running them.
- **Text parity not re-checked here.** The removed `src/data/resume.ts` is not in the captured diff (it is truncated), so I could not compare each string against the new `site/index.html` in this run. The spec's step 7.2 script does that comparison.
- The spec's `require-sri` note applies only if the validator flags the local stylesheet link. Whether it does was not checked.
