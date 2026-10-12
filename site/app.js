// Progressive enhancement for the Experience catalog. The page is complete without this file.
(() => {
  const section = document.getElementById('experience');
  if (!section) return;

  const navLinks = [...section.querySelectorAll('.plate-index a.plate-link')];
  const allPlates = [...section.querySelectorAll('.plates .plate')];
  if (!navLinks.length || navLinks.length !== allPlates.length) return;

  // Pair each ticket with the plate its href names, in ticket order.
  const pairs = navLinks.map((link) => ({
    link,
    plate: allPlates.find((p) => p.id === link.getAttribute('href').slice(1)),
  }));
  if (pairs.some((pair) => !pair.plate)) return;

  const plates = pairs.map((pair) => pair.plate);
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = -1;

  // Swap each link for a button, moving the child nodes so the markup is kept.
  const tickets = pairs.map(({ link, plate }, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `${link.className} plate-ticket`;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', plate.id);
    button.dataset.index = String(i);
    while (link.firstChild) button.appendChild(link.firstChild);
    link.replaceWith(button);
    return button;
  });

  const arrow = (glyph) => {
    const span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    span.textContent = glyph;
    return span;
  };

  // Prepare each plate: hide it, make its heading a focus target, add the controls.
  plates.forEach((plate, i) => {
    plate.hidden = true;
    plate.querySelector('h3').tabIndex = -1;

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'ctl ctl-prev';
    prev.append(arrow('‹ '), 'Previous plate');
    prev.hidden = i === 0;
    prev.addEventListener('click', () => open(i - 1, { direction: 'prev' }));

    const ret = document.createElement('button');
    ret.type = 'button';
    ret.className = 'ctl ctl-return';
    const esc = document.createElement('kbd');
    esc.textContent = 'Esc';
    ret.append('Return to the catalog ', esc);
    ret.addEventListener('click', () => close());

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'ctl ctl-next';
    next.append('Next plate', arrow(' ›'));
    next.hidden = i === plates.length - 1;
    next.addEventListener('click', () => open(i + 1, { direction: 'next' }));

    const controls = document.createElement('div');
    controls.className = 'plate-controls';
    controls.append(prev, ret, next);
    plate.append(controls);
  });

  function open(i, { direction = 'in', focus = true } = {}) {
    if (i < 0 || i >= plates.length) return;
    if (current !== -1 && current !== i) plates[current].hidden = true;

    const plate = plates[i];
    plate.hidden = false;
    plate.classList.remove('plate-enter', 'plate-enter--in', 'plate-enter--next', 'plate-enter--prev');
    void plate.offsetWidth; // restart the paper-slide animation
    plate.classList.add('plate-enter', `plate-enter--${direction}`);

    tickets.forEach((ticket, j) => ticket.setAttribute('aria-expanded', String(j === i)));
    section.classList.add('has-open');
    current = i;

    if (focus) {
      plate.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
      plate.querySelector('h3').focus({ preventScroll: true });
    }
  }

  function close() {
    if (current === -1) return;
    const i = current;
    plates[i].hidden = true;
    tickets.forEach((ticket) => ticket.setAttribute('aria-expanded', 'false'));
    section.classList.remove('has-open');
    current = -1;
    tickets[i].focus();
  }

  tickets.forEach((ticket, i) => {
    ticket.addEventListener('click', () => {
      if (current === i) close();
      else open(i);
    });
  });

  // Esc closes the plate only when focus is inside the Experience section.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || current === -1) return;
    if (!section.contains(document.activeElement)) return;
    e.preventDefault();
    close();
  });

  section.classList.add('is-enhanced');

  // Deep link: #role-intern opens that plate without changing history.
  const start = plates.findIndex((p) => p.id === location.hash.slice(1));
  if (start !== -1) {
    open(start, { focus: false });
    plates[start].scrollIntoView({ block: 'start' });
  }
})();
