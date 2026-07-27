// One-off: add the 124 missing "Mirror card" variants to SV4a Shiny Treasure ex.
// Mirror slots are inserted directly after their base card, keyed <id>-RH so they
// get the reverse-holo treatment (sheen + chip) in the engine.
const fs = require('fs');

const MAP = JSON.parse(fs.readFileSync('C:/Users/User/Downloads/sv4a-tcgrepublic-map.json', 'utf8'));
const SET = 'C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/data/sets/sv4a.js';

const url = id => {
  const p = id.padStart(9, '0');
  return `https://tcgrepublic.com/media/binary/${p.slice(0,3)}/${p.slice(3,6)}/${p.slice(6,9)}/${id}.jpg`;
};

const lines = fs.readFileSync(SET, 'utf8').split('\n');
const out = [];
let added = 0;

for (const line of lines) {
  out.push(line);
  const m = line.match(/\{id:'(SV4a-(\d+))',name:'([^']*)',v:'(\w+)',img:'([^']*)'(?:,pc:'([^']*)')?\s*\}/);
  if (!m) continue;
  const [, id, numS, name, v, img, pc] = m;
  const num = parseInt(numS, 10);
  const mid = MAP[num + 'm'];
  if (!mid || v !== 'main') continue;           // only base main-set cards have mirrors
  added++;
  const indent = line.match(/^\s*/)[0];
  const comma = line.trim().endsWith(',') ? ',' : ',';
  const slot = `${indent}{id:'${id}-RH',name:'${name.replace(/'/g, "\\'")} (Mirror)',v:'rh',img:'${url(mid)}',img2:'${img}'${pc ? `,pc:'${pc}'` : ''}}${comma}`;
  out.push(slot);
}

let src = out.join('\n');
// keep totals/subtitle honest
src = src.replace(/(subtitle:\s*')([^']*)(')/, (all, a, txt, c) => a + txt.replace(/^\d+ cards/, m => m) + ' + 124 mirrors' + c);
fs.writeFileSync(SET, src);
console.log('mirror slots added:', added);
