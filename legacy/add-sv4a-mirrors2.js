// Follow-up: add the two mirror slots whose base names contain escaped apostrophes.
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
  const m = line.match(/\{id:'(SV4a-(\d+))',name:'((?:[^'\\]|\\.)*)',v:'main',img:'([^']*)'/);
  if (!m) continue;
  const [, id, numS, name, img] = m;
  const num = parseInt(numS, 10);
  if (lines.some(l => l.includes(`id:'${id}-RH'`))) continue;   // already added
  const mid = MAP[num + 'm'];
  if (!mid) continue;
  added++;
  const indent = line.match(/^\s*/)[0];
  out.push(`${indent}{id:'${id}-RH',name:'${name} (Mirror)',v:'rh',img:'${url(mid)}',img2:'${img}'},`);
}
fs.writeFileSync(SET, out.join('\n'));
console.log('extra mirror slots added:', added);
