// Generate data/sets/twm.js from the saved LimitlessTCG list dump
const fs = require('fs');

const DUMP = process.argv[2];
const t = fs.readFileSync(DUMP, 'utf8');

// rows: [num](.../cards/TWM/num) | [Name](...) | [Type](...) | [Rarity](...)
const re = /\[(\d+)\]\(https:\/\/limitlesstcg\.com\/cards\/TWM\/\1\)\s*\|\s*\[([^\]]+)\]\([^)]*\)\s*\|\s*\[([^\]]+)\]\([^)]*\)\s*\|\s*\[([^\]]+)\]/g;
const cards = [];
let m;
while ((m = re.exec(t))) cards.push({ num: +m[1], name: m[2].trim(), type: m[3].trim(), rarity: m[4].trim() });
console.log('cards parsed:', cards.length);
if (cards.length !== 226) console.log('WARNING: expected 226');

// de-dup + sort
const byNum = new Map();
cards.forEach(c => byNum.set(c.num, c));
const list = [...byNum.values()].sort((a, b) => a.num - b.num);
console.log('unique:', list.length, '| max num:', list[list.length - 1].num);
console.log('rarities:', [...new Set(list.map(c => c.rarity))].join(' / '));

const vFor = c => {
  const r = c.rarity;
  if (r === 'Double Rare') return 'ex';
  if (r === 'ACE SPEC Rare') return 'ace';
  if (r === 'Illustration Rare') return 'ir';
  if (r === 'Ultra Rare') return 'ur';
  if (r === 'Special Illustration Rare') return 'sar';
  if (r === 'Hyper Rare') return 'secret';
  return 'main';                       // Common / Uncommon / Rare
};
const hasRH = c => c.num <= 167 && ['Common', 'Uncommon', 'Rare'].includes(c.rarity);

const pad = n => String(n).padStart(3, '0');
const img = n => `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/TWM/TWM_${pad(n)}_R_EN_SM.png`;
const slug = name => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9'\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/'/g, '');
const pc = c => `https://www.pricecharting.com/game/pokemon-twilight-masquerade/${slug(c.name)}-${c.num}`;

const slots = [];
list.forEach(c => {
  const v = vFor(c);
  slots.push({ id: `TWM-${pad(c.num)}`, name: c.name, v, img: img(c.num), pc: pc(c) });
  if (hasRH(c)) slots.push({ id: `TWM-${pad(c.num)}-RH`, name: `${c.name} (RH)`, v: 'rh', img: img(c.num), pc: pc(c) });
});
const rhCount = slots.filter(s => s.v === 'rh').length;
console.log('slots:', slots.length, `(${list.length} cards + ${rhCount} RH)`);

const slotLines = slots.map(s => '  ' + JSON.stringify(s).replace(/"(\w+)":/g, '$1:')).join(',\n');
const out = `// twm — generated from LimitlessTCG card list (Twilight Masquerade, May 2024)
registerSet('twm', {
  binder: {
    title: 'Twilight Masquerade (TWM)',
    subtitle: '${list.length} cards · 167 main + ${list.length - 167} secret · Master Set incl. reverse holos',
    navTitle: 'Twilight Masquerade · ${slots.length} slots (Master Set)',
    lsOwned: 'twm_owned_v1',
    lsWatched: 'twm_watched_v1',
    lsPrices: 'twm_prices_v1',
    cols: 3,
    legend: [
      { label: 'Main Set', color: '#666' },
      { label: 'Reverse Holo', color: '#b06aff' },
      { label: 'ex', color: '#5090d0' },
      { label: 'ACE SPEC', color: '#f26bc0' },
      { label: 'IR', color: '#4a9eff' },
      { label: 'UR', color: '#4cff80' },
      { label: 'SIR', color: '#ff6ab0' },
      { label: 'Hyper', color: '#c89a3a' },
    ],
  },
  bc: {
    ace: { bg: '#2a0e1e', col: '#f26bc0' },
  },
  sdefs: [
    { label: '#001-060 Main+RH', f: s => { const n = parseInt(s.id.split('-')[1]); return n >= 1 && n <= 60; } },
    { label: '#061-120 Main+RH', f: s => { const n = parseInt(s.id.split('-')[1]); return n >= 61 && n <= 120; } },
    { label: '#121-167 Main+RH', f: s => { const n = parseInt(s.id.split('-')[1]); return n >= 121 && n <= 167; } },
    { label: 'Illustration Rares', f: s => s.v === 'ir' },
    { label: 'Ultra Rares', f: s => s.v === 'ur' },
    { label: 'SIR + Hyper', f: s => s.v === 'sar' || s.v === 'secret' },
  ],
  slots: [
${slotLines}
  ]
});
`;
fs.writeFileSync('C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/data/sets/twm.js', out);
console.log('written data/sets/twm.js');
