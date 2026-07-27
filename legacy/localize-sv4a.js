const fs = require('fs');
const SET = 'C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/data/sets/sv4a.js';
const DIR = 'C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/images/sv4a';
let hit = 0, miss = 0;
const src = fs.readFileSync(SET, 'utf8').replace(
  /img:'(https:\/\/tcgrepublic\.com\/media\/binary\/\d{3}\/\d{3}\/\d{3}\/(\d+)\.jpg)'/g,
  (all, url, id) => { if (!fs.existsSync(`${DIR}/${id}.jpg`)) { miss++; return all; } hit++; return `img:'images/sv4a/${id}.jpg'`; }
);
fs.writeFileSync(SET, src);
console.log('localized:', hit, '| missing:', miss);
