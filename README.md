# TCG Binder Planner

A zero-build, static web app for planning and tracking Pokémon TCG master-set binders. Open `index.html` and go — no server, no dependencies, works straight off the filesystem or GitHub Pages.

## How it works

One shared **binder engine** renders every set. Each binder is just a small data file layered on top of a default binder config — add a set by adding one file.

```
index.html          dashboard: binder shelf with logos + completion at a glance
binder.html         the engine: renders any registered set (?set=<id>)
css/app.css         shared design system (per-set theme via CSS variables)
js/registry.js      DEFAULT_SET config + registerSet() merge logic
js/engine.js        binder engine (spreads, gallery, page map, modal, watchlist)
js/dashboard.js     dashboard logic
data/catalog.js     master registry of all sets (name, era, logo, totals)
data/themes.js      per-set accent colors, auto-derived from the logos
data/sets/<id>.js   one file per set: card list + customizations
logos/              set logo PNGs (drive binder covers + theme colors)
legacy/             the previous one-page-per-set app, kept for reference
```

## Features

- **Completion at a glance** — progress rings and bars on the dashboard, a per-page "page map" strip inside each binder, and per-section completion chips.
- **Every card visible** — binder spread view (2 pages, adjustable pocket layouts from 2×2 to 5×5) plus an all-cards gallery grouped by section.
- **Clear owned/missing states** — owned cards get a green frame + OWNED tag; missing cards stay full-colour but matte with a MISSING watermark. Hover shows the pure untouched art. Click flips the card to toggle.
- **Set-themed visuals** — each binder is tinted from its own logo colors.
- **Watchlist & prices** — right-click any card for details, price tracking (raw / PSA 9 / PSA 10), and PriceCharting links.
- **Data continuity** — uses the same localStorage keys as the legacy app, so existing collection progress carries over untouched.

## Adding a new set

1. Drop the set logo into `logos/`.
2. Create `data/sets/<id>.js` with `registerSet('<id>', { binder: {...}, slots: [...] })` — anything you don't specify inherits from the default binder.
3. Add the set to `data/catalog.js`.
