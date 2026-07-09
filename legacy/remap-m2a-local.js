// One-off: switch M2a slot images to local files (images/m2a/), shop URL becomes fallback.
const fs = require('fs');
const SET = 'C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/data/sets/m2a.js';
const IMGDIR = 'C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/images/m2a';

let hit = 0, missing = 0;
const src = fs.readFileSync(SET, 'utf8').replace(
  /img:"(https:\/\/tcgrepublic\.com\/media\/binary\/\d{3}\/\d{3}\/\d{3}\/(\d+)\.jpg)",img2:"[^"]*"/g,
  (all, shopUrl, id) => {
    if (!fs.existsSync(`${IMGDIR}/${id}.jpg`)) { missing++; return all; }
    hit++;
    return `img:"images/m2a/${id}.jpg",img2:"${shopUrl}"`;
  }
);
fs.writeFileSync(SET, src);
console.log('localized:', hit, '| local file missing (left on shop URL):', missing);
