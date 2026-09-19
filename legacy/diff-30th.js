// Card-by-card comparison: EN 30C vs JP M6a
const fs = require('fs');
global.window = { SETS: {} }; global.document = { dispatchEvent(){} }; global.CustomEvent = class {};
const R = 'C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/';
eval(fs.readFileSync(R + 'js/registry.js', 'utf8')); global.registerSet = registerSet;
eval(fs.readFileSync(R + 'data/sets/30c.js', 'utf8'));
eval(fs.readFileSync(R + 'data/sets/m6a.js', 'utf8'));
const EN = window.SETS['30c'].slots, JP = window.SETS['m6a'].slots;

const norm = n => n.toLowerCase()
  .replace(/\s*\((rh|mirror|green|red|blue|foil|top|bottom|\d\/2)\)\s*/g, ' ')
  .replace(/[★δ'’.]/g, '').replace(/\s+/g, ' ').trim();

const group = slots => {
  const g = { main: [], secret: [], classic: [], energy: [], rgb: [] };
  slots.forEach(s => {
    if (s.v === 'energy') g.energy.push(s);
    else if (s.v === 'rgb') g.rgb.push(s);
    else if (s.v === 'classic') g.classic.push(s);
    else if (['ir','sar','fur'].includes(s.v)) g.secret.push(s);
    else g.main.push(s);
  });
  return g;
};
const en = group(EN), jp = group(JP);

const counts = (a, b, label) => console.log(`${label.padEnd(20)} EN ${String(a.length).padStart(3)}   JP ${String(b.length).padStart(3)}   diff ${a.length - b.length > 0 ? '+' : ''}${a.length - b.length}`);
console.log('=== SECTION TOTALS ===');
counts(en.main, jp.main, 'Main set');
counts(en.secret, jp.secret, 'Secrets (IR/SAR/FUR)');
counts(en.rgb, jp.rgb, 'RGB Mew');
counts(en.classic, jp.classic, 'Classic Collection');
counts(en.energy, jp.energy, 'Foil energy');
counts(EN, JP, 'TOTAL');

const diff = (a, b) => {
  const bn = new Set(b.map(s => norm(s.name)));
  const seen = new Set();
  return a.filter(s => { const n = norm(s.name); if (bn.has(n) || seen.has(n)) return false; seen.add(n); return true; });
};

console.log('\n=== MAIN SET: in EN but not JP ===');
const mOnlyEn = diff(en.main, jp.main);
console.log(mOnlyEn.length + ' cards');
mOnlyEn.forEach(s => console.log('  ' + s.id.padEnd(9) + s.name));

console.log('\n=== MAIN SET: in JP but not EN ===');
const mOnlyJp = diff(jp.main, en.main);
console.log(mOnlyJp.length + ' cards');
mOnlyJp.forEach(s => console.log('  ' + s.id.padEnd(9) + s.name));

console.log('\n=== SECRETS: in JP but not EN ===');
const sOnlyJp = diff(jp.secret, en.secret);
console.log(sOnlyJp.length + ' cards');
sOnlyJp.forEach(s => console.log('  ' + s.id.padEnd(9) + s.v.toUpperCase().padEnd(4) + s.name));

console.log('\n=== SECRETS: in EN but not JP ===');
const sOnlyEn = diff(en.secret, jp.secret);
console.log(sOnlyEn.length + ' cards');
sOnlyEn.forEach(s => console.log('  ' + s.id.padEnd(9) + s.v.toUpperCase().padEnd(4) + s.name));

console.log('\n=== CLASSIC COLLECTION ===');
const cOnlyEn = diff(en.classic, jp.classic), cOnlyJp = diff(jp.classic, en.classic);
console.log('EN-only: ' + (cOnlyEn.map(s=>s.name).join(', ') || 'none'));
console.log('JP-only: ' + (cOnlyJp.map(s=>s.name).join(', ') || 'none'));

console.log('\n=== NUMBERING ===');
const pikEn = EN.filter(s=>s.v==='pika'), pikJp = JP.filter(s=>s.v==='pika');
console.log('Pikachu run  EN ' + pikEn[0].id + '–' + pikEn[pikEn.length-1].id + '   JP ' + pikJp[0].id + '–' + pikJp[pikJp.length-1].id);
const secEn = en.secret, secJp = jp.secret;
console.log('Secrets      EN ' + secEn[0].id + '–' + secEn[secEn.length-1].id + '   JP ' + secJp[0].id + '–' + secJp[secJp.length-1].id);
const byV = (g,v) => g.filter(s=>s.v===v).length;
console.log('Rarity split EN: IR ' + byV(en.secret,'ir') + ', SIR ' + byV(en.secret,'sar') + ', FUR ' + byV(en.secret,'fur'));
console.log('             JP: AR ' + byV(jp.secret,'ir') + ', SAR ' + byV(jp.secret,'sar') + ', FUR ' + byV(jp.secret,'fur'));
