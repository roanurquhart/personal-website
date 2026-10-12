# Plan: newspaper page with display ads you zoom into (c0de0016)

This plan reuses the plan from the earlier run (c0de0014), which stopped on an unrelated factory error. It's copied below with changes only where opening the reference image showed something that plan got wrong. Each change is marked **[ref change]** and listed here:

1. **Reference path.** The image is at `.sssf/reference/1950s_menswear_ads.png` in the worktree, not under `adw_data/reference/`.
2. **Caps wordmark weight.** HART SCHAFFNER & MARX is set in *light/regular*, widely letter-spaced serif capitals, not bold. Use weight 400–500 with about `0.14em` tracking, not 700 (§3.4).
3. **Scenes are vignettes, not full-bleed.** In most of the reference ads (Hart Schaffner & Marx ×2, Worsted-Tex, Pendleton, Sumrie) the painted scene sits behind and around the figure's upper body and **fades out into the off-white paper**. The copy and wordmark sit on plain paper. Scenes should be drawn in the upper and middle part of the art box and faded to paper with a mask. The `.ad-art` background is `--paper`, not the scene colour. Only the halftone ad keeps a dot-field background (§3.4, §3.5).
4. **The figure dominates.** In every reference ad the figure takes most of the ad's height (three-quarter or full length). Keep the art box at least ~60% of each mini ad's height. Don't let the copy squeeze it (§3.4).
5. **Small red maker's mark.** The Hart Schaffner & Marx ads have a small red emblem near the copy or wordmark. Add a small red square ornament as a CSS `::before` on the caps wordmark: decoration only, no text (§3.4).
6. **Caps wordmark may also sit at the top** (Worsted-Tex). No change is needed. The plan keeps caps at the bottom and script at the top, which matches HSM and Sumrie.

Everything else in the earlier plan matches the reference.

## Goal

Rework the 1950s menswear design in `site/` so that:

1. All wording on the page is Roan's own: names, titles, companies, dates, resume bullets, skills, plain section headings, and plain functional UI labels. No invented copy.
2. It is light only. Dark mode is gone.
3. The whole site reads as **one newspaper page** on off-white newsprint: a masthead nameplate, a thin dateline rule, and sections set in columns with thin column rules. Experience is a **spread of portrait display ads** (styled like the reference menswear ads, in miniature). **Selecting an ad zooms it** from its spot on the page to fill the view and shows the full copy. Previous/Next moves between ads. Close or Esc zooms back out to the same spot.

Stack stays the same: plain HTML, CSS and vanilla JS in `site/`. No build step, no dependencies, and the same three Google font families loaded the same way.

> **Reference image [ref change]:** `.sssf/reference/1950s_menswear_ads.png` (in the worktree root, kept out of git). The builder and UI tester **must open it**. What it shows: tall portrait ads, each dominated by one standing figure in a suit (often in a fedora) with a painted scene behind the upper body that fades into the paper; small justified serif body copy in a narrow column beside (Sumrie, Worsted-Tex) or below (Hart Schaffner & Marx) the figure; the maker's name as a wordmark, either light, widely spaced capital serif along the bottom (HART SCHAFFNER & MARX) or large brush script across the top (Sumrie, Sun Sets); thin rules and small-caps lists (the Sumrie shop list); muted painterly tan, camel, brown, navy, slate and ochre with small red accents (the HSM red emblem, red ties); some ads in black-and-white halftone (Sumrie, the "sell to make a dollar" ad); off-white paper.

## Files to touch

| File | Change |
|---|---|
| `site/index.html` | Rewrite markup: head meta, sprite (new figure and scene symbols, paint filter), masthead, Education, Experience ad spread, Skills, Projects. Remove the footer and the hero figure. |
| `site/styles.css` | Rewrite: light tokens only, newspaper page grid and rules, display ads, zoom viewer, view-transition CSS, reduced motion. Delete all dark, edition, kicker, ticket, plate and drop-cap rules. |
| `site/app.js` | Rewrite: the zoom viewer (`<dialog>`, View Transitions with fallback), Previous/Next, Close/Esc, focus, hash deep links, scroll lock. |
| `README.md` | Update "Where content lives" and the "Experience catalog" section to describe the new structure (see §7). |
| `site/favicon.svg` | No change. |

---

## 1. Wording rules (apply everywhere)

**Delete:** "Morning Edition", "Night Edition", "Presenting", "The Engineer Who Ships.", "Correspondence" (and the ✂ coupon), "Where the Cloth Was Cut", "The Season’s Catalog", "Every role, newest first, each on its own plate.", "The Particulars", "From the Workshop", "Coming Next Season" / "Coming next season" / "Next Season", every `.tagline` ("Built to Lead.", "Made to Go Worldwide.", "Cut in Elixir. Finished in Elm.", "Pressed in C#, Go and Terraform.", "The Summer of ’19."), every "Plate No. N" and "No. N", the intro "Roan Urquhart is a software engineer in Raleigh, NC.", the "R·U" `::after` logotype, and the `.plate--next-season::after` banner text.

**Under the name:** only `Raleigh, NC` plus the three links (email, GitHub, LinkedIn), each shown once. Remove the footer (`footer.colophon`) entirely. It repeated the name and "Raleigh, NC". The page ends with a closing rule (§3.0).

**Section headings:** exactly `Education`, `Experience`, `Skills`, `Projects`.

**Ads:** job title = `h3` headline. Company = wordmark. Dates = small type. Bullets = body copy, **word for word**, including the existing quirks: no final period on the first Senior bullet and the "Implemented REST APIs in Go…" bullet, "GMail", "Typescript React", "many of which", "two functional programming languages; Elixir and Elm." **Move the existing `<li>` lines; do not retype them.**

**UI labels (JS-created):** `Previous`, `Next`, `Close` (with an `Esc` `<kbd>`), and a hint `Select an ad to read more.` Nothing else. (`Back to page` is allowed but not needed.)

**Placeholder role:** keep the h3 text `TODO: 2024 – present`, its `<span class="badge">TODO</span>`, `TODO: company`, the bullet `TODO: fill in`, and a `<!-- TODO … -->` comment beside it. Style it as a blank "space reserved" ad. Add no "space reserved" text.

**Project stubs:** unchanged text, badges and comments.

**Banned-word grep must pass**, which forces some renames:
- The id `role-next-season` contains "season". Rename it to **`role-2024-present`**. Rename the class `plate--next-season` too (§3.4).
- Don't write "season", "edition", "plate no", "ships", "workshop" etc. in `app.js` comments or in HTML comments. Rewrite the HTML comments, e.g. `<!-- TODO: placeholder for the 2024 to present role; replace title, company, and bullets -->` (already fine). The old nav-ticket comment (`<!-- TODO: update this ticket … -->`) goes away with the nav.

## 2. Light only

- `<meta name="color-scheme" content="light">`
- One `<meta name="theme-color" content="#f4efe3">` (the paper colour), with no `media` attribute. Delete the dark theme-color meta.
- `<meta name="description" content="Roan Urquhart: education, experience, skills and projects.">` (no third-person bio sentence).
- CSS: `:root { color-scheme: light; … }`. Delete both `@media (prefers-color-scheme: dark)` blocks and all `.edition*` rules. `grep -n "prefers-color-scheme" site/styles.css` must return nothing.

### Palette (CSS custom properties, light only)

Newsprint plus the reference's painterly tones. Suggested values; tune by eye, but keep text contrast at or above 4.5:1 on `--paper`:

```
--paper: #f4efe3;      /* off-white newsprint */
--paper-2: #ebe3d1;    /* ad stock / tint */
--ink: #1e1b17;
--ink-soft: #4a4339;   /* secondary text, ~8:1 on paper */
--rule: #1e1b17;
--camel: #b98a56;
--tan: #d2b48a;
--brown: #6b4a2e;
--navy: #2b3a55;
--slate: #6d7883;
--ochre: #c4902c;
--red: #a3302a;        /* small accents, focus ring, badges */
--skin: #e6cfae;       /* figure head/hands, muted */
--dot: rgb(30 27 23 / 0.18);  /* halftone dots */
```

Keep the existing faint paper-grain SVG noise on `body`. Keep the font variables exactly as they are now (`--font-display` Bodoni Moda, `--font-body` Libre Caslon Text, `--font-script` Yellowtail), and keep the Google Fonts `<link>` tags unchanged.

---

## 3. Page structure and layout

### 3.0 Overall DOM order (must stay)

```html
<body>
  <svg class="sprite" aria-hidden="true">…symbols + filter…</svg>
  <main class="page">
    <header class="masthead">…</header>
    <section id="education" …>…</section>
    <section id="experience" …>…</section>
    <section id="skills" …>…</section>
    <section id="projects" …>…</section>
  </main>
</body>
```

Breakpoints: **phone < 40rem** (one column), **tablet 40–64rem**, **desktop ≥ 64rem**. `main.page`: `max-width: 78rem; margin: 0 auto; padding: 1.5rem clamp(1rem, 3vw, 2rem) 3rem;`. Add `html { scrollbar-gutter: stable; }`. At desktop, `main.page` is a 12-column grid (`column-gap: 2rem`). Sections are grid items:
- masthead, `#education`, `#experience`: `grid-column: 1 / -1`
- `#skills`: `grid-column: span 4`; `#projects`: `grid-column: span 8`, with a **thin vertical column rule** between them (e.g. `#projects { border-left: 1px solid var(--rule); padding-left: 2rem; margin-left: -1rem }`). Skills is on the left and Projects on the right, top-aligned, so reading order is still Skills then Projects.
- Below desktop, everything stacks in DOM order and column rules become horizontal rules.

The page ends with a closing rule (`main.page` `border-bottom: 4px double var(--rule)` or a final `::after`).

### 3.1 Masthead (nameplate + dateline)

```html
<header class="masthead">
  <h1 class="nameplate">Roan Urquhart</h1>
  <div class="dateline">
    <p class="dateline-place">Raleigh, NC</p>
    <ul class="links">
      <li><a href="mailto:roanurquhart@gmail.com">roanurquhart@gmail.com</a></li>
      <li><a href="https://github.com/roanurquhart" rel="noopener noreferrer">GitHub</a></li>
      <li><a href="https://www.linkedin.com/in/roan-urquhart/" rel="noopener noreferrer">LinkedIn</a></li>
    </ul>
  </div>
</header>
```

(Check the existing hrefs in the current `index.html` and keep them exactly as they are. The ones above are illustrative.)

- Nameplate: thick rule above (`border-top: 3px solid var(--rule)`), centred, Bodoni Moda weight 900, `font-size: clamp(2.6rem, 11vw, 7.5rem)`, `line-height: 1`, slight negative tracking. `overflow-wrap: anywhere` so 375px never overflows.
- Dateline: thin rules above and below (`border-block: 1px solid var(--rule)`), small type (`0.85rem`), small caps or letter-spaced for "Raleigh, NC". Flex `space-between` at ≥40rem (place left, links right, separated by thin vertical rules or `·`). Centred and wrapped on phone.
- No figure in the masthead. Delete `.fig-hero` from the HTML and CSS.

### 3.2 Section headings ("section flags")

Each `h2` is a plain heading styled like a newspaper section flag: Bodoni, uppercase, letter-spaced, `font-size: clamp(1.3rem, 3vw, 1.75rem)`, with `border-top: 3px solid var(--rule)` and `border-bottom: 1px solid var(--rule)`, small padding. Sections get about `margin-top: 2rem`. Delete the `.kicker` and `.dek` classes, CSS and markup.

### 3.3 Education: a one-row news brief (no half-empty box)

```html
<section id="education" aria-labelledby="education-heading">
  <h2 id="education-heading">Education</h2>
  <article class="brief">
    <h3>The University of North Carolina at Chapel Hill</h3>
    <p class="meta">Bachelors Degree in Computer Science</p>
    <p class="meta">August 2016 – May 2020</p>
  </article>
</section>
```

(Use the existing degree and date strings from the current file, verbatim.)

At ≥40rem `.brief` is a 3-column grid (`minmax(0,1.6fr) minmax(0,1.3fr) minmax(0,1fr)`, `column-gap: 2rem`) with **thin vertical column rules** between cells (`border-left: 1px solid var(--rule); padding-left: 1rem` on the 2nd and 3rd children), items baseline-aligned. On phone it stacks. No background box, no dashed label, no `max-width` that leaves empty space. Delete the `.label` CSS.

### 3.4 Experience: the display-ad spread

```html
<section id="experience" aria-labelledby="experience-heading">
  <h2 id="experience-heading">Experience</h2>
  <p class="ads-hint" hidden>Select an ad to read more.</p>   <!-- app.js removes hidden -->
  <div class="ads">
    <!-- TODO: placeholder for the 2024 to present role; replace title, company, and bullets -->
    <article class="ad ad--reserved todo" id="role-2024-present" aria-labelledby="role-2024-present-title">…</article>
    <article class="ad ad--lg"  id="role-senior-swe"     aria-labelledby="role-senior-swe-title">…</article>
    <article class="ad ad--md"  id="role-swe"            aria-labelledby="role-swe-title">…</article>
    <article class="ad ad--sm"  id="role-associate-swe"  aria-labelledby="role-associate-swe-title">…</article>
    <article class="ad ad--sm"  id="role-associate-sde"  aria-labelledby="role-associate-sde-title">…</article>
    <article class="ad ad--sm ad--halftone" id="role-intern" aria-labelledby="role-intern-title">…</article>
  </div>
</section>
```

Delete the whole `nav.plate-index` ticket list and the `.plates` wrapper. Each role now appears **once**. Keep the ids `role-senior-swe`, `role-swe`, `role-associate-swe`, `role-associate-sde`, `role-intern` for deep links. DOM order is newest first, as now.

**One ad's markup** (Corvus = caps wordmark along the bottom):

```html
<article class="ad ad--lg" id="role-senior-swe" aria-labelledby="role-senior-swe-title">
  <svg class="ad-art" viewBox="0 -14 120 234" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <use href="#scene-city" class="scene"></use>
    <g class="figure" filter="url(#paint)">
      <use href="#fig-trousers" class="ink-brown"></use>
      <use href="#fig-shoes" class="ink"></use>
      <use href="#fig-head" class="ink-skin"></use>
      <use href="#fig-shirt" class="ink-paper"></use>
      <use href="#fig-tie" class="ink-red"></use>
      <use href="#fig-jacket" class="ink-camel"></use>
      <use href="#fig-square" class="ink-ochre"></use>
      <use href="#fig-hat" class="ink-brown"></use>
    </g>
  </svg>
  <div class="ad-text">
    <h3 id="role-senior-swe-title">Senior Software Engineer</h3>
    <p class="ad-dates">January 2024 – September 2024</p>
    <ul class="ad-copy">
      <li>…existing bullets, verbatim…</li>
    </ul>
    <p class="wordmark wordmark--caps">Corvus Insurance</p>
  </div>
</article>
```

SentryOne ads use a **script wordmark across the top**, like Sumrie. Put `<p class="wordmark wordmark--script">SentryOne</p>` as the **first** child of `.ad-text` (DOM order matches visual order, so don't use CSS `order`). Placeholder: `<p class="wordmark wordmark--caps">TODO: company</p>`.

Per-role content (dates are the existing strings; copy them from the current file):

| id | classes | h3 | dates | wordmark | figure layers | scene |
|---|---|---|---|---|---|---|
| role-2024-present | `ad--reserved todo` | `TODO: 2024 – present` + badge | (none, the h3 holds it) | caps `TODO: company` | `fig-hanger` (ink) + `fig-bag` (tan), no head or trousers | `scene-blank` (diagonal hatch) |
| role-senior-swe | `ad--lg` | Senior Software Engineer | January 2024 – September 2024 | caps Corvus Insurance | head, trousers, shoes, shirt, tie, jacket, square, hat | `scene-city` |
| role-swe | `ad--md` | Software Engineer | January 2022 – January 2024 | caps Corvus Insurance | head, trousers, shoes, shirt, tie, jacket, square | `scene-harbour` |
| role-associate-swe | `ad--sm` | Associate Software Engineer | October 2021 – January 2022 | caps Corvus Insurance | head, trousers, shoes, shirt, tie, jacket | `scene-window` |
| role-associate-sde | `ad--sm` | Associate Software Development Engineer | June 2020 – October 2021 | script SentryOne | head, trousers, shoes, shirt, tie | `scene-park` |
| role-intern | `ad--sm ad--halftone` | Software Engineering Intern | Summer 2019 | script SentryOne | head, trousers, shoes, shirt | `scene-park` or `scene-window` |

This keeps the current "more experience, more garments" progression. Suggested garment colours (painterly, muted, as in the reference): senior camel jacket, brown trousers and hat, red tie, ochre square (like the HSM camel suit); SWE navy jacket and trousers, red tie, ochre square (like the HSM navy suit); associate SWE slate jacket and trousers, navy tie (like Worsted-Tex); associate SDE shirt and brown trousers, red tie; intern rendered in greys and halftone (see below).

#### Ad grid (rows line up in height)

`.ads { display: grid; gap: 1.25rem; align-items: stretch; }`
- **Desktop ≥64rem**, 12 columns: reserved `span 3`, lg `span 5`, md `span 4` (row 1 = 12); sm `span 4` ×3 (row 2 = 12).
- **Tablet 40–64rem**, 6 columns: reserved `span 2`, lg `span 4` (row 1); md `span 3`, sm `span 3` (row 2); sm `span 3` ×2 (row 3).
- **Phone**: 1 column.

No holes, and every row is full, so grid stretch gives equal heights. Inside each ad: `.ad { display: flex; flex-direction: column; height: 100%; position: relative; container-type: inline-size; }`. `.ad-art { flex: 1 1 auto; width: 100%; min-height: 12rem; }` so the art absorbs the extra height. **[ref change]** The `.ad-art` background is `transparent`/`--paper` (the scene is a vignette that fades into paper, see §3.5), so stretched space reads as the paper of the ad, not as a coloured block. The figure stays anchored to the bottom (`xMidYMax meet`). **[ref change]** The figure should dominate as in the reference: at desktop the art should be about 60% or more of each mini ad's height. If the copy in a mini ad pushes the art below that, tighten the in-page copy clamp (below) rather than shrinking the figure. The caps wordmark sits last with `margin-top: auto` so it lines up at the bottom of every ad in a row. Row 1 ads are taller than row 2 because of the larger spans (recency = more space). Cap the art height on phone (`max-height: 20rem`) so a single ad isn't a full screen tall.

**Large ad (`ad--lg`) at ≥40rem**, like Sumrie and Worsted-Tex with copy beside the figure: the ad becomes `display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr)`, with the art on the left and a narrow column on the right (headline, dates, small justified copy). The caps wordmark spans the full width along the bottom (`grid-column: 1 / -1`). Using `display: contents` on `.ad-text`, or a subgrid, lets the wordmark take the full row. Pick whichever validates and renders cleanly. md and sm ads are portrait like HSM: art on top, then headline, dates, copy and wordmark below.

#### Ad look: newspaper display ads, not UI cards

- Frame: `border: 1px solid var(--ink)` plus an inner hairline (`box-shadow: inset 0 0 0 3px var(--paper), inset 0 0 0 4px var(--ink)` or an `outline`), `background: var(--paper)`. **No border-radius, no drop shadows, no hover lift.** Inner padding about 0.75rem.
- **Headline** `h3`: Bodoni, weight 700 to 800, `font-size: clamp(1rem, 7cqi, 2rem)` using container query units so it scales with ad width, tight leading, `text-wrap: balance`.
- **Dates** `.ad-dates`: `0.72rem`, small caps or letter-spaced uppercase, `--ink-soft`, between thin rules (like the Sumrie small-caps list).
- **Copy** `.ad-copy`: Libre Caslon, `0.75rem` at mini size, `line-height: 1.4`, `text-align: justify; hyphens: auto`. Bullets: `list-style: square` with `::marker { color: var(--red) }` and a small `padding-left`. **No drop cap anywhere** (delete the `li:first-child::first-letter` rule).
- **Caps wordmark** `.wordmark--caps` **[ref change]**: Bodoni, uppercase via CSS (`text-transform: uppercase`, so the source text stays "Corvus Insurance"), **weight 400–500** (the HSM wordmark is light, not bold), `letter-spacing: 0.14em`, `font-size: clamp(0.9rem, 8cqi, 2.6rem)`, centred, with a thin `border-top: 1px solid` rule above, like HART SCHAFFNER & MARX. **[ref change]** A small red maker's-mark ornament before it: `::before { content: ""; display: inline-block; width: .55em; height: .55em; background: var(--red); margin-right: .5em; vertical-align: .1em; }`. Decoration only, no text, and skip it on the reserved ad.
- **Script wordmark** `.wordmark--script`: Yellowtail, `font-size: clamp(1.6rem, 14cqi, 3.5rem)`, `--ink` or `--navy` (Sumrie's script is near-black), centred or left across the top, a slight negative margin over the art if it looks good.
- **Reserved ad** (`.ad--reserved`): override `.todo`'s generic padding. Dashed 1px frame, a diagonal hatch background (`repeating-linear-gradient(45deg, var(--dot) 0 1px, transparent 1px 7px)`), faint hanger and garment-bag art (`opacity: .55`). It reads as blank space held for an ad.
- **Halftone ad** (`.ad--halftone`), like the B&W Sumrie ad: figure inks in greys (override `color` on its `use`s to `#3a3a3a/#8a8a8a/#cfcfcf` style values), with the scene drawn as a halftone dot field (`radial-gradient(circle, var(--dot) 1px, transparent 1.5px) 0 0 / 5px 5px` as the `.ad-art` background, masked to fade out toward the bottom like the other vignettes), and `filter: grayscale(1)` on the art.
- **With JS (`#experience.is-enhanced`)**: in-page `.ad-copy` is clamped like fine print you'd lean in to read: `max-height: 6.5em` (lg about `14em`), `overflow: hidden`, `mask-image: linear-gradient(#000 55%, transparent)`. **Without JS, nothing is clamped**: the full copy shows at a readable size (`font-size: 0.9rem`). So scope the clamp and the smaller font to `.is-enhanced`.
- `.ad:target` (JS-off deep link): `outline: 3px solid var(--red); outline-offset: 4px`. `scroll-margin-top: 1rem`.
- Cursor: `cursor: zoom-in` on the enhanced ad.
- Focus: the stretched button gets `outline: none` and the ad shows `.ad:has(.ad-open:focus-visible) { outline: 3px solid var(--red); outline-offset: 3px; }`.

### 3.5 SVG sprite: garment figures, painterly

Keep `fig-shirt`, `fig-tie`, `fig-jacket`, `fig-square`, `fig-hanger`, `fig-bag` geometry (currently viewBox `0 0 120 140`). Change the **`fig-hat`** geometry so it sits on the head (a fedora, as in the HSM, Worsted-Tex and Eagle ads) rather than on the hanger, and add new symbols. Every new symbol, and every ad's `<svg class="ad-art">`, uses **`viewBox="0 -14 120 234"`**. Give the existing garment symbols that same viewBox too (their coordinates are unchanged, they just live in the taller box) so the `<use>` layers line up. Starting geometry (tune by eye):

- `fig-head`: neck `M55 22H65V36H55Z`; head ellipse `cx=60 cy=14 rx=10.5 ry=13`. Faceless, fashion-illustration style. (The reference figures have faces. Don't draw them: no copied ad art.)
- `fig-hat` (replace): brim `M38 4Q60 -2 82 4Q60 9 38 4Z`; crown `M46 3Q46 -13 60 -13Q74 -13 74 3Z`; a thin band in a darker tone is optional.
- `fig-trousers`: `M34 128H86L83 206H65L60 146L55 206H37Z`
- `fig-shoes`: `M37 206H57V213H31Q31 207 37 206Z` and `M63 206H83Q89 207 89 213H63Z`
- Scenes **[ref change]**: vignettes, not full-bleed. Draw each scene mostly in the upper two-thirds of the `0 -14 120 234` box, behind the figure's head and shoulders, muted, with no outlines or only a light `--ink-soft` hairline. Fade it to paper toward the bottom and sides, either with an SVG `<mask id="vignette">` (a radial or linear gradient, white centre to black edges) applied on the `<use class="scene">` (`mask="url(#vignette)"`), or with a CSS `mask-image` on `.scene`. Below the figure's waist the background should be plain paper, as in the HSM ads.
  - `scene-city`: ochre or tan sky wash, slate skyline silhouette, an optional tiny plane shape (HSM airport ad).
  - `scene-harbour`: pale slate sky, navy water band, a small sail triangle, a horizon line.
  - `scene-window`: camel wall patch, a tall paned window in paper colour with a thin frame (like the Eagle window ad).
  - `scene-park`: pale sky, a slim lamppost and low hedge or tree in brown/olive (like the Hepworths street scene), tan ground fading out.
  - `scene-blank`: an empty, fully transparent symbol (the reserved ad shows the hatch through CSS). It can be omitted if the reserved ad just leaves out the scene `<use>`.
- Painterly treatment: add a `<filter id="paint" x="-5%" y="-5%" width="110%" height="110%">` to the sprite with `feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"` feeding `feDisplacementMap scale="2.5"`. Apply it as `filter="url(#paint)"` on the `<g class="figure">` (and optionally the scene) for slightly brushy edges. Strokes: soften from heavy black to `stroke: var(--ink-soft); stroke-width: 1.25`. Optionally add a `<linearGradient id="shade">` (transparent to `rgb(0 0 0 / .18)`) used by a second `<use>` of the jacket/trousers with `class="shade"` (`fill: url(#shade)`) for a little painted volume.
- The sprite stays `position:absolute; width:0; height:0; overflow:hidden` (**not** `display:none`, or the filter, mask and gradient stop working).
- New colour helper classes: `.ink-camel .ink-brown .ink-navy .ink-slate .ink-ochre .ink-red .ink-skin .ink-tan .ink-paper .ink`. Delete `.ink-oxblood`, `.ink-mustard`, `.ink-olive` and `.ink-jacket` if no longer used.

### 3.6 Skills

Same words, plain heading, with pairs grouped (a `div` inside `dl` is valid HTML):

```html
<dl class="skills">
  <div><dt>Programming Languages</dt><dd>Elixir, Elm, C#, Golang</dd></div>
  <div><dt>Database Technologies</dt><dd>Postgres, SQL Server</dd></div>
  <div><dt>Development Tools</dt><dd>AWS Console, Open Search, GitHub, Visual Studio</dd></div>
</dl>
```

(Copy the exact `dt`/`dd` strings from the current file.)

Style it as a newspaper listing: `dt` in Bodoni small caps, `dd` in the body serif, thin rules between groups (`border-top: 1px solid var(--rule)`). No double-border rounded card. On tablet (40–64rem, full width), the three groups can sit in 3 columns with vertical column rules. On desktop it's the narrow left column (stacked). If `html-validate` rejects `div` in `dl`, fall back to plain `dt`/`dd` and lay them out with grid.

### 3.7 Projects: classifieds

Keep the three `article.entry.todo` blocks, their links, `TODO` badges, `TODO: describe this project` text and `<!-- TODO -->` comments verbatim. Lay them out in columns with **thin vertical column rules** (`display:grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr))`, items separated by `border-left` rules, or `columns: 3 12rem; column-rule: 1px solid var(--rule)` with `break-inside: avoid`). Each one is a small classified: h3 link in Bodoni at about 1.05rem with `overflow-wrap: anywhere`, no rounded corners. The `.todo` dashed style may stay but should be square-cornered and thin (1px dashed `--ink-soft`).

`.badge` stays (rubber-stamp look, `--red`).

### 3.8 CSS to delete

All dark and edition rules, `.kicker`, `.headline-dek`, `.intro`, `.coupon*`, `.fig-hero`, `.label`, `.catalog*`, `.plate-index*`, `.plate-link*`, `.ticket-*`, `.plate*`, `.tagline`, `.maker`, `.tag`, the drop cap, `.colophon`, `.signoff`, and the old `plate-slide` / `page-turn-*` keyframes. Rewriting `styles.css` from scratch, top to bottom, is fine (it's ~855 lines now and most of it goes).

---

## 4. The zoom viewer (`site/app.js`)

The page is complete without JS. Rewrite `app.js` as one IIFE. Comment it plainly and avoid the banned words.

### 4.1 Setup
1. `section = #experience`, `ads = [...section.querySelectorAll('.ads > .ad')]`. Bail if none.
2. For each ad, turn its `h3` text into a button **inside** the h3 (heading semantics kept):
   `button.ad-open` (`type="button"`, `aria-haspopup="dialog"`), and move the h3's child nodes into it. The placeholder's TODO badge comes along, which is fine. CSS stretches its hit area over the whole ad: `.ad-open::after { content:""; position:absolute; inset:0; }`, plus `font: inherit; color: inherit; background: none; border: 0; padding: 0; text-align: inherit; cursor: zoom-in;`.
3. Unhide `.ads-hint`. Add `section.classList.add('is-enhanced')`.
4. Build one `<dialog class="ad-viewer" aria-labelledby="ad-viewer-title">` appended to `body`, containing:
   - `div.ad-viewer-sheet`: the zoomed ad goes here.
   - `div.ad-viewer-bar` with three buttons: `Previous` (`‹` arrow in an `aria-hidden` span), `Close` + `<kbd>Esc</kbd>`, `Next` (`›`). Each is at least 44px tall.
   - A visually hidden `aria-live="polite"` `<p>` (add a `.visually-hidden` utility class to CSS) that receives the job title text on Previous/Next.

### 4.2 Filling the sheet
`render(i)`: `const clone = ads[i].cloneNode(true)`; remove every `id` and `aria-labelledby` in the clone; replace the clone's `.ad-open` button with its child nodes; set the clone h3 `id="ad-viewer-title"` and `tabIndex = -1`; remove `ad--lg/md/sm` and add `ad--zoomed`; then `sheet.replaceChildren(clone)`. Note that the sprite's `<use href="#…">` references still resolve inside the clone, because ids live on the sprite, not the ad. Update Previous/Next: `aria-disabled="true"` at the ends (keep them focusable, click becomes a no-op, dimmed style). Don't use `hidden`/`disabled`, which drop focus.

### 4.3 Zoom in / out: View Transitions, with fallbacks
State: `current = -1`, `origin = -1` (the ad first opened), `busy = false`, `closing = false`.

`open(i, { animate = true } = {})`:
```
if busy or i out of range: return
const src = ads[i]
const update = () => {
  render(i)
  src.style.viewTransitionName = ''
  sheet.style.viewTransitionName = 'ad-zoom'
  document.documentElement.classList.add('ad-zoomed')   // scroll lock
  if (!dialog.open) dialog.showModal()
  dialog.querySelector('#ad-viewer-title').focus({ preventScroll: true })
}
current = origin = i
history.replaceState(null, '', '#' + src.id)
if (animate && !reduceMotion() && document.startViewTransition) {
  busy = true
  src.style.viewTransitionName = 'ad-zoom'
  const t = document.startViewTransition(update)
  t.finished.finally(() => { sheet.style.viewTransitionName = ''; busy = false })
} else {
  update(); if reduced motion → optional ≤150ms opacity-only fade on the dialog (WAAPI); if no VT API and motion allowed → WAAPI fade + scale .96→1 on the sheet
}
```

`close({ animate = true } = {})`:
```
if busy or current === -1: return
const src = ads[current]
if (current !== origin) src.scrollIntoView({ block: 'nearest' })   // only scroll if the reader paged to a different ad
const update = () => {
  sheet.style.viewTransitionName = ''
  src.style.viewTransitionName = 'ad-zoom'
  closing = true; dialog.close(); closing = false
  document.documentElement.classList.remove('ad-zoomed')
  history.replaceState(null, '', location.pathname + location.search)
  src.querySelector('.ad-open').focus({ preventScroll: true })
  current = -1
}
same VT / fallback branching; on finish clear src.style.viewTransitionName
```
- **Same spot:** the page can't scroll while zoomed (`html.ad-zoomed { overflow: hidden; }`, and `scrollbar-gutter: stable` on `html` avoids a shift). The only programmatic scroll is the `nearest` one above, which only runs after paging. So open then Esc leaves `scrollY` unchanged.
- **Esc:** listen for the dialog's `cancel` event, call `e.preventDefault()` and `close()`. Also listen for the dialog's `close` event: if it fires while `!closing` (a browser-forced close, e.g. a double Esc), run the same cleanup without animation (remove the html class, clear the hash, restore focus, `current = -1`).
- **Backdrop click:** the dialog is full-viewport and the sheet sits inside it. A `click` whose `e.target === dialog` calls `close()`.
- **Previous/Next:** `go(i)` sets `current = i`, calls `render(i)` and `history.replaceState` to the new id, writes the title to the live region, and keeps focus on the pressed button. Motion: a short WAAPI fade plus a 1.5rem horizontal slide on the sheet (direction-aware, ~250ms). Reduced motion: none. While the dialog is open, ArrowLeft/ArrowRight do the same (ignore them if modifier keys are held).
- **Clicking an ad:** `.ad-open` click calls `open(index)`.
- **Deep links:** on load, if `location.hash` matches an ad id, `ads[i].scrollIntoView({ block: 'center' })` then `open(i, { animate: false })`. On `hashchange` to an ad id: if closed, `open(i)`; if open, `go(i)`. A hash that isn't an ad id (e.g. `#skills`) does nothing.
- `reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches`, checked at each call.

### 4.4 Viewer CSS
- `dialog.ad-viewer[open]`: `position: fixed; inset: 0; width: 100%; height: 100%; max-width: none; max-height: none; margin: 0; padding: clamp(0.5rem, 2vw, 1.5rem); border: 0; background: rgb(244 239 227 / 0.94);` (newsprint, so the page fades back as you lean in) `display: flex; flex-direction: column; align-items: center; gap: .75rem;`. `::backdrop { background: transparent; }`. **Important:** setting `display:flex` on a bare `dialog` selector overrides the UA's hidden state, so put it under `[open]` (or add `dialog:not([open]) { display: none; }`).
- `.ad-viewer-sheet`: `width: min(60rem, 100%); flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain;`.
- `.ad--zoomed`: the same ad, now a full magazine page. Paper background, the double hairline frame, generous padding. At ≥48rem it's a grid like the Sumrie ad: art on the left (`minmax(0, .9fr)`, figure tall, optionally `position: sticky; top: 0`), copy column on the right (`minmax(0, 1.1fr)`) with the script wordmark (if any) across the top, then the h3 at `clamp(1.75rem, 4vw, 2.75rem)`, the dates, and the full copy at `1rem / 1.55`, justified, `hyphens: auto`, max ~38ch wide, unclamped. The caps wordmark runs full width along the bottom, large. On phone: art on top (max-height ~40vh), copy below. No drop cap.
- `.ad-viewer-bar`: `width: min(60rem, 100%)`, flex `space-between`; buttons in the body serif, 1px ink border, square corners, paper background, inverted on hover; `[aria-disabled="true"] { opacity: .4; cursor: default; }`; `kbd` small with a thin border.
- View transitions:
  ```css
  ::view-transition-group(ad-zoom) { animation-duration: 420ms; animation-timing-function: cubic-bezier(.2,.7,.2,1); }
  ::view-transition-old(ad-zoom), ::view-transition-new(ad-zoom) { width: 100%; height: 100%; object-fit: cover; object-position: 50% 0; }
  ::view-transition-old(root), ::view-transition-new(root) { animation-duration: 300ms; }
  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
  }
  ```
  Tune `object-fit` so neither snapshot looks stretched mid-zoom.
- No `scroll-behavior: smooth` on `html` (it would fight the instant restore). If you keep it, put it under `prefers-reduced-motion: no-preference` only.

---

## 5. Things to verify (builder)

1. `npx --yes html-validate@11.15.0 --preset standard site/` exits 0.
2. `grep -niE "edition|presenting|correspondence|cloth was cut|season|particulars|workshop|ships|plate no|built to lead|pressed in" site/index.html site/app.js` prints nothing (exit 1).
3. `grep -n "prefers-color-scheme" site/styles.css` prints nothing.
4. Bullets unchanged: for each `<li>` line in the Experience section of `git show HEAD:site/index.html`, `grep -F` the trimmed text in the new `site/index.html`. Every one must match.
5. `grep -n "TODO" site/index.html` still shows the placeholder role (h3 text, badge, company, bullet, comment) and the three project stubs.
6. Serve with `python3 -m http.server -d site` and check, at 1280×800 and 375×812, with the reference image open beside it:
   - Order top to bottom: nameplate, dateline, Education, Experience, then Skills (left) beside Projects (right) on desktop, or stacked on phone. No horizontal scrollbar at 375px.
   - Ads read like the reference in miniature: a dominant figure, a scene fading into paper, small justified copy, a light letter-spaced caps wordmark (with a small red mark) or a script wordmark.
   - Ads in each row have equal heights, and caps wordmarks line up along the bottom.
   - Click every ad: it zooms from its position to the viewer and shows all bullets. Previous/Next walk through all six. Close and Esc zoom back out. After open then Esc, `window.scrollY` is unchanged and focus is on that ad's button.
   - Keyboard: Tab reaches each ad; Enter/Space opens; focus is trapped in the viewer; arrows and Previous/Next work; Esc closes.
   - `/#role-associate-sde` loads with that ad zoomed. Closing leaves you at that ad.
   - JS disabled: all ads show full copy, readable; no hint text; no buttons; `/#role-intern` scrolls to and outlines that ad.
   - DevTools "Emulate prefers-reduced-motion: reduce": open and close are instant or a plain fade, with no scaling.
7. With "prefers-color-scheme: dark" emulated in DevTools, the page looks identical (no dark styling).

## 6. Out of scope / don't
- No new facts, no phone number, no photos or traced ad art, no new fonts or libraries, no build step.
- Don't add any visible copy beyond §1's allowed labels.

## 7. README update
Replace the `styles.css` bullet's light/dark text with "light only, newspaper page layout". Rewrite "Experience catalog" as "Experience ads": each role is one `article.ad` in `#experience .ads`, newest first. Its h3 is the job title, `.ad-dates` the dates, `.ad-copy` the bullets, `.wordmark` the company. The figure layers are `<use>` elements referencing symbols in the sprite. Size classes `ad--lg/md/sm/reserved` set the grid spans. `app.js` adds the zoom viewer (a `<dialog>`). The page works without it. The placeholder is `#role-2024-present`. Avoid the banned words in the README too, for consistency (not checked).
