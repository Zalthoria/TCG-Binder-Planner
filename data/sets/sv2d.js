// sv2d — auto-extracted from legacy sv2d.html
registerSet('sv2d', {
  binder: {


  title:    'SV2D Clay Burst',


  subtitle: '99 cards · Master Set',


  navTitle: 'SV2D Clay Burst · 99 cards',


  lsOwned:  'sv2d_clay_burst_owned_v1',


  lsWatched:'sv2d_clay_burst_watched_v1',


  lsPrices: 'sv2d_clay_burst_prices_v1',


  cols: 3,


  legend: [


    { label: 'Main Set',    color: '#666'    },


    { label: 'Secret Rare', color: '#c89a3a' },


    { label: 'MUR',         color: '#ff9940' },


  ],


},
  bc: {


  'main':   { bg: '#181410', col: '#666'    },


  'secret': { bg: '#2a2010', col: '#c89a3a' },


  'mur':    { bg: '#3a2000', col: '#ff9940' },


},
  bcDefault: { bg: '#181410', col: '#666' },
  sdefs: [
  { label: '1-71 Main Set',       f: s => { const n=parseInt(s.id.split('-')[1]); return n>=1&&n<=71; } },
  { label: '72-83 Art Rares',     f: s => { const n=parseInt(s.id.split('-')[1]); return n>=72&&n<=83; } },
  { label: '84-91 Secret Rares',  f: s => { const n=parseInt(s.id.split('-')[1]); return n>=84&&n<=91; } },
  { label: '92-96 Special Art Rares', f: s => { const n=parseInt(s.id.split('-')[1]); return n>=92&&n<=96; } },
  { label: '97-99 Ultra Rares',   f: s => { const n=parseInt(s.id.split('-')[1]); return n>=97&&n<=99; } },
],
  slots: [
  {id:'SV2D-1',name:'Hoppip',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_1_R_JP_LG.png'},
  {id:'SV2D-2',name:'Skiploom',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_2_R_JP_LG.png'},
  {id:'SV2D-3',name:'Jumpluff',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_3_R_JP_LG.png'},
  {id:'SV2D-4',name:'Pineco',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_4_R_JP_LG.png'},
  {id:'SV2D-5',name:'Forretress ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_5_R_JP_LG.png'},
  {id:'SV2D-6',name:'Heracross',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_6_R_JP_LG.png'},
  {id:'SV2D-7',name:'Tarountula',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_7_R_JP_LG.png'},
  {id:'SV2D-8',name:'Tarountula',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_8_R_JP_LG.png'},
  {id:'SV2D-9',name:'Spidops',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_9_R_JP_LG.png'},
  {id:'SV2D-10',name:'Numel',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_10_R_JP_LG.png'},
  {id:'SV2D-11',name:'Camerupt',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_11_R_JP_LG.png'},
  {id:'SV2D-12',name:'Fletchinder',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_12_R_JP_LG.png'},
  {id:'SV2D-13',name:'Talonflame',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_13_R_JP_LG.png'},
  {id:'SV2D-14',name:'Charcadet',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_14_R_JP_LG.png'},
  {id:'SV2D-15',name:'Charcadet',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_15_R_JP_LG.png'},
  {id:'SV2D-16',name:'Chi-Yu ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_16_R_JP_LG.png'},
  {id:'SV2D-17',name:'Pikachu',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_17_R_JP_LG.png'},
  {id:'SV2D-18',name:'Raichu',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_18_R_JP_LG.png'},
  {id:'SV2D-19',name:'Shinx',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_19_R_JP_LG.png'},
  {id:'SV2D-20',name:'Luxio',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_20_R_JP_LG.png'},
  {id:'SV2D-21',name:'Luxray',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_21_R_JP_LG.png'},
  {id:'SV2D-22',name:'Pincurchin',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_22_R_JP_LG.png'},
  {id:'SV2D-23',name:'Tadbulb',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_23_R_JP_LG.png'},
  {id:'SV2D-24',name:'Tadbulb',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_24_R_JP_LG.png'},
  {id:'SV2D-25',name:'Bellibolt ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_25_R_JP_LG.png'},
  {id:'SV2D-26',name:'Jigglypuff',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_26_R_JP_LG.png'},
  {id:'SV2D-27',name:'Wigglytuff',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_27_R_JP_LG.png'},
  {id:'SV2D-28',name:'Spiritomb',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_28_R_JP_LG.png'},
  {id:'SV2D-29',name:'Sandygast',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_29_R_JP_LG.png'},
  {id:'SV2D-30',name:'Palossand',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_30_R_JP_LG.png'},
  {id:'SV2D-31',name:'Ceruledge',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_31_R_JP_LG.png'},
  {id:'SV2D-32',name:'Tinkatink',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_32_R_JP_LG.png'},
  {id:'SV2D-33',name:'Tinkatink',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_33_R_JP_LG.png'},
  {id:'SV2D-34',name:'Tinkatuff',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_34_R_JP_LG.png'},
  {id:'SV2D-35',name:'Tinkaton ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_35_R_JP_LG.png'},
  {id:'SV2D-36',name:'Larvitar',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_36_R_JP_LG.png'},
  {id:'SV2D-37',name:'Pupitar',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_37_R_JP_LG.png'},
  {id:'SV2D-38',name:'Barboach',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_38_R_JP_LG.png'},
  {id:'SV2D-39',name:'Whiscash',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_39_R_JP_LG.png'},
  {id:'SV2D-40',name:'Croagunk',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_40_R_JP_LG.png'},
  {id:'SV2D-41',name:'Toxicroak',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_41_R_JP_LG.png'},
  {id:'SV2D-42',name:'Crabrawler',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_42_R_JP_LG.png'},
  {id:'SV2D-43',name:'Crabominable',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_43_R_JP_LG.png'},
  {id:'SV2D-44',name:'Passimian',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_44_R_JP_LG.png'},
  {id:'SV2D-45',name:'Nacli',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_45_R_JP_LG.png'},
  {id:'SV2D-46',name:'Nacli',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_46_R_JP_LG.png'},
  {id:'SV2D-47',name:'Naclstack',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_47_R_JP_LG.png'},
  {id:'SV2D-48',name:'Garganacl',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_48_R_JP_LG.png'},
  {id:'SV2D-49',name:'Ting-Lu ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_49_R_JP_LG.png'},
  {id:'SV2D-50',name:'Sneasel',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_50_R_JP_LG.png'},
  {id:'SV2D-51',name:'Weavile',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_51_R_JP_LG.png'},
  {id:'SV2D-52',name:'Tyranitar',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_52_R_JP_LG.png'},
  {id:'SV2D-53',name:'Shroodle',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_53_R_JP_LG.png'},
  {id:'SV2D-54',name:'Shroodle',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_54_R_JP_LG.png'},
  {id:'SV2D-55',name:'Grafaiai',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_55_R_JP_LG.png'},
  {id:'SV2D-56',name:'Bombirdier',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_56_R_JP_LG.png'},
  {id:'SV2D-57',name:'Noibat',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_57_R_JP_LG.png'},
  {id:'SV2D-58',name:'Noivern ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_58_R_JP_LG.png'},
  {id:'SV2D-59',name:'Girafarig',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_59_R_JP_LG.png'},
  {id:'SV2D-60',name:'Farigiraf',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_60_R_JP_LG.png'},
  {id:'SV2D-61',name:'Fletchling',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_61_R_JP_LG.png'},
  {id:'SV2D-62',name:'Tandemaus',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_62_R_JP_LG.png'},
  {id:'SV2D-63',name:'Tandemaus',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_63_R_JP_LG.png'},
  {id:'SV2D-64',name:'Maushold',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_64_R_JP_LG.png'},
  {id:'SV2D-65',name:'Flamigo',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_65_R_JP_LG.png'},
  {id:'SV2D-66',name:'Delivery Drone',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_66_R_JP_LG.png'},
  {id:'SV2D-67',name:'Charm of Courage',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_67_R_JP_LG.png'},
  {id:'SV2D-68',name:'Saguaro',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_68_R_JP_LG.png'},
  {id:'SV2D-69',name:'Iono',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_69_R_JP_LG.png'},
  {id:'SV2D-70',name:'Wilderness of Disaster',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_70_R_JP_LG.png'},
  {id:'SV2D-71',name:'Therapy Energy',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_71_R_JP_LG.png'},
  {id:'SV2D-72',name:'Heracross',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_72_R_JP_LG.png'},
  {id:'SV2D-73',name:'Fletchinder',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_73_R_JP_LG.png'},
  {id:'SV2D-74',name:'Raichu',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_74_R_JP_LG.png'},
  {id:'SV2D-75',name:'Sandygast',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_75_R_JP_LG.png'},
  {id:'SV2D-76',name:'Tinkatink',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_76_R_JP_LG.png'},
  {id:'SV2D-77',name:'Tinkatuff',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_77_R_JP_LG.png'},
  {id:'SV2D-78',name:'Nacli',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_78_R_JP_LG.png'},
  {id:'SV2D-79',name:'Tyranitar',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_79_R_JP_LG.png'},
  {id:'SV2D-80',name:'Grafaiai',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_80_R_JP_LG.png'},
  {id:'SV2D-81',name:'Maushold',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_81_R_JP_LG.png'},
  {id:'SV2D-82',name:'Flamigo',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_82_R_JP_LG.png'},
  {id:'SV2D-83',name:'Farigiraf',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_83_R_JP_LG.png'},
  {id:'SV2D-84',name:'Forretress ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_84_R_JP_LG.png'},
  {id:'SV2D-85',name:'Chi-Yu ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_85_R_JP_LG.png'},
  {id:'SV2D-86',name:'Bellibolt ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_86_R_JP_LG.png'},
  {id:'SV2D-87',name:'Tinkaton ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_87_R_JP_LG.png'},
  {id:'SV2D-88',name:'Ting-Lu ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_88_R_JP_LG.png'},
  {id:'SV2D-89',name:'Noivern ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_89_R_JP_LG.png'},
  {id:'SV2D-90',name:'Saguaro',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_90_R_JP_LG.png'},
  {id:'SV2D-91',name:'Iono',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_91_R_JP_LG.png'},
  {id:'SV2D-92',name:'Chi-Yu ex',v:'sar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_92_R_JP_LG.png'},
  {id:'SV2D-93',name:'Tinkaton ex',v:'sar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_93_R_JP_LG.png'},
  {id:'SV2D-94',name:'Ting-Lu ex',v:'sar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_94_R_JP_LG.png'},
  {id:'SV2D-95',name:'Saguaro',v:'sar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_95_R_JP_LG.png'},
  {id:'SV2D-96',name:'Iono',v:'sar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_96_R_JP_LG.png'},
  {id:'SV2D-97',name:'Ting-Lu ex',v:'ur',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_97_R_JP_LG.png'},
  {id:'SV2D-98',name:'Tinkaton ex',v:'ur',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_98_R_JP_LG.png'},
  {id:'SV2D-99',name:'Iono',v:'ur',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2D/SV2D_99_R_JP_LG.png'},
]
});
