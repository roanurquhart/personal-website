# Broadsheet page: newsprint, masthead, logo articles and a zoom reader

## What changed

The page now reads as a vintage broadsheet rather than a set of painted ads.

- **Newsprint.** `body::before` carries the paper: an SVG `feTurbulence` grain, blotchy warm tone from radial gradients, and a faint horizontal fold. `body::after` darkens the edges. The old 6% noise tile is gone. Light only.
- **Masthead.** The name is the centred nameplate. "Raleigh, NC" sits in the left ear and the email, GitHub and LinkedIn links in the right ear. A 4px rule runs under the plate, with a 1px hairline beneath it. A `nav.dateline` below holds links to the four existing section ids (Education, Experience, Skills, Projects). No new text was added.
- **Rules.** The page-level double border, the section top borders and the doubled heading rules were removed. Each `h2` has one hairline under it.
- **Experience as articles.** Each role is an `article.story` in a `.stories` grid. The Senior Software Engineer role is the lead (`story--lead`), spanning the widest columns with the largest headline. The others are `story--md` or `story--sm`. Headline is the job title; the byline is "Company · dates".
- **Logos replace figures.** The person, hanger, garment and scene symbols are removed from the sprite. Two original inline SVG seals take their place: `#logo-corvus` (a hatched disc with a "C" and the name) and `#logo-sentryone` (a shield with the name). Each story shows its company seal at 56px, or 72px for the lead. The same seal is reused for every role at a company.
- **Tiny body copy.** With `.js` on `<html>`, `.story-copy` is 5.5px with tight leading, justified, in two columns from tablet width up, with a drop cap. Without JS the copy is 0.9rem and in full.
- **Placeholder.** The 2024 to present role is a small dashed `.notice` with the TODO badge, the `todo` class and its `<!-- TODO -->` comment. It is not part of the reader.
- **Reader (`site/app.js`, rewritten).** Each story title becomes a button that covers the whole story.
  - **Open.** The page zooms toward the story (`scale(2.4)`, origin at the story's centre) while it blurs and dims, about 340ms. A `<dialog>` then shows a clone of the story in a bordered frame, with an ease-out settle, about 380ms.
  - **Previous / Next.** The frame slides out and the next story slides in with a small overshoot.
  - **Close.** The frame fades, the page zooms back out, and focus returns to the story that was opened. Close also works from Esc or a click on the margin.
  - **Focus.** Tab and Shift+Tab cycle only through Previous, Close and Next.
  - **Hash.** The open story's id is written to the hash (`#role-intern`). Loading with a hash opens that story without animation. `hashchange` is handled too.
  - **Reduced motion.** The script skips the page zoom and the frame slides when `prefers-reduced-motion: reduce` matches.
- **Fonts.** The Yellowtail script face is no longer loaded and `--font-script` is removed; the SentryOne wordmark it styled is replaced by the seal. Bodoni Moda and Libre Caslon Text remain.
- **Skills and Projects.** Skills is a narrow boxed sidebar on wide screens. Projects entries are small dashed boxes; their TODO badges and comments are kept.

## Files that carry it

| File | Role |
|---|---|
| `site/index.html` | Masthead markup, the logo symbols in the sprite, the story articles, the `.notice` placeholder, and the inline script that adds `.js` to `<html>`. |
| `site/styles.css` | Paper and edge shading (`body::before/::after`), the masthead and rule system, the broadsheet grid, tiny copy under `.js`, the notice and entry boxes, and the reader frame and buttons. |
| `site/app.js` | The reader: open, step, close, focus trap, hash handling and reduced-motion checks. |
| `README.md` | Updated for the new story markup, the `.js` class and the reader. |
| `specs/c0de0017_broadsheet-zoom-articles.md` | The plan this change followed, added in the same change. This write-up does not restate it. |

## How to use or verify it

- Validate: `npx --yes html-validate@11.15.0 --preset standard site/`. This is the check named in the plan; the diff does not record its result.
- Serve `site/` as static files and open it at 1280px and 375px.
  - Order should be masthead, Education, Experience, Skills, Projects.
  - Click a story title, or press Enter or Space on it. The page should zoom, then the story should appear full size.
  - Use Previous and Next, Tab (focus should stay inside the frame), and Esc (focus should return to the same story).
  - Open `#role-intern` directly; that story should open on load.
- JS off (or the `js` class removed from `<html>`): every story should be printed in full at readable size.
- Leftover check: `grep -n "fig-\|scene-" site/*` should return nothing, and `grep -n TODO site/index.html` should list the placeholders.

## Notes and gaps

- `site/styles.css` contains no `prefers-reduced-motion` rule. The backdrop fade (`dialog.reader[open]::backdrop`, 220ms) runs regardless of the user's setting. The zoom and slide are skipped only in `app.js`.
- The phone rule clamps `.js .story-copy` to 9.5em with a fade mask. The diff does not show a measurement that no article exceeds half a screen.
- The diff does not record a validation result, screenshots or a review. Those are not described here.
- The reader's bordered frame and its Previous, Close and Next buttons are sized in CSS. The diff does not show a measured check that the logo or byline clears the frame edge at every width.
