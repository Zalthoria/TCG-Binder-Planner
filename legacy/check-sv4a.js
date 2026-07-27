const fs = require('fs');
const MAP = JSON.parse(fs.readFileSync('C:/Users/User/Downloads/sv4a-tcgrepublic-map.json', 'utf8'));
const mirrorNums = Object.keys(MAP).filter(k => k.endsWith('m')).map(k => parseInt(k)).sort((a, b) => a - b);
const src = fs.readFileSync('C:/Users/User/Documents/GitHubProjects/TCG-Binder-Planner/data/sets/sv4a.js', 'utf8');
const have = new Set([...src.matchAll(/id:'SV4a-(\d+)-RH'/g)].map(m => parseInt(m[1])));
const missing = mirrorNums.filter(n => !have.has(n));
console.log('missing mirror nums:', missing.join(', ') || 'none');
const lines = src.split('\n');
missing.forEach(n => {
  const line = lines.find(l => l.includes("id:'SV4a-" + n + "'"));
  console.log(n, '->', line ? line.trim().slice(0, 160) : 'NO BASE SLOT FOUND');
});
