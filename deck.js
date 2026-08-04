(() => {
  const canvas = document.querySelector('.slide-canvas');
  const borrowerChapter = canvas.querySelector('.chapter[data-title="Borrower Channel"]');
  const borrowerUpdate = canvas.querySelector('.content.borrower');
  const firstLivePlatformSlide = canvas.querySelector('.content.live-platforms');
  const creditChapter = canvas.querySelector('.chapter[data-title="Credit Engine"]');
  const creditUpdate = canvas.querySelector('.content.credit');
  const financingChapter = canvas.querySelector('.chapter[data-title="Financing Products"]');

  // Executive flow: strategy → channel → platform implementation → credit → financing.
  canvas.insertBefore(borrowerChapter, firstLivePlatformSlide);
  canvas.insertBefore(borrowerUpdate, firstLivePlatformSlide);
  canvas.insertBefore(creditChapter, financingChapter);
  canvas.insertBefore(creditUpdate, financingChapter);

  const slides = [...document.querySelectorAll('.slide')];
  const counter = document.querySelector('#counter');
  const panel = document.querySelector('#overview-panel');
  const grid = document.querySelector('#overview-grid');
  let current = Math.max(0, Math.min(slides.length - 1, +(location.hash.match(/slide-(\d+)/) || [, 1])[1] - 1));

  const fit = () => canvas.style.setProperty('--scale', Math.min((innerWidth - 36) / 1440, (innerHeight - 36) / 810, 1.4));
  const render = (hash = true) => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === current);
      slide.setAttribute('aria-hidden', index !== current);
    });
    counter.textContent = `${current + 1} / ${slides.length}`;
    document.title = `${slides[current].dataset.title} — Manafa`;
    if (hash) history.replaceState(null, '', `#slide-${current + 1}`);
    [...grid.children].forEach((item, index) => item.classList.toggle('current', index === current));
  };
  const go = index => { current = Math.max(0, Math.min(slides.length - 1, index)); render(); };

  slides.forEach((slide, index) => {
    const button = document.createElement('button');
    button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><strong>${slide.dataset.title}</strong>`;
    button.onclick = () => { panel.classList.remove('open'); go(index); };
    grid.append(button);
  });

  document.querySelector('#prev').onclick = () => go(current - 1);
  document.querySelector('#next').onclick = () => go(current + 1);
  document.querySelector('#overview').onclick = () => panel.classList.add('open');
  document.querySelector('#close-overview').onclick = () => panel.classList.remove('open');
  document.querySelector('#fullscreen').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();

  const r61 = {
    admin: {
      label: 'ADMIN',
      items: [
        ['DF-4049', 'Storybook setup for internal design system'],
        ['DF-3908', 'Oracle SSO permission automation'],
        ['DF-4215', 'PM Board filter enhancement'],
        ['DF-4113', 'Automate facility creation from offer acceptance'],
        ['DF-4144', 'Revamp Admin header for new design system'],
        ['DF-4188', 'Invoice payer column and filter'],
        ['DF-4184', 'Design system component fixes'],
        ['DF-4174', 'Create manual financial offer']
      ]
    },
    crm: {
      label: 'CRM',
      items: [
        ['DF-3718', 'Lead Management in Sales CRM'],
        ['DF-4182', 'Reactivate eligible financed companies'],
        ['DF-4114', 'Onboarding V2 CRM impacts'],
        ['DF-4160', 'CRM Enhancements Part 6']
      ]
    },
    borrower: {
      label: 'BORROWER',
      items: [
        ['DF-3357', 'Borrower Activation Journey V2'],
        ['DF-4121', 'Borrower User Management Phase II'],
        ['DF-4102', 'Add more Borrower task types'],
        ['DF-4198', 'User Management post-launch enhancements'],
        ['DF-4011', 'Request Clearance Letter']
      ]
    },
    scf: {
      label: 'SCF',
      items: [
        ['DF-3957', 'Direct-to-Supplier Funding Model V1.0'],
        ['DF-4136', 'BNPP end-of-month fees reconciliation'],
        ['DF-4148', 'SAB financing requests timeline'],
        ['DF-4135', 'SAB Thursday timing enhancement'],
        ['DF-4194', 'Fees Management goal-seeking fixes'],
        ['DF-4091', 'Buyer maturity report enhancement'],
        ['DF-3832', 'SMBC Integration Manager — email'],
        ['DF-4021', 'SIC SCF onboarding requirements'],
        ['DF-3486', 'Auto-send supplier outreach report'],
        ['DF-4164', 'Merged SCF offer view permission'],
        ['DF-3492', 'AML fetch for companies and owners'],
        ['DF-3928', 'Buyer Profile Phase III'],
        ['DF-3936', 'J.P. Morgan financing calculation'],
        ['EMQ-5668', 'Admin AML issues to be fixed'],
        ['DF-4192', 'Supplier banking and payout accounts'],
        ['DF-3714', 'Standard Chartered B2B API Manager']
      ]
    }
  };

  const scopeView = document.querySelector('#scope-view');
  const showScope = key => {
    const data = r61[key];
    scopeView.innerHTML = `<header><h3>${data.label} Sprint</h3><small>${data.items.length} scoped initiatives</small></header><div>${data.items.map(item => `<article><b>${item[0]}</b><h4>${item[1]}</h4></article>`).join('')}</div>`;
    document.querySelectorAll('.r61 nav button').forEach(button => button.classList.toggle('active', button.dataset.scope === key));
  };
  document.querySelectorAll('.r61 nav button').forEach(button => button.onclick = () => showScope(button.dataset.scope));
  if (scopeView) showScope('admin');

  const stageClass = value => {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized || normalized === '—' || normalized === '-') return 'is-empty';
    if (normalized.includes('done') || normalized.includes('live') || normalized.includes('completed')) return 'is-done';
    if (normalized.includes('progress') || normalized.includes('partially') || normalized.includes('queue')) return 'is-progress';
    if (normalized.includes('planned') || normalized.includes('pending') || normalized.includes('not started') || normalized.includes('to do') || normalized.includes('tbd') || normalized.includes('unspecified')) return 'is-planned';
    return '';
  };

  const buildHubExplorers = () => {
    const hubs = window.MANAFA_HUB_ROADMAPS || [];
    document.querySelectorAll('.hub-explorer[data-hub-id]').forEach(explorer => {
      const hub = hubs.find(item => item.id === explorer.dataset.hubId);
      if (!hub) return;
      const tabs = document.createElement('div');
      const panels = document.createElement('div');
      const tabButtons = [];
      const productPanels = [];
      tabs.className = 'hub-tabs';
      tabs.setAttribute('role', 'tablist');
      tabs.setAttribute('aria-label', `${hub.title} products`);
      panels.className = 'hub-panels';

      const activate = (index, focus = false) => {
        tabButtons.forEach((button, buttonIndex) => {
          const active = buttonIndex === index;
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-selected', String(active));
          button.tabIndex = active ? 0 : -1;
          productPanels[buttonIndex].hidden = !active;
        });
        if (focus) tabButtons[index].focus();
      };

      hub.products.forEach((product, index) => {
        const button = document.createElement('button');
        const panel = document.createElement('section');
        button.type = 'button';
        button.className = 'hub-tab';
        button.textContent = product.label;
        button.setAttribute('role', 'tab');
        button.onclick = () => activate(index);
        button.onkeydown = event => {
          let next = index;
          if (event.key === 'ArrowRight') next = (index + 1) % hub.products.length;
          else if (event.key === 'ArrowLeft') next = (index - 1 + hub.products.length) % hub.products.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = hub.products.length - 1;
          else return;
          event.preventDefault();
          event.stopPropagation();
          activate(next, true);
        };

        panel.className = 'hub-panel';
        panel.hidden = index !== 0;
        const meta = document.createElement('div');
        meta.className = 'hub-product-meta';
        meta.innerHTML = `<div><h3>${product.title}</h3><p>Owner · ${product.owner}   |   Source updated · ${product.updated}</p></div><a href="${product.source}" target="_blank" rel="noreferrer">Open source</a>`;
        panel.append(meta);

        if (product.note) {
          const note = document.createElement('p');
          note.className = 'hub-source-note';
          note.textContent = product.note;
          panel.append(note);
        }

        if (!product.rows.length) {
          const empty = document.createElement('div');
          empty.className = 'hub-empty-state';
          empty.innerHTML = '<strong>No defined delivery rows</strong><span>The source strategy or roadmap does not contain committed stage dates.</span>';
          panel.append(empty);
        } else {
          const scroll = document.createElement('div');
          const table = document.createElement('table');
          const thead = document.createElement('thead');
          const tbody = document.createElement('tbody');
          const headers = ['Component', 'Sub-item', 'Status', 'Scope / Analysis', 'User Experience', 'Requirement Documentation', 'Tech Delivery'];
          const headRow = document.createElement('tr');
          scroll.className = 'hub-table-scroll';
          scroll.tabIndex = 0;
          table.className = 'hub-delivery-table';
          headers.forEach(label => { const th = document.createElement('th'); th.textContent = label; headRow.append(th); });
          thead.append(headRow);
          product.rows.forEach(roadmapRow => {
            const tr = document.createElement('tr');
            if (roadmapRow.phase) {
              tr.className = 'hub-phase-row';
              const th = document.createElement('th');
              th.colSpan = headers.length;
              th.textContent = roadmapRow.phase;
              tr.append(th);
            } else {
              const component = document.createElement('th');
              const subItem = document.createElement('td');
              component.innerHTML = `<strong>${roadmapRow.item}</strong>`;
              subItem.innerHTML = roadmapRow.detail ? `<span class="hub-subitem">${roadmapRow.detail}</span>` : '<span class="hub-subitem hub-subitem--empty">—</span>';
              tr.append(component, subItem);
              [roadmapRow.overall, roadmapRow.scope, roadmapRow.ux, roadmapRow.requirements, roadmapRow.tech].forEach(value => {
                const td = document.createElement('td');
                td.innerHTML = `<span class="hub-stage ${stageClass(value)}">${value || '—'}</span>`;
                tr.append(td);
              });
            }
            tbody.append(tr);
          });
          table.append(thead, tbody);
          scroll.append(table);
          panel.append(scroll);
        }
        tabs.append(button);
        panels.append(panel);
        tabButtons.push(button);
        productPanels.push(panel);
      });
      explorer.append(tabs, panels);
      activate(0);
    });
  };
  buildHubExplorers();

  addEventListener('resize', fit);
  addEventListener('hashchange', () => {
    current = Math.max(0, Math.min(slides.length - 1, +(location.hash.match(/slide-(\d+)/) || [, 1])[1] - 1));
    render(false);
  });
  addEventListener('keydown', event => {
    if (panel.classList.contains('open')) {
      if (event.key === 'Escape') panel.classList.remove('open');
      return;
    }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); go(current + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); go(current - 1); }
    else if (event.key === 'Home') go(0);
    else if (event.key === 'End') go(slides.length - 1);
    else if (event.key.toLowerCase() === 'o') panel.classList.add('open');
  });

  fit();
  render();
})();
