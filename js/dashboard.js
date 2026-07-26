/* ═══════════════════════════════════════════════════════════════════════
   Dashboard — binder shelf with logos + completion at a glance.
   Reads the same localStorage keys as the binder engine (and legacy app).
   ═══════════════════════════════════════════════════════════════════════ */

const $  = id => document.getElementById(id);
const el = (tag, cls, html) => { const d = document.createElement(tag); if (cls) d.className = cls; if (html != null) d.innerHTML = html; return d; };

// ── Active binder list (legacy-compatible) ──────────────────────────────
const LS_ACTIVE = 'tcgplanner_active_binders_v1';
const DEFAULT_IDS = ['gardevoir','penny','m1l','m1s','m2','m2a','m3','m4','mew','sv9','m5','sv2d','sv2p','cbb5c','sv4a','twm'];

function getActive() {
  try { return JSON.parse(localStorage.getItem(LS_ACTIVE)) || null; } catch (e) { return null; }
}
function setActive(ids) { localStorage.setItem(LS_ACTIVE, JSON.stringify(ids)); }
function ensureDefaults() {
  const cur = getActive();
  if (!cur) return setActive([...DEFAULT_IDS]);
  const add = DEFAULT_IDS.filter(id => !cur.includes(id));
  if (add.length) setActive([...cur, ...add]);
}

// ── Render ──────────────────────────────────────────────────────────────
let filterQ = '';

function render() {
  const active = getActive() || [];
  const entries = window.CATALOG.filter(c => active.includes(c.id));
  const q = filterQ.trim().toLowerCase();
  const shown = q ? entries.filter(c => (c.name + ' ' + c.era + ' ' + (c.desc || '')).toLowerCase().includes(q)) : entries;

  // Global stats
  let gOwned = 0, gTotal = 0, gDone = 0;
  entries.forEach(c => {
    const n = lsCount(c.lsOwned);
    gOwned += Math.min(n, c.total); gTotal += c.total;
    if (c.total && n >= c.total) gDone++;
  });
  $('g-owned').textContent = gOwned.toLocaleString();
  $('g-total').textContent = gTotal.toLocaleString();
  $('g-binders').textContent = entries.length;
  $('g-complete').textContent = gDone;
  const pct = gTotal ? Math.round(gOwned / gTotal * 100) : 0;
  const R = 30, C = 2 * Math.PI * R;
  $('g-ring').innerHTML = `
    <svg width="76" height="76">
      <circle class="ring-bg" cx="38" cy="38" r="${R}" stroke-width="6"/>
      <circle class="ring-fg" cx="38" cy="38" r="${R}" stroke-width="6"
        stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/>
    </svg>
    <div class="ring-txt"><span class="ring-pct" style="font-size:15px">${pct}%</span></div>`;

  // Era groups (preserve catalog order)
  const eras = [];
  shown.forEach(c => {
    let g = eras.find(e => e.era === c.era);
    if (!g) { g = { era: c.era, items: [] }; eras.push(g); }
    g.items.push(c);
  });

  const main = $('eras');
  main.innerHTML = '';
  eras.forEach(g => {
    const sec = el('section', 'era');
    const head = el('div', 'era-head');
    head.appendChild(el('h2', null, g.era));
    head.appendChild(el('span', 'n', g.items.length + (g.items.length === 1 ? ' binder' : ' binders')));
    sec.appendChild(head);
    const grid = el('div', 'grid');
    g.items.forEach(c => grid.appendChild(binderCard(c)));
    sec.appendChild(grid);
    main.appendChild(sec);
  });
  if (!shown.length) main.appendChild(el('div', 'wl-empty', 'No binders match.'));
}

function binderCard(c) {
  const t = themeFor(c);
  const n = Math.min(lsCount(c.lsOwned), c.total);
  const pct = c.total ? Math.round(n / c.total * 100) : 0;
  const hasPage = !!c.page || !!c.file;
  const card = el('div', 'bcard glass' + (hasPage ? '' : ' soon'));
  if (t) card.style.setProperty('--a', t.accent);

  if (!hasPage) card.appendChild(el('span', 'bc-flag soon', 'Planned'));
  else if (pct >= 100) card.appendChild(el('span', 'bc-flag complete', '★ Complete'));

  const logo = el('div', 'bc-logo');
  const img = el('img');
  img.loading = 'lazy'; img.src = c.cover; img.alt = c.name;
  logo.appendChild(img);
  card.appendChild(logo);
  card.appendChild(el('div', 'bc-name', c.name));
  card.appendChild(el('div', 'bc-desc', c.desc || ''));
  card.appendChild(el('div', 'bc-prog',
    `<span class="bc-bar"><i style="width:${pct}%"></i></span><span class="bc-pct">${pct}%</span>`));
  card.appendChild(el('div', 'bc-count', `${n} / ${c.total} cards`));

  if (hasPage) card.addEventListener('click', () => {
    location.href = c.page || ('binder.html?set=' + c.id);
  });
  return card;
}

// ── Manage binders modal ────────────────────────────────────────────────
function openManage() {
  const active = new Set(getActive() || []);
  const box = $('mg-list');
  box.innerHTML = '';
  let lastEra = null;
  window.CATALOG.forEach(c => {
    if (c.era !== lastEra) { box.appendChild(el('div', 'mg-era', c.era)); lastEra = c.era; }
    const hasPage = !!c.page || !!c.file;
    const row = el('label', 'mg-row',
      `<input type="checkbox" data-id="${c.id}" ${active.has(c.id) ? 'checked' : ''}>
       <img src="${c.cover}" loading="lazy">
       <span class="mn">${c.name}<span>${c.total} cards${hasPage ? '' : ' · page not built yet'}</span></span>
       ${hasPage ? '' : '<span class="na">soon</span>'}`);
    box.appendChild(row);
  });
  $('mg').classList.add('open');
}

$('btn-manage').addEventListener('click', openManage);
$('mg-cancel').addEventListener('click', () => $('mg').classList.remove('open'));
$('mg').addEventListener('click', e => { if (e.target === $('mg')) $('mg').classList.remove('open'); });
$('mg-save').addEventListener('click', () => {
  const ids = [...document.querySelectorAll('#mg-list input:checked')].map(i => i.dataset.id);
  setActive(ids);
  $('mg').classList.remove('open');
  render();
});

let fTimer = null;
$('filter').addEventListener('input', e => {
  clearTimeout(fTimer);
  fTimer = setTimeout(() => { filterQ = e.target.value; render(); }, 150);
});

// ── Go ──────────────────────────────────────────────────────────────────
ensureDefaults();
render();
document.addEventListener('cloud-sync-applied', render);   // refresh in place, no reload
