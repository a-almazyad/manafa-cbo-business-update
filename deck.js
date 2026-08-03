(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const canvas = document.querySelector('.slide-canvas');
  const counter = document.getElementById('counter');
  const panel = document.getElementById('overview-panel');
  const grid = document.getElementById('overview-grid');
  let current = Math.min(slides.length - 1, Math.max(0, Number((location.hash.match(/slide-(\d+)/) || [0, 1])[1]) - 1));

  const fit = () => {
    const scale = Math.min((innerWidth - 44) / 1440, (innerHeight - 44) / 810, 1.35);
    canvas.style.setProperty('--scale', Math.max(.1, scale).toFixed(4));
  };
  const render = (updateHash = true) => {
    slides.forEach((slide, index) => {
      const active = index === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    counter.textContent = `${current + 1} / ${slides.length}`;
    document.title = `${slides[current].dataset.title} — Manafa`;
    if (updateHash) history.replaceState(null, '', `#slide-${current + 1}`);
    [...grid.children].forEach((item, index) => item.classList.toggle('is-current', index === current));
  };
  const go = index => { current = Math.min(slides.length - 1, Math.max(0, index)); render(); };
  slides.forEach((slide, index) => {
    const item = document.createElement('button');
    item.type = 'button'; item.className = 'overview-item';
    item.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><strong>${slide.dataset.title}</strong>`;
    item.addEventListener('click', () => { panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); go(index); });
    grid.appendChild(item);
  });

  document.querySelectorAll('.subnav, .partner-nav').forEach(tablist => {
    const buttons = [...tablist.querySelectorAll('[data-tab]')];
    const slide = tablist.closest('.slide');
    const activate = (button, focus = false) => {
      const target = button.dataset.tab;
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      slide.querySelectorAll('[data-panel]').forEach(item => {
        const active = item.dataset.panel === target;
        item.classList.toggle('is-active', active);
        item.hidden = !active;
      });
      if (focus) button.focus();
    };
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(button));
      button.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        else return;
        event.preventDefault();
        event.stopPropagation();
        activate(buttons[next], true);
      });
    });
  });
  const requestedPanel = new URLSearchParams(location.search).get('panel');
  if (requestedPanel) document.querySelector(`[data-tab="${CSS.escape(requestedPanel)}"]`)?.click();
  document.getElementById('prev').addEventListener('click', () => go(current - 1));
  document.getElementById('next').addEventListener('click', () => go(current + 1));
  document.getElementById('overview').addEventListener('click', () => { panel.classList.add('is-open'); panel.setAttribute('aria-hidden', 'false'); });
  document.getElementById('close-overview').addEventListener('click', () => { panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); });
  document.getElementById('fullscreen').addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  document.getElementById('print').addEventListener('click', () => window.print());
  addEventListener('resize', fit);
  addEventListener('hashchange', () => { current = Math.min(slides.length - 1, Math.max(0, Number((location.hash.match(/slide-(\d+)/) || [0, 1])[1]) - 1)); render(false); });
  addEventListener('keydown', event => {
    if (panel.classList.contains('is-open')) { if (event.key === 'Escape') document.getElementById('close-overview').click(); return; }
    if (event.target instanceof Element && event.target.closest('.subnav, .partner-nav')) return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); go(current + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); go(current - 1); }
    else if (event.key === 'Home') go(0); else if (event.key === 'End') go(slides.length - 1);
    else if (event.key.toLowerCase() === 'o') document.getElementById('overview').click();
    else if (event.key.toLowerCase() === 'f') document.getElementById('fullscreen').click();
  });
  fit(); render();
})();
