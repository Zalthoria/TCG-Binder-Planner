/* ═══════════════════════════════════════════════════════════════════════
   Cloud sync (JSONbin) — per-key merge, so two devices can't clobber
   each other's work.

   Every synced key (one per binder, plus layout/active lists) carries its
   own "last modified" timestamp. On sync we compare key by key and keep
   whichever side is newer, instead of shipping the whole collection as a
   single blob. Edits to different binders on different devices both survive.

   Also re-pulls when the tab regains focus and every 45s while visible, so
   a long-open tab never pushes stale data over newer changes elsewhere.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  const KEY = '$2a$10$SgI1LlD3oDdXwzt6iGNQiu8g9ysN3wN0vxOZa9dcTlKNUB8Ro9iau';
  const URL = 'https://api.jsonbin.io/v3/b/6a1342fb6610dd3ae89bbd0c';
  const SYNCED = /owned|watched|prices|layout|active/;
  const META_KEY = 'tcg_sync_meta';      // { key: lastModifiedMs }
  const TS_KEY = 'tcg_sync_ts';          // legacy global stamp (kept for v1 fallback)
  const POLL_MS = 45000;

  const rawSet = localStorage.setItem.bind(localStorage);
  let pushTimer = null, applying = false, busy = false;

  // ── Status badge (tap to force a sync) ────────────────────────────────
  function badge() {
    let b = document.getElementById('sync-badge');
    if (!b && document.body) {
      b = document.createElement('div');
      b.id = 'sync-badge';
      b.title = 'Tap to sync now';
      b.style.cssText =
        'position:fixed;bottom:14px;right:14px;z-index:9998;padding:6px 13px;' +
        'border-radius:999px;font:700 11px/1 Outfit,system-ui,sans-serif;letter-spacing:.4px;' +
        'background:rgba(15,13,11,.9);border:1px solid rgba(255,255,255,.1);' +
        'backdrop-filter:blur(8px);color:#8a8276;box-shadow:0 4px 14px rgba(0,0,0,.45);' +
        'opacity:0;transition:opacity .3s;cursor:pointer';
      b.addEventListener('click', () => sync(true));
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

  // ── Local state helpers ───────────────────────────────────────────────
  function localData() {
    const d = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && SYNCED.test(k)) d[k] = localStorage.getItem(k);
    }
    return d;
  }
  function localMeta() {
    try { return JSON.parse(localStorage.getItem(META_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveMeta(m) { rawSet(META_KEY, JSON.stringify(m)); }

  // First run after upgrading from the old blob sync: seed timestamps so
  // existing local data isn't treated as ancient (or as newer than it is).
  function ensureMeta() {
    const m = localMeta();
    if (Object.keys(m).length) return m;
    const seed = parseInt(localStorage.getItem(TS_KEY) || '0') || Date.now();
    Object.keys(localData()).forEach(k => m[k] = seed);
    saveMeta(m);
    return m;
  }

  // ── Sync: pull, merge per key, push back only if we hold newer data ───
  async function sync(manual) {
    if (busy) return;
    busy = true;
    try {
      if (manual) status('⇅ Syncing…', '#c89a3a');
      const res = await fetch(URL, { headers: { 'X-Master-Key': KEY }, cache: 'no-store' });
      const cloud = (await res.json()).record || {};
      const cloudData = cloud.data || {};
      // v1 payloads have no per-key meta — fall back to the global stamp
      const cloudMeta = cloud.meta || (() => {
        const t = cloud.updated || 0, m = {};
        Object.keys(cloudData).forEach(k => m[k] = t);
        return m;
      })();

      const mine = localData();
      const meta = ensureMeta();
      const merged = { ...mine }, mergedMeta = { ...meta };
      let tookCloud = 0, haveNewer = 0;
      const legacyCloud = !cloud.meta;   // old blob format: timestamps aren't per-key

      // How many entries a stored value represents (arrays of ids / price maps)
      const size = v => { try { const p = JSON.parse(v); return Array.isArray(p) ? p.length : Object.keys(p || {}).length; } catch (e) { return v ? 1 : 0; } };

      new Set([...Object.keys(cloudData), ...Object.keys(mine)]).forEach(k => {
        const ct = cloudMeta[k] || 0, lt = meta[k] || 0;
        if (k in cloudData && ct > lt) {
          // Safety net for the one-time migration off the old blob sync: never let
          // an empty cloud entry wipe local progress when timestamps aren't reliable.
          if (legacyCloud && size(cloudData[k]) === 0 && size(mine[k]) > 0) { haveNewer++; return; }
          merged[k] = cloudData[k]; mergedMeta[k] = ct; tookCloud++;
        } else if (k in mine && lt > ct) {
          haveNewer++;
        }
      });

      if (tookCloud) {
        // keep a local rollback copy of what we had before applying cloud data
        try { rawSet('tcg_sync_backup', JSON.stringify({ at: Date.now(), data: mine })); } catch (e) {}
        applying = true;
        Object.keys(merged).forEach(k => { if (merged[k] !== mine[k]) { try { rawSet(k, merged[k]); } catch (e) {} } });
        applying = false;
        saveMeta(mergedMeta);
        document.dispatchEvent(new CustomEvent('cloud-sync-applied'));
      } else {
        saveMeta(mergedMeta);
      }

      if (haveNewer) await write(merged, mergedMeta);
      else status(tookCloud ? '✓ Updated from cloud' : '✓ Synced', '#38d47e', tookCloud ? 2500 : 1500);
    } catch (e) {
      status('✗ Offline', '#e05c5c', 4000);
    } finally {
      busy = false;
    }
  }

  async function write(data, meta) {
    const r = await fetch(URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': KEY },
      body: JSON.stringify({ v: 2, updated: Date.now(), data, meta }),
      keepalive: true,
    });
    rawSet(TS_KEY, String(Date.now()));
    status(r.ok ? '✓ Synced' : '✗ Sync failed', r.ok ? '#38d47e' : '#e05c5c', r.ok ? 2000 : 4000);
  }

  // Push local state (merging against cloud first so we never clobber)
  const schedulePush = () => { clearTimeout(pushTimer); pushTimer = setTimeout(() => sync(), 600); };

  // ── Track local writes ────────────────────────────────────────────────
  localStorage.setItem = function (k, v) {
    rawSet(k, v);
    if (!applying && SYNCED.test(k)) {
      const m = localMeta();
      m[k] = Date.now();
      saveMeta(m);
      status('⇅ Saving…', '#c89a3a');
      schedulePush();
    }
  };

  // ── Triggers ──────────────────────────────────────────────────────────
  window.addEventListener('load', () => { ensureMeta(); sync(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  window.addEventListener('focus', () => sync());
  setInterval(() => { if (!document.hidden) sync(); }, POLL_MS);

  // Leaving with unsaved changes: fire the write immediately (keepalive lets
  // it finish after the page goes away)
  window.addEventListener('pagehide', () => {
    if (!pushTimer) return;
    clearTimeout(pushTimer); pushTimer = null;
    try { write(localData(), localMeta()); } catch (e) {}
  });
})();
