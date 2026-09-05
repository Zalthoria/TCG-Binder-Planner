/* ═══════════════════════════════════════════════════════════════════════
   IP home — pick a game, then go to that game's binder shelf.
   Reads the same localStorage keys as the shelf and the binder engine.
   ═══════════════════════════════════════════════════════════════════════ */

const $  = id => document.getElementById(id);
const el = (tag, cls, html) => { const d = document.createElement(tag); if (cls) d.className = cls; if (html != null) d.innerHTML = html; return d; };

const LS_ACTIVE = 'tcgplanner_active_binders_v1';

// Self-contained so this page doesn't depend on the shelf's helpers.
function ownedCount(key) {
  try { return (JSON.parse(localStorage.getItem(key)) || []).length; } catch (e) { return 0; }
}
function activeIds() {
  try { return JSON.parse(localStorage.getItem(LS_ACTIVE)); } catch (e) { return null; }
}

// Stats for one IP. Falls back to every set in that IP when the user has
// never opened the shelf (no saved active list yet).
function statsFor(ipId) {
  const active = activeIds();
  const sets = (window.CATALOG || []).filter(c => c.ip === ipId && (!active || active.includes(c.id)));
  let owned = 0, total = 0, done = 0;
  sets.forEach(c => {
    const n = Math.min(ownedCount(c.lsOwned), c.total);
    owned += n; total += c.total;
    if (c.total && n >= c.total) done++;
  });
  return { sets: sets.length, owned, total, done, pct: total ? Math.round(owned / total * 100) : 0 };
}

function ipTile(ip) {
  const s = statsFor(ip.id);
  const tile = el('div', 'ip glass' + (s.sets ? '' : ' empty'));
  tile.style.setProperty('--a', ip.accent);

    const mark = el('div', 'ip-mark');
  const glyph = () => el('div', 'ip-glyph', ip.name.trim().charAt(0));
  if (ip.logo) {
    // A real wordmark already carries the name, so it replaces the text row.
    mark.classList.add('has-logo');
    const box = el('div', 'ip-logo');
    const im = el('img');
    im.alt = ip.name; im.loading = 'lazy';
    im.onerror = () => {                       // fall back to the letter tile
      mark.classList.remove('has-logo');
      box.remove();
      mark.prepend(el('div', 'ip-name', ip.name));
      mark.prepend(glyph());
    };
    im.src = ip.logo;
    box.appendChild(im);
    mark.appendChild(box);
    mark.appendChild(el('div', 'ip-blurb', ip.blurb || ''));
  } else {
    mark.appendChild(glyph());
    const names = el('div');
    names.appendChild(el('div', 'ip-name', ip.name));
    names.appendChild(el('div', 'ip-blurb', ip.blurb || ''));
    mark.appendChild(names);
  }
  tile.appendChild(mark);

  const body = el('div', 'ip-body');
  if (s.sets) {
    body.appendChild(el('div', 'ip-nums',
      `<span class="big">${s.pct}%</span><span class="of">${s.owned.toLocaleString()} / ${s.total.toLocaleString()} cards</span>`));
    body.appendChild(el('div', 'ip-bar', `<i style="width:${s.pct}%"></i>`));
    body.appendChild(el('div', 'ip-foot',
      `<span>${s.sets} ${s.sets === 1 ? 'binder' : 'binders'}${s.done ? ' · ' + s.done + ' complete' : ''}</span><span class="go">Open →</span>`));
  } else {
    body.appendChild(el('div', 'ip-foot', '<span>No binders yet</span>'));
  }
  tile.appendChild(body);

  if (s.sets) tile.addEventListener('click', () => { location.href = 'shelf.html?ip=' + encodeURIComponent(ip.id); });
  return tile;
}

function render() {
  const ips = window.IPS || [];
  const host = $('ips');
  host.innerHTML = '';
  ips.forEach(ip => host.appendChild(ipTile(ip)));

  const live = ips.filter(ip => statsFor(ip.id).sets).length;
  $('ip-count').textContent = live + (live === 1 ? ' game tracked' : ' games tracked');

  // Global roll-up across every IP
  let owned = 0, total = 0, binders = 0, done = 0;
  ips.forEach(ip => { const s = statsFor(ip.id); owned += s.owned; total += s.total; binders += s.sets; done += s.done; });
  $('g-owned').textContent    = owned.toLocaleString();
  $('g-total').textContent    = total.toLocaleString();
  $('g-binders').textContent  = binders;
  $('g-complete').textContent = done;

  const pct = total ? Math.round(owned / total * 100) : 0;
  const R = 30, C = 2 * Math.PI * R;
  $('g-ring').innerHTML = `
    <svg width="76" height="76">
      <circle class="ring-bg" cx="38" cy="38" r="${R}" stroke-width="6"/>
      <circle class="ring-fg" cx="38" cy="38" r="${R}" stroke-width="6"
        stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/>
    </svg>
    <div class="ring-txt"><span class="ring-pct" style="font-size:15px">${pct}%</span></div>`;
}

render();
document.addEventListener('cloud-sync-applied', render);
