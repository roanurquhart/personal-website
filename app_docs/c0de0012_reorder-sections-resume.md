# Reorder the page to follow the resume

## What changed and why

The single page in `site/index.html` now lists its sections in resume order, top to bottom:

1. Header: name, "Raleigh, NC", the one-line intro, and the contact links (email, GitHub, LinkedIn) in a row under the intro
2. Education
3. Experience
4. Skills
5. Projects

Before this change, the order was Header, Experience, Projects, Skills, Education, Links. The separate Links section is gone; its three contact links moved into the header. The change is a reorder plus that merge. The text, TODO badges, `<!-- TODO -->` comments, and classes are carried over unchanged.

## Files

- `site/index.html` is the only file changed in the code. Its diff moves the Education, Skills and contact-link blocks, removes the `#links` section and its `Links` heading, and adds the `<ul class="links">` inside `<header>`.
- `specs/c0de0012_reorder-sections-resume.md` is new. It is the plan the change followed: the target order, the header markup, and the checks to run.

`site/styles.css` is not in the diff. The `.links` rule is not scoped to a section, so the contact row takes the same styling inside the header.

No in-page anchors or navigation exist in the page, so no `href="#..."` values needed updating. Each section keeps its `id` and its `aria-labelledby` / `*-heading` pair.

## How to use or verify it

- Open `site/index.html` in a browser. The page should read: header (name, location, intro, email/GitHub/LinkedIn row), Education, Experience, Skills, Projects.
- Check the same order at desktop width and at phone width. The contact row should wrap at phone width.
- Check light and dark color schemes. TODO badges and TODO boxes should still appear.
- Run the validator: `npx --yes html-validate@11.15.0 --preset standard site/`
- Quick structural check: `grep -n '<section id=' site/index.html` should list `education`, `experience`, `skills`, `projects`, with no `links`.

The diff does not record the results of these checks. Only the code and the plan are in the change.
