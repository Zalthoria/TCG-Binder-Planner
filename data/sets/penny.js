// penny — every print of Penny / Cassiopeia, plus the cards she appears on.
// 30 slots. Pages are driven by `sec`, colours by `v`.
//
// Every page follows the same rule: row 1 holds the odd ones out (alternate
// finishes, or prints with no counterpart), rows 2 and 3 pair Japanese over
// English down the columns.
//
// Verified Sep 2026: Prismatic Evolutions gives Trainers the standard reverse
// and the Poke Ball pattern but NOT the Master Ball (that is non-ex Pokemon
// only), and Terastal Festival ex gives Trainers the Monster Ball mirror but
// not the Master Ball. Secret rares (SIR/SAR/UR/SR) take no parallel at all,
// which is why the Clive prints and the full arts are single cards.
registerSet('penny', {
  binder: {
  title:    'Penny (ボタン) — All Prints',
  subtitle: '30 slots · chase → cameos → EN → JP',
  navTitle: 'Penny — All Prints · 30 slots',
  lsOwned:  'penny_owned_v1',
  lsWatched:'penny_watched_v1',
  lsPrices: 'penny_prices_v1',
  legend: [
    { label: 'JP Regular',      color: '#aaa'    },
    { label: 'JP SR (FA)',      color: '#c89a3a' },
    { label: 'JP SAR',          color: '#9870e0' },
    { label: 'JP Promo',        color: '#40c0a0' },
    { label: 'JP Mirror',       color: '#d0d0e0' },
    { label: 'EN Regular',      color: '#6070c0' },
    { label: 'EN Ultra Rare',   color: '#50a0d8' },
    { label: 'EN SIR',          color: '#b070d8' },
    { label: 'EN Reverse Holo', color: '#e0609c' },
    { label: 'Poké Ball Rev',   color: '#4fb8c8' },
    { label: 'EN Promo / WC',   color: '#7fc060' },
    { label: 'Cameo (JP)',      color: '#c07840' },
    { label: 'Cameo (EN)',      color: '#e09860' },
  ],
},
  bc: {
  'r-jp':     { bg: '#181410', col: '#aaa'    },
  'sr-jp':    { bg: '#2a1e04', col: '#c89a3a' },
  'sar-jp':   { bg: '#1e1040', col: '#9870e0' },
  'promo-jp': { bg: '#0a2a28', col: '#40c0a0' },
  'mirror-jp':{ bg: '#20202a', col: '#d0d0e0' },
  'r-en':     { bg: '#181428', col: '#6070c0' },
  'ur-en':    { bg: '#102030', col: '#50a0d8' },
  'sir-en':   { bg: '#200838', col: '#b070d8' },
  'rh-en':    { bg: '#2a0e1c', col: '#e0609c' },
  'ball-en':  { bg: '#08262c', col: '#4fb8c8' },
  'promo-en': { bg: '#0e2010', col: '#7fc060' },
  'cameo-jp': { bg: '#241408', col: '#c07840' },
  'cameo-en': { bg: '#2a1a0c', col: '#e09860' },
},
  bcDefault: { bg: '#181410', col: '#666' },
  sdefs: [
  { label: 'Page 1 · The chase', f: s => s.sec === 'chase' },
  { label: 'Page 2 · Cameos',   f: s => s.sec === 'cameo' },
  { label: 'Page 3 · English',  f: s => s.sec === 'en' },
  { label: 'Page 4 · Japanese', f: s => s.sec === 'jp' },
],
  slots: [
  // ══ SECTION · JAPANESE (page 4) ═══════════════════════════════════════════════════
  // Row 1 — base art, three finishes
  { id:'SV1S-077', name:'Penny', set:'Scarlet ex', v:'r-jp', sec:'jp',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV1S/SV1S_77_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-scarlet-ex/penny-77' },
  { id:'SVP-057',  name:'Penny', set:'SV-P Promo', v:'promo-jp', sec:'jp',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SVP/SVP_57_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-sv-p-promos/penny-57' },
  { id:'SV4a-182', name:'Penny', set:'Shiny Treasure ex', v:'r-jp', sec:'jp',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV4a/SV4a_182_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-shiny-treasure-ex/penny-182' },
  // Row 2 — the Penny chase
  { id:'SV1S-100', name:'Penny', set:'Scarlet ex', v:'sr-jp', sec:'jp',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV1S/SV1S_100_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-scarlet-ex/penny-100' },
  { id:'SV1S-105', name:'Penny', set:'Scarlet ex', v:'sar-jp', sec:'jp',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV1S/SV1S_105_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-scarlet-ex/penny-105' },
  { id:'SV4a-354', name:'Penny', set:'Shiny Treasure ex', v:'sar-jp', sec:'jp',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV4a/SV4a_354_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-shiny-treasure-ex/penny-354' },
  // Row 3 — the Cassiopeia run
  { id:'SV6a-061', name:'Cassiopeia', set:'Night Wanderer', v:'r-jp', sec:'jp',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV6a/SV6a_61_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-night-wanderer/cassiopeia-61' },
  { id:'SV6a-085', name:'Cassiopeia', set:'Night Wanderer', v:'sr-jp', sec:'jp',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV6a/SV6a_85_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-night-wanderer/cassiopeia-85' },
  { id:'SV6a-091', name:'Cassiopeia', set:'Night Wanderer', v:'sar-jp', sec:'jp',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV6a/SV6a_91_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-night-wanderer/cassiopeia-91' },

  // ══ SECTION · ENGLISH (page 3) ════════════════════════════════════════════════════
  // Row 1 — base art + the two EN-only reverse holos
  { id:'SVI-183',   name:'Penny', set:'Scarlet & Violet', v:'r-en', sec:'en',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_183_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-scarlet-violet/penny-183' },
  { id:'SVI-183RH', name:'Penny', set:'Scarlet & Violet', v:'rh-en', sec:'en',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_183_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-scarlet-violet/penny-reverse-holo-183' },
  { id:'SFA-056RH', name:'Cassiopeia', set:'Shrouded Fable', v:'rh-en', sec:'en',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SFA/SFA_056_R_EN_LG.png',
    pc:'https://www.pricecharting.com/game/pokemon-shrouded-fable/cassiopeia-reverse-holo-56' },
  // Row 2 — the Penny chase (pairs with page 1 row 2)
  { id:'SVI-239',  name:'Penny', set:'Scarlet & Violet', v:'ur-en', sec:'en',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_239_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-scarlet-violet/penny-239' },
  { id:'SVI-252',  name:'Penny', set:'Scarlet & Violet', v:'sir-en', sec:'en',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_252_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-scarlet-violet/penny-252' },
  { id:'PAF-239',  name:'Penny', set:'Paldean Fates', v:'sir-en', sec:'en',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAF/PAF_239_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-paldean-fates/penny-239' },
  // Row 3 — the Cassiopeia run (pairs with page 1 row 3)
  { id:'SFA-056',  name:'Cassiopeia', set:'Shrouded Fable', v:'r-en', sec:'en',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SFA/SFA_056_R_EN_LG.png',
    pc:'https://www.pricecharting.com/game/pokemon-shrouded-fable/cassiopeia-56' },
  { id:'SFA-086',  name:'Cassiopeia', set:'Shrouded Fable', v:'ur-en', sec:'en',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SFA/SFA_086_R_EN_LG.png',
    pc:'https://www.pricecharting.com/game/pokemon-shrouded-fable/cassiopeia-86' },
  { id:'SFA-094',  name:'Cassiopeia', set:'Shrouded Fable', v:'sir-en', sec:'en',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SFA/SFA_094_R_EN_LG.png',
    pc:'https://www.pricecharting.com/game/pokemon-shrouded-fable/cassiopeia-94' },

  // ══ SECTION · CAMEOS (page 2) ═════════════════════════════════════════════════════
  // Cards NOT named Penny, but she is in the artwork. Only the Clive SIR/SAR
  // art has her — PAF-078 and PAF-227 are different art by GOSSAN.
  // Row 1 — the alternate finishes
  { id:'SV8a-174M', name:'Friends in Paldea', set:'Terastal Festival ex', v:'mirror-jp', sec:'cameo',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV8a/SV8a_174_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-terastal-festival-ex/friends-in-paldea-174' },
  { id:'PRE-109PB', name:'Friends in Paldea', set:'Prismatic Evolutions', v:'ball-en', sec:'cameo',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PRE/PRE_109_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-prismatic-evolutions/friends-in-paldea-109' },
  { id:'PRE-109RH', name:'Friends in Paldea', set:'Prismatic Evolutions', v:'rh-en', sec:'cameo',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PRE/PRE_109_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-prismatic-evolutions/friends-in-paldea-109' },
  // Row 2 — Japanese cameos
  { id:'SV4a-352', name:'Clive', set:'Shiny Treasure ex', v:'cameo-jp', sec:'cameo',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV4a/SV4a_352_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-shiny-treasure-ex/clive-352' },
  { id:'SV8a-174', name:'Friends in Paldea', set:'Terastal Festival ex', v:'cameo-jp', sec:'cameo',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV8a/SV8a_174_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-terastal-festival-ex/friends-in-paldea-174' },
  { id:'SV8a-195', name:'Friends in Paldea', set:'Terastal Festival ex', v:'cameo-jp', sec:'cameo',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV8a/SV8a_195_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-terastal-festival-ex/friends-in-paldea-195' },
  // Row 3 — English cameos (pairs with row 2 down the columns)
  { id:'PAF-236',  name:'Clive', set:'Paldean Fates', v:'cameo-en', sec:'cameo',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAF/PAF_236_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-paldean-fates/clive-236' },
  { id:'PRE-109',  name:'Friends in Paldea', set:'Prismatic Evolutions', v:'cameo-en', sec:'cameo',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PRE/PRE_109_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-prismatic-evolutions/friends-in-paldea-109' },
  { id:'PRE-137',  name:'Friends in Paldea', set:'Prismatic Evolutions', v:'cameo-en', sec:'cameo',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PRE/PRE_137_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-prismatic-evolutions/friends-in-paldea-137' },

  // ══ SECTION · THE CHASE (page 1) ══════════════════════════════════════════════════
  // The three hardest to source, deliberately on their own page with room
  // left for whatever gets printed next.
  { id:'SV4a-182M', name:'Penny', set:'Shiny Treasure ex', v:'mirror-jp', sec:'chase',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV4a/SV4a_182_R_JP_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-japanese-shiny-treasure-ex/penny-182' },
  { id:'SVI-183PP', name:'Penny', set:'Play! Prize Pack', v:'promo-en', sec:'chase',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_183_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-scarlet-violet/penny-183' },
  { id:'SVI-183WC', name:'Penny', set:'WC Deck 2024', v:'promo-en', sec:'chase',
    img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_183_R_EN_SM.png',
    pc:'https://www.pricecharting.com/game/pokemon-world-championships-2024/penny-fernando-cifuentes' },
]
});
