/*
 * Reader for the Experience stories.
 *
 * Without this script every story is printed in full, and the copy is at a
 * readable size (the tiny styling only applies when <html> has the .js class).
 * With it, each story's headline becomes a button. Activating it zooms the
 * page toward that story while the page blurs and dims, then a reading frame
 * settles in the centre. Previous and Next slide to the neighbouring story.
 * Close (or Esc) zooms back out to the story shown, and the hash is cleared.
 */
(() => {
  const root = document.documentElement;
  const page = document.querySelector('.page');
  const section = document.getElementById('experience');
  if (!page || !section) return;

  const stories = Array.from(section.querySelectorAll('.stories > .story'));
  if (stories.length === 0) return;

  const ZOOM = 2.4;
  const BLUR = 'blur(3px) brightness(0.85)';
  const CLEAR = 'blur(0px) brightness(1)';
  const EASE_IN_OUT = 'cubic-bezier(0.6, 0, 0.2, 1)';
  const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const settled = (animation) => animation.finished.catch(() => {});
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let current = -1; // index shown in the reader, or -1 when closed
  let origin = -1; // index the reader was opened on
  let busy = false; // true while an open, close or slide runs

  /* ---------- Setup ---------- */

  stories.forEach((story, index) => {
    const title = story.querySelector('.story-title');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'story-open';
    button.setAttribute('aria-haspopup', 'dialog');
    button.append(...title.childNodes);
    title.append(button);
    button.addEventListener('click', () => open(index));
    button.addEventListener('blur', () => story.classList.remove('is-returning'));
  });

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function readerButton(label, arrow, side) {
    const button = el('button', 'reader-btn');
    button.type = 'button';
    if (side === 'before') {
      const glyph = el('span', '', arrow);
      glyph.setAttribute('aria-hidden', 'true');
      button.append(glyph, ' ');
    }
    button.append(label);
    if (side === 'after') {
      const glyph = el('span', '', arrow);
      glyph.setAttribute('aria-hidden', 'true');
      button.append(' ', glyph);
    }
    return button;
  }

  // The reader: a modal dialog holding one copy of a story and three buttons.
  const reader = el('dialog', 'reader');
  reader.setAttribute('aria-labelledby', 'reader-title');

  const frame = el('div', 'reader-frame');
  const sheet = el('div', 'reader-sheet');
  const bar = el('div', 'reader-bar');

  const prevButton = readerButton('Previous', '‹', 'before');
  const closeButton = readerButton('Close', '', '');
  closeButton.append(' ', el('kbd', '', 'Esc'));
  const nextButton = readerButton('Next', '›', 'after');
  bar.append(prevButton, closeButton, nextButton);

  const live = el('p', 'visually-hidden');
  live.setAttribute('aria-live', 'polite');

  frame.append(sheet, bar);
  reader.append(frame, live);
  document.body.append(reader);

  prevButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));
  closeButton.addEventListener('click', () => close());

  // Esc: stop the browser's own close and zoom out instead.
  reader.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });

  // Clicking the margin around the frame closes the reader.
  reader.addEventListener('click', (event) => {
    if (event.target === reader) close();
  });

  document.addEventListener('keydown', (event) => {
    if (!reader.open) return;
    if (event.key === 'Tab') {
      trapFocus(event);
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    }
  });

  // Tab cycles only through the reader's three buttons.
  function trapFocus(event) {
    const items = [prevButton, closeButton, nextButton];
    const i = items.indexOf(document.activeElement);
    let target;
    if (event.shiftKey) {
      target = i <= 0 ? items[items.length - 1] : items[i - 1];
    } else {
      target = i === -1 || i === items.length - 1 ? items[0] : items[i + 1];
    }
    event.preventDefault();
    target.focus();
  }

  /* ---------- Filling the reader ---------- */

  // Copy one story into the sheet, without ids and without the headline button.
  function fill(index) {
    const clone = stories[index].cloneNode(true);
    clone.removeAttribute('id');
    clone.removeAttribute('aria-labelledby');
    clone.classList.remove('story--lead', 'story--md', 'story--sm', 'is-returning');
    clone.classList.add('reader-story');
    clone.querySelectorAll('.story-open').forEach((button) => button.replaceWith(...button.childNodes));

    const title = clone.querySelector('.story-title');
    title.id = 'reader-title';
    title.tabIndex = -1;

    sheet.replaceChildren(clone);
    sheet.scrollTop = 0;
    prevButton.setAttribute('aria-disabled', String(index === 0));
    nextButton.setAttribute('aria-disabled', String(index === stories.length - 1));
  }

  function readerTitle() {
    return sheet.querySelector('#reader-title');
  }

  /* ---------- Page zoom ---------- */

  // Put the page's zoom origin at the centre of a story, in page coordinates.
  function setOrigin(story) {
    const s = story.getBoundingClientRect();
    const p = page.getBoundingClientRect();
    page.style.transformOrigin = `${s.left - p.left + s.width / 2}px ${s.top - p.top + s.height / 2}px`;
  }

  function zoomIn(story, motion) {
    // Reduced motion, or a deep link on load: the page stays put.
    if (!motion) return;
    setOrigin(story);
    page.animate(
      [
        { transform: 'scale(1)', filter: CLEAR },
        { transform: `scale(${ZOOM})`, filter: BLUR },
      ],
      { duration: 340, easing: EASE_IN_OUT, fill: 'forwards' }
    );
  }

  /* ---------- Open, step, close ---------- */

  async function open(index, { animate = true } = {}) {
    if (busy || current !== -1 || index < 0 || index >= stories.length) return;
    busy = true;

    const motion = animate && !reduceMotion();
    const story = stories[index];
    current = index;
    origin = index;

    // Set the hash first: it does not scroll and does not fire hashchange.
    history.replaceState(null, '', '#' + story.id);
    fill(index);
    live.textContent = '';
    root.classList.add('reader-open');
    frame.getAnimations().forEach((a) => a.cancel());

    zoomIn(story, motion);
    if (motion) await pause(200);

    reader.showModal();
    readerTitle().focus({ preventScroll: true });

    if (motion) {
      await settled(
        frame.animate(
          [
            { opacity: 0, transform: 'scale(0.6) rotate(-1.2deg)' },
            { opacity: 1, transform: 'scale(1.03) rotate(0.15deg)', offset: 0.7 },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 380, easing: EASE_OUT }
        )
      );
    }
    busy = false;
  }

  async function step(delta) {
    const target = current + delta;
    if (busy || current === -1 || target < 0 || target >= stories.length) return;
    busy = true;

    // The whole paper frame slides: out with a tilt, in with an overshoot and settle.
    const motion = !reduceMotion();
    if (motion) {
      await settled(
        frame.animate(
          [
            { opacity: 1, transform: 'none' },
            { opacity: 0, transform: `translateX(${-delta * 55}%) rotate(${-delta * 2.5}deg)` },
          ],
          { duration: 200, easing: 'ease-in', fill: 'forwards' }
        )
      );
    }

    current = target;
    fill(target);
    history.replaceState(null, '', '#' + stories[target].id);
    live.textContent = stories[target].querySelector('.story-title').textContent.trim();

    if (motion) {
      await settled(
        frame.animate(
          [
            { opacity: 0, transform: `translateX(${delta * 55}%) rotate(${delta * 2.5}deg)` },
            { opacity: 1, transform: `translateX(${-delta * 1.5}%) rotate(${-delta * 0.4}deg)`, offset: 0.72 },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 320, easing: EASE_OUT, fill: 'none' }
        )
      );
    }
    frame.getAnimations().forEach((a) => a.cancel());
    busy = false;
  }

  async function close({ animate = true } = {}) {
    if (busy || current === -1) return;
    busy = true;

    const motion = animate && !reduceMotion();
    const story = stories[current];

    if (motion) {
      await settled(
        frame.animate(
          [
            { opacity: 1, transform: 'none' },
            { opacity: 0, transform: 'scale(0.92)' },
          ],
          { duration: 200, easing: 'ease-in', fill: 'forwards' }
        )
      );
    }

    reader.close();

    // Cancel the page zoom, bring the story shown into view, then zoom back
    // out to it from the unzoomed layout.
    page.getAnimations().forEach((a) => a.cancel());
    page.style.transform = '';
    page.style.filter = '';
    if (current !== origin) story.scrollIntoView({ block: 'center' });
    current = -1;
    history.replaceState(null, '', location.pathname + location.search);

    if (motion) {
      setOrigin(story);
      await settled(
        page.animate(
          [
            { transform: `scale(${ZOOM})`, filter: BLUR },
            { transform: 'scale(1)', filter: CLEAR },
          ],
          { duration: 360, easing: EASE_OUT }
        )
      );
    }

    page.style.transformOrigin = '';
    root.classList.remove('reader-open');
    story.classList.add('is-returning');
    story.querySelector('.story-open').focus({ preventScroll: true });
    busy = false;
  }

  /* ---------- Deep links ---------- */

  function indexFromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    return stories.findIndex((story) => story.id === id);
  }

  window.addEventListener('hashchange', () => {
    const index = indexFromHash();
    if (index === -1 || busy || index === current) return;
    if (reader.open) {
      current = index;
      fill(index);
    } else {
      open(index);
    }
  });

  const initial = indexFromHash();
  if (initial !== -1) open(initial, { animate: false });
})();
