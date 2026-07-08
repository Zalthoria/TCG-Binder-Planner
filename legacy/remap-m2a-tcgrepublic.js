// One-off: point M2a slot images at TCG Republic's per-variant scans.
// Mapping file: { "<num><kind>": "<mediaId>" } where kind: p=plain, f=foil, e=energy mirror, b=ball/TR mirror
const fs = require('fs');

const MAP = JSON.parse(fs.readFileSync('C:/Users/User/Downloads/m2a-tcgrepublic-map.json', 'utf8'));
const SET = 'C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/data/sets/m2a.js';

const url = id => {
  const p = id.padStart(9, '0');
  return `https://tcgrepublic.com/media/binary/${p.slice(0,3)}/${p.slice(3,6)}/${p.slice(6,9)}/${id}.jpg`;
};

const kindFor = (v, num) => {
  if (v === 'erh') return ['e'];
  if (v === 'brh') return ['b'];
  if (v === 'normal' || v === 'trainer') return ['p', 'f'];
  return ['f', 'p'];   // holo, ex, ar, sr, ma, sar, mur
};

const lines = fs.readFileSync(SET, 'utf8').split('\n');
let hit = 0; const miss = [];
const out = lines.map(line => {
  const s = line.match(/\{id:"([^"]+)",name:"[^"]*",v:"(\w+)",num:(\d+),img:"([^"]+)"/);
  if (!s) return line;
  const [, id, v, numS, oldImg] = s;
  const num = parseInt(numS, 10);
  let mediaId = null;
  for (const k of kindFor(v, num)) { if (MAP[num + k]) { mediaId = MAP[num + k]; break; } }
  if (!mediaId) { miss.push(`${id}(${v})`); return line; }
  hit++;
  return line.replace(`img:"${oldImg}"`, `img:"${url(mediaId)}",img2:"${oldImg}"`);
});
fs.writeFileSync(SET, out.join('\n'));
console.log('remapped:', hit, '| missed:', miss.length, miss.slice(0, 15).join(', '));
