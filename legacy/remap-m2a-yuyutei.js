// One-off: remap M2a variant slot images to Yuyutei's per-variant scans.
// Parses the saved yuyu-tei set page dump, rewrites data/sets/m2a.js img fields,
// keeping the old limitless URL as img2 fallback.
const fs = require('fs');

const DUMP = process.argv[2];               // saved web_fetch dump of yuyu-tei m02a set page
const SET  = 'C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/data/sets/m2a.js';

const dump = fs.readFileSync(DUMP, 'utf8');

// Entries look like: [091/193 - リオル(ボール柄/ミラー仕様) ...](https://yuyu-tei.jp/sell/poc/card/m02a/10243)
const re = /\[(\d{3})\/193\s+(\S+)\s+([^\]]+?)\]\(https:\/\/yuyu-tei\.jp\/sell\/poc\/card\/m02a\/(\d+)\)/g;
const map = {};   // key: `${num}:${kind}` -> pid
let m, count = 0;
while ((m = re.exec(dump))) {
  const num = parseInt(m[1], 10), name = m[3], pid = m[4];
  let kind = 'base';
  if (name.includes('ボール柄'))            kind = 'brh';
  else if (name.includes('ロケット団マーク')) kind = 'brh';   // R-mark mirrors = his "R ball" slots
  else if (name.includes('エネルギーマーク柄')) kind = 'erh';
  else if (name.includes('(R仕様)'))         kind = 'rspec';  // holo print of the base card
  const key = num + ':' + kind;
  if (!map[key]) { map[key] = pid; count++; }
}
console.log('yuyutei entries mapped:', count);

const IMG = pid => `https://card.yuyu-tei.jp/poc/front/m02a/${pid}.jpg`;

const lines = fs.readFileSync(SET, 'utf8').split('\n');
let hit = 0, miss = [];
const out = lines.map(line => {
  const s = line.match(/\{id:"([^"]+)",name:"[^"]*",v:"(\w+)",num:(\d+),img:"([^"]+)"/);
  if (!s) return line;
  const [, id, v, numS, oldImg] = s;
  const num = parseInt(numS, 10);
  let key;
  if (v === 'erh') key = num + ':erh';
  else if (v === 'brh') key = num + ':brh';
  else if (v === 'holo') key = map[num + ':rspec'] ? num + ':rspec' : num + ':base';
  else key = num + ':base';
  const pid = map[key];
  if (!pid) { miss.push(id + '(' + v + ')'); return line; }
  hit++;
  return line
    .replace(`img:"${oldImg}"`, `img:"${IMG(pid)}",img2:"${oldImg}"`);
});
fs.writeFileSync(SET, out.join('\n'));
console.log('slots remapped:', hit, '| unmatched:', miss.length, miss.slice(0, 12).join(', '));
