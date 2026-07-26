/* ═══════════════════════════════════════════════════════════════════════
   Cloud sync module (JSONbin) — same bin as the legacy app, so existing
   cloud data carries over. Drop-in: just include this script.

   - On load: pulls the cloud copy; if it's newer, applies it and reloads.
   - On change: any owned/watched/prices/layout/active write is debounced
     and pushed automatically.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  const KEY = '$2a$10$SgI1LlD3oDdXwzt6iGNQiu8g9ysN3wN0vxOZa9dcTlKNUB8Ro9iau';
  const URL = 'https://api.jsonbin.io/v3/b/6a1342fb6610dd3ae89bbd0c';
  const SYNCED = /owned|watched|prices|layout|active/;
  const TS_KEY = 'tcg_sync_ts';

  let pushTimer = null;
  let applying = false;

  // ── Status badge ──────────────────────────────────────────────────────
  function badge() {
    let b = document.getElementById('sync-badge');
    if (!b && document.body) {
      b = document.createElement('div');
      b.id = 'sync-badge';
      b.style.cssText =
        'position:fixed;bottom:14px;right:14px;z-index:9998;padding:6px 13px;' +
        'border-radius:999px;font:700 11px/1 Outfit,system-ui,sans-serif;letter-spacing:.4px;' +
        'background:rgba(15,13,11,.9);border:1px solid rgba(255,255,255,.1);' +
        'backdrop-filter:blur(8px);color:#8a8276;box-shadow:0 4px 14px rgba(0,0,0,.45);' +
        'opacity:0;transition:opacity .3s;pointer-events:none';
      document.body.appendChild(b);
    }
    return b;
  }
  function status(text, color, ttl) {
    const b = badge();
    if (!b) return;
    b.textContent = text;
    b.style.color = color || '#8a8276';
    b.style.opacity = '1';
    clearTimeout(b._t);
    if (ttl) b._t = setTimeout(() => (b.style.opacity = '0'), ttl);
  }

  // ── Data helpers ──────────────────────────────────────────────────────
  function snapshot() {
    const d = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && SYNCED.test(k)) d[k] = localStorage.getItem(k);
    }
    return d;
  }

  const rawSet = localStorage.setItem.bind(localStorage);

  async function push() {
    try {
      status('⇅ Syncing…', '#c89a3a');
      const ts = Date.now();
      const r = await fetch(URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': KEY },
        body: JSON.stringify({ v: 1, updated: ts, data: snapshot() }),
      });
      rawSet(TS_KEY, String(ts));
      r.ok ? status('✓ Synced', '#38d47e', 2000) : status('✗ Sync failed', '#e05c5c', 4000);
    } catch (e) {
      status('✗ Offline', '#e05c5c', 4000);
    }
  }

  async function pull() {
    try {
      status('⇅ Loading…', '#c89a3a');
      const r = await fetch(URL, { headers: { 'X-Master-Key': KEY } });
      const cloud = (await r.json()).record;
      if (!cloud || !cloud.data || !cloud.updated) { status('✓ Synced', '#38d47e', 2000); return; }
      const localTs = parseInt(localStorage.getItem(TS_KEY) || '0');
      if (cloud.updated > localTs) {
        applying = true;
        Object.entries(cloud.data).forEach(([k, v]) => { try { rawSet(k, v); } catch (e) {} });
        rawSet(TS_KEY, String(cloud.updated));
        applying = false;
        status('✓ Loaded from cloud', '#38d47e', 2500);
        // re-render in place — no page reload
        document.dispatchEvent(new CustomEvent('cloud-sync-applied'));
      } else if (localTs > cloud.updated) {
        await push();
      } else {
        status('✓ Synced', '#38d47e', 2000);
      }
    } catch (e) {
      status('✗ Offline', '#e05c5c', 4000);
    }
  }

  // ── Auto-push on any tracked write ────────────────────────────────────
  localStorage.setItem = function (k, v) {
    rawSet(k, v);
    if (!applying && SYNCED.test(k)) {
      rawSet(TS_KEY, String(Date.now()));
      clearTimeout(pushTimer);
      pushTimer = setTimeout(push, 400);
    }
  };

  function flush() {
    if (pushTimer) {
      clearTimeout(pushTimer);
      pushTimer = null;
      try {
        navigator.sendBeacon && push();
      } catch (e) {}
    }
  }
  window.addEventListener('pagehide', flush);
  window.addEventListener('load', () => { sessionStorage.removeItem('sync_reloaded_stale'); pull(); });
})();
