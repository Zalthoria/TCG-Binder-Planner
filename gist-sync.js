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
 *   • Click the ☁ button (bottom-right)
 *   • Paste your Gist ID and token — Save
 *   • Done. Data syncs automatically on every device.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * Nothing else to change. No billing. No accounts. Just GitHub.
 */

(function () {
  'use strict';

  // ── Keys that get synced ───────────────────────────────────────────────
  const SYNC_KEYS = [
    'M2a_owned_v1', 'M2a_watched_v1', 'M2a_prices_v2',
    'penny_owned_v1', 'penny_watched_v1', 'penny_prices_v1',
  ];

  // ── Credential storage keys ────────────────────────────────────────────
  const LS_GIST_ID = 'gistsync_gist_id';
  const LS_TOKEN   = 'gistsync_token';
  const LS_LAST    = 'gistsync_last_sync';
  const LS_SHA     = 'gistsync_sha';    // not used for Gist API but keep for compat

  const GIST_FILE  = 'tcg-binders-data.json';

  // ── State ──────────────────────────────────────────────────────────────
  let pushTimer = null;
  let isSyncing = false;

  function getGistId () { return localStorage.getItem(LS_GIST_ID) || ''; }
  function getToken  () { return localStorage.getItem(LS_TOKEN)   || ''; }
  function isReady   () { return !!(getGistId() && getToken()); }

  // ── localStorage intercept — auto-push on every TCG write ─────────────
  const _origSet = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    _origSet.call(this, key, value);
    if (this === localStorage && SYNC_KEYS.includes(key) && isReady()) {
      schedulePush();
    }
  };

  function schedulePush () {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => push(false), 2500);
  }

  // ── Gist API ───────────────────────────────────────────────────────────
  async function gistRequest (method, body) {
    const id    = getGistId();
    const token = getToken();
    if (!id || !token) throw new Error('Not configured');

    const res = await fetch(`https://api.github.com/gists/${id}`, {
      method,
      headers: {
        Authorization: `token ${token}`,
        Accept:        'application/vnd.github+json',
        'Content-Type': 'application/json',
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
    // Content may be truncated for large files — fetch raw_url if needed
    let text = file.content;
    if (file.truncated) {
      const raw = await fetch(file.raw_url);
      text = await raw.text();
    }
    return JSON.parse(text || '{}');
  }

  async function writeGist (data) {
    await gistRequest('PATCH', {
      files: {
        [GIST_FILE]: { content: JSON.stringify(data, null, 2) },
      },
    });
    _origSet.call(localStorage, LS_LAST, String(Date.now()));
  }

  // ── Pull: Gist → localStorage ──────────────────────────────────────────
  async function pull (manual = false) {
    if (!isReady()) return;
    setStatus('syncing', '☁ Loading…');
    try {
      const data = await readGist();
      let n = 0;
      SYNC_KEYS.forEach(k => {
        if (data[k] !== undefined) {
          _origSet.call(localStorage, k, data[k]);
          n++;
        }
      });
      setStatus('ok', '☁ Synced');
      updateLastSyncLabel();
      if (manual) {
        showToast(`✓ Pulled from Gist (${n} keys) — reloading…`);
        setTimeout(() => location.reload(), 1200);
      }
      return n;
    } catch (e) {
      console.error('[GistSync] pull error:', e);
      setStatus('err', '☁ Error');
      if (manual) showToast('⚠ Pull failed: ' + e.message);
    }
  }

  // ── Push: localStorage → Gist ──────────────────────────────────────────
  async function push (manual = false) {
    if (!isReady() || isSyncing) return;
    isSyncing = true;
    setStatus('syncing', '☁ Saving…');
    try {
      const data = {};
      SYNC_KEYS.forEach(k => {
        const v = localStorage.getItem(k);
        if (v) data[k] = v;
      });
      await writeGist(data);
      setStatus('ok', '☁ Synced');
      updateLastSyncLabel();
      if (manual) showToast('✓ Saved to Gist');
    } catch (e) {
      console.error('[GistSync] push error:', e);
      setStatus('err', '☁ Error');
      if (manual) showToast('⚠ Save failed: ' + e.message);
    }
    isSyncing = false;
  }

  // ── UI ─────────────────────────────────────────────────────────────────
  let btnEl = null;

  function setStatus (state, label) {
    if (!btnEl) return;
    btnEl.dataset.state = state;
    const lbl = btnEl.querySelector('.gs-label');
    if (lbl) lbl.textContent = label;
    btnEl.style.color       = { ok:'#4cff80', syncing:'#c89a3a', err:'#ff7060', off:'#555' }[state] || '#555';
    btnEl.style.borderColor = { ok:'#2a4a2a', syncing:'#4a3a10', err:'#5a2010', off:'#2a2620' }[state] || '#2a2620';
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
      #gs-btn .gs-icon{font-size:15px;line-height:1}
      #gs-btn .gs-label{white-space:nowrap}

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
      .gs-field{margin-bottom:12px}
      .gs-field label{display:block;font-size:10px;color:#555;text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:5px}
      .gs-input{
        width:100%;background:#0b0a08;border:1px solid #222;border-radius:7px;
        padding:8px 10px;font-size:12px;color:#ddd;font-family:'Courier New',monospace;
        outline:none;
      }
      .gs-input:focus{border-color:#5a3a10}
      .gs-input::placeholder{color:#2a2826}
      .gs-status-box{
        background:#111;border-radius:8px;padding:10px 12px;
        font-size:11px;margin-bottom:12px;line-height:1.9;
      }
      .gs-status-row{display:flex;justify-content:space-between;align-items:center}
      .gs-row{display:flex;gap:7px;flex-wrap:wrap;margin-top:4px}
      .gs-btn-a{
        padding:8px 14px;border-radius:7px;font-size:12px;font-weight:600;
        cursor:pointer;font-family:inherit;border:1px solid;
      }
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
      .gs-flash{font-size:11px;display:none;margin-top:5px}
    `;
    document.head.appendChild(style);

    // Floating button
    btnEl = document.createElement('button');
    btnEl.id = 'gs-btn';
    btnEl.onclick = openModal;
    btnEl.innerHTML = `<span class="gs-icon">☁</span><span class="gs-label">Gist Sync</span>`;
    document.body.appendChild(btnEl);

    // Modal
    const modal = document.createElement('div');
    modal.id = 'gs-modal';
    modal.onclick = e => { if (e.target === modal) closeModal(); };
    modal.innerHTML = `
      <div id="gs-box">
        <div class="gs-title">☁ GitHub Gist Sync</div>

        <div class="gs-field">
          <label>Gist ID</label>
          <input class="gs-input" id="gs-gist-id" type="text" placeholder="e.g. a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4" spellcheck="false" autocomplete="off">
        </div>
        <div class="gs-field">
          <label>Personal Access Token (gist scope)</label>
          <input class="gs-input" id="gs-token" type="password" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" spellcheck="false" autocomplete="off">
        </div>

        <div class="gs-row" style="margin-bottom:12px">
          <button class="gs-btn-a gsa-save" onclick="window.GistSync.saveCredentials()">Save & Connect</button>
        </div>

        <div class="gs-status-box" id="gs-status-box" style="display:none">
          <div class="gs-status-row"><span style="color:#444">Status</span><span id="gs-status-val" style="color:#555">—</span></div>
          <div class="gs-status-row"><span style="color:#444">Last sync</span><span id="gs-last-sync" style="color:#444">—</span></div>
        </div>

        <div class="gs-row" id="gs-action-row" style="display:none">
          <button class="gs-btn-a gsa-push" onclick="window.GistSync.push(true)">Push to Gist</button>
          <button class="gs-btn-a gsa-pull" onclick="window.GistSync.pull(true)">Pull from Gist</button>
          <button class="gs-btn-a gsa-dim"  onclick="window.GistSync.disconnect()">Disconnect</button>
        </div>
        <div class="gs-flash" id="gs-flash"></div>

        <div class="gs-hint">
          No account needed beyond GitHub. Create a
          <a href="https://gist.github.com" target="_blank">secret Gist</a>
          with file <code>tcg-binders-data.json</code> and content <code>{}</code>.<br>
          Then create a
          <a href="https://github.com/settings/tokens" target="_blank">Personal Access Token</a>
          with only the <strong>gist</strong> scope.<br>
          Full setup guide is in the comments at the top of <code>gist-sync.js</code>.
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
      val.style.color   = '#4cff80';
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
        box-shadow:0 2px 12px rgba(0,0,0,.5);transition:opacity .3s;
      `;
      document.body.appendChild(toastEl);
    }
    toastEl.textContent    = msg;
    toastEl.style.opacity  = '1';
    toastEl.style.color    = msg.startsWith('✓') ? '#4cff80' : '#ff8060';
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => { toastEl.style.opacity = '0'; }, 3500);
  }

  // ── Public API ─────────────────────────────────────────────────────────
  window.GistSync = {
    push, pull, openModal, closeModal,

    saveCredentials () {
      const idEl = document.getElementById('gs-gist-id');
      const tkEl = document.getElementById('gs-token');
      const id   = (idEl?.value || '').trim();
      const tok  = (tkEl?.value || '').trim();
      if (!id || !tok) { showToast('⚠ Fill in both fields first'); return; }
      _origSet.call(localStorage, LS_GIST_ID, id);
      _origSet.call(localStorage, LS_TOKEN, tok);
      // Pull immediately to confirm connection works
      showToast('Connecting…');
      pull(false).then(n => {
        if (n !== undefined) {
          setStatus('ok', '☁ Synced');
          refreshModalStatus();
          showToast(`✓ Connected! Pulled ${n} keys.`);
          // Reload so the binder picks up pulled data
          setTimeout(() => { closeModal(); location.reload(); }, 1400);
        }
      });
    },

    disconnect () {
      _origSet.call(localStorage, LS_GIST_ID, '');
      _origSet.call(localStorage, LS_TOKEN, '');
      setStatus('off', '☁ Gist Sync');
      closeModal();
      showToast('Disconnected');
    },
  };

  // ── Init ───────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    injectUI();
    if (isReady()) {
      setStatus('ok', '☁ Synced');
      // Pull on page load to get latest data, then reload the page UI
      pull(false).then(n => {
        if (n > 0) {
          // Data changed — reload so binders re-read from localStorage
          location.reload();
        }
      });
    } else {
      setStatus('off', '☁ Gist Sync');
    }
  });

})();
