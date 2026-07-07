// sv2p — auto-extracted from legacy sv2p.html
registerSet('sv2p', {
  binder: {


  title:    'SV2P Snow Hazard',


  subtitle: '99 cards · Master Set',


  navTitle: 'SV2P Snow Hazard · 99 cards',


  lsOwned:  'sv2p_snow_hazard_owned_v1',


  lsWatched:'sv2p_snow_hazard_watched_v1',


  lsPrices: 'sv2p_snow_hazard_prices_v1',


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
  {id:'SV2P-1',name:'Surskit',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_1_R_JP_LG.png'},
  {id:'SV2P-2',name:'Masquerain',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_2_R_JP_LG.png'},
  {id:'SV2P-3',name:'Combee',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_3_R_JP_LG.png'},
  {id:'SV2P-4',name:'Vespiquen',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_4_R_JP_LG.png'},
  {id:'SV2P-5',name:'Snover',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_5_R_JP_LG.png'},
  {id:'SV2P-6',name:'Abomasnow',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_6_R_JP_LG.png'},
  {id:'SV2P-7',name:'Bounsweet',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_7_R_JP_LG.png'},
  {id:'SV2P-8',name:'Steenee',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_8_R_JP_LG.png'},
  {id:'SV2P-9',name:'Tsareena',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_9_R_JP_LG.png'},
  {id:'SV2P-10',name:'Bramblin',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_10_R_JP_LG.png'},
  {id:'SV2P-11',name:'Bramblin',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_11_R_JP_LG.png'},
  {id:'SV2P-12',name:'Brambleghast',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_12_R_JP_LG.png'},
  {id:'SV2P-13',name:'Rellor',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_13_R_JP_LG.png'},
  {id:'SV2P-14',name:'Rellor',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_14_R_JP_LG.png'},
  {id:'SV2P-15',name:'Wo-Chien ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_15_R_JP_LG.png'},
  {id:'SV2P-16',name:'Marill',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_16_R_JP_LG.png'},
  {id:'SV2P-17',name:'Azumarill',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_17_R_JP_LG.png'},
  {id:'SV2P-18',name:'Luvdisc',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_18_R_JP_LG.png'},
  {id:'SV2P-19',name:'Eiscue',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_19_R_JP_LG.png'},
  {id:'SV2P-20',name:'Cetoddle',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_20_R_JP_LG.png'},
  {id:'SV2P-21',name:'Cetoddle',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_21_R_JP_LG.png'},
  {id:'SV2P-22',name:'Cetitan',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_22_R_JP_LG.png'},
  {id:'SV2P-23',name:'Veluza',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_23_R_JP_LG.png'},
  {id:'SV2P-24',name:'Frigibax',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_24_R_JP_LG.png'},
  {id:'SV2P-25',name:'Frigibax',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_25_R_JP_LG.png'},
  {id:'SV2P-26',name:'Arctibax',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_26_R_JP_LG.png'},
  {id:'SV2P-27',name:'Baxcalibur',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_27_R_JP_LG.png'},
  {id:'SV2P-28',name:'Chien-Pao ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_28_R_JP_LG.png'},
  {id:'SV2P-29',name:'Slowpoke',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_29_R_JP_LG.png'},
  {id:'SV2P-30',name:'Slowking ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_30_R_JP_LG.png'},
  {id:'SV2P-31',name:'Gothita',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_31_R_JP_LG.png'},
  {id:'SV2P-32',name:'Gothorita',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_32_R_JP_LG.png'},
  {id:'SV2P-33',name:'Gothitelle',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_33_R_JP_LG.png'},
  {id:'SV2P-34',name:'Mimikyu',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_34_R_JP_LG.png'},
  {id:'SV2P-35',name:'Sinistea',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_35_R_JP_LG.png'},
  {id:'SV2P-36',name:'Polteageist',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_36_R_JP_LG.png'},
  {id:'SV2P-37',name:'Rabsca',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_37_R_JP_LG.png'},
  {id:'SV2P-38',name:'Mankey',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_38_R_JP_LG.png'},
  {id:'SV2P-39',name:'Primeape',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_39_R_JP_LG.png'},
  {id:'SV2P-40',name:'Annihilape ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_40_R_JP_LG.png'},
  {id:'SV2P-41',name:'Sudowoodo',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_41_R_JP_LG.png'},
  {id:'SV2P-42',name:'Glimmet',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_42_R_JP_LG.png'},
  {id:'SV2P-43',name:'Glimmet',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_43_R_JP_LG.png'},
  {id:'SV2P-44',name:'Glimmora',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_44_R_JP_LG.png'},
  {id:'SV2P-45',name:'Murkrow',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_45_R_JP_LG.png'},
  {id:'SV2P-46',name:'Honchkrow',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_46_R_JP_LG.png'},
  {id:'SV2P-47',name:'Maschiff',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_47_R_JP_LG.png'},
  {id:'SV2P-48',name:'Maschiff',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_48_R_JP_LG.png'},
  {id:'SV2P-49',name:'Mabosstiff',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_49_R_JP_LG.png'},
  {id:'SV2P-50',name:'Bronzor',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_50_R_JP_LG.png'},
  {id:'SV2P-51',name:'Bronzong',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_51_R_JP_LG.png'},
  {id:'SV2P-52',name:'Corviknight',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_52_R_JP_LG.png'},
  {id:'SV2P-53',name:'Cufant',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_53_R_JP_LG.png'},
  {id:'SV2P-54',name:'Copperajah ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_54_R_JP_LG.png'},
  {id:'SV2P-55',name:'Orthworm',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_55_R_JP_LG.png'},
  {id:'SV2P-56',name:'Dunsparce',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_56_R_JP_LG.png'},
  {id:'SV2P-57',name:'Dudunsparce',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_57_R_JP_LG.png'},
  {id:'SV2P-58',name:'Wingull',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_58_R_JP_LG.png'},
  {id:'SV2P-59',name:'Pelipper',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_59_R_JP_LG.png'},
  {id:'SV2P-60',name:'Slakoth',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_60_R_JP_LG.png'},
  {id:'SV2P-61',name:'Vigoroth',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_61_R_JP_LG.png'},
  {id:'SV2P-62',name:'Slaking',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_62_R_JP_LG.png'},
  {id:'SV2P-63',name:'Rookidee',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_63_R_JP_LG.png'},
  {id:'SV2P-64',name:'Corvisquire',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_64_R_JP_LG.png'},
  {id:'SV2P-65',name:'Squawkabilly ex',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_65_R_JP_LG.png'},
  {id:'SV2P-66',name:'Super Rod',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_66_R_JP_LG.png'},
  {id:'SV2P-67',name:'Motivational Lemonade',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_67_R_JP_LG.png'},
  {id:'SV2P-68',name:'Grusha',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_68_R_JP_LG.png'},
  {id:'SV2P-69',name:'Giacomo',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_69_R_JP_LG.png'},
  {id:'SV2P-70',name:'Snowy Mountains of Disaster',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_70_R_JP_LG.png'},
  {id:'SV2P-71',name:'Reversal Energy',v:'main',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_71_R_JP_LG.png'},
  {id:'SV2P-72',name:'Bramblin',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_72_R_JP_LG.png'},
  {id:'SV2P-73',name:'Marill',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_73_R_JP_LG.png'},
  {id:'SV2P-74',name:'Eiscue',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_74_R_JP_LG.png'},
  {id:'SV2P-75',name:'Frigibax',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_75_R_JP_LG.png'},
  {id:'SV2P-76',name:'Arctibax',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_76_R_JP_LG.png'},
  {id:'SV2P-77',name:'Baxcalibur',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_77_R_JP_LG.png'},
  {id:'SV2P-78',name:'Gothorita',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_78_R_JP_LG.png'},
  {id:'SV2P-79',name:'Rabsca',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_79_R_JP_LG.png'},
  {id:'SV2P-80',name:'Sudowoodo',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_80_R_JP_LG.png'},
  {id:'SV2P-81',name:'Orthworm',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_81_R_JP_LG.png'},
  {id:'SV2P-82',name:'Rookidee',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_82_R_JP_LG.png'},
  {id:'SV2P-83',name:'Dudunsparce',v:'ar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_83_R_JP_LG.png'},
  {id:'SV2P-84',name:'Wo-Chien ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_84_R_JP_LG.png'},
  {id:'SV2P-85',name:'Chien-Pao ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_85_R_JP_LG.png'},
  {id:'SV2P-86',name:'Slowking ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_86_R_JP_LG.png'},
  {id:'SV2P-87',name:'Annihilape ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_87_R_JP_LG.png'},
  {id:'SV2P-88',name:'Copperajah ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_88_R_JP_LG.png'},
  {id:'SV2P-89',name:'Squawkabilly ex',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_89_R_JP_LG.png'},
  {id:'SV2P-90',name:'Grusha',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_90_R_JP_LG.png'},
  {id:'SV2P-91',name:'Giacomo',v:'sr',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_91_R_JP_LG.png'},
  {id:'SV2P-92',name:'Wo-Chien ex',v:'sar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_92_R_JP_LG.png'},
  {id:'SV2P-93',name:'Chien-Pao ex',v:'sar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_93_R_JP_LG.png'},
  {id:'SV2P-94',name:'Squawkabilly ex',v:'sar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_94_R_JP_LG.png'},
  {id:'SV2P-95',name:'Grusha',v:'sar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_95_R_JP_LG.png'},
  {id:'SV2P-96',name:'Giacomo',v:'sar',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_96_R_JP_LG.png'},
  {id:'SV2P-97',name:'Chien-Pao ex',v:'ur',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_97_R_JP_LG.png'},
  {id:'SV2P-98',name:'Super Rod',v:'ur',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_98_R_JP_LG.png'},
  {id:'SV2P-99',name:'Grusha',v:'ur',img:'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SV2P/SV2P_99_R_JP_LG.png'},
]
});
