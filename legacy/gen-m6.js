// Generate data/sets/m6.js — M6 Storm Emeralda (JP Mega era, 31 Jul 2026).
// Main set 1-76: LimitlessTCG scans. Secrets 77-113: TCG Republic scans (downloaded locally).
const fs = require('fs');

const MAP = JSON.parse(fs.readFileSync('C:/Users/User/Downloads/m6-cards.json', 'utf8'));

// paired Legendary Stadiums — TCG Republic sells them as pairs, so the even half is absent
const PAIRS = { 72: 71, 74: 73, 76: 75 };

const rarityV = r => {
  if (/MUR/i.test(r)) return 'mur';
  if (/SAR/i.test(r)) return 'sar';
  if (/\bSR\b/i.test(r)) return 'sr';
  if (/\bAR\b/i.test(r)) return 'ar';
  if (/RR/i.test(r)) return 'ex';
  if (/\bR\b/i.test(r)) return 'holo';
  return 'main';
};

const limitless = n => `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/M6/M6_${n}_R_JP_LG.png`;
const local = id => `images/m6/${id}.jpg`;
const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
const pc = (name, n) => `https://www.pricecharting.com/game/pokemon-japanese-storm-emeralda/${slug(name)}-${n}`;

const slots = [];
const secretIds = [];
for (let n = 1; n <= 113; n++) {
  let entry = MAP[n];
  let name, rarity;
  if (entry) { name = entry.name; rarity = entry.rarity; }
  else if (PAIRS[n] && MAP[PAIRS[n]]) { name = MAP[PAIRS[n]].name; rarity = MAP[PAIRS[n]].rarity; }
  else { console.warn('no data for', n); continue; }

  // label the split stadium halves
  if (PAIRS[n]) name += ' (2/2)';
  else if (Object.values(PAIRS).includes(n)) name += ' (1/2)';

  const v = rarityV(rarity);
  const isSecret = n >= 77;
  let img;
  if (isSecret && entry) { img = local(entry.media); secretIds.push(entry.media); }
  else img = limitless(n);

  const slot = { id: `M6-${n}`, name, v, img, pc: pc(name.replace(/\s*\(\d\/2\)/, ''), n) };
  if (isSecret && entry) slot.img2 = limitless(n);
  slots.push(slot);
}

const stats = {};
slots.forEach(s => stats[s.v] = (stats[s.v] || 0) + 1);
console.log('slots:', slots.length, JSON.stringify(stats));
console.log('secret images to download:', secretIds.length);
fs.writeFileSync('C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/legacy/m6-secret-ids.json', JSON.stringify(secretIds));

const lines = slots.map(s => '  ' + JSON.stringify(s).replace(/"(\w+)":/g, '$1:')).join(',\n');
fs.writeFileSync('C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/data/sets/m6.js',
`// m6 — Storm Emeralda (JP Mega era, Jul 2026). Names/rarities via TCG Republic, art via LimitlessTCG.
registerSet('m6', {
  binder: {
    title: 'M6 Storm Emeralda',
    subtitle: '113 cards · 76 main + 37 secret · Mega Rayquaza ex · Master Set',
    navTitle: 'M6 Storm Emeralda · 113 cards (Master Set)',
    lsOwned: 'm6_storm_emeralda_owned_v1',
    lsWatched: 'm6_storm_emeralda_watched_v1',
    lsPrices: 'm6_storm_emeralda_prices_v1',
    cols: 3,
    legend: [
      { label: 'Main Set', color: '#666' },
      { label: 'Holo', color: '#c89a3a' },
      { label: 'ex', color: '#5090d0' },
      { label: 'AR', color: '#9080d8' },
      { label: 'SR', color: '#c89018' },
      { label: 'SAR', color: '#ff6ab0' },
      { label: 'MUR', color: '#b03030' },
    ],
  },
  sdefs: [
    { label: '#001-040 Main', f: s => { const n = parseInt(s.id.split('-')[1]); return n >= 1 && n <= 40; } },
    { label: '#041-076 Main', f: s => { const n = parseInt(s.id.split('-')[1]); return n >= 41 && n <= 76; } },
    { label: 'Art Rares', f: s => s.v === 'ar' },
    { label: 'Super Rares', f: s => s.v === 'sr' },
    { label: 'SAR + MUR', f: s => s.v === 'sar' || s.v === 'mur' },
  ],
  slots: [
${lines}
  ]
});
`);
console.log('written data/sets/m6.js');
