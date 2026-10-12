# Menswear-ad redesign and the Experience catalog

## What changed and why

The whole site now uses the look of 1948–1960 American menswear print ads. Light mode is cream "morning edition" paper with printed inks. Dark mode is a navy "night edition" with cream ink. Display type is Bodoni Moda, body copy is Libre Caslon Text, and a Yellowtail script is used for section kickers. There are no photos. Garments are simple inline SVG shapes.

Section order is unchanged: header, Education, Experience, Skills, Projects. A small colophon footer was added after Projects.

Experience is now a catalog. The spec considered three concepts (The Season's Catalog, The Wardrobe, The Swatch Book) and picked the Catalog. It borrows the garment progression from the Wardrobe and the stitched-label styling from the Swatch Book. The stated reason is that the Catalog is the only option that gives both an overview and direct access to any role, and it still works with JavaScript off.

- **Ticket index.** `nav.plate-index` lists six numbered tickets: a "Next Season" placeholder, then No. 1 to No. 5. Each ticket shows a garment figure, the role, and a date tag.
- **Plates.** Each ticket points to an `article.plate` with the same id. A plate shows a plate number, a tagline, the role as the headline, the company as a chip, the dates on a price tag, a figure, and the existing bullets. The first bullet has a drop cap. From 40rem up, the bullets are justified in two columns.
- **With JS** (`site/app.js`). The tickets become buttons. Selecting one shows its plate and hides the rest. Each open plate has Previous, Return to the catalog, and Next buttons. Esc closes the plate when focus is inside the Experience section. Selecting the open ticket again closes it. Focus moves to the plate heading when it opens and returns to the ticket when it closes.
- **Deep link.** Loading the page with `#role-intern` (or any plate id) opens that plate.
- **Without JS.** The tickets are plain anchor links that jump to their plates. Every plate prints in order with all of its bullets.

Motion is paper-like: plates slide in when opened, and Previous and Next turn the page. All of it sits inside `prefers-reduced-motion: no-preference`. With reduced motion, plates simply appear.

Supporting changes:
- The Education entry is styled as a sewn-in label.
- Skills is a card with dotted leaders.
- Projects is a grid of classified-ad style boxes. The TODO badges are rubber stamps.
- The favicon is recoloured to cream and oxblood.
- The fonts load from Google Fonts with `display=swap`. Every font stack ends in a system serif fallback.

All original text is kept, including every bullet, the TODO badges, and the TODO comments. The new text is decorative only: kickers ("Presenting", "Where the Cloth Was Cut", "The Particulars", "From the Workshop"), the headline dek, the plate taglines, and the "Coming Next Season" band. The spec ties each tagline to a bullet or date that already exists.

## Files

| File | Role |
|---|---|
| `site/index.html` | Markup and all content. Holds the SVG symbol sprite (seven garments), the ticket index, the six plates, the font links, and the `app.js` script tag. |
| `site/styles.css` | Colour tokens for both editions, all layout, the print styling, focus rings, and the motion rules. |
| `site/app.js` | New. About 127 lines of vanilla JS that enhance the Experience catalog. Returns early if the expected markup is missing. |
| `site/favicon.svg` | Recoloured icon. |
| `README.md` | Documents where content lives and the catalog's ticket/plate pairing. |
| `specs/c0de0013_menswear-ad-redesign.md` | The plan, including the three concepts and the reasons for the pick. |

## Maintaining the catalog

Each role lives in two places: a ticket in `nav.plate-index` and a plate in `.plates`. They are matched by `href="#id"` on the ticket and `id` on the plate. When a role changes, edit both, plus the ticket number, the tagline, the garment layers (`<use>` elements), and the ticket tag.

The 2024 to present role is a placeholder. Its ticket and plate carry the TODO comments. To fill it in, replace the title, company, and bullets, then remove the badge, the `todo` class, and the comments.

## How to verify

1. Validator: `npx --yes html-validate@11.15.0 --preset standard site/`.
2. JS syntax: `node --check site/app.js`.
3. Serve locally: `python3 -m http.server -d site 8000`.
4. Layout order: header, Education, Experience, Skills, Projects. Check at 1280px and at 375px. At 375px there should be no horizontal scroll.
5. Mouse: select each ticket, use Previous and Next, then Return and the Esc key.
6. Keyboard only: Tab to each ticket, press Enter or Space to open it, Tab to the controls, Esc to close. Focus should always be visible.
7. `aria-expanded` on the tickets should match the open plate.
8. JS disabled: all six plates are visible in order, with every bullet, and no controls appear.
9. Deep link: load `#role-intern` and confirm the Summer 2019 plate opens.
10. Reduced motion (emulated): plates appear without animation.
11. Dark mode: navy paper, cream ink, and "Night Edition" in the masthead.

## Notes

- The "Coming Next Season" band on the placeholder plate replaces the "R·U" sign-off on that plate. Both are `::after` rules, and the band's rule comes later in the stylesheet.
- No `.sep` rule appears in the diff, so the "·" between company and dates stays visible.
- This document was written from the diff. It does not record validator output, browser checks, or screenshots. The session folder holds screenshots and a quality directory, which were not read for this write-up.
