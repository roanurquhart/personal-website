# Plan: Restyle the site as a 1950s menswear advertisement, with Experience as "The Season's Catalog"

## Goal
Restyle all of `site/` in the look of 1948–1960 American menswear print ads (cream paper, printed inks, Didone headlines, script accents, justified columns, drop caps, ticket/label/coupon shapes, simple SVG garments). Turn **Experience** into a catalog you can explore: an index of numbered "plates", each opening as a full ad page. Section order does not change: header, Education, Experience, Skills, Projects.

Plain HTML/CSS/vanilla JS only. No framework, no build step, no npm deps. All content stays in the HTML, and JS only adds the exploring.

## Current state (as found)
- `site/index.html` (~150 lines): `<main>` holds `<header>` (h1 "Roan Urquhart", `p.meta` "Raleigh, NC", `p.intro`, `ul.links` with mailto/GitHub/LinkedIn), then `#education`, `#experience`, `#skills`, `#projects`. Each section has `aria-labelledby` → `*-heading` h2.
- Experience has 6 `article.entry` elements, newest first:
  1. `<!-- TODO: placeholder for the 2024 to present role; replace title, company, and bullets -->` + `article.entry.todo` (h3 "TODO: 2024 – present" + `span.badge` TODO, `p.meta` "TODO: company", one li "TODO: fill in")
  2. Senior Software Engineer · Corvus Insurance · January 2024 – September 2024 (3 bullets)
  3. Software Engineer · Corvus Insurance · January 2022 – January 2024 (5 bullets)
  4. Associate Software Engineer · Corvus Insurance · October 2021 – January 2022 (2 bullets)
  5. Associate Software Development Engineer · SentryOne · June 2020 – October 2021 (7 bullets)
  6. Software Engineering Intern · SentryOne · Summer 2019 (3 bullets)
- Projects: 3 `article.entry.todo` stubs, each preceded by a `<!-- TODO -->` comment, with `span.badge`.
- `site/styles.css` (~2KB): system font, white/dark palette via `prefers-color-scheme`, 42rem column. There is no JS file.
- `site/favicon.svg`: blue rounded square with "RU".
- `README.md` documents the content and TODO conventions. Deploy uploads `site/` as is (`.github/workflows/deploy.yml`, no change needed).

---

## Brainstorm: three ways to explore the experience

### Concept A: The Season's Catalog
- **Look:** A contents page of numbered ad "plates" (No. 1, No. 2, …), each a small ticket with its number, a tiny garment drawing, the role, and the maker and year. Selecting a ticket brings that plate forward as a full ad page. The page has a huge Didone headline (ad copy drawn from the bullets), the role set as the "product" name, a garment figure, the bullets as justified body copy with a drop cap, the dates on a price-tag label, and a corner sign-off.
- **Moving through it:** Pick any ticket (random access), or turn pages with Previous/Next on the open plate. Esc or "Return to the catalog" puts the plate back and returns focus to its ticket.
- **Phone:** Tickets form a 2-column grid. The open plate stacks in one column below them, with the figure shrunk and the copy in one ragged-right column.

### Concept B: The Wardrobe
- **Look:** One wide SVG clothes rail with six garments, read left to right from intern (shirt sleeves) to senior (full suit and fedora), plus a dust-covered garment bag for next season. Selecting a garment slides its ad out from behind the rail.
- **Moving through it:** Click a garment or tab along the hangers. The ad appears under the rail.
- **Phone:** The rail would have to scroll sideways (scroll-snap) or turn vertical, which loses the rail metaphor.
- **Weakness:** The meaning lives in the drawing, so the no-JS reading is weak. Long role titles don't fit on a hanger tag, and a sideways rail risks horizontal overflow at 375px.

### Concept C: The Swatch Book
- **Look:** Fabric swatches bound at the top like a tailor's sample book. Each has a stitched label (role, maker, dates), and the bullets are printed on the swatch.
- **Moving through it:** Flip one swatch at a time (Previous/Next, swipe). The stack edge shows how many are left.
- **Phone:** Swatches fill the width, which works well.
- **Weakness:** It is strictly linear with no overview. Seven bullets crowd a swatch. Convincing fabric textures take heavy CSS, and a stack of flips hides most of the content.

### Pick: A, the Catalog, borrowing from B and C
- From **B**, the garment progression becomes each plate's figure. The outfit builds up across the career: shirt (intern) → + tie (Assoc. SDE) → + jacket (Assoc. SWE) → + pocket square (SWE) → + fedora (Senior), and a garment bag for "next season". The left-to-right reading survives in the ticket index without a fragile horizontal rail.
- From **C**, stitched-label styling is used for the Education card and the makers' labels.
- **Why A:** It is the only concept with both an overview (the index) and direct access to any role, as well as linear page-turning. It maps onto a simple, robust disclosure pattern. With JS off it degrades cleanly to a table of contents of anchor links plus every plate printed in full. It also fits 375px without any horizontal scrolling.

---

## Design system

### Fonts (Google Fonts, 3 families, `display=swap`)
In `<head>`, before `styles.css`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&amp;family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&amp;family=Yellowtail&amp;display=swap">
```
(Escape `&` as `&amp;` in the href.) Stacks:
- `--font-display: "Bodoni Moda", "Didot", "Bodoni 72", "Bodoni MT", Georgia, serif;` for h1, h2, plate headlines, plate numbers.
- `--font-body: "Libre Caslon Text", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;` for everything else.
- `--font-script: "Yellowtail", "Brush Script MT", "Snell Roundhand", cursive;` for one or two words per section only (kickers).

### Palette (CSS custom properties on `:root`)
Light, the "morning edition" in cream-paper print:
```
--paper:   #f2e8d5;  --paper-2: #e8dbc0;  /* card/plate stock */
--ink:     #23211d;  --ink-soft: #4a4339;
--navy:    #1f2f4d;  --oxblood: #6e1f1f;  --mustard: #c9962b;
--olive:   #565a2b;  --tan:     #b8956a;
--rule:    var(--ink); --link: var(--navy); --focus: var(--oxblood);
--dot:     rgb(35 33 29 / 0.16);           /* halftone dots */
```
Dark, the "night edition" (`@media (prefers-color-scheme: dark)`) on deep navy paper with cream ink:
```
--paper:   #141b2b;  --paper-2: #1c2538;
--ink:     #efe4cc;  --ink-soft: #cdbf9f;
--navy:    #9db3d9;  --oxblood: #e7a08f;  --mustard: #d9ab4a;
--olive:   #b5b978;  --tan:     #b89566;
--link: var(--navy); --focus: var(--mustard);
--dot:     rgb(239 228 204 / 0.12);
```
Contrast rules, which the builder must keep:
- Body and small text are only ever `--ink`, `--ink-soft`, `--oxblood`, `--navy` or `--olive` on `--paper`/`--paper-2`. Each pair is ≥ 4.5:1 in both themes; check them in devtools.
- `--mustard` and `--tan` are **fills only**. Text placed on them is always the dark ink: `#23211d` in light, `#141b2b` (the night paper) in dark. Define `--on-mustard` for this.
- Keep `color-scheme: light dark` and the existing `<meta name="color-scheme">`.

### Paper and ink texture (CSS only, no image files)
- `body` background is `var(--paper)` plus a very faint grain: an inline `url("data:image/svg+xml,…")` SVG with `<feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2">` + `feColorMatrix type="saturate" values="0"`, drawn on a rect at about 0.06 opacity, tiled at 160px. Keep the data URI under 1KB, and URL-encode `#` as `%23`.
- Halftone: a utility applied via pseudo-elements, `radial-gradient(circle, var(--dot) 1.1px, transparent 1.5px) 0 0 / 6px 6px`, faded with `mask-image` (and `-webkit-mask-image`) `linear-gradient(135deg, #000, transparent 65%)`. Use it in plate corners, behind the header figure, and on the "next season" plate. Always `pointer-events: none`.
- Cross-hatching (optional): `repeating-linear-gradient(45deg, var(--dot) 0 1px, transparent 1px 5px)` for the garment-bag plate and the figure shadow.

### Shapes and vocabulary
- **Frames:** `border: 3px double var(--rule); border-radius: .9rem;`, used for plates and the education label.
- **Rules:** thin + thick hairline pairs under section heads (`border-top: 1px solid; box-shadow: 0 -4px 0 -2px` or two borders).
- **Ticket:** rounded rect with half-circle notches on the sides (radial-gradient mask), number on top.
- **Price tag:** `clip-path: polygon(.9rem 0,100% 0,100% 100%,.9rem 100%,0 50%)` + a small punched hole (radial gradient), on `--mustard`.
- **Coupon:** `border: 2px dashed var(--ink-soft)` with a `✂` glyph (inside a `<span aria-hidden="true">`) sitting on the border.
- **Stitched label:** an inner dashed line via `::before { inset: 6px; border: 1px dashed; border-radius: inherit }`.
- **Rubber stamp** (TODO badges): uppercase, `--oxblood` border and text, `rotate(-4deg)`, transparent background, `font-family: var(--font-display)`.

### Global type and layout
- `main { max-width: 68rem; margin: 0 auto; padding: 2rem clamp(1rem, 4vw, 2.5rem) 4rem; }`
- Body `font-size: 1rem; line-height: 1.6`. Headings use `--font-display` with tight leading (1.0–1.1) and weight 700–900.
- Section heads: script kicker (`p.kicker`) above a large uppercase-tracked Didone `h2`, then a double rule. `h2` keeps its existing text (Education, Experience, Skills, Projects).
- Breakpoints: `40rem` (two columns of copy, justified text) and `60rem` (header two-column, plate grid with side figure).
- Body copy uses `text-align: justify; hyphens: auto;` **only from 40rem up**. Below that it stays `left` to avoid rivers.
- `[hidden] { display: none !important; }`. **This is required.** Plates get `display: grid`, which would otherwise override `hidden`.
- Long strings must wrap at 375px: `overflow-wrap: anywhere` on `.links a`, project `h3 a`, and ticket text.

---

## Changes

### 1. `site/index.html`

Keep `lang="en"`, the existing meta tags, the favicon and the canonical link. Add the font links above, then `<link rel="stylesheet" href="styles.css">`, then `<script src="app.js" defer></script>` (no `type` attribute). Optionally add two `<meta name="theme-color">` tags with `media="(prefers-color-scheme: light|dark)"` and the paper colors.

**Content rule:** Every existing piece of text must stay present and unchanged: titles, `meta` lines, every `<li>` bullet, skills, education, project names and links, the `TODO` texts, all `span.badge` elements, and every `<!-- TODO … -->` comment (each still directly above its article). New text may only be decorative ad copy (kickers, taglines, labels) and must not state any fact absent from the existing content. No numbers, employers, awards or claims beyond what's there. No real brand names or logos. No phone number. Keep the `entry` and `todo` classes where they are now and add new classes alongside them.

#### 1a. SVG sprite (first child of `<body>`)
```html
<svg class="sprite" aria-hidden="true">
  <symbol id="fig-hanger" viewBox="0 0 120 140">…</symbol>
  <symbol id="fig-shirt"  viewBox="0 0 120 140">…</symbol>
  <symbol id="fig-tie"    viewBox="0 0 120 140">…</symbol>
  <symbol id="fig-jacket" viewBox="0 0 120 140">…</symbol>
  <symbol id="fig-square" viewBox="0 0 120 140">…</symbol>
  <symbol id="fig-hat"    viewBox="0 0 120 140">…</symbol>
  <symbol id="fig-bag"    viewBox="0 0 120 140">…</symbol>
</svg>
```
- CSS: `.sprite { position: absolute; width: 0; height: 0; overflow: hidden; }`. Don't use `display:none`/`hidden`, so references always render.
- All symbols share one 120×140 coordinate box so layers stack. Keep each one to a handful of simple paths. Use flat, tasteful silhouettes, not detailed illustration. Paths use `fill="currentColor"` (or `fill="none"` for line-only details) and **no stroke attribute**, so stroke comes from CSS on the `<use>`. Rough geometry:
  - hanger: a hook at the top centre (≈ x60, y4–18) and a triangle shoulder bar from (14,38) to (106,38).
  - shirt: a torso with set-in sleeves, from the shoulders at y≈34 to the hem at y≈132, plus a pointed collar V meeting at (60,48) and a placket line.
  - tie: a narrow knot at (60,46) and a blade widening to ≈12px, ending in a point at y≈108.
  - jacket: two front panels with notched lapels opening in a V down to y≈84 (so the shirt and tie show), sleeves, and a single button.
  - square: a small 3-point pocket square at the left breast (≈ x38–48, y70).
  - hat: a fedora (pinched crown + brim) hung on the hook, top right (≈ x70–112, y2–22).
  - bag: a garment bag (rounded rect from the hanger down), a dashed zipper line, and a small hanging tag.
- Total sprite markup should be ≈ 2–3KB.
- Usage, layered per plate:
  ```html
  <svg class="fig" viewBox="0 0 120 140" aria-hidden="true">
    <use href="#fig-hanger" class="ink"></use>
    <use href="#fig-shirt" class="ink-paper"></use>
    <use href="#fig-tie" class="ink-oxblood"></use>
  </svg>
  ```
  The classes set `color` (the fill). `.fig use { stroke: var(--ink); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }`. Stroke inherits into the `<use>` shadow tree because the paths set none. Suggested fills: shirt `--paper-2`, tie `--oxblood`, jacket `--navy` (light) / `--tan` (dark), square `--mustard`, hat `--olive`, bag `--tan` with cross-hatch.
- Outfit per plate (B's progression):

  | Plate | Layers |
  |---|---|
  | Next season (TODO) | hanger, bag |
  | No. 1 Senior Software Engineer | hanger, shirt, tie, jacket, square, hat |
  | No. 2 Software Engineer | hanger, shirt, tie, jacket, square |
  | No. 3 Associate Software Engineer | hanger, shirt, tie, jacket |
  | No. 4 Associate Software Development Engineer | hanger, shirt, tie |
  | No. 5 Software Engineering Intern | hanger, shirt |

  Write `<use>` with explicit closing tags (`<use …></use>`). If html-validate objects to anything inside the SVG, fix the reported element rather than dropping the figure.

#### 1b. Header (stays first, inside `<main>`)
```html
<header class="masthead">
  <div class="masthead-copy">
    <p class="edition"><span class="edition-day">Morning Edition</span><span class="edition-night">Night Edition</span></p>
    <p class="kicker">Presenting</p>
    <h1>Roan Urquhart</h1>
    <p class="meta">Raleigh, NC</p>
    <p class="headline-dek">The Engineer Who Ships.</p>
    <p class="intro">Roan Urquhart is a software engineer in Raleigh, NC.</p>
    <div class="coupon">
      <p class="coupon-label"><span aria-hidden="true">✂</span> Correspondence</p>
      <ul class="links"> …the three existing <li>s, unchanged… </ul>
    </div>
  </div>
  <svg class="fig fig-hero" viewBox="0 0 120 140" aria-hidden="true"> hanger, shirt, tie, jacket, square, hat </svg>
</header>
```
- Exactly one of `.edition-day`/`.edition-night` shows, toggled with `display:none` in the colour-scheme media query (so it's also hidden from screen readers).
- `h1`: `font-size: clamp(2.75rem, 11vw, 6rem)`, weight 900, tight tracking. `.kicker` uses the script font, in `--oxblood`, `rotate(-3deg)`. `.headline-dek` uses italic Bodoni at about 1.6rem.
- From 60rem, `.masthead` is a 2-column grid (copy | figure, figure ≈ 16rem wide on a halftone circle). Below that, the figure sits top-right at about 7rem wide (or below the copy) and must not push the width past 375px.
- Bottom border: a thick + thin double rule, like a magazine page head.

#### 1c. Education (second)
Keep the section and article. Add `<p class="kicker">Where the Cloth Was Cut</p>` before the h2 and the class `label` on the article (`class="entry label"`). Style it as a stitched sewn-in label: `--paper-2` background, rounded corners, an inner dashed stitch line, the school name in Bodoni small caps, and degree and dates in body serif. Keep the max width at ≈ 34rem.

#### 1d. Experience (third): the catalog
Structure (keep `id="experience"` and `aria-labelledby="experience-heading"`, and add `class="catalog"`):
```html
<section id="experience" class="catalog" aria-labelledby="experience-heading">
  <p class="kicker">The Season’s Catalog</p>
  <h2 id="experience-heading">Experience</h2>
  <p class="dek">Every role, newest first, each on its own plate.</p>

  <nav class="plate-index" aria-label="Experience plates">
    <ol>
      <!-- TODO: update this ticket when the 2024 to present role is filled in -->
      <li><a class="plate-link" href="#role-next-season">
        <span class="ticket-no">Next Season</span>
        <svg class="fig fig-ticket" viewBox="0 0 120 140" aria-hidden="true">…hanger, bag…</svg>
        <span class="ticket-role">Coming next season</span>
        <span class="ticket-tag">2024 – present</span>
      </a></li>
      <li><a class="plate-link" href="#role-senior-swe">
        <span class="ticket-no">No. 1</span> <svg …>…</svg>
        <span class="ticket-role">Senior Software Engineer</span>
        <span class="ticket-tag">Corvus Insurance · 2024</span>
      </a></li>
      … No. 2 Software Engineer (Corvus Insurance · 2022–2024),
        No. 3 Associate Software Engineer (Corvus Insurance · 2021–2022),
        No. 4 Associate Software Development Engineer (SentryOne · 2020–2021),
        No. 5 Software Engineering Intern (SentryOne · 2019)
    </ol>
  </nav>
  <p class="catalog-hint">Select a plate to see its advertisement.</p>

  <div class="plates">
    …the six articles…
  </div>
</section>
```
- Ticket years come straight from the existing dates. Use an en dash `–`.
- Only spans and an `svg` go inside `<a>`. No block elements.

Each article becomes a plate. Example (Senior):
```html
<article class="entry plate" id="role-senior-swe">
  <p class="plate-no">Plate No. 1</p>
  <p class="tagline">Built to Lead.</p>
  <h3>Senior Software Engineer</h3>
  <p class="meta"><span class="maker">Corvus Insurance</span> <span class="sep">·</span> <span class="tag">January 2024 – September 2024</span></p>
  <svg class="fig fig-plate" viewBox="0 0 120 140" aria-hidden="true">…</svg>
  <ul>…the existing <li>s, unchanged…</ul>
</article>
```
- Wrapping the maker and dates in spans keeps the meta text identical ("Corvus Insurance · January 2024 – September 2024").
- **Exactly one space** on each side of the `·`, as now.

Ids, plate numbers and taglines (taglines are ad copy, each traceable to existing content):

| id | plate-no | tagline | source |
|---|---|---|---|
| `role-next-season` (TODO article) | Next Season | Coming Next Season. | placeholder |
| `role-senior-swe` | Plate No. 1 | Built to Lead. | "Built and led an engineering team" |
| `role-swe` | Plate No. 2 | Made to Go Worldwide. | "enabled Corvus to write insurance worldwide" |
| `role-associate-swe` | Plate No. 3 | Cut in Elixir. Finished in Elm. | "Elixir and Elm" |
| `role-associate-sde` | Plate No. 4 | Pressed in C#, Go and Terraform. | C# / Go / Terraform bullets |
| `role-intern` | Plate No. 5 | The Summer of ’19. | "Summer 2019" |

The TODO article keeps `class="entry todo"` and adds `plate plate--next-season`. Its `<!-- TODO … -->` comment stays directly above it, and its h3 (with the badge), "TODO: company" and "TODO: fill in" stay unchanged. Its `p.meta` has no maker/date split; leave it as is.

Plate styling (applies with and without JS):
- Frame: double-rule rounded border on `--paper-2`, a halftone wash in the top-right corner (`::before`), and generous padding (`clamp(1rem, 3vw, 2.25rem)`). Plates are stacked with 2rem gaps (no-JS view).
- Grid from 60rem: `grid-template-columns: 14rem 1fr`. `plate-no`, `tagline`, `h3` and `meta` span both columns at the top, the figure sits in column 1, and the `ul` in column 2. Below 60rem, one column: the figure at about 8rem, floated right or centred, above the copy.
- `.plate-no`: small caps, tracked 0.15em, `--oxblood`, with a thin rule after it.
- `.tagline`: Bodoni 900 at `clamp(2rem, 6.5vw, 4.25rem)`, line-height 1, `text-wrap: balance`.
- `h3` is the "product": Bodoni italic at 1.4–1.6rem, `--navy`.
- `.maker` is a stitched-label chip. `.tag` is the mustard price tag with `--on-mustard` text. `.sep` is hidden visually but keeps its place (`.sep { opacity: 0 }` or a tiny width), or just shows the dot. The text must stay readable as one sentence.
- `ul` as body copy: `columns: 2 17rem; column-gap: 2rem; column-rule: 1px solid var(--ink-soft)`, `li { break-inside: avoid; }`, small serif (0.95rem). Keep list semantics: **don't** set `list-style: none` (and don't add `role="list"`; the validator flags it as redundant). Use `list-style-type: square` with `li::marker { color: var(--oxblood); }`.
- Drop cap: `.plate li:first-child::first-letter { float: left; font-family: var(--font-display); font-weight: 900; font-size: 3.4em; line-height: .8; padding: .05em .08em 0 0; color: var(--oxblood); }`.
- Sign-off logotype in the bottom-right corner via `::after { content: "R·U"; }` in Bodoni italic inside a thin circle. This is decorative CSS content only.
- `.plate:target` (the no-JS jump) gets a brief mustard outline/box-shadow highlight.
- `.plate--next-season`: dashed coupon border instead of the double rule, cross-hatch wash, and a rotated mustard band across one corner reading "Coming Next Season" (CSS `::after` content, decorative). The tagline and TODO badge show as normal.

Ticket index styling:
- `.plate-index ol`: `list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr)); gap: .75rem;`. That gives 6 across at full width (reading left to right like a rail) and 2 across at 375px. Removing list-style on this nav list is fine, because the `<nav>` label conveys the grouping.
- Each ticket (`.plate-link`, later `.plate-ticket`): block, ink border, rounded corners with side notches, `--paper-2` background, centred column of number (Bodoni, `--oxblood`), figure (`3.5rem` tall), role (0.9rem bold body serif), and tag (0.75rem, mustard price-tag chip). Use `color: var(--ink)` and no underline.
- Hover/focus: lifts `translateY(-3px) rotate(-.6deg)` with a soft paper shadow (motion only under `no-preference`).
- Selected (`[aria-expanded="true"]`): ink background and paper text (inverted print, figure strokes switch to paper), plus a small downward notch/arrow pointing at the plate.
- `.catalog-hint`: small italic `--ink-soft`.

Enhanced mode (`.catalog.is-enhanced`, class added by JS):
- `.plates` shows only the open plate (the rest get `hidden` from JS).
- Plates get `scroll-margin-top: 1rem`.
- `.plate-controls` (built by JS) sits at the plate foot: a row of three buttons styled as small tickets/labels. "‹ Previous plate", "Return to the catalog (Esc)" and "Next plate ›". It wraps on phones, and every button is at least 44px tall.

#### 1e. Skills (fourth)
Add `<p class="kicker">The Particulars</p>` before the h2. Keep the `dl` unchanged. Style it as a tailor's measurement card inside a rounded frame: from 40rem `grid-template-columns: 14rem 1fr`; each `dt` in Bodoni small caps with a dotted leader (`border-bottom: 1px dotted` on a flex filler or `background: radial-gradient` dots), and `dd` in body serif. One column on phones.

#### 1f. Projects (fifth)
Add `<p class="kicker">From the Workshop</p>` before the h2. Keep all three articles, comments, badges and links unchanged, and wrap them in `<div class="classifieds">`. Use a grid `repeat(auto-fit, minmax(15rem, 1fr))` with gap 1rem. Each article is a small classified ad: dashed coupon border (the existing `.todo` dashed look, restyled), project link in Bodoni with `overflow-wrap: anywhere`, and the TODO badge as a rubber stamp.

#### 1g. Footer sign-off (optional, after Projects, inside `<main>`)
`<footer class="colophon"><p class="signoff">Roan Urquhart</p><p>Raleigh, NC</p></footer>`: a centred script/Bodoni logotype between rules. It only repeats existing facts.

### 2. `site/app.js` (new, vanilla, ~120 lines, loaded with `defer`)
```js
(() => {
  const section = document.getElementById('experience');
  if (!section) return;
  const links = [...section.querySelectorAll('.plate-index a.plate-link')];
  const plates = [...section.querySelectorAll('.plates .plate')];
  if (!links.length || !plates.length) return;
  // …
})();
```
Behaviour:
1. **Enhance:** Add `is-enhanced` to the section. Replace each `a.plate-link` with a `<button type="button" class="plate-link plate-ticket">` that has the same inner nodes (move the child nodes, don't use innerHTML strings), `aria-expanded="false"`, `aria-controls="<plate id>"` (from the link's `href`), and `data-index`.
2. **Prepare plates:** On each plate, set `hidden`, give its `h3` `tabindex="-1"` (the focus target), and append a `div.plate-controls` with three `type="button"` buttons. Previous plate (hidden on the first plate), "Return to the catalog" (with `<kbd>Esc</kbd>` hint text inside) and Next plate (hidden on the last). Put arrow glyphs in `aria-hidden` spans so the names read "Previous plate" / "Next plate".
3. **`open(i, {direction = 'in', focus = true})`:**
   - If another plate is open, hide it.
   - Show plate `i`. Remove the animation classes, force a reflow (`void el.offsetWidth`), then add `plate-enter` plus `plate-enter--in|next|prev`.
   - Set `aria-expanded` on all tickets.
   - Add `has-open` to the section and store `current = i`.
   - If `focus`, call `plate.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' })` and then `h3.focus({ preventScroll: true })`.
   - `reduced` = `matchMedia('(prefers-reduced-motion: reduce)').matches`, read at call time.
4. **`close()`:** Hide the current plate, set every ticket to `aria-expanded="false"`, remove `has-open`, focus the ticket for the closed plate, and set `current = -1`.
5. **Events:**
   - Ticket click: if its plate is already open, `close()`, otherwise `open(i)`. Enter/Space work natively on buttons.
   - Prev/Next buttons: `open(current ∓ 1, {direction: 'prev'|'next'})`.
   - Return button: `close()`.
   - `keydown` on `document`: if `e.key === 'Escape'`, a plate is open, and `section.contains(document.activeElement)`, then `close()` and `preventDefault()`. Esc pressed elsewhere on the page does nothing, so focus is never yanked back from Projects.
6. **Deep link:** On load, if `location.hash` names a plate id, `open(index, {focus: false})` and scroll it into view. No history manipulation.
7. **Default state:** Every plate is closed and only the index shows.
8. No other globals, no dependencies, no `innerHTML` with content strings. It must not throw if markup is missing (the early returns above).

### 3. `site/styles.css` (rewrite)
Organise it as tokens → reset/base → type → layout → masthead → section heads → education label → catalog index → plates → next-season plate → enhanced mode and controls → skills → projects → badges/todo → focus → motion → dark theme → breakpoints. Keep it under ≈ 25KB. Specifics not covered above:
- **Focus:** `:focus-visible { outline: 3px solid var(--focus); outline-offset: 3px; border-radius: .3rem; }`. The programmatically focused `h3[tabindex="-1"]:focus:not(:focus-visible) { outline: none; }`. Tickets and controls must show a clearly visible focus ring in both themes.
- **Links:** `color: var(--link); text-decoration-thickness: 1px; text-underline-offset: .18em;`. Thicker on hover.
- **Motion** (only inside `@media (prefers-reduced-motion: no-preference)`). Paper, not UI flourish:
  - `@keyframes plate-slide` (open from the index): `from { opacity: 0; transform: translateY(1.25rem) rotate(-.8deg); box-shadow: 0 .2rem .4rem rgb(0 0 0 / .1); }` → none, 380ms `cubic-bezier(.2,.7,.2,1)`.
  - `@keyframes page-turn-next`: `from { opacity: 0; transform: perspective(1400px) rotateY(-9deg) translateX(1.25rem); transform-origin: left center; }` → none, 420ms. `page-turn-prev` mirrors it (origin right, `+9deg`, `-1.25rem`).
  - Ticket hover lift: `transition: transform .2s, box-shadow .2s`.
  - `html { scroll-behavior: smooth; }`.
  - Under `prefers-reduced-motion: reduce` there are no animations or transitions, and plates simply appear.
- **No overflow:** Rotated stamps and bands sit inside an `overflow: hidden` parent (the plate), or are small enough not to poke out. Don't hide page overflow globally; fix whatever causes it.
- **TODO badge** (`.badge`): rubber stamp as described, still visible text "TODO". Keep the `.todo` dashed treatment so placeholders still read as placeholders.

### 4. `site/favicon.svg` (small refresh)
Use a cream (`#f2e8d5`) rounded square, an oxblood (`#6e1f1f`) circle and a cream "RU" in `Georgia, serif` italic, so it matches the print palette. Keep it under 1KB.

### 5. `README.md`
Update "Where content lives":
- `site/app.js`: progressive enhancement for the Experience catalog. The page works fully without it.
- Each Experience role appears twice: as a ticket in `nav.plate-index` and as an `article.plate` (matched by `href="#id"` ↔ `id`). Edit both when a role changes, and the ticket number, garment layers and tagline go with them.
- The new TODO comment on the next-season ticket.

Leave the deploy and validate sections as they are.

---

## html-validate (`--preset standard`) pitfalls to avoid
- No `style=""` attributes and no `<style>` element. Everything goes in `styles.css`.
- Headings h1 → h2 → h3 only. Don't skip levels and don't add h4.
- One `<nav>`, with `aria-label`. Use `aria-label` only on landmarks and interactive elements, never on `span`/`p`/`div`/`svg`. Decorative SVGs get `aria-hidden="true"` only.
- No `role="list"` or other redundant roles.
- Escape `&` as `&amp;` (the font URL, and any "&" in copy).
- `<a>`/`<button>` contain only phrasing content (spans/svg).
- Don't put `type` on `<script>`. Use double-quoted attributes. Void elements stay unclosed, matching the existing `<meta …>` style.
- No `aria-controls`/`aria-labelledby` pointing at a missing id. Only JS adds `aria-controls`, so it isn't validated, but the ids must still exist.
- No trailing whitespace, and keep the `<title>` short.
- If `require-sri` fires on the Google Fonts stylesheet (SRI isn't possible: Google serves different CSS per user agent), add an inline directive directly above that `<link>`: `<!-- [html-validate-disable-next require-sri -- Google Fonts CSS varies by user agent, so SRI is not possible] -->`. Do the same for `crossorigin` on the preconnect only if flagged (otherwise try `crossorigin="anonymous"` first).

## Verification

1. **Validator:** `npx --yes html-validate@11.15.0 --preset standard site/` exits 0.
2. **JS syntax:** `node --check site/app.js` exits 0.
3. **Content preserved** (run from the repo root):
   - Every original bullet is still present:
     `git show HEAD:site/index.html | grep -oE '<li>[^<]+</li>' | while IFS= read -r l; do grep -qF -- "$l" site/index.html || echo "MISSING: $l"; done` prints nothing.
   - Every original TODO line is still present: `diff <(git show HEAD:site/index.html | grep TODO | sed 's/^ *//') <(grep TODO site/index.html | sed 's/^ *//')` shows only `>` additions (the new ticket comment), never `<` removals.
   - `grep -c 'class="badge"' site/index.html` is 4.
   - Section order: `grep -n '<section id=' site/index.html` gives `education`, `experience`, `skills`, `projects`, in that order, and `<header` appears before all of them.
   - No phone number: `grep -nE 'tel:|[0-9]{3}[-. )][0-9]{3}[-. ][0-9]{4}' site/` prints nothing.
   - Check by eye that every new tagline/kicker/label adds no fact that isn't already in the content.
4. **Weight:** `ls -l site/` shows no image over 50KB (no new image files at all). `styles.css` ≤ ~25KB, `app.js` ≤ ~8KB.
5. **Browser:** serve with `python3 -m http.server -d site 8000` and check at 1280px and at 375px, in both light and dark (devtools colour-scheme emulation):
   - Order is header, Education, Experience, Skills, Projects.
   - `document.documentElement.scrollWidth <= window.innerWidth` at 375px. No horizontal scroll.
   - The Experience index shows 6 tickets (2 per row at 375px). Clicking a ticket shows its plate with a paper-slide motion. Previous/Next turns between plates. "Return to the catalog" or Esc closes the plate and focus returns to its ticket. Clicking the open ticket again closes it.
   - Keyboard only: Tab reaches each ticket with a visible focus ring. Enter and Space open a plate and focus moves to its heading. Tab reaches Previous/Return/Next. Esc closes.
   - `aria-expanded` on tickets reflects the open plate.
   - With `prefers-reduced-motion: reduce` emulated, plates appear without animation.
   - Night edition: navy paper, cream ink, "Night Edition" shown in the masthead, and contrast still good.
   - The "next season" plate looks like a coming-attraction ad, with the TODO badge visible.
   - **JS disabled:** all 6 plates are visible, stacked in order, with every bullet. Ticket links jump to their plates. No controls show.
   - Load with `#role-intern` in the URL: the intern plate opens.
