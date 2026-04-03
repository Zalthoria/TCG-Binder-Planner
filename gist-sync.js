/**
 * gist-sync.js  —  Pokémon TCG Binders
 *
 * Syncs your collection data to a private GitHub Gist.
 * Automatically saves every change and loads on every page open.
 *
 * ── SETUP (one time, ~2 minutes) ──────────────────────────────────────────
 *
 * Step 1: Create a secret Gist
 *   • Go to https://gist.github.com
 *   • Filename: tcg-binders-data.json
 *   • Content:  {}
 *   • Click "Create secret gist"
 *   • Copy the Gist ID from the URL:
 *     https://gist.github.com/Zalthoria/THIS_PART_IS_THE_GIST_ID
 *
 * Step 2: Create a Personal Access Token
 *   • Go to GitHub → Settings → Developer settings
 *     → Personal access tokens → Tokens (classic)
 *     → Generate new token (classic)
 *   • Note: "TCG Binders sync"
 *   • Expiration: No expiration  (or 1 year)
 *   • Scope: tick only  ✓ gist
 *   • Click Generate token — copy it immediately (shown only once)
 *
 * Step 3: Enter both in the app
 *   • Open the app in your browser
 *   • Click the ☁ button (bottom-right corner)
 *   • Paste your Gist ID and token — click Save & Connect
 *   • Done. Data syncs automatically across all your devices.
 */

(function () {
  'use strict';

  const SYNC_KEYS = [
    'M2a_owned_v1', 'M2a_watched_v1', 'M2a_prices_v2',
    'penny_owned_v1', 'penny_watched_v1', 'penny_prices_v1',
  ];

  const LS_GIST_ID     = 'gistsync_gist_id';
  const LS_TOKEN       = 'gistsync_token';
  const LS_LAST        = 'gistsync_last_sync';
  const LS_PULL_RELOAD = 'gistsync_pull_reload_at'; // timestamp — replaces sessionStorage flag
  const GIST_FILE      = 'tcg-binders-data.json';

  let pushTimer  = null;
  let pollTimer  = null;
  let isSyncing  = false; // true while any network op is running — blocks push during pull

  function getGistId () { return (localStorage.getItem(LS_GIST_ID) || '').trim(); }
  function getToken  () { return (localStorage.getItem(LS_TOKEN)   || '').trim(); }
  function isReady   () { return !!(getGistId() && getToken()); }

  // ── localStorage intercept ─────────────────────────────────────────────
  // Fires a debounced push whenever a TCG key is written — but never during
  // a pull (isSyncing) to avoid push/pull races.
  const _origSet = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    _origSet.call(this, key, value);
    if (this === localStorage && SYNC_KEYS.includes(key) && isReady() && !isSyncing) {
      schedulePush();
    }
  };

  function schedulePush () {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => push(false), 2500);
  }

  // ── Background polling ─────────────────────────────────────────────────
  // Polls Gist every 30 s. When new data is found, writes it to localStorage
  // and shows a tap-to-reload banner — no surprise interruptions.
  const POLL_MS = 10000;

  function startPolling () {
    stopPolling();
    pollTimer = setInterval(pollForChanges, POLL_MS);
  }

  function stopPolling () {
    clearInterval(pollTimer);
    pollTimer = null;
  }

  async function pollForChanges () {
    if (!isReady() || isSyncing) return;
    isSyncing = true;
    try {
      const remote = await readGist();
      let changed = 0;
      SYNC_KEYS.forEach(k => {
        const rv = remote[k];
        const lv = localStorage.getItem(k);
        if (rv !== undefined && rv !== lv) {
          _origSet.call(localStorage, k, rv); // write silently, bypassing push intercept
          changed++;
        }
      });
      if (changed > 0) {
        _origSet.call(localStorage, LS_LAST, String(Date.now()));
        updateLastSyncLabel();
        showUpdateBanner(changed); // tell user, let them decide when to reload
      }
    } catch (e) {
      console.warn('[GistSync] poll:', e.message); // silent — background op
    }
    isSyncing = false;
  }

  // Shows a non-intrusive banner: user taps "Reload" when ready.
  // Data is already in localStorage so even dismissing is safe.
  function showUpdateBanner (changed) {
    let b = document.getElementById('gs-update-banner');
    if (!b) {
      b = document.createElement('div');
      b.id = 'gs-update-banner';
      b.style.cssText = [
        'position:fixed;bottom:62px;right:14px;z-index:900',
        'background:#1a2810;border:1px solid #3a6020;border-radius:10px',
        'padding:8px 12px;font-size:12px;font-family:inherit',
        'display:flex;align-items:center;gap:10px',
        'box-shadow:0 2px 14px rgba(0,0,0,.5);color:#70c040',
      ].join(';');
      document.body.appendChild(b);
    }
    b.innerHTML =
      `☁ ${changed} update${changed > 1 ? 's' : ''} from Gist ` +
      `<button onclick="location.reload()" style="` +
        `padding:3px 10px;border-radius:6px;border:1px solid #3a6020;` +
        `background:#243810;color:#80d040;cursor:pointer;` +
        `font-family:inherit;font-size:12px;font-weight:600` +
      `">Reload ↺</button>` +
      `<button onclick="this.parentElement.style.display='none'" style="` +
        `background:none;border:none;color:#333;cursor:pointer;font-size:16px;padding:0 2px` +
      `">✕</button>`;
    b.style.display = 'flex';
    setStatus('ok', '☁ Update ready');
  }

  // Pause polling when tab is hidden, resume + immediate check when visible again
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopPolling();
    } else if (isReady()) {
      pollForChanges(); // immediate catch-up on tab focus
      startPolling();
    }
  });


  // ── Gist API ───────────────────────────────────────────────────────────
  async function gistRequest (method, body) {
    const res = await fetch(`https://api.github.com/gists/${getGistId()}`, {
      method,
      headers: {
        Authorization:          `token ${getToken()}`,
        Accept:                 'application/vnd.github+json',
        'Content-Type':         'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    return res.json();
  }

  async function readGist () {
    const gist = await gistRequest('GET');
    const file = gist.files && gist.files[GIST_FILE];
    if (!file) return {};
    let text = file.content;
    if (file.truncated) {
      const raw = await fetch(file.raw_url);
      text = await raw.text();
    }
    try { return JSON.parse(text || '{}'); } catch { return {}; }
  }

  async function writeGist (data) {
    await gistRequest('PATCH', {
      files: { [GIST_FILE]: { content: JSON.stringify(data, null, 2) } },
    });
    _origSet.call(localStorage, LS_LAST, String(Date.now()));
  }

  // ── Pull: Gist → localStorage ──────────────────────────────────────────
  async function pull (manual = false) {
    if (!isReady() || isSyncing) return 0;
    isSyncing = true;
    setStatus('syncing', '☁ Loading…');
    try {
      const remote = await readGist();

      // Compare remote vs local to detect whether anything actually changed
      let changed = 0;
      SYNC_KEYS.forEach(k => {
        const remoteVal = remote[k];
        const localVal  = localStorage.getItem(k);
        if (remoteVal !== undefined && remoteVal !== localVal) {
          _origSet.call(localStorage, k, remoteVal); // bypass our intercept
          changed++;
        }
      });

      _origSet.call(localStorage, LS_LAST, String(Date.now()));
      setStatus('ok', '☁ Synced');
      updateLastSyncLabel();
      isSyncing = false;

      if (manual) {
        if (changed > 0) {
          showToast(`✓ Pulled ${changed} updated keys — reloading…`);
          _origSet.call(localStorage, LS_PULL_RELOAD, String(Date.now()));
          setTimeout(() => location.reload(), 1200);
        } else {
          showToast('✓ Already up to date');
        }
      }
      return changed;
    } catch (e) {
      console.error('[GistSync] pull error:', e.message);
      setStatus('err', '☁ Error');
      if (manual) showToast('⚠ Pull failed: ' + e.message);
      isSyncing = false;
      return 0;
    }
  }

  // ── Push: localStorage → Gist ──────────────────────────────────────────
  async function push (manual = false) {
    if (!isReady() || isSyncing) return;
    isSyncing = true;
    setStatus('syncing', '☁ Saving…');
    try {
      const data = {};
      SYNC_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v) data[k] = v; });
      await writeGist(data);
      setStatus('ok', '☁ Synced');
      updateLastSyncLabel();
      if (manual) showToast('✓ Saved to Gist');
    } catch (e) {
      console.error('[GistSync] push error:', e.message);
      setStatus('err', '☁ Error');
      if (manual) showToast('⚠ Save failed: ' + e.message);
    }
    isSyncing = false;
  }

  // ── UI ─────────────────────────────────────────────────────────────────
  let btnEl = null;

  function setStatus (state, label) {
    if (!btnEl) return;
    const lbl = btnEl.querySelector('.gs-label');
    if (lbl) lbl.textContent = label;
    const colours = { ok:'#4cff80', syncing:'#c89a3a', err:'#ff7060', off:'#555' };
    const borders  = { ok:'#2a4a2a', syncing:'#4a3a10', err:'#5a2010', off:'#2a2620' };
    btnEl.style.color       = colours[state] || colours.off;
    btnEl.style.borderColor = borders[state] || borders.off;
  }

  function updateLastSyncLabel () {
    const el = document.getElementById('gs-last-sync');
    if (!el) return;
    const ts = localStorage.getItem(LS_LAST);
    el.textContent = ts ? new Date(parseInt(ts)).toLocaleString() : 'Never';
  }

  function injectUI () {
    const style = document.createElement('style');
    style.textContent = `
      #gs-btn{
        position:fixed;bottom:14px;right:14px;z-index:800;
        background:#1a1814;border:1px solid #2a2620;border-radius:10px;
        padding:8px 13px;font-family:inherit;font-size:12px;cursor:pointer;
        display:flex;align-items:center;gap:7px;color:#555;
        box-shadow:0 2px 12px rgba(0,0,0,.5);transition:background .13s;
      }
      #gs-btn:hover{background:#222}
      .gs-icon{font-size:15px;line-height:1}
      .gs-label{white-space:nowrap}
      #gs-modal{
        display:none;position:fixed;inset:0;background:rgba(0,0,0,.88);
        z-index:1100;align-items:flex-start;justify-content:center;
        padding:30px 12px;overflow-y:auto;
      }
      #gs-modal.open{display:flex}
      #gs-box{
        background:#1a1814;border:1px solid #2a2620;border-radius:14px;
        padding:22px;max-width:440px;width:100%;margin:auto;
      }
      .gs-title{font-size:15px;font-weight:700;color:#fff;margin-bottom:12px}
      .gs-field{margin-bottom:11px}
      .gs-field label{display:block;font-size:10px;color:#555;text-transform:uppercase;
        letter-spacing:.05em;font-weight:600;margin-bottom:5px}
      .gs-input{width:100%;background:#0b0a08;border:1px solid #222;border-radius:7px;
        padding:8px 10px;font-size:12px;color:#ddd;font-family:'Courier New',monospace;outline:none;}
      .gs-input:focus{border-color:#5a3a10}
      .gs-input::placeholder{color:#2a2826}
      .gs-status-box{background:#111;border-radius:8px;padding:10px 12px;
        font-size:11px;margin-bottom:12px;line-height:2;}
      .gs-sr{display:flex;justify-content:space-between;align-items:center}
      .gs-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}
      .gs-btn-a{padding:8px 14px;border-radius:7px;font-size:12px;font-weight:600;
        cursor:pointer;font-family:inherit;border:1px solid;}
      .gsa-save  {background:#1e2a10;border-color:#3a5020;color:#80c040}
      .gsa-save:hover{background:#283814}
      .gsa-push  {background:#1e1a38;border-color:#3a3060;color:#8070d0}
      .gsa-push:hover{background:#26224a}
      .gsa-pull  {background:#101a2a;border-color:#1a3050;color:#5090d0}
      .gsa-pull:hover{background:#162236}
      .gsa-dim   {background:#1a1814;border-color:#2a2620;color:#666}
      .gsa-dim:hover{background:#222}
      .gs-hint{font-size:10px;color:#333;margin-top:10px;line-height:1.7}
      .gs-hint a{color:#5060a0;text-decoration:none}.gs-hint a:hover{color:#8090d0}
      .gs-flash{font-size:11px;display:none;margin-top:6px}
    `;
    document.head.appendChild(style);

    // Floating button
    btnEl = document.createElement('button');
    btnEl.id      = 'gs-btn';
    btnEl.onclick = openModal;
    btnEl.innerHTML = `<span class="gs-icon">☁</span><span class="gs-label">Gist Sync</span>`;
    document.body.appendChild(btnEl);

    // Modal
    const modal = document.createElement('div');
    modal.id      = 'gs-modal';
    modal.onclick = e => { if (e.target === modal) closeModal(); };
    modal.innerHTML = `
      <div id="gs-box">
        <div class="gs-title">☁ GitHub Gist Sync</div>
        <div class="gs-field">
          <label>Gist ID</label>
          <input class="gs-input" id="gs-gist-id" type="text"
            placeholder="e.g. a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4"
            spellcheck="false" autocomplete="off">
        </div>
        <div class="gs-field">
          <label>Personal Access Token (gist scope only)</label>
          <input class="gs-input" id="gs-token" type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            spellcheck="false" autocomplete="off">
        </div>
        <div class="gs-row">
          <button class="gs-btn-a gsa-save" onclick="window.GistSync.saveCredentials()">Save & Connect</button>
        </div>
        <div class="gs-status-box" id="gs-status-box" style="display:none">
          <div class="gs-sr"><span style="color:#444">Status</span><span id="gs-status-val" style="color:#4cff80">—</span></div>
          <div class="gs-sr"><span style="color:#444">Last sync</span><span id="gs-last-sync" style="color:#444">—</span></div>
        </div>
        <div class="gs-row" id="gs-action-row" style="display:none">
          <button class="gs-btn-a gsa-push" onclick="window.GistSync.push(true)">Push to Gist ↑</button>
          <button class="gs-btn-a gsa-pull" onclick="window.GistSync.pull(true)">Pull from Gist ↓</button>
          <button class="gs-btn-a gsa-dim"  onclick="window.GistSync.disconnect()">Disconnect</button>
        </div>
        <div class="gs-flash" id="gs-flash"></div>
        <div class="gs-hint">
          Need a Gist? Go to <a href="https://gist.github.com" target="_blank">gist.github.com</a>
          → filename: <code>tcg-binders-data.json</code> → content: <code>{}</code> → Create secret gist.<br>
          Need a token? <a href="https://github.com/settings/tokens" target="_blank">github.com/settings/tokens</a>
          → Generate new token (classic) → tick <strong>gist</strong> only.
        </div>
        <div class="gs-row" style="margin-top:12px">
          <button class="gs-btn-a gsa-dim" onclick="window.GistSync.closeModal()">Close</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  function openModal () {
    const idEl = document.getElementById('gs-gist-id');
    const tkEl = document.getElementById('gs-token');
    if (idEl) idEl.value = getGistId();
    if (tkEl) tkEl.value = getToken();
    refreshModalStatus();
    document.getElementById('gs-modal').classList.add('open');
  }

  function closeModal () {
    document.getElementById('gs-modal').classList.remove('open');
  }

  function refreshModalStatus () {
    const box = document.getElementById('gs-status-box');
    const row = document.getElementById('gs-action-row');
    const val = document.getElementById('gs-status-val');
    if (!box) return;
    if (isReady()) {
      box.style.display = 'block';
      row.style.display = 'flex';
      val.textContent   = 'Connected ✓';
      updateLastSyncLabel();
    } else {
      box.style.display = 'none';
      row.style.display = 'none';
    }
  }

  // ── Toast ──────────────────────────────────────────────────────────────
  let toastEl = null;
  function showToast (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.style.cssText = `
        position:fixed;bottom:62px;right:14px;z-index:900;
        background:#1a1814;border:1px solid #2a2620;border-radius:8px;
        padding:7px 13px;font-size:12px;font-family:inherit;
        box-shadow:0 2px 12px rgba(0,0,0,.5);transition:opacity .4s;pointer-events:none;
      `;
      document.body.appendChild(toastEl);
    }
    toastEl.textContent   = msg;
    toastEl.style.opacity = '1';
    toastEl.style.color   = msg.startsWith('✓') ? '#4cff80' : '#ff8060';
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => { toastEl.style.opacity = '0'; }, 3500);
  }

  // ── Public API ─────────────────────────────────────────────────────────
  window.GistSync = {
    push, pull, openModal, closeModal,

    saveCredentials () {
      const id  = (document.getElementById('gs-gist-id')?.value || '').trim();
      const tok = (document.getElementById('gs-token')?.value   || '').trim();
      if (!id || !tok) { showToast('⚠ Fill in both fields first'); return; }
      _origSet.call(localStorage, LS_GIST_ID, id);
      _origSet.call(localStorage, LS_TOKEN,   tok);
      showToast('Connecting — testing credentials…');
      // Test by doing a pull; if it works we're good
      pull(false).then(changed => {
        refreshModalStatus();
        setStatus('ok', '☁ Synced');
        if (changed > 0) {
          showToast(`✓ Connected! Pulled ${changed} updated keys — reloading…`);
          _origSet.call(localStorage, LS_PULL_RELOAD, String(Date.now()));
          setTimeout(() => { closeModal(); location.reload(); }, 1400);
        } else {
          showToast('✓ Connected! Your data is already up to date.');
          startPolling();
        }
      });
    },

    disconnect () {
      clearTimeout(pushTimer);
      _origSet.call(localStorage, LS_GIST_ID, '');
      _origSet.call(localStorage, LS_TOKEN,   '');
      setStatus('off', '☁ Gist Sync');
      closeModal();
      showToast('Disconnected from Gist');
    },
  };

  // ── Init ───────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    injectUI();

    if (!isReady()) {
      setStatus('off', '☁ Gist Sync');
      return;
    }

    // ── Break the reload loop ─────────────────────────────────────────
    // Use a localStorage timestamp instead of sessionStorage — sessionStorage
    // is unreliable across location.reload() on Android Chrome.
    // If we reloaded within the last 20 seconds due to a pull, skip auto-pull.
    const lastPullReload = parseInt(localStorage.getItem(LS_PULL_RELOAD) || '0');
    const recentlyPulled = (Date.now() - lastPullReload) < 20000;
    if (recentlyPulled) {
      _origSet.call(localStorage, LS_PULL_RELOAD, '0'); // clear flag
      setStatus('ok', '☁ Synced');
      startPolling(); // begin background checks every 30 s
      return;
    }

    // Auto-pull on page load — reload only if Gist has newer data
    setStatus('syncing', '☁ Loading…');
    pull(false).then(changed => {
      if (changed > 0) {
        _origSet.call(localStorage, LS_PULL_RELOAD, String(Date.now()));
        showToast(`☁ Updated ${changed} keys from Gist — reloading…`);
        setTimeout(() => location.reload(), 800);
      } else {
        setStatus('ok', '☁ Synced');
        startPolling(); // begin background checks every 30 s
      }
    });
  });

})();
