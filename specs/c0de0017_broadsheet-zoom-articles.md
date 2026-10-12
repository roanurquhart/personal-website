# Plan: vintage broadsheet with newsprint texture, company logos and tiny copy you zoom into (c0de0017)

## Goal

Roan called the current newspaper page "very janky still". Rework `site/` so that:

1. The page looks like **old newsprint**: a yellowed sheet with visible grain, blotchy tone, darker edges and a faint fold crease.
2. The masthead follows the reference: a centred nameplate, boxed **ears** on the left and right, and **one** dateline bar. The four stacked rules and the doubled heading rules are replaced by one clean rule system.
3. Experience is set as **articles on a broadsheet grid**. Senior Software Engineer is the lead story. Every person, garment, hanger and scene figure is gone. Each role gets a **small black-and-white woodcut-style company logo** (inline SVG).
4. The bullets on the page are **tiny, dense justified newspaper text** that you can't read. **Clicking an article zooms the camera into it** (the page scales toward it while blurring and dimming) and it settles into a centred reading frame at full size. Previous/Next **slide the paper sideways**. Close/Esc zooms back out. Focus is trapped, deep links work, reduced motion is handled, and the page still works with JS off.

The stack stays the same: plain HTML, CSS and vanilla JS in `site/`. No build step, no dependencies, no external images. The same Google Fonts `<link>` (Bodoni Moda, Libre Caslon Text, Yellowtail) stays unchanged.

> **Reference image:** `.sssf/reference/vintage_newspaper_layout.png` (in the worktree root, outside git). **Open it** before styling. Take only the **layout and texture**: yellowed newsprint with grain and darker edges; a centred blackletter/serif nameplate flanked by small boxed ears; a thin dateline bar between rules; a dense multi-column grid with hairline column rules; one big lead headline spanning several columns; smaller secondary headlines; small boxed items filling gaps; tiny justified body text with drop caps; small black-and-white illustrations set into the columns. **Never copy any of its text.**

## Files to touch

| File | Change |
|---|---|
| `site/index.html` | Add an inline `.js` class script in `<head>`. Replace the whole sprite: delete every figure, scene, mask, gradient and `#paint` filter, and add logo symbols plus hatch patterns. Rewrite the masthead (nameplate + ears + dateline). Restructure Experience as `.stories` with `article.story` items and a `.notice` placeholder. Make small markup changes to Education, Skills and Projects. |
| `site/styles.css` | Rewrite: newsprint tokens and texture, rule system, masthead, broadsheet grid, story typography (tiny when `.js`, readable without), logos, reader dialog, animations support, responsive layout, reduced motion. Delete all `.ad*`, `.ink-*`, `.wordmark*`, garment palette, `:target` outline and `::view-transition*` CSS. |
| `site/app.js` | Rewrite as the article reader: camera-zoom open and close (Web Animations API), slide for Previous/Next, focus trap, focus return without a leftover ring, hash deep links, scroll lock, reduced motion. No View Transitions. |
| `README.md` | Update "Where content lives" and replace the "Experience ads" section (see §8). |
| `site/favicon.svg` | No change. |

---

## 1. Wording rules (hard rule, applies everywhere)

- Every visible word must already be on the page today: name, `Raleigh, NC`, the email, `GitHub`, `LinkedIn`, school, degree, dates, job titles, company names (`Corvus Insurance`, `SentryOne`), resume bullets, skills, project names and TODO text.
- **Do not invent anything:** no newspaper name, slogan, "Vol."/"No."/"Issue", "Edition", date, price, kicker, tagline or fake headline. The dateline bar holds only in-page links to the four existing section headings (§3.2).
- Section headings stay exactly `Education`, `Experience`, `Skills`, `Projects`, in that DOM **and** visual order: masthead, Education, Experience, Skills, Projects.
- Allowed UI labels (JS-created): `Previous`, `Next`, `Close` (with an `Esc` `<kbd>`), and the hint `Select a story to read it`. The `aria-label="Sections"` on the dateline nav is the only other UI string.
- **Bullets move word for word.** Cut and paste the existing `<li>` lines into the new markup and don't retype them. Keep the quirks: the first Senior bullet and the "Implemented REST APIs in Go…" bullet have no final period; also keep "GMail", "Typescript React", "many of which", and "two functional programming languages; Elixir and Elm."
- Logos may contain only the company name and a single initial monogram (`C` for Corvus Insurance, `S` for SentryOne). They are original marks, **not** copies of the real logos.
- No phone number anywhere. No new facts.
- Keep every TODO: the placeholder role (`TODO: 2024 – present`, `<span class="badge">TODO</span>`, `TODO: company`, `TODO: fill in`, and its `<!-- TODO … -->` comment), and the three project stubs with their badges, `todo` class and comments.

## 2. Newsprint texture and tokens

### 2.1 Tokens (replace the `:root` palette)

```css
--paper: #efe5cb;        /* yellowed sheet */
--paper-deep: #e2d3ac;   /* blotches / edges */
--table: #cdbf9c;        /* body behind the sheet */
--ink: #1f1b16;          /* near-black, never #000 */
--ink-soft: #4b4337;
--hair: rgb(31 27 22 / 0.55); /* hairline rules */
--red: #9b2d24;          /* TODO badge only */
```
Delete `--camel --tan --brown --navy --slate --ochre --skin --dot --paper-2`. Keep the three font variables unchanged. Change `<meta name="theme-color">` to `#efe5cb`. Light only.

### 2.2 The sheet

- `body`: `background-color: var(--table)`, plus the grain layer below, so the sheet edge shows on wide screens. Add `overflow-x: clip` as a guard against horizontal scroll.
- `.page` is the newspaper sheet: `max-width: 78rem; margin: clamp(0px, 1.5vw, 1.5rem) auto;` with `padding: 1.25rem clamp(0.9rem, 3vw, 2.25rem) 2.5rem;`. Its `background` stacks these layers, top first:
  1. **Fold crease** (faint, horizontal, about 40% down the sheet): a soft dark band with a 1px light highlight, e.g.
     `linear-gradient(to bottom, transparent calc(40% - 14px), rgb(70 50 20 / .07) calc(40% - 1px), rgb(255 250 235 / .5) 40%, rgb(70 50 20 / .05) calc(40% + 2px), transparent calc(40% + 14px))`
  2. **Grain** (must be clearly visible at 100% zoom; the current one at opacity .06 is invisible):
     `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .16 0 0 0 0 .12 0 0 0 0 .07 0 0 0 -2.2 1.25'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='.6'/%3E%3C/svg%3E")`
     The colour matrix turns the noise into brown-black speckles. **Tune the `opacity` (about .45–.8) by screenshot** until the grain is obvious at 100% but text is still crisp.
  3. **Blotches** (low-frequency uneven tone):
     `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='640'%3E%3Cfilter id='b' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.006' numOctaves='3' seed='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .55 0 0 0 0 .4 0 0 0 0 .15 1.6 0 0 0 -.65'/%3E%3C/filter%3E%3Crect width='640' height='640' filter='url(%23b)' opacity='.4'/%3E%3C/svg%3E")`
  4. `var(--paper)` base colour.
- **Vignette / darker edges:** `.page { box-shadow: inset 0 0 4.5rem rgb(120 85 30 / .30), inset 0 0 1rem rgb(120 85 30 / .18), 0 1px 4px rgb(0 0 0 / .18); }`. The inset shadows darken all four sheet edges.
- Put the grain layer on `body` too, so the area around the sheet isn't flat.
- `::selection { background: rgb(31 27 22 / .85); color: var(--paper); }`.

## 3. Masthead and rule system

### 3.1 Markup

```html
<header class="masthead">
  <div class="nameplate-row">
    <p class="ear ear--left">Raleigh, NC</p>
    <h1 class="nameplate">Roan Urquhart</h1>
    <ul class="ear ear--right links">
      <li><a href="mailto:roanurquhart@gmail.com">roanurquhart@gmail.com</a></li>
      <li><a href="https://github.com/roanurquhart" rel="noopener noreferrer">GitHub</a></li>
      <li><a href="https://www.linkedin.com/in/roan-urquhart/" rel="noopener noreferrer">LinkedIn</a></li>
    </ul>
  </div>
  <nav class="dateline" aria-label="Sections">
    <ul>
      <li><a href="#education">Education</a></li>
      <li><a href="#experience">Experience</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#projects">Projects</a></li>
    </ul>
  </nav>
</header>
```
Each fact appears once on the page. Nothing is repeated in a footer, and there is no footer.

### 3.2 Styles

- `.nameplate-row`: grid `grid-template-columns: minmax(8rem, 1fr) auto minmax(8rem, 1fr); align-items: center; gap: 1rem;` and `padding-bottom: .6rem; border-bottom: 3px solid var(--ink);` (this is the **thick** rule).
- `.nameplate`: the existing display font, weight 900, `font-size: clamp(2.2rem, 8.5vw, 6.75rem)`, `line-height: .95`, centred, `letter-spacing: -0.01em`. It must stay on one line at 1280px.
- `.ear`: a small box, `border: 1px solid var(--ink); padding: .35rem .6rem; font-size: .72rem; line-height: 1.35; text-align: center; letter-spacing: .06em; max-width: 13rem;`. The left ear sits at `justify-self: start` and the right ear at `justify-self: end`. Right-ear links are one per line with no bullets, and the email has `overflow-wrap: anywhere`. Optional: a 2px inner double-rule look via `outline: 1px solid var(--ink); outline-offset: -4px`.
- **Phone (< 40rem):** `grid-template-columns: auto minmax(0, 1fr); grid-template-areas: "name name" "left right";`. The nameplate is on top and centred (it must not overflow 375px; `clamp(2.2rem, 11.5vw, …)` at that width). The two ears sit side by side below it.
- `.dateline`: `margin-top: 2px; border-block: 1px solid var(--ink); padding: .3rem 0;`. The thin rule 2px under the thick one forms the **thick-thin pair**, and the dateline sits **between two thin rules**. The links are inline, centred, small caps / uppercase `.7rem`, `letter-spacing: .14em`, separated by `gap: 1.5rem` (or by a `·` drawn with CSS `::before`, which is not text content), wrapping on phone.
- **No other rule touches the masthead.** Remove `.masthead { border-top }`. The masthead has no top rule.
- **Sections:** remove `section { border-top }` and every `h2` border. Each `h2` is a centred label flanked by hairlines on the same line (one visual rule broken by the word):
  ```css
  h2 { display: flex; align-items: center; gap: .75rem; font-size: clamp(.95rem, 1.6vw, 1.15rem); letter-spacing: .22em; text-transform: uppercase; margin: 0 0 .9rem; }
  h2::before, h2::after { content: ""; flex: 1; border-top: 1px solid var(--hair); }
  ```
  `section { margin-top: 1.4rem; }`.
- Page end: `.page` has no `border-bottom: 4px double`. Use a single hairline after the last section (or nothing).
- Result between masthead and Education: thick rule, thin rule, dateline, thin rule, then the Education heading's hairline. That is one clean system with no stacked doubles.

## 4. Experience: stories on a broadsheet

### 4.1 Logo sprite (replaces the whole current sprite contents)

Keep the `<svg class="sprite" aria-hidden="true">` wrapper (`width:0;height:0;position:absolute;overflow:hidden`, **never** `display:none`, or patterns break). Add `.sprite { color: var(--ink); }` so `currentColor` resolves for the patterns. Delete `#paint`, `#fade-grad`, `#scene-fade`, every `scene-*` group and every `fig-*` symbol.

Add the following (the exact geometry may be refined, but keep the style: an engraved seal or shield, hatching, a ribbon with the name):

```html
<defs>
  <pattern id="hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <path d="M0 0V3" stroke="currentColor" stroke-width="1.1"/>
  </pattern>
  <pattern id="hatch-cross" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <path d="M0 0V3M0 0H3" stroke="currentColor" stroke-width=".8"/>
  </pattern>
  <filter id="ink-bleed" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="4" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="1.2"/>
  </filter>
</defs>

<!-- Corvus Insurance: engraved round seal, C monogram, name on a ribbon -->
<symbol id="logo-corvus" viewBox="0 0 100 100">
  <g filter="url(#ink-bleed)">
    <circle cx="50" cy="50" r="47" fill="#efe5cb" stroke="currentColor" stroke-width="3"/>
    <circle cx="50" cy="50" r="41" fill="url(#hatch)" stroke="currentColor" stroke-width="1"/>
    <circle cx="50" cy="40" r="20" fill="#efe5cb" stroke="currentColor" stroke-width="1.5"/>
    <text x="50" y="51" text-anchor="middle" font-size="30" font-weight="900" font-style="italic" fill="currentColor">C</text>
    <path d="M4 63H96L90 73L96 83H4L10 73Z" fill="#efe5cb" stroke="currentColor" stroke-width="1.5"/>
    <text x="50" y="73" text-anchor="middle" font-size="8.5" font-weight="700" letter-spacing="1.2" fill="currentColor">CORVUS</text>
    <text x="50" y="80.5" text-anchor="middle" font-size="5" letter-spacing="1" fill="currentColor">INSURANCE</text>
  </g>
</symbol>

<!-- SentryOne: heraldic shield, S monogram, name on a ribbon -->
<symbol id="logo-sentryone" viewBox="0 0 100 100">
  <g filter="url(#ink-bleed)">
    <path d="M50 4L88 14V44C88 68 72 84 50 95C28 84 12 68 12 44V14Z" fill="#efe5cb" stroke="currentColor" stroke-width="3"/>
    <path d="M50 11L82 19.5V44C82 64 68 78 50 88C32 78 18 64 18 44V19.5Z" fill="url(#hatch-cross)" stroke="currentColor" stroke-width="1"/>
    <circle cx="50" cy="38" r="16" fill="#efe5cb" stroke="currentColor" stroke-width="1.5"/>
    <text x="50" y="46" text-anchor="middle" font-size="24" font-weight="900" fill="currentColor">S</text>
    <path d="M2 62H98L92 70L98 78H2L8 70Z" fill="#efe5cb" stroke="currentColor" stroke-width="1.5"/>
    <text x="50" y="73" text-anchor="middle" font-size="8.5" font-weight="700" letter-spacing="1" fill="currentColor">SENTRYONE</text>
  </g>
</symbol>

<!-- Placeholder mark for the 2024 to present notice: an empty dashed seal, no text -->
<symbol id="logo-blank" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="7 6"/>
</symbol>
```
- `#efe5cb` is `--paper`. Presentation attributes can't use `var()`, so the hex is hard-coded. Keep it in sync with the token.
- Symbol text inherits the font from the `<svg class="logo">` (`.logo { font-family: var(--font-display); color: var(--ink); }`). Don't use `<textPath>`, which is unreliable inside `<use>` in Safari.
- No `style=""` attributes anywhere in the HTML (html-validate `no-inline-style`).
- If `#ink-bleed` makes the small text mush at 56px, lower `scale` to .6 or drop the filter. Legibility of the ribbon at 96px in the reader matters more.

### 4.2 Story markup

Rename the container `.ads` to `.stories` and each `.ad` to `.story`. Delete every `<svg class="ad-art">`, every `.wordmark` and every `.ad-dates`. The structure is flat so CSS grid can rearrange it per context:

```html
<section id="experience" aria-labelledby="experience-heading">
  <h2 id="experience-heading">Experience</h2>
  <p class="stories-hint" hidden>Select a story to read it</p>

  <div class="stories">
    <!-- TODO: placeholder for the 2024 to present role; replace title, company, and bullets -->
    <article class="notice todo" id="role-2024-present" aria-labelledby="role-2024-present-title">
      <svg class="logo logo--blank" viewBox="0 0 100 100" aria-hidden="true"><use href="#logo-blank"></use></svg>
      <h3 id="role-2024-present-title">TODO: 2024 – present <span class="badge">TODO</span></h3>
      <p class="byline">TODO: company</p>
      <ul class="notice-copy"><li>TODO: fill in</li></ul>
    </article>

    <article class="story story--lead" id="role-senior-swe" aria-labelledby="role-senior-swe-title">
      <svg class="logo" viewBox="0 0 100 100" aria-hidden="true"><use href="#logo-corvus"></use></svg>
      <h3 id="role-senior-swe-title">Senior Software Engineer</h3>
      <p class="byline">Corvus Insurance · January 2024 – September 2024</p>
      <ul class="story-copy">
        <!-- the three existing <li> lines, moved verbatim -->
      </ul>
    </article>

    <article class="story story--second" id="role-swe" …>          <!-- logo-corvus, Software Engineer, Corvus Insurance · January 2022 – January 2024 -->
    <article class="story story--col" id="role-associate-swe" …>   <!-- logo-corvus, Associate Software Engineer, Corvus Insurance · October 2021 – January 2022 -->
    <article class="story story--col" id="role-associate-sde" …>   <!-- logo-sentryone, Associate Software Development Engineer, SentryOne · June 2020 – October 2021 -->
    <article class="story story--col" id="role-intern" …>          <!-- logo-sentryone, Software Engineering Intern, SentryOne · Summer 2019 -->
  </div>
</section>
```
- Keep all six `id`s exactly as they are now (`role-2024-present`, `role-senior-swe`, `role-swe`, `role-associate-swe`, `role-associate-sde`, `role-intern`) and the `aria-labelledby` pairs.
- The byline is plain text: company, a space, `·`, a space, the dates. The `·` separator is punctuation, not copy.
- The placeholder is a `.notice`, **not** a `.story`. It is a small boxed item with readable text and is **not** opened by the reader. `#role-2024-present` just scrolls to it natively.

### 4.3 Broadsheet grid

- `.stories { display: grid; gap: 1.3rem 1.5rem; overflow: clip; }`
- **Rules between stories (generic, no per-item exceptions):** every grid child gets
  - a column rule `::before { content:""; position:absolute; top:0; bottom:0; left:-.75rem; border-left:1px solid var(--hair); }`
  - a row rule `::after { content:""; position:absolute; left:0; right:0; top:-.65rem; border-top:1px solid var(--hair); }`
  - `position: relative`.

  Because `.stories` has `overflow: clip`, the rules of items in the first column and first row fall outside the container and are clipped. That leaves hairlines only *between* stories, at every breakpoint, with no duplicates next to the `h2` rule. (The button's hit-area pseudo element lives on the button, so there's no clash.)
- **Desktop ≥ 64rem** (12 columns):
  - `.story--lead { grid-column: 1 / span 7; grid-row: 1 / span 2; }`
  - `.notice { grid-column: 8 / -1; grid-row: 1; }`
  - `.story--second { grid-column: 8 / -1; grid-row: 2; }`
  - `.story--col { grid-column: span 4; }` (they auto-place into row 3 as three equal columns)
- **Tablet 40–63.99rem** (6 columns): lead `1 / -1`; notice `span 2`; second `span 4`; `.story--col` `span 2`.
- **Phone < 40rem**: one column in DOM order (notice, lead, second, three cols).

### 4.4 Story typography

Shared, both with and without JS:
- Each story is a grid: `grid-template-columns: var(--logo) minmax(0, 1fr); grid-template-areas: "head head" "by by" "logo copy"; column-gap: .65rem;`
  - `.story > .logo { grid-area: logo; width: var(--logo); height: var(--logo); }`, `h3 { grid-area: head }`, `.byline { grid-area: by }`, `.story-copy { grid-area: copy; }`
  - `--logo: 56px` by default, `72px` on `.story--lead`.
- Headlines: display font, weight 800, `line-height: 1.02`, `text-wrap: balance`.
  - Lead: `clamp(1.9rem, 4.2vw, 3.4rem)`, the biggest on the page after the nameplate.
  - Second: `clamp(1.25rem, 2vw, 1.65rem)`.
  - Col: `clamp(1.05rem, 1.5vw, 1.25rem)`.
- `.byline`: `font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); margin: .35rem 0 .55rem; padding-bottom: .35rem; border-bottom: 1px solid var(--hair);`. **Readable**.
- `.notice`: `border: 1px dashed var(--ink-soft); padding: .6rem .75rem;`. Its h3 is `1rem`, its text is `.8rem` and readable, and its logo is 36px. The notice stays short, no taller than its text needs.

**Without JS (no `.js` on `<html>`), the text is readable:** `.story-copy { font-size: .92rem; line-height: 1.45; text-align: justify; hyphens: auto; padding-left: 1.1em; list-style: square; }`.

**With JS (`.js` on `<html>`), the copy is tiny newspaper text:**
```css
.js .story-copy {
  font-size: 5.5px;            /* px on purpose: must not scale with root */
  line-height: 1.2;
  text-align: justify;
  hyphens: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  column-gap: .55rem;
  column-rule: 1px solid var(--hair);
}
.js .story-copy li { text-indent: 1.2em; margin: 0; }
.js .story-copy li:first-child { text-indent: 0; }
.js .story-copy li:first-child::first-letter {
  float: left; font-family: var(--font-display); font-weight: 800;
  font-size: 3.7em; line-height: .82; margin: .06em .12em 0 0;
}
.js .story--lead .story-copy { columns: 3; font-size: 6px; }
.js .story--second .story-copy,
.js .story--col .story-copy { columns: 2; }
```
- At 1280px the bullets must be **too small to read** while headline, byline and logo stay readable.
- **Phone (< 40rem, `.js`):** each story is `grid-template-columns: 48px 1fr; grid-template-areas: "logo head" "logo by" "copy copy";`. `.story-copy` gets `columns: 1; max-height: calc(1.2em * 8); overflow: hidden; mask-image: linear-gradient(#000 60%, transparent);` (plus the `-webkit-` prefix). Don't use multi-column together with max-height, or it overflows sideways. Every story must stay **under about half a screen** (≤ ~330px at 375×667).
- `.js .story { cursor: zoom-in; }`. Hover feedback: `.js .story:hover { background: rgb(255 250 235 / .35); }` (subtle).

### 4.5 Click target and focus ring

- JS wraps each story's `h3` content in `<button type="button" class="story-open" aria-haspopup="dialog">` (as today). Style: `font: inherit; color: inherit; background: none; border: 0; padding: 0; text-align: inherit; cursor: zoom-in;` and `.story-open::after { content:""; position:absolute; inset:0; z-index:1; }` so the whole article is the hit area.
- Focus ring: `.story-open:focus-visible { outline: none; }` and `.story:has(.story-open:focus-visible) { outline: 2px solid var(--ink); outline-offset: -3px; }`. The ring is **ink, inset** (so `overflow: clip` doesn't cut it), and not red.
- **Delete** the `.ad:target` outline rule. A `:target` from a deep link otherwise leaves a permanent red box after closing.
- `.story[data-returned] { outline: none !important; }` (see §6.6).
- Global `:focus-visible` becomes `outline: 2px solid var(--ink); outline-offset: 2px;` (the B&W page has no red rings).

## 5. Rest of the page

- **Education:** `.brief` is a short boxed story: `border: 1px solid var(--ink); padding: .8rem 1rem;` with an inner hairline (`outline: 1px solid var(--hair); outline-offset: -5px`). School `h3` at `clamp(1.15rem, 2vw, 1.5rem)`, degree and dates as `.meta` small text below. At ≥ 40rem it can keep the three-cell row (headline | degree | dates with hairline dividers). At 375px it stacks. Don't let it grow tall.
- **Skills:** a narrow sidebar box. At ≥ 64rem `#skills { grid-column: span 4 }` with `.skills` `border: 1px solid var(--ink); padding: .75rem .9rem;`. `dt` in small caps, `dd` at `.9rem`, hairlines between groups.
- **Projects:** at ≥ 64rem `#projects { grid-column: span 8; }` with a vertical hairline on its left (one rule, not doubled). Three `.entry.todo` small boxed notices in a 3-column grid (`gap: .9rem`), each `border: 1px dashed var(--ink-soft); padding: .6rem .75rem;`, keeping the link, `TODO` badge and comment. Stack them at < 40rem.
- `.page` at ≥ 64rem: a 12-column grid. Masthead, Education and Experience span `1 / -1`, then Skills (4) beside Projects (8). That gives the visual order masthead → Education → Experience → Skills → Projects.
- `.badge` stays as is (red outlined, rotated -3deg). It is the only red on the page.

## 6. The reader (app.js rewrite)

### 6.1 The `.js` class

In `<head>`, **before** the stylesheet link: `<script>document.documentElement.classList.add('js');</script>`. This avoids a flash of big text. `app.js` stays `defer`.

### 6.2 DOM built once by JS

```html
<dialog class="reader" aria-labelledby="reader-title">
  <div class="reader-dim"></div>                     <!-- full-viewport tint, click = close -->
  <div class="reader-frame">                         <!-- the paper sheet that zooms and slides -->
    <div class="reader-sheet"><!-- cloned story --></div>
    <div class="reader-bar">
      <button class="reader-btn" data-act="prev"><span aria-hidden="true">‹</span> Previous</button>
      <button class="reader-btn" data-act="close">Close <kbd>Esc</kbd></button>
      <button class="reader-btn" data-act="next">Next <span aria-hidden="true">›</span></button>
    </div>
  </div>
  <p class="visually-hidden" aria-live="polite"></p>
</dialog>
```
- `stories = [...document.querySelectorAll('.stories > .story')]` gives the 5 roles. The notice is excluded.
- Reveal `.stories-hint` (`hidden = false`).

### 6.3 Reader CSS

- `dialog.reader`: `position: fixed; inset: 0; width: 100%; height: 100%; max-width: none; max-height: none; margin: 0; padding: clamp(.5rem, 2vw, 1.5rem); border: 0; background: transparent; overflow: hidden;`. When `[open]`: `display: grid; place-items: center;`. `::backdrop { background: transparent; }`.
- `.reader-dim`: `position: fixed; inset: 0; background: rgb(31 27 22 / .38);`.
- `.reader-frame`: `position: relative; width: min(46rem, 100%); max-height: 100%; display: flex; flex-direction: column;` with the same paper layers as `.page` (grain, blotches, `--paper`), `box-shadow: inset 0 0 2.5rem rgb(120 85 30 / .28), 0 18px 50px rgb(0 0 0 / .35);`, and an inner printed rule `::before { inset: 7px; border: 1px solid var(--ink); pointer-events: none; }`.
- `.reader-sheet`: `flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: clamp(1.4rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 2.5rem) 1rem;`. Padding must be wider than the 7px inner rule, so **the logo and byline never touch the frame edge**.
- `.reader-bar`: **inside the frame**, `flex: none; display: flex; justify-content: space-between; gap: .5rem; padding: .75rem clamp(1.25rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.5rem); border-top: 1px solid var(--hair);`. Buttons: min 44×44px, `font: inherit; font-size: .9rem; background: var(--paper); border: 1px solid var(--ink); border-radius: 0;`, inverted on hover, `[aria-disabled="true"]` at 40% opacity. Under 30rem hide the `<kbd>`.
- The cloned story gets class `story story--read` (remove `story--lead/second/col`):
  - grid `grid-template-columns: 96px minmax(0,1fr); grid-template-areas: "logo head" "logo by" "copy copy"; column-gap: 1.1rem;`. On phone use `64px`.
  - h3: `clamp(1.7rem, 4vw, 2.6rem)`. Byline as on the page, `.75rem`.
  - `.story-copy` (overriding the `.js` tiny rules with higher specificity, e.g. `.js .story--read .story-copy`): `font-size: 1.05rem; line-height: 1.58; columns: auto; column-rule: none; max-height: none; mask-image: none; max-width: 62ch; margin-top: 1rem;`. Keep the justified paragraphs, indents and the drop cap (which scales to about 3.5rem). **The same text, now readable.**
  - `overflow-wrap: anywhere` on h3 and byline.
- `html.is-reading { overflow: hidden; }` (`scrollbar-gutter: stable` already prevents a shift).

### 6.4 Open: camera zoom (motion allowed), about 600ms

```js
function zoomFor(story) {
  const r = story.getBoundingClientRect();
  const p = page.getBoundingClientRect();           // page is untransformed here
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const S = Math.min(3, Math.max(1.35, Math.min(innerWidth * .92 / r.width, innerHeight * .92 / r.height)));
  return {
    rect: r,
    origin: `${cx - p.left}px ${cy - p.top}px`,     // transform-origin at the article
    transform: `translate(${innerWidth / 2 - cx}px, ${innerHeight / 2 - cy}px) scale(${S})`,
  };
}
```
Sequence in `open(index)`:
1. Ignore the call if `busy`. Set `busy = true` and `history.replaceState(null, '', '#' + id)`.
2. `const z = zoomFor(story)`. Set `page.style.transformOrigin = z.origin; page.style.willChange = 'transform, filter';`.
3. `render(index)` (clone into the sheet), `root.classList.add('is-reading')`, `dialog.showModal()`. Focus `#reader-title` (`tabIndex = -1`, `preventScroll: true`).
4. Measure `F = frame.getBoundingClientRect()` (final, centred).
5. Start three animations together:
   - **Page:** `pageAnim = page.animate([{ transform: 'none', filter: 'none' }, { transform: z.transform, filter: 'blur(4px) brightness(.88)' }], { duration: 600, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'forwards' })`. The page stays zoomed and blurred behind the frame while reading.
   - **Dim:** `.reader-dim` opacity `0 → 1`, 400ms, ease-out.
   - **Frame** (FLIP from the article's spot, with a paper settle and overshoot): with `k = z.rect.width / F.width`, `tx = (z.rect.left + z.rect.width/2) - (F.left + F.width/2)`, `ty` likewise,
     ```js
     frame.animate([
       { transform: `translate(${tx}px, ${ty}px) scale(${k}) rotate(-1deg)`, opacity: 0 },
       { opacity: 1, offset: .3 },
       { transform: 'translate(0, -6px) scale(1.025) rotate(.4deg)', offset: .78 },
       { transform: 'none', opacity: 1 },
     ], { duration: 620, easing: 'cubic-bezier(.2,.8,.2,1)' });
     ```
6. When the frame animation finishes: `busy = false`.

### 6.5 Previous / Next: paper slides sideways, about 520ms

`step(dir)` (dir = ±1; ignore it at the ends or when `busy`):
1. `busy = true`. Out: `frame.animate([{ transform: 'none', opacity: 1 }, { transform: `translateX(${-dir * 55}%) rotate(${-dir * 2.5}deg)`, opacity: 0 }], { duration: 200, easing: 'cubic-bezier(.5,0,.9,.5)' })`.
2. When it finishes: `render(newIndex)`, update the hash (`replaceState`), set the live region to the title text and `current = newIndex`. Then in: `frame.animate([{ transform: `translateX(${dir * 55}%) rotate(${dir * 2.5}deg)`, opacity: 0 }, { transform: `translateX(${-dir * 1.5}%) rotate(${-dir * .4}deg)`, opacity: 1, offset: .72 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.2,.8,.3,1)' })`. On finish: `busy = false`.
3. Focus stays on the button that was pressed. The bar is inside the frame and is **not** re-rendered, so the button survives the swap. `updateNav` sets `aria-disabled` on Previous at index 0 and on Next at the last index. Disabled buttons stay focusable and do nothing.
4. The page behind stays zoomed on the originally opened story (it is blurred; don't re-aim it).
5. ArrowLeft and ArrowRight (no modifiers) call `step(-1)` and `step(1)` while open.

### 6.6 Close: zoom back out, about 520ms

`close()` from the Close button, Esc (`cancel` event with `preventDefault()`) or a click on `.reader-dim`:
1. Ignore the call if `busy`. Set `busy = true` and `const story = stories[current]`.
2. If `current !== origin` (the reader paged away): `pageAnim.cancel()`, `story.scrollIntoView({ block: 'center', behavior: 'instant' })`, then `z = zoomFor(story)` and set `page.style.transformOrigin = z.origin`. Otherwise reuse the stored `z` from open. (The jump in the blurred background at the start of close is acceptable.)
3. Animate together:
   - Page: `[{ transform: z.transform, filter: 'blur(4px) brightness(.88)' }, { transform: 'none', filter: 'none' }]`, 520ms, `cubic-bezier(.4,0,.2,1)`. Cancel the old `pageAnim` first if it hasn't been cancelled.
   - Dim: `1 → 0`, 420ms.
   - Frame: `[{ transform: 'none', opacity: 1 }, { opacity: 1, offset: .55 }, { transform: `translate(${tx}px, ${ty}px) scale(${k})`, opacity: 0 }]`, using the story's current (untransformed) rect, 480ms, `cubic-bezier(.5,0,.75,0)`.
4. On finish, run `dismiss()`: `dialog.close()`; cancel all animations; clear `page.style.transformOrigin` and `willChange`; remove `is-reading`; set `current = -1`; `history.replaceState(null, '', location.pathname + location.search)`. Then **return focus**: set `story.dataset.returned = ''` and call `story.querySelector('.story-open').focus({ preventScroll: true, focusVisible: false })`. Add one-shot listeners (`keydown` and `pointerdown` on `document`, `focusout` on the story) that delete `data-returned`. **There must be no leftover focus box after closing**, by mouse or by Esc, but the next Tab shows normal rings again.
5. Keep a `dialog` `close` event handler: if the browser closed the dialog by itself (for example Chrome's repeated-Esc rule), run the same `dismiss()` with no animation.

### 6.7 Focus trap

On `dialog` `keydown`, when `Tab` is pressed: `const items = [prev, closeBtn, next]`. Call `preventDefault()` and move focus to the next or previous item, wrapping around. If focus is on the title (or anywhere not in `items`), Tab goes to `items[0]` and Shift+Tab goes to `items[2]`. Tab must never reach the browser chrome or the page.

### 6.8 Reduced motion

`const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;`
- **Open:** no page transform. Add `is-reading` and show the dialog. Fade the frame and dim in over 150ms with opacity only. The page may get a static `filter: blur(3px)` through `html.is-reading.reduce-motion .page`, or nothing.
- **Previous/Next:** swap instantly (optionally a 120ms opacity fade).
- **Close:** instant (or a 120ms fade), then `dismiss()`.
- CSS: `@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }`. Delete all `::view-transition*` rules.

### 6.9 Deep links and the rest

- `render(index)`: clone the story. Remove every `id` and `aria-labelledby` from the clone. Unwrap `.story-open` (replace the button with its child nodes). Swap the layout classes for `story--read`. Give the clone's `h3` `id="reader-title"` and `tabIndex = -1`. Put the clone in the sheet. Reset `sheet.scrollTop = 0`. The clone's `<use href="#logo-…">` keeps working.
- Hash: on load, if `location.hash` matches a story id, `scrollIntoView({ block: 'center' })` and `open(index, { animate: false })` (the reduced-motion path). `hashchange` opens the story, or moves to it if the reader is already open. A hash to `#role-2024-present` or to a section id does nothing special (native scroll).
- Resize while open: no re-measure is needed. Close recomputes the zoom from current geometry anyway.
- If `typeof frame.animate !== 'function'`, use the reduced-motion path.
- Header comment at the top of `app.js` explains that the page is fully readable without the script. Don't use banned words in comments (edition, season, "issue no", vol., kicker, tagline).

## 7. Delete list (CSS and HTML)

- HTML: the whole old sprite contents; `.ad-art`, `.figure`, `.wordmark`, `.ad-dates`, `.ad-text` wrappers; `.ads-hint`.
- CSS: `.ad`, `.ad::before`, `.ad-art`, `.ad .figure use`, `.ink*`, `.ad-text`, `.ad h3`, `.ad-dates`, `.ad-copy*`, `.wordmark*`, `.ad--lg/md/sm/reserved/halftone*`, `.ad-open*`, `.ad:target`, `#experience.is-enhanced *`, `dialog.ad-viewer*`, `.ad-viewer*`, `.ad--zoomed*`, `::view-transition*`, `html.ad-zoomed`, the garment palette variables, the `.masthead` top border, `section` top border, `h2` borders, `.page` double bottom border.
- JS: all View Transition code.

## 8. README.md

- "Where content lives": `styles.css` is "laid out as a broadsheet on yellowed newsprint"; `app.js` is "the article reader: click a story to zoom into it. Without JS every story is printed at full size."
- Replace "Experience ads" with "Experience stories": each role is an `article.story` inside `#experience .stories`, newest first. `h3` is the job title, `.byline` is company · dates, `.story-copy` holds the bullets and `<svg class="logo"><use href="#logo-corvus|#logo-sentryone"></use></svg>` is the company logo, defined as `<symbol>`s in the sprite at the top of `<body>`. Layout classes: `story--lead`, `story--second`, `story--col`. The `.js` class on `<html>` (set by the inline head script) turns the copy into tiny newspaper text. Deep links use the story id, e.g. `#role-intern`. The 2024–present placeholder is the `.notice` `#role-2024-present`: to fill it in, turn it into a `.story` with a logo, title, byline and bullets, and remove the badge, the `todo` class and the comment.

## 9. Verification

1. `npx --yes html-validate@11.15.0 --preset standard site/` exits 0.
2. `grep -nE 'fig-|scene-|hanger|class="figure"|ad-art|wordmark|view-transition' site/` returns nothing (exit 1).
3. `grep -c 'href="#logo-corvus"' site/index.html` gives 3. `grep -c 'href="#logo-sentryone"' site/index.html` gives 2.
4. `grep -niE 'edition|vol\.|issue no|season|kicker|tagline|gazette|herald|chronicle|tribune' site/` returns nothing. (Plain `issue` is not banned: a real bullet says "resolving issues reported".) `grep -nE '[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}' site/` returns nothing (no phone).
5. Diff check: every original `<li>` bullet string still appears exactly once in `site/index.html` (compare against `git show HEAD:site/index.html`).
6. Serve with `python3 -m http.server -d site` and check in a browser at **1280×800** and **375×667**:
   - Order: masthead, Education, Experience, Skills, Projects. The grain, blotches, darker edges and crease are visible at 100% zoom.
   - Only a thick-thin pair plus the dateline's bottom thin rule sit under the name. Headings have one flanking hairline.
   - The bullets on the page can't be read. The headline, byline and logo can.
   - Click a story: the page zooms toward it and blurs, and the frame settles with an overshoot (about 0.6s). The text is readable. The logo, byline and buttons are not clipped (check `.reader-sheet` `scrollWidth <= clientWidth` and that the logo rect is inside the frame rect).
   - Previous/Next slide. Tab cycles only Previous → Close → Next. Esc closes and zooms back to the same story with no focus box visible.
   - `document.documentElement.scrollWidth <= innerWidth` at 375. Each story's height is ≤ ~330px at 375.
   - DevTools "Emulate prefers-reduced-motion: reduce": open, step and close are instant or fade.
   - Disable JavaScript: all bullets are readable at normal size, there is no hint, and nothing is clickable.
   - Load `/#role-intern`: the reader opens on Software Engineering Intern.
