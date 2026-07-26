/* ═══════════════════════════════════════════════════════════════════════
   Binder engine — one page renders any registered set.
   Reads ?set=<id>, loads data/sets/<id>.js, merges with DEFAULT_SET.
   Storage keys are identical to the legacy per-page app, so all owned /
   watched / price data carries over untouched.
   ═══════════════════════════════════════════════════════════════════════ */

const SET_ID = new URLSearchParams(location.search).get('set');

const $  = id => document.getElementById(id);
const el = (tag, cls, html) => { const d = document.createElement(tag); if (cls) d.className = cls; if (html != null) d.innerHTML = html; return d; };

// ── Boot: dynamically load the set's data file ──────────────────────────
(function boot() {
  if (!SET_ID) return fail('No set specified.');
  const s = document.createElement('script');
  s.src = 'data/sets/' + SET_ID + '.js';
  s.onload = () => window.SETS[SET_ID] ? init(window.SETS[SET_ID]) : fail('Set file loaded but nothing registered.');
  s.onerror = () => fail(`No data file found for “${SET_ID}”.`);
  document.head.appendChild(s);
})();

function fail(msg) {
  document.body.innerHTML = `<div class="err glass"><h2 style="margin-bottom:10px">Binder not found</h2>
    <p style="color:var(--dim);font-size:14px">${msg}</p>
    <p style="margin-top:18px"><a class="btn primary" href="index.html">← Back to all binders</a></p></div>`;
}

// ═════════════════════════════════ INIT ═════════════════════════════════
function init(SET) {
  const B      = SET.binder;
  const SLOTS  = SET.slots;
  const TOTAL  = SLOTS.length;
  const sk     = SET.sk || (s => s.id);
  const bc     = s => SET.bc[s.v] || SET.bcDefault;
  const entry  = catalogEntry(SET_ID);

  // Theme + chrome
  applyTheme(entry);
  document.title = B.title;
  $('hero-title').textContent = B.title;
  $('hero-sub').textContent = B.subtitle;
  $('nav-name').textContent = B.navTitle;
  if (entry && entry.cover) { $('hero-logo').src = entry.cover; $('hero-logo').hidden = false; }
  B.legend.forEach(l => $('hero-legend').appendChild(
    el('span', 'chip', `<span class="dot" style="background:${l.color}"></span>${l.label}`)));

  // ── Storage (legacy-compatible) ───────────────────────────────────────
  let owned = new Set(), watched = new Set(), prices = {};
  function load() {
    try { owned   = new Set(JSON.parse(localStorage.getItem(B.lsOwned)   || '[]')); } catch (e) {}
    try { watched = new Set(JSON.parse(localStorage.getItem(B.lsWatched) || '[]')); } catch (e) {}
    try { prices  = JSON.parse(localStorage.getItem(B.lsPrices) || '{}'); } catch (e) {}
  }
  const saveOwned   = () => localStorage.setItem(B.lsOwned,   JSON.stringify([...owned]));
  const saveWatched = () => localStorage.setItem(B.lsWatched, JSON.stringify([...watched]));
  const savePrices  = () => localStorage.setItem(B.lsPrices,  JSON.stringify(prices));

  // ── Layout (legacy-compatible key) ────────────────────────────────────
  const LS_LAYOUT = (B.lsOwned || 'binder').replace(/owned.*/, 'layout_v1');
  const PRESETS = [
    {c:2,r:2},{c:3,r:2},{c:2,r:3},{c:3,r:3},{c:4,r:3},{c:3,r:4},{c:4,r:4},{c:5,r:4},{c:5,r:5},
  ];
  let cols = B.cols || 3, rows = B.cols || 3, sheets = B.sheets || 20;
  try {
    const sv = JSON.parse(localStorage.getItem(LS_LAYOUT));
    if (sv && sv.cols && sv.rows) { cols = sv.cols; rows = sv.rows; }
    if (sv && sv.sheets) sheets = sv.sheets;
  } catch (e) {}
  const saveLayout = () => localStorage.setItem(LS_LAYOUT, JSON.stringify({ cols, rows, sheets }));

  const spp        = () => cols * rows;
  const pageCount  = () => Math.ceil(TOTAL / spp());           // pages that hold cards
  const pagesPerBinder = () => sheets * 2;                     // each sheet holds cards front & back
  const binderCount = () => Math.max(1, Math.ceil(pageCount() / pagesPerBinder()));
  const capacity   = () => binderCount() * pagesPerBinder();   // physical pages incl. empty
  const spreadMax  = () => Math.ceil((capacity() + 1) / 2);    // page 0 = cover
  const pageSlots  = p => SLOTS.slice((p - 1) * spp(), p * spp());
  const spreadOf   = p => Math.ceil((p + 1) / 2);              // which spread shows page p

  // ── State ─────────────────────────────────────────────────────────────
  let curSpread = 1, curPage = 0, view = 'binder', q = '', hideOwned = false, secFilter = -1;

  // Mobile: navigate one page at a time instead of two-page spreads
  // phones portrait OR any coarse-pointer device up to 1000px (landscape phones, small tablets)
  const mq = window.matchMedia('(max-width: 700px), ((pointer: coarse) and (max-width: 1000px))');
  const isSingle = () => mq.matches;
  const maxPage = () => capacity() + 1;                    // + inside back cover
  mq.addEventListener('change', () => {
    if (isSingle()) curPage = Math.max(0, 2 * curSpread - 2);
    else curSpread = Math.ceil((curPage + 1) / 2);
    if (view === 'binder') renderSpread();
  });

  // Remember reading position per binder (per device)
  const LS_POS = (B.lsOwned || 'binder').replace(/owned.*/, 'binderpos_v1');
  try {
    const pos = JSON.parse(localStorage.getItem(LS_POS));
    if (pos) { curSpread = pos.s || 1; curPage = pos.p || 0; }
  } catch (e) {}
  const savePos = () => { try { localStorage.setItem(LS_POS, JSON.stringify({ s: curSpread, p: curPage })); } catch (e) {} };

  // ═════════════════════════════ RENDERERS ═════════════════════════════

  // Slot tile (shared by binder + gallery)
  function makeSlot(s) {
    const key = sk(s), c = bc(s);
    const d = el('div', 'slot' + (owned.has(key) ? ' owned' : ''));
    d.style.setProperty('--bc', c.col);
    d.style.setProperty('--bcbg', c.bg);
    d.dataset.key = key;
    const img = el('img');
    img.loading = 'lazy'; img.src = s.img; img.alt = s.name;
    if (s.img2) img.onerror = () => { img.onerror = null; img.src = s.img2; };  // fallback scan
    d.appendChild(img);
    // reverse-holo variants share the base card's image — differentiate visually
    if ((SET.reverseVs || []).includes(s.v)) {
      d.appendChild(el('div', 'holo'));
      const m = s.name.match(/\(([^)]+)\)\s*$/);
      const label = m ? m[1].replace(/\s*RH$/i, '') || 'RH' : 'RH';
      const chip = el('span', 'vchip', label === '' ? 'RH' : label);
      chip.style.setProperty('--bc', c.col);
      d.appendChild(chip);
    }
    d.appendChild(el('div', 'cap', `<span class="cid">${s.id}</span>${s.name}`));
    if (watched.has(key)) d.appendChild(el('span', 'bdg wat', '⭐'));
    if (prices[key] && prices[key].raw) d.appendChild(el('span', 'bdg prc', '$'));
    // hold (long-press) = big preview; guards the click toggle afterwards
    let lpTimer = null, lpFired = false;
    d.addEventListener('touchstart', () => {
      lpFired = false;
      lpTimer = setTimeout(() => { lpFired = true; openPeek(s); }, 420);
    }, { passive: true });
    d.addEventListener('touchmove', () => clearTimeout(lpTimer), { passive: true });
    d.addEventListener('touchend', e => {
      clearTimeout(lpTimer);
      if (lpFired) e.preventDefault();     // swallow the synthetic click
    }, { passive: false });

    d.addEventListener('click', () => {
      if (lpFired) { lpFired = false; return; }
      // flip animation: state swaps at the halfway point (card edge-on)
      d.classList.add('flipping');
      setTimeout(() => {
        owned.has(key) ? owned.delete(key) : owned.add(key);
        saveOwned();
        refreshSlots(key); updateProgress();
      }, 240);
      d.addEventListener('animationend', () => {
        d.classList.remove('flipping');
        if (hideOwned) view === 'gallery' ? renderGallery() : renderSpread();
      }, { once: true });
    });
    d.addEventListener('contextmenu', e => {
      e.preventDefault();
      if (lpFired || $('peek').classList.contains('open')) return;  // long-press already handled it
      openModal(s);
    });
    return d;
  }

  // Update every rendered tile for a key (binder + gallery may both show it)
  function refreshSlots(key) {
    document.querySelectorAll(`.slot[data-key="${CSS.escape(key)}"]`).forEach(d => {
      d.classList.toggle('owned', owned.has(key));
      let b = d.querySelector('.bdg.wat');
      if (watched.has(key) && !b) d.appendChild(el('span', 'bdg wat', '⭐'));
      if (!watched.has(key) && b) b.remove();
    });
  }

  // Progress: hero stats + ring + page map + section chips
  function updateProgress() {
    const n = owned.size, pct = TOTAL ? Math.round(n / TOTAL * 100) : 0;
    $('st-owned').textContent = n;
    $('st-missing').textContent = TOTAL - n;
    $('st-watched').textContent = watched.size;
    drawRing(pct, n);
    renderPageMap();
    renderSections();
  }

  function drawRing(pct, n) {
    const R = 34, C = 2 * Math.PI * R;
    $('ring').innerHTML = `
      <svg width="86" height="86">
        <circle class="ring-bg" cx="43" cy="43" r="${R}" stroke-width="7"/>
        <circle class="ring-fg" cx="43" cy="43" r="${R}" stroke-width="7"
          stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/>
      </svg>
      <div class="ring-txt"><span class="ring-pct">${pct}%</span><span class="ring-sub">${n}/${TOTAL}</span></div>`;
  }

  // ── Page map: one mini-page per binder page, filled by completion ─────
  function renderPageMap() {
    const P = pageCount(), CAP = capacity(), PPB = pagesPerBinder(), row = $('pm-row');
    row.innerHTML = '';
    let done = 0;
    for (let p = 1; p <= CAP; p++) {
      // label each physical binder when the set spans more than one
      if (binderCount() > 1 && (p - 1) % PPB === 0)
        row.appendChild(el('div', 'pm-binder-label', `Binder ${Math.ceil(p / PPB)}`));
      const blank = p > P;
      const slots = blank ? [] : pageSlots(p);
      const got = slots.filter(s => owned.has(sk(s))).length;
      const full = !blank && got === slots.length;
      if (full) done++;
      const d = el('div', 'pm-page' + (full ? ' done' : '') + (blank ? ' blank' : ''));
      d.dataset.p = p;
      const isCur = isSingle() ? p === curPage : spreadOf(p) === curSpread;
      if (view === 'binder' && isCur) d.classList.add('cur');
      d.title = blank ? `Page ${p} — empty` : `Page ${p} — ${got}/${slots.length}`;
      d.appendChild(el('span', 'pn', p));
      if (!blank) {
        const f = el('div', 'fill');
        f.style.height = (got / slots.length * 100) + '%';
        d.appendChild(f);
      }
      d.addEventListener('click', () => { setView('binder'); goToPage(p); });
      // hover: highlight both pages of the spread this page belongs to
      d.addEventListener('mouseenter', () => {
        const partner = p % 2 === 0 ? p + 1 : p - 1;   // pages pair as (2,3),(4,5)…; 1 pairs with the cover
        [p, partner].forEach(n => {
          const m = row.querySelector(`.pm-page[data-p="${n}"]`);
          if (m) m.classList.add('hl');
        });
      });
      d.addEventListener('mouseleave', () => row.querySelectorAll('.pm-page.hl').forEach(m => m.classList.remove('hl')));
      row.appendChild(d);
    }
    $('pm-sub').textContent = `${done}/${P} card pages complete · ${cols}×${rows} pockets · ` +
      (binderCount() > 1 ? `${binderCount()} × ${sheets}-sheet binders` : `${sheets}-sheet binder`);
  }

  // ── Section chips with per-section completion ─────────────────────────
  function renderSections() {
    const bar = $('secbar');
    bar.innerHTML = '';
    if (!SET.sdefs.length) return;
    SET.sdefs.forEach((sd, i) => {
      const slots = SLOTS.filter(sd.f);
      if (!slots.length) return;
      const got = slots.filter(s => owned.has(sk(s))).length;
      const pct = Math.round(got / slots.length * 100);
      const chip = el('span', 'chip sec-chip' + (secFilter === i ? ' active' : ''),
        `${sd.label} <span class="pct">${pct}%</span> <span class="bar"><i style="width:${pct}%"></i></span>`);
      chip.addEventListener('click', () => {
        if (view === 'gallery') {
          secFilter = secFilter === i ? -1 : i;
          renderSections(); renderGallery();
        } else {
          const first = SLOTS.findIndex(sd.f);
          if (first >= 0) goToPage(Math.floor(first / spp()) + 1);
        }
      });
      bar.appendChild(chip);
    });
  }

  // ── Binder (spread) view ──────────────────────────────────────────────
  function renderSpread() {
    const wrap = $('spread');
    wrap.innerHTML = '';
    wrap.classList.toggle('hide-owned', hideOwned);
    let leftP = 2 * curSpread - 2, rightP = 2 * curSpread - 1;     // 0 = cover
    let pagePairs = [ [leftP, 'left'], [rightP, 'right'] ];
    if (isSingle()) pagePairs = [ [curPage, 'single'] ];           // mobile: one page
    pagePairs.forEach(([p, side]) => {
      if (p > capacity()) {
        // past the last sheet = inside back cover: no pockets, just a summary
        const pg = el('div', 'page ' + side);
        pg.appendChild(el('div', 'page-label', 'Back cover'));
        const gg = el('div', 'page-grid');
        for (let i = 0; i < spp(); i++) gg.appendChild(el('div', 'pocket-empty ghost'));
        pg.appendChild(gg);
        const cv = el('div', 'page-cover back');
        if (entry && entry.cover) { const i = el('img'); i.src = entry.cover; cv.appendChild(i); }
        const n = owned.size, pct = TOTAL ? Math.round(n / TOTAL * 100) : 0;
        cv.appendChild(el('div', 'cv-t', B.title));
        cv.appendChild(el('div', 'cv-stats', `${n} / ${TOTAL} collected · ${pct}%`));
        cv.appendChild(el('div', 'cv-s', pct >= 100 ? '★ Master set complete!' : 'End of binder'));
        pg.appendChild(cv);
        wrap.appendChild(pg);
        return;
      }
      if (p > pageCount()) {
        // real sheet, no cards assigned yet: empty sleeve page
        const pg = el('div', 'page ' + side);
        pg.appendChild(el('div', 'page-label', 'Empty'));
        const g = el('div', 'page-grid');
        for (let i = 0; i < spp(); i++) g.appendChild(el('div', 'pocket-empty'));
        pg.appendChild(g);
        wrap.appendChild(pg);
        return;
      }
      const pg = el('div', 'page ' + side);
      if (p === 0) {
        // ghost pocket grid keeps the cover exactly the size of a card page
        pg.appendChild(el('div', 'page-label', 'Cover'));
        const gg = el('div', 'page-grid');
        for (let i = 0; i < spp(); i++) gg.appendChild(el('div', 'pocket-empty ghost'));
        pg.appendChild(gg);
        const cv = el('div', 'page-cover');
        if (entry && entry.cover) { const i = el('img'); i.src = entry.cover; cv.appendChild(i); }
        cv.appendChild(el('div', 'cv-t', B.title));
        cv.appendChild(el('div', 'cv-s', B.subtitle));
        pg.appendChild(cv);
      } else {
        pg.appendChild(el('div', 'page-label', `Page ${p} / ${pageCount()}`));
        const g = el('div', 'page-grid');
        const slots = pageSlots(p);
        slots.forEach(s => g.appendChild(makeSlot(s)));
        // pad a partially-filled page with empty pockets
        for (let i = slots.length; i < spp(); i++) g.appendChild(el('div', 'pocket-empty'));
        pg.appendChild(g);
      }
      wrap.appendChild(pg);
    });
    if (isSingle()) {
      $('sn-cur').value = curPage === 0 ? 'C' : curPage;
      $('sn-max').textContent = maxPage() - 1;
      $('sn-label').textContent = 'Page';
    } else {
      $('sn-cur').value = curSpread;
      $('sn-max').textContent = spreadMax();
      $('sn-label').textContent = 'Spread';
    }
    savePos();
    // prefetch neighbouring pages so turns feel instant
    const near = isSingle() ? [curPage - 1, curPage + 1]
                            : [2 * curSpread - 4, 2 * curSpread - 3, 2 * curSpread, 2 * curSpread + 1];
    near.forEach(p => {
      if (p >= 1 && p <= pageCount()) pageSlots(p).forEach(s => { const i = new Image(); i.src = s.img; });
    });
    // edge arrows: dim when at the ends
    const atStart = isSingle() ? curPage === 0 : curSpread === 1;
    const atEnd = isSingle() ? curPage >= maxPage() : curSpread >= spreadMax();
    $('edge-prev').classList.toggle('off', atStart);
    $('edge-next').classList.toggle('off', atEnd);
    renderPageMap();
  }

  // Page-turn animation: swap content at the midpoint of the turn
  let turning = false;
  function turnTo(dir) {
    if (turning) return;
    if (!dir) return renderSpread();
    const wrap = $('spread');
    turning = true;
    wrap.classList.remove('turn-f', 'turn-b');
    void wrap.offsetWidth;
    wrap.classList.add(dir > 0 ? 'turn-f' : 'turn-b');
    setTimeout(renderSpread, 190);
    wrap.addEventListener('animationend', () => {
      wrap.classList.remove('turn-f', 'turn-b');
      turning = false;
    }, { once: true });
    setTimeout(() => turning = false, 700);   // safety net
  }

  function go(d) {
    const before = isSingle() ? curPage : curSpread;
    if (isSingle()) curPage = Math.max(0, Math.min(maxPage(), curPage + d));
    else curSpread = Math.max(1, Math.min(spreadMax(), curSpread + d));
    const after = isSingle() ? curPage : curSpread;
    if (after !== before) turnTo(d); else renderSpread();
  }
  function goTo(n) {          // n = spread number (desktop semantics)
    const dir = Math.sign(n - curSpread);
    curSpread = Math.max(1, Math.min(spreadMax(), n));
    curPage = Math.max(0, 2 * curSpread - 2);
    turnTo(dir);
  }
  function goToPage(p) {      // exact page (used by page map / jumps)
    const dir = Math.sign(p - curPage);
    curPage = Math.max(0, Math.min(maxPage(), p));
    curSpread = Math.ceil((p + 1) / 2);
    turnTo(dir);
  }

  // ── Gallery view: every card, grouped by section ──────────────────────
  function renderGallery() {
    const wrap = $('view-gallery');
    wrap.innerHTML = '';
    wrap.classList.toggle('hide-owned', hideOwned);
    const query = q.trim().toLowerCase();
    const match = s => !query || s.name.toLowerCase().includes(query) || String(s.id).toLowerCase().includes(query);
    let groups;
    if (SET.sdefs.length) {
      groups = SET.sdefs.map((sd, i) => ({ label: sd.label, slots: SLOTS.filter(sd.f), i }));
      // Any card no section claims still gets shown — "see every card"
      const claimed = new Set();
      groups.forEach(g => g.slots.forEach(s => claimed.add(sk(s))));
      const rest = SLOTS.filter(s => !claimed.has(sk(s)));
      if (rest.length) groups.push({ label: 'Other', slots: rest, i: SET.sdefs.length });
    } else {
      groups = [{ label: 'All cards', slots: SLOTS, i: 0 }];
    }
    groups.forEach(g => {
      if (secFilter >= 0 && g.i !== secFilter) return;
      const visible = g.slots.filter(match);
      if (!visible.length) return;
      const got = g.slots.filter(s => owned.has(sk(s))).length;
      const pct = Math.round(got / g.slots.length * 100);
      const sec = el('div', 'gal-sec');
      sec.appendChild(el('div', 'gal-head',
        `<h3>${g.label}</h3><span class="gh-n">${got}/${g.slots.length}</span><span class="gh-bar"><i style="width:${pct}%"></i></span>`));
      const grid = el('div', 'gal-grid');
      visible.forEach(s => grid.appendChild(makeSlot(s)));
      sec.appendChild(grid);
      wrap.appendChild(sec);
    });
    if (!wrap.children.length) wrap.appendChild(el('div', 'wl-empty', 'No cards match.'));
  }

  // ── View switching ────────────────────────────────────────────────────
  function setView(v) {
    view = v;
    document.querySelectorAll('.vt').forEach(b => b.classList.toggle('active', b.dataset.view === v));
    $('view-binder').style.display = v === 'binder' ? '' : 'none';
    $('view-gallery').style.display = v === 'gallery' ? '' : 'none';
    v === 'binder' ? renderSpread() : renderGallery();
    renderPageMap();
  }

  // ── Layout picker ─────────────────────────────────────────────────────
  function buildLayoutPicker() {
    const panel = $('lp-panel');
    panel.innerHTML = '';
    PRESETS.forEach(p => {
      const o = el('div', 'lp-opt' + (p.c === cols && p.r === rows ? ' active' : ''));
      const mini = el('div', 'lp-mini');
      mini.style.gridTemplateColumns = `repeat(${p.c}, 5px)`;
      for (let i = 0; i < p.c * p.r; i++) mini.appendChild(el('i'));
      o.appendChild(mini);
      o.appendChild(el('span', null, `${p.c}×${p.r}`));
      o.addEventListener('click', () => {
        cols = p.c; rows = p.r;
        saveLayout();
        document.documentElement.style.setProperty('--binder-cols', cols);
        $('lp-label').textContent = `${cols}×${rows}`;
        panel.classList.remove('open');
        curSpread = 1;
        buildLayoutPicker(); setView(view); updateProgress();
      });
      panel.appendChild(o);
    });
  }

  // ── Hold-to-peek preview ──────────────────────────────────────────────
  let peekSlot = null;
  function openPeek(s) {
    peekSlot = s;
    const big = (s.img || '').replace('_SM.png', '_LG.png');
    const pi = $('peek-img');
    pi.onerror = () => { pi.onerror = null; pi.src = s.img; };
    pi.src = big !== s.img ? big : s.img;
    $('peek-name').innerHTML = `${s.name}<span>${s.id}</span>`;
    $('peek').classList.add('open');
    if (navigator.vibrate) navigator.vibrate(12);
  }
  $('peek').addEventListener('click', e => {
    if (e.target.id !== 'peek-details') $('peek').classList.remove('open');
  });
  $('peek').addEventListener('contextmenu', e => e.preventDefault());  // no native image menu
  $('peek-img').draggable = false;
  $('peek-details').addEventListener('click', () => {
    $('peek').classList.remove('open');
    if (peekSlot) openModal(peekSlot);
  });

  // ── Card modal ────────────────────────────────────────────────────────
  let modalSlot = null;
  function openModal(s) {
    modalSlot = s;
    const key = sk(s), c = bc(s), p = prices[key] || {};
    $('cm-img').src = (s.img || '').replace('_SM.png', '_LG.png') || s.img;
    $('cm-img').onerror = () => { $('cm-img').onerror = null; $('cm-img').src = s.img; };
    $('cm-name').textContent = s.name;
    $('cm-meta').innerHTML = '';
    $('cm-meta').appendChild(el('span', 'chip', `<span class="dot" style="background:${c.col}"></span>${s.id}`));
    if (s.set) $('cm-meta').appendChild(el('span', 'chip', s.set));
    $('cm-raw').value = p.raw ?? ''; $('cm-psa9').value = p.psa9 ?? ''; $('cm-psa10').value = p.psa10 ?? '';
    $('cm-links').innerHTML =
      (s.pc ? `<a href="${s.pc}" target="_blank" rel="noopener">📈 PriceCharting</a>` : '') +
      `<a href="${s.img}" target="_blank" rel="noopener">🖼 Full image</a>`;
    syncModalBtns();
    $('modal').classList.add('open');
  }
  function syncModalBtns() {
    const key = sk(modalSlot);
    $('cm-own').textContent = owned.has(key) ? '✓ Owned — remove' : 'Mark as owned';
    $('cm-watch').textContent = watched.has(key) ? '⭐ Watching — remove' : '☆ Watch';
  }
  $('cm-own').addEventListener('click', () => {
    const key = sk(modalSlot);
    owned.has(key) ? owned.delete(key) : owned.add(key);
    saveOwned(); refreshSlots(key); updateProgress(); syncModalBtns();
  });
  $('cm-watch').addEventListener('click', () => {
    const key = sk(modalSlot);
    watched.has(key) ? watched.delete(key) : watched.add(key);
    saveWatched(); refreshSlots(key); updateProgress(); syncModalBtns();
  });
  $('cm-save-price').addEventListener('click', () => {
    const key = sk(modalSlot);
    const raw = parseFloat($('cm-raw').value), psa9 = parseFloat($('cm-psa9').value), psa10 = parseFloat($('cm-psa10').value);
    if (isNaN(raw) && isNaN(psa9) && isNaN(psa10)) delete prices[key];
    else prices[key] = { raw: isNaN(raw) ? undefined : raw, psa9: isNaN(psa9) ? undefined : psa9,
                         psa10: isNaN(psa10) ? undefined : psa10, date: new Date().toISOString().slice(0, 10) };
    savePrices();
    $('cm-save-price').textContent = '✓ Saved';
    setTimeout(() => $('cm-save-price').textContent = '💾 Save prices', 1200);
  });
  $('cm-jump').addEventListener('click', () => {
    const idx = SLOTS.findIndex(s => sk(s) === sk(modalSlot));
    closeModal();
    setView('binder');
    goToPage(Math.floor(idx / spp()) + 1);
    setTimeout(() => {
      const d = document.querySelector(`#spread .slot[data-key="${CSS.escape(sk(modalSlot))}"]`);
      if (d) { d.scrollIntoView({ behavior: 'smooth', block: 'center' }); d.classList.add('flash'); setTimeout(() => d.classList.remove('flash'), 2200); }
    }, 60);
  });
  const closeModal = () => $('modal').classList.remove('open');
  $('cm-close').addEventListener('click', closeModal);
  $('modal').addEventListener('click', e => { if (e.target === $('modal')) closeModal(); });

  // ── Watchlist ─────────────────────────────────────────────────────────
  $('btn-watchlist').addEventListener('click', () => {
    const list = SLOTS.filter(s => watched.has(sk(s)));
    $('wl-sub').textContent = `${list.length} card${list.length !== 1 ? 's' : ''} watched`;
    const box = $('wl-list');
    box.innerHTML = '';
    if (!list.length) box.appendChild(el('div', 'wl-empty', 'Nothing watched yet.<br><span style="font-size:11.5px">Right-click any card → ☆ Watch</span>'));
    list.forEach(s => {
      const p = prices[sk(s)] || {};
      const r = el('div', 'wl-row',
        `<img src="${s.img}" loading="lazy"><div class="wr-n">${s.name}<span>${s.id}</span></div>
         <div class="wr-p">${p.raw ? '$' + p.raw : ''}</div>`);
      r.addEventListener('click', () => { $('wl').classList.remove('open'); openModal(s); });
      box.appendChild(r);
    });
    $('wl').classList.add('open');
  });
  $('wl-close').addEventListener('click', () => $('wl').classList.remove('open'));
  $('wl').addEventListener('click', e => { if (e.target === $('wl')) $('wl').classList.remove('open'); });

  // ── Sheets dropdown ───────────────────────────────────────────────────
  function buildSheetPicker() {
    const sel = $('sheet-sel');
    const opts = [...new Set([10, 15, 20, 25, 30, 40, 50, sheets])].sort((a, b) => a - b);
    sel.innerHTML = opts.map(n => `<option value="${n}" ${n === sheets ? 'selected' : ''}>${n} sheets</option>`).join('');
    sel.onchange = (() => {
      sheets = parseInt(sel.value) || 20;
      saveLayout();
      curSpread = Math.min(curSpread, spreadMax());
      updateProgress();
      if (view === 'binder') renderSpread();
    });
  }

  // ── Toolbar wiring ────────────────────────────────────────────────────
  document.querySelectorAll('.vt').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
  $('sn-prev').addEventListener('click', () => go(-1));
  $('sn-next').addEventListener('click', () => go(1));
  $('edge-prev').addEventListener('click', () => go(-1));
  $('edge-next').addEventListener('click', () => go(1));
  $('sn-cur').addEventListener('change', e => {
    const v = e.target.value.trim().toLowerCase();
    if (isSingle()) goToPage(v === 'c' ? 0 : (parseInt(v) || 1));
    else goTo(parseInt(v) || 1);
  });

  // Swipe navigation (mobile)
  let tX = null, tY = null;
  $('view-binder').addEventListener('touchstart', e => { tX = e.touches[0].clientX; tY = e.touches[0].clientY; }, { passive: true });
  $('view-binder').addEventListener('touchend', e => {
    if (tX === null) return;
    const dx = e.changedTouches[0].clientX - tX, dy = e.changedTouches[0].clientY - tY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    tX = tY = null;
  }, { passive: true });
  $('lp-trigger').addEventListener('click', e => { e.stopPropagation(); $('lp-panel').classList.toggle('open'); });
  document.addEventListener('click', () => $('lp-panel').classList.remove('open'));
  $('lp-panel').addEventListener('click', e => e.stopPropagation());
  $('hide-owned').addEventListener('change', e => {
    hideOwned = e.target.checked;
    view === 'binder' ? renderSpread() : renderGallery();
  });

  let qTimer = null;
  $('search').addEventListener('input', e => {
    q = e.target.value;
    clearTimeout(qTimer);
    qTimer = setTimeout(() => {
      if (q.trim() && view === 'binder') setView('gallery');
      else if (view === 'gallery') renderGallery();
    }, 220);
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if ($('modal').classList.contains('open') || $('wl').classList.contains('open')) {
      if (e.key === 'Escape') { closeModal(); $('wl').classList.remove('open'); }
      return;
    }
    if (view === 'binder') {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'Home') goToPage(0);
      if (e.key === 'End') goToPage(maxPage());
    }
  });

  // cloud sync finished pulling: refresh state in place (no page reload)
  document.addEventListener('cloud-sync-applied', () => {
    try {
      const sv = JSON.parse(localStorage.getItem(LS_LAYOUT));
      if (sv) { cols = sv.cols || cols; rows = sv.rows || rows; sheets = sv.sheets || sheets; }
    } catch (e) {}
    document.documentElement.style.setProperty('--binder-cols', cols);
    $('lp-label').textContent = `${cols}×${rows}`;
    buildLayoutPicker(); buildSheetPicker();
    load(); updateProgress(); setView(view);
  });

  // overlays must not inherit the mobile auto-zoom (they size themselves in vw/vh)
  const uz = window.__uiZoom || 1;
  if (uz > 1) ['peek', 'modal', 'wl'].forEach(id => { const n = $(id); if (n) n.style.zoom = 1 / uz; });

  // ── Go ────────────────────────────────────────────────────────────────
  load();
  document.documentElement.style.setProperty('--binder-cols', cols);
  $('lp-label').textContent = `${cols}×${rows}`;
  buildLayoutPicker();
  buildSheetPicker();
  updateProgress();
  setView('binder');
  $('app').style.display = '';
}
// eof
