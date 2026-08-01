// Generate data/sets/pbl.js — Pitch Black (PBL / ME05), EN Mega Evolution, Jul 2026.
// Source: LimitlessTCG card list (120 cards: 84 main + 36 secrets).
const fs = require('fs');

const list = JSON.parse(fs.readFileSync('C:/Users/User/Downloads/pbl-cards.json', 'utf8'))
  .sort((a, b) => a.num - b.num);
if (list.length !== 120) throw new Error('expected 120, got ' + list.length);

const MAIN_MAX = 84;
const vFor = c => {
  if (c.num <= MAIN_MAX) return c.rarity === 'Double Rare' ? 'ex' : 'main';
  if (c.rarity === 'Art Rare') return 'ir';
  if (c.rarity === 'Ultra Rare') return 'ur';
  if (c.rarity === 'Special Art Rare') return 'sar';
  return 'secret';                       // Secret Rare (incl. Mega Darkrai ex MUR)
};
const hasRH = c => c.num <= MAIN_MAX && ['Common', 'Uncommon', 'Rare'].includes(c.rarity);

const pad = n => String(n).padStart(3, '0');
const img = n => `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PBL/PBL_${pad(n)}_R_EN_SM.png`;
const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
const pc = c => `https://www.pricecharting.com/game/pokemon-pitch-black/${slug(c.name)}-${c.num}`;

const slots = [];
list.forEach(c => {
  slots.push({ id: `PBL-${pad(c.num)}`, name: c.name, v: vFor(c), img: img(c.num), pc: pc(c) });
  if (hasRH(c)) slots.push({ id: `PBL-${pad(c.num)}-RH`, name: `${c.name} (RH)`, v: 'rh', img: img(c.num), pc: pc(c) });
});
const stats = {};
slots.forEach(s => stats[s.v] = (stats[s.v] || 0) + 1);
console.log('slots:', slots.length, JSON.stringify(stats));

const lines = slots.map(s => '  ' + JSON.stringify(s).replace(/"(\w+)":/g, '$1:')).join(',\n');
fs.writeFileSync('C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/data/sets/pbl.js',
`// pbl — generated from LimitlessTCG card list (Pitch Black / ME05, Jul 2026)
registerSet('pbl', {
  binder: {
    title: 'Pitch Black (PBL)',
    subtitle: '${slots.length} slots · 120 cards + ${stats.rh} reverse holos · Master Set',
    navTitle: 'Pitch Black · ${slots.length} slots (Master Set)',
    lsOwned: 'pbl_owned_v1',
    lsWatched: 'pbl_watched_v1',
    lsPrices: 'pbl_prices_v1',
    cols: 3,
    legend: [
      { label: 'Main Set', color: '#666' },
      { label: 'Reverse Holo', color: '#b06aff' },
      { label: 'ex', color: '#5090d0' },
      { label: 'IR', color: '#4a9eff' },
      { label: 'UR', color: '#4cff80' },
      { label: 'SIR', color: '#ff6ab0' },
      { label: 'Secret', color: '#c89a3a' },
    ],
  },
  sdefs: [
    { label: '#001-042 Main+RH', f: s => { const n = parseInt(s.id.split('-')[1]); return n >= 1 && n <= 42; } },
    { label: '#043-084 Main+RH', f: s => { const n = parseInt(s.id.split('-')[1]); return n >= 43 && n <= 84; } },
    { label: 'Illustration Rares', f: s => s.v === 'ir' },
    { label: 'Ultra Rares', f: s => s.v === 'ur' },
    { label: 'SIR + Secrets', f: s => s.v === 'sar' || s.v === 'secret' },
  ],
  slots: [
${lines}
  ]
});
`);
console.log('written data/sets/pbl.js | catalog total:', slots.length);
