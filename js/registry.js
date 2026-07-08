/* ═══════════════════════════════════════════════════════════════════════
   Registry — the "default binder" every set inherits from.
   A set file only declares what differs; everything else comes from here.
   ═══════════════════════════════════════════════════════════════════════ */

window.SETS = {};

// ── The default binder ──────────────────────────────────────────────────
window.DEFAULT_SET = {
  binder: {
    title:    'Untitled Binder',
    subtitle: '',
    navTitle: '',
    lsOwned:  null,          // required per set — localStorage key for owned cards
    lsWatched: null,         // derived from lsOwned when missing
    lsPrices:  null,         // derived from lsOwned when missing
    cols: 3,                 // default pocket layout (cols × cols)
    sheets: 20,              // physical sheets per binder (×2 = pages)
    legend: [],              // [{label, color}]
  },
  // Variant colors every binder inherits — a set's own bc{} overrides these.
  bc: {
    main:   { bg:'#181410', col:'#666'    },
    base:   { bg:'#181410', col:'#666'    },
    rh:     { bg:'#1a1028', col:'#b06aff' },
    ir:     { bg:'#101828', col:'#4a9eff' },
    ar:     { bg:'#120e38', col:'#9080d8' },
    ear:    { bg:'#0e2030', col:'#48c8e8' },
    sr:     { bg:'#201400', col:'#c89018' },
    sar:    { bg:'#2a1020', col:'#ff6ab0' },
    ur:     { bg:'#1a2810', col:'#4cff80' },
    sur:    { bg:'#242424', col:'#c0c0c0' },
    ultra:  { bg:'#242424', col:'#c0c0c0' },
    shiny:  { bg:'#0c2226', col:'#50d8c8' },
    secret: { bg:'#2a2010', col:'#c89a3a' },
    mur:    { bg:'#3a2000', col:'#ff9940' },
    ex:     { bg:'#0a1828', col:'#5090d0' },
    mega:   { bg:'#200c00', col:'#b04028' },
  },
  bcDefault: { bg: '#181410', col: '#666' },
  sdefs: [],                 // sections: [{label, f(slot) => bool}]
  slots: [],                 // [{id, name, v, img, pc, ...}]
  sk: s => s.id,             // slot → storage key (must match legacy keys!)
  reverseVs: ['rh', 'erh', 'brh', 'pb', 'mb', 'mirror'],  // variants drawn with a holo sheen + chip
};

// ── Register a set (merges over the default binder) ────────────────────
function registerSet(id, cfg) {
  const D = window.DEFAULT_SET;
  const merged = {
    ...D, ...cfg,
    binder: { ...D.binder, ...(cfg.binder || {}) },
    bc: { ...D.bc, ...(cfg.bc || {}) },
    bcDefault: cfg.bcDefault || D.bcDefault,
  };
  const b = merged.binder;
  if (!b.lsWatched && b.lsOwned) b.lsWatched = b.lsOwned.replace(/owned/, 'watched');
  if (!b.lsPrices  && b.lsOwned) b.lsPrices  = b.lsOwned.replace(/owned/, 'prices');
  if (!b.navTitle) b.navTitle = b.title;
  window.SETS[id] = merged;
  document.dispatchEvent(new CustomEvent('set-registered', { detail: { id } }));
}

// ── Helpers shared by dashboard + engine ───────────────────────────────
function catalogEntry(id) {
  return (window.CATALOG || []).find(c => c.id === id) || null;
}

function themeFor(entry) {
  const T = window.LOGO_THEMES || {};
  if (!entry || !entry.cover) return null;
  const stem = entry.cover.split('/').pop().replace(/\.png$/i, '');
  // themes.js keys match logo filename stems (case-sensitive on some systems)
  return T[stem] || T[stem.toUpperCase()] || null;
}

function applyTheme(entry) {
  const t = themeFor(entry);
  if (!t) return;
  document.documentElement.style.setProperty('--accent', t.accent);
  if (t.deep) document.documentElement.style.setProperty('--deep', t.deep);
}

function lsCount(key) {
  try { return (JSON.parse(localStorage.getItem(key)) || []).length; }
  catch (e) { return 0; }
}
