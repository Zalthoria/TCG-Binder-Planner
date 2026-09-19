// Generate the two 30th Celebration binders:
//   data/sets/30c.js  — English  (30C, 16 Sep 2026)
//   data/sets/m6a.js  — Japanese (M6a, 16 Sep 2026)
//
// Sources: LimitlessTCG card lists (30C 1-158, M6a 1-103) and Samurai Sword's
// JP breakdown for the secret block (104-135) and Classic Collection (136-165).
// Art: Limitless CDN where published; slots without a scan yet carry img:null
// and render as a "not released yet" placeholder until the scans appear.
const fs = require('fs');
const D = 'C:/Users/User/Downloads/';
const OUT = 'C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/data/sets/';

const lists = JSON.parse(fs.readFileSync(D + '30c-m6a-lists.json', 'utf8'));
const extra = JSON.parse(fs.readFileSync('C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/legacy/m6a-extra.json', 'utf8'));

const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
const enImg = n => `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/30C/30C_${String(n).padStart(3, '0')}_R_EN_SM.png`;
const jpImg = n => `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/M6a/M6a_${n}_R_JP_LG.png`;

const ENERGY = ['Grass', 'Fire', 'Water', 'Lightning', 'Psychic', 'Fighting', 'Darkness', 'Metal'];

// ── English (30C) ───────────────────────────────────────────────────────
const enV = c => {
  if (c.num >= 23 && c.num <= 52) return 'pika';            // the 30-artist Pikachu subset
  if (c.rarity === 'Double Rare') return 'ex';
  if (c.rarity === 'Art Rare') return 'ir';
  if (c.rarity === 'Special Art Rare') return 'sar';
  if (c.rarity === 'Ultra Rare') return 'fur';              // Mewtwo ex / Mew ex
  return 'main';
};
const enSlots = lists.en.map(c => ({
  id: `30C-${String(c.num).padStart(3, '0')}`, name: c.name, v: enV(c),
  img: enImg(c.num), pc: `https://www.pricecharting.com/game/pokemon-30th-celebration/${slug(c.name)}-${c.num}`,
}));
// The RGB Mew trio — Secret Rares lettered G / R / B instead of numbered.
// They close out the binder, after the energy.
const RGB = [['G', 'Green'], ['R', 'Red'], ['B', 'Blue']];

// Classic Collection — same 30 reprints as JP (EN numbers them by original printing)
const ccList = [...extra.cc];
ccList.push({ num: 151, name: 'Darkrai & Cresselia LEGEND (top)' },
            { num: 152, name: 'Darkrai & Cresselia LEGEND (bottom)' });
ccList.sort((a, b) => a.num - b.num);
ccList.forEach((c, i) => enSlots.push({
  id: `30C-CC${String(i + 1).padStart(2, '0')}`, name: c.name, v: 'classic', img: null,
  pc: `https://www.pricecharting.com/game/pokemon-30th-celebration/${slug(c.name)}`,
}));
RGB.forEach(([c, colour]) => enSlots.push({
  id: `30C-${c}`, name: `Mew (${colour})`, v: 'rgb',
  img: `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/30C/30C_${c}_R_EN_SM.png`,
  pc: `https://www.pricecharting.com/game/pokemon-30th-celebration/mew-${c.toLowerCase()}`,
}));
// energy last, starting a fresh page (br) so the 8 sit together
ENERGY.forEach((e, i) => enSlots.push({
  id: `30C-E${String(i + 1).padStart(2, '0')}`, name: `${e} Energy (foil)`, v: 'energy', img: null,
  ...(i === 0 ? { br: true } : {}),
}));

// ── Japanese (M6a) ──────────────────────────────────────────────────────
const jpSlots = lists.jp.map(c => ({
  id: `M6a-${c.num}`, name: c.name,
  v: (c.num >= 17 && c.num <= 46) ? 'pika' : (c.rarity === 'Double Rare' ? 'ex' : 'main'),
  img: jpImg(c.num), pc: `https://www.pricecharting.com/game/pokemon-japanese-30th-celebration/${slug(c.name)}-${c.num}`,
}));
extra.sec.forEach(c => jpSlots.push({                       // 104-135: AR / SAR / FUR
  id: `M6a-${c.num}`, name: c.name.replace(/\s*\([^)]*\)\s*$/, ''),
  v: c.rarity.toLowerCase() === 'ar' ? 'ir' : c.rarity.toLowerCase() === 'sar' ? 'sar' : 'fur',
  img: null, pc: `https://www.pricecharting.com/game/pokemon-japanese-30th-celebration/${slug(c.name)}-${c.num}`,
}));
const ccByNum = {};
extra.cc.forEach(c => ccByNum[c.num] = c);
// 151-152 is one LEGEND card printed across two halves — each half is its own slot
ccByNum[151] = { num: 151, name: 'Darkrai & Cresselia LEGEND (top)' };
ccByNum[152] = { num: 152, name: 'Darkrai & Cresselia LEGEND (bottom)' };
for (let n = 136; n <= 165; n++) {                          // Classic Collection (art already up)
  const c = ccByNum[n];
  jpSlots.push({
    id: `M6a-${n}`, name: c ? c.name : `Classic Collection #${n}`, v: 'classic',
    img: jpImg(n), pc: c ? `https://www.pricecharting.com/game/pokemon-japanese-30th-celebration/${slug(c.name)}-${n}` : undefined,
  });
}
// JP RGB Mews sit outside the official 1-165 numbering (unacknowledged secrets),
// so they're identified as G/RGB etc. Scans from TCG Republic, bundled locally.
const JP_RGB_IMG = { G: '825108', R: '825106', B: '825107' };
RGB.forEach(([c, colour]) => jpSlots.push({
  id: `M6a-${c}/RGB`, name: `Mew (${colour})`, v: 'rgb',
  img: `images/m6a/${JP_RGB_IMG[c]}.jpg`,
  pc: `https://www.pricecharting.com/game/pokemon-japanese-30th-celebration/mew-${c.toLowerCase()}`,
}));
// energy last, starting a fresh page (br) so the 8 sit together.
// JP energies are the lettered cards G/R/W/L/P/F/D/M on Limitless.
const JP_E = ['G', 'R', 'W', 'L', 'P', 'F', 'D', 'M'];
ENERGY.forEach((e, i) => jpSlots.push({
  id: `M6a-${JP_E[i]}`, name: `${e} Energy (foil)`, v: 'energy',
  img: `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/M6a/M6a_${JP_E[i]}_R_JP_LG.png`,
  ...(i === 0 ? { br: true } : {}),
}));

// ── Emit ────────────────────────────────────────────────────────────────
const LEGEND = [
  { label: 'Main Set', color: '#666' },
  { label: 'Pikachu (30 artists)', color: '#f2c744' },
  { label: 'ex', color: '#5090d0' },
  { label: 'IR', color: '#4a9eff' },
  { label: 'SIR', color: '#ff6ab0' },
  { label: 'FUR', color: '#7be3ff' },
  { label: 'RGB Mew', color: '#7fd4a0' },
  { label: 'Classic Collection', color: '#c89a3a' },
  { label: 'Energy', color: '#8ad38a' },
];
const BC = {
  pika:    { bg: '#2a2408', col: '#f2c744' },
  fur:     { bg: '#07222a', col: '#7be3ff' },
  classic: { bg: '#2a2010', col: '#c89a3a' },
  energy:  { bg: '#0f2412', col: '#8ad38a' },
  rgb:     { bg: '#0c2418', col: '#7fd4a0' },
};

function emit(file, id, binder, sdefs, slots) {
  const lines = slots.map(s => '  ' + JSON.stringify(s).replace(/"(\w+)":/g, '$1:')).join(',\n');
  fs.writeFileSync(OUT + file,
`// ${id} — 30th Celebration, released 16 Sep 2026 (simultaneous worldwide).
// Slots with img:null have no official scan published yet.
registerSet('${id}', {
  binder: ${JSON.stringify(binder, null, 4).replace(/"(\w+)":/g, '$1:')},
  bc: ${JSON.stringify(BC).replace(/"(\w+)":/g, '$1:')},
  sdefs: [
${sdefs.map(s => '    ' + s).join(',\n')}
  ],
  slots: [
${lines}
  ]
});
`);
  const stats = {};
  slots.forEach(s => stats[s.v] = (stats[s.v] || 0) + 1);
  console.log(file, '→', slots.length, 'slots', JSON.stringify(stats), '| no art:', slots.filter(s => !s.img).length);
}

emit('30c.js', '30c', {
  title: '30th Celebration (30C)',
  subtitle: `${enSlots.length} slots · 128 main + 33 secret + 30 Classic Collection + 8 foil energy`,
  navTitle: `30th Celebration · ${enSlots.length} slots (Master Set)`,
  lsOwned: '30c_owned_v1', lsWatched: '30c_watched_v1', lsPrices: '30c_prices_v1',
  cols: 3, legend: LEGEND,
}, [
  `{ label: '#001-022 Main', f: s => { const n = parseInt(s.id.slice(4)); return n >= 1 && n <= 22; } }`,
  `{ label: 'Pikachu ×30', f: s => s.v === 'pika' }`,
  `{ label: '#053-128 Main', f: s => { const n = parseInt(s.id.slice(4)); return n >= 53 && n <= 128; } }`,
  `{ label: 'Illustration Rares', f: s => s.v === 'ir' }`,
  `{ label: 'SIR + FUR', f: s => s.v === 'sar' || s.v === 'fur' }`,
  `{ label: 'Classic Collection', f: s => s.v === 'classic' }`,
  `{ label: 'RGB Mew', f: s => s.v === 'rgb' }`,
  `{ label: 'Foil Energy', f: s => s.v === 'energy' }`,
], enSlots);

emit('m6a.js', 'm6a', {
  title: 'M6a 30th Celebration',
  subtitle: `${jpSlots.length} slots · 103 main + 35 secret + 30 Classic Collection + 8 foil energy`,
  navTitle: `M6a 30th Celebration · ${jpSlots.length} slots (Master Set)`,
  lsOwned: 'm6a_owned_v1', lsWatched: 'm6a_watched_v1', lsPrices: 'm6a_prices_v1',
  cols: 3, legend: LEGEND,
}, [
  `{ label: '#001-016 Main', f: s => { const n = parseInt(s.id.slice(4)); return n >= 1 && n <= 16; } }`,
  `{ label: 'Pikachu ×30', f: s => s.v === 'pika' }`,
  `{ label: '#047-103 Main', f: s => { const n = parseInt(s.id.slice(4)); return n >= 47 && n <= 103; } }`,
  `{ label: 'AR (104-123)', f: s => s.v === 'ir' }`,
  `{ label: 'SAR + FUR', f: s => s.v === 'sar' || s.v === 'fur' }`,
  `{ label: 'Classic Collection', f: s => s.v === 'classic' }`,
  `{ label: 'RGB Mew', f: s => s.v === 'rgb' }`,
  `{ label: 'Foil Energy', f: s => s.v === 'energy' }`,
], jpSlots);
