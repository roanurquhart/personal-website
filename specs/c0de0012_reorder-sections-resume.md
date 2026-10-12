# Plan: Reorder the page to follow the resume

## Goal
Reorder `site/index.html` so it reads top to bottom:
1. Header (name, location line, one-line intro, contact links)
2. Education
3. Experience
4. Skills
5. Projects

Move the contact links into the header and delete the separate Links section. Nothing else changes.

## Current state (as found)
- `site/index.html` (154 lines). Inside `<main>` the order is: `<header>` (h1, `p.meta` "Raleigh, NC", `p.intro`), `#experience`, `#projects`, `#skills`, `#education`, `#links`.
- There is **no nav** and **no in-page `href="#…"` links** anywhere in `site/`, `README.md` or `app_docs/`. Each section already has a matching `id` and `aria-labelledby` → `*-heading` pair, and those ids stay valid after the move. Do not add a nav; the prompt only asks to keep nav/anchors consistent, and there's nothing to update.
- `site/styles.css` already styles `.links` (flex row, no bullets, wraps) without scoping it to a section, so it works the same inside `<header>`. **No CSS change is needed.** Leave `styles.css` untouched.

## Changes — `site/index.html` only

Do this by moving whole blocks (cut/paste). Do **not** retype any text. Every word, `<!-- TODO -->` comment, `TODO` badge, class, `rel` attribute and href must stay byte-identical. Only the order changes.

### 1. Header: add the contact links
Move the `<ul class="links">…</ul>` (the three `<li>`s: mailto `roanurquhart@gmail.com`, GitHub, LinkedIn) out of `#links` and into `<header>`, directly after `<p class="intro">`. The result:

```html
      <header>
        <h1>Roan Urquhart</h1>
        <p class="meta">Raleigh, NC</p>
        <p class="intro">Roan Urquhart is a software engineer in Raleigh, NC.</p>
        <ul class="links">
          <li><a href="mailto:roanurquhart@gmail.com">roanurquhart@gmail.com</a></li>
          <li><a href="https://github.com/roanurquhart" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="https://www.linkedin.com/in/roan-urquhart/" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
      </header>
```

- Keep the `Raleigh, NC` meta line where it is ("keep every word").
- Do not add a phone number.
- Do not add `aria-label` or other attributes to the `<ul>`. That avoids new html-validate rule hits.

### 2. Delete the Links section
Remove the now-empty `<section id="links" aria-labelledby="links-heading">` block, including its `<h2 id="links-heading">Links</h2>`. The only word lost is the "Links" heading, and the prompt explicitly asks to remove that section.

### 3. Reorder the sections after `</header>`
Final order of the `<section>` blocks, each moved as a whole and unchanged:
1. `<section id="education" …>` (UNC Chapel Hill entry)
2. `<section id="experience" …>`. Keep its internal order: the TODO comment plus the `2024 – present` TODO article first, then Senior SWE (Corvus, Jan 2024–Sep 2024), Software Engineer (Corvus), Associate SWE (Corvus), Associate SDE (SentryOne), SWE Intern (SentryOne, Summer 2019).
3. `<section id="skills" …>`
4. `<section id="projects" …>`: the three TODO stubs in their current order (software-factory, spotify-playlist-generator, Unity-Fluid-Simulation), each with its preceding `<!-- TODO -->` comment.

Keep the existing 6-space indentation and one blank line between sections.

## Verification
1. `npx --yes html-validate@11.15.0 --preset standard site/` must exit 0.
2. Sanity checks:
   - `grep -n '<section id=' site/index.html` lists, in this order: `education`, `experience`, `skills`, `projects`. There is no `links`.
   - `grep -c 'TODO' site/index.html` is unchanged from before the edit. Run it on the original first (`git show HEAD:site/index.html | grep -c TODO`) and compare.
   - `git diff --stat` shows only `site/index.html` changed.
   - `git diff -w` removes only the `#links` section wrapper and `h2`; every other line is a pure move. Optionally compare the line sets: `diff <(git show HEAD:site/index.html | sort) <(sort site/index.html)` should show only the 3 removed lines (`<section id="links"…>`, `<h2 id="links-heading">Links</h2>`, and one `</section>`) plus blank-line differences.
3. Browser: open `site/index.html` at desktop width (~1280px) and phone width (~375px). Order is header (name, Raleigh NC, intro, email/GitHub/LinkedIn row), Education, Experience, Skills, Projects. Contact links wrap cleanly at phone width. Check light and dark color schemes. TODO badges and dashed TODO boxes still appear.
