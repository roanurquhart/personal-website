/*
 * Zoom viewer for the Experience ads.
 *
 * The page works without this script: every ad is printed in full.
 * With it, each ad's headline becomes a button. Pressing it zooms the ad
 * from its spot on the page into a modal viewer, with Previous, Next and
 * Close. Close (or Esc) zooms back out to the same spot.
 */
(() => {
  const section = document.getElementById('experience');
  if (!section) return;

  const ads = Array.from(section.querySelectorAll('.ads > .ad'));
  if (ads.length === 0) return;

  const root = document.documentElement;
  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = -1; // index of the ad shown in the viewer, or -1 when closed
  let origin = -1; // index of the ad the reader first opened
  let busy = false; // true while a view transition runs

  /* ---------- Setup ---------- */

  // Turn each headline into a button, keeping the heading element around it.
  ads.forEach((ad) => {
    const heading = ad.querySelector('h3');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ad-open';
    button.setAttribute('aria-haspopup', 'dialog');
    button.append(...heading.childNodes);
    heading.append(button);
    button.addEventListener('click', () => open(ads.indexOf(ad)));
  });

  const hint = section.querySelector('.ads-hint');
  if (hint) hint.hidden = false;
  section.classList.add('is-enhanced');

  // Build the viewer dialog once.
  const dialog = document.createElement('dialog');
  dialog.className = 'ad-viewer';
  dialog.setAttribute('aria-labelledby', 'ad-viewer-title');

  const sheet = document.createElement('div');
  sheet.className = 'ad-viewer-sheet';

  const bar = document.createElement('div');
  bar.className = 'ad-viewer-bar';

  const prevButton = makeButton('Previous', '‹', 'before');
  const closeButton = makeButton('Close', '', 'after');
  closeButton.insertAdjacentHTML('beforeend', ' <kbd>Esc</kbd>');
  const nextButton = makeButton('Next', '›', 'after');

  bar.append(prevButton, closeButton, nextButton);

  const live = document.createElement('p');
  live.className = 'visually-hidden';
  live.setAttribute('aria-live', 'polite');

  dialog.append(sheet, bar, live);
  document.body.append(dialog);

  function makeButton(label, arrow, arrowSide) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ad-viewer-btn';
    if (arrow && arrowSide === 'before') {
      button.insertAdjacentHTML('beforeend', `<span aria-hidden="true">${arrow}</span> `);
    }
    button.append(label);
    if (arrow && arrowSide === 'after') {
      button.insertAdjacentHTML('beforeend', ` <span aria-hidden="true">${arrow}</span>`);
    }
    return button;
  }

  prevButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));
  closeButton.addEventListener('click', () => close());

  // Esc: stop the browser's own close and zoom out instead, so the page can
  // return to the same spot.
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });

  // Clicking the empty margin around the sheet closes the viewer.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  // If the browser closed the dialog by itself (for example, a second Esc),
  // tidy up without an animation.
  dialog.addEventListener('close', () => {
    if (current === -1) return;
    const src = ads[current];
    dismiss();
    src.querySelector('.ad-open').focus({ preventScroll: true });
  });

  // Arrow keys step between ads while the viewer is open.
  document.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    }
  });

  /* ---------- Filling the viewer ---------- */

  // Copy one ad into the sheet, without ids and without the headline button.
  function render(index) {
    const clone = ads[index].cloneNode(true);
    // The source may carry a transition name at this moment; the copy must not.
    clone.style.viewTransitionName = '';
    clone.removeAttribute('id');
    clone.removeAttribute('aria-labelledby');
    clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    clone.querySelectorAll('[aria-labelledby]').forEach((el) =>
      el.removeAttribute('aria-labelledby')
    );
    clone.querySelectorAll('.ad-open').forEach((button) => button.replaceWith(...button.childNodes));
    clone.classList.remove('ad--lg', 'ad--md', 'ad--sm', 'ad--reserved', 'ad--halftone');
    clone.classList.add('ad--zoomed');

    const title = clone.querySelector('h3');
    title.id = 'ad-viewer-title';
    title.tabIndex = -1;

    sheet.replaceChildren(clone);
    updateNav(index);
  }

  function updateNav(index) {
    prevButton.setAttribute('aria-disabled', String(index <= 0));
    nextButton.setAttribute('aria-disabled', String(index >= ads.length - 1));
  }

  function titleText(index) {
    return ads[index].querySelector('h3').textContent.trim();
  }

  // Move to another ad inside the open viewer. Focus stays on the button pressed.
  function go(index, direction) {
    if (busy || index === current || index < 0 || index >= ads.length) return;
    current = index;
    history.replaceState(null, '', '#' + ads[index].id);
    render(index);
    live.textContent = titleText(index);

    if (direction !== 0 && !reduceMotion() && sheet.animate) {
      sheet.animate(
        [
          { opacity: 0, transform: `translateX(${direction * 1.5}rem)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 250, easing: 'ease-out' }
      );
    }
  }

  function step(delta) {
    if (current === -1) return;
    const target = current + delta;
    if (target < 0 || target >= ads.length) return;
    go(target, delta);
  }

  /* ---------- Zoom in and out ---------- */

  // Run the change as a view transition when the browser has one and motion
  // is allowed. Otherwise: a scale-in on open, a fade-out before close, and
  // no motion at all for reduced motion.
  function runChange(update, { animate, src, fromViewer }) {
    const motion = animate && !reduceMotion();

    if (motion && document.startViewTransition) {
      busy = true;
      if (src) src.style.viewTransitionName = 'ad-zoom';
      if (fromViewer) sheet.style.viewTransitionName = 'ad-zoom';
      const transition = document.startViewTransition(update);
      const done = () => {
        sheet.style.viewTransitionName = '';
        ads.forEach((ad) => { ad.style.viewTransitionName = ''; });
        busy = false;
      };
      transition.finished.then(done, done);
      return;
    }

    if (!motion) {
      update();
      return;
    }

    if (fromViewer) {
      busy = true;
      const fade = sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-in' });
      const finish = () => {
        update();
        busy = false;
      };
      fade.finished.then(finish, finish);
      return;
    }

    update();
    sheet.animate(
      [
        { opacity: 0, transform: 'scale(0.96)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 300, easing: 'ease-out' }
    );
  }

  function open(index, { animate = true } = {}) {
    if (busy || index < 0 || index >= ads.length) return;
    const src = ads[index];

    // Set the hash first: it does not scroll and does not fire hashchange.
    history.replaceState(null, '', '#' + src.id);

    const update = () => {
      current = index;
      origin = index;
      render(index);
      live.textContent = '';
      src.style.viewTransitionName = '';
      sheet.style.viewTransitionName = 'ad-zoom';
      root.classList.add('ad-zoomed');
      if (!dialog.open) dialog.showModal();
      sheet.querySelector('#ad-viewer-title').focus({ preventScroll: true });
    };

    runChange(update, { animate, src, fromViewer: false });
  }

  function close({ animate = true } = {}) {
    if (busy || current === -1) return;
    const src = ads[current];

    // Only scroll if the reader paged to a different ad. This runs before
    // the transition takes its snapshot, while the viewer still covers the page.
    if (current !== origin) src.scrollIntoView({ block: 'nearest' });

    const update = () => {
      sheet.style.viewTransitionName = '';
      src.style.viewTransitionName = 'ad-zoom';
      dismiss();
      src.querySelector('.ad-open').focus({ preventScroll: true });
    };

    // Only the viewer is named before the snapshot; the source gets its name
    // inside update, so the new state is the one that carries it.
    runChange(update, { animate, src: null, fromViewer: true });
  }

  // Shared cleanup for every way the viewer closes.
  function dismiss() {
    current = -1;
    if (dialog.open) dialog.close();
    root.classList.remove('ad-zoomed');
    history.replaceState(null, '', location.pathname + location.search);
  }

  /* ---------- Deep links ---------- */

  function indexFromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    return ads.findIndex((ad) => ad.id === id);
  }

  window.addEventListener('hashchange', () => {
    const index = indexFromHash();
    if (index === -1) return;
    if (dialog.open) {
      go(index, index > current ? 1 : -1);
    } else {
      open(index);
    }
  });

  const initial = indexFromHash();
  if (initial !== -1) {
    ads[initial].scrollIntoView({ block: 'center' });
    open(initial, { animate: false });
  }
})();
