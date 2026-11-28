/**
 * Idle Breakout - Extended Arcade Edition
 * BB Upgrade System, 6 Distinct Ball Types, Redesigned Bosses (1-35),
 * All Power-Ups (incl. Gold Boss, Ball Army, Auto Clicker, Discount, QTM, Free Upgrade),
 * Background Tab & Offline Progression.
 */

const APP_VERSION = '9.4.5';
const SEASON_RESET_ID = 'fair_restart_s2_v9_4';
const SEASON_RESET_MAIL = {
  id: 'mail_season_reset_s2_v9_4',
  title: '📢 Fontos közlemény – Tiszta újrakezdés & Kárpótlás',
  body: 'Sziasztok! Sajnos a korábbi fejlesztési hibák miatt mindenkinek újra kell kezdenie a játékot, hogy egy teljesen tisztességes, egyenlő esélyű játékot tudjunk csinálni. A korábbi skineitek megmaradtak, elindult a vadonatúj 50 szintes Szezon 2 Breaker Pass (új, akár 3 labdára is tehető exkluzív skinekkel!), kárpótlásul pedig mindenki kapott +5 👑 BT-t és +1 ⭐ BB-t! Jó játékot kívánunk!',
  targetMode: 'all',
  targetIds: [],
  targetName: 'Mindenki',
  targetNameLower: '',
  sentAt: 1795813000000
};
const LEGACY_S1_STAGE_COSMETICS = {
  1: { kind: 'skins', id: 'skin_emerald' },
  3: { kind: 'effects', id: 'fx_saturn' },
  5: { kind: 'breakEffects', id: 'brk_explode' },
  6: { kind: 'skins', id: 'skin_violet' },
  10: { kind: 'skins', id: 'skin_gold' },
  14: { kind: 'effects', id: 'fx_flame' },
  18: { kind: 'skins', id: 'skin_cyber' },
  22: { kind: 'effects', id: 'fx_frost' },
  25: { kind: 'skins', id: 'skin_blood' },
  28: { kind: 'effects', id: 'fx_starlight' },
  30: { kind: 'effects', id: 'fx_cosmic_rare' }
};
const LEGACY_COSMETIC_META = {
  skins: {
    skin_emerald: 'Smaragd Skin [S1]',
    skin_violet: 'Neon Ibolya Skin [S1]',
    skin_gold: 'Arany Fényű Skin [S1]',
    skin_cyber: 'Cyber Punk Skin [S1]',
    skin_blood: 'Vérhold Vörös Skin [S1]'
  },
  effects: {
    fx_saturn: '🪐 Szaturnusz Gyűrű [S1]',
    fx_flame: 'Tűzcsóva Aura [S1]',
    fx_frost: 'Jégkristály Csillogás [S1]',
    fx_starlight: 'Csillagfény Szikrák [S1]',
    fx_cosmic_rare: '🌌 Kozmikus Szingularitás [S1]'
  },
  breakEffects: {
    brk_explode: '💥 Blokk Robbanás [S1]'
  }
};
const BB_UPGRADE_COSTS = [1, 3, 5, 7, 10]; // 1., 2., 3., 4., 5. fejlesztés ára BB-ben

const PIERCE_SPEED_COSTS = [
  1_000_000,   // 1M
  5_000_000,   // 5M
  10_000_000,  // 10M
  20_000_000,  // 20M
  35_000_000,  // 35M
  50_000_000,  // 50M
  75_000_000,  // 75M
  100_000_000  // 100M
];

// Pontos Boss HP táblázat (1. Boss = 10. kör ... 35. Boss = 350. kör)
const BOSS_HP_TABLE = {
  10: 2750,
  20: 7750,
  30: 12750,
  40: 17750,
  50: 22750,
  60: 27750,
  70: 32750,
  80: 37750,
  90: 42750,
  100: 50000,
  110: 50000,
  120: 50000,
  130: 50000,
  140: 50000,
  150: 65000,
  160: 65000,
  170: 65000,
  180: 65000,
  190: 65000,
  200: 77500,
  210: 77500,
  220: 77500,
  230: 77500,
  240: 77500,
  250: 82500,
  260: 82500,
  270: 85000,
  280: 87500,
  290: 87500,
  300: 90000,
  310: 92000,
  320: 94000,
  330: 96000,
  340: 98000,
  350: 100000
};

// BB fejlesztések részletes leírása a POWERUP UPGRADES menühöz
const BB_UPGRADE_CATALOG = [
  {
    key: 'click',
    icon: '👆',
    name: 'Kattintás (Click)',
    baseDesc: 'Alap: 1 blokk sebzése kattintáskor.',
    levels: [
      'Area Damage: kisebb területet is sebez kattintáskor.',
      'Larger Area: megnövelt területi sebzés sugár.',
      'Hold-to-Damage: nyomva tartva 1.0 mp-enként sebez.',
      'Faster Hold Damage: nyomva tartva 0.5 mp-enként sebez.',
      'Random Block Destruction: bárhova kattintva azonnal töröl véletlenszerű blokkokat!'
    ]
  },
  {
    key: 'shockwave',
    icon: '🌊',
    name: 'Shock Wave',
    baseDesc: 'Alap: 4 sebzés/mp közepes körben (50% hatósugár, 30 mp).',
    levels: [
      '20 sebzés/mp + nagyobb hatósugár (65%) 30 mp-ig.',
      '60 sebzés / 0.9 mp + széles hatósugár (82%) 40 mp-ig.',
      '160 sebzés / 0.75 mp + TELJES PÁLYA (100% minden sarok) 50 mp-ig!',
      '320 sebzés / 0.65 mp teljes pályán, 10 körön át folyamatosan aktív!',
      '650 sebzés + 3% max HP / 0.5 mp teljes pályán, Rebirthig folyamatosan aktív!'
    ]
  },
  {
    key: 'piercing',
    icon: '⚡',
    name: 'Pierce Ball',
    baseDesc: 'Alap: 1x sebesség, 1 áttörő labda (45 mp).',
    levels: [
      '2x sebesség az áttörő labdának.',
      '4x sebesség az áttörő labdának.',
      '+1 további Pierce Ball (összesen 2 db).',
      'Rebirthig megtartasz 1 Pierce Ballt (1x sebességgel).',
      'Külön fejleszthető Pierce Ball sebesség ($-ból: 1M, 5M, 10M...).'
    ]
  },
  {
    key: 'money2x',
    icon: '💰',
    name: '2x Money',
    baseDesc: 'Alap: 2x pénz 10 másodpercig.',
    levels: [
      '+15 másodperc (összesen 25 mp).',
      '+15 másodperc (összesen 40 mp).',
      '+30 másodperc (összesen 70 mp).',
      '10 körön keresztül folyamatosan aktív.',
      'A következő Rebirthig folyamatosan aktív!'
    ]
  },
  {
    key: 'dmg2x',
    icon: '💥',
    name: '2x Damage',
    baseDesc: 'Alap: 2x sebzés 10 másodpercig.',
    levels: [
      '+15 másodperc (összesen 25 mp).',
      '+15 másodperc (összesen 40 mp).',
      '+30 másodperc (összesen 70 mp).',
      '10 körön keresztül folyamatosan aktív.',
      'A következő Rebirthig folyamatosan aktív!'
    ]
  },
  {
    key: 'speed',
    icon: '🚀',
    name: 'All Ball Speed',
    baseDesc: 'Alap: minden labda 2x sebesség 20 mp-ig.',
    levels: [
      '+10 másodperc (összesen 30 mp, 2x sebesség).',
      '+10 másodperc (összesen 40 mp) + 2x sebzés!',
      '3x sebesség + 30 mp (összesen 70 mp, 2x sebzés).',
      '10 körön keresztül 2x sebesség.',
      'A Rebirthig folyamatosan 2x sebesség + 2x sebzés!'
    ]
  },
  {
    key: 'autoClicker',
    icon: '🤖',
    name: 'Auto Clicker',
    baseDesc: 'Alap (eséssel): 15 mp-ig automatikusan sebez 1 blokkot (Click Power / 1.0 mp).',
    levels: [
      'ÖRÖK FELOLDÁS: Vásárlás után örökké aktív marad (Rebirth után is!), 1.0 mp-enként üt (1x Click Power).',
      'Gyorsabb kattintás: 0.5 mp-enként üt (2x sebesség) és 1.5x Click Power sebzést okoz!',
      'Még gyorsabb + Területi sebzés: 0.25 mp-enként üt (4x/mp) 2x sebzéssel, 85px-es területi sugárban!',
      'Nagyobb sebzés + Szélesebb terület: 0.2 mp-enként üt (5x/mp) 3x sebzéssel, 130px-es területi sugárban!',
      'Hiper-Kattintó: 0.1 mp-enként üt (10x/mp) 5x sebzéssel 165px-es területen + minden 5. ütésre azonnali blokktörés!'
    ]
  },
  {
    key: 'discount',
    icon: '🏷️',
    name: 'Discount',
    baseDesc: 'Alap: 10% kedvezmény minden labda/kurzor árából 15 mp-ig.',
    levels: [
      '20% kedvezmény 15 másodpercig.',
      '25% kedvezmény 30 másodpercig.',
      '33% kedvezmény 25 másodpercig.',
      '50% kedvezmény 20 másodpercig.',
      'Pirate Shop 5 mp-ig: MINDEN labda és kurzor upgrade INGYENES!'
    ]
  },
  {
    key: 'quickTimeMoney',
    icon: '🪙',
    name: 'Quick Time Money',
    baseDesc: 'Alap: random kerek coinok jelennek meg, kattintásra pénzt adnak.',
    levels: [
      '2x jutalom és 2x gyakoriságú megjelenés.',
      '4x jutalom (2x gyakorisággal).',
      '3 percenként garantáltan megjelenik egy coin.',
      'A coin automatikusan begyűjtődik kattintás nélkül!',
      'Minden begyűjtött coin fixen +1 BB valutát is ad!'
    ]
  }
];

// Fix & Nem Fejleszthető Power-Upok Részletes Útmutatója (mit csinálnak pontosan)
const FIXED_POWERUPS_GUIDE = [
  {
    key: 'gold_boss',
    category: 'drop',
    icon: '👑',
    name: 'Gold Boss',
    rarityBadge: '1.50 súly (~10,7%) • Esésből',
    desc: 'A következő Boss blokkot Gold Boss-szá alakítja, amely dupla ($) pénzt ad sebzéskor és legyőzéskor is.',
    statusFn: (game) => game.nextBossIsGold ? '✨ BEÉLESÍTVE: A következő Boss GOLD BOSS lesz!' : 'Blokktöréskor véletlenszerűen eshet.'
  },
  {
    key: 'free_upgrade',
    category: 'drop',
    icon: '🎁',
    name: 'Free Upgrade',
    rarityBadge: '0.35 súly (~2,5%; maxnál ~0,86% + 3p CD)',
    desc: 'Véletlenszerűen +1 szintet ad egy még nem kimaxolt Power-up fejlesztésre (ha mind maxos: +5 BB).',
    statusFn: () => 'Azonnali jutalom eséskor.'
  },
  {
    key: 'gold_level',
    category: 'drop',
    icon: '🌟',
    name: 'GOLD LEVEL',
    rarityBadge: '0.05 súly (~0,36%) • Rebirth 15+ • 15p CD',
    isGoldSpecial: true,
    desc: 'Csak Rebirth 15 fölött eshet! A következő normál pálya minden blokkja aranyblokk lesz (20x pénz), BB-t és BT-t dobhat, teljesítéskor pedig garantált +15 ⭐ BB és +25 👑 BT jár!',
    statusFn: (game) => {
      if (game.isGoldLevelActive) return '🌟 JELENLEG AKTÍV A PÁLYÁN (20x pénz + BB & BT)!';
      if (game.nextLevelIsGold) return '🌟 BEÉLESÍTVE: A következő normál pálya GOLD LEVEL lesz!';
      if (game.rebirthCount <= 15) return `🔒 ZÁROLVA: Rebirth 15 fölött érhető el (jelenleg: ${game.rebirthCount}/16)`;
      return '✅ Feloldva (Rebirth > 15): ~0,36% esély power-up dobásból (15p cooldown)!';
    }
  },
  {
    key: 'fix_auto_clicker',
    category: 'perm',
    icon: '🤖',
    name: 'Auto Clicker (Fix)',
    rarityBadge: 'BB Lvl 1+ • Örökre aktív',
    desc: '1. szinttől ÖRÖKRE aktív marad (Rebirth után is!). Automatikusan üti a blokkokat, magasabb szinteken területi sebzéssel és azonnali blokktöréssel.',
    statusFn: (game) => game.bbUpgrades.autoClicker >= 1
      ? `✅ ÖRÖKRE AKTÍV (LVL ${game.bbUpgrades.autoClicker}/5)`
      : '🔒 Még nincs feloldva (Auto Clicker LVL 1 kell).'
  },
  {
    key: 'fix_pierce_perm',
    category: 'perm',
    icon: '⚡',
    name: 'Fix Pierce Ball',
    rarityBadge: 'BB Lvl 4–5 • Rebirthig aktív',
    desc: '4. szinttől 1 áttörő labda folyamatosan a pályán marad a következő Rebirthig (normál blokkokat azonnal átüt, Boss-on 3% HP-t sebez). 5. szinten $-ból külön gyorsítható!',
    statusFn: (game) => game.bbUpgrades.piercing >= 4
      ? `✅ REBIRTHIG AKTÍV (${game.getPermanentPierceSpeedMult().toFixed(1)}x seb.)`
      : `🔒 Pierce Ball LVL 4 szükséges (jelenleg: ${game.bbUpgrades.piercing}/5).`
  },
  {
    key: 'fix_money2x',
    category: 'perm',
    icon: '💰',
    name: 'Fix 2x Money',
    rarityBadge: 'BB Lvl 5 • Rebirthig aktív',
    desc: '5. szinten nem jár le: a következő Rebirthig minden egyes sebzésből és bónuszból dupla ($) pénzt ad!',
    statusFn: (game) => game.bbUpgrades.money2x >= 5
      ? '✅ REBIRTHIG AKTÍV (2x Pénz)'
      : `🔒 2x Money LVL 5 szükséges (jelenleg: ${game.bbUpgrades.money2x}/5).`
  },
  {
    key: 'fix_dmg2x',
    category: 'perm',
    icon: '💥',
    name: 'Fix 2x Damage',
    rarityBadge: 'BB Lvl 5 • Rebirthig aktív',
    desc: '5. szinten folyamatosan dupla (2x) sebzést ad minden labdának és kattintásnak a következő Rebirthig!',
    statusFn: (game) => game.bbUpgrades.dmg2x >= 5
      ? '✅ REBIRTHIG AKTÍV (2x Sebzés)'
      : `🔒 2x Damage LVL 5 szükséges (jelenleg: ${game.bbUpgrades.dmg2x}/5).`
  },
  {
    key: 'fix_speed',
    category: 'perm',
    icon: '🚀',
    name: 'Fix All Ball Speed',
    rarityBadge: 'BB Lvl 5 • Rebirthig aktív',
    desc: '5. szinten folyamatosan 2x sebességet ÉS 2x sebzést ad az összes labdának a következő Rebirthig!',
    statusFn: (game) => game.bbUpgrades.speed >= 5
      ? '✅ REBIRTHIG AKTÍV (2x Seb. + 2x Sebzés)'
      : `🔒 All Ball Speed LVL 5 szükséges (jelenleg: ${game.bbUpgrades.speed}/5).`
  },
  {
    key: 'fix_shockwave',
    category: 'perm',
    icon: '🌊',
    name: 'Fix Shock Wave',
    rarityBadge: 'BB Lvl 5 • Rebirthig aktív',
    desc: '5. szinten 0.5 másodpercenként teljes pályás lökéshullámot küld (650 sebzés + 3% max HP) a következő Rebirthig!',
    statusFn: (game) => game.bbUpgrades.shockwave >= 5
      ? '✅ REBIRTHIG AKTÍV (Teljes pálya)'
      : `🔒 Shock Wave LVL 5 szükséges (jelenleg: ${game.bbUpgrades.shockwave}/5).`
  },
  {
    key: 'fix_pirate',
    category: 'perm',
    icon: '🏴‍☠️',
    name: 'Pirate Shop (Discount 5)',
    rarityBadge: 'BB Lvl 5 • ~0,43% esély • 10 perc CD',
    desc: 'Discount 5. szinten amikor esik és aktiválódik, 5 másodpercig MINDEN labda- és kattintásfejlesztés teljesen $0 (INGYENES)!',
    statusFn: (game) => game.isPirateShopActive()
      ? '🏴‍☠️ MOST AKTÍV — MINDEN INGYENES!'
      : (game.bbUpgrades.discount >= 5 ? '✅ Feloldva — eséskor 5 mp Ingyen Bolt!' : `🔒 Discount LVL 5 szükséges (${game.bbUpgrades.discount}/5).`)
  }
];

// Boss Token (BT) alapú Labda Képesség Fejlesztések (Rebirth után is megmaradnak!)
const BT_ABILITY_CATALOG = [
  {
    key: 'poison',
    icon: '☠️',
    name: 'Poison Ball – Méreg',
    baseDesc: 'Alap: azonnali Power sebzés + 1 dmg/mp 10 mp-ig (blokkon nem stackelődik, csak Boss-on).',
    costs: [3, 10, 50],
    levels: [
      '5 dmg/mp méreg 20 másodpercig.',
      '20 dmg/mp méreg 60 másodpercig.',
      '25 dmg / 0.3 mp — a blokk teljes megsemmisüléséig aktív marad!'
    ]
  },
  {
    key: 'ghost',
    icon: '👻',
    name: 'Ghostball – Szellembomba',
    baseDesc: 'Alap: áthalad a blokkokon és sebez (nincs szellembomba).',
    costs: [3, 20, 50],
    levels: [
      'Minden 10. mp-ben ledob egy szellemet (3×3 kráter, 1 mp múlva robban, 50 sebzés).',
      'Minden 5. mp-ben ledob egy szellemet (5×5 kráter, 1 mp múlva robban, 50 sebzés).',
      'Minden 1. mp-ben ledob egy szellemet (5×5 kráter, 1 mp múlva robban, 50 sebzés)!'
    ]
  },
  {
    key: 'multiply',
    icon: '🟣',
    name: 'Multiply Ball – Osztódás',
    baseDesc: 'Alap: 1 nagy (10) ➔ 2 közepes (5) labdára osztódik (5 mp-ig élnek).',
    costs: [3, 20, 50],
    levels: [
      'A 2 közepes tovább osztódik 4 kisebb (2 dmg) labdára (5 mp).',
      '1 nagy ➔ 2 közepes ➔ 4 kisebb ➔ 8 nagyon kicsi (1 dmg) labda (5 mp).',
      'A 8 nagyon kicsi még 2-2 felé osztódik: 16 mini (0.5 dmg) labda (5 mp)!'
    ]
  },
  {
    key: 'rocket',
    icon: '🚀',
    name: 'Rocket Ball – Önirányítás',
    baseDesc: 'Alap: minden 10 mp-ben kilő egy rakétát véletlenszerű irányba.',
    costs: [10],
    levels: [
      'Beméri a labdához legközelebbi blokkot, és 3 mp-enként önirányító rakétát lő rá!'
    ]
  },
  {
    key: 'coin',
    icon: '🪙',
    name: 'Coin Ball – Token Bányász',
    baseDesc: 'Alap: mindig fix 1 sebzés + fejleszthető pénzbónusz ($1–$55/ütközés).',
    costs: [10, 30],
    levels: [
      'Minden 888. blokk-ütközés után +1 👑 BT és minden 2 500. ütközés után +1 ⭐ BB jár!',
      'Nagyobb esély / gyorsabb bányászat: minden 666. ütközés után +1 👑 BT és minden 1 850. ütközés után +1 ⭐ BB jár!'
    ]
  }
];

// Global Leaderboard Roster (Real players only - all mock players deleted!)
const SEEDED_LEADERBOARD = [];

// PayPal Fizetési Hivatkozás - Ide illeszthető be a saját PayPal.me vagy egyedi adományozási/fizetési link (pl. 'https://www.paypal.me/shirelix/4999HUF')
const PAYPAL_CHECKOUT_URL = 'https://www.paypal.com/';

// Color reference for all Normal Ball skins (used for block break debris and cosmetics)
const BALL_SKIN_COLORS = {
  default: '#ffee00',
  skin_emerald: '#10b981',
  skin_p_ruby: '#e11d48',
  skin_p_obsidian: '#27272a',
  skin_p_matrix: '#22c55e',
  skin_violet: '#8b5cf6',
  skin_p_solar: '#f97316',
  skin_p_sapphire: '#0284c7',
  skin_gold: '#f59e0b',
  skin_p_quantum: '#06b6d4',
  skin_p_chrome: '#94a3b8',
  skin_p_nebula: '#a855f7',
  skin_cyber: '#ec4899',
  skin_p_dragon: '#15803d',
  skin_blood: '#ef4444',
  skin_p_godlight: '#fef08a',
  skin_s2_prism: '#38bdf8',
  skin_s2_magma: '#ea580c',
  skin_s2_hologram: '#06b6d4',
  skin_s2_amethyst: '#9333ea',
  skin_s2_eclipse: '#1e1b4b',
  skin_s2_chrono: '#eab308',
  skin_s2_celestial: '#f43f5e'
};

const DEV_AUTH_SALT = 'IB_DEV_2026_SHX_SALT_v1::';
const DEV_AUTH_HASH = '2e79b30f5b08103756a0182126be056c1e1a14046dd9d1677c40ff8d347b7c82';

function sha256HexFallback(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j;
  let result = '';
  const words = [];
  const utf8 = unescape(encodeURIComponent(ascii));
  const asciiBitLength = utf8[lengthProperty] * 8;

  const hash = sha256HexFallback.h = sha256HexFallback.h || [];
  const k = sha256HexFallback.k = sha256HexFallback.k || [];
  let primeCounter = k[lengthProperty];
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  let padded = utf8 + '\x80';
  while (padded[lengthProperty] % 64 - 56) padded += '\x00';
  for (i = 0; i < padded[lengthProperty]; i++) {
    j = padded.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);

  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16);
    const oldHash = hash.slice(0);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
          w[i - 16]
          + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
          + w[i - 7]
          + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
        ) | 0);
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash[7] = hash[6]; hash[6] = hash[5]; hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2]; hash[2] = hash[1]; hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  sha256HexFallback.h = [];
  return result;
}

// 50 Stages Season 2 Breaker Pass Catalog (Multi-Ball 2x & 3x Exclusive Cosmetics!)
const BATTLE_PASS_STAGES = (() => {
  const specials = {
    1:  { bricks: 0,        free: { type: 'skin', id: 'skin_s2_prism', maxEquip: 3, name: '🌈 Prizma Kristály Skin', color: '#38bdf8', desc: 'Szivárvány fényprizma aura • Egyszerre 3 labdatípusra is tehető!' }, paid: { type: 'skin', id: 'skin_p_ruby', name: 'Királyi Rubin Skin', desc: 'Ragyogó mélyvörös rubinfény' } },
    4:  { free: { type: 'effect', id: 'fx_s2_aurora', maxEquip: 2, name: '🌌 Sarki Fény Aura', desc: 'Zöld-lila hullámzó aurora borealis gyűrű • 2 labdára tehető!' }, paid: { type: 'skin', id: 'skin_p_matrix', name: 'Mátrix Kód Skin', desc: 'Zöld digitális neon mátrixfény' } },
    7:  { free: { type: 'break_effect', id: 'brk_s2_frost', maxEquip: 2, name: '❄️ Jégszilánk Törés', desc: 'Blokktöréskor jeges lökéshullám és kristályszilánkok • 2 labdára!' }, paid: { type: 'effect', id: 'fx_p_golddust', name: 'Aranypor Uszály', desc: 'Fényes keringő aranyporszemek' } },
    10: { free: { type: 'skin', id: 'skin_s2_magma', maxEquip: 2, name: '🌋 Magma Mag Skin', color: '#ea580c', desc: 'Izzó vulkáni lávakitörés mag • Egyszerre 2 labdatípusra tehető!' }, paid: { type: 'skin', id: 'skin_p_sapphire', name: 'Óceáni Zafír Skin', desc: 'Kristálytiszta mélykék ragyogás' } },
    14: { free: { type: 'skin', id: 'skin_s2_hologram', maxEquip: 3, name: '💠 Hologram Mátrix Skin', color: '#06b6d4', desc: 'Pásztázó kiber-hologram rács • Egyszerre 3 labdára tehető!' }, paid: { type: 'effect', id: 'fx_p_lightning', name: 'Plazma Villám', desc: 'Magasfeszültségű kék elektromos ív' } },
    18: { free: { type: 'effect', id: 'fx_s2_orbitals', maxEquip: 3, name: '⚛️ Atom Elektron Gyűrű', desc: '3 keringő atompályás elektron a labda körül • 3 labdára!' }, paid: { type: 'skin', id: 'skin_p_nebula', name: 'Bíbor Nebula Skin', desc: 'Kozmikus lila csillagköd örvény' } },
    22: { free: { type: 'skin', id: 'skin_s2_amethyst', maxEquip: 2, name: '🔮 Ametiszt Geóda Skin', color: '#9333ea', desc: 'Mágikus lila kristályszikrák • 2 labdára tehető!' }, paid: { type: 'effect', id: 'fx_p_rings', name: 'Plazmagyűrűk', desc: 'Táguló zöld plazma hullámok' } },
    26: { free: { type: 'break_effect', id: 'brk_s2_nova', maxEquip: 3, name: '🌟 Szupernóva Törés', desc: 'Arany-ibolyás csillagrobbanás blokktöréskor • 3 labdára!' }, paid: { type: 'skin', id: 'skin_p_chrome', name: 'Króm Acél Skin', desc: 'Tükörfényes folyékony fém' } },
    30: { free: { type: 'skin', id: 'skin_s2_eclipse', maxEquip: 3, isRare: true, name: '🌘 Napfogyatkozás Skin (EXKLUZÍV)', color: '#1e1b4b', desc: 'Fekete napkorong izzó arany korona-aurával • 3 labdára!' }, paid: { type: 'skin', id: 'skin_p_godlight', name: 'Mennyei Fény Skin', desc: 'Szakrális arany-fehér aura' } },
    35: { free: { type: 'effect', id: 'fx_s2_phoenix', maxEquip: 2, name: '🔥 Főnix Szárny Aura', desc: 'Lángoló főnix szárnytollak minden suhanásnál • 2 labdára!' }, paid: { type: 'skin', id: 'skin_p_dragon', name: 'Sárkánytűz Skin', desc: 'Izzó pikkelymintás magmaréteg' } },
    40: { free: { type: 'skin', id: 'skin_s2_chrono', maxEquip: 3, isRare: true, name: '⏳ Kronosz Időóra Skin (EXKLUZÍV)', color: '#eab308', desc: 'Forgó arany óramutató és időhullám • 3 labdára!' }, paid: { type: 'effect', id: 'fx_p_darkflame', name: 'Sötét Láng Mágia', desc: 'Démoni lila-fekete lángnyom' } },
    45: { free: { type: 'effect', id: 'fx_s2_vortex', maxEquip: 3, name: '🌀 Kvantum Örvény Effekt', desc: 'Forgó cián-magenta téridő örvény • 3 labdára tehető!' }, paid: { type: 'skin', id: 'skin_p_quantum', name: 'Kvantum Cián Skin', desc: 'Kvantumrezgés aura' } },
    48: { free: { type: 'break_effect', id: 'brk_s2_glitch', maxEquip: 3, name: '⚡ Kibernetikus Glitch Törés', desc: 'Digitális neon szikrarobbanás töréskor • 3 labdára!' }, paid: { type: 'effect', id: 'fx_p_violetlightning', name: 'Ibolya Villám', desc: 'Pulzáló lila villámcsapás ív' } },
    50: { free: { type: 'skin', id: 'skin_s2_celestial', maxEquip: 3, isRare: true, name: '👑 Égi Galaxis Császár (MITIKUS)', color: '#f43f5e', desc: 'Keringő csillagkorona + pulzáló prizma mag • Egyszerre 3 labdára!' }, paid: { type: 'effect', id: 'fx_p_godcrown', name: '👑 Istenkirály Halo', desc: 'Keringő aranymíves korona' } }
  };

  const stages = [];
  for (let s = 1; s <= 50; s++) {
    const sp = specials[s] || null;
    const bricks = s === 1 ? 0 : Math.round((Math.pow(s - 1, 2.28) * 4750) / 500) * 500;
    const freeBb = Math.max(1, Math.round(1 + (s - 1) * 0.22));
    const freeBt = Math.max(1, Math.round(1 + (s - 1) * 0.28));
    const paidAlt = s % 3 === 0
      ? { type: 'currency', currency: 'bb', amount: Math.max(2, s * 2), name: `+${Math.max(2, s * 2)} Black Brick (BB)`, desc: 'Prémium BB csomag' }
      : (s % 3 === 1
          ? { type: 'currency', currency: 'bt', amount: Math.max(2, Math.ceil(s / 3)), name: `+${Math.max(2, Math.ceil(s / 3))} Boss Token (BT)`, desc: 'Prémium Boss Token csomag' }
          : { type: 'currency', currency: 'money', amount: Math.round(Math.pow(s, 2.6) * 250), name: 'Prémium Pénzbónusz', desc: 'Exkluzív szezonális tőkeinjekció' });

    stages.push({
      stage: s,
      bricks,
      free: (sp && sp.free) ? sp.free : {
        type: 'currency',
        currency: 'bb_bt',
        bb: freeBb,
        bt: freeBt,
        name: `+${freeBb} ⭐ BB & +${freeBt} 👑 BT`,
        desc: `Szezon 2 • ${s}. szintű BB + BT jutalom`
      },
      paid: (sp && sp.paid) ? sp.paid : paidAlt
    });
  }
  return stages;
})();

class IdleBreakoutGame {
  constructor() {
    // Új mentési kulcs (v3): a régi v2-es mentések egyszer, most automatikusan törlődnek mindenkinél,
    // de minden későbbi frissítésnél (amíg v3 marad) a játékosok haladása megmarad!
    this.SAVE_KEY = 'idle_breakout_classic_v3';
    this.saveOwnerUid = null;
    try {
      localStorage.removeItem('idle_breakout_classic_v2');
    } catch (e) {}

    // Core Game State
    this.money = 0;
    this.level = 1;
    this.bb = 0; // Breakout Badges
    this.bossTokens = 0; // 1 Boss kill = +1 Boss Token; 5 Boss Token = 1 BB
    this.BOSS_TOKEN_COST = 5;
    this.MAX_MULTIPLY_BALLS = 7;
    this.MAX_GHOST_BALLS = 10;
    this.MAX_ROCKET_BALLS = 5;
    this.MAX_SYMBIOT_BALLS = 1;
    this.MAX_COIN_BALLS = 20;
    this.rebirthCount = 0;
    this.rebirthMultiplier = 1.0;
    this.lastAdminEditAt = 0;
    this.clickPower = 1;
    this.clickUpgradeLevel = 1;

    // Permanent BB Upgrades (0..5)
    this.bbUpgrades = {
      click: 0,
      shockwave: 0,
      piercing: 0,
      money2x: 0,
      dmg2x: 0,
      speed: 0,
      autoClicker: 0,
      discount: 0,
      quickTimeMoney: 0
    };

    // Permanent BT Ball Ability Upgrades
    this.btUpgrades = {
      poison: 0,   // 0..3 (3, 10, 50 BT)
      ghost: 0,    // 0..3 (3, 20, 50 BT)
      multiply: 0, // 0..3 (3, 20, 50 BT)
      rocket: 0,   // 0..1 (10 BT)
      coin: 0      // 0..2 (10, 30 BT)
    };
    this.coinBtHitCounter = 0;
    this.coinBbHitCounter = 0;

    // Pierce Ball separate $ speed upgrade (unlocked at bbUpgrades.piercing >= 5)
    this.pierceSpeedUpgradeLevel = 0;

    // Gold Boss & Gold Level pending/active flags
    this.nextBossIsGold = false;
    this.nextLevelIsGold = false;
    this.isGoldLevelActive = false;

    // Upgrade Caps
    this.MAX_CLICK_LEVEL = 100;
    this.MAX_PIERCE_SPEED_LEVEL = 20;

    // Real-Time Multiplayer Leaderboard
    this.playerName = (localStorage.getItem('idle_breakout_player_name') || 'Játékos').slice(0, 12);
    this.appliedAdminCmdIds = [];
    try {
      const savedCmds = localStorage.getItem('idle_breakout_applied_admin_cmds');
      if (savedCmds) {
        const parsedCmds = JSON.parse(savedCmds);
        if (Array.isArray(parsedCmds)) this.appliedAdminCmdIds = parsedCmds.slice(-100);
      }
    } catch (e) {}
    this.readMailIds = [];
    try {
      const savedMails = localStorage.getItem('idle_breakout_read_mail_ids');
      if (savedMails) {
        const parsedMails = JSON.parse(savedMails);
        if (Array.isArray(parsedMails)) this.readMailIds = parsedMails.slice(-120);
      }
    } catch (e) {}
    this._toastedMailIds = new Set();
    this._sessionStartedAt = Date.now();
    this.prefs = {
      floatingNumbers: true,
      particles: true,
      screenShake: true,
      autoClickMilestone: true,
      autoUpgrade: false,
      autoBuyBalls: false
    };
    try {
      const savedPrefs = localStorage.getItem('idle_breakout_prefs');
      if (savedPrefs) {
        const parsedPrefs = JSON.parse(savedPrefs);
        if (parsedPrefs && typeof parsedPrefs === 'object') {
          this.prefs = { ...this.prefs, ...parsedPrefs };
        }
      }
    } catch (e) {}
    this._autoClickMsTimer = 0;
    this._autoUpgradeTimer = 0;
    this._autoBuyBallsTimer = 0;
    this._lastOfflineSummary = null;
    this.myPlayerId = localStorage.getItem('idle_breakout_player_id');
    if (!this.myPlayerId) {
      this.myPlayerId = 'p_' + Math.random().toString(36).substring(2, 8) + '_' + Date.now().toString(36);
      try { localStorage.setItem('idle_breakout_player_id', this.myPlayerId); } catch (e) {}
    }
    this.remotePlayers = {};
    try {
      const savedRemote = localStorage.getItem('idle_breakout_remote_players');
      if (savedRemote) {
        const parsed = JSON.parse(savedRemote);
        const nowMs = Date.now();
        const maxGuestAge = 3 * 24 * 60 * 60 * 1000;
        for (const k in parsed) {
          const rp = parsed[k];
          if (rp && (rp.uid || rp.fromFirestore || rp.keepInTop10 || (nowMs - (rp.ts || 0) < maxGuestAge))) {
            this.remotePlayers[k] = rp;
          }
        }
      }
    } catch (e) {}
    this.mqttClient = null;
    this.mqttConnected = false;
    this.heartbeatTimer = 0;
    this.leaderboard = [];
    this.lbAdminRules = this.loadLocalAdminRules();
    this.devEditTarget = null;
    this.activeDevTab = 'players';

    // Battle Pass System (50 Stages Season 2 + Preserved Legacy Cosmetics)
    this.appliedSeasonResetId = null;
    this.appliedSeasonResetToken = null;
    this.preservedCosmetics = { skins: [], effects: [], breakEffects: [] };
    this.totalBricksDestroyed = 0;
    this.battlePassClaimedFree = {};
    this.battlePassClaimedPaid = {};
    this.normalBallEquips = {}; // legacy save migration
    this.ballTypeEquips = {};   // ballTypeKey -> { skinId, effectId, breakEffectId }
    this.activeBPTab = 'stages'; // 'stages' | 'armory'
    this.activeBBTab = 'upgrades'; // 'upgrades' | 'fixed'
    this.activeBBCardIndex = 0;
    this.activeFixedCardIndex = 0;
    this.lastRenderedBPStage = null;

    // Base Speed Reference (1x = 3.7 - kicsit lassabb normál labda a kért 5-6 órás játékmenethez)
    this.BASE_SPEED = 3.7;
    this.ballTypes = {
      normal: {
        id: 'normal',
        name: 'NORMAL BALL',
        shortDesc: '0.72x sebesség, 1x sebzés, Breaker Pass testreszabható!',
        color: '#ffee00',
        count: 0,
        baseCost: 25,
        costMult: 1.15,
        speedFactor: 0.72,
        displaySpeedStepPct: 5,
        basePower: 1.0,
        powerStep: 1.0,
        speedLevel: 1,
        maxSpeedLevel: 50,
        speedBaseCost: 100,
        powerLevel: 1,
        maxPowerLevel: 50,
        powerBaseCost: 250,
        radius: 7.5
      },
      speedy: {
        id: 'speedy',
        name: 'SPEEDY BALL',
        shortDesc: '2x sebesség, 50% sebzés',
        color: '#00d9ff',
        count: 0,
        baseCost: 150,
        costMult: 1.18,
        speedFactor: 2.0,
        displaySpeedStepPct: 8,
        basePower: 0.5,
        powerStep: 0.5,
        speedLevel: 1,
        maxSpeedLevel: 40,
        speedBaseCost: 300,
        powerLevel: 1,
        maxPowerLevel: 45,
        powerBaseCost: 500,
        radius: 6.5
      },
      heavy: {
        id: 'heavy',
        name: 'HEAVY BALL',
        shortDesc: '0.5x sebesség, 20 alap sebzés (nincs BT upg)',
        color: '#dc2626',
        count: 0,
        baseCost: 750,
        costMult: 1.20,
        speedFactor: 0.5,
        displaySpeedStepPct: 3,
        basePower: 20.0,
        powerStep: 10.0,
        speedLevel: 1,
        maxSpeedLevel: 35,
        speedBaseCost: 1200,
        powerLevel: 1,
        maxPowerLevel: 50,
        powerBaseCost: 2000,
        radius: 10.0
      },
      smasher: {
        id: 'smasher',
        name: 'SMASHER BALL',
        shortDesc: '0.9x sebesség, a célpontot és 3 szomszédos blokkot sebez!',
        color: '#f59e0b',
        count: 0,
        baseCost: 2500,
        costMult: 1.22,
        speedFactor: 0.9,
        displaySpeedStepPct: 4,
        basePower: 4.0,
        powerStep: 2.5,
        speedLevel: 1,
        maxSpeedLevel: 40,
        speedBaseCost: 1500,
        powerLevel: 1,
        maxPowerLevel: 50,
        powerBaseCost: 3200,
        radius: 8.5
      },
      poison: {
        id: 'poison',
        name: 'POISON BALL',
        shortDesc: '1.5x sebesség, azonnali sebzés + BT méreg',
        color: '#22c55e',
        count: 0,
        baseCost: 8000,
        costMult: 1.24,
        speedFactor: 1.5,
        displaySpeedStepPct: 7,
        basePower: 1.0,
        powerStep: 1.0,
        speedLevel: 1,
        maxSpeedLevel: 40,
        speedBaseCost: 4000,
        powerLevel: 1,
        maxPowerLevel: 50,
        powerBaseCost: 7500,
        radius: 7.5
      },
      coin: {
        id: 'coin',
        name: 'COIN BALL',
        shortDesc: 'Fix 1 sebzés • $1–$55 pénz/ütközés • max 20 db',
        color: '#facc15',
        count: 0,
        baseCost: 20000,
        costMult: 1.24,
        speedFactor: 1.7,
        displaySpeedStepPct: 6,
        basePower: 1.0,
        powerStep: 1.0,
        speedLevel: 1,
        maxSpeedLevel: 25,
        speedBaseCost: 2000,
        powerLevel: 1,
        maxPowerLevel: 55,
        powerBaseCost: 250,
        radius: 8.0
      },
      rocket: {
        id: 'rocket',
        name: 'ROCKET BALL',
        shortDesc: '10 dmg labda | rakéta 100/50/20 (max 5 db)',
        color: '#f97316',
        count: 0,
        baseCost: 45000,
        costMult: 1.28,
        speedFactor: 1.0,
        displaySpeedStepPct: 5,
        basePower: 10.0,
        powerStep: 5.0,
        speedLevel: 1,
        maxSpeedLevel: 40,
        speedBaseCost: 40000,
        powerLevel: 1,
        maxPowerLevel: 50,
        powerBaseCost: 65000,
        radius: 8.5
      },
      ghost: {
        id: 'ghost',
        name: 'GHOSTBALL',
        shortDesc: '1x sebesség, áthalad + BT szellembomba (max 10)',
        color: '#c8f4ff',
        count: 0,
        baseCost: 180000,
        costMult: 1.28,
        speedFactor: 1.0,
        displaySpeedStepPct: 6,
        basePower: 4.0,
        powerStep: 3.0,
        speedLevel: 1,
        maxSpeedLevel: 40,
        speedBaseCost: 90000,
        powerLevel: 1,
        maxPowerLevel: 50,
        powerBaseCost: 140000,
        radius: 8.0
      },
      multiply: {
        id: 'multiply',
        name: 'MULTIPLY BALL',
        shortDesc: '1x sebesség, osztódik (BT: 2→4→8→16, 5 mp, max 7)',
        color: '#d900b8',
        count: 0,
        baseCost: 650000,
        costMult: 1.30,
        speedFactor: 1.0,
        displaySpeedStepPct: 4,
        basePower: 12.0,
        powerStep: 6.0,
        speedLevel: 1,
        maxSpeedLevel: 35,
        speedBaseCost: 200000,
        powerLevel: 1,
        maxPowerLevel: 40,
        powerBaseCost: 350000,
        radius: 9.0
      },
      symbiot: {
        id: 'symbiot',
        name: 'SYMBIOT BALL',
        shortDesc: 'MINDEN képesség egyben (Speed+Heavy+Smash+Méreg+Rakéta+Ghost+Osztódás) • MAX 1!',
        color: '#111827',
        count: 0,
        baseCost: 250000000,
        costMult: 1.50,
        speedFactor: 2.6,
        displaySpeedStepPct: 10,
        basePower: 350.0,
        powerStep: 175.0,
        speedLevel: 1,
        maxSpeedLevel: 40,
        speedBaseCost: 10000000,
        powerLevel: 1,
        maxPowerLevel: 50,
        powerBaseCost: 15000000,
        radius: 10.5
      }
    };

    // Active entities in arena
    this.balls = [];
    this.bricks = [];
    this.perimeterBricks = [];
    this.floatingTexts = [];
    this.visualRings = []; // Click area ripples, auto-clicker pings, shockwave rings
    this.bossSparks = [];
    this.debrisParticles = []; // Color-matched brick destruction particle debris
    this.ghostBombs = [];  // Ghostball BT bomb entities
    this.rockets = [];     // Rocket Ball missile projectiles
    this.gridCellW = 60;
    this.gridCellH = 34;

    // Active Power-ups System
    // Entry shape: { id, icon, name, desc, mode: 'timed'|'rounds'|'until_rebirth', duration, maxDuration, roundsLeft, maxRounds, extra: {} }
    this.activePowerUps = {};

    // Tickers
    this.shockwaveTimer = 0;
    this.autoClickerTimer = 0;
    this.autoClickerStrikeCount = 0;
    this.lastAutoClickSoundAt = 0;
    this.pirateShopCooldown = 0;
    this.pirateShopCooldownUntil = 0;
    this.goldLevelCooldownUntil = 0;
    this.freeUpgradeMaxCooldownUntil = 0;

    // Quick Time Money (Coin Orb) Event
    this.bonusOrb = null;
    this.nextBonusOrbTime = 18;
    this.guaranteedCoinTimer = 0; // For QTM Level 3 (every 180s guaranteed)

    // Hold-to-Damage Mouse/Touch State
    this.isPointerDown = false;
    this.pointerX = 0;
    this.pointerY = 0;
    this.holdDamageTimer = 0;

    // Animation Clock & Impact Screen Shake
    this.animTime = 0;
    this.screenShake = 0;

    // Canvas & Dimensions
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = 800;
    this.height = 650;
    this.dpr = window.devicePixelRatio || 1;

    // Timing & Background/Offline Runner
    this.lastTime = performance.now();
    this.lastTickMs = Date.now();
    this.autosaveTimer = 0;
    this.suppressAudioAndVisuals = false;
    this.pendingOfflineSeconds = 0;
    this.offlineProgressAppliedAt = 0;
    this.bgWorker = null;
    this.bgInterval = null;
    this.isResetting = false;
    this.dec24TimerInterval = null;
    this.activeTooltipKind = null;
    this.activeUpgradeCardIndex = 0;
    this.cloud = null;

    // 3-Day Unregistered Guest Retention State
    this.GUEST_RETENTION_MS = 3 * 24 * 60 * 60 * 1000;
    const initNow = Date.now();
    this.guestCreatedAt = initNow;
    this.guestDeadlineAt = initNow + this.GUEST_RETENTION_MS;
    this.guestLastActiveAt = initNow;
    this.guestExtendedByManual = false;
    this.guestNoticeDismissed = false;
    this.guestExpiredNotice = false;
    this._lastGuestExpiryCheck = 0;
  }

  init() {
    this.setupCanvas();
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleResize(), 150);
    });

    // Load saved data
    this.load();

    // Setup perimeter border bricks and arena level
    this.createPerimeterBricks();
    this.generateLevel(this.level);
    this.processPendingAdminCommands();

    // Ensure any permanent-for-run BB lvl 4/5 effects that were saved as active or unlocked are ready
    this.restoreActivePowerUpVisuals();

    // Apply offline progress if the game was closed for >= 5s and player has balls or permanent Auto Clicker
    if (this.pendingOfflineSeconds >= 5 && (this.getTotalBalls() > 0 || this.bbUpgrades.autoClicker >= 1)) {
      this.applyOfflineProgress(this.pendingOfflineSeconds, true);
      this.pendingOfflineSeconds = 0;
    }

    // Bind UI & Canvas events
    this.bindEvents();
    this.initLeaderboard();
    this.initDevPanel();
    this.updateMaintenanceOverlay(false);
    this.initMailSystem();
    this.initBattlePass();
    if (typeof CloudAuthManager !== 'undefined') {
      this.cloud = new CloudAuthManager(this);
      this.cloud.init();
    }
    this.initWelcomeMenu();
    this.startDec24Countdown();
    this.updateGuestRetentionUI();
    this.renderPowerUpsHUD();
    this.updateHUD();

    if (this.guestExpiredNotice) {
      setTimeout(() => {
        this.showToast('🗑️ A be nem regisztrált haladásod lejárt (3 nap) és törölve lett! Regisztrálj fiókot a korlátlan mentéshez!', 6500);
      }, 400);
    }

    window.addEventListener('beforeunload', () => {
      this.save();
      if (this.cloud) this.cloud.saveToCloud(false);
    });

    // Start background runner so the game keeps running on other tabs
    this.startBackgroundRunner();

    // Start 60 FPS visual Game Loop
    this.lastTickMs = Date.now();
    requestAnimationFrame((t) => this.gameLoop(t));

    // URL cache-buster paraméter eltávolítása + automatikus verziófigyelő indítása
    try {
      const curUrl = new URL(window.location.href);
      if (curUrl.searchParams.has('v')) {
        curUrl.searchParams.delete('v');
        window.history.replaceState({}, document.title, curUrl.toString());
      }
    } catch (e) {}
    this.startAutoUpdateWatcher();
  }

  // --- Canvas Setup ---
  setupCanvas() {
    const wrapper = document.getElementById('arena-wrapper');
    const rect = wrapper.getBoundingClientRect();
    this.width = Math.max(320, Math.floor(rect.width));
    this.height = Math.max(200, Math.floor(rect.height));
    this.dpr = window.devicePixelRatio || 1;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  handleResize() {
    this.setupCanvas();
    this.createPerimeterBricks();
    this.generateLevel(this.level);
    const upgModal = document.getElementById('upgrades-modal');
    if (upgModal && upgModal.classList.contains('open')) {
      this.renderUpgradesMenu();
    }
    const bbModal = document.getElementById('powerup-upgrades-modal');
    if (bbModal && bbModal.classList.contains('open')) {
      this.renderPowerUpUpgradesModal();
    }
  }

  // --- White Perimeter Border Bricks ---
  createPerimeterBricks() {
    this.perimeterBricks = [];
    const borderWidth = 18;

    const topCount = Math.floor(this.width / 50);
    const topW = this.width / topCount;
    for (let i = 0; i < topCount; i++) {
      this.perimeterBricks.push({ x: i * topW, y: 0, w: topW, h: borderWidth });
    }

    const btmCount = Math.floor(this.width / 50);
    const btmW = this.width / btmCount;
    for (let i = 0; i < btmCount; i++) {
      this.perimeterBricks.push({ x: i * btmW, y: this.height - borderWidth, w: btmW, h: borderWidth });
    }

    const leftCount = Math.floor((this.height - borderWidth * 2) / 35);
    const leftH = (this.height - borderWidth * 2) / leftCount;
    for (let i = 0; i < leftCount; i++) {
      this.perimeterBricks.push({ x: 0, y: borderWidth + i * leftH, w: borderWidth, h: leftH });
    }

    const rightCount = Math.floor((this.height - borderWidth * 2) / 35);
    const rightH = (this.height - borderWidth * 2) / rightCount;
    for (let i = 0; i < rightCount; i++) {
      this.perimeterBricks.push({ x: this.width - borderWidth, y: borderWidth + i * rightH, w: borderWidth, h: rightH });
    }
  }

  // --- Color Mapping by HP (1: Kék, 2: Citromsárga, 3: Narancs...) ---
  getBlockColor(hp, isBoss = false) {
    if (isBoss) return '#be123c';
    const displayHp = Math.max(1, Math.ceil(hp));
    switch (displayHp) {
      case 1: return '#42c2f7'; // Kék
      case 2: return '#facc15'; // Citromsárga
      case 3: return '#f97316'; // Narancssárga
      case 4: return '#4ade80'; // Élénkzöld
      case 5: return '#ef4444'; // Piros
      case 6: return '#a855f7'; // Lila
      case 7: return '#ec4899'; // Rózsaszín
      case 8: return '#06b6d4'; // Cián
      case 9: return '#eab308'; // Arany
      default: {
        const hues = ['#38bdf8', '#facc15', '#fb923c', '#22c55e', '#ef4444', '#c084fc', '#f472b6', '#14b8a6'];
        return hues[(displayHp - 1) % hues.length];
      }
    }
  }

  // --- Boss Schedule & HP Rules ---
  // Lvl 1-150: 10 szintenként | Lvl 151-400: 25 szintenként | Lvl 401+: 30 szintenként
  isBossLevel(lvl) {
    if (lvl <= 0) return false;
    if (lvl <= 150) return lvl % 10 === 0;
    if (lvl <= 400) return (lvl - 150) % 25 === 0;
    return (lvl - 400) % 30 === 0;
  }

  getBossNumberForLevel(lvl) {
    if (lvl <= 150) return Math.max(1, Math.floor(lvl / 10));
    if (lvl <= 400) return 15 + Math.floor((lvl - 150) / 25);
    return 25 + Math.floor((lvl - 400) / 30);
  }

  // --- Exact Boss HP Lookup ---
  // Lvl 10-350: pontos táblázat (köztes 25-ös szintek interpolálva)
  // Lvl 400: 500,000 | Lvl 400 után (430, 460, 490...):
  //   - 70% eséllyel 500.000 – 1.000.000 HP
  //   - 25% eséllyel 1.000.000 – 1.950.000 HP (2 millió alatt)
  //   - 5% eséllyel (20-ból 1) 5.000.000 HP Mega Boss!
  getBossHpForLevel(lvl) {
    const lateHpMult = this.getLateGameHpMultiplier();
    let baseHp;
    if (lvl > 400) {
      const r = Math.random();
      if (r < 0.05) {
        baseHp = 5_000_000; // 1 a 20-ból (5%): 5 milliós Boss!
      } else if (r < 0.75) {
        // 70% esély: 500.000 – 1.000.000 HP
        baseHp = Math.round((500_000 + Math.random() * 500_000) / 1000) * 1000;
      } else {
        // 25% esély: 1.000.000 – 1.950.000 HP (2 millió alatti)
        baseHp = Math.round((1_000_000 + Math.random() * 950_000) / 1000) * 1000;
      }
      return Math.round((baseHp * lateHpMult) / 1000) * 1000;
    }
    if (BOSS_HP_TABLE[lvl] !== undefined) {
      baseHp = BOSS_HP_TABLE[lvl];
    } else if (lvl === 175) baseHp = 65000;
    else if (lvl === 225) baseHp = 77500;
    else if (lvl === 275) baseHp = 86250;
    else if (lvl === 325) baseHp = 95000;
    else if (lvl === 375) baseHp = 300000;
    else if (lvl === 400) baseHp = 500000;
    else baseHp = lvl * 40;
    return Math.max(1, Math.round(baseHp * lateHpMult));
  }

  // --- Balanced Boss Money Calculation (Boss 1 legkevesebb -> magas szintű Bossok legtöbb) ---
  getBossRewardPerDamage(lvl) {
    return 0.25 + (lvl / 350) * 4.75;
  }

  getBossKillBonus(lvl) {
    const bossIndex = this.getBossNumberForLevel(lvl);
    return Math.round(500 * Math.pow(bossIndex, 1.75));
  }

  // --- Level Generator (Blokkok generálása a labdák helyén is, KIVÉVE a legalsó sort!) ---
  generateLevel(lvl) {
    this.bricks = [];
    const perimeterPadding = 22;
    const arenaW = this.width - perimeterPadding * 2;
    const arenaH = this.height - perimeterPadding * 2;

    // Boss level check: <=150 (10-enként), 151..400 (25-enként), >400 (30-anként)
    if (this.isBossLevel(lvl)) {
      this.isGoldLevelActive = false;
      const bossW = arenaW * 0.64;
      const bossH = arenaH * 0.46;
      const bossX = perimeterPadding + (arenaW - bossW) / 2;
      const bossY = perimeterPadding + (arenaH * 0.44 - bossH / 2);

      const bossHp = this.getBossHpForLevel(lvl);
      const isGold = this.nextBossIsGold;
      if (isGold) {
        this.nextBossIsGold = false;
        delete this.activePowerUps['gold_boss'];
        if (!this.suppressAudioAndVisuals) this.renderPowerUpsHUD();
      }

      this.bricks.push({
        id: `boss_${lvl}_${Date.now()}`,
        x: bossX,
        y: bossY,
        w: bossW,
        h: bossH,
        hp: bossHp,
        maxHp: bossHp,
        isBoss: true,
        isGoldBoss: isGold,
        bossNumber: this.getBossNumberForLevel(lvl),
        flash: 0,
        shake: 0,
        poison: null,
        poisonStacks: [] // Boss blokkokon a méreg stackelődhet!
      });

      // Ha a Boss spawnolásakor bármelyik labda a Boss helyén (vagy túl közel) van,
      // toljuk ki biztonságosan a legközelebbi oldal mentén +10 px-el a Bosson kívülre!
      this.ejectBallsOutsideBoss(bossX, bossY, bossW, bossH);

      if (!this.suppressAudioAndVisuals) this.updateHUD();
      return;
    }

    // Normal level generation:
    // Blokkok a labdák helyén is generálódnak, KIVÉVE a legalsó sor (r = rows - 1)!
    if (this.nextLevelIsGold) {
      this.nextLevelIsGold = false;
      this.isGoldLevelActive = true;
      delete this.activePowerUps['gold_level'];
      this.activatePowerUp('gold_level_active', '🌟', 'GOLD LEVEL (20x $ + BB/BT)', '500–2000 HP, 20x pénz, aranyblokkokból BB/BT esély + teljesítéskor +10 BB & +15 BT!', { mode: 'rounds', rounds: 1 });
      if (!this.suppressAudioAndVisuals) {
        this.showToast('🌟 <strong>GOLD LEVEL INDUL!</strong> 500–2000 HP-s aranyblokkok: 20x pénz, BB/BT esés + teljesítéskor +10 ⭐ BB & +15 👑 BT!', 5000);
      }
    }

    const cols = Math.max(7, Math.min(11, Math.floor(arenaW / 60)));
    const rows = Math.max(9, Math.min(14, Math.floor(arenaH / 34)));

    const brickW = arenaW / cols;
    const brickH = arenaH / rows;
    this.gridCellW = brickW;
    this.gridCellH = brickH;
    const lateHpMult = this.getLateGameHpMultiplier();
    const blockHp = Math.max(1, Math.round(lvl * lateHpMult));
    const isGoldLevel = !!this.isGoldLevelActive;

    // Kizárólag a legalsó sor marad üresen (r < rows - 1), a labdák pozícióját nem kerüli ki!
    const activeRows = rows - 1;
    let idCounter = 0;

    for (let r = 0; r < activeRows; r++) {
      for (let c = 0; c < cols; c++) {
        const goldBase = 500 + Math.floor(Math.random() * 1501);
        let specialType = null;
        let hpMult = 1;
        let moneyMult = 1;
        if (!isGoldLevel && lvl >= 3) {
          const spRoll = Math.random();
          if (lvl >= 5 && spRoll < 0.09) {
            specialType = 'armored';
            hpMult = 1.6;
            moneyMult = 2.5;
          } else if (lvl >= 8 && spRoll < 0.16) {
            specialType = 'regen';
            hpMult = 1.2;
            moneyMult = 2.2;
          } else if (spRoll < 0.22) {
            specialType = 'explosive';
            moneyMult = 2.0;
          }
        }
        const brickHp = isGoldLevel ? Math.round(goldBase * Math.sqrt(lateHpMult)) : Math.max(1, Math.round(blockHp * hpMult));
        this.bricks.push({
          id: `b_${lvl}_${idCounter++}`,
          x: perimeterPadding + c * brickW,
          y: perimeterPadding + r * brickH,
          w: brickW,
          h: brickH,
          hp: brickHp,
          maxHp: brickHp,
          isBoss: false,
          isGoldBoss: false,
          isGoldBrick: isGoldLevel,
          goldMoneyMult: isGoldLevel ? 20 : 1,
          specialType,
          moneyMult,
          regenDelay: 0,
          flash: 0,
          shake: 0,
          poison: null,      // Normál blokkon egyszerre csak 1 méreg lehet!
          poisonStacks: null
        });
      }
    }

    if (!this.suppressAudioAndVisuals) this.updateHUD();
  }

  // --- Boss Spawn Anti-Overlap: Labdák biztonságos eltolása a Bosson kívülre ---
  ejectBallsOutsideBoss(bx, by, bw, bh) {
    const borderWidth = 18;
    const arenaLeft = borderWidth;
    const arenaRight = this.width - borderWidth;
    const arenaTop = borderWidth;
    const arenaBottom = this.height - borderWidth;
    const safeGap = 10; // extra pár px biztonsági távolság a Bosstól

    for (const ball of this.balls) {
      const margin = ball.radius + safeGap;
      const inX = ball.x > bx - margin && ball.x < bx + bw + margin;
      const inY = ball.y > by - margin && ball.y < by + bh + margin;

      if (inX && inY) {
        const distLeft = ball.x - (bx - margin);
        const distRight = (bx + bw + margin) - ball.x;
        const distTop = ball.y - (by - margin);
        const distBottom = (by + bh + margin) - ball.y;

        const minDist = Math.min(distLeft, distRight, distTop, distBottom);

        if (minDist === distLeft) {
          ball.x = Math.max(arenaLeft + ball.radius + 2, bx - margin);
          ball.vx = -Math.abs(ball.vx || ball.speed * 0.7);
        } else if (minDist === distRight) {
          ball.x = Math.min(arenaRight - ball.radius - 2, bx + bw + margin);
          ball.vx = Math.abs(ball.vx || ball.speed * 0.7);
        } else if (minDist === distTop) {
          ball.y = Math.max(arenaTop + ball.radius + 2, by - margin);
          ball.vy = -Math.abs(ball.vy || ball.speed * 0.7);
        } else {
          ball.y = Math.min(arenaBottom - ball.radius - 2, by + bh + margin);
          ball.vy = Math.abs(ball.vy || ball.speed * 0.7);
        }
      }
    }
  }

  // --- Active Modifiers Helpers ---
  getSpeedBoostMultiplier() {
    if (!this.isPowerUpActive('speed_boost')) return 1.0;
    const p = this.activePowerUps['speed_boost'];
    return p.extra?.speedMult ?? 2.0;
  }

  getDamageMultiplier() {
    let mult = 1.0;
    if (this.isPowerUpActive('2x_dmg')) {
      mult *= 2.0;
    }
    if (this.isPowerUpActive('speed_boost') && this.activePowerUps['speed_boost'].extra?.dmgMult) {
      mult *= this.activePowerUps['speed_boost'].extra.dmgMult;
    }
    return mult;
  }

  getDiscountMultiplier() {
    if (!this.isPowerUpActive('discount')) return 1.0;
    const discPct = this.activePowerUps['discount'].extra?.discountPct ?? 0;
    return Math.max(0, 1 - discPct / 100);
  }

  isPirateShopActive() {
    return this.isPowerUpActive('discount') && (this.activePowerUps['discount'].extra?.discountPct === 100);
  }

  applyDiscount(baseCost) {
    if (this.isPirateShopActive()) return 0;
    return Math.max(1, Math.round(baseCost * this.getDiscountMultiplier()));
  }

  // --- Block Break Debris Particles (A labda skinjének színével megegyező robbanási animáció) ---
  spawnBrickDestructionDebris(cx, cy, color, isBoss = false) {
    if (this.suppressAudioAndVisuals || document.hidden || (this.prefs && !this.prefs.particles)) return;
    const count = isBoss ? 22 : 10;
    for (let i = 0; i < count; i++) {
      if (this.debrisParticles.length >= 140) this.debrisParticles.shift();
      const angle = (Math.PI * 2 * (i / count)) + (Math.random() - 0.5) * 0.6;
      const speed = 70 + Math.random() * (isBoss ? 160 : 120);
      const size = 3 + Math.random() * (isBoss ? 3.5 : 2.5);
      const life = 0.35 + Math.random() * 0.22;
      this.debrisParticles.push({
        x: cx + (Math.random() - 0.5) * 6,
        y: cy + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30, // Enyhén felfelé ívelő retro robbanási pálya
        gravity: 240,
        size,
        color: color || '#ffee00',
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 12,
        life,
        maxLife: life
      });
    }
  }

  getCosmeticMaxEquip(type, id) {
    if (!id || id === 'default' || id === 'none') return 1;
    const matchType = type === 'break_effect' ? 'break_effect' : type;
    for (const stg of BATTLE_PASS_STAGES) {
      if (stg.free && stg.free.type === matchType && stg.free.id === id) {
        return Math.max(1, Number(stg.free.maxEquip) || 1);
      }
      if (stg.paid && stg.paid.type === matchType && stg.paid.id === id) {
        return Math.max(1, Number(stg.paid.maxEquip) || 1);
      }
    }
    return 1;
  }

  getMaxVisualCosmeticSlotsForEquip(eq) {
    if (!eq) return 1;
    return Math.max(
      this.getCosmeticMaxEquip('skin', eq.skinId),
      this.getCosmeticMaxEquip('effect', eq.effectId),
      this.getCosmeticMaxEquip('break_effect', eq.breakEffectId)
    );
  }

  isPrimaryCosmeticBall(ball) {
    return this.isCosmeticBallActive(ball, 'break_effect');
  }

  isCosmeticBallActive(ball, kind = 'skin') {
    if (!ball || ball.isPiercing || ball.isSplitChild) return false;
    const eq = this.ballTypeEquips && this.ballTypeEquips[ball.type];
    const id = kind === 'break_effect' ? eq?.breakEffectId : (kind === 'effect' ? eq?.effectId : eq?.skinId);
    const cap = this.getCosmeticMaxEquip(kind, id);
    let rank = 0;
    for (const candidate of this.balls) {
      if (!candidate.isPiercing && !candidate.isSplitChild && candidate.type === ball.type) {
        rank++;
        if (candidate === ball) return rank <= cap;
        if (rank >= cap) break;
      }
    }
    return false;
  }

  // --- Breaking Effects (Explosion, Frost Shatter, Supernova, Glitch Burst) ---
  spawnCustomBreakingEffect(breakFxId, cx, cy, color, isBoss = false) {
    if (!breakFxId || breakFxId === 'none') return;
    if (this.suppressAudioAndVisuals || document.hidden || (this.prefs && !this.prefs.particles)) return;
    if (breakFxId === 'brk_explode') {
      this.spawnBreakingExplosion(cx, cy, color, isBoss);
      return;
    }
    const palette = breakFxId === 'brk_s2_frost'
      ? ['186, 230, 253', '56, 189, 248', '#e0f2fe']
      : (breakFxId === 'brk_s2_nova'
          ? ['250, 204, 21', '168, 85, 247', '#fde047']
          : ['6, 182, 212', '236, 72, 153', '#22d3ee']);
    this.visualRings.push(
      { x: cx, y: cy, radius: 5, maxRadius: isBoss ? 68 : 44, alpha: 0.92, color: palette[0], speed: 240 },
      { x: cx, y: cy, radius: 8, maxRadius: isBoss ? 92 : 62, alpha: 0.78, color: palette[1], speed: 300 }
    );
    const chunkCount = isBoss ? 12 : 8;
    for (let i = 0; i < chunkCount; i++) {
      if (this.debrisParticles.length >= 220) this.debrisParticles.shift();
      const angle = (Math.PI * 2 * (i / chunkCount)) + (Math.random() - 0.5) * 0.4;
      const speed = 115 + Math.random() * 130;
      const life = 0.34 + Math.random() * 0.22;
      this.debrisParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 25,
        size: 4 + Math.random() * 2.5,
        color: palette[2],
        life,
        maxLife: life
      });
    }
  }

  // --- Breaking Effect: Blokk Robbanás Animáció (Stage 5) ---
  spawnBreakingExplosion(cx, cy, color, isBoss = false) {
    if (this.suppressAudioAndVisuals || document.hidden || (this.prefs && !this.prefs.particles)) return;
    this.visualRings.push(
      { x: cx, y: cy, radius: 4, maxRadius: isBoss ? 56 : 36, alpha: 0.98, color: '254, 240, 138', speed: 230 },
      { x: cx, y: cy, radius: 8, maxRadius: isBoss ? 84 : 58, alpha: 0.92, color: '249, 115, 22', speed: 270 },
      { x: cx, y: cy, radius: 10, maxRadius: isBoss ? 105 : 74, alpha: 0.72, color: '239, 68, 68', speed: 320 }
    );

    const chunkCount = isBoss ? 14 : 10;
    for (let i = 0; i < chunkCount; i++) {
      if (this.debrisParticles.length >= 220) this.debrisParticles.shift();
      const angle = (Math.PI * 2 * (i / chunkCount)) + (Math.random() - 0.5) * 0.55;
      const speed = 110 + Math.random() * (isBoss ? 170 : 140);
      const size = 4 + Math.random() * 3;
      const life = 0.35 + Math.random() * 0.25;
      this.debrisParticles.push({
        x: cx + (Math.random() - 0.5) * 8,
        y: cy + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 35,
        gravity: 260,
        size,
        color: color || '#f97316',
        shape: 'square',
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 16,
        life,
        maxLife: life
      });
    }

    const emberColors = ['#fef08a', '#fb923c', '#ef4444'];
    const emberCount = isBoss ? 14 : 10;
    for (let i = 0; i < emberCount; i++) {
      if (this.debrisParticles.length >= 220) this.debrisParticles.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * (isBoss ? 160 : 130);
      const size = 3 + Math.random() * 3.5;
      const life = 0.30 + Math.random() * 0.22;
      this.debrisParticles.push({
        x: cx + (Math.random() - 0.5) * 10,
        y: cy + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 15,
        gravity: 90,
        size,
        color: emberColors[i % emberColors.length],
        shape: 'circle',
        rot: 0,
        vrot: 0,
        life,
        maxLife: life
      });
    }
  }

  // --- Brick Damage & Money Reward ---
  damageBrick(brick, dmg, source = 'click', options = {}) {
    if (!brick || brick.hp <= 0) return;
    const preHitColor = brick.isBoss
      ? (brick.isGoldBoss ? '#fde047' : '#be123c')
      : (brick.isGoldBrick ? '#fde047' : (brick.color || this.getBlockColor(brick.hp, false)));

    let actualDmg = dmg;
    if (source === 'coin') {
      actualDmg = 1; // A Coin Ball minden esetben pontosan 1-et sebez
    } else if (source === 'piercing_special') {
      if (brick.isBoss) {
        actualDmg = Math.max(15, Math.round(brick.maxHp * 0.03)); // 3% HP per hit on boss
      } else {
        actualDmg = brick.hp; // Instant destroy normal bricks
      }
    } else if (options.instantKill && !brick.isBoss) {
      actualDmg = brick.hp;
    }

    // Apply 2x Damage & All Ball Speed lvl 2/3/5 damage multiplier
    if (source !== 'coin' && source !== 'piercing_special' && !options.instantKill) {
      actualDmg *= this.getDamageMultiplier();
    } else if (brick.isBoss && source === 'piercing_special') {
      actualDmg *= this.getDamageMultiplier();
    }

    // Armored brick takes 30% less direct ball/click damage (DoT/Pierce/Explosion bypass armor)
    if (brick.specialType === 'armored' && source !== 'piercing_special' && source !== 'dot' && source !== 'brick_explosion' && !options.instantKill) {
      actualDmg = Math.max(0.01, actualDmg * 0.7);
    }

    actualDmg = Math.min(brick.hp, Math.max(0.01, actualDmg));
    brick.hp -= actualDmg;
    if (brick.hp < 0.001) brick.hp = 0;
    brick.flash = 0.09;
    if (brick.specialType === 'regen') {
      brick.regenDelay = 2.5;
    }
    if (brick.isBoss) {
      brick.shake = Math.min(6, (brick.shake || 0) + 2.2);
    }

    // Money reward calculation
    let baseRewardPerDmg = 1;
    if (brick.isBoss) {
      baseRewardPerDmg = this.getBossRewardPerDamage(this.level);
      if (brick.isGoldBoss) {
        baseRewardPerDmg *= 2;
      }
    } else if (brick.isGoldBrick) {
      baseRewardPerDmg *= (brick.goldMoneyMult || 20);
    } else if (brick.moneyMult && brick.moneyMult > 1) {
      baseRewardPerDmg *= brick.moneyMult;
    }

    let reward = actualDmg * baseRewardPerDmg * this.rebirthMultiplier;
    if (this.isPowerUpActive('2x_money')) {
      reward *= 2;
    }
    if (options.extraMoney > 0) {
      reward += options.extraMoney;
    }

    this.money += reward;

    const silent = this.suppressAudioAndVisuals || document.hidden;

    if (!silent) {
      if (reward >= 1 || brick.hp <= 0) {
        const moneyLabel = source === 'coin'
          ? `+🪙$${this.formatNumber(Math.max(1, Math.round(reward)))}`
          : `+$${this.formatNumber(Math.max(1, Math.round(reward)))}`;
        this.addFloatingText(moneyLabel, brick.x + brick.w / 2, brick.y + brick.h / 2, source === 'coin' ? '#facc15' : undefined);
      }
      if (brick.isBoss && this.bossSparks.length < 30 && (!this.prefs || this.prefs.particles)) {
        this.bossSparks.push({
          x: brick.x + Math.random() * brick.w,
          y: brick.y + Math.random() * brick.h,
          vx: (Math.random() - 0.5) * 140,
          vy: (Math.random() - 0.5) * 140,
          life: 0.35,
          color: brick.isGoldBoss ? '#fde047' : '#fb923c'
        });
      }
    }

    if (brick.hp <= 0) {
      this.totalBricksDestroyed++;
      this.updateBattlePassHUD();

      const breakFxId = (options.ball && this.isCosmeticBallActive(options.ball, 'break_effect'))
        ? (this.ballTypeEquips?.[options.ball.type]?.breakEffectId || 'none')
        : 'none';

      if (breakFxId && breakFxId !== 'none') {
        if (!silent && window.soundEngine) window.soundEngine.playExplosion();
        this.spawnCustomBreakingEffect(breakFxId, brick.x + brick.w / 2, brick.y + brick.h / 2, preHitColor, brick.isBoss);
      } else {
        if (!silent && window.soundEngine) window.soundEngine.playBrickDestroy(brick.isBoss ? 5 : 1);
        // A blokk azonnali / közvetlen ütés előtti HP-színének megfelelő robbanási részecskék
        this.spawnBrickDestructionDebris(brick.x + brick.w / 2, brick.y + brick.h / 2, preHitColor, brick.isBoss);
      }

      if (brick.isBoss) {
        let bossBonus = this.getBossKillBonus(this.level) * this.rebirthMultiplier;
        if (brick.isGoldBoss) bossBonus *= 2;
        if (this.isPowerUpActive('2x_money')) bossBonus *= 2;
        bossBonus = Math.round(bossBonus);
        this.money += bossBonus;
        this.bossTokens += 1; // Minden Boss megölése után +1 Boss Token!
        this.syncWalletChangeNow(false);
        if (!silent) {
          const prefix = brick.isGoldBoss ? '✨ GOLD BOSS' : '👑 BOSS';
          this.addFloatingText(`${prefix} BONUS: +$${this.formatNumber(bossBonus)} | +1 👑 BT!`, brick.x + brick.w / 2, brick.y + brick.h / 2 - 20);
        }
      } else {
        if (brick.isGoldBrick) {
          // Gold Level blokkokból plusz ⭐ BB és 👑 BT is eshet!
          let goldWalletChanged = false;
          if (Math.random() < 0.12) {
            this.bossTokens += 1;
            goldWalletChanged = true;
            if (!silent) {
              this.addFloatingText('+1 👑 BT!', brick.x + brick.w / 2, brick.y + brick.h / 2 - 14, '#fbbf24');
            }
          }
          if (Math.random() < 0.05) {
            this.bb += 1;
            goldWalletChanged = true;
            if (!silent) {
              this.addFloatingText('+1 ⭐ BB!', brick.x + brick.w / 2, brick.y + brick.h / 2 - 28, '#fde047');
            }
          }
          if (goldWalletChanged) {
            this.syncWalletChangeNow(false);
          }
        }
        if (brick.specialType === 'explosive' && source !== 'brick_explosion') {
          const ex = brick.x + brick.w / 2;
          const ey = brick.y + brick.h / 2;
          const blastRadius = 95;
          if (!silent && (!this.prefs || this.prefs.particles)) {
            this.visualRings.push({ x: ex, y: ey, radius: 10, maxRadius: blastRadius, alpha: 0.9, color: '249, 115, 22', speed: 280 });
          }
          const blastDmg = Math.max(1, Math.round(brick.maxHp * 1.8));
          const nearby = this.bricks.filter(b => b !== brick && b.hp > 0 && Math.hypot((b.x + b.w / 2) - ex, (b.y + b.h / 2) - ey) <= blastRadius);
          for (const nb of nearby) {
            this.damageBrick(nb, blastDmg, 'brick_explosion');
          }
        }
        if (source !== 'piercing_special' && source !== 'shockwave' && source !== 'dot' && source !== 'brick_explosion') {
          this.rollPowerUpDrop(brick.x + brick.w / 2, brick.y + brick.h / 2);
        }
      }

      this.checkLevelClear();
    } else {
      if (!silent && window.soundEngine && source !== 'dot') {
        if (source === 'auto_clicker') {
          const nowMs = Date.now();
          if (nowMs - this.lastAutoClickSoundAt >= 280) {
            this.lastAutoClickSoundAt = nowMs;
            window.soundEngine.playClickHit();
          }
        } else if (source === 'click') {
          window.soundEngine.playClickHit();
        } else {
          window.soundEngine.playHit(source);
        }
      }
    }

    if (!this.suppressAudioAndVisuals) {
      this.updateHUD();
    }
  }

  checkLevelClear() {
    const remaining = this.bricks.filter(b => b.hp > 0).length;
    if (remaining === 0) {
      const clearedGoldLevel = !!this.isGoldLevelActive;
      if (clearedGoldLevel) {
        const goldClearBB = 10;
        const goldClearBT = 15;
        this.bb += goldClearBB;
        this.bossTokens += goldClearBT;
        if (!this.suppressAudioAndVisuals) {
          this.showToast(`🌟 <strong>GOLD LEVEL TELJESÍTVE!</strong> Bónusz: <span style="color:#fde047;">+${goldClearBB} ⭐ BB</span> és <span style="color:#fbbf24;">+${goldClearBT} 👑 BT</span>!`, 5500);
        }
      }
      this.level++;
      this.renderLeaderboard();
      this.broadcastMyStatus(); // Valós idejű szintfrissítés a hálózaton
      if (this.cloud) {
        this.cloud.syncLeaderboardToCloud(false);
        this.cloud.saveToCloud(false);
      }
      this.onRoundCleared();
      if (!this.suppressAudioAndVisuals && !document.hidden && window.soundEngine) {
        window.soundEngine.playLevelUp();
      }
      this.generateLevel(this.level);
      if (clearedGoldLevel && !this.suppressAudioAndVisuals) {
        this.updateHUD();
        this.refreshOpenModals();
        this.save();
      }
    }
  }

  onRoundCleared() {
    this.isGoldLevelActive = false;
    let changed = false;
    for (const key in this.activePowerUps) {
      const p = this.activePowerUps[key];
      if (p.mode === 'rounds') {
        p.roundsLeft--;
        if (p.roundsLeft <= 0) {
          delete this.activePowerUps[key];
          changed = true;
        } else {
          changed = true;
        }
      }
    }
    if (changed && !this.suppressAudioAndVisuals) {
      this.renderPowerUpsHUD();
    }
  }

  // --- Power-Up Drop System (~300-350 blokkonként 1 power-up, minden új power-up integrálva!) ---
  hasTemporaryActivePowerUp() {
    for (const key in this.activePowerUps) {
      const p = this.activePowerUps[key];
      if (key === 'gold_boss' || key === 'gold_level' || key === 'gold_level_active') continue;
      if (p.mode !== 'until_rebirth' && p.mode !== 'forever') {
        return true;
      }
    }
    return false;
  }

  getShockwaveConfig(lvl = this.bbUpgrades.shockwave) {
    if (lvl >= 5) {
      return { dmg: 650, maxHpPct: 0.03, interval: 0.5, radiusRatio: 1.0, mode: 'until_rebirth', label: '650 sebzés + 3% max HP / 0.5 mp teljes pályán, Rebirthig!' };
    }
    if (lvl === 4) {
      return { dmg: 320, maxHpPct: 0, interval: 0.65, radiusRatio: 1.0, mode: 'rounds', rounds: 10, label: '320 sebzés / 0.65 mp teljes pályán, 10 körön át!' };
    }
    if (lvl === 3) {
      return { dmg: 160, maxHpPct: 0, interval: 0.75, radiusRatio: 1.0, mode: 'timed', duration: 50, label: '160 sebzés / 0.75 mp teljes pályán 50 mp-ig!' };
    }
    if (lvl === 2) {
      return { dmg: 60, maxHpPct: 0, interval: 0.9, radiusRatio: 0.82, mode: 'timed', duration: 40, label: '60 sebzés / 0.9 mp (82% terület) 40 mp-ig!' };
    }
    if (lvl === 1) {
      return { dmg: 20, maxHpPct: 0, interval: 1.0, radiusRatio: 0.65, mode: 'timed', duration: 30, label: '20 sebzés/mp (65% terület) 30 mp-ig!' };
    }
    return { dmg: 4, maxHpPct: 0, interval: 1.0, radiusRatio: 0.50, mode: 'timed', duration: 30, label: '4 sebzés/mp (50% terület) 30 mp-ig!' };
  }

  getAutoClickerConfig(lvl = this.bbUpgrades.autoClicker) {
    if (lvl >= 5) {
      return {
        permanent: true,
        interval: 0.1,
        dmgMult: 5.0,
        areaRadius: 165,
        instantEvery: 5,
        label: 'Örök • 0.1 mp (10x/mp) • 5x Click Power • 165px terület • 5. ütés instant!'
      };
    }
    if (lvl === 4) {
      return {
        permanent: true,
        interval: 0.2,
        dmgMult: 3.0,
        areaRadius: 130,
        instantEvery: 0,
        label: 'Örök • 0.2 mp (5x/mp) • 3x Click Power • 130px terület!'
      };
    }
    if (lvl === 3) {
      return {
        permanent: true,
        interval: 0.25,
        dmgMult: 2.0,
        areaRadius: 85,
        instantEvery: 0,
        label: 'Örök • 0.25 mp (4x/mp) • 2x Click Power • 85px terület!'
      };
    }
    if (lvl === 2) {
      return {
        permanent: true,
        interval: 0.5,
        dmgMult: 1.5,
        areaRadius: 0,
        instantEvery: 0,
        label: 'Örök • 0.5 mp (2x gyors) • 1.5x Click Power!'
      };
    }
    if (lvl === 1) {
      return {
        permanent: true,
        interval: 1.0,
        dmgMult: 1.0,
        areaRadius: 0,
        instantEvery: 0,
        label: 'Örök (Rebirth után is megmarad!) • 1.0 mp • 1x Click Power!'
      };
    }
    return {
      permanent: false,
      interval: 1.0,
      dmgMult: 1.0,
      areaRadius: 0,
      instantEvery: 0,
      label: 'Automatikus kattintás (15 mp • 1x Click Power / mp).'
    };
  }

  syncPermanentPowerUps() {
    if (this.bbUpgrades.autoClicker >= 1) {
      const cfg = this.getAutoClickerConfig(this.bbUpgrades.autoClicker);
      this.activePowerUps['auto_clicker'] = {
        id: 'auto_clicker',
        icon: '🤖',
        name: `Auto Clicker (Phase ${this.bbUpgrades.autoClicker})`,
        desc: cfg.label,
        mode: 'forever',
        duration: 0,
        maxDuration: 0,
        roundsLeft: 0,
        maxRounds: 0,
        extra: { lvl: this.bbUpgrades.autoClicker }
      };
    }
  }

  rollPowerUpDrop(x, y) {
    // Ha már van aktív időzített / körhöz kötött power-up, ne halmozódjanak egymásra!
    // (A Rebirthig / örökké tartó bónuszok NEM blokkolják a többi power-up esését!)
    if (this.hasTemporaryActivePowerUp()) {
      return;
    }

    // Átlagosan minden ~800 blokk után 1 power-up (100 / 800 = 0.125% blokkonként), rebirth-enként mérsékelt +0.005%
    const totalDropPercent = this.getPowerUpDropChancePercent();
    const roll = Math.random() * 100;
    if (roll >= totalDropPercent) {
      return;
    }

    // Kiegyensúlyozott power-up esély-eloszlás fix 14.0 nevezővel (maxolt fix BB fejlesztések NEM növelik a ritka dobások esélyét!):
    const FULL_POOL_WEIGHT = 14.0;
    const nowMs = Date.now();
    const allBBMaxed = Object.keys(this.bbUpgrades).every(k => (this.bbUpgrades[k] || 0) >= 5);
    const discountWeight = (this.bbUpgrades.discount >= 5) ? 0.06 : 0.85;
    const freeUpgWeight = allBBMaxed ? 0.12 : 0.35;
    const candidates = [
      { id: 'shockwave',    weight: 2.6  },
      { id: '2x_money',     weight: 2.2  },
      { id: '2x_dmg',       weight: 2.2  },
      { id: 'gold_boss',    weight: 1.5  },
      { id: 'piercing',     weight: 0.95 },
      { id: 'speed_boost',  weight: 0.90 },
      { id: 'auto_clicker', weight: 0.85 },
      { id: 'discount',     weight: discountWeight },
      { id: 'free_upgrade', weight: freeUpgWeight },
      { id: 'gold_level',   weight: 0.05 }
    ].filter(c => {
      if (c.id === 'gold_boss' && this.nextBossIsGold) return false;
      if (c.id === 'gold_level' && (this.rebirthCount <= 15 || this.nextLevelIsGold || this.isGoldLevelActive || nowMs < (this.goldLevelCooldownUntil || 0))) return false;
      if (c.id === 'discount' && this.bbUpgrades.discount >= 5 && ((this.pirateShopCooldown || 0) > 0 || nowMs < (this.pirateShopCooldownUntil || 0))) return false;
      if (c.id === 'free_upgrade' && allBBMaxed && nowMs < (this.freeUpgradeMaxCooldownUntil || 0)) return false;
      if (c.id === 'auto_clicker' && this.bbUpgrades.autoClicker >= 1) return false;
      const active = this.activePowerUps[c.id];
      if (active && (active.mode === 'until_rebirth' || active.mode === 'forever') && c.id !== 'piercing') return false;
      return true;
    });

    if (candidates.length === 0) return;

    const totalWeight = candidates.reduce((acc, c) => acc + c.weight, 0);
    const rollDenom = Math.max(FULL_POOL_WEIGHT, totalWeight);
    let pick = Math.random() * rollDenom;
    if (pick > totalWeight) return;
    let chosenId = candidates[0].id;
    for (const c of candidates) {
      pick -= c.weight;
      if (pick <= 0) {
        chosenId = c.id;
        break;
      }
    }

    this.triggerPowerUpById(chosenId);
  }

  // --- Trigger Any Power-Up Respecting Exact BB Upgrade Levels ---
  triggerPowerUpById(id) {
    switch (id) {
      case '2x_money': {
        const lvl = this.bbUpgrades.money2x;
        if (lvl >= 5) {
          this.activatePowerUp('2x_money', '💰', '2x Pénz', 'Minden találat 2x pénzt ad a következő Rebirthig!', { mode: 'until_rebirth' });
        } else if (lvl === 4) {
          this.activatePowerUp('2x_money', '💰', '2x Pénz', 'Minden találat 2x pénzt ad 10 körön keresztül!', { mode: 'rounds', rounds: 10 });
        } else {
          const durations = [10, 25, 40, 70];
          const sec = durations[lvl] || 10;
          this.activatePowerUp('2x_money', '💰', '2x Pénz', `Minden találat és blokk 2x pénzt ad ${sec} mp-ig!`, { mode: 'timed', duration: sec });
        }
        break;
      }

      case '2x_dmg': {
        const lvl = this.bbUpgrades.dmg2x;
        if (lvl >= 5) {
          this.activatePowerUp('2x_dmg', '💥', '2x Sebzés', 'Dupla sebzés a következő Rebirthig!', { mode: 'until_rebirth' });
        } else if (lvl === 4) {
          this.activatePowerUp('2x_dmg', '💥', '2x Sebzés', 'Dupla sebzés 10 körön keresztül!', { mode: 'rounds', rounds: 10 });
        } else {
          const durations = [10, 25, 40, 70];
          const sec = durations[lvl] || 10;
          this.activatePowerUp('2x_dmg', '💥', '2x Sebzés', `Dupla sebzés minden labdára és kattintásra ${sec} mp-ig!`, { mode: 'timed', duration: sec });
        }
        break;
      }

      case 'shockwave': {
        const lvl = this.bbUpgrades.shockwave;
        const cfg = this.getShockwaveConfig(lvl);
        if (cfg.mode === 'until_rebirth') {
          this.activatePowerUp('shockwave', '🌊', 'Shock Wave', cfg.label, { mode: 'until_rebirth', extra: { dmgPerSec: cfg.dmg } });
        } else if (cfg.mode === 'rounds') {
          this.activatePowerUp('shockwave', '🌊', 'Shock Wave', cfg.label, { mode: 'rounds', rounds: cfg.rounds, extra: { dmgPerSec: cfg.dmg } });
        } else {
          this.activatePowerUp('shockwave', '🌊', 'Shock Wave', cfg.label, { mode: 'timed', duration: cfg.duration, extra: { dmgPerSec: cfg.dmg } });
        }
        break;
      }

      case 'speed_boost': {
        const lvl = this.bbUpgrades.speed;
        if (lvl >= 5) {
          this.activatePowerUp('speed_boost', '🚀', 'All Ball Speed', '2x sebesség + 2x sebzés a következő Rebirthig!', { mode: 'until_rebirth', extra: { speedMult: 2.0, dmgMult: 2.0 } });
        } else if (lvl === 4) {
          this.activatePowerUp('speed_boost', '🚀', 'All Ball Speed', '2x sebesség 10 körön keresztül!', { mode: 'rounds', rounds: 10, extra: { speedMult: 2.0, dmgMult: 1.0 } });
        } else if (lvl === 3) {
          this.activatePowerUp('speed_boost', '🚀', 'All Ball Speed', '3x sebesség + 2x sebzés 70 mp-ig!', { mode: 'timed', duration: 70, extra: { speedMult: 3.0, dmgMult: 2.0 } });
        } else if (lvl === 2) {
          this.activatePowerUp('speed_boost', '🚀', 'All Ball Speed', '2x sebesség + 2x sebzés 40 mp-ig!', { mode: 'timed', duration: 40, extra: { speedMult: 2.0, dmgMult: 2.0 } });
        } else if (lvl === 1) {
          this.activatePowerUp('speed_boost', '🚀', 'All Ball Speed', 'Minden labda 2x sebességgel mozog 30 mp-ig!', { mode: 'timed', duration: 30, extra: { speedMult: 2.0, dmgMult: 1.0 } });
        } else {
          this.activatePowerUp('speed_boost', '🚀', 'All Ball Speed', 'Minden labda 2x sebességgel mozog 20 mp-ig!', { mode: 'timed', duration: 20, extra: { speedMult: 2.0, dmgMult: 1.0 } });
        }
        break;
      }

      case 'piercing': {
        const lvl = this.bbUpgrades.piercing;
        // Lvl 0: 1x, Lvl 1: 2x, Lvl 2: 4x, Lvl 3: +1 Pierce Ball (2 db, 4x)
        // Lvl 4: 1 megtartható a Rebirthig 1x sebességgel (+1 ideiglenes ha lvl >= 3)
        // Lvl 5: külön fejleszthető Pierce Ball sebesség ($-ból)
        if (lvl >= 4) {
          const hasPerm = this.balls.some(b => b.isPiercing && b.isPermanentPierce);
          if (!hasPerm) {
            this.spawnPiercingBall({ permanent: true, speedMult: this.getPermanentPierceSpeedMult() });
          }
          // Lvl 3-ból járó extra ideiglenes Pierce Ball is jöjjön be 45 mp-re!
          this.spawnPiercingBall({ permanent: false, duration: 45, speedMult: this.getTemporaryPierceSpeedMult() });
          this.activatePowerUp('piercing', '⚡', 'Pierce Ball', '1 áttörő labda Rebirthig marad (+ extra áttörő labda 45 mp-re)!', { mode: 'until_rebirth' });
        } else {
          const count = lvl >= 3 ? 2 : 1;
          const speedMult = lvl >= 2 ? 4.0 : (lvl === 1 ? 2.0 : 1.0);
          for (let i = 0; i < count; i++) {
            this.spawnPiercingBall({ permanent: false, duration: 45, speedMult });
          }
          this.activatePowerUp('piercing', '⚡', 'Pierce Ball', `${count} db áttörő labda (${speedMult}x sebesség) 45 mp-re!`, { mode: 'timed', duration: 45 });
        }
        break;
      }

      case 'gold_boss': {
        this.nextBossIsGold = true;
        this.activatePowerUp('gold_boss', '👑', 'Gold Boss', 'A következő Boss blokk Gold Boss lesz (2x Boss pénz)!', { mode: 'until_rebirth' });
        this.showToast('👑 <strong>GOLD BOSS AKTIVÁLVA!</strong> A következő Boss dupla pénzt ad!');
        break;
      }

      case 'gold_level': {
        this.goldLevelCooldownUntil = Date.now() + 900 * 1000;
        this.nextLevelIsGold = true;
        this.activatePowerUp('gold_level', '🌟', 'Gold Level', 'A következő normál pálya minden blokkja 500–2000 HP, 20x pénz + ⭐ BB és 👑 BT jutalom lesz!', { mode: 'until_rebirth' });
        this.showToast('🌟 <strong>GOLD LEVEL BEÉLESÍTVE!</strong> A következő normál pálya 20x pénzt, plusz ⭐ BB és 👑 BT jutalmat ad!', 4500);
        break;
      }

      case 'auto_clicker': {
        const lvl = this.bbUpgrades.autoClicker;
        if (lvl >= 1) {
          this.syncPermanentPowerUps();
          if (!this.suppressAudioAndVisuals) {
            this.renderPowerUpsHUD();
            this.updateHUD();
          }
        } else {
          this.activatePowerUp('auto_clicker', '🤖', 'Auto Clicker', `Automatikusan sebez random blokkokat (${this.clickPower}/mp) 15 mp-ig!`, { mode: 'timed', duration: 15 });
        }
        break;
      }

      case 'discount': {
        const lvl = this.bbUpgrades.discount;
        if (lvl >= 5) {
          this.pirateShopCooldown = 600;
          this.pirateShopCooldownUntil = Date.now() + 600 * 1000;
          this.activatePowerUp('discount', '🏴‍☠️', 'PIRATE SHOP', 'MINDEN labda és kurzor fejlesztés INGYENES 5 mp-ig!', { mode: 'timed', duration: 5, extra: { discountPct: 100 } });
          this.showToast('🏴‍☠️ <strong>PIRATE SHOP AKTÍV (5 mp)!</strong> Minden labda és kurzor upgrade INGYENES!');
        } else {
          const configs = [
            { pct: 10, sec: 15 },
            { pct: 20, sec: 15 },
            { pct: 25, sec: 30 },
            { pct: 33, sec: 25 },
            { pct: 50, sec: 20 }
          ];
          const cfg = configs[lvl] || configs[0];
          this.activatePowerUp('discount', '🏷️', `Discount -${cfg.pct}%`, `Minden labda és kurzor fejlesztés -${cfg.pct}% áron ${cfg.sec} mp-ig!`, { mode: 'timed', duration: cfg.sec, extra: { discountPct: cfg.pct } });
        }
        this.refreshOpenModals();
        break;
      }

      case 'free_upgrade': {
        this.grantRandomFreeUpgrade();
        break;
      }
    }
  }

  grantRandomFreeUpgrade() {
    const upgradable = BB_UPGRADE_CATALOG.filter(item => (this.bbUpgrades[item.key] || 0) < 5);
    if (upgradable.length === 0) {
      this.freeUpgradeMaxCooldownUntil = Date.now() + 180 * 1000;
      this.bb += 5;
      this.showToast('🎁 <strong>INGYENES FEJLESZTÉS:</strong> Minden maxon van ➔ <span style="color:#fde047;">+5 BB!</span>');
      this.updateHUD();
      this.save();
      this.syncWalletChangeNow(true);
      return;
    }

    const chosen = upgradable[Math.floor(Math.random() * upgradable.length)];
    this.bbUpgrades[chosen.key] = (this.bbUpgrades[chosen.key] || 0) + 1;
    const newLvl = this.bbUpgrades[chosen.key];

    // Ha pont Rebirthig aktív vagy permanens szintet kapott, aktiváljuk is azonnal!
    this.onBBUpgradePurchased(chosen.key, newLvl);

    this.showToast(`🎁 <strong>INGYENES FEJLESZTÉS:</strong> ${chosen.icon} ${chosen.name} ➔ <span style="color:#2cd64e;">LVL ${newLvl}!</span>`);
    if (!this.suppressAudioAndVisuals && !document.hidden && window.soundEngine) {
      window.soundEngine.playLevelUp();
    }
    this.renderPowerUpUpgradesModal();
    this.updateHUD();
    this.renderLeaderboard();
    this.save();
  }

  activatePowerUp(id, icon, name, desc, opts = {}) {
    const mode = opts.mode || 'timed';
    this.activePowerUps[id] = {
      id,
      icon,
      name,
      desc,
      mode,
      duration: opts.duration || 0,
      maxDuration: opts.duration || 0,
      roundsLeft: opts.rounds || 0,
      maxRounds: opts.rounds || 0,
      extra: opts.extra || {}
    };

    if (!this.suppressAudioAndVisuals && !document.hidden && window.soundEngine) {
      window.soundEngine.playEffect(id);
    }
    if (!this.suppressAudioAndVisuals) {
      this.renderPowerUpsHUD();
      this.updateHUD();
    }
  }

  isPowerUpActive(id) {
    const p = this.activePowerUps[id];
    if (!p) return false;
    if (p.mode === 'until_rebirth' || p.mode === 'forever') return true;
    if (p.mode === 'rounds') return p.roundsLeft > 0;
    return p.duration > 0;
  }

  updatePowerUps(dt) {
    let changed = false;
    let discountEnded = false;

    for (const key in this.activePowerUps) {
      const p = this.activePowerUps[key];
      if (p.mode === 'timed') {
        p.duration -= dt;
        if (p.duration <= 0) {
          delete this.activePowerUps[key];
          changed = true;
          if (key === 'discount') discountEnded = true;
        }
      }
    }

    // Shockwave ticker (dinamikus intervallum & sebzés a BB upgrade alapján)
    if (this.isPowerUpActive('shockwave')) {
      const swCfg = this.getShockwaveConfig();
      this.shockwaveTimer += dt;
      if (this.shockwaveTimer >= swCfg.interval) {
        this.shockwaveTimer -= swCfg.interval;
        if (this.shockwaveTimer >= swCfg.interval) this.shockwaveTimer = 0;
        this.triggerShockwave(swCfg);
      }
    }

    // Auto Clicker ticker (1. vásárlás után örökké aktív, fejleszthető sebességgel/sebzéssel/területtel)
    if (this.isPowerUpActive('auto_clicker')) {
      const acCfg = this.getAutoClickerConfig();
      this.autoClickerTimer += dt;
      let acLoops = 0;
      while (this.autoClickerTimer >= acCfg.interval && acLoops < 5) {
        this.autoClickerTimer -= acCfg.interval;
        this.triggerAutoClickerHit(acCfg);
        acLoops++;
      }
      if (this.autoClickerTimer >= acCfg.interval) {
        this.autoClickerTimer = 0;
      }
    }

    if (!this.suppressAudioAndVisuals) {
      if (changed) {
        this.renderPowerUpsHUD();
        if (discountEnded) {
          this.updateHUD();
          this.refreshOpenModals();
        }
      } else {
        this.updatePowerUpTimerBars();
      }
    }
  }

  triggerShockwave(cfg = null) {
    const swCfg = typeof cfg === 'object' && cfg !== null
      ? cfg
      : this.getShockwaveConfig();
    const cx = this.width / 2;
    const cy = this.height / 2;
    const maxRadius = swCfg.radiusRatio >= 1.0
      ? Math.hypot(this.width, this.height) * 0.55
      : Math.min(this.width, this.height) * swCfg.radiusRatio;

    if (!this.suppressAudioAndVisuals && this.visualRings.length < 30) {
      this.visualRings.push({ x: cx, y: cy, radius: 10, maxRadius, alpha: 0.9, color: '59, 130, 246', speed: Math.max(260, maxRadius * 1.45) });
      if (swCfg.radiusRatio >= 0.8) {
        this.visualRings.push({ x: cx, y: cy, radius: 4, maxRadius: maxRadius * 0.65, alpha: 0.7, color: '56, 189, 248', speed: Math.max(200, maxRadius * 1.1) });
      }
      this.triggerScreenShake(swCfg.radiusRatio >= 0.8 ? 1.8 : 0.9, 4.0);
      if (!document.hidden && window.soundEngine) {
        window.soundEngine.playShockwave();
      }
    }

    for (const b of this.bricks) {
      if (b.hp <= 0) continue;
      const nx = Math.max(b.x, Math.min(cx, b.x + b.w));
      const ny = Math.max(b.y, Math.min(cy, b.y + b.h));
      if (Math.hypot(nx - cx, ny - cy) <= maxRadius) {
        const pctDmg = swCfg.maxHpPct ? Math.round(b.maxHp * swCfg.maxHpPct) : 0;
        this.damageBrick(b, swCfg.dmg + pctDmg, 'shockwave');
      }
    }
  }

  triggerAutoClickerHit(cfg = null) {
    const alive = this.bricks.filter(b => b.hp > 0);
    if (alive.length === 0) return;

    const acCfg = cfg || this.getAutoClickerConfig();
    this.autoClickerStrikeCount = (this.autoClickerStrikeCount || 0) + 1;

    const target = alive[Math.floor(Math.random() * alive.length)];
    const tx = target.x + target.w / 2;
    const ty = target.y + target.h / 2;
    const baseDmg = Math.max(1, Math.round(this.clickPower * acCfg.dmgMult));
    const isInstantBurst = acCfg.instantEvery > 0 && (this.autoClickerStrikeCount % acCfg.instantEvery === 0);

    if (!this.suppressAudioAndVisuals && this.visualRings.length < 30) {
      const ringRadius = acCfg.areaRadius > 0 ? acCfg.areaRadius : 28;
      this.visualRings.push({
        x: tx,
        y: ty,
        radius: 4,
        maxRadius: ringRadius,
        alpha: 0.9,
        color: isInstantBurst ? '245, 158, 11' : (acCfg.areaRadius > 0 ? '192, 132, 252' : '168, 85, 247'),
        speed: Math.max(120, ringRadius * 2.8)
      });
    }

    if (acCfg.areaRadius > 0) {
      const hitBricks = this.bricks.filter(b => {
        if (b.hp <= 0) return false;
        const nx = Math.max(b.x, Math.min(tx, b.x + b.w));
        const ny = Math.max(b.y, Math.min(ty, b.y + b.h));
        return Math.hypot(tx - nx, ty - ny) <= acCfg.areaRadius;
      });
      for (const b of hitBricks) {
        if (isInstantBurst && !b.isBoss && b === target) {
          this.damageBrick(b, b.hp, 'auto_clicker', { instantKill: true });
        } else {
          this.damageBrick(b, (isInstantBurst && b.isBoss) ? baseDmg * 2 : baseDmg, 'auto_clicker');
        }
      }
    } else {
      this.damageBrick(target, baseDmg, 'auto_clicker');
    }
  }

  // --- Poison BT Ability System (Normál blokkon NEM stackelődik, csak Boss-on!) ---
  getPoisonAbilityConfig() {
    const lvl = this.btUpgrades.poison || 0;
    if (lvl >= 3) {
      // 3. fázis (50 BT): 25 dmg / 0.3 mp, amíg a blokk el nem pusztul!
      return { dmg: 25, interval: 0.3, duration: Infinity, infinite: true, dps: 25 / 0.3 };
    }
    if (lvl === 2) {
      // 2. fázis (10 BT): 20 dmg / mp, 60 mp-ig
      return { dmg: 20, interval: 1.0, duration: 60, infinite: false, dps: 20 };
    }
    if (lvl === 1) {
      // 1. fázis (3 BT): 5 dmg / mp, 20 mp-ig
      return { dmg: 5, interval: 1.0, duration: 20, infinite: false, dps: 5 };
    }
    // Alap: 1 dmg / mp, 10 mp-ig
    return { dmg: 1, interval: 1.0, duration: 10, infinite: false, dps: 1 };
  }

  applyPoisonToBrick(brick) {
    if (!brick || brick.hp <= 0) return;
    const cfg = this.getPoisonAbilityConfig();
    const dpsLabel = cfg.interval < 1
      ? `${cfg.dmg}/${cfg.interval}s (${Math.round(cfg.dps)} dmg/s)`
      : `${cfg.dmg} dmg/s`;

    if (brick.isBoss) {
      // Boss blokkokon a méreg stackelődhet! (max 60 aktív stack a 60 FPS teljesítményért)
      if (!brick.poisonStacks) brick.poisonStacks = [];
      if (brick.poisonStacks.length >= 60) {
        brick.poisonStacks.shift();
      }
      brick.poisonStacks.push({
        dmg: cfg.dmg,
        interval: cfg.interval,
        timer: 0,
        timeLeft: cfg.duration,
        infinite: cfg.infinite,
        dps: cfg.dps
      });
      if (!this.suppressAudioAndVisuals && !document.hidden) {
        this.addFloatingText(`☠️ ${dpsLabel}`, brick.x + brick.w / 2, brick.y + brick.h * 0.25, '#a3e635');
      }
      return;
    }

    // Normál blokkon egyszerre CSAK EGY poison lehet:
    // Ha még nincs rajta, felkerül; ha már van rajta, csak akkor cserélődik le, ha az új ERŐSEBB!
    if (!brick.poison || cfg.dps > brick.poison.dps) {
      brick.poison = {
        dmg: cfg.dmg,
        interval: cfg.interval,
        timer: 0,
        timeLeft: cfg.duration,
        infinite: cfg.infinite,
        dps: cfg.dps
      };
      if (!this.suppressAudioAndVisuals && !document.hidden) {
        this.addFloatingText(`☠️ ${dpsLabel}`, brick.x + brick.w / 2, brick.y + 4, '#a3e635');
      }
    }
  }

  updateBrickPoisons(dt) {
    for (const b of this.bricks) {
      if (b.hp <= 0) continue;

      if (b.isBoss && b.poisonStacks && b.poisonStacks.length > 0) {
        for (let i = b.poisonStacks.length - 1; i >= 0; i--) {
          const st = b.poisonStacks[i];
          if (!st.infinite) {
            st.timeLeft -= dt;
          }
          st.timer += dt;
          while (st.timer >= st.interval && b.hp > 0) {
            st.timer -= st.interval;
            this.damageBrick(b, st.dmg, 'dot');
          }
          if (!st.infinite && st.timeLeft <= 0) {
            b.poisonStacks.splice(i, 1);
          }
          if (b.hp <= 0) break;
        }
      } else if (b.poison) {
        const p = b.poison;
        if (!p.infinite) {
          p.timeLeft -= dt;
        }
        p.timer += dt;
        while (p.timer >= p.interval && b.hp > 0) {
          p.timer -= p.interval;
          this.damageBrick(b, p.dmg, 'dot');
        }
        if (!p.infinite && p.timeLeft <= 0) {
          b.poison = null;
        }
      }
    }
  }

  // --- Ghostball BT Bomb System (3 BT: 10s 3x3, 20 BT: 5s 5x5, 50 BT: 1s 5x5, 1 mp múlva 50 dmg!) ---
  getGhostAbilityConfig() {
    const lvl = this.btUpgrades.ghost || 0;
    if (lvl >= 3) return { cooldown: 1.0, gridSpan: 5, fuse: 1.0, dmg: 50 };
    if (lvl === 2) return { cooldown: 5.0, gridSpan: 5, fuse: 1.0, dmg: 50 };
    if (lvl === 1) return { cooldown: 10.0, gridSpan: 3, fuse: 1.0, dmg: 50 };
    return null;
  }

  spawnGhostBomb(x, y, cfg) {
    if (this.ghostBombs.length >= 45) return; // teljesítmény védelem
    const halfW = (this.gridCellW || 60) * (cfg.gridSpan / 2);
    const halfH = (this.gridCellH || 34) * (cfg.gridSpan / 2);

    this.ghostBombs.push({
      x,
      y,
      fuse: cfg.fuse,
      maxFuse: cfg.fuse,
      gridSpan: cfg.gridSpan,
      halfW,
      halfH,
      dmg: cfg.dmg
    });
  }

  updateGhostBombs(dt) {
    for (let i = this.ghostBombs.length - 1; i >= 0; i--) {
      const bomb = this.ghostBombs[i];
      bomb.fuse -= dt;
      if (bomb.fuse <= 0) {
        // Detonate! Minden kráterben (3x3 vagy 5x5) lévő blokk kap 50 sebzést!
        const left = bomb.x - bomb.halfW;
        const right = bomb.x + bomb.halfW;
        const top = bomb.y - bomb.halfH;
        const bottom = bomb.y + bomb.halfH;

        for (const b of this.bricks) {
          if (b.hp <= 0) continue;
          const overlaps = (b.x < right && b.x + b.w > left && b.y < bottom && b.y + b.h > top);
          if (overlaps) {
            this.damageBrick(b, bomb.dmg, 'ghost');
          }
        }

        if (!this.suppressAudioAndVisuals) {
          const visR = Math.max(bomb.halfW, bomb.halfH);
          this.visualRings.push({ x: bomb.x, y: bomb.y, radius: 10, maxRadius: visR, alpha: 0.9, color: '56, 189, 248', speed: visR * 3.5 });
          this.triggerScreenShake(2.8, 5.5);
          if (!document.hidden && window.soundEngine) {
            window.soundEngine.playGhostBomb();
          }
        }
        this.ghostBombs.splice(i, 1);
      }
    }
  }

  // --- Rocket Ball Missile System (Alap: 10 mp random | 10 BT: 3 mp legközelebbi blokk homing!) ---
  findNearestBrickTo(x, y) {
    let best = null;
    let bestDist = Infinity;
    for (const b of this.bricks) {
      if (b.hp <= 0) continue;
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      const d = Math.hypot(cx - x, cy - y);
      if (d < bestDist) {
        bestDist = d;
        best = b;
      }
    }
    return best;
  }

  spawnRocketFromBall(ball, forceHoming = false) {
    if (this.rockets.length >= 80) return;
    const isHoming = forceHoming || (this.btUpgrades.rocket || 0) >= 1;
    let angle = Math.random() * Math.PI * 2;
    let target = null;

    if (isHoming) {
      target = this.findNearestBrickTo(ball.x, ball.y);
      if (target) {
        angle = Math.atan2((target.y + target.h / 2) - ball.y, (target.x + target.w / 2) - ball.x);
      }
    }

    const rocketSpeed = ball.type === 'symbiot' ? 12.0 : 9.5;
    const baseRef = (this.ballTypes[ball.type] && this.ballTypes[ball.type].basePower) || this.ballTypes.rocket.basePower;
    const powerScale = Math.max(1, ball.power / baseRef) * (ball.type === 'symbiot' ? 4.5 : 1);
    this.rockets.push({
      x: ball.x,
      y: ball.y,
      vx: Math.cos(angle) * rocketSpeed,
      vy: Math.sin(angle) * rocketSpeed,
      speed: rocketSpeed,
      directDmg: Math.round(100 * powerScale),
      ring1Dmg: Math.round(50 * powerScale),
      ring2Dmg: Math.round(20 * powerScale),
      homing: isHoming,
      target,
      life: 4.5
    });

    if (!this.suppressAudioAndVisuals && !document.hidden && window.soundEngine) {
      window.soundEngine.playRocketLaunch();
    }
  }

  updateRockets(dt) {
    const borderWidth = 18;
    const arenaLeft = borderWidth;
    const arenaRight = this.width - borderWidth;
    const arenaTop = borderWidth;
    const arenaBottom = this.height - borderWidth;

    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.life -= dt;
      if (r.life <= 0) {
        this.rockets.splice(i, 1);
        continue;
      }

      if (r.homing) {
        if (!r.target || r.target.hp <= 0) {
          r.target = this.findNearestBrickTo(r.x, r.y);
        }
        if (r.target) {
          const tx = r.target.x + r.target.w / 2;
          const ty = r.target.y + r.target.h / 2;
          const targetAngle = Math.atan2(ty - r.y, tx - r.x);
          r.vx = Math.cos(targetAngle) * r.speed;
          r.vy = Math.sin(targetAngle) * r.speed;
        }
      }

      r.x += r.vx * dt * 60;
      r.y += r.vy * dt * 60;

      // Out of bounds removal
      if (r.x < arenaLeft || r.x > arenaRight || r.y < arenaTop || r.y > arenaBottom) {
        this.rockets.splice(i, 1);
        continue;
      }

      // Brick hit check
      let exploded = false;
      for (const b of this.bricks) {
        if (b.hp <= 0) continue;
        if (r.x >= b.x - 5 && r.x <= b.x + b.w + 5 && r.y >= b.y - 5 && r.y <= b.y + b.h + 5) {
          const hcx = b.x + b.w / 2;
          const hcy = b.y + b.h / 2;
          const cellW = Math.max(24, b.isBoss ? (this.gridCellW || 60) : b.w);
          const cellH = Math.max(18, b.isBoss ? (this.gridCellH || 34) : b.h);

          // 1. Közvetlenül eltalált blokk: 100 dmg (alap)
          this.damageBrick(b, r.directDmg, 'rocket');

          // 2. Mellette lévő blokkok (1 gyűrű): 50 dmg | Amellett lévők (2. gyűrű): 20 dmg
          for (const nb of this.bricks) {
            if (nb === b || nb.hp <= 0) continue;
            const ncx = nb.x + nb.w / 2;
            const ncy = nb.y + nb.h / 2;
            const gridDx = Math.abs(ncx - hcx) / cellW;
            const gridDy = Math.abs(ncy - hcy) / cellH;
            const ringDist = Math.max(Math.round(gridDx), Math.round(gridDy));

            if (ringDist === 1) {
              this.damageBrick(nb, r.ring1Dmg, 'rocket');
            } else if (ringDist === 2) {
              this.damageBrick(nb, r.ring2Dmg, 'rocket');
            }
          }

          if (!this.suppressAudioAndVisuals) {
            this.visualRings.push({ x: r.x, y: r.y, radius: 6, maxRadius: cellW * 1.4, alpha: 0.95, color: '239, 68, 68', speed: 240 });
            this.visualRings.push({ x: r.x, y: r.y, radius: 10, maxRadius: cellW * 2.4, alpha: 0.8, color: '249, 115, 22', speed: 300 });
            this.triggerScreenShake(4.2, 6.5);
            if (!document.hidden && window.soundEngine) {
              window.soundEngine.playRocketExplosion();
            }
          }
          exploded = true;
          break;
        }
      }

      if (exploded) {
        this.rockets.splice(i, 1);
      }
    }
  }

  // --- Active Power-Ups HUD ---
  renderPowerUpsHUD() {
    const container = document.getElementById('active-powerups-container');
    if (!container) return;
    container.innerHTML = '';

    for (const key in this.activePowerUps) {
      const p = this.activePowerUps[key];
      const badge = document.createElement('div');
      const isPerm = (p.mode === 'until_rebirth' || p.mode === 'forever');
      badge.className = `powerup-hud-badge ${isPerm ? 'perm-badge' : ''}`;
      badge.id = `pu-badge-${p.id}`;

      let miniLabel = '';
      let statusLine = '';
      if (p.mode === 'forever') {
        miniLabel = '∞';
        statusLine = 'Örökké aktív (Rebirth után is megmarad!)';
      } else if (p.mode === 'until_rebirth') {
        miniLabel = '∞';
        statusLine = 'Aktív a következő Rebirthig!';
      } else if (p.mode === 'rounds') {
        miniLabel = `${p.roundsLeft}K`;
        statusLine = `Hátralévő körök: ${p.roundsLeft}`;
      } else {
        miniLabel = `${Math.ceil(p.duration)}s`;
        statusLine = `Hátralévő idő: ${Math.ceil(p.duration)}mp`;
      }

      badge.innerHTML = `
        <span>${p.icon}</span>
        <span class="powerup-mini-tag" id="pu-mini-${p.id}">${miniLabel}</span>
        <div class="powerup-timer-bar" id="pu-bar-${p.id}" style="width:${p.mode === 'timed' ? Math.max(0, (p.duration / Math.max(1, p.maxDuration)) * 100) : 100}%;"></div>
        <div class="tooltip-box">
          <strong>${p.name}</strong><br>
          ${p.desc}<br>
          <span style="color: #2cd64e;" id="pu-time-${p.id}">${statusLine}</span>
        </div>
      `;

      container.appendChild(badge);
    }
  }

  updatePowerUpTimerBars() {
    for (const key in this.activePowerUps) {
      const p = this.activePowerUps[key];
      if (p.mode !== 'timed') continue;
      const bar = document.getElementById(`pu-bar-${p.id}`);
      if (bar) {
        const pct = Math.max(0, (p.duration / Math.max(1, p.maxDuration)) * 100);
        bar.style.width = `${pct}%`;
      }
      const mini = document.getElementById(`pu-mini-${p.id}`);
      if (mini) mini.textContent = `${Math.ceil(p.duration)}s`;
      const timeEl = document.getElementById(`pu-time-${p.id}`);
      if (timeEl) timeEl.textContent = `Hátralévő idő: ${Math.ceil(p.duration)}mp`;
    }
  }

  restoreActivePowerUpVisuals() {
    // Örökös (Rebirth után is megmaradó) power-upok szinkronizálása:
    this.syncPermanentPowerUps();

    // Mentett aktív Rebirthig tartó vagy Gold Level power-upok visszatöltése:
    if (this.nextBossIsGold && !this.activePowerUps['gold_boss']) {
      this.activatePowerUp('gold_boss', '👑', 'Gold Boss', 'A következő Boss blokk Gold Boss lesz (2x Boss pénz)!', { mode: 'until_rebirth' });
    }
    if (this.nextLevelIsGold && !this.activePowerUps['gold_level']) {
      this.activatePowerUp('gold_level', '🌟', 'Gold Level', 'A következő normál pálya minden blokkja 500–2000 HP, 20x pénz + ⭐ BB és 👑 BT jutalom lesz!', { mode: 'until_rebirth' });
    }
    if (this.isGoldLevelActive && !this.activePowerUps['gold_level_active']) {
      this.activatePowerUp('gold_level_active', '🌟', 'GOLD LEVEL (20x $ + BB/BT)', '500–2000 HP, 20x pénz, aranyblokkokból BB/BT esély + teljesítéskor +15 BB & +25 BT!', { mode: 'rounds', rounds: 1 });
    }
  }

  // --- Quick Time Money (Coin Orb Event + BB Upgrades 1..5) ---
  getNextCoinSpawnDelay() {
    const qtmLvl = this.bbUpgrades.quickTimeMoney;
    // Alap: 26–44 mp | Lvl 1+: 2x gyakoriság -> 13–22 mp!
    const baseDelay = 26 + Math.random() * 18;
    return qtmLvl >= 1 ? baseDelay * 0.5 : baseDelay;
  }

  updateBonusOrb(dt, isBackground = false) {
    const qtmLvl = this.bbUpgrades.quickTimeMoney;

    // Lvl 3+: 3 percenként (180 mp) garantált coin megjelenés!
    if (qtmLvl >= 3) {
      this.guaranteedCoinTimer += dt;
      if (this.guaranteedCoinTimer >= 180) {
        this.guaranteedCoinTimer = 0;
        if (!this.bonusOrb) {
          this.spawnBonusOrb();
        }
      }
    }

    if (this.bonusOrb) {
      this.bonusOrb.lifetime -= dt;
      this.bonusOrb.radius = Math.max(3, this.bonusOrb.maxRadius * (this.bonusOrb.lifetime / this.bonusOrb.maxLifetime));

      // Lvl 4+: automatikus begyűjtés 0.7 mp megjelenés után (háttérben is begyűjti!)
      if (qtmLvl >= 4 && (this.bonusOrb.maxLifetime - this.bonusOrb.lifetime >= 0.7 || isBackground)) {
        this.collectBonusOrb(true);
        return;
      }

      if (this.bonusOrb.lifetime <= 0) {
        this.bonusOrb = null;
        this.nextBonusOrbTime = this.getNextCoinSpawnDelay();
      }
    } else {
      // Ha lvl 4+ (auto-collect), háttérben is gyűjthet; különben csak látható lapon jelenjen meg
      if (!isBackground || qtmLvl >= 4) {
        this.nextBonusOrbTime -= dt;
        if (this.nextBonusOrbTime <= 0) {
          this.spawnBonusOrb();
        }
      }
    }
  }

  spawnBonusOrb() {
    const padding = 65;
    const x = padding + Math.random() * Math.max(40, this.width - padding * 2);
    const y = padding + Math.random() * Math.max(40, this.height - padding * 2);
    const maxRadius = 24;

    const qtmLvl = this.bbUpgrades.quickTimeMoney;
    let rewardMult = 1;
    if (qtmLvl >= 2) rewardMult = 4;
    else if (qtmLvl >= 1) rewardMult = 2;

    const value = Math.round(100 * this.rebirthMultiplier * (1 + this.level * 0.12) * rewardMult);

    this.bonusOrb = {
      x,
      y,
      radius: maxRadius,
      maxRadius,
      lifetime: 5.0,
      maxLifetime: 5.0,
      value
    };
  }

  collectBonusOrb(isAuto = false) {
    if (!this.bonusOrb) return false;
    const orb = this.bonusOrb;
    const qtmLvl = this.bbUpgrades.quickTimeMoney;

    const reward = orb.value * (this.isPowerUpActive('2x_money') ? 2 : 1);
    this.money += reward;

    let bbBonusText = '';
    if (qtmLvl >= 5) {
      const bbGain = 1; // Fix +1 BB minden begyűjtött coin után!
      this.bb += bbGain;
      bbBonusText = ` +${bbGain} BB ⭐`;
      this.syncWalletChangeNow(false);
    }

    if (!this.suppressAudioAndVisuals && !document.hidden) {
      const tag = isAuto ? 'AUTO COIN' : 'COIN';
      this.addFloatingText(`${tag}: +$${this.formatNumber(reward)}${bbBonusText}`, orb.x, orb.y);
      if (window.soundEngine) window.soundEngine.playCoin();
    }

    this.bonusOrb = null;
    this.nextBonusOrbTime = this.getNextCoinSpawnDelay();
    this.guaranteedCoinTimer = 0;

    if (!this.suppressAudioAndVisuals) {
      this.updateHUD();
      this.refreshOpenModals();
    }
    return true;
  }

  clickBonusOrb(clickX, clickY) {
    if (!this.bonusOrb) return false;
    const dist = Math.hypot(clickX - this.bonusOrb.x, clickY - this.bonusOrb.y);
    if (dist <= Math.max(this.bonusOrb.radius + 6, 22)) {
      return this.collectBonusOrb(false);
    }
    return false;
  }

  // --- Rebirth Ball Slot Limits (0-3: 15, 4-6: 25, 7-15: 35, 15 után (16+): 50 max!) ---
  getMaxBalls(rebirthCount = this.rebirthCount) {
    if (rebirthCount > 15) return 50;
    if (rebirthCount > 6) return 35;
    if (rebirthCount > 3) return 25;
    return 15;
  }

  getMaxBallTypeLimit(typeKey) {
    if (typeKey === 'multiply') {
      return this.MAX_MULTIPLY_BALLS;
    }
    if (typeKey === 'ghost') {
      return this.MAX_GHOST_BALLS;
    }
    if (typeKey === 'rocket') {
      return this.MAX_ROCKET_BALLS;
    }
    if (typeKey === 'symbiot') {
      return this.MAX_SYMBIOT_BALLS;
    }
    if (typeKey === 'coin') {
      return this.MAX_COIN_BALLS;
    }
    return null;
  }

  // --- Ball Purchase, Spawning & Stats ---
  getBallSpeed(typeKey) {
    const b = this.ballTypes[typeKey];
    const base = this.BASE_SPEED * b.speedFactor;
    if (typeKey === 'coin') {
      return base + (b.speedLevel - 1) * 0.32;
    }
    return base + (b.speedLevel - 1) * (0.35 * Math.max(0.6, b.speedFactor));
  }

  getBallSpeedStep(typeKey) {
    const b = this.ballTypes[typeKey];
    if (typeKey === 'coin') return 0.32;
    return 0.35 * Math.max(0.6, b.speedFactor);
  }

  getBallPower(typeKey) {
    if (typeKey === 'coin') return 1;
    const b = this.ballTypes[typeKey];
    return b.basePower + (b.powerLevel - 1) * b.powerStep;
  }

  getCoinBallRewardPerHit() {
    return Math.min(55, Math.max(1, this.ballTypes.coin?.powerLevel || 1));
  }

  getCoinBallTokenThresholds() {
    const lvl = this.btUpgrades.coin || 0;
    if (lvl >= 2) return { btHits: 666, bbHits: 1850 };
    if (lvl >= 1) return { btHits: 888, bbHits: 2500 };
    return null;
  }

  getBallCost(typeKey) {
    const b = this.ballTypes[typeKey];
    const raw = Math.round(b.baseCost * Math.pow(b.costMult, b.count));
    return this.applyDiscount(raw);
  }

  buyBall(typeKey) {
    // Típusonkénti egyedi limit ellenőrzése (Ghost: 40, Multiply: 15 vagy 100-as keretnél 25!)
    const typeLimit = this.getMaxBallTypeLimit(typeKey);
    if (typeLimit !== null && this.ballTypes[typeKey].count >= typeLimit) {
      return;
    }

    const cost = this.getBallCost(typeKey);
    if (this.money >= cost && this.getTotalBalls() < this.getMaxBalls()) {
      this.money -= cost;
      this.ballTypes[typeKey].count++;

      this.spawnBall(typeKey);

      if (window.soundEngine) window.soundEngine.playCoin();
      this.updateHUD();
      this.renderUpgradesMenu();
      this.renderBattlePass();
      this.save();
      if (this.cloud && this.cloud.currentUser) this.cloud.scheduleLiveCloudSync(1200);
    }
  }

  spawnBall(typeKey) {
    const bDef = this.ballTypes[typeKey];
    const borderWidth = 22;
    const x = this.width / 2 + (Math.random() * 60 - 30);
    const y = this.height - borderWidth - 18;

    const angle = -(Math.PI * 0.25 + Math.random() * Math.PI * 0.5);
    const speed = this.getBallSpeed(typeKey);
    const power = this.getBallPower(typeKey);

    this.balls.push({
      type: typeKey,
      color: bDef.color,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: bDef.radius,
      power,
      speed,
      isPiercing: false,
      isSplitChild: false,
      splitTier: 0,
      splitCooldown: 0,
      ghostHitSet: (typeKey === 'ghost' || typeKey === 'symbiot') ? new Set() : null,
      ghostBombTimer: 0,
      rocketTimer: 0
    });
  }

  // Multiply Ball Split (BT fejleszthető: Alap 2 -> 3 BT: 4 -> 20 BT: 8 -> 50 BT: 16; minden osztódott 5 mp-ig él!)
  getMultiplyMaxSplitTier() {
    return 1 + (this.btUpgrades.multiply || 0);
  }

  spawnMultiplyChildren(parentBall) {
    const isSym = parentBall.type === 'symbiot';
    const maxTier = isSym ? Math.max(3, this.getMultiplyMaxSplitTier()) : this.getMultiplyMaxSplitTier();
    const nextTier = (parentBall.splitTier || 0) + 1;
    if (nextTier > maxTier) return;

    // Performance cap: max 160 active multiply/symbiot mini-balls
    const currentChildren = this.balls.filter(b => b.isSplitChild).length;
    if (currentChildren >= 160) return;

    const baseType = isSym ? 'symbiot' : 'multiply';
    const bDef = this.ballTypes[baseType];
    const powerScale = this.getBallPower(baseType) / bDef.basePower;
    const tierBaseDamages = isSym ? [180, 110, 65, 35, 20] : [10, 5, 2, 1, 0.5];
    const tierRadii = isSym ? [9.5, 7.5, 6.0, 4.8, 3.8] : [9.0, 6.8, 5.4, 4.3, 3.4];
    const tierColors = isSym
      ? ['#18181b', '#7e22ce', '#dc2626', '#c084fc', '#fca5a5']
      : ['#d900b8', '#f038d0', '#ff70e5', '#ffb8f2', '#ffe0fa'];
    const childDmg = (tierBaseDamages[nextTier] ?? (isSym ? 20 : 0.5)) * powerScale;
    const childSpeed = this.getBallSpeed(baseType) * (1 + nextTier * 0.06);

    const baseAngle = Math.atan2(parentBall.vy, parentBall.vx);
    const offsets = [-0.45, 0.45];

    for (const off of offsets) {
      const a = baseAngle + off;
      this.balls.push({
        type: baseType,
        color: tierColors[nextTier] || (isSym ? '#c084fc' : '#ffe0fa'),
        x: parentBall.x,
        y: parentBall.y,
        vx: Math.cos(a) * childSpeed,
        vy: Math.sin(a) * childSpeed,
        radius: tierRadii[nextTier] || 3.4,
        power: childDmg,
        speed: childSpeed,
        isPiercing: false,
        isSplitChild: true,
        splitTier: nextTier,
        hasSplit: false,
        ghostHitSet: isSym ? new Set() : null,
        timeLeft: 5.0 // 5 másodperc múlva eltűnnek az osztódások!
      });
    }

    if (!this.suppressAudioAndVisuals && !document.hidden && window.soundEngine) {
      window.soundEngine.playMultiplySplit();
    }
  }

  // Pierce Ball Speed Helpers
  getPermanentPierceSpeedMult() {
    // Lvl 4: 1x alapra áll vissza; Lvl 5: külön fejleszthető ($-ból) +0.5x szintenként!
    return 1.0 + this.pierceSpeedUpgradeLevel * 0.5;
  }

  getTemporaryPierceSpeedMult() {
    const lvl = this.bbUpgrades.piercing;
    const base = lvl >= 2 ? 4.0 : (lvl === 1 ? 2.0 : 1.0);
    return base + this.pierceSpeedUpgradeLevel * 0.5;
  }

  spawnPiercingBall({ permanent = false, duration = 45, speedMult = 1.0 } = {}) {
    const borderWidth = 22;
    const x = this.width / 2 + (Math.random() * 40 - 20);
    const y = this.height - borderWidth - 24;
    const angle = -(Math.PI * 0.25 + Math.random() * Math.PI * 0.5);
    const speed = 5.0 * speedMult;

    this.balls.push({
      type: 'piercing_special',
      color: '#ffffff',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 8.5,
      power: 999999,
      speed,
      isPiercing: true,
      isPermanentPierce: permanent,
      isSplitChild: false,
      timeLeft: permanent ? Infinity : duration
    });
  }

  deleteBall(typeKey) {
    const bDef = this.ballTypes[typeKey];
    if (bDef.count > 0) {
      bDef.count--;
      const idx = this.balls.findIndex(b => b.type === typeKey && !b.isPiercing && !b.isSplitChild);
      if (idx !== -1) this.balls.splice(idx, 1);
      this.updateHUD();
      this.renderUpgradesMenu();
      this.renderBattlePass();
      this.save();
      if (this.cloud && this.cloud.currentUser) this.cloud.scheduleLiveCloudSync(1200);
    }
  }

  getTotalBalls() {
    // Csak a megvásárolt alaplabdák számítanak a labdaférőhelybe
    return this.balls.filter(b => !b.isPiercing && !b.isSplitChild).length;
  }

  // --- $ Upgrades (Speed, Power, Click, Pierce Speed) ---
  getSpeedUpgradeCost(typeKey) {
    const b = this.ballTypes[typeKey];
    const raw = Math.round(b.speedBaseCost * Math.pow(1.22, b.speedLevel - 1));
    return this.applyDiscount(raw);
  }

  getPowerUpgradeCost(typeKey) {
    const b = this.ballTypes[typeKey];
    const mult = (typeKey === 'coin') ? 1.18 : 1.25;
    const raw = Math.round(b.powerBaseCost * Math.pow(mult, b.powerLevel - 1));
    return this.applyDiscount(raw);
  }

  getClickUpgradeCost() {
    const raw = Math.round(50 * Math.pow(1.3, this.clickUpgradeLevel - 1));
    return this.applyDiscount(raw);
  }

  getPierceSpeedUpgradeCost() {
    const idx = this.pierceSpeedUpgradeLevel;
    let raw;
    if (idx < PIERCE_SPEED_COSTS.length) {
      raw = PIERCE_SPEED_COSTS[idx];
    } else {
      raw = Math.round(PIERCE_SPEED_COSTS[PIERCE_SPEED_COSTS.length - 1] * Math.pow(1.5, idx - PIERCE_SPEED_COSTS.length + 1));
    }
    return this.applyDiscount(raw);
  }

  upgradeBallSpeed(typeKey) {
    const bDef = this.ballTypes[typeKey];
    if (bDef.speedLevel >= bDef.maxSpeedLevel) return;
    const cost = this.getSpeedUpgradeCost(typeKey);
    if (this.money >= cost) {
      this.money -= cost;
      bDef.speedLevel++;

      const newSpeed = this.getBallSpeed(typeKey);
      this.balls.forEach(ball => {
        if (ball.type === typeKey && !ball.isPiercing) {
          const mult = ball.isSplitChild ? (1 + (ball.splitTier || 0) * 0.06) : 1;
          const targetSpd = newSpeed * mult;
          const angle = Math.atan2(ball.vy, ball.vx);
          ball.speed = targetSpd;
          ball.vx = Math.cos(angle) * targetSpd;
          ball.vy = Math.sin(angle) * targetSpd;
        }
      });

      if (window.soundEngine) window.soundEngine.playCoin();
      this.updateHUD();
      this.renderUpgradesMenu();
      this.renderBattlePass();
      this.save();
      if (this.cloud && this.cloud.currentUser) this.cloud.scheduleLiveCloudSync(1200);
    }
  }

  upgradeBallPower(typeKey) {
    const bDef = this.ballTypes[typeKey];
    if (bDef.powerLevel >= bDef.maxPowerLevel) return;
    const cost = this.getPowerUpgradeCost(typeKey);
    if (this.money >= cost) {
      this.money -= cost;
      bDef.powerLevel++;

      const newPower = this.getBallPower(typeKey);
      const multScale = newPower / bDef.basePower;
      const tierBaseDamages = typeKey === 'symbiot' ? [180, 110, 65, 35, 20] : [10, 5, 2, 1, 0.5];

      this.balls.forEach(ball => {
        if (ball.type === typeKey && !ball.isPiercing) {
          if (ball.isSplitChild) {
            ball.power = (tierBaseDamages[ball.splitTier] ?? (typeKey === 'symbiot' ? 20 : 0.5)) * multScale;
          } else {
            ball.power = newPower;
          }
        }
      });

      if (window.soundEngine) window.soundEngine.playCoin();
      this.updateHUD();
      this.renderUpgradesMenu();
      this.renderBattlePass();
      this.save();
      if (this.cloud && this.cloud.currentUser) this.cloud.scheduleLiveCloudSync(1200);
    }
  }

  upgradeClick() {
    if (this.clickUpgradeLevel >= this.MAX_CLICK_LEVEL) return;
    const cost = this.getClickUpgradeCost();
    if (this.money >= cost) {
      this.money -= cost;
      this.clickUpgradeLevel++;
      this.clickPower = this.clickUpgradeLevel;

      if (window.soundEngine) window.soundEngine.playCoin();
      this.updateHUD();
      this.renderUpgradesMenu();
      this.save();
      if (this.cloud && this.cloud.currentUser) this.cloud.scheduleLiveCloudSync(1200);
    }
  }

  upgradePierceSpeed() {
    if (this.bbUpgrades.piercing < 5) return;
    if (this.pierceSpeedUpgradeLevel >= this.MAX_PIERCE_SPEED_LEVEL) return;
    const cost = this.getPierceSpeedUpgradeCost();
    if (this.money >= cost) {
      this.money -= cost;
      this.pierceSpeedUpgradeLevel++;

      // Frissítjük az aktív Pierce Ballok sebességét azonnal
      this.balls.forEach(ball => {
        if (ball.isPiercing) {
          const mult = ball.isPermanentPierce ? this.getPermanentPierceSpeedMult() : this.getTemporaryPierceSpeedMult();
          const newSpd = 5.0 * mult;
          const angle = Math.atan2(ball.vy, ball.vx);
          ball.speed = newSpd;
          ball.vx = Math.cos(angle) * newSpd;
          ball.vy = Math.sin(angle) * newSpd;
        }
      });

      if (window.soundEngine) window.soundEngine.playCoin();
      this.updateHUD();
      this.renderUpgradesMenu();
      this.save();
      if (this.cloud && this.cloud.currentUser) this.cloud.scheduleLiveCloudSync(1200);
    }
  }

  // --- BB Upgrade Purchase System (1, 3, 5, 7, 10 BB) ---
  getBBUpgradeCost(key) {
    const lvl = this.bbUpgrades[key] || 0;
    if (lvl >= 5) return null;
    return BB_UPGRADE_COSTS[lvl];
  }

  buyBBUpgrade(key) {
    const currentLvl = this.bbUpgrades[key] || 0;
    if (currentLvl >= 5) return; // Max szintet nem lehet túlvásárolni!

    const cost = BB_UPGRADE_COSTS[currentLvl];
    if (this.bb < cost) return; // Mindig ellenőrizzük az egyenleget!

    this.bb -= cost;
    this.bbUpgrades[key] = currentLvl + 1;

    this.onBBUpgradePurchased(key, this.bbUpgrades[key]);

    if (window.soundEngine) window.soundEngine.playLevelUp();
    this.updateHUD();
    this.renderPowerUpUpgradesModal();
    this.renderUpgradesMenu();
    this.save();
    this.syncWalletChangeNow(true);
    if (this.cloud) this.cloud.saveToCloud(false);
  }

  onBBUpgradePurchased(key, newLvl) {
    // Ha a játékos most érte el a Rebirthig tartósan / örökké aktív szintet, azonnal aktiváljuk/frissítsük!
    if (key === 'autoClicker' && newLvl >= 1) {
      this.syncPermanentPowerUps();
      if (!this.suppressAudioAndVisuals) {
        this.renderPowerUpsHUD();
        if (newLvl === 1) {
          this.showToast('🤖 <strong>AUTO CLICKER FELOLDVA ÖRÖKRE!</strong> Vásárlás után örökké aktív marad (Rebirth után is)!', 4500);
        }
      }
    } else if (key === 'shockwave' && (newLvl === 5 || this.isPowerUpActive('shockwave'))) {
      this.triggerPowerUpById('shockwave');
    } else if (key === 'money2x' && newLvl === 5) {
      this.triggerPowerUpById('2x_money');
    } else if (key === 'dmg2x' && newLvl === 5) {
      this.triggerPowerUpById('2x_dmg');
    } else if (key === 'speed' && newLvl === 5) {
      this.triggerPowerUpById('speed_boost');
    } else if (key === 'piercing' && newLvl === 4) {
      const hasPerm = this.balls.some(b => b.isPiercing && b.isPermanentPierce);
      if (!hasPerm) {
        this.spawnPiercingBall({ permanent: true, speedMult: this.getPermanentPierceSpeedMult() });
      }
      this.activatePowerUp('piercing', '⚡', 'Pierce Ball', '1 áttörő labda Rebirthig aktív (1x sebesség)!', { mode: 'until_rebirth' });
    }
  }

  // --- BT Ball Ability Upgrade System (Boss Tokenből vásárolható, Rebirth után is megmarad!) ---
  getBTAbilityCatalogItem(key) {
    return BT_ABILITY_CATALOG.find(item => item.key === key) || null;
  }

  isBallBaseMaxed(key) {
    const b = this.ballTypes[key];
    if (!b) return false;
    return b.speedLevel >= b.maxSpeedLevel && b.powerLevel >= b.maxPowerLevel;
  }

  buyBTAbilityUpgrade(key) {
    const item = this.getBTAbilityCatalogItem(key);
    if (!item) return;

    // Csak akkor lehet BT fejlesztést venni a labdára, ha az összes alap fejlesztése (Speed & Power) ki van maxolva!
    if (!this.isBallBaseMaxed(key)) return;

    const currentLvl = this.btUpgrades[key] || 0;
    if (currentLvl >= item.costs.length) return; // Max szint!

    const cost = item.costs[currentLvl];
    if (this.bossTokens < cost) return; // Egyenleg ellenőrzés!

    this.bossTokens -= cost;
    this.btUpgrades[key] = currentLvl + 1;

    if (window.soundEngine) window.soundEngine.playLevelUp();
    this.showToast(`👑 <strong>${item.icon} ${item.name}</strong> ➔ <span style="color:#fde047;">Phase ${this.btUpgrades[key]} feloldva!</span>`, 3500);
    this.updateHUD();
    this.renderPowerUpUpgradesModal();
    this.renderUpgradesMenu();
    this.save();
    this.syncWalletChangeNow(true);
    if (this.cloud) this.cloud.saveToCloud(false);
  }

  // --- Rebirth System ---
  getRebirthMultiplier(rebirthCount = this.rebirthCount) {
    const r = Math.max(0, Number(rebirthCount) || 0);
    if (r <= 20) return Math.pow(1.15, r);
    return Math.pow(1.15, 20) * Math.pow(1.05, r - 20);
  }

  getLateGameHpMultiplier(rebirthCount = this.rebirthCount) {
    const r = Math.max(0, Number(rebirthCount) || 0);
    if (r <= 20) return 1.0;
    return Math.pow(1.10, r - 20);
  }

  getPowerUpDropChancePercent(rebirthCount = this.rebirthCount) {
    const cappedR = Math.min(25, Math.max(0, Number(rebirthCount) || 0));
    return (100 / 800) + (cappedR * 0.005);
  }

  getRequiredRebirthLevel(rebirthCount = this.rebirthCount) {
    const r = Math.max(0, Number(rebirthCount) || 0);
    if (r < 20) return (r + 1) * 25;
    return 500 + (r - 19) * 35;
  }

  canRebirth() {
    return this.level >= this.getRequiredRebirthLevel();
  }

  executeRebirth() {
    if (!this.canRebirth()) return;

    this.rebirthCount++;
    this.rebirthMultiplier = this.getRebirthMultiplier(); // +15% pénz / rebirth
    this.bb += 1;

    // Reset run progress completely back to level 1
    // (BB valuta, Boss Tokenek, BB/BT fejlesztések és a megnövekedett labdaférőhely MEGMARADNAK!)
    this.level = 1;
    this.money = 0;
    this.balls = [];
    this.activePowerUps = {};
    this.nextBossIsGold = false;
    this.nextLevelIsGold = false;
    this.isGoldLevelActive = false;
    this.bonusOrb = null;
    this.visualRings = [];
    this.bossSparks = [];
    this.debrisParticles = []; // Color-matched brick destruction particle debris
    this.ghostBombs = [];
    this.rockets = [];
    this.floatingTexts = [];
    this.shockwaveTimer = 0;
    this.autoClickerTimer = 0;
    this.autoClickerStrikeCount = 0;
    this.isPointerDown = false;
    this.holdDamageTimer = 0;
    this.pierceSpeedUpgradeLevel = 0;

    for (const key in this.ballTypes) {
      this.ballTypes[key].count = 0;
      this.ballTypes[key].speedLevel = 1;
      this.ballTypes[key].powerLevel = 1;
    }
    this.clickUpgradeLevel = 1;
    this.clickPower = 1;
    this.screenShake = 0;

    // Az örökös BB fejlesztések (pl. Auto Clicker lvl 1+) Rebirth után is azonnal aktívak!
    this.syncPermanentPowerUps();

    this.generateLevel(1);
    this.renderPowerUpsHUD();

    if (window.soundEngine) window.soundEngine.playPrestige();
    this.save();
    this.updateHUD();
    this.refreshOpenModals();
    this.renderLeaderboard();
    this.renderBattlePass();
    this.broadcastMyStatus(); // Valós idejű Rebirth szinkron a ranglistán
    if (this.cloud) {
      this.cloud.syncLeaderboardToCloud(true);
      this.cloud.saveToCloud(true);
    }
    this.showToast(`🔄 <strong>REBIRTH #${this.rebirthCount} SIKERES!</strong> +1 ⭐ BB | Szorzó: ${this.rebirthMultiplier.toFixed(2)}x | Max labda: ${this.getMaxBalls()}`, 5000);
  }

  // --- Impact Arena Micro-Shake & Floating Combat Texts ---
  triggerScreenShake(intensity = 2.5, cap = 6.5) {
    if (this.suppressAudioAndVisuals || document.hidden || (this.prefs && !this.prefs.screenShake)) return;
    this.screenShake = Math.min(cap, Math.max(this.screenShake || 0, intensity));
  }

  addFloatingText(txt, x, y, color = '#2cd64e') {
    if (this.prefs && !this.prefs.floatingNumbers) return;
    if (this.floatingTexts.length > 32) this.floatingTexts.shift();
    this.floatingTexts.push({
      text: txt,
      x: x + (Math.random() * 12 - 6),
      y,
      alpha: 1.0,
      vy: -1.3,
      color
    });
  }

  showToast(htmlMsg, durationMs = 5500) {
    const toast = document.getElementById('offline-toast');
    if (!toast) return;
    toast.innerHTML = htmlMsg;
    toast.classList.add('show');
    clearTimeout(this.offlineToastTimer);
    this.offlineToastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, durationMs);
  }

  // --- Click Damage & BB Click Upgrades (1..5) ---
  performClickAt(clickX, clickY, isHoldTick = false) {
    // 1. Check Bonus Coin Orb first (only on real click, not hold)
    if (!isHoldTick && this.clickBonusOrb(clickX, clickY)) {
      return;
    }

    const clickUpgLvl = this.bbUpgrades.click;

    // Lucky Strike crit check (5% + 1% per rebirth)
    let dmg = this.clickPower;
    const luckyChance = 0.05 + (this.rebirthCount * 0.01);
    let isCrit = false;
    if (Math.random() < luckyChance) {
      dmg *= 5;
      isCrit = true;
    }

    // Lvl 5: Random Block Destruction — bárhova kattintva azonnal töröl véletlenszerű blokkokat!
    if (clickUpgLvl >= 5 && !isHoldTick) {
      const aliveNormal = this.bricks.filter(b => b.hp > 0 && !b.isBoss);
      if (aliveNormal.length > 0) {
        const destroyCount = Math.min(3, aliveNormal.length);
        for (let k = 0; k < destroyCount; k++) {
          const pool = this.bricks.filter(b => b.hp > 0 && !b.isBoss);
          if (pool.length === 0) break;
          const target = pool[Math.floor(Math.random() * pool.length)];
          if (!this.suppressAudioAndVisuals) {
            this.visualRings.push({ x: target.x + target.w / 2, y: target.y + target.h / 2, radius: 4, maxRadius: 34, alpha: 0.95, color: '245, 158, 11', speed: 150 });
          }
          this.damageBrick(target, target.hp, 'click', { instantKill: true });
        }
      } else {
        // Ha csak Boss van a pályán, a kattintás bárhol sebzi a Bosst!
        const boss = this.bricks.find(b => b.hp > 0 && b.isBoss);
        if (boss) {
          this.damageBrick(boss, dmg * 2, 'click');
        }
      }
    }

    // Direct / Area Damage check
    if (clickUpgLvl >= 1) {
      // Lvl 1: Area Damage (68px), Lvl 2+: Larger Area (135px)
      const areaRadius = clickUpgLvl >= 2 ? 135 : 68;
      let hitAny = false;

      for (const b of this.bricks) {
        if (b.hp <= 0) continue;
        const cx = Math.max(b.x, Math.min(clickX, b.x + b.w));
        const cy = Math.max(b.y, Math.min(clickY, b.y + b.h));
        if (Math.hypot(clickX - cx, clickY - cy) <= areaRadius) {
          this.damageBrick(b, dmg, 'click');
          hitAny = true;
        }
      }

      if (hitAny && !this.suppressAudioAndVisuals) {
        this.visualRings.push({ x: clickX, y: clickY, radius: 8, maxRadius: areaRadius, alpha: 0.75, color: '239, 68, 68', speed: areaRadius * 3 });
        if (isCrit) this.addFloatingText('💥 LUCKY STRIKE!', clickX, clickY - 16);
      }
    } else {
      // Base single-brick click
      for (let i = this.bricks.length - 1; i >= 0; i--) {
        const b = this.bricks[i];
        if (b.hp <= 0) continue;
        if (clickX >= b.x && clickX <= b.x + b.w && clickY >= b.y && clickY <= b.y + b.h) {
          if (isCrit) this.addFloatingText('💥 LUCKY STRIKE!', clickX, clickY - 16);
          this.damageBrick(b, dmg, 'click');
          break;
        }
      }
    }
  }

  // --- Background Tab & Offline Progression Runner ---
  startBackgroundRunner() {
    try {
      const workerCode = `setInterval(() => { postMessage('tick'); }, 250);`;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      this.bgWorker = new Worker(workerUrl);
      this.bgWorker.onmessage = () => {
        if (document.hidden) {
          this.advanceByElapsedTime(true);
        }
      };
    } catch (e) {
      this.bgWorker = null;
    }

    this.bgInterval = setInterval(() => {
      if (document.hidden) {
        this.advanceByElapsedTime(true);
      }
    }, 500);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isPointerDown = false;
        this.save();
      } else {
        this.advanceByElapsedTime(true);
        this.renderPowerUpsHUD();
        this.updateHUD();
        this.render();
      }
    });

    window.addEventListener('beforeunload', () => this.save());
    window.addEventListener('pagehide', () => this.save());
  }

  // --- Rebirth Milestones Automation (Auto-Click / Auto-Upgrade / Auto-Buy Balls) ---
  tickRebirthAutomation(dt) {
    const prefs = this.prefs || {};
    if (this.rebirthCount >= 3 && prefs.autoClickMs) {
      this._autoClickMsTimer = (this._autoClickMsTimer || 0) + dt;
      if (this._autoClickMsTimer >= 1.0) {
        this._autoClickMsTimer = 0;
        const alive = this.bricks.filter(b => b.hp > 0);
        if (alive.length > 0) {
          const target = alive[Math.floor(Math.random() * alive.length)];
          this.performClickAt(target.x + target.w / 2, target.y + target.h / 2, false);
        }
      }
    }

    if (this.rebirthCount >= 5 && prefs.autoUpgrade) {
      this._autoUpgradeTimer = (this._autoUpgradeTimer || 0) + dt;
      if (this._autoUpgradeTimer >= 0.9) {
        this._autoUpgradeTimer = 0;
        let best = null;
        for (const key in this.ballTypes) {
          const b = this.ballTypes[key];
          if (b.count <= 0) continue;
          if (b.speedLevel < b.maxSpeedLevel) {
            const c = this.getSpeedUpgradeCost(key);
            if (this.money >= c && (!best || c < best.cost)) best = { kind: 'spd', key, cost: c };
          }
          if (b.powerLevel < b.maxPowerLevel) {
            const c = this.getPowerUpgradeCost(key);
            if (this.money >= c && (!best || c < best.cost)) best = { kind: 'pwr', key, cost: c };
          }
        }
        if (this.clickUpgradeLevel < this.MAX_CLICK_LEVEL) {
          const c = this.getClickUpgradeCost();
          if (this.money >= c && (!best || c < best.cost)) best = { kind: 'click', key: null, cost: c };
        }
        if (best) {
          if (best.kind === 'spd') this.upgradeBallSpeed(best.key);
          else if (best.kind === 'pwr') this.upgradeBallPower(best.key);
          else if (best.kind === 'click') this.upgradeClick();
        }
      }
    }

    if (this.rebirthCount >= 10 && prefs.autoBuyBalls) {
      this._autoBuyBallsTimer = (this._autoBuyBallsTimer || 0) + dt;
      if (this._autoBuyBallsTimer >= 1.1) {
        this._autoBuyBallsTimer = 0;
        if (this.getTotalBalls() < this.getMaxBalls()) {
          const keys = Object.keys(this.ballTypes).reverse();
          for (const key of keys) {
            const b = this.ballTypes[key];
            const limit = this.getMaxBallTypeLimit(key);
            if (limit !== null && b.count >= limit) continue;
            const cost = this.getBallCost(key);
            if (this.money >= cost) {
              this.buyBall(key);
              break;
            }
          }
        }
      }
    }
  }

  // --- Core Simulation Step ---
  stepSimulation(dt, isBackground = false) {
    if (this.isMaintenanceBlocked()) return;
    this.animTime += dt;

    // 1. Update Power-ups (Shockwave, Auto Clicker, Timers)
    this.updatePowerUps(dt);

    // 2. Update Quick Time Money Coin Orb
    this.updateBonusOrb(dt, isBackground);

    // 3. Hold-to-Damage (Click BB Level 3 = 1.0s, Level 4+ = 0.5s)
    if (!isBackground && this.isPointerDown && this.bbUpgrades.click >= 3) {
      const interval = this.bbUpgrades.click >= 4 ? 0.5 : 1.0;
      this.holdDamageTimer += dt;
      if (this.holdDamageTimer >= interval) {
        this.holdDamageTimer -= interval;
        this.performClickAt(this.pointerX, this.pointerY, true);
      }
    }

    // 4. Update Brick Poisons, Ghost Bombs & Flying Rockets
    this.updateBrickPoisons(dt);
    this.updateGhostBombs(dt);
    this.updateRockets(dt);

    // 5. Update Balls
    this.updateBalls(dt);

    // 6. Update Bricks & Visual Effects
    if (!this.suppressAudioAndVisuals) {
      if (this.screenShake > 0) {
        this.screenShake = Math.max(0, this.screenShake - dt * 28);
      }
      for (const b of this.bricks) {
        if (b.flash > 0) b.flash -= dt;
        if (b.shake > 0) b.shake = Math.max(0, b.shake - dt * 18);
        if (b.hp > 0 && b.specialType === 'regen' && b.hp < b.maxHp) {
          if ((b.regenDelay || 0) > 0) {
            b.regenDelay = Math.max(0, b.regenDelay - dt);
          } else {
            b.hp = Math.min(b.maxHp, b.hp + b.maxHp * 0.04 * dt);
          }
        }
      }

      if (!isBackground) {
        this.tickRebirthAutomation(dt);
      }

      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 1.8 * dt;
        if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
      }

      for (let i = this.visualRings.length - 1; i >= 0; i--) {
        const ring = this.visualRings[i];
        ring.radius += (ring.speed || 220) * dt;
        ring.alpha = Math.max(0, 1 - (ring.radius / ring.maxRadius));
        if (ring.radius >= ring.maxRadius || ring.alpha <= 0) {
          this.visualRings.splice(i, 1);
        }
      }

      for (let i = this.bossSparks.length - 1; i >= 0; i--) {
        const sp = this.bossSparks[i];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.life -= dt;
        if (sp.life <= 0) this.bossSparks.splice(i, 1);
      }

      for (let i = this.debrisParticles.length - 1; i >= 0; i--) {
        const p = this.debrisParticles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.gravity * dt;
        p.rot += p.vrot * dt;
        p.life -= dt;
        if (p.life <= 0) this.debrisParticles.splice(i, 1);
      }
    }

    // Multiplayer Leaderboard Heartbeat (minden 6 mp-ben frissíti a pontszámot a többi játékos felé)
    if (this.pirateShopCooldown > 0) {
      this.pirateShopCooldown = Math.max(0, this.pirateShopCooldown - dt);
    }
    this.heartbeatTimer += dt;
    if (this.heartbeatTimer >= 6.0) {
      this.heartbeatTimer = 0;
      this.broadcastMyStatus();
      if (!isBackground) {
        this._lbAgeRefreshCount = (this._lbAgeRefreshCount || 0) + 1;
        if (this._lbAgeRefreshCount % 2 === 0) this.renderLeaderboard();
      }
    }

    // 7. Autosave every 3s (local) + Cloud autosave tick (15s)
    this.autosaveTimer += dt;
    if (this.autosaveTimer >= 3.0) {
      this.autosaveTimer = 0;
      this.save();
    }
    if (!isBackground && this.cloud) {
      this.cloud.tick(dt);
    }
  }

  advanceByElapsedTime(isBackground = false) {
    const now = Date.now();
    const elapsedSec = (now - this.lastTickMs) / 1000;
    if (elapsedSec <= 0.001) return;
    this.lastTickMs = now;

    if (!isBackground && elapsedSec <= 0.1) {
      this.stepSimulation(elapsedSec, false);
      return;
    }

    const maxRealSimSec = 120;
    const realSimSec = Math.min(elapsedSec, maxRealSimSec);
    const fixedDt = 1 / 30;

    this.suppressAudioAndVisuals = true;
    let remaining = realSimSec;
    while (remaining > 0.0001) {
      const step = Math.min(fixedDt, remaining);
      this.stepSimulation(step, true);
      remaining -= step;
    }
    this.suppressAudioAndVisuals = false;

    if (elapsedSec > maxRealSimSec && (this.getTotalBalls() > 0 || this.bbUpgrades.autoClicker >= 1)) {
      this.applyOfflineProgress(elapsedSec - maxRealSimSec, false);
    }

    this.renderPowerUpsHUD();
    this.updateHUD();
  }

  // --- Offline Progress (when closed) ---
  applyOfflineProgress(seconds, showToast = true) {
    const cappedSec = Math.min(seconds, 86400);
    if (cappedSec < 5 || (this.getTotalBalls() === 0 && this.bbUpgrades.autoClicker < 1)) return;

    const startMoney = this.money;
    const startLevel = this.level;
    const startBB = this.bb;
    const startBT = this.bossTokens;
    const startBricks = this.totalBricksDestroyed;

    if (cappedSec <= 120) {
      const fixedDt = 1 / 30;
      this.suppressAudioAndVisuals = true;
      let rem = cappedSec;
      while (rem > 0.0001) {
        const step = Math.min(fixedDt, rem);
        this.stepSimulation(step, true);
        rem -= step;
      }
      this.suppressAudioAndVisuals = false;
    } else {
      let totalDps = 0;
      let offlineCoinBonus = 0;
      let offlineCoinHits = 0;
      for (const key in this.ballTypes) {
        const b = this.ballTypes[key];
        if (b.count <= 0) continue;
        const speed = this.getBallSpeed(key);
        const power = this.getBallPower(key);
        let hitRate = speed * 0.42;
        if (key === 'ghost') hitRate = speed * 0.85;
        if (key === 'multiply') hitRate = speed * 0.65;
        if (key === 'symbiot') hitRate = speed * 5.5;
        if (key === 'coin') {
          hitRate = speed * 0.45;
          const hits = b.count * hitRate * cappedSec;
          offlineCoinHits += Math.floor(hits);
          offlineCoinBonus += hits * this.getCoinBallRewardPerHit() * this.rebirthMultiplier;
        }
        totalDps += b.count * power * hitRate;
      }

      if (this.bbUpgrades.autoClicker >= 1) {
        const acCfg = this.getAutoClickerConfig();
        const acAreaFactor = acCfg.areaRadius > 0 ? 2.2 : 1.0;
        totalDps += (this.clickPower * acCfg.dmgMult * acAreaFactor) / Math.max(0.1, acCfg.interval);
      }

      if (offlineCoinHits > 0) {
        const coinThresholds = this.getCoinBallTokenThresholds();
        if (coinThresholds) {
          this.coinBtHitCounter = (this.coinBtHitCounter || 0) + offlineCoinHits;
          this.coinBbHitCounter = (this.coinBbHitCounter || 0) + offlineCoinHits;
          while (this.coinBtHitCounter >= coinThresholds.btHits) {
            this.coinBtHitCounter -= coinThresholds.btHits;
            this.bossTokens += 1;
          }
          while (this.coinBbHitCounter >= coinThresholds.bbHits) {
            this.coinBbHitCounter -= coinThresholds.bbHits;
            this.bb += 1;
          }
        }
      }

      let remainingDamage = totalDps * cappedSec;
      let earned = offlineCoinBonus;
      let offlineBricks = 0;

      while (remainingDamage > 0) {
        const isBoss = this.isBossLevel(this.level);
        const levelTotalHp = isBoss ? this.getBossHpForLevel(this.level) : Math.max(1, Math.round(this.level * 85 * this.getLateGameHpMultiplier()));
        const dmgOnLevel = Math.min(remainingDamage, levelTotalHp);
        const rewardMult = isBoss ? this.getBossRewardPerDamage(this.level) : 1;

        earned += dmgOnLevel * rewardMult * this.rebirthMultiplier;
        remainingDamage -= dmgOnLevel;

        if (dmgOnLevel >= levelTotalHp) {
          offlineBricks += isBoss ? 1 : 38;
          if (isBoss) {
            earned += this.getBossKillBonus(this.level) * this.rebirthMultiplier;
            this.bossTokens += 1;
          }
          this.level++;
        } else {
          if (!isBoss && levelTotalHp > 0) {
            offlineBricks += Math.floor((dmgOnLevel / levelTotalHp) * 38);
          }
          break;
        }
      }

      if (offlineBricks > 0) {
        this.totalBricksDestroyed += offlineBricks;
        this.updateBattlePassHUD();
      }

      this.money += earned;
      this.generateLevel(this.level);
    }

    if (this.level > startLevel || this.money > startMoney) {
      this.offlineProgressAppliedAt = Date.now();
    }
    this.updateHUD();
    this.renderLeaderboard();
    this.save();
    this.syncWalletChangeNow(true);
    if (this.cloud && this.cloud.currentUser) {
      this.cloud.saveToCloud(true, { silent: true, allowBeforeInitialSync: true });
    }

    const gainedMoney = Math.max(0, Math.floor(this.money - startMoney));
    const gainedLevels = Math.max(0, this.level - startLevel);
    const gainedBricks = Math.max(0, this.totalBricksDestroyed - startBricks);
    const gainedBB = Math.max(0, this.bb - startBB);
    const gainedBT = Math.max(0, this.bossTokens - startBT);

    if (gainedMoney > 0 || gainedLevels > 0 || gainedBricks > 0 || gainedBB > 0 || gainedBT > 0) {
      const summary = {
        seconds: cappedSec,
        money: gainedMoney,
        levels: gainedLevels,
        bricks: gainedBricks,
        bb: gainedBB,
        bt: gainedBT
      };
      this._lastOfflineSummary = summary;
      if (showToast) {
        setTimeout(() => {
          const welcomeEl = document.getElementById('welcome-menu-modal');
          const welcomeOpen = !!(welcomeEl && welcomeEl.classList.contains('open'));
          if (!welcomeOpen && typeof this.showOfflineSummaryModal === 'function') {
            this.showOfflineSummaryModal(summary);
          } else {
            const lvlText = gainedLevels > 0 ? ` | +${gainedLevels} szint` : '';
            this.showToast(`⏱️ <strong>OFFLINE HALADÁS (${this.formatDuration(cappedSec)}):</strong> <span style="color:#2cd64e;">+$${this.formatNumber(gainedMoney)}</span>${lvlText}`, 6500);
          }
        }, 180);
      }
    }
  }

  formatDuration(sec) {
    const s = Math.max(0, Math.floor(sec));
    if (s < 60) return `${s} mp`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} perc`;
    const h = Math.floor(m / 60);
    if (h < 24) {
      const remM = m % 60;
      return remM > 0 ? `${h} óra ${remM} perc` : `${h} óra`;
    }
    const d = Math.floor(h / 24);
    const remH = h % 24;
    return remH > 0 ? `${d} nap ${remH} óra` : `${d} nap`;
  }

  formatLastSeenAgo(sec) {
    const s = Math.max(0, Math.floor(sec));
    if (s < 60) return 'épp most';
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} perce`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} órája`;
    const d = Math.floor(h / 24);
    const remH = h % 24;
    if (d < 3 && remH > 0) return `${d} nap ${remH} órája`;
    return `${d} napja`;
  }

  gameLoop(timestamp) {
    this.lastTime = timestamp;
    this.advanceByElapsedTime(false);
    this.render();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  // --- Ball Physics & Collision (with Ball Army, Multiply, Ghost, Poison, Heavy, Pierce & Overlap Safety) ---
  updateBalls(dt) {
    const borderWidth = 18;
    const arenaLeft = borderWidth;
    const arenaRight = this.width - borderWidth;
    const arenaTop = borderWidth;
    const arenaBottom = this.height - borderWidth;

    const speedMult = this.getSpeedBoostMultiplier();
    const ghostCfg = this.getGhostAbilityConfig();
    const rocketCooldown = (this.btUpgrades.rocket || 0) >= 1 ? 3.0 : 10.0;

    for (let i = this.balls.length - 1; i >= 0; i--) {
      const ball = this.balls[i];

      // Temporary ball lifespans (Pierce Ball temporary & Multiply split children = 5s)
      if ((ball.isPiercing && !ball.isPermanentPierce) || ball.isSplitChild) {
        ball.timeLeft -= dt;
        if (ball.timeLeft <= 0) {
          this.balls.splice(i, 1);
          continue;
        }
      }

      if (ball.splitCooldown > 0) {
        ball.splitCooldown = Math.max(0, ball.splitCooldown - dt);
      }

      // Ghostball & Symbiot szellembomba időzítő
      if (ball.type === 'ghost' && ghostCfg) {
        ball.ghostBombTimer = (ball.ghostBombTimer || 0) + dt;
        if (ball.ghostBombTimer >= ghostCfg.cooldown) {
          ball.ghostBombTimer -= ghostCfg.cooldown;
          this.spawnGhostBomb(ball.x, ball.y, ghostCfg);
        }
      } else if (ball.type === 'symbiot' && !ball.isSplitChild) {
        const symGhostCfg = ghostCfg
          ? { ...ghostCfg, cooldown: 1.8, gridSpan: 5, fuse: 0.75, dmg: Math.max(500, ghostCfg.dmg, Math.round(ball.power * 4.5)) }
          : { cooldown: 1.8, gridSpan: 5, fuse: 0.75, dmg: Math.max(500, Math.round(ball.power * 4.5)) };
        ball.ghostBombTimer = (ball.ghostBombTimer || 0) + dt;
        if (ball.ghostBombTimer >= symGhostCfg.cooldown) {
          ball.ghostBombTimer -= symGhostCfg.cooldown;
          this.spawnGhostBomb(ball.x, ball.y, symGhostCfg);
        }
      }

      // Rocket Ball & Symbiot rakétakilövő időzítő
      if (ball.type === 'rocket') {
        ball.rocketTimer = (ball.rocketTimer || 0) + dt;
        if (ball.rocketTimer >= rocketCooldown) {
          ball.rocketTimer -= rocketCooldown;
          this.spawnRocketFromBall(ball);
        }
      } else if (ball.type === 'symbiot' && !ball.isSplitChild) {
        const symRocketCooldown = 1.4;
        ball.rocketTimer = (ball.rocketTimer || 0) + dt;
        if (ball.rocketTimer >= symRocketCooldown) {
          ball.rocketTimer -= symRocketCooldown;
          this.spawnRocketFromBall(ball, true);
          this.spawnRocketFromBall(ball, true);
        }
      }

      const effectiveSpeed = ball.speed * speedMult;
      // Dynamically scale sub-steps for high-speed balls (e.g. 4x Pierce Ball or 3x Speed Boost) so they NEVER tunnel!
      const steps = Math.max(2, Math.min(8, Math.ceil(effectiveSpeed / 5.5)));
      const subDt = dt / steps;

      for (let s = 0; s < steps; s++) {
        if (Math.abs(ball.vx) < ball.speed * 0.22) {
          ball.vx += (ball.vx >= 0 ? 0.25 : -0.25);
        }
        if (Math.abs(ball.vy) < ball.speed * 0.22) {
          ball.vy += (ball.vy >= 0 ? 0.25 : -0.25);
        }

        // Normalize velocity to exact ball.speed
        const curMag = Math.hypot(ball.vx, ball.vy);
        if (curMag > 0.001) {
          ball.vx = (ball.vx / curMag) * ball.speed;
          ball.vy = (ball.vy / curMag) * ball.speed;
        }

        ball.x += ball.vx * speedMult * subDt * 60;
        ball.y += ball.vy * speedMult * subDt * 60;

        // Perimeter wall collisions
        if (ball.x - ball.radius < arenaLeft) {
          ball.x = arenaLeft + ball.radius;
          ball.vx = Math.abs(ball.vx);
        } else if (ball.x + ball.radius > arenaRight) {
          ball.x = arenaRight - ball.radius;
          ball.vx = -Math.abs(ball.vx);
        }

        if (ball.y - ball.radius < arenaTop) {
          ball.y = arenaTop + ball.radius;
          ball.vy = Math.abs(ball.vy);
        } else if (ball.y + ball.radius > arenaBottom) {
          ball.y = arenaBottom - ball.radius;
          ball.vy = -Math.abs(ball.vy);
        }

        const isGhostPass = ball.type === 'ghost' || ball.type === 'symbiot';
        const isPassThrough = ball.isPiercing || isGhostPass;

        // Ghostball & Symbiot tracks bricks it is currently inside so it hits each brick ONCE per pass-through
        const currentlyTouchingIds = isGhostPass ? new Set() : null;

        for (const brick of this.bricks) {
          if (brick.hp <= 0) continue;

          const cx = Math.max(brick.x, Math.min(ball.x, brick.x + brick.w));
          const cy = Math.max(brick.y, Math.min(ball.y, brick.y + brick.h));
          const distX = ball.x - cx;
          const distY = ball.y - cy;

          if (distX * distX + distY * distY < ball.radius * ball.radius) {
            if (isGhostPass) {
              // Ghostball & Symbiot pass straight through ALL bricks (including Boss) without bouncing!
              currentlyTouchingIds.add(brick.id);
              if (ball.ghostHitSet && !ball.ghostHitSet.has(brick.id)) {
                ball.ghostHitSet.add(brick.id);
                this.handleBallBrickImpact(ball, brick);
              }
              continue;
            }

            // Pierce Ball passes through normal bricks, bounces off Boss
            if (!isPassThrough || brick.isBoss) {
              const ovL = (ball.x + ball.radius) - brick.x;
              const ovR = (brick.x + brick.w) - (ball.x - ball.radius);
              const ovT = (ball.y + ball.radius) - brick.y;
              const ovB = (brick.y + brick.h) - (ball.y - ball.radius);

              const minOv = Math.min(ovL, ovR, ovT, ovB);
              if (brick.isBoss) {
                // Boss esetén mindig 100%-ban a Bosson kívülre lökjük a labdát, hogy soha ne ragadhasson bele!
                if (minOv === ovL) {
                  ball.x = Math.max(arenaLeft + ball.radius, brick.x - ball.radius - 2);
                  ball.vx = -Math.abs(ball.vx);
                } else if (minOv === ovR) {
                  ball.x = Math.min(arenaRight - ball.radius, brick.x + brick.w + ball.radius + 2);
                  ball.vx = Math.abs(ball.vx);
                } else if (minOv === ovT) {
                  ball.y = Math.max(arenaTop + ball.radius, brick.y - ball.radius - 2);
                  ball.vy = -Math.abs(ball.vy);
                } else {
                  ball.y = Math.min(arenaBottom - ball.radius, brick.y + brick.h + ball.radius + 2);
                  ball.vy = Math.abs(ball.vy);
                }
              } else {
                // Normál tégláknál finom kilökés átfedés esetén
                const pushCap = Math.min(minOv, ball.radius * 1.8);
                if (minOv === ovL) {
                  ball.x = Math.max(arenaLeft + ball.radius, ball.x - pushCap);
                  ball.vx = -Math.abs(ball.vx);
                } else if (minOv === ovR) {
                  ball.x = Math.min(arenaRight - ball.radius, ball.x + pushCap);
                  ball.vx = Math.abs(ball.vx);
                } else if (minOv === ovT) {
                  ball.y = Math.max(arenaTop + ball.radius, ball.y - pushCap);
                  ball.vy = -Math.abs(ball.vy);
                } else {
                  ball.y = Math.min(arenaBottom - ball.radius, ball.y + pushCap);
                  ball.vy = Math.abs(ball.vy);
                }
              }
            }

            this.handleBallBrickImpact(ball, brick);
            break;
          }
        }

        // Clear exited brick IDs from Ghostball / Symbiot hit set so it can hit them again on next pass!
        if (isGhostPass && ball.ghostHitSet) {
          for (const id of ball.ghostHitSet) {
            if (!currentlyTouchingIds.has(id)) {
              ball.ghostHitSet.delete(id);
            }
          }
        }
      }

      // Record position history for smooth custom ball animations & particle trails
      if (!ball.trail) ball.trail = [];
      ball.trail.push({ x: ball.x, y: ball.y });
      if (ball.trail.length > 7) ball.trail.shift();
    }
  }

  handleBallBrickImpact(ball, brick) {
    if (ball.type === 'poison') {
      // A $ Power fejlesztés CSAK az azonnali sebzésre vonatkozik (pl. lvl 23 = 23 dmg),
      // a méreg (dmg/s + időtartam) pedig a BT fejlesztésből jön!
      this.damageBrick(brick, ball.power, 'poison', { ball });
      if (brick.hp > 0) {
        this.applyPoisonToBrick(brick);
      }
    } else if (ball.type === 'heavy') {
      // Heavy Ball: lassú, de az 1. szinttől 20+ azonnali sebzés (nincs BT upgrade)
      this.damageBrick(brick, ball.power, 'heavy', { ball });
      this.triggerScreenShake(1.6, 4.0);
    } else if (ball.type === 'smasher') {
      // Smasher Ball: a célblokk mellett a legközelebbi 3 szomszédos blokkot is megsebzi (50% splash sebzés) + kis rezgés!
      this.damageBrick(brick, ball.power, 'smasher', { ball });
      this.triggerScreenShake(3.2, 5.5);
      const cx = brick.x + brick.w / 2;
      const cy = brick.y + brick.h / 2;

      if (!this.suppressAudioAndVisuals) {
        this.visualRings.push({
          x: cx,
          y: cy,
          radius: 6,
          maxRadius: Math.max(brick.w, brick.h) * 1.5,
          alpha: 0.85,
          color: '245, 158, 11',
          speed: 140
        });
      }

      const maxDist = Math.max(this.gridCellW, this.gridCellH) * 2.2;
      const neighbors = this.bricks
        .filter(b => b !== brick && b.hp > 0 && Math.hypot((b.x + b.w / 2) - cx, (b.y + b.h / 2) - cy) <= maxDist)
        .sort((a, b) => {
          const d1 = Math.hypot((a.x + a.w / 2) - cx, (a.y + a.h / 2) - cy);
          const d2 = Math.hypot((b.x + b.w / 2) - cx, (b.y + b.h / 2) - cy);
          return d1 - d2;
        })
        .slice(0, 3);

      const splashDmg = Math.max(1, Math.round(ball.power * 0.5));
      for (const nb of neighbors) {
        this.damageBrick(nb, splashDmg, 'smasher_splash', { ball });
      }
    } else if (ball.type === 'multiply') {
      this.damageBrick(brick, ball.power, 'multiply', { ball });
      const maxTier = this.getMultiplyMaxSplitTier();
      if (!ball.isSplitChild) {
        // Fő Multiply labda soha nem tűnik el; osztódás rövid cooldownnal
        if ((ball.splitCooldown || 0) <= 0) {
          ball.splitCooldown = 1.4;
          this.spawnMultiplyChildren(ball);
        }
      } else if (!ball.hasSplit && ball.splitTier < maxTier) {
        // Az osztódott labdák a BT szinttől függően osztódnak tovább (2 -> 4 -> 8 -> 16)
        ball.hasSplit = true;
        this.spawnMultiplyChildren(ball);
      }
    } else if (ball.type === 'symbiot') {
      // SYMBIOT: Boss-zúzó (2x Boss dmg) + Heavy/Speedy + Poison + 6-blokkos AoE Smash + gyors Multiply osztódás!
      const directDmg = brick.isBoss ? ball.power * 2 : ball.power;
      this.damageBrick(brick, directDmg, 'symbiot', { ball });
      if (!ball.isSplitChild) this.triggerScreenShake(2.8, 5.5);
      if (brick.hp > 0) {
        this.applyPoisonToBrick(brick);
      }

      const cx = brick.x + brick.w / 2;
      const cy = brick.y + brick.h / 2;
      if (!this.suppressAudioAndVisuals && !ball.isSplitChild) {
        this.visualRings.push({
          x: cx,
          y: cy,
          radius: 7,
          maxRadius: Math.max(brick.w, brick.h) * 2.1,
          alpha: 0.88,
          color: '168, 85, 247',
          speed: 170
        });
      }

      const maxDist = Math.max(this.gridCellW, this.gridCellH) * 2.8;
      const neighbors = this.bricks
        .filter(b => b !== brick && b.hp > 0 && Math.hypot((b.x + b.w / 2) - cx, (b.y + b.h / 2) - cy) <= maxDist)
        .sort((a, b) => Math.hypot((a.x + a.w / 2) - cx, (a.y + a.h / 2) - cy) - Math.hypot((b.x + b.w / 2) - cx, (b.y + b.h / 2) - cy))
        .slice(0, 6);
      const splashDmg = Math.max(1, Math.round(ball.power * 0.75));
      for (const nb of neighbors) {
        this.damageBrick(nb, splashDmg, 'smasher_splash', { ball });
      }

      const maxTier = Math.max(3, this.getMultiplyMaxSplitTier());
      if (!ball.isSplitChild) {
        if ((ball.splitCooldown || 0) <= 0) {
          ball.splitCooldown = 0.85;
          this.spawnMultiplyChildren(ball);
        }
      } else if (!ball.hasSplit && ball.splitTier < maxTier) {
        ball.hasSplit = true;
        this.spawnMultiplyChildren(ball);
      }
    } else if (ball.type === 'coin') {
      // COIN BALL: mindig pontosan 1 sebzés + pénz ütközésenként (egyetlen közös felugró pénz szöveggel) + maxolás után BT/BB bányászat!
      let coinBonus = this.getCoinBallRewardPerHit() * this.rebirthMultiplier;
      if (this.isPowerUpActive('2x_money')) {
        coinBonus *= 2;
      }
      this.damageBrick(brick, 1, 'coin', { ball, extraMoney: coinBonus });

      const silent = this.suppressAudioAndVisuals || document.hidden;
      const fxX = brick.x + brick.w / 2;
      const fxY = brick.y + brick.h / 2 - 14;

      const thresholds = this.getCoinBallTokenThresholds();
      if (thresholds) {
        let coinWalletChanged = false;
        this.coinBtHitCounter = (this.coinBtHitCounter || 0) + 1;
        this.coinBbHitCounter = (this.coinBbHitCounter || 0) + 1;
        while (this.coinBtHitCounter >= thresholds.btHits) {
          this.coinBtHitCounter -= thresholds.btHits;
          this.bossTokens += 1;
          coinWalletChanged = true;
          if (!silent) {
            this.addFloatingText('+1 👑 BT (COIN)!', fxX, fxY - 14, '#fbbf24');
            if (window.soundEngine) window.soundEngine.playCoin();
          }
        }
        while (this.coinBbHitCounter >= thresholds.bbHits) {
          this.coinBbHitCounter -= thresholds.bbHits;
          this.bb += 1;
          coinWalletChanged = true;
          if (!silent) {
            this.addFloatingText('+1 ⭐ BB (COIN)!', fxX, fxY - 28, '#fde047');
            if (window.soundEngine) window.soundEngine.playLevelUp();
          }
        }
        if (coinWalletChanged) {
          this.syncWalletChangeNow(false);
        }
      }
      if (!this.suppressAudioAndVisuals) {
        this.updateHUD();
      }
    } else {
      this.damageBrick(brick, ball.power, ball.type, { ball });
      if (ball.type === 'rocket') {
        this.triggerScreenShake(2.2, 5.0);
      }
    }
  }

  // --- Redesigned Boss Block Renderer (Normal Armored Boss + Radiant Gold Boss) ---
  drawBossBlock(b) {
    const ctx = this.ctx;
    ctx.save();

    const shakeX = b.shake > 0 ? (Math.random() - 0.5) * b.shake : 0;
    const shakeY = b.shake > 0 ? (Math.random() - 0.5) * b.shake : 0;
    const x = b.x + shakeX;
    const y = b.y + shakeY;
    const w = b.w;
    const h = b.h;
    const hpRatio = Math.max(0, Math.min(1, b.hp / Math.max(1, b.maxHp)));

    // 1. Outer Glow Shadow
    ctx.shadowColor = b.isGoldBoss ? 'rgba(250, 204, 21, 0.75)' : 'rgba(225, 29, 72, 0.55)';
    ctx.shadowBlur = b.isGoldBoss ? 22 : 16;

    // 2. Armored Body Gradient
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    if (b.flash > 0) {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, b.isGoldBoss ? '#fef08a' : '#fecdd3');
    } else if (b.isGoldBoss) {
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.35, '#f59e0b');
      grad.addColorStop(0.7, '#d97706');
      grad.addColorStop(1, '#92400e');
    } else {
      grad.addColorStop(0, '#4c0519');
      grad.addColorStop(0.45, '#9f1239');
      grad.addColorStop(1, '#2d0614');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;

    // 3. Animated Shimmer / Energy Scanlines clipped inside Boss
    ctx.save();
    ctx.beginPath();
    ctx.rect(x + 4, y + 4, w - 8, h - 8);
    ctx.clip();

    if (b.isGoldBoss) {
      // Sweeping metallic gold shine
      const sweepPos = ((this.animTime * 180) % (w + h * 1.5)) - h;
      const shineGrad = ctx.createLinearGradient(x + sweepPos, y, x + sweepPos + 70, y + h);
      shineGrad.addColorStop(0, 'rgba(255,255,255,0)');
      shineGrad.addColorStop(0.5, 'rgba(255,255,255,0.45)');
      shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = shineGrad;
      ctx.fillRect(x, y, w, h);
    } else {
      // Subtle animated cyber-fortress scanlines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      const scanOffset = (this.animTime * 28) % 12;
      for (let sy = y + scanOffset; sy < y + h; sy += 12) {
        ctx.fillRect(x, sy, w, 3);
      }
    }

    // Top & Bottom Diagonal Hazard Trim
    const trimH = 12;
    ctx.fillStyle = b.isGoldBoss ? '#78350f' : '#18181b';
    ctx.fillRect(x, y, w, trimH);
    ctx.fillRect(x, y + h - trimH, w, trimH);

    ctx.strokeStyle = b.isGoldBoss ? '#fde047' : '#f59e0b';
    ctx.lineWidth = 5;
    for (let sx = -h; sx < w + h; sx += 22) {
      ctx.beginPath();
      ctx.moveTo(x + sx, y);
      ctx.lineTo(x + sx + 10, y + trimH);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + sx, y + h - trimH);
      ctx.lineTo(x + sx + 10, y + h);
      ctx.stroke();
    }

    // 4. Progressive Damage Cracks (<75%, <50%, <25%)
    ctx.strokeStyle = b.isGoldBoss ? 'rgba(69, 26, 3, 0.7)' : 'rgba(255, 228, 230, 0.65)';
    ctx.lineWidth = 2.5;
    if (hpRatio < 0.75) {
      ctx.beginPath();
      ctx.moveTo(x + w * 0.12, y + trimH);
      ctx.lineTo(x + w * 0.20, y + h * 0.34);
      ctx.lineTo(x + w * 0.15, y + h * 0.52);
      ctx.stroke();
    }
    if (hpRatio < 0.50) {
      ctx.beginPath();
      ctx.moveTo(x + w * 0.86, y + h - trimH);
      ctx.lineTo(x + w * 0.76, y + h * 0.64);
      ctx.lineTo(x + w * 0.82, y + h * 0.42);
      ctx.lineTo(x + w * 0.70, y + h * 0.28);
      ctx.stroke();
    }
    if (hpRatio < 0.25) {
      ctx.beginPath();
      ctx.moveTo(x + w * 0.48, y + trimH);
      ctx.lineTo(x + w * 0.44, y + h * 0.35);
      ctx.lineTo(x + w * 0.54, y + h * 0.55);
      ctx.lineTo(x + w * 0.46, y + h - trimH);
      ctx.stroke();
    }
    ctx.restore();

    // 5. Heavy Double Armored Frame + Corner Bolts
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(x, y, w, h);

    ctx.lineWidth = 2;
    ctx.strokeStyle = b.isGoldBoss ? '#fef08a' : '#fb7185';
    ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);

    // Corner rivets
    const boltPositions = [
      [x + 12, y + 20],
      [x + w - 12, y + 20],
      [x + 12, y + h - 20],
      [x + w - 12, y + h - 20]
    ];
    for (const [bx, by] of boltPositions) {
      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, Math.PI * 2);
      ctx.fillStyle = b.isGoldBoss ? '#fef08a' : '#d4d4d8';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    }

    // 6. Boss Emblem & Title
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const bossNum = b.bossNumber || this.getBossNumberForLevel(this.level);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 26px "VT323", "Courier New", Courier, monospace';
    const titleTxt = b.isGoldBoss
      ? `✨👑 GOLD BOSS #${bossNum} (2x PÉNZ!) 👑✨`
      : `👑 BOSS #${bossNum}  •  SZINT ${this.level}`;
    ctx.fillText(titleTxt, x + w / 2 + 2, y + h * 0.27 + 2);

    ctx.fillStyle = b.isGoldBoss ? '#ffffff' : '#fde047';
    ctx.fillText(titleTxt, x + w / 2, y + h * 0.27);

    // 7. Large HP Readout
    const hpStr = `${Math.ceil(b.hp).toLocaleString()} / ${b.maxHp.toLocaleString()} HP`;
    ctx.font = 'bold 34px "VT323", "Courier New", Courier, monospace';
    ctx.fillStyle = '#000000';
    ctx.fillText(hpStr, x + w / 2 + 2, y + h * 0.52 + 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(hpStr, x + w / 2, y + h * 0.52);

    // 8. Live HP Progress Bar
    const barW = w * 0.78;
    const barH = 20;
    const barX = x + (w - barW) / 2;
    const barY = y + h * 0.70;

    ctx.fillStyle = '#09090b';
    ctx.fillRect(barX, barY, barW, barH);

    const barColor = hpRatio > 0.5 ? '#22c55e' : (hpRatio > 0.25 ? '#f59e0b' : '#ef4444');
    ctx.fillStyle = b.isGoldBoss ? '#fde047' : barColor;
    ctx.fillRect(barX + 2, barY + 2, Math.max(0, (barW - 4) * hpRatio), barH - 4);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(barX, barY, barW, barH);

    ctx.font = 'bold 16px "VT323", "Courier New", Courier, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${Math.ceil(hpRatio * 100)}%`, x + w / 2, barY + barH / 2 + 1);

    // Poison stack badge on Boss (Boss blokkon a méreg stackelődik!)
    if (b.poisonStacks && b.poisonStacks.length > 0) {
      const totalDps = b.poisonStacks.reduce((sum, st) => sum + (st.dps || 0), 0);
      ctx.font = 'bold 16px "VT323", "Courier New", Courier, monospace';
      ctx.fillStyle = '#86efac';
      ctx.fillText(`☠️ MÉREG x${b.poisonStacks.length} (-${Math.round(totalDps)}/s)`, x + w / 2, y + h * 0.87);
    }

    ctx.restore();
  }

  // --- Main Render ---
  render() {
    this.ctx.fillStyle = '#ede0c8';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.save();
    if (this.screenShake > 0.05) {
      const sx = (Math.random() - 0.5) * 2 * this.screenShake;
      const sy = (Math.random() - 0.5) * 2 * this.screenShake;
      this.ctx.translate(sx, sy);
    }

    // Subtle Graph Grid Design
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.035)';
    this.ctx.lineWidth = 1;
    const gridStep = 24;
    for (let x = 0; x < this.width; x += gridStep) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += gridStep) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
    this.ctx.restore();

    // 1. White Perimeter Bricks
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#000000';
    for (const pb of this.perimeterBricks) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(pb.x, pb.y, pb.w, pb.h);
      this.ctx.strokeRect(pb.x, pb.y, pb.w, pb.h);
    }

    // 2. Expanding Visual Rings (Shockwaves, Click Area, Auto-Clicker)
    for (const ring of this.visualRings) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = `rgba(${ring.color || '59, 130, 246'}, ${ring.alpha.toFixed(2)})`;
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 3. Draw Bricks (Normal or Redesigned Boss)
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for (const b of this.bricks) {
      if (b.hp <= 0) continue;

      if (b.isBoss) {
        this.drawBossBlock(b);
      } else {
        if (b.isGoldBrick) {
          this.ctx.fillStyle = '#facc15';
          this.ctx.fillRect(b.x, b.y, b.w, b.h);
          this.ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
          this.ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, 4);
          this.ctx.fillStyle = 'rgba(180, 83, 9, 0.42)';
          this.ctx.fillRect(b.x + 2, b.y + b.h - 5, b.w - 4, 3);
        } else {
          this.ctx.fillStyle = this.getBlockColor(b.hp);
          this.ctx.fillRect(b.x, b.y, b.w, b.h);

          // Finom retro 3D fényél és alsó árnyék a téglákon
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
          this.ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, 3);
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
          this.ctx.fillRect(b.x + 2, b.y + b.h - 5, b.w - 4, 3);
        }

        if (b.flash > 0) {
          this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.62, b.flash * 6.5).toFixed(2)})`;
          this.ctx.fillRect(b.x, b.y, b.w, b.h);
        }

        // Poison subtle top tint (normál blokkon max 1 méreg)
        if (b.poison) {
          this.ctx.fillStyle = b.poison.infinite ? 'rgba(16, 185, 129, 0.6)' : 'rgba(34, 197, 94, 0.45)';
          this.ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, 5);
        }

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = b.isGoldBrick
          ? '#78350f'
          : (b.specialType === 'armored' ? '#334155' : (b.specialType === 'regen' ? '#15803d' : (b.specialType === 'explosive' ? '#ea580c' : '#000000')));
        this.ctx.strokeRect(b.x, b.y, b.w, b.h);
        if (b.specialType === 'armored') {
          this.ctx.strokeStyle = 'rgba(226, 232, 240, 0.72)';
          this.ctx.lineWidth = 1.5;
          this.ctx.strokeRect(b.x + 3, b.y + 3, b.w - 6, b.h - 6);
        }

        const hpNum = Math.ceil(b.hp);
        const hpStr = hpNum >= 1000 ? this.formatNumber(hpNum) : hpNum.toString();
        if (b.poison) {
          // Ha mérgezett a blokk: HP feljebb, alatta jól olvasható "x dmg/s" jelzés!
          this.ctx.font = `bold ${hpStr.length >= 4 ? 13 : 15}px "VT323", "Courier New", Courier, monospace`;
          this.ctx.fillStyle = b.isGoldBrick ? '#451a03' : '#000000';
          this.ctx.fillText(hpStr, b.x + b.w / 2, b.y + b.h * 0.38);

          const dpsText = `${Math.round(b.poison.dps)} dmg/s`;
          this.ctx.font = 'bold 11px "VT323", "Courier New", Courier, monospace';
          this.ctx.fillStyle = '#064e3b';
          this.ctx.fillText(dpsText, b.x + b.w / 2, b.y + b.h * 0.77);
        } else {
          this.ctx.font = `bold ${hpStr.length >= 4 ? 14 : 16}px "VT323", "Courier New", Courier, monospace`;
          this.ctx.fillStyle = b.isGoldBrick ? '#451a03' : '#000000';
          this.ctx.fillText(hpStr, b.x + b.w / 2, b.y + b.h / 2);
        }
        if (b.specialType) {
          const spBadge = b.specialType === 'armored' ? '🛡️' : (b.specialType === 'regen' ? '✚' : '💣');
          this.ctx.font = 'bold 10px sans-serif';
          this.ctx.fillStyle = b.specialType === 'regen' ? '#065f46' : '#111827';
          this.ctx.fillText(spBadge, b.x + b.w - 8, b.y + 8);
        }
      }
    }

    // 3.4 Draw Ghost Bombs (3x3 / 5x5 crater preview + pulsing spectral ghost!)
    for (const bomb of this.ghostBombs) {
      const progress = 1 - Math.max(0, bomb.fuse / Math.max(0.01, bomb.maxFuse));
      this.ctx.save();

      // Crater zone preview
      this.ctx.fillStyle = `rgba(56, 189, 248, ${(0.08 + progress * 0.16).toFixed(2)})`;
      this.ctx.fillRect(bomb.x - bomb.halfW, bomb.y - bomb.halfH, bomb.halfW * 2, bomb.halfH * 2);
      this.ctx.strokeStyle = `rgba(14, 165, 233, ${(0.45 + progress * 0.5).toFixed(2)})`;
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 4]);
      this.ctx.strokeRect(bomb.x - bomb.halfW, bomb.y - bomb.halfH, bomb.halfW * 2, bomb.halfH * 2);
      this.ctx.setLineDash([]);

      // Countdown circle & Ghost icon
      const orbR = 11 + progress * 5;
      this.ctx.beginPath();
      this.ctx.arc(bomb.x, bomb.y, orbR, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(224, 242, 254, 0.88)';
      this.ctx.fill();
      this.ctx.strokeStyle = '#0284c7';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.font = 'bold 15px "VT323", "Courier New", Courier, monospace';
      this.ctx.fillStyle = '#0369a1';
      this.ctx.fillText('👻', bomb.x, bomb.y + 1);
      this.ctx.restore();
    }

    // 3.5 Boss Impact Sparks
    for (const sp of this.bossSparks) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, sp.life / 0.35);
      this.ctx.fillStyle = sp.color;
      this.ctx.fillRect(sp.x - 2, sp.y - 2, 5, 5);
      this.ctx.restore();
    }

    // 3.55 Brick Destruction Debris (A labda skinjének színével megegyező robbanási animáció + Breaking Effekt)
    for (const p of this.debrisParticles) {
      this.ctx.save();
      const alpha = Math.max(0, p.life / p.maxLife);
      this.ctx.globalAlpha = alpha;
      this.ctx.translate(p.x, p.y);
      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();
      } else {
        this.ctx.rotate(p.rot);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      this.ctx.restore();
    }

    // 3.6 Flying Rockets (Rocket Ball projectiles)
    for (const r of this.rockets) {
      const ang = Math.atan2(r.vy, r.vx);
      this.ctx.save();
      this.ctx.translate(r.x, r.y);
      this.ctx.rotate(ang);

      // Flame exhaust
      this.ctx.beginPath();
      this.ctx.moveTo(-14, 0);
      this.ctx.lineTo(-6, -4);
      this.ctx.lineTo(-6, 4);
      this.ctx.closePath();
      this.ctx.fillStyle = '#fde047';
      this.ctx.fill();

      // Missile body
      this.ctx.beginPath();
      this.ctx.moveTo(9, 0);
      this.ctx.lineTo(-6, -4.5);
      this.ctx.lineTo(-6, 4.5);
      this.ctx.closePath();
      this.ctx.fillStyle = r.homing ? '#ef4444' : '#f97316';
      this.ctx.fill();
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeStyle = '#000000';
      this.ctx.stroke();

      this.ctx.restore();
    }

    // 3.5 Draw Animated Ball Trails & Visual Accents
    this.drawBallTrails();

    // 4. Draw Balls (All 10 types visually distinct + Pierce Ball + Universal Multi-Ball Cosmetics)
    const cosmeticCountForType = {};
    for (const ball of this.balls) {
      this.ctx.save();
      if (ball.isPiercing) {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius + 4, 0, Math.PI * 2);
        this.ctx.strokeStyle = ball.isPermanentPierce ? 'rgba(250, 204, 21, 0.9)' : 'rgba(6, 182, 212, 0.85)';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.stroke();
        this.ctx.restore();
        continue;
      }

      let activeEquip = null;
      if (!ball.isSplitChild) {
        cosmeticCountForType[ball.type] = (cosmeticCountForType[ball.type] || 0) + 1;
        const rank = cosmeticCountForType[ball.type];
        const eq = this.ballTypeEquips && this.ballTypeEquips[ball.type];
        if (eq) {
          const skinId = (eq.skinId && eq.skinId !== 'default' && rank <= this.getCosmeticMaxEquip('skin', eq.skinId)) ? eq.skinId : 'default';
          const effectId = (eq.effectId && eq.effectId !== 'none' && rank <= this.getCosmeticMaxEquip('effect', eq.effectId)) ? eq.effectId : 'none';
          const breakEffectId = (eq.breakEffectId && eq.breakEffectId !== 'none' && rank <= this.getCosmeticMaxEquip('break_effect', eq.breakEffectId)) ? eq.breakEffectId : 'none';
          if (skinId !== 'default' || effectId !== 'none' || breakEffectId !== 'none') {
            activeEquip = { skinId, effectId, breakEffectId };
          }
        }
      }

      if (activeEquip && activeEquip.effectId && activeEquip.effectId !== 'none') {
        this.drawCosmeticEffectLayer(this.ctx, ball, activeEquip.effectId);
      }
      if (activeEquip && activeEquip.breakEffectId && activeEquip.breakEffectId !== 'none') {
        const ringClr = activeEquip.breakEffectId === 'brk_s2_frost'
          ? 'rgba(56, 189, 248, 0.78)'
          : (activeEquip.breakEffectId === 'brk_s2_nova'
              ? 'rgba(250, 204, 21, 0.78)'
              : (activeEquip.breakEffectId === 'brk_s2_glitch' ? 'rgba(6, 182, 212, 0.8)' : 'rgba(249, 115, 22, 0.72)'));
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius + 3.5 + Math.sin(this.animTime * 11) * 1.2, 0, Math.PI * 2);
        this.ctx.strokeStyle = ringClr;
        this.ctx.lineWidth = 1.8;
        this.ctx.stroke();
        this.ctx.restore();
      }

      if (activeEquip && activeEquip.skinId && activeEquip.skinId !== 'default') {
        if (ball.type === 'ghost') this.ctx.globalAlpha = 0.82;
        this.drawCosmeticSkinBody(this.ctx, ball, activeEquip.skinId);
      } else if (ball.type === 'symbiot') {
        // SYMBIOT BALL: Obsidian mag + izzó bíbor/lila szimbióta indák
        const rot = this.animTime * 4.5;
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius + 3.5, 0, Math.PI * 2);
        this.ctx.strokeStyle = ball.isSplitChild ? 'rgba(192, 132, 252, 0.7)' : 'rgba(239, 68, 68, 0.75)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.strokeStyle = '#a855f7';
        this.ctx.lineWidth = 1.6;
        for (let k = 0; k < 4; k++) {
          const a = rot + k * (Math.PI / 2);
          this.ctx.beginPath();
          this.ctx.moveTo(ball.x + Math.cos(a) * (ball.radius * 0.7), ball.y + Math.sin(a) * (ball.radius * 0.7));
          this.ctx.lineTo(ball.x + Math.cos(a + 0.35) * (ball.radius + 4), ball.y + Math.sin(a + 0.35) * (ball.radius + 4));
          this.ctx.stroke();
        }

        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = '#7e22ce';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius * 0.42, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fill();
      } else if (ball.type === 'ghost') {
        this.ctx.globalAlpha = 0.72;
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius + 3, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([3, 3]);
        this.ctx.stroke();

        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#e0f7ff';
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#0284c7';
        this.ctx.stroke();
      } else if (ball.type === 'heavy') {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius * 0.42, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fca5a5';
        this.ctx.fill();
      } else if (ball.type === 'smasher') {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.fill();
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();

        // Spinning 4-tooth jagged core
        this.ctx.save();
        this.ctx.translate(ball.x, ball.y);
        this.ctx.rotate(this.animTime * 5);
        this.ctx.strokeStyle = '#78350f';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-ball.radius * 0.6, 0);
        this.ctx.lineTo(ball.radius * 0.6, 0);
        this.ctx.moveTo(0, -ball.radius * 0.6);
        this.ctx.lineTo(0, ball.radius * 0.6);
        this.ctx.stroke();
        this.ctx.restore();
      } else if (ball.type === 'poison') {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#22c55e';
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius * 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = '#bbf7d0';
        this.ctx.fill();
      } else if (ball.type === 'multiply') {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = ball.isSplitChild ? '#ffffff' : '#000000';
        this.ctx.stroke();

        if (!ball.isSplitChild) {
          this.ctx.beginPath();
          this.ctx.arc(ball.x, ball.y, ball.radius * 0.45, 0, Math.PI * 2);
          this.ctx.strokeStyle = '#ffffff';
          this.ctx.lineWidth = 1.5;
          this.ctx.stroke();
        }
      } else if (ball.type === 'rocket') {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius + 2.5, 0, Math.PI * 2);
        this.ctx.strokeStyle = (this.btUpgrades.rocket || 0) >= 1 ? 'rgba(239, 68, 68, 0.85)' : 'rgba(249, 115, 22, 0.65)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#f97316';
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius * 0.42, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fef08a';
        this.ctx.fill();
      } else if (ball.type === 'coin') {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#facc15';
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#78350f';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius * 0.72, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#ca8a04';
        this.ctx.lineWidth = 1.4;
        this.ctx.stroke();

        this.ctx.font = `bold ${Math.max(9, Math.round(ball.radius * 1.25))}px "Courier New", monospace`;
        this.ctx.fillStyle = '#451a03';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('$', ball.x, ball.y + 0.5);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();
      }
      if (activeEquip && ((activeEquip.effectId && activeEquip.effectId !== 'none') || (activeEquip.breakEffectId && activeEquip.breakEffectId !== 'none'))) {
        this.drawCosmeticEffectFrontLayer(this.ctx, ball, activeEquip.effectId, activeEquip.breakEffectId);
      }
      this.ctx.restore();
    }

    // 5. Quick Time Money Coin Orb
    if (this.bonusOrb) {
      const orb = this.bonusOrb;
      this.ctx.save();

      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, orb.radius + 4, 0, Math.PI * 2);
      this.ctx.strokeStyle = this.bbUpgrades.quickTimeMoney >= 5 ? '#a855f7' : '#f59e0b';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([4, 4]);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, Math.max(3, orb.radius), 0, Math.PI * 2);
      this.ctx.fillStyle = '#facc15';
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([]);
      this.ctx.strokeStyle = '#000000';
      this.ctx.stroke();

      if (orb.radius > 10) {
        this.ctx.font = 'bold 17px "VT323", "Courier New", Courier, monospace';
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText(this.bbUpgrades.quickTimeMoney >= 5 ? 'BB' : '$', orb.x, orb.y);
      }

      this.ctx.restore();
    }

    // 6. Floating Numbers
    for (const ft of this.floatingTexts) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.font = 'bold 18px "VT323", "Courier New", Courier, monospace';
      this.ctx.fillStyle = '#000000';
      this.ctx.fillText(ft.text, ft.x + 1, ft.y + 1);
      this.ctx.fillStyle = ft.color || '#2cd64e';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    }

    this.ctx.restore();
  }

  // --- HUD Updates ---
  updateHUD() {
    const formattedMoney = Math.floor(this.money).toLocaleString();
    const moneyDisplay = document.getElementById('hud-money-text');
    if (moneyDisplay) moneyDisplay.textContent = formattedMoney;

    // Folyamatos élő pénzkijelzés mindkét shopban is!
    const upgMoney = document.getElementById('upg-modal-money');
    if (upgMoney) upgMoney.textContent = formattedMoney;
    const bbMoney = document.getElementById('bb-modal-money');
    if (bbMoney) bbMoney.textContent = formattedMoney;

    const bbDisplay = document.getElementById('hud-bb-text');
    if (bbDisplay) bbDisplay.textContent = this.bb.toLocaleString();
    const bbModalBal = document.getElementById('bb-modal-balance');
    if (bbModalBal) bbModalBal.textContent = this.bb.toLocaleString();

    const btDisplay = document.getElementById('hud-boss-tokens-text');
    if (btDisplay) btDisplay.textContent = this.bossTokens.toLocaleString();

    this.updateBossTokenExchangeUI();

    const levelDisplay = document.getElementById('hud-level-text');
    if (levelDisplay) levelDisplay.textContent = this.level.toString();

    const maxBalls = this.getMaxBalls();
    const ballCountDisplay = document.getElementById('hud-balls-text');
    if (ballCountDisplay) ballCountDisplay.textContent = `${this.getTotalBalls()}/${maxBalls}`;

    const pirateActive = this.isPirateShopActive();
    for (const key in this.ballTypes) {
      const slot = document.getElementById(`ball-slot-${key}`);
      const priceText = document.getElementById(`ball-price-${key}`);
      if (slot && priceText) {
        const typeLimit = this.getMaxBallTypeLimit(key);
        const isTypeMaxed = (typeLimit !== null && this.ballTypes[key].count >= typeLimit);
        if (isTypeMaxed) {
          priceText.textContent = `MAX ${typeLimit}`;
          slot.classList.remove('affordable', 'pirate-free');
          slot.classList.add('maxed-slot');
        } else {
          slot.classList.remove('maxed-slot');
          const cost = this.getBallCost(key);
          priceText.textContent = pirateActive ? 'FREE!' : `$${this.formatNumber(cost)}`;
          const canAfford = this.money >= cost && this.getTotalBalls() < maxBalls;
          slot.classList.toggle('affordable', canAfford && !pirateActive);
          slot.classList.toggle('pirate-free', pirateActive && this.getTotalBalls() < maxBalls);
        }
      }
    }

    const rebirthBtn = document.getElementById('btn-rebirth-trigger');
    if (rebirthBtn) {
      const reqLvl = this.getRequiredRebirthLevel();
      rebirthBtn.style.display = 'flex';
      if (this.canRebirth()) {
        rebirthBtn.classList.remove('locked');
        rebirthBtn.textContent = `REBIRTH (LVL ${reqLvl}+)`;
        rebirthBtn.title = `Elérted a(z) ${reqLvl}. szintet! Bármikor újjászülethetsz!`;
      } else {
        rebirthBtn.classList.add('locked');
        rebirthBtn.textContent = `REBIRTH (LVL ${reqLvl})`;
        rebirthBtn.title = `Kattints a következő Rebirth jutalmainak megtekintéséhez (feloldás: LVL ${reqLvl})!`;
      }
    }

    document.title = `LVL ${this.level} | $${this.formatNumber(Math.floor(this.money))} - Idle Block Breaker 2.0`;
  }

  // --- Boss Token Exchange (5 Boss Token ➔ +1 BB) ---
  updateBossTokenExchangeUI() {
    const canExchange = this.bossTokens >= this.BOSS_TOKEN_COST;

    const upgCount = document.getElementById('upg-boss-tokens');
    if (upgCount) upgCount.textContent = this.bossTokens.toLocaleString();

    const bbCount = document.getElementById('bb-modal-boss-tokens');
    if (bbCount) bbCount.textContent = this.bossTokens.toLocaleString();

    for (const btnId of ['btn-exchange-tokens-upg', 'btn-exchange-tokens-bb']) {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.disabled = !canExchange;
        btn.classList.toggle('affordable', canExchange);
      }
    }
  }

  exchangeBossTokensForBB() {
    if (this.bossTokens < this.BOSS_TOKEN_COST) return;
    this.bossTokens -= this.BOSS_TOKEN_COST;
    this.bb += 1;

    if (window.soundEngine) window.soundEngine.playLevelUp();
    this.showToast(`👑 <strong>${this.BOSS_TOKEN_COST} Boss Token beváltva ➔ <span style="color:#fde047;">+1 BB!</span></strong>`, 3000);
    this.updateHUD();
    this.refreshOpenModals();
    this.save();
    this.syncWalletChangeNow(true);
    if (this.cloud && this.cloud.currentUser) this.cloud.scheduleLiveCloudSync(1200);
  }

  formatNumber(num) {
    const n = Number(num) || 0;
    if (n === 0) return '0';
    if (Math.abs(n) < 1000) return Math.round(n).toString();
    const units = [
      { v: 1e18, s: 'Qi' },
      { v: 1e15, s: 'Qa' },
      { v: 1e12, s: 'T' },
      { v: 1e9, s: 'B' },
      { v: 1e6, s: 'M' },
      { v: 1e3, s: 'K' }
    ];
    for (const u of units) {
      if (Math.abs(n) >= u.v) return (n / u.v).toFixed(1) + u.s;
    }
    return Math.round(n).toString();
  }

  formatApproxMoney(num) {
    const v = Math.max(0, Number(num) || 0);
    if (v === 0) return '~$0';
    if (v < 1000) {
      const rounded = v < 100 ? Math.round(v / 10) * 10 : Math.round(v / 50) * 50;
      return `~$${Math.max(10, rounded)}`;
    }
    const units = [
      { val: 1e18, s: 'Qi' },
      { val: 1e15, s: 'Qa' },
      { val: 1e12, s: 'T' },
      { val: 1e9, s: 'B' },
      { val: 1e6, s: 'M' },
      { val: 1e3, s: 'K' }
    ];
    for (const u of units) {
      if (v >= u.val) {
        const q = v / u.val;
        return `~$${v >= u.val * 100 ? Math.round(q) : q.toFixed(1).replace(/\.0$/, '')}${u.s}`;
      }
    }
    return `~$${Math.round(v)}`;
  }

  estimateApproxMoney(level, rebirths) {
    const lvl = Math.max(1, Number(level) || 1);
    const mult = this.getRebirthMultiplier(Math.max(0, Number(rebirths) || 0));
    return Math.round(((lvl * lvl * 42) + (Math.floor(lvl / 10) * 18000)) * mult * 1.8);
  }

  refreshOpenModals() {
    const upgModal = document.getElementById('upgrades-modal');
    if (upgModal && upgModal.classList.contains('open')) {
      this.renderUpgradesMenu();
    }
    const bbModal = document.getElementById('powerup-upgrades-modal');
    if (bbModal && bbModal.classList.contains('open')) {
      this.renderPowerUpUpgradesModal();
    }
  }

  isMobileUpgradesCarouselMode() {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(max-width: 980px), (hover: none) and (pointer: coarse) and (max-width: 1180px)').matches;
  }

  stepMobileUpgradeCard(delta) {
    const total = this._lastUpgradeCardCount || 0;
    if (total <= 1) return;
    this.activeUpgradeCardIndex = (this.activeUpgradeCardIndex + delta + total) % total;
    this.renderUpgradesMenu();
    if (window.soundEngine) window.soundEngine.playClickHit();
  }

  // --- $ Upgrades Menu Rendering (Balls + Click Power + Pierce Ball $ Speed Upgrade) ---
  renderUpgradesMenu() {
    this.updateBossTokenExchangeUI();
    const upgMoney = document.getElementById('upg-modal-money');
    if (upgMoney) upgMoney.textContent = Math.floor(this.money).toLocaleString();
    const container = document.getElementById('upgrades-content-grid');
    if (!container) return;
    container.innerHTML = '';
    const builtCards = [];

    // Discount / Pirate Shop Banner
    const discBanner = document.getElementById('upgrades-discount-banner');
    if (discBanner) {
      if (this.isPirateShopActive()) {
        discBanner.style.display = 'block';
        discBanner.className = 'discount-banner pirate-active';
        discBanner.textContent = '🏴‍☠️ PIRATE SHOP AKTÍV: MINDEN INGYENES!';
      } else if (this.isPowerUpActive('discount')) {
        const pct = this.activePowerUps['discount'].extra?.discountPct ?? 0;
        discBanner.style.display = 'block';
        discBanner.className = 'discount-banner';
        discBanner.textContent = `🏷️ KEDVEZMÉNY AKTÍV: -${pct}%`;
      } else {
        discBanner.style.display = 'none';
      }
    }

    const pirateActive = this.isPirateShopActive();
    const fmtStat = (n) => Number.isInteger(n) ? n.toLocaleString('hu-HU') : Number(n.toFixed(2)).toString();
    const calcBarPct = (lvl, maxLvl) => {
      const ratio = Math.max(0, Math.min(1, (lvl - 1) / Math.max(1, maxLvl - 1)));
      return Math.round(8 + ratio * 92);
    };

    for (const key in this.ballTypes) {
      const b = this.ballTypes[key];
      if (b.count === 0) continue;

      const col = document.createElement('div');
      col.className = 'ball-upgrade-section';

      const spdMaxed = b.speedLevel >= b.maxSpeedLevel;
      const pwrMaxed = b.powerLevel >= b.maxPowerLevel;
      const isCoinBall = (key === 'coin');

      const curSpd = this.getBallSpeed(key);
      const spdStep = this.getBallSpeedStep(key);
      const displaySpdStep = b.displaySpeedStepPct || 5;
      const displaySpdPct = Math.round(b.speedFactor * 100) + (b.speedLevel - 1) * displaySpdStep;
      const spdPct = calcBarPct(b.speedLevel, b.maxSpeedLevel);
      const spdNextPct = spdMaxed ? spdPct : Math.max(spdPct + 4, Math.min(100, calcBarPct(b.speedLevel + 1, b.maxSpeedLevel)));

      const curPwr = isCoinBall ? this.getCoinBallRewardPerHit() : this.getBallPower(key);
      const pwrStep = isCoinBall ? 1 : b.powerStep;
      const basePwrPct = (key === 'speedy') ? 50 : 100;
      const displayPwrStepPct = isCoinBall ? 0 : Math.round((b.powerStep / b.basePower) * basePwrPct);
      const displayPwrPct = basePwrPct + (b.powerLevel - 1) * displayPwrStepPct;
      const pwrPct = calcBarPct(b.powerLevel, b.maxPowerLevel);
      const pwrNextPct = pwrMaxed ? pwrPct : Math.max(pwrPct + 4, Math.min(100, calcBarPct(b.powerLevel + 1, b.maxPowerLevel)));

      const spdCost = this.getSpeedUpgradeCost(key);
      const pwrCost = this.getPowerUpgradeCost(key);
      const canAffordSpeed = !spdMaxed && this.money >= spdCost;
      const canAffordPower = !pwrMaxed && this.money >= pwrCost;

      const spdClass = spdMaxed
        ? 'maxed-upg-btn'
        : (pirateActive ? 'pirate-free' : (canAffordSpeed ? 'affordable' : ''));
      const pwrClass = pwrMaxed
        ? 'maxed-upg-btn'
        : (pirateActive ? 'pirate-free' : (canAffordPower ? 'affordable' : ''));

      const typeLimit = this.getMaxBallTypeLimit(key);
      const btItem = this.getBTAbilityCatalogItem(key);
      const baseMaxed = spdMaxed && pwrMaxed;
      let btBtnHtml = '';
      if (btItem) {
        const btLvl = this.btUpgrades[key] || 0;
        const btMax = btItem.costs.length;
        const btIsMax = btLvl >= btMax;
        const btCost = btIsMax ? null : btItem.costs[btLvl];
        const canBuyBT = baseMaxed && !btIsMax && this.bossTokens >= btCost;
        const btCls = btIsMax ? 'maxed-upg-btn' : (canBuyBT ? 'affordable' : '');
        const reqLabel = isCoinBall ? 'Speed+Coin' : 'Speed+Power';
        const bottomLabel = btIsMax
          ? 'MAX'
          : (!baseMaxed ? `🔒 MAX ${reqLabel} (${btCost} BT)` : `${btCost} BT`);
        btBtnHtml = `
          <div id="wrap-upg-bt-${key}" class="ball-bt-wrap">
            <button class="ball-bt-btn ${btCls}" id="btn-upg-bt-${key}" ${(!canBuyBT || btIsMax) ? 'disabled' : ''}>
              <div class="btn-top-info">👑 Ability ${btLvl}/${btMax}</div>
              <div class="btn-cost-bottom" style="font-size:${!baseMaxed && !btIsMax ? '12px' : '15px'};">${bottomLabel}</div>
            </button>
          </div>
        `;
      }

      const coinThresholds = isCoinBall ? this.getCoinBallTokenThresholds() : null;
      const coinDescExtra = coinThresholds
        ? ` • 👑 ${this.coinBtHitCounter || 0}/${coinThresholds.btHits} | ⭐ ${this.coinBbHitCounter || 0}/${coinThresholds.bbHits}`
        : '';

      col.innerHTML = `
        <div class="ball-card-info-col">
          <div class="ball-card-head">
            <div class="ball-title-label">
              <span class="ball-count-badge">(x${b.count}${typeLimit !== null ? '/' + typeLimit : ''})</span>
              <span class="ball-card-name">${b.name}</span>
              <span class="ball-card-desc">${b.shortDesc}${coinDescExtra}</span>
            </div>
            <div class="ball-dot ball-icon-${key}"></div>
          </div>

          <div class="ball-stat-chart" aria-label="${b.name} statisztikák">
            <div class="stat-col-item">
              <div class="stat-col-val">${displaySpdPct}%</div>
              <div class="stat-col-track">
                ${!spdMaxed ? `<div class="stat-col-preview speed-preview" style="height: ${spdNextPct}%;"></div>` : ''}
                <div class="stat-col-fill speed-fill" style="height: ${spdPct}%;"></div>
              </div>
              <div class="stat-col-label">⚡ SEB.</div>
              <div class="stat-col-gain">${spdMaxed ? 'MAX' : `+${displaySpdStep}%`}</div>
            </div>
            <div class="stat-col-item">
              <div class="stat-col-val">${isCoinBall ? '$' + fmtStat(curPwr) : displayPwrPct + '%'}</div>
              <div class="stat-col-track">
                ${!pwrMaxed ? `<div class="stat-col-preview ${isCoinBall ? 'coin-preview' : 'power-preview'}" style="height: ${pwrNextPct}%;"></div>` : ''}
                <div class="stat-col-fill ${isCoinBall ? 'coin-fill' : 'power-fill'}" style="height: ${pwrPct}%;"></div>
              </div>
              <div class="stat-col-label">${isCoinBall ? '🪙 PÉNZ/ÜT' : '💥 SEBZÉS'}</div>
              <div class="stat-col-gain">${pwrMaxed ? 'MAX' : (isCoinBall ? '+$1' : '+' + displayPwrStepPct + '%')}</div>
            </div>
          </div>
        </div>

        <div class="ball-card-actions-col">
          <div class="ball-upg-btn-grid">
            <button class="ball-upgrade-btn ${spdClass}" id="btn-upg-spd-${key}" ${spdMaxed ? 'disabled' : ''}>
              <div class="btn-top-info">${spdMaxed ? `Speed MAX (${b.maxSpeedLevel})` : `Speed ${b.speedLevel}/${b.maxSpeedLevel} (+${displaySpdStep}%)`}</div>
              <div class="btn-cost-bottom">${spdMaxed ? 'MAX' : (pirateActive ? 'FREE!' : '$' + this.formatNumber(spdCost))}</div>
            </button>

            <button class="ball-upgrade-btn ${pwrClass}" id="btn-upg-pwr-${key}" ${pwrMaxed ? 'disabled' : ''}>
              <div class="btn-top-info">${pwrMaxed ? (isCoinBall ? `Coin MAX ($${b.maxPowerLevel}/üt)` : `Power MAX (${b.maxPowerLevel})`) : (isCoinBall ? `Coin ${b.powerLevel}/${b.maxPowerLevel} (+$1/üt)` : `Power ${b.powerLevel}/${b.maxPowerLevel} (+${displayPwrStepPct}%)`)}</div>
              <div class="btn-cost-bottom">${pwrMaxed ? 'MAX' : (pirateActive ? 'FREE!' : '$' + this.formatNumber(pwrCost))}</div>
            </button>
          </div>

          ${btBtnHtml}

          <button class="delete-ball-btn" id="btn-del-ball-${key}">DELETE x1</button>
        </div>
      `;

      builtCards.push({ label: b.name, el: col });

      if (!spdMaxed) col.querySelector(`#btn-upg-spd-${key}`).addEventListener('click', () => this.upgradeBallSpeed(key));
      if (!pwrMaxed) col.querySelector(`#btn-upg-pwr-${key}`).addEventListener('click', () => this.upgradeBallPower(key));
      if (btItem) {
        const btWrap = col.querySelector(`#wrap-upg-bt-${key}`);
        const btBtn = col.querySelector(`#btn-upg-bt-${key}`);
        const btLvl = this.btUpgrades[key] || 0;
        const lockNote = (!baseMaxed && btLvl < btItem.costs.length)
          ? (isCoinBall
              ? '🔒 Először maxold ki a labda Speed és Coin/ütközés fejlesztéseit!'
              : '🔒 Először maxold ki a labda Speed és Power fejlesztéseit!')
          : null;
        if (btWrap) {
          btWrap.addEventListener('mouseenter', (e) => this.showBBPhaseTooltip(btItem, btLvl, e, 'BT', btItem.costs, lockNote));
          btWrap.addEventListener('mousemove', (e) => this.positionBBPhaseTooltip(e));
          btWrap.addEventListener('mouseleave', () => this.hideBBPhaseTooltip());
        }
        if (btBtn && baseMaxed && btLvl < btItem.costs.length) {
          btBtn.addEventListener('click', () => {
            this.hideBBPhaseTooltip();
            this.buyBTAbilityUpgrade(key);
          });
        }
      }
      col.querySelector(`#btn-del-ball-${key}`).addEventListener('click', () => this.deleteBall(key));
    }

    // Pierce Ball Separate $ Speed Upgrade (Unlocked at Pierce Ball BB Level 5: 1M, 5M, 10M...)
    if (this.bbUpgrades.piercing >= 5) {
      const pierceMaxed = this.pierceSpeedUpgradeLevel >= this.MAX_PIERCE_SPEED_LEVEL;
      const pCost = this.getPierceSpeedUpgradeCost();
      const canAffordPierce = !pierceMaxed && this.money >= pCost;
      const curMult = this.getPermanentPierceSpeedMult().toFixed(1);
      const nextMult = (this.getPermanentPierceSpeedMult() + 0.5).toFixed(1);
      const pPct = Math.round(8 + (this.pierceSpeedUpgradeLevel / Math.max(1, this.MAX_PIERCE_SPEED_LEVEL)) * 92);
      const pNextPct = pierceMaxed ? pPct : Math.max(pPct + 4, Math.min(100, Math.round(8 + ((this.pierceSpeedUpgradeLevel + 1) / Math.max(1, this.MAX_PIERCE_SPEED_LEVEL)) * 92)));
      const pClass = pierceMaxed
        ? 'maxed-upg-btn'
        : (pirateActive ? 'pirate-free' : (canAffordPierce ? 'affordable' : ''));

      const pierceCol = document.createElement('div');
      pierceCol.className = 'ball-upgrade-section';
      pierceCol.innerHTML = `
        <div class="ball-card-info-col">
          <div class="ball-card-head">
            <div class="ball-title-label">
              <span class="ball-count-badge" style="color: #b45309;">PIERCE LVL 5 BONUS</span>
              <span class="ball-card-name">⚡ PIERCE SPEED</span>
              <span class="ball-card-desc">Külön áttörő sebesség</span>
            </div>
            <div style="font-size: 20px;">⚡</div>
          </div>

          <div class="ball-stat-chart single-col">
            <div class="stat-col-item">
              <div class="stat-col-val">${curMult}x</div>
              <div class="stat-col-track">
                ${!pierceMaxed ? `<div class="stat-col-preview speed-preview" style="height: ${pNextPct}%;"></div>` : ''}
                <div class="stat-col-fill speed-fill" style="height: ${pPct}%;"></div>
              </div>
              <div class="stat-col-label">⚡ ÁTTÖRŐ</div>
              <div class="stat-col-gain">${pierceMaxed ? 'MAX' : '+0.5x'}</div>
            </div>
          </div>
        </div>

        <div class="ball-card-actions-col">
          <button class="ball-upgrade-btn ${pClass}" id="btn-upg-pierce-spd" ${pierceMaxed ? 'disabled' : ''}>
            <div class="btn-top-info">${pierceMaxed ? `${curMult}x (LVL ${this.MAX_PIERCE_SPEED_LEVEL})` : `${curMult}x >> ${nextMult}x`}</div>
            <div class="btn-cost-bottom">${pierceMaxed ? 'MAX' : (pirateActive ? 'FREE!' : '$' + this.formatNumber(pCost))}</div>
          </button>
        </div>
      `;
      builtCards.push({ label: '⚡ PIERCE SPEED', el: pierceCol });
      if (!pierceMaxed) pierceCol.querySelector('#btn-upg-pierce-spd').addEventListener('click', () => this.upgradePierceSpeed());
    }

    // Manual Click Power Upgrade
    const clickMaxed = this.clickUpgradeLevel >= this.MAX_CLICK_LEVEL;
    const clickCost = this.getClickUpgradeCost();
    const canAffordClick = !clickMaxed && this.money >= clickCost;
    const clickPct = calcBarPct(this.clickUpgradeLevel, this.MAX_CLICK_LEVEL);
    const clickNextPct = clickMaxed ? clickPct : Math.max(clickPct + 4, Math.min(100, calcBarPct(this.clickUpgradeLevel + 1, this.MAX_CLICK_LEVEL)));
    const clickClass = clickMaxed
      ? 'maxed-upg-btn'
      : (pirateActive ? 'pirate-free' : (canAffordClick ? 'affordable' : ''));

    const displayClickPct = this.clickPower * 100;
    const clickCol = document.createElement('div');
    clickCol.className = 'ball-upgrade-section';
    clickCol.innerHTML = `
      <div class="ball-card-info-col">
        <div class="ball-card-head">
          <div class="ball-title-label">
            <span class="ball-count-badge">MANUAL</span>
            <span class="ball-card-name">CLICK POWER</span>
            <span class="ball-card-desc">Kattintás sebzése</span>
          </div>
          <div style="font-size: 20px;">👆</div>
        </div>

        <div class="ball-stat-chart single-col">
          <div class="stat-col-item">
            <div class="stat-col-val">${displayClickPct}%</div>
            <div class="stat-col-track">
              ${!clickMaxed ? `<div class="stat-col-preview power-preview" style="height: ${clickNextPct}%;"></div>` : ''}
              <div class="stat-col-fill power-fill" style="height: ${clickPct}%;"></div>
            </div>
            <div class="stat-col-label">👆 SEBZÉS</div>
            <div class="stat-col-gain">${clickMaxed ? 'MAX' : '+100%'}</div>
          </div>
        </div>
      </div>

      <div class="ball-card-actions-col">
        <button class="ball-upgrade-btn ${clickClass}" id="btn-upg-click" ${clickMaxed ? 'disabled' : ''}>
          <div class="btn-top-info">${clickMaxed ? `Click ${this.MAX_CLICK_LEVEL}/${this.MAX_CLICK_LEVEL}` : `Click ${this.clickUpgradeLevel}/${this.MAX_CLICK_LEVEL} (+100%)`}</div>
          <div class="btn-cost-bottom">${clickMaxed ? 'MAX' : (pirateActive ? 'FREE!' : '$' + this.formatNumber(clickCost))}</div>
        </button>
      </div>
    `;

    builtCards.push({ label: 'CLICK POWER', el: clickCol });
    if (!clickMaxed) clickCol.querySelector('#btn-upg-click').addEventListener('click', () => this.upgradeClick());

    this._lastUpgradeCardCount = builtCards.length;
    if (this.activeUpgradeCardIndex >= builtCards.length) {
      this.activeUpgradeCardIndex = Math.max(0, builtCards.length - 1);
    }
    if (this.activeUpgradeCardIndex < 0) this.activeUpgradeCardIndex = 0;

    const useMobileCarousel = this.isMobileUpgradesCarouselMode();
    const mobileNav = document.getElementById('upgrades-mobile-nav');
    const prevBtn = document.getElementById('btn-upg-prev');
    const nextBtn = document.getElementById('btn-upg-next');
    const indicatorEl = document.getElementById('upg-mobile-indicator');

    container.classList.toggle('mobile-carousel-mode', useMobileCarousel);

    if (useMobileCarousel && builtCards.length > 0) {
      const current = builtCards[this.activeUpgradeCardIndex];
      container.appendChild(current.el);
      if (mobileNav) mobileNav.style.display = 'flex';
      if (indicatorEl) indicatorEl.textContent = `${this.activeUpgradeCardIndex + 1} / ${builtCards.length} • ${current.label}`;
      const disableNav = builtCards.length <= 1;
      if (prevBtn) prevBtn.disabled = disableNav;
      if (nextBtn) nextBtn.disabled = disableNav;
    } else {
      for (const item of builtCards) {
        container.appendChild(item.el);
      }
      if (mobileNav) mobileNav.style.display = 'none';
    }
  }

  // --- All-Phases & Currency Hover Tooltip (slightly translucent + top-right X button!) ---
  renderTooltipBox(titleHtml, bodyHtml, mouseEvent) {
    const tooltip = document.getElementById('bb-phase-tooltip');
    if (!tooltip) return;

    tooltip.innerHTML = `
      <div class="bb-phase-tooltip-header">
        <div class="bb-phase-tooltip-title">${titleHtml}</div>
        <button class="tooltip-close-x" id="btn-close-tooltip" type="button" aria-label="Bezárás">✕</button>
      </div>
      ${bodyHtml}
    `;

    const closeBtn = tooltip.querySelector('#btn-close-tooltip');
    if (closeBtn) {
      closeBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.hideBBPhaseTooltip();
      });
    }

    tooltip.classList.add('visible');
    this.positionBBPhaseTooltip(mouseEvent);
  }

  showBBPhaseTooltip(item, curLvl, mouseEvent, currency = 'BB', costsArr = BB_UPGRADE_COSTS, lockNote = null) {
    this.activeTooltipKind = null;
    let bodyHtml = `<div style="font-size:13px; color:#94a3b8; margin-bottom:5px;">${item.baseDesc}</div>`;
    if (lockNote) {
      bodyHtml += `<div style="font-size:13px; color:#fca5a5; background:rgba(239,68,68,0.18); border-left:3px solid #ef4444; padding:3px 5px; margin-bottom:5px;">${lockNote}</div>`;
    }

    for (let i = 0; i < item.levels.length; i++) {
      const phaseNum = i + 1;
      const cost = costsArr[i];
      const isUnlocked = curLvl >= phaseNum;
      const isNext = curLvl + 1 === phaseNum;
      const cls = isUnlocked ? 'unlocked' : (isNext ? 'next-phase' : '');
      const prefix = isUnlocked ? '✅ ' : (isNext ? '➔ ' : '🔒 ');

      bodyHtml += `
        <div class="bb-phase-row ${cls}">
          <strong>${prefix}Phase ${phaseNum} (${cost} ${currency}):</strong> ${item.levels[i]}
        </div>
      `;
    }

    this.renderTooltipBox(`${item.icon} ${item.name} – Összes Fázis`, bodyHtml, mouseEvent);
  }

  showCurrencyTooltip(kind, mouseEvent) {
    this.activeTooltipKind = null;
    const infos = {
      money: {
        title: '💵 Pénz ($)',
        body: `
          <div class="bb-phase-row unlocked"><strong>Mi ez?</strong> A játék alap fizetőeszköze.</div>
          <div class="bb-phase-row next-phase"><strong>Hogyan szerezhető?</strong> Blokkok és Bossok sebzésével/kiütésével, valamint kerek coinok begyűjtésével.</div>
          <div class="bb-phase-row"><strong>Mire jó?</strong> Új labdák vásárlására felül, illetve a labdák (Speed, Power) és a Click Power fejlesztésére az <strong>UPGRADES</strong> menüben.</div>
        `
      },
      bb: {
        title: '⭐ Breakout Badge (BB)',
        body: `
          <div class="bb-phase-row unlocked"><strong>Mi ez?</strong> Ritka, <strong>Rebirth után is megmaradó</strong> prémium valuta.</div>
          <div class="bb-phase-row next-phase"><strong>Hogyan szerezhető?</strong> Rebirth-tel (+1 BB), 5 Boss Token beváltásával (5 BT ➔ 1 BB), vagy Lvl 5 Quick Time Money coinokkal.</div>
          <div class="bb-phase-row"><strong>Mire jó?</strong> Tartós kattintás- és power-up fejlesztésekre a <strong>⚡ POWERUP UPGRADES</strong> menüben (1, 3, 5, 7, 10 BB).</div>
        `
      },
      bt: {
        title: '👑 Boss Token (BT)',
        body: `
          <div class="bb-phase-row unlocked"><strong>Mi ez?</strong> Különleges Boss valuta, amely <strong>Rebirth után is megmarad</strong>!</div>
          <div class="bb-phase-row next-phase"><strong>Hogyan szerezhető?</strong> Minden Boss blokk legyőzése után automatikusan kapsz <strong>+1 BT</strong>-t.</div>
          <div class="bb-phase-row"><strong>Mire jó?</strong> Beváltóható BB-re (<strong>5 BT ➔ 1 BB</strong>), illetve kimaxolt labdák (Poison, Ghost, Multiply, Rocket) különleges képességeinek fejlesztésére az <strong>UPGRADES</strong> menüben!</div>
        `
      }
    };

    const info = infos[kind];
    if (!info) return;
    this.renderTooltipBox(info.title, info.body, mouseEvent);
  }

  // --- December 24 Event Countdown + Prize Info ---
  getDec24CountdownInfo() {
    const now = new Date();
    let year = now.getFullYear();
    const targetEnd = new Date(year, 11, 24, 23, 59, 59);
    if (now > targetEnd) {
      year += 1;
    }

    const dec24 = new Date(year, 11, 24, 0, 0, 0);
    const diffMs = dec24.getTime() - now.getTime();
    if (diffMs <= 0) {
      return {
        finished: true,
        timerStr: '🎄 DEC. 24. — MA VAN A SORSOLÁS!'
      };
    }

    const totalSec = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n) => String(n).padStart(2, '0');

    return {
      finished: false,
      timerStr: `${days} nap ${pad(hours)}:${pad(mins)}:${pad(secs)}`
    };
  }

  updateDec24CountdownUI() {
    const info = this.getDec24CountdownInfo();
    document.querySelectorAll('.dec24-countdown-text').forEach((el) => {
      el.textContent = info.timerStr;
    });
    this.updateGuestRetentionUI();
    const now = Date.now();
    if (now - (this._lastGuestExpiryCheck || 0) >= 30000) {
      this._lastGuestExpiryCheck = now;
      this.checkGuestExpiration(false);
    }
  }

  startDec24Countdown() {
    this.updateDec24CountdownUI();
    if (this.dec24TimerInterval) clearInterval(this.dec24TimerInterval);
    this.dec24TimerInterval = setInterval(() => this.updateDec24CountdownUI(), 1000);
  }

  showDec24EventTooltip(mouseEvent, sourceId = 'dec24') {
    const tooltip = document.getElementById('bb-phase-tooltip');
    if (tooltip && tooltip.classList.contains('visible') && this.activeTooltipKind === sourceId) {
      this.hideBBPhaseTooltip();
      return;
    }

    const info = this.getDec24CountdownInfo();
    const bodyHtml = `
      <div class="bb-phase-row next-phase" style="text-align:center; padding:6px;">
        ⏳ <strong>Visszaszámláló Dec. 24-ig:</strong><br>
        <strong class="dec24-countdown-text" style="font-size:18px; color:#ffffff;">${info.timerStr}</strong>
      </div>
      <div class="bb-phase-row unlocked" style="margin-top:4px; line-height:1.3;">
        🏆 <strong>A Leaderboard TOP 1</strong> játékosa December 24-én <strong>INGYEN</strong> megkapja a <strong>Prémium Breaker Pass-t</strong>!
      </div>
    `;
    this.activeTooltipKind = sourceId;
    this.renderTooltipBox('🎄 DECEMBER 24. ESEMÉNY', bodyHtml, mouseEvent);
  }

  positionBBPhaseTooltip(mouseEvent) {
    const tooltip = document.getElementById('bb-phase-tooltip');
    if (!tooltip || !tooltip.classList.contains('visible')) return;

    const pad = 10;
    const tipRect = tooltip.getBoundingClientRect();
    const isCompactMobile = window.innerWidth <= 980 || window.innerHeight <= 540;

    let x, y;
    if (isCompactMobile) {
      // Telefonon fektetve mindig a kattintott oldallal ELLENTÉTES szélre helyezzük,
      // hogy ne takarja ki a képernyő közepét és kényelmesen bezárható legyen az X-szel!
      const clickOnLeft = (mouseEvent.clientX || 0) < window.innerWidth / 2;
      x = clickOnLeft ? (window.innerWidth - tipRect.width - pad) : pad;
      y = Math.max(pad, Math.min(window.innerHeight - tipRect.height - pad, 46));
    } else {
      x = mouseEvent.clientX + 16;
      y = mouseEvent.clientY + 16;
      if (x + tipRect.width > window.innerWidth - pad) {
        x = mouseEvent.clientX - tipRect.width - 16;
      }
      if (y + tipRect.height > window.innerHeight - pad) {
        y = window.innerHeight - tipRect.height - pad;
      }
      x = Math.max(pad, x);
      y = Math.max(pad, y);
    }

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  hideBBPhaseTooltip() {
    this.activeTooltipKind = null;
    const tooltip = document.getElementById('bb-phase-tooltip');
    if (tooltip) tooltip.classList.remove('visible');
  }

  switchBBModalTab(tab) {
    this.activeBBTab = (tab === 'fixed') ? 'fixed' : 'upgrades';
    const upgBtn = document.getElementById('btn-bb-tab-upgrades');
    const fixBtn = document.getElementById('btn-bb-tab-fixed');
    if (upgBtn) upgBtn.classList.toggle('active', this.activeBBTab === 'upgrades');
    if (fixBtn) fixBtn.classList.toggle('active', this.activeBBTab === 'fixed');
    this.hideBBPhaseTooltip();
    this.renderPowerUpUpgradesModal();
    if (window.soundEngine) window.soundEngine.playClickHit();
  }

  stepMobileBBCard(delta) {
    const isFixed = this.activeBBTab === 'fixed';
    const total = isFixed ? FIXED_POWERUPS_GUIDE.length : BB_UPGRADE_CATALOG.length;
    if (total <= 1) return;
    if (isFixed) {
      this.activeFixedCardIndex = ((this.activeFixedCardIndex || 0) + delta + total) % total;
    } else {
      this.activeBBCardIndex = ((this.activeBBCardIndex || 0) + delta + total) % total;
    }
    this.renderPowerUpUpgradesModal();
    if (window.soundEngine) window.soundEngine.playClickHit();
  }

  // --- POWERUP UPGRADES (BB) Modal Rendering ---
  renderPowerUpUpgradesModal() {
    const balanceEl = document.getElementById('bb-modal-balance');
    if (balanceEl) balanceEl.textContent = this.bb.toLocaleString();
    const bbMoney = document.getElementById('bb-modal-money');
    if (bbMoney) bbMoney.textContent = Math.floor(this.money).toLocaleString();
    this.updateBossTokenExchangeUI();

    const isFixedTab = this.activeBBTab === 'fixed';
    const upgBtn = document.getElementById('btn-bb-tab-upgrades');
    const fixBtn = document.getElementById('btn-bb-tab-fixed');
    if (upgBtn) upgBtn.classList.toggle('active', !isFixedTab);
    if (fixBtn) fixBtn.classList.toggle('active', isFixedTab);

    const upgPane = document.getElementById('bb-tab-upgrades-pane');
    const fixPane = document.getElementById('bb-tab-fixed-pane');
    if (upgPane) upgPane.style.display = isFixedTab ? 'none' : 'block';
    if (fixPane) fixPane.style.display = isFixedTab ? 'block' : 'none';

    const useCarousel = this.isMobileUpgradesCarouselMode();
    const modalWin = document.querySelector('#powerup-upgrades-modal .bb-modal-window');
    if (modalWin) modalWin.classList.toggle('has-bb-carousel', useCarousel);

    const mobileNav = document.getElementById('bb-upgrades-mobile-nav');
    const prevBtn = document.getElementById('btn-bb-prev');
    const nextBtn = document.getElementById('btn-bb-next');
    const indEl = document.getElementById('bb-mobile-indicator');

    const grid = document.getElementById('bb-upgrades-grid');
    if (grid) {
      grid.innerHTML = '';
      grid.classList.toggle('mobile-carousel-mode', useCarousel);

      if (!isFixedTab) {
        if (this.activeBBCardIndex >= BB_UPGRADE_CATALOG.length) this.activeBBCardIndex = 0;
        const itemsToRender = useCarousel
          ? [BB_UPGRADE_CATALOG[this.activeBBCardIndex]]
          : BB_UPGRADE_CATALOG;

        for (const item of itemsToRender) {
          if (!item) continue;
          const curLvl = this.bbUpgrades[item.key] || 0;
          const isMax = curLvl >= 5;
          const cost = isMax ? null : BB_UPGRADE_COSTS[curLvl];
          const canAfford = !isMax && this.bb >= cost;

          const card = document.createElement('div');
          card.className = 'bb-upgrade-card';

          let pipsHtml = '';
          for (let i = 1; i <= 5; i++) {
            const filled = i <= curLvl ? 'filled' : '';
            const maxed = isMax ? 'maxed' : '';
            pipsHtml += `<div class="bb-pip ${filled} ${maxed}"></div>`;
          }

          const currentDesc = curLvl === 0
            ? item.baseDesc
            : `<strong>Aktuális (Phase ${curLvl}):</strong> ${item.levels[curLvl - 1]}`;

          const nextHtml = isMax
            ? `<div class="bb-card-next" style="border-left-color:#2cd64e;">✅ Maximális szint elérve!</div>`
            : `<div class="bb-card-next"><strong>Következő (Phase ${curLvl + 1}):</strong> ${item.levels[curLvl]}</div>`;

          const phasesMiniHtml = item.levels.map((txt, idx) => {
            const unlocked = curLvl >= (idx + 1);
            return `<div>${unlocked ? '✅' : '•'} <strong>P${idx + 1}:</strong> ${txt}</div>`;
          }).join('');

          const btnClass = isMax
            ? 'bb-buy-btn maxed-btn'
            : (canAfford ? 'bb-buy-btn affordable' : 'bb-buy-btn');
          const btnText = isMax ? 'MAX SZINT' : `FEJLESZTÉS (${cost} BB)`;

          card.innerHTML = `
            <div class="bb-card-main-col">
              <div class="bb-card-header">
                <div class="bb-card-title"><span>${item.icon}</span><span>${item.name}</span></div>
                <div class="bb-card-lvl-tag">LVL ${curLvl}/5</div>
              </div>
              <div class="bb-pips-row" style="margin: 4px 0;">${pipsHtml}</div>
              <div class="bb-card-desc">${currentDesc}</div>
              <div style="margin-top: 4px;">${nextHtml}</div>
            </div>
            <div class="bb-card-action-col">
              <div class="bb-card-phases-mini">${phasesMiniHtml}</div>
              <button class="${btnClass}" id="btn-bb-upg-${item.key}" ${(!canAfford || isMax) ? 'disabled' : ''}>${btnText}</button>
            </div>
          `;

          card.addEventListener('mouseenter', (e) => {
            if (!this.isMobileUpgradesCarouselMode()) this.showBBPhaseTooltip(item, curLvl, e);
          });
          card.addEventListener('mousemove', (e) => {
            if (!this.isMobileUpgradesCarouselMode() && window.innerWidth > 980 && window.innerHeight > 540) {
              this.positionBBPhaseTooltip(e);
            }
          });
          card.addEventListener('mouseleave', () => {
            if (!this.isMobileUpgradesCarouselMode() && window.innerWidth > 980 && window.innerHeight > 540) {
              this.hideBBPhaseTooltip();
            }
          });

          grid.appendChild(card);

          if (!isMax) {
            const btn = card.querySelector(`#btn-bb-upg-${item.key}`);
            if (btn) {
              btn.addEventListener('click', () => {
                this.hideBBPhaseTooltip();
                this.buyBBUpgrade(item.key);
              });
            }
          }
        }
      }
    }

    // Elkülönített rész: Fix & Nem Fejleszthető Power-upok útmutatója
    const nonUpgGrid = document.getElementById('bb-nonupgradable-grid');
    if (nonUpgGrid) {
      nonUpgGrid.innerHTML = '';
      nonUpgGrid.classList.toggle('mobile-carousel-mode', useCarousel);

      if (isFixedTab) {
        if (this.activeFixedCardIndex >= FIXED_POWERUPS_GUIDE.length) this.activeFixedCardIndex = 0;
        const fixedItems = useCarousel
          ? [FIXED_POWERUPS_GUIDE[this.activeFixedCardIndex]]
          : FIXED_POWERUPS_GUIDE;

        for (const item of fixedItems) {
          if (!item) continue;
          const card = document.createElement('div');
          card.className = `bb-upgrade-card non-upgradable-card ${item.isGoldSpecial ? 'gold-level-card' : ''}`;
          const statusText = item.statusFn ? item.statusFn(this) : '';
          const isLockedGold = item.key === 'gold_level' && this.rebirthCount <= 15;
          const isPerm = item.category === 'perm';
          const catBadge = isPerm
            ? '<div class="bb-fixed-cat-tag is-perm">🔒 FIX POWER-UP</div>'
            : '<div class="bb-fixed-cat-tag is-drop">🎲 ESÉSSEL</div>';

          card.innerHTML = `
            <div class="bb-card-main-col">
              <div class="bb-card-header">
                <div class="bb-card-title"><span>${item.icon}</span><span>${item.name}</span></div>
                ${catBadge}
              </div>
              <div class="bb-nonupg-rarity">${item.rarityBadge}</div>
              <div class="bb-card-desc">${item.desc}</div>
            </div>
            <div class="bb-card-action-col">
              <div class="bb-nonupg-status ${isLockedGold ? 'locked-status' : ''}">${statusText}</div>
            </div>
          `;
          nonUpgGrid.appendChild(card);
        }
      }
    }

    if (useCarousel) {
      const total = isFixedTab ? FIXED_POWERUPS_GUIDE.length : BB_UPGRADE_CATALOG.length;
      const idx = isFixedTab ? this.activeFixedCardIndex : this.activeBBCardIndex;
      const curItem = isFixedTab ? FIXED_POWERUPS_GUIDE[idx] : BB_UPGRADE_CATALOG[idx];
      if (mobileNav) mobileNav.style.display = 'flex';
      if (indEl && curItem) indEl.textContent = `${idx + 1} / ${total} • ${curItem.icon} ${curItem.name}`;
      if (prevBtn) prevBtn.disabled = total <= 1;
      if (nextBtn) nextBtn.disabled = total <= 1;
    } else if (mobileNav) {
      mobileNav.style.display = 'none';
    }
  }

  // --- Bind All Events ---
  bindEvents() {
    const getCanvasCoords = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    this.canvas.addEventListener('mousedown', (e) => {
      const pt = getCanvasCoords(e.clientX, e.clientY);
      this.isPointerDown = true;
      this.pointerX = pt.x;
      this.pointerY = pt.y;
      this.holdDamageTimer = 0;
      this.performClickAt(pt.x, pt.y, false);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isPointerDown) return;
      const pt = getCanvasCoords(e.clientX, e.clientY);
      this.pointerX = pt.x;
      this.pointerY = pt.y;
    });

    window.addEventListener('mouseup', () => {
      this.isPointerDown = false;
      this.holdDamageTimer = 0;
    });

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        const pt = getCanvasCoords(e.touches[0].clientX, e.touches[0].clientY);
        this.isPointerDown = true;
        this.pointerX = pt.x;
        this.pointerY = pt.y;
        this.holdDamageTimer = 0;
        this.performClickAt(pt.x, pt.y, false);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const pt = getCanvasCoords(e.touches[0].clientX, e.touches[0].clientY);
        this.pointerX = pt.x;
        this.pointerY = pt.y;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isPointerDown = false;
      this.holdDamageTimer = 0;
    });

    // 6 Ball Buy Slots
    for (const key in this.ballTypes) {
      const slot = document.getElementById(`ball-slot-${key}`);
      if (slot) {
        slot.addEventListener('click', () => this.buyBall(key));
      }
    }

    // $ Upgrades Modal
    const upgradesBtn = document.getElementById('btn-open-upgrades');
    const upgradesModal = document.getElementById('upgrades-modal');
    const closeUpgradesBtn = document.getElementById('btn-close-upgrades');

    if (upgradesBtn && upgradesModal) {
      upgradesBtn.addEventListener('click', () => {
        this.renderUpgradesMenu();
        this.openModal('upgrades-modal');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }

    if (closeUpgradesBtn && upgradesModal) {
      closeUpgradesBtn.addEventListener('click', () => {
        this.closeModal('upgrades-modal');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }

    const upgPrevBtn = document.getElementById('btn-upg-prev');
    const upgNextBtn = document.getElementById('btn-upg-next');
    const upgGridEl = document.getElementById('upgrades-content-grid');
    if (upgPrevBtn) upgPrevBtn.addEventListener('click', () => this.stepMobileUpgradeCard(-1));
    if (upgNextBtn) upgNextBtn.addEventListener('click', () => this.stepMobileUpgradeCard(1));
    if (upgGridEl) {
      let swipeStartX = 0;
      let swipeStartY = 0;
      let swiping = false;
      upgGridEl.addEventListener('touchstart', (e) => {
        if (!this.isMobileUpgradesCarouselMode() || !e.touches || e.touches.length !== 1) return;
        swipeStartX = e.touches[0].clientX;
        swipeStartY = e.touches[0].clientY;
        swiping = true;
      }, { passive: true });
      upgGridEl.addEventListener('touchend', (e) => {
        if (!swiping || !this.isMobileUpgradesCarouselMode() || !e.changedTouches || !e.changedTouches[0]) {
          swiping = false;
          return;
        }
        swiping = false;
        const dx = e.changedTouches[0].clientX - swipeStartX;
        const dy = e.changedTouches[0].clientY - swipeStartY;
        if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          this.stepMobileUpgradeCard(dx < 0 ? 1 : -1);
        }
      }, { passive: true });
    }

    // Power-Up Upgrades (BB) Modal
    const bbUpgradesBtn = document.getElementById('btn-open-powerup-upgrades');
    const bbUpgradesModal = document.getElementById('powerup-upgrades-modal');
    const closeBBUpgradesBtn = document.getElementById('btn-close-powerup-upgrades');

    if (bbUpgradesBtn && bbUpgradesModal) {
      bbUpgradesBtn.addEventListener('click', () => {
        this.renderPowerUpUpgradesModal();
        this.openModal('powerup-upgrades-modal');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }

    if (closeBBUpgradesBtn && bbUpgradesModal) {
      closeBBUpgradesBtn.addEventListener('click', () => {
        this.closeModal('powerup-upgrades-modal');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }

    const bbTabUpg = document.getElementById('btn-bb-tab-upgrades');
    const bbTabFix = document.getElementById('btn-bb-tab-fixed');
    const bbPrevBtn = document.getElementById('btn-bb-prev');
    const bbNextBtn = document.getElementById('btn-bb-next');
    const bbScrollEl = document.getElementById('bb-modal-scroll');
    if (bbTabUpg) bbTabUpg.addEventListener('click', () => this.switchBBModalTab('upgrades'));
    if (bbTabFix) bbTabFix.addEventListener('click', () => this.switchBBModalTab('fixed'));
    if (bbPrevBtn) bbPrevBtn.addEventListener('click', () => this.stepMobileBBCard(-1));
    if (bbNextBtn) bbNextBtn.addEventListener('click', () => this.stepMobileBBCard(1));
    if (bbScrollEl) {
      let bbSwipeX = 0;
      let bbSwipeY = 0;
      let bbSwiping = false;
      bbScrollEl.addEventListener('touchstart', (e) => {
        if (!this.isMobileUpgradesCarouselMode() || !e.touches || e.touches.length !== 1) return;
        bbSwipeX = e.touches[0].clientX;
        bbSwipeY = e.touches[0].clientY;
        bbSwiping = true;
      }, { passive: true });
      bbScrollEl.addEventListener('touchend', (e) => {
        if (!bbSwiping || !this.isMobileUpgradesCarouselMode() || !e.changedTouches || !e.changedTouches[0]) {
          bbSwiping = false;
          return;
        }
        bbSwiping = false;
        const dx = e.changedTouches[0].clientX - bbSwipeX;
        const dy = e.changedTouches[0].clientY - bbSwipeY;
        if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          this.stepMobileBBCard(dx < 0 ? 1 : -1);
        }
      }, { passive: true });
    }

    // Boss Token Exchange Buttons (10 Boss Token ➔ +1 BB)
    for (const btnId of ['btn-exchange-tokens-upg', 'btn-exchange-tokens-bb']) {
      const exBtn = document.getElementById(btnId);
      if (exBtn) {
        exBtn.addEventListener('click', () => this.exchangeBossTokensForBB());
      }
    }

    // Currency Hover / Tap Tooltips ($, BB, BT – mi az és mire jó!)
    document.querySelectorAll('[data-currency-tip]').forEach((el) => {
      const kind = el.getAttribute('data-currency-tip');
      el.addEventListener('mouseenter', (e) => this.showCurrencyTooltip(kind, e));
      el.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 980 && window.innerHeight > 540) {
          this.positionBBPhaseTooltip(e);
        }
      });
      el.addEventListener('mouseleave', () => {
        if (window.innerWidth > 980 && window.innerHeight > 540) {
          this.hideBBPhaseTooltip();
        }
      });
      el.addEventListener('click', (e) => {
        if (window.innerWidth <= 980 || window.innerHeight <= 540) {
          e.stopPropagation();
          this.showCurrencyTooltip(kind, e);
        }
      });
    });

    // Rebirth Modal
    const rebirthTrigger = document.getElementById('btn-rebirth-trigger');
    const rebirthModal = document.getElementById('rebirth-modal');
    const confirmRebirthBtn = document.getElementById('btn-confirm-rebirth');
    const cancelRebirthBtn = document.getElementById('btn-cancel-rebirth');

    if (rebirthTrigger && rebirthModal) {
      rebirthTrigger.addEventListener('click', () => {
        const reqLvl = this.getRequiredRebirthLevel();
        const canDo = this.canRebirth();

        document.getElementById('rebirth-current-lvl').textContent = this.level;
        document.getElementById('rebirth-required-lvl').textContent = reqLvl;
        document.getElementById('rebirth-current-mult').textContent = this.rebirthMultiplier.toFixed(2) + 'x';
        document.getElementById('rebirth-next-mult').textContent = this.getRebirthMultiplier(this.rebirthCount + 1).toFixed(2) + 'x';

        const curSlots = this.getMaxBalls(this.rebirthCount);
        const nextSlots = this.getMaxBalls(this.rebirthCount + 1);
        const slotsEl = document.getElementById('rebirth-slots-info');
        if (slotsEl) slotsEl.textContent = `${curSlots} ➔ ${nextSlots}`;

        const curChance = this.getPowerUpDropChancePercent(this.rebirthCount).toFixed(3);
        const nextChance = this.getPowerUpDropChancePercent(this.rebirthCount + 1).toFixed(3);
        document.getElementById('rebirth-chance-info').textContent = `${curChance}% ➔ ${nextChance}%`;
        document.getElementById('rebirth-crit-info').textContent = `${5 + this.rebirthCount}% ➔ ${5 + this.rebirthCount + 1}%`;

        const bannerEl = document.getElementById('rebirth-status-banner');
        if (bannerEl) {
          bannerEl.classList.toggle('ready', canDo);
          bannerEl.classList.toggle('locked', !canDo);
          if (canDo) {
            bannerEl.textContent = `✅ Készen állsz! Elérted a(z) ${reqLvl}. szintet.`;
          } else {
            const missing = Math.max(0, reqLvl - this.level);
            bannerEl.textContent = `🔒 Még zárolva: min. ${reqLvl}. szint kell (hiányzik még ${missing} szint).`;
          }
        }

        const milestonesEl = document.getElementById('rebirth-milestones-box');
        if (milestonesEl) {
          const milestones = [
            { req: 3, icon: '⚡', label: 'Reb 3 — Auto-Click (1/mp)' },
            { req: 5, icon: '⬆️', label: 'Reb 5 — Auto-Upgrade ($)' },
            { req: 10, icon: '🎱', label: 'Reb 10 — Auto-Buy Labdák' }
          ];
          milestonesEl.innerHTML = `<div class="rebirth-milestones-title">🤖 Rebirth Mérföldkövek (Beállításokban kapcsolható)</div>` +
            milestones.map(m => {
              const unlocked = this.rebirthCount >= m.req;
              return `<div class="rebirth-milestone-row ${unlocked ? 'unlocked' : 'locked'}"><span>${m.icon} ${m.label}</span><span>${unlocked ? '✅ FELOLDVA' : `🔒 Reb ${m.req}`}</span></div>`;
            }).join('');
        }

        if (confirmRebirthBtn) {
          confirmRebirthBtn.disabled = !canDo;
          confirmRebirthBtn.textContent = canDo
            ? 'ÚJJÁSZÜLETÉS MOST'
            : `ZÁROLVA (${this.level}/${reqLvl})`;
        }
        if (cancelRebirthBtn) {
          cancelRebirthBtn.textContent = canDo ? 'MÉGSE' : 'BEZÁRÁS';
        }

        this.openModal('rebirth-modal');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }

    if (confirmRebirthBtn && rebirthModal) {
      confirmRebirthBtn.addEventListener('click', () => {
        this.closeModal('rebirth-modal');
        this.executeRebirth();
      });
    }

    if (cancelRebirthBtn && rebirthModal) {
      cancelRebirthBtn.addEventListener('click', () => {
        this.closeModal('rebirth-modal');
      });
    }

    // Sound Toggle
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isEnabled = window.soundEngine ? window.soundEngine.toggleMute() : true;
        soundBtn.classList.toggle('muted', !isEnabled);
        soundBtn.textContent = isEnabled ? '🔊' : '🔇';
      });
    }

    // Settings & Performance Modal (replaces direct Factory Reset confirm)
    const settingsBtn = document.getElementById('btn-settings');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.openSettingsModal());
    }
    for (const closeSetId of ['btn-close-settings', 'btn-close-settings-footer']) {
      const btn = document.getElementById(closeSetId);
      if (btn) btn.addEventListener('click', () => {
        this.closeModal('settings-modal');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }
    const bindPrefCheckbox = (id, prefKey, minReb = 0) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', () => {
        if (minReb > 0 && this.rebirthCount < minReb) {
          el.checked = false;
          return;
        }
        if (!this.prefs) this.prefs = {};
        this.prefs[prefKey] = !!el.checked;
        this.savePrefs();
      });
    };
    bindPrefCheckbox('pref-floating-numbers', 'floatingNumbers');
    bindPrefCheckbox('pref-particles', 'particles');
    bindPrefCheckbox('pref-screen-shake', 'screenShake');
    bindPrefCheckbox('pref-auto-click-ms', 'autoClickMs', 3);
    bindPrefCheckbox('pref-auto-upgrade', 'autoUpgrade', 5);
    bindPrefCheckbox('pref-auto-buy-balls', 'autoBuyBalls', 10);

    const exportJsonBtn = document.getElementById('btn-settings-export-json');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => {
        if (this.cloud && typeof this.cloud.exportRawJsonSave === 'function') {
          this.cloud.exportRawJsonSave();
        } else {
          const jsonStr = JSON.stringify(this.buildSaveData());
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(jsonStr).catch(() => {});
          }
          this.showToast('📋 JSON mentés másolva!', 3200);
        }
      });
    }
    const openImportBtn = document.getElementById('btn-settings-open-import');
    if (openImportBtn) {
      openImportBtn.addEventListener('click', () => {
        if (this.cloud && typeof this.cloud.openAuthModal === 'function') {
          this.cloud.openAuthModal('login');
        } else {
          this.openModal('auth-modal');
        }
        setTimeout(() => {
          const inp = document.getElementById('auth-backup-code-input');
          if (inp) inp.focus();
        }, 80);
      });
    }
    const factoryResetBtn = document.getElementById('btn-settings-factory-reset');
    if (factoryResetBtn) {
      factoryResetBtn.addEventListener('click', () => {
        if (confirm('Biztosan újraindítod a játékot elölről (Factory Reset)? Minden helyi előrehaladás törlődik!')) {
          this.isResetting = true;
          if (this.bgWorker) this.bgWorker.terminate();
          if (this.bgInterval) clearInterval(this.bgInterval);
          localStorage.removeItem(this.SAVE_KEY);
          window.location.reload();
        }
      });
    }

    // Offline Summary Modal close buttons
    for (const offCloseId of ['btn-close-offline-summary', 'btn-close-offline-summary-x']) {
      const btn = document.getElementById(offCloseId);
      if (btn) btn.addEventListener('click', () => {
        this.closeModal('offline-summary-modal');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }

    // Mobile Modal Openers: Leaderboard & Battle Pass
    const openLbBtn = document.getElementById('btn-open-leaderboard');
    const closeLbBtn = document.getElementById('btn-close-leaderboard');
    const closeLbFooter = document.getElementById('btn-close-leaderboard-footer');
    const lbModal = document.getElementById('leaderboard-modal');

    if (openLbBtn && lbModal) {
      openLbBtn.addEventListener('click', () => {
        this.renderLeaderboard();
        this.openModal('leaderboard-modal');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }
    const closeLb = () => this.closeModal('leaderboard-modal');
    if (closeLbBtn) closeLbBtn.addEventListener('click', closeLb);
    if (closeLbFooter) closeLbFooter.addEventListener('click', closeLb);

    const openBpBtn = document.getElementById('btn-open-battlepass');
    const closeBpBtn = document.getElementById('btn-close-battlepass');
    const closeBpFooter = document.getElementById('btn-close-battlepass-footer');
    const bpModal = document.getElementById('battlepass-modal');

    if (openBpBtn && bpModal) {
      openBpBtn.addEventListener('click', () => {
        this.renderBattlePass();
        this.openModal('battlepass-modal');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }
    const closeBp = () => this.closeModal('battlepass-modal');
    if (closeBpBtn) closeBpBtn.addEventListener('click', closeBp);
    if (closeBpFooter) closeBpFooter.addEventListener('click', closeBp);

    // 1-Tap Mobile Switchers between Leaderboard & Battle Pass modals
    const switchLbToBp = document.getElementById('btn-switch-lb-to-bp');
    const switchBpToLb = document.getElementById('btn-switch-bp-to-lb');
    if (switchLbToBp && lbModal && bpModal) {
      switchLbToBp.addEventListener('click', () => {
        this.renderBattlePass();
        this.openModal('battlepass-modal');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }
    if (switchBpToLb && lbModal && bpModal) {
      switchBpToLb.addEventListener('click', () => {
        this.renderLeaderboard();
        this.openModal('leaderboard-modal');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }

    // Mobile 'i' Info Buttons for Dec 24 Countdown & TOP 1 Battle Pass Prize
    for (const infoBtnId of ['btn-hud-lb-info', 'btn-hud-bp-info', 'btn-modal-lb-info', 'btn-modal-bp-info']) {
      const infoBtn = document.getElementById(infoBtnId);
      if (infoBtn) {
        infoBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showDec24EventTooltip(e, infoBtnId);
        });
      }
    }

    // Guest 3-Day Retention Banner Quick Actions
    const openGuestAuth = (preferRegister = true) => {
      if (this.cloud) {
        this.cloud.openAuthModal(preferRegister && !this.cloud.currentUser ? 'register' : 'login');
      } else {
        this.openModal('auth-modal');
      }
    };
    const guestFloatBtn = document.getElementById('btn-guest-float-auth');
    const guestFloatClose = document.getElementById('btn-guest-float-close');
    const lbNotePc = document.getElementById('lb-retention-note-pc');
    const lbNoteMob = document.getElementById('lb-retention-note-mobile');
    if (guestFloatBtn) guestFloatBtn.addEventListener('click', () => openGuestAuth(true));
    if (lbNotePc) lbNotePc.addEventListener('click', () => openGuestAuth(true));
    if (lbNoteMob) lbNoteMob.addEventListener('click', () => openGuestAuth(true));
    if (guestFloatClose) {
      guestFloatClose.addEventListener('click', () => {
        this.guestNoticeDismissed = true;
        const el = document.getElementById('guest-retention-float');
        if (el) el.style.display = 'none';
      });
    }

    // Unified Modal Management: ESC key & backdrop click-to-close (never closes mandatory welcome menu)
    for (const modalId of this.getManagedModalIds()) {
      const mEl = document.getElementById(modalId);
      if (mEl) {
        mEl.addEventListener('click', (e) => {
          if (e.target === mEl) {
            this.closeModal(modalId);
          }
        });
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const activeEl = document.activeElement;
      if (activeEl && activeEl.classList && activeEl.classList.contains('dev-inline-input')) return;
      if (this._devInlineEditActive) return;

      for (const modalId of this.getManagedModalIds()) {
        const el = document.getElementById(modalId);
        if (el && el.classList.contains('open')) {
          this.closeModal(modalId);
          e.preventDefault();
          break;
        }
      }
    });
  }

  // --- Unified Modal Manager & Preferences ---
  getManagedModalIds() {
    return [
      'offline-summary-modal',
      'settings-modal',
      'dev-leaderboard-modal',
      'mail-modal',
      'auth-modal',
      'upgrades-modal',
      'powerup-upgrades-modal',
      'rebirth-modal',
      'leaderboard-modal',
      'battlepass-modal'
    ];
  }

  closeAllModals(exceptId = null) {
    for (const id of this.getManagedModalIds()) {
      if (exceptId && id === exceptId) continue;
      const el = document.getElementById(id);
      if (el && el.classList.contains('open')) {
        this.closeModal(id);
      }
    }
  }

  openModal(id) {
    if (!id) return;
    this.closeAllModals(id);
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  closeModal(id) {
    if (!id) return;
    this.hideBBPhaseTooltip();
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
    if (id === 'dev-leaderboard-modal') {
      this.devEditTarget = null;
      this._devInlineEditActive = false;
      this._cancelActiveInlineEdit = null;
      const editBox = document.getElementById('dev-edit-box');
      if (editBox) editBox.style.display = 'none';
    } else if (id === 'auth-modal' && this.cloud) {
      this.cloud.hideDeleteConfirm();
    }
  }

  savePrefs() {
    try {
      localStorage.setItem('idle_breakout_prefs', JSON.stringify(this.prefs || {}));
    } catch (e) {}
  }

  openSettingsModal() {
    const p = this.prefs || {};
    const map = [
      ['pref-floating-numbers', p.floatingNumbers !== false, 0],
      ['pref-particles', p.particles !== false, 0],
      ['pref-screen-shake', p.screenShake !== false, 0],
      ['pref-auto-click-ms', !!p.autoClickMs, 3],
      ['pref-auto-upgrade', !!p.autoUpgrade, 5],
      ['pref-auto-buy-balls', !!p.autoBuyBalls, 10]
    ];
    for (const [id, val, minReb] of map) {
      const el = document.getElementById(id);
      if (!el) continue;
      const unlocked = minReb <= 0 || this.rebirthCount >= minReb;
      el.disabled = !unlocked;
      el.checked = unlocked ? val : false;
      const row = el.closest('.settings-toggle-row');
      if (row) row.classList.toggle('is-locked', !unlocked);
    }
    this.openModal('settings-modal');
    if (window.soundEngine) window.soundEngine.playClickHit();
  }

  showOfflineSummaryModal(summary) {
    if (!summary) return;
    const tEl = document.getElementById('offline-sum-time');
    const mEl = document.getElementById('offline-sum-money');
    const lEl = document.getElementById('offline-sum-levels');
    const bEl = document.getElementById('offline-sum-bricks');
    const tokWrap = document.getElementById('offline-sum-tokens-wrap');
    const tokEl = document.getElementById('offline-sum-tokens');

    if (tEl) tEl.textContent = this.formatDuration(summary.seconds || 0);
    if (mEl) mEl.textContent = `+$${this.formatNumber(summary.money || 0)}`;
    if (lEl) lEl.textContent = `+${summary.levels || 0} szint`;
    if (bEl) bEl.textContent = `+${this.formatNumber(summary.bricks || 0)}`;
    if (tokWrap && tokEl) {
      const parts = [];
      if (summary.bt > 0) parts.push(`+${summary.bt} 👑 BT`);
      if (summary.bb > 0) parts.push(`+${summary.bb} ⭐ BB`);
      if (parts.length > 0) {
        tokWrap.style.display = 'flex';
        tokEl.textContent = parts.join(' • ');
      } else {
        tokWrap.style.display = 'none';
      }
    }
    this.openModal('offline-summary-modal');
    if (window.soundEngine) window.soundEngine.playLevelUp();
  }

  // --- Save & Load (Local + Cloud Sync Reusable Helpers) ---
  readRawLocalSave() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  buildSaveData(ownerUid = null) {
    const persistedPowerUps = {};
    for (const key in this.activePowerUps) {
      const p = this.activePowerUps[key];
      if (p.mode === 'until_rebirth' || p.mode === 'rounds' || p.mode === 'forever') {
        persistedPowerUps[key] = { ...p };
      }
    }

    const activeUid = ownerUid !== null
      ? ownerUid
      : ((this.cloud && this.cloud.currentUser) ? this.cloud.currentUser.uid : (this.saveOwnerUid || null));

    const data = {
      saveOwnerUid: activeUid,
      money: this.money,
      level: this.level,
      bb: this.bb,
      bossTokens: this.bossTokens,
      rebirthCount: this.rebirthCount,
      clickUpgradeLevel: this.clickUpgradeLevel,
      bbUpgrades: { ...this.bbUpgrades },
      btUpgrades: { ...this.btUpgrades },
      coinBtHitCounter: this.coinBtHitCounter,
      coinBbHitCounter: this.coinBbHitCounter,
      pierceSpeedUpgradeLevel: this.pierceSpeedUpgradeLevel,
      nextBossIsGold: this.nextBossIsGold,
      nextLevelIsGold: this.nextLevelIsGold,
      isGoldLevelActive: this.isGoldLevelActive,
      hasPermanentPierce: this.balls.some(b => b.isPiercing && b.isPermanentPierce),
      persistedPowerUps,
      lastSavedAt: Date.now(),
      lastAdminEditAt: this.lastAdminEditAt || 0,
      guestCreatedAt: this.guestCreatedAt || Date.now(),
      guestDeadlineAt: this.guestDeadlineAt || (Date.now() + this.GUEST_RETENTION_MS),
      guestLastActiveAt: Date.now(),
      guestExtendedByManual: !!this.guestExtendedByManual,
      totalBricksDestroyed: this.totalBricksDestroyed,
      battlePassPremium: false,
      battlePassClaimedFree: this.battlePassClaimedFree,
      battlePassClaimedPaid: {},
      normalBallEquips: this.normalBallEquips,
      ballTypeEquips: this.ballTypeEquips,
      appliedSeasonResetId: this.appliedSeasonResetId || null,
      appliedSeasonResetToken: this.appliedSeasonResetToken || null,
      preservedCosmetics: this.preservedCosmetics || { skins: [], effects: [], breakEffects: [] },
      pirateShopCooldownUntil: this.pirateShopCooldownUntil || 0,
      goldLevelCooldownUntil: this.goldLevelCooldownUntil || 0,
      freeUpgradeMaxCooldownUntil: this.freeUpgradeMaxCooldownUntil || 0,
      playerName: this.playerName,
      appliedAdminCmdIds: (this.appliedAdminCmdIds || []).slice(-100),
      balls: {}
    };

    for (const key in this.ballTypes) {
      data.balls[key] = {
        count: this.ballTypes[key].count,
        speedLevel: this.ballTypes[key].speedLevel,
        powerLevel: this.ballTypes[key].powerLevel
      };
    }

    return data;
  }

  save() {
    if (this.isResetting) return;
    const data = this.buildSaveData();

    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Save failed:', e);
    }

    if (this.cloud) {
      const authModal = document.getElementById('auth-modal');
      if (authModal && authModal.classList.contains('open')) {
        this.cloud.updateAuthUI();
      }
    }
  }

  load() {
    const data = this.readRawLocalSave();
    if (!data) {
      let alreadyReset = false;
      try { alreadyReset = localStorage.getItem('idle_breakout_season_reset_id') === SEASON_RESET_ID; } catch (e) {}
      if (!alreadyReset) {
        this.applySeasonResetMigration(null, false);
      } else {
        this.appliedSeasonResetId = SEASON_RESET_ID;
        try { this.appliedSeasonResetToken = localStorage.getItem('idle_breakout_season_reset_token') || SEASON_RESET_ID; } catch (e) { this.appliedSeasonResetToken = SEASON_RESET_ID; }
      }
      return;
    }
    const now = Date.now();
    if (!data.saveOwnerUid) {
      const refBase = Number(data.guestCreatedAt) || Number(data.lastSavedAt) || now;
      const deadline = Number(data.guestDeadlineAt) || (refBase + this.GUEST_RETENTION_MS);
      const lastActive = Number(data.guestLastActiveAt) || Number(data.lastSavedAt) || now;
      if (now >= deadline || (now - lastActive >= this.GUEST_RETENTION_MS)) {
        try { localStorage.removeItem(this.SAVE_KEY); } catch (e) {}
        this.guestCreatedAt = now;
        this.guestDeadlineAt = now + this.GUEST_RETENTION_MS;
        this.guestLastActiveAt = now;
        this.guestExtendedByManual = false;
        this.guestExpiredNotice = true;
        this.applySeasonResetMigration(null, false);
        return;
      }
    }
    this.applySaveData(data, { isLiveReload: false, ownerUid: data.saveOwnerUid || null });
  }

  collectLegacyCosmeticsFromSave(srcData = null) {
    if (!this.preservedCosmetics || typeof this.preservedCosmetics !== 'object') {
      this.preservedCosmetics = { skins: [], effects: [], breakEffects: [] };
    }
    const skins = new Set(Array.isArray(this.preservedCosmetics.skins) ? this.preservedCosmetics.skins : []);
    const effects = new Set(Array.isArray(this.preservedCosmetics.effects) ? this.preservedCosmetics.effects : []);
    const breakEffects = new Set(Array.isArray(this.preservedCosmetics.breakEffects) ? this.preservedCosmetics.breakEffects : []);

    const prevPres = srcData && srcData.preservedCosmetics;
    if (prevPres) {
      (prevPres.skins || []).forEach(id => skins.add(id));
      (prevPres.effects || []).forEach(id => effects.add(id));
      (prevPres.breakEffects || []).forEach(id => breakEffects.add(id));
    }

    const freeMap = (srcData && srcData.battlePassClaimedFree) ? srcData.battlePassClaimedFree : (this.battlePassClaimedFree || {});
    for (const stgStr of Object.keys(freeMap)) {
      if (!freeMap[stgStr]) continue;
      const leg = LEGACY_S1_STAGE_COSMETICS[Number(stgStr)];
      if (leg) {
        if (leg.kind === 'skins') skins.add(leg.id);
        else if (leg.kind === 'effects') effects.add(leg.id);
        else if (leg.kind === 'breakEffects') breakEffects.add(leg.id);
      }
    }

    const eqMap = (srcData && srcData.ballTypeEquips) ? srcData.ballTypeEquips : (this.ballTypeEquips || {});
    for (const k of Object.keys(eqMap)) {
      const eq = eqMap[k] || {};
      if (eq.skinId && eq.skinId !== 'default') skins.add(eq.skinId);
      if (eq.effectId && eq.effectId !== 'none') effects.add(eq.effectId);
      if (eq.breakEffectId && eq.breakEffectId !== 'none') breakEffects.add(eq.breakEffectId);
    }

    this.preservedCosmetics = {
      skins: [...skins],
      effects: [...effects],
      breakEffects: [...breakEffects]
    };
  }

  applySeasonResetMigration(sourceData = null, notify = true, resetToken = null) {
    this.collectLegacyCosmeticsFromSave(sourceData);
    const effectiveToken = String(resetToken || (this.lbAdminRules && this.lbAdminRules.seasonResetToken) || SEASON_RESET_ID);
    this.money = 0;
    this.level = 1;
    this.rebirthCount = 0;
    this.rebirthMultiplier = 1.0;
    this.bb = 1;
    this.bossTokens = 5;
    this.totalBricksDestroyed = 0;
    this.clickUpgradeLevel = 1;
    this.clickPower = 1;
    this.pierceSpeedUpgradeLevel = 0;
    this.coinBtHitCounter = 0;
    this.coinBbHitCounter = 0;
    this.nextBossIsGold = false;
    this.nextLevelIsGold = false;
    this.isGoldLevelActive = false;
    this.pirateShopCooldown = 0;
    this.autoClickerStrikeCount = 0;
    this.pendingOfflineSeconds = 0;
    this.offlineProgressAppliedAt = 0;
    this.activePowerUps = {};
    this.balls = [];
    for (const k in this.ballTypes) {
      this.ballTypes[k].count = 0;
      this.ballTypes[k].speedLevel = 1;
      this.ballTypes[k].powerLevel = 1;
    }
    for (const k in this.bbUpgrades) this.bbUpgrades[k] = 0;
    for (const k in this.btUpgrades) this.btUpgrades[k] = 0;
    this.battlePassClaimedFree = {};
    this.battlePassClaimedPaid = {};
    this.appliedSeasonResetId = SEASON_RESET_ID;
    this.appliedSeasonResetToken = effectiveToken;
    this.lastAdminEditAt = Date.now();
    try { localStorage.setItem('idle_breakout_season_reset_id', SEASON_RESET_ID); } catch (e) {}
    try { localStorage.setItem('idle_breakout_season_reset_token', effectiveToken); } catch (e) {}

    if (this.width && this.height) {
      this.generateLevel(1);
    }
    this.save();
    this.updateHUD();
    this.renderBattlePass();
    this.updateMailUnreadBadge(false);
    this.broadcastMyStatus();
    if (this.cloud) {
      this.cloud.syncLeaderboardToCloud(true);
      if (this.cloud.currentUser && this.cloud.initialCloudSyncDone) {
        this.cloud.saveToCloud(true, { silent: true });
      }
    }
    if (notify && typeof this.showToast === 'function') {
      setTimeout(() => {
        this.showToast('📢 Szezon 2 tiszta újrakezdés! Kárpótlás: +5 👑 BT és +1 ⭐ BB jóváírva — nézd meg a ✉️ levelet!', 6500);
      }, 350);
    }
  }

  extendGuestDeadlineFromManualTransfer() {
    const now = Date.now();
    this.guestDeadlineAt = now + this.GUEST_RETENTION_MS;
    this.guestLastActiveAt = now;
    this.guestExtendedByManual = true;
    this.save();
    this.updateGuestRetentionUI();
  }

  checkGuestExpiration(showAlertToast = true) {
    if (this.isResetting) return false;
    if (this.cloud && this.cloud.currentUser) return false;
    const raw = this.readRawLocalSave();
    if (raw && raw.saveOwnerUid) return false;

    const now = Date.now();
    const deadline = Number(this.guestDeadlineAt) || (now + this.GUEST_RETENTION_MS);
    const lastActive = Number(this.guestLastActiveAt) || now;
    if (now >= deadline || (now - lastActive >= this.GUEST_RETENTION_MS)) {
      this.clearRetainedMqttPlayer(this.myPlayerId);
      this.resetToFreshGuestState(true);
      this.save();
      this.updateGuestRetentionUI();
      if (showAlertToast) {
        this.showToast('🗑️ A regisztráció nélküli haladásod 3 napos határideje lejárt, ezért törölve lett! Regisztrálj a végleges mentéshez.', 6000);
      }
      return true;
    }
    return false;
  }

  getGuestRemainingInfo() {
    const now = Date.now();
    const deadline = Number(this.guestDeadlineAt) || (now + this.GUEST_RETENTION_MS);
    const remMs = Math.max(0, deadline - now);
    const totalMin = Math.floor(remMs / 60000);
    const days = Math.floor(totalMin / 1440);
    const hours = Math.floor((totalMin % 1440) / 60);
    const mins = totalMin % 60;
    const longStr = days > 0
      ? `${days} nap ${hours} óra`
      : (hours > 0 ? `${hours} óra ${mins} perc` : `${mins} perc`);
    const shortStr = days > 0
      ? `${days}n ${hours}ó`
      : (hours > 0 ? `${hours}ó ${mins}p` : `${mins}p`);
    return { remMs, longStr, shortStr };
  }

  updateGuestRetentionUI() {
    const loggedIn = !!(this.cloud && this.cloud.currentUser);
    const rem = this.getGuestRemainingInfo();

    document.querySelectorAll('.guest-rem-text').forEach((el) => {
      el.textContent = rem.longStr;
    });
    document.querySelectorAll('.guest-rem-short').forEach((el) => {
      el.textContent = rem.shortStr;
    });

    const floatBar = document.getElementById('guest-retention-float');
    if (floatBar) {
      floatBar.style.display = (!loggedIn && !this.guestNoticeDismissed) ? 'flex' : 'none';
    }

    for (const id of ['lb-retention-note-pc', 'lb-retention-note-mobile']) {
      const note = document.getElementById(id);
      if (note) {
        note.classList.toggle('is-guest', !loggedIn);
        note.classList.toggle('is-protected', loggedIn);
        if (loggedIn) {
          note.innerHTML = '🛡️ Védett fiók • Csak te törölheted';
        } else {
          note.innerHTML = `⏳ <strong>${rem.shortStr}</strong> múlva törlődik • Kód / Regisztráció`;
        }
      }
    }

    const authNotice = document.getElementById('auth-retention-notice');
    if (authNotice) {
      authNotice.classList.toggle('is-guest', !loggedIn);
      authNotice.classList.toggle('is-protected', loggedIn);
      if (loggedIn) {
        authNotice.innerHTML = '🛡️ <strong>Regisztrált fiók aktív:</strong> A rendszer nem törli a haladásod — <strong>kizárólag te törölheted</strong>.';
      } else {
        const extTag = this.guestExtendedByManual ? ' <em>(kóddal hosszabbítva)</em>' : '';
        authNotice.innerHTML = `⏳ <strong>Vendég korlát (3 nap):</strong> Haladásod <strong>${rem.longStr}</strong> múlva törlődik${extTag}. <strong>Másolás</strong> = +3 nap (inaktívan törlődik). <strong>Regisztráció</strong> = védett fiók, csak te törölheted!`;
      }
    }
  }

  applySaveData(data, { isLiveReload = false, ownerUid = null } = {}) {
    try {
      if (!data || typeof data !== 'object') return;

      if (isLiveReload) {
        // Élő fiókváltáskor / felhőbetöltéskor minden futó entitást tisztán lenullázunk
        this.balls = [];
        this.activePowerUps = {};
        this.nextBossIsGold = false;
        this.nextLevelIsGold = false;
        this.isGoldLevelActive = false;
        this.autoClickerStrikeCount = 0;
        this.bonusOrb = null;
        this.visualRings = [];
        this.bossSparks = [];
        this.debrisParticles = [];
        this.ghostBombs = [];
        this.rockets = [];
        this.floatingTexts = [];
        this.battlePassClaimedFree = {};
        this.battlePassClaimedPaid = {};
        this.normalBallEquips = {};
        this.ballTypeEquips = {};
        for (const k in this.ballTypes) {
          this.ballTypes[k].count = 0;
          this.ballTypes[k].speedLevel = 1;
          this.ballTypes[k].powerLevel = 1;
        }
        for (const k in this.bbUpgrades) this.bbUpgrades[k] = 0;
        for (const k in this.btUpgrades) this.btUpgrades[k] = 0;
        this.coinBtHitCounter = 0;
        this.coinBbHitCounter = 0;
        this.lastRenderedBPStage = null;
        this.pendingOfflineSeconds = 0;
        this.offlineProgressAppliedAt = 0;
      }

      this.saveOwnerUid = ownerUid || data.saveOwnerUid || this.saveOwnerUid || null;
      this.money = data.money ?? 0;
      this.level = data.level ?? 1;
      const loadNow = Date.now();
      this.guestCreatedAt = Number(data.guestCreatedAt) || Number(data.lastSavedAt) || loadNow;
      this.guestDeadlineAt = Number(data.guestDeadlineAt) || (this.guestCreatedAt + this.GUEST_RETENTION_MS);
      this.guestLastActiveAt = loadNow;
      this.guestExtendedByManual = !!data.guestExtendedByManual;
      this.bb = data.bb ?? 0;
      this.bossTokens = data.bossTokens ?? 0;
      this.rebirthCount = data.rebirthCount ?? 0;
      this.rebirthMultiplier = this.getRebirthMultiplier();
      this.lastAdminEditAt = Math.max(0, Number(data.lastAdminEditAt) || 0);
      this.clickUpgradeLevel = Math.min(this.MAX_CLICK_LEVEL, data.clickUpgradeLevel ?? 1);
      this.clickPower = this.clickUpgradeLevel;
      this.pierceSpeedUpgradeLevel = Math.min(this.MAX_PIERCE_SPEED_LEVEL, data.pierceSpeedUpgradeLevel ?? 0);
      this.coinBtHitCounter = Math.max(0, Number(data.coinBtHitCounter) || 0);
      this.coinBbHitCounter = Math.max(0, Number(data.coinBbHitCounter) || 0);
      this.nextBossIsGold = !!data.nextBossIsGold;
      this.nextLevelIsGold = !!data.nextLevelIsGold;
      this.isGoldLevelActive = !!data.isGoldLevelActive;

      this.totalBricksDestroyed = data.totalBricksDestroyed ?? 0;
      this.appliedSeasonResetId = data.appliedSeasonResetId || null;
      this.appliedSeasonResetToken = data.appliedSeasonResetToken || (this.appliedSeasonResetId === SEASON_RESET_ID ? SEASON_RESET_ID : null);
      if (data.preservedCosmetics && typeof data.preservedCosmetics === 'object') {
        this.collectLegacyCosmeticsFromSave(data);
      }
      // A Prémium Battle Pass nem aktiválható mentésből sem: mindig zárolva marad!
      this.battlePassClaimedPaid = {};
      if (data.battlePassClaimedFree) this.battlePassClaimedFree = { ...data.battlePassClaimedFree };
      if (this.appliedSeasonResetId !== SEASON_RESET_ID) {
        this.collectLegacyCosmeticsFromSave(data);
      }
      if (data.ballTypeEquips && typeof data.ballTypeEquips === 'object') {
        const unlocked = this.getUnlockedCosmetics();
        const skinCounts = {};
        const effectCounts = {};
        const breakCounts = {};
        for (const tKey of Object.keys(data.ballTypeEquips)) {
          if (!this.ballTypes[tKey]) continue;
          const eq = data.ballTypeEquips[tKey] || {};
          const sMax = this.getCosmeticMaxEquip('skin', eq.skinId);
          const eMax = this.getCosmeticMaxEquip('effect', eq.effectId);
          const bMax = this.getCosmeticMaxEquip('break_effect', eq.breakEffectId);
          let sId = (eq.skinId && unlocked.skins.has(eq.skinId) && (skinCounts[eq.skinId] || 0) < sMax) ? eq.skinId : 'default';
          let eId = (eq.effectId && unlocked.effects.has(eq.effectId) && (effectCounts[eq.effectId] || 0) < eMax) ? eq.effectId : 'none';
          let bId = (eq.breakEffectId && unlocked.breakEffects.has(eq.breakEffectId) && (breakCounts[eq.breakEffectId] || 0) < bMax) ? eq.breakEffectId : 'none';
          if (sId !== 'default') skinCounts[sId] = (skinCounts[sId] || 0) + 1;
          if (eId !== 'none') effectCounts[eId] = (effectCounts[eId] || 0) + 1;
          if (bId !== 'none') breakCounts[bId] = (breakCounts[bId] || 0) + 1;
          this.ballTypeEquips[tKey] = { skinId: sId, effectId: eId, breakEffectId: bId };
        }
      } else if (data.normalBallEquips) {
        const unlocked = this.getUnlockedCosmetics();
        for (const idx in data.normalBallEquips) {
          const eq = data.normalBallEquips[idx] || {};
          const sId = unlocked.skins.has(eq.skinId) ? eq.skinId : 'default';
          const eId = unlocked.effects.has(eq.effectId) ? eq.effectId : 'none';
          if (sId !== 'default' || eId !== 'none') {
            if (!this.ballTypeEquips.normal) {
              this.ballTypeEquips.normal = { skinId: sId, effectId: eId, breakEffectId: 'none' };
              break;
            }
          }
        }
      }
      const loadedCmdIds = Array.isArray(data.appliedAdminCmdIds) ? data.appliedAdminCmdIds : [];
      if (loadedCmdIds.length > 0) {
        const merged = new Set([...(this.appliedAdminCmdIds || []), ...loadedCmdIds]);
        this.appliedAdminCmdIds = [...merged].slice(-100);
        try { localStorage.setItem('idle_breakout_applied_admin_cmds', JSON.stringify(this.appliedAdminCmdIds)); } catch (e) {}
      }
      if (data.playerName) {
        this.playerName = String(data.playerName).slice(0, 12);
        try { localStorage.setItem('idle_breakout_player_name', this.playerName); } catch (e) {}
      }

      if (data.bbUpgrades) {
        for (const key in this.bbUpgrades) {
          this.bbUpgrades[key] = Math.max(0, Math.min(5, data.bbUpgrades[key] ?? 0));
        }
      }

      if (data.btUpgrades) {
        for (const item of BT_ABILITY_CATALOG) {
          this.btUpgrades[item.key] = Math.max(0, Math.min(item.costs.length, data.btUpgrades[item.key] ?? 0));
        }
      }

      if (data.persistedPowerUps && typeof data.persistedPowerUps === 'object') {
        for (const key in data.persistedPowerUps) {
          if (key === 'ball_army') continue; // Eltávolított power-up figyelmen kívül hagyása
          const p = data.persistedPowerUps[key];
          if (p && (p.mode === 'until_rebirth' || p.mode === 'forever' || (p.mode === 'rounds' && p.roundsLeft > 0))) {
            this.activePowerUps[key] = p;
          }
        }
      }
      this.syncPermanentPowerUps();

      if (data.appliedSeasonResetId === SEASON_RESET_ID) {
        this.pirateShopCooldownUntil = Math.max(0, Number(data.pirateShopCooldownUntil) || 0);
        this.goldLevelCooldownUntil = Math.max(0, Number(data.goldLevelCooldownUntil) || 0);
        this.freeUpgradeMaxCooldownUntil = Math.max(0, Number(data.freeUpgradeMaxCooldownUntil) || 0);
      }
      if (!isLiveReload && data.lastSavedAt) {
        const elapsedSec = (Date.now() - data.lastSavedAt) / 1000;
        if (elapsedSec >= 5) {
          this.pendingOfflineSeconds = elapsedSec;
        }
      }

      // Legacy save migration: basic->normal, plasma->speedy, sniper->heavy, scatter->multiply
      const legacyMap = {
        basic: 'normal',
        plasma: 'speedy',
        sniper: 'heavy',
        scatter: 'multiply',
        poison: 'poison'
      };

      if (data.balls) {
        for (const rawKey in data.balls) {
          const targetKey = this.ballTypes[rawKey] ? rawKey : legacyMap[rawKey];
          if (targetKey && this.ballTypes[targetKey]) {
            const savedCount = data.balls[rawKey].count ?? 0;
            this.ballTypes[targetKey].count += savedCount;
            this.ballTypes[targetKey].speedLevel = Math.min(
              this.ballTypes[targetKey].maxSpeedLevel,
              Math.max(this.ballTypes[targetKey].speedLevel, data.balls[rawKey].speedLevel ?? 1)
            );
            this.ballTypes[targetKey].powerLevel = Math.min(
              this.ballTypes[targetKey].maxPowerLevel,
              Math.max(this.ballTypes[targetKey].powerLevel, data.balls[rawKey].powerLevel ?? 1)
            );
          }
        }

        // Enforce ball cap (max 50, Ghost=40, Multiply=15/25, Rocket=5) cleanly and spawn owned balls
        const maxBalls = this.getMaxBalls();
        let spawnedTotal = 0;
        for (const key in this.ballTypes) {
          const typeLimit = this.getMaxBallTypeLimit(key);
          const typeMax = typeLimit !== null ? typeLimit : maxBalls;
          const allowed = Math.max(0, Math.min(this.ballTypes[key].count, typeMax, maxBalls - spawnedTotal));
          this.ballTypes[key].count = allowed;
          for (let i = 0; i < allowed; i++) {
            this.spawnBall(key);
            spawnedTotal++;
          }
        }
      }

      if (data.hasPermanentPierce && this.bbUpgrades.piercing >= 4) {
        this.spawnPiercingBall({ permanent: true, speedMult: this.getPermanentPierceSpeedMult() });
        this.activatePowerUp('piercing', '⚡', 'Pierce Ball', '1 áttörő labda Rebirthig aktív!', { mode: 'until_rebirth' });
      }

      if (isLiveReload) {
        const pcInput = document.getElementById('player-name-input-pc');
        const mobileInput = document.getElementById('player-name-input-mobile');
        if (pcInput) pcInput.value = this.playerName;
        if (mobileInput) mobileInput.value = this.playerName;
        const pcLocked = document.getElementById('player-locked-name-pc');
        const mobLocked = document.getElementById('player-locked-name-mobile');
        if (pcLocked) pcLocked.textContent = this.playerName;
        if (mobLocked) mobLocked.textContent = this.playerName;

        this.createPerimeterBricks();
        this.generateLevel(this.level);
        this.restoreActivePowerUpVisuals();
        this.renderPowerUpsHUD();
        this.updateHUD();
        this.renderLeaderboard();
        this.renderBattlePass();
        this.refreshOpenModals();
        this.broadcastMyStatus();
        this.processPendingAdminCommands({
          saveTs: Number(data.lastSavedAt) || 0,
          saveCmdIds: Array.isArray(data.appliedAdminCmdIds) ? data.appliedAdminCmdIds : []
        });

        try {
          localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.buildSaveData(ownerUid)));
        } catch (e) {}
      }

      const activeResetToken = (this.lbAdminRules && this.lbAdminRules.seasonResetToken) || SEASON_RESET_ID;
      const needsSeasonReset = (this.appliedSeasonResetId !== SEASON_RESET_ID) || (
        !!(this.lbAdminRules && this.lbAdminRules.seasonResetToken) &&
        this.appliedSeasonResetToken !== this.lbAdminRules.seasonResetToken &&
        !this.isSavePostSeasonReset(data)
      );
      if (needsSeasonReset) {
        this.applySeasonResetMigration(data, true, activeResetToken);
      } else if (this.lbAdminRules && this.lbAdminRules.seasonResetToken && this.appliedSeasonResetToken !== this.lbAdminRules.seasonResetToken) {
        this.appliedSeasonResetToken = this.lbAdminRules.seasonResetToken;
        try { localStorage.setItem('idle_breakout_season_reset_token', this.appliedSeasonResetToken); } catch (e) {}
      }
    } catch (e) {
      console.error('Load failed:', e);
    }
  }

  resetToFreshGuestState(refreshUI = true) {
    const now = Date.now();
    this.saveOwnerUid = null;
    this.coinBtHitCounter = 0;
    this.coinBbHitCounter = 0;
    this.lastRenderedBPStage = null;
    this.pendingOfflineSeconds = 0;
    this.offlineProgressAppliedAt = 0;
    this.pirateShopCooldown = 0;
    this.guestCreatedAt = now;
    this.guestDeadlineAt = now + this.GUEST_RETENTION_MS;
    this.guestLastActiveAt = now;
    this.guestExtendedByManual = false;
    this.playerName = 'Játékos';
    try { localStorage.removeItem('idle_breakout_player_name'); } catch (e) {}
    const pcIn = document.getElementById('player-name-input-pc');
    const mobIn = document.getElementById('player-name-input-mobile');
    if (pcIn) pcIn.value = 'Játékos';
    if (mobIn) mobIn.value = 'Játékos';
    this.money = 0;
    this.level = 1;
    this.bb = 0;
    this.bossTokens = 0;
    this.rebirthCount = 0;
    this.rebirthMultiplier = 1.0;
    this.lastAdminEditAt = 0;
    this.clickUpgradeLevel = 1;
    this.clickPower = 1;
    this.pierceSpeedUpgradeLevel = 0;
    this.nextBossIsGold = false;
    this.nextLevelIsGold = false;
    this.isGoldLevelActive = false;
    this.autoClickerStrikeCount = 0;
    this.screenShake = 0;
    this.totalBricksDestroyed = 0;
    this.battlePassClaimedFree = {};
    this.battlePassClaimedPaid = {};
    this.normalBallEquips = {};
    this.ballTypeEquips = {};
    this.balls = [];
    this.activePowerUps = {};
    this.bonusOrb = null;
    this.visualRings = [];
    this.bossSparks = [];
    this.debrisParticles = [];
    this.ghostBombs = [];
    this.rockets = [];
    this.floatingTexts = [];
    for (const k in this.ballTypes) {
      this.ballTypes[k].count = 0;
      this.ballTypes[k].speedLevel = 1;
      this.ballTypes[k].powerLevel = 1;
    }
    for (const k in this.bbUpgrades) this.bbUpgrades[k] = 0;
    for (const k in this.btUpgrades) this.btUpgrades[k] = 0;

    try { localStorage.removeItem(this.SAVE_KEY); } catch (e) {}

    if (refreshUI) {
      this.generateLevel(1);
      this.renderPowerUpsHUD();
      this.updateHUD();
      this.renderLeaderboard();
      this.renderBattlePass();
      this.refreshOpenModals();
    }
  }

  setPlayerNameDirect(newName) {
    const clean = (newName || '').trim().slice(0, 12);
    if (!clean) return;
    this.playerName = clean;
    try { localStorage.setItem('idle_breakout_player_name', this.playerName); } catch (e) {}
    const pcInput = document.getElementById('player-name-input-pc');
    const mobileInput = document.getElementById('player-name-input-mobile');
    if (pcInput) pcInput.value = this.playerName;
    if (mobileInput) mobileInput.value = this.playerName;
    const pcLocked = document.getElementById('player-locked-name-pc');
    const mobLocked = document.getElementById('player-locked-name-mobile');
    if (pcLocked) pcLocked.textContent = this.playerName;
    if (mobLocked) mobLocked.textContent = this.playerName;
    this.renderLeaderboard();
    this.broadcastMyStatus();
  }

  // --- Ball Trails & Visual Accents ---
  drawBallTrails() {
    for (const ball of this.balls) {
      if (!ball.trail || ball.trail.length < 2) continue;
      this.ctx.save();
      const tLen = ball.trail.length;
      for (let t = 0; t < tLen - 1; t++) {
        const pt = ball.trail[t];
        const nextPt = ball.trail[t + 1];
        const alpha = ((t + 1) / tLen) * 0.45;
        this.ctx.beginPath();
        this.ctx.moveTo(pt.x, pt.y);
        this.ctx.lineTo(nextPt.x, nextPt.y);

        if (ball.type === 'speedy') {
          this.ctx.strokeStyle = `rgba(0, 217, 255, ${alpha * 1.5})`;
          this.ctx.lineWidth = ball.radius * 0.8;
          this.ctx.lineCap = 'round';
          this.ctx.stroke();
        } else if (ball.type === 'poison') {
          this.ctx.strokeStyle = `rgba(34, 197, 94, ${alpha * 1.2})`;
          this.ctx.lineWidth = ball.radius * 0.6;
          this.ctx.stroke();
        } else if (ball.type === 'smasher') {
          this.ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 1.3})`;
          this.ctx.lineWidth = ball.radius * 0.9;
          this.ctx.stroke();
        } else if (ball.type === 'rocket') {
          this.ctx.strokeStyle = `rgba(249, 115, 22, ${alpha * 1.4})`;
          this.ctx.lineWidth = ball.radius * 0.7;
          this.ctx.stroke();
        } else if (ball.type === 'ghost') {
          this.ctx.strokeStyle = `rgba(186, 230, 253, ${alpha * 0.9})`;
          this.ctx.lineWidth = ball.radius * 1.1;
          this.ctx.stroke();
        } else if (ball.type === 'multiply') {
          const hue = (this.animTime * 120 + t * 40) % 360;
          this.ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
          this.ctx.lineWidth = ball.radius * 0.7;
          this.ctx.stroke();
        } else if (ball.type === 'heavy') {
          this.ctx.strokeStyle = `rgba(185, 28, 28, ${alpha * 0.8})`;
          this.ctx.lineWidth = ball.radius * 1.1;
          this.ctx.stroke();
        } else if (ball.type === 'symbiot') {
          this.ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 1.4})`;
          this.ctx.lineWidth = ball.radius * 1.05;
          this.ctx.stroke();
        } else if (ball.type === 'coin') {
          this.ctx.strokeStyle = `rgba(250, 204, 21, ${alpha * 1.35})`;
          this.ctx.lineWidth = ball.radius * 0.75;
          this.ctx.stroke();
        } else if (ball.type === 'normal') {
          this.ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.8})`;
          this.ctx.lineWidth = ball.radius * 0.5;
          this.ctx.stroke();
        }
      }
      this.ctx.restore();
    }
  }

  // --- Universal Ball Custom Cosmetics (Skins & Effects) Renderer ---
  drawCosmeticEffectLayer(ctx, ball, effectId) {
    if (!effectId || effectId === 'none') return;
    const x = ball.x;
    const y = ball.y;
    const r = ball.radius;

    // 1. Draw Custom Effect (Background / Aura / Particle Layers)
    if (effectId === 'fx_cosmic_rare') {
      // RITKA: Kozmikus Szingularitás - Fekete lyuk örvény & csillagpor
      ctx.save();
      const rot = this.animTime * 3;
      ctx.beginPath();
      ctx.arc(x, y, r + 7 + Math.sin(this.animTime * 6) * 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      for (let i = 0; i < 4; i++) {
        const a = rot + (i * Math.PI / 2);
        const dist = r + 5 + Math.sin(this.animTime * 4 + i) * 3;
        ctx.fillStyle = i % 2 === 0 ? '#fde047' : '#38bdf8';
        ctx.fillRect(x + Math.cos(a) * dist - 1.5, y + Math.sin(a) * dist - 1.5, 3, 3);
      }
      ctx.restore();
    } else if (effectId === 'fx_flame' || effectId === 'fx_p_darkflame') {
      ctx.save();
      const isDark = (effectId === 'fx_p_darkflame');
      ctx.beginPath();
      ctx.arc(x, y, r + 4 + Math.sin(this.animTime * 12) * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? 'rgba(147, 51, 234, 0.8)' : 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    } else if (effectId === 'fx_frost') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r + 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    } else if (effectId === 'fx_starlight' || effectId === 'fx_p_golddust') {
      ctx.save();
      const isGold = (effectId === 'fx_p_golddust');
      ctx.fillStyle = isGold ? '#facc15' : '#fef08a';
      for (let i = 0; i < 3; i++) {
        const ang = this.animTime * 4 + (i * Math.PI * 2 / 3);
        const dist = r + 4 + Math.sin(this.animTime * 6 + i) * 2;
        ctx.fillRect(x + Math.cos(ang) * dist - 1, y + Math.sin(ang) * dist - 1, 2, 2);
      }
      ctx.restore();
    } else if (effectId === 'fx_p_rings') {
      ctx.save();
      const ringR = r + 2 + ((this.animTime * 20) % 10);
      const ringAlpha = 1 - (((this.animTime * 20) % 10) / 10);
      ctx.beginPath();
      ctx.arc(x, y, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(34, 197, 94, ${ringAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    } else if (effectId === 'fx_p_lightning' || effectId === 'fx_p_violetlightning') {
      ctx.save();
      const isViolet = (effectId === 'fx_p_violetlightning');
      ctx.strokeStyle = isViolet ? '#e879f9' : '#38bdf8';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        const a = (this.animTime * 8) + i * 2.1;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * (r + 1), y + Math.sin(a) * (r + 1));
        ctx.lineTo(x + Math.cos(a + 0.5) * (r + 5), y + Math.sin(a + 0.5) * (r + 5));
        ctx.stroke();
      }
      ctx.restore();
    } else if (effectId === 'fx_saturn') {
      ctx.save();
      const tilt = -0.35 + Math.sin(this.animTime * 1.6) * 0.08;
      const orbitAngle = this.animTime * 2.8;
      ctx.translate(x, y);
      ctx.rotate(tilt);

      // Keringő mini-hold a labda mögötti félpályán
      if (Math.sin(orbitAngle) < 0) {
        const mx = Math.cos(orbitAngle) * (r * 2.15);
        const my = Math.sin(orbitAngle) * (r * 0.62);
        ctx.beginPath();
        ctx.arc(mx, my, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = '#e0f2fe';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Hátsó Szaturnusz gyűrűív (Math.PI .. 2*Math.PI)
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 2.15, r * 0.62, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.82)';
      ctx.lineWidth = 3.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.68, r * 0.45, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(254, 243, 199, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    } else if (effectId === 'fx_p_godcrown') {
      ctx.save();
      // Glória
      ctx.beginPath();
      ctx.ellipse(x, y - r - 5, r * 0.9, 3, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    } else if (effectId === 'fx_s2_aurora') {
      ctx.save();
      const rot = this.animTime * 2.2;
      ctx.beginPath();
      ctx.ellipse(x, y, r + 6, r + 2.5, rot, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x, y, r + 4, r + 7, -rot, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.75)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    } else if (effectId === 'fx_s2_orbitals') {
      ctx.save();
      for (let i = 0; i < 3; i++) {
        const tilt = i * (Math.PI / 3);
        const a = this.animTime * 5 + i * 2.1;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, r + 6, r * 0.45 + 2, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(Math.cos(a) * (r + 6), Math.sin(a) * (r * 0.45 + 2), 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    } else if (effectId === 'fx_s2_phoenix') {
      ctx.save();
      const pulse = Math.sin(this.animTime * 10) * 2.5;
      ctx.beginPath();
      ctx.arc(x, y, r + 5 + pulse * 0.4, Math.PI * 0.15, Math.PI * 0.85);
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, r + 5 + pulse * 0.4, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.4;
      ctx.stroke();
      ctx.restore();
    } else if (effectId === 'fx_s2_vortex') {
      ctx.save();
      const baseA = this.animTime * 6;
      for (let i = 0; i < 4; i++) {
        const a = baseA + i * (Math.PI / 2);
        ctx.beginPath();
        ctx.arc(x, y, r + 6, a, a + 0.9);
        ctx.strokeStyle = i % 2 === 0 ? '#06b6d4' : '#ec4899';
        ctx.lineWidth = 2.1;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  drawCosmeticEffectFrontLayer(ctx, ball, effectId, breakEffectId) {
    const x = ball.x;
    const y = ball.y;
    const r = ball.radius;

    if (effectId === 'fx_saturn') {
      ctx.save();
      const tilt = -0.35 + Math.sin(this.animTime * 1.6) * 0.08;
      const orbitAngle = this.animTime * 2.8;
      ctx.translate(x, y);
      ctx.rotate(tilt);

      // Elülső Szaturnusz gyűrűív (0 .. Math.PI) a labda előtt áthaladva
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 2.15, r * 0.62, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.95)';
      ctx.lineWidth = 3.4;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.68, r * 0.45, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(254, 249, 195, 0.96)';
      ctx.lineWidth = 1.7;
      ctx.stroke();

      // Keringő mini-hold a labda előtti félpályán
      if (Math.sin(orbitAngle) >= 0) {
        const mx = Math.cos(orbitAngle) * (r * 2.15);
        const my = Math.sin(orbitAngle) * (r * 0.62);
        ctx.beginPath();
        ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
      ctx.restore();
    }

    if (breakEffectId === 'brk_explode') {
      ctx.save();
      for (let i = 0; i < 2; i++) {
        const ang = this.animTime * 6.5 + i * Math.PI;
        const dist = r + 3.5;
        const sx = x + Math.cos(ang) * dist;
        const sy = y + Math.sin(ang) * dist;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#fde047' : '#fb923c';
        ctx.fill();
      }
      ctx.restore();
    }
  }

  drawCosmeticSkinBody(ctx, ball, skinId) {
    const x = ball.x;
    const y = ball.y;
    const r = ball.radius;
    ctx.save();
    let fillColor = BALL_SKIN_COLORS[skinId] || ball.color;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Subtle specular highlight
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fill();

    // 3. Draw Unique Animated Skin Layer (A skineken is legyen egyedi animált effekt!)
    this.drawSkinAnimatedEffect(ctx, x, y, r, skinId);

    ctx.restore();
  }

  // --- Animated Skin Effects (Minden skinhez tartozik egyedi pulzáló / lebegő animáció) ---
  drawSkinAnimatedEffect(ctx, x, y, r, skinId) {
    if (!skinId || skinId === 'default') return;

    if (skinId === 'skin_emerald') {
      // Smaragd: Élénkzöld pulzáló auragyűrű és keringő kristályszikra
      ctx.beginPath();
      ctx.arc(x, y, r + 2.5 + Math.sin(this.animTime * 7) * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const ang = this.animTime * 5;
      ctx.fillStyle = '#6ee7b7';
      ctx.fillRect(x + Math.cos(ang) * (r + 3.5) - 1.5, y + Math.sin(ang) * (r + 3.5) - 1.5, 3, 3);
    } else if (skinId === 'skin_p_ruby') {
      // Királyi Rubin: Mélyvörös kristálycsillogás és 4-ágú gyémántcsillag
      ctx.beginPath();
      ctx.arc(x, y, r + 2 + Math.sin(this.animTime * 9) * 1.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      const glint = Math.abs(Math.sin(this.animTime * 4));
      ctx.fillStyle = `rgba(255, 255, 255, ${glint})`;
      ctx.fillRect(x - 2, y - 2, 4, 4);
    } else if (skinId === 'skin_p_obsidian') {
      // Obszidián: Lopakodó sötétlila füstgyűrű és árnyékaura
      ctx.beginPath();
      ctx.arc(x, y, r + 2 + Math.sin(this.animTime * 5) * 1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(126, 34, 206, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (skinId === 'skin_p_matrix') {
      // Neon Mátrix: Digitális zöld pásztázó kódcsík és keringő bináris pixel
      const scanY = y + Math.sin(this.animTime * 7) * (r * 0.65);
      ctx.beginPath();
      ctx.moveTo(x - r * 0.65, scanY);
      ctx.lineTo(x + r * 0.65, scanY);
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const bitA = this.animTime * 6;
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x + Math.cos(bitA) * (r + 3) - 1, y + Math.sin(bitA) * (r + 3) - 1, 2.5, 2.5);
    } else if (skinId === 'skin_violet') {
      // Neon Ibolya: Elektromos ibolya villámkorona pulzus
      ctx.beginPath();
      ctx.arc(x, y, r + 3 + Math.sin(this.animTime * 11) * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    } else if (skinId === 'skin_p_solar') {
      // Napvihar: Tüzes napkitörés plazmaív és keringő napláng szikrák
      for (let i = 0; i < 3; i++) {
        const ang = this.animTime * 4 + i * (Math.PI * 2 / 3);
        ctx.fillStyle = '#fdba74';
        ctx.fillRect(x + Math.cos(ang) * (r + 3.5) - 1.5, y + Math.sin(ang) * (r + 3.5) - 1.5, 3, 3);
      }
    } else if (skinId === 'skin_p_sapphire') {
      // Óceáni Zafír: Kristálytiszta mélykék zafír fénytörés
      ctx.beginPath();
      ctx.arc(x, y, r + 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (skinId === 'skin_gold') {
      // 24K Arany: Fémes arany ragyogás és fényudvar
      ctx.beginPath();
      ctx.arc(x, y, r + 2 + Math.sin(this.animTime * 6) * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      const starA = this.animTime * 3;
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(x + Math.cos(starA) * (r + 3) - 1.5, y + Math.sin(starA) * (r + 3) - 1.5, 3, 3);
    } else if (skinId === 'skin_cyber') {
      // Cyberpunk: Kettős cián és magenta neon split-rim villódzás
      ctx.beginPath();
      ctx.arc(x, y, r + 2.5, 0, Math.PI);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, r + 2.5, Math.PI, Math.PI * 2);
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (skinId === 'skin_blood') {
      // Vérhold: Mélyvérvörös napfogyatkozás pulzus
      ctx.beginPath();
      ctx.arc(x, y, r + 2.5 + Math.sin(this.animTime * 7) * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (skinId === 'skin_p_dragon') {
      // Sárkánytűz: Izzó magma perem és felszálló parázs szikra
      ctx.beginPath();
      ctx.arc(x, y, r + 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      const emberY = y - r - 2 - ((this.animTime * 14) % 6);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(x - 1, emberY, 2, 2);
    } else if (skinId === 'skin_p_godlight') {
      // Istenfény: Keringő aranyszínű égi fénysugarak
      const rot = this.animTime * 2.2;
      ctx.save();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.8;
      for (let i = 0; i < 4; i++) {
        const a = rot + (i * Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * (r + 1), y + Math.sin(a) * (r + 1));
        ctx.lineTo(x + Math.cos(a) * (r + 5.5), y + Math.sin(a) * (r + 5.5));
        ctx.stroke();
      }
      ctx.restore();
    } else if (skinId === 'skin_s2_prism') {
      const hue = (this.animTime * 160) % 360;
      ctx.beginPath();
      ctx.arc(x, y, r + 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${hue}, 92%, 62%)`;
      ctx.lineWidth = 2.2;
      ctx.stroke();
    } else if (skinId === 'skin_s2_magma') {
      ctx.beginPath();
      ctx.arc(x, y, r * 0.52, 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r + 2.2 + Math.sin(this.animTime * 9) * 1.1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (skinId === 'skin_s2_hologram') {
      const scanY = y + Math.sin(this.animTime * 8) * (r * 0.7);
      ctx.beginPath();
      ctx.moveTo(x - r * 0.75, scanY);
      ctx.lineTo(x + r * 0.75, scanY);
      ctx.strokeStyle = '#a5f3fc';
      ctx.lineWidth = 1.7;
      ctx.stroke();
    } else if (skinId === 'skin_s2_amethyst') {
      ctx.beginPath();
      ctx.arc(x, y, r + 2.2, 0, Math.PI * 2);
      ctx.strokeStyle = '#d8b4fe';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.fillStyle = '#faf5ff';
      ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
    } else if (skinId === 'skin_s2_eclipse') {
      ctx.beginPath();
      ctx.arc(x, y, r + 2.6, 0, Math.PI * 2);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.4;
      ctx.stroke();
    } else if (skinId === 'skin_s2_chrono') {
      const a = this.animTime * 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * (r * 0.75), y + Math.sin(a) * (r * 0.75));
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    } else if (skinId === 'skin_s2_celestial') {
      const hue = (this.animTime * 110) % 360;
      ctx.beginPath();
      ctx.arc(x, y, r + 3, 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${hue}, 95%, 68%)`;
      ctx.lineWidth = 2.4;
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      for (let i = 0; i < 3; i++) {
        const ang = this.animTime * 4.5 + i * (Math.PI * 2 / 3);
        ctx.fillRect(x + Math.cos(ang) * (r + 4.5) - 1.5, y + Math.sin(ang) * (r + 4.5) - 1.5, 3, 3);
      }
    }
  }

  needsWelcomeName() {
    if (this.cloud && this.cloud.currentUser) return false;
    let storedName = '';
    try { storedName = (localStorage.getItem('idle_breakout_player_name') || '').trim(); } catch (e) {}
    const curName = (this.playerName || '').trim();
    if (!storedName && (!curName || curName.toLowerCase() === 'játékos')) return true;
    if (!curName || curName.toLowerCase() === 'játékos') return true;
    return false;
  }

  openWelcomeMenu() {
    const modal = document.getElementById('welcome-menu-modal');
    const input = document.getElementById('welcome-name-input');
    const warn = document.getElementById('welcome-name-warn');
    if (warn) {
      warn.textContent = '';
      warn.style.display = 'none';
    }
    if (input) {
      input.classList.remove('input-over-limit');
      const cur = (this.playerName || '').trim();
      if (cur && cur.toLowerCase() !== 'játékos') input.value = cur;
    }
    if (modal) modal.classList.add('open');
    if (input) setTimeout(() => input.focus(), 60);
  }

  closeWelcomeMenu() {
    const modal = document.getElementById('welcome-menu-modal');
    if (modal) modal.classList.remove('open');
  }

  initWelcomeMenu() {
    const form = document.getElementById('welcome-guest-form');
    const nameInput = document.getElementById('welcome-name-input');
    const warn = document.getElementById('welcome-name-warn');
    const loginBtn = document.getElementById('btn-welcome-login');
    const regBtn = document.getElementById('btn-welcome-register');

    const showNameWarn = (msg) => {
      if (warn) {
        warn.textContent = msg;
        warn.style.display = 'block';
      }
      if (nameInput) nameInput.classList.add('input-over-limit');
    };

    const clearNameWarn = () => {
      if (warn) {
        warn.textContent = '';
        warn.style.display = 'none';
      }
      if (nameInput) nameInput.classList.remove('input-over-limit');
    };

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        const val = nameInput.value.trim();
        if (val.length > 12) {
          showNameWarn('⚠️ A név legfeljebb 12 karakter lehet!');
        } else {
          clearNameWarn();
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = (nameInput ? nameInput.value : '').trim();
        if (!val || val.toLowerCase() === 'játékos') {
          showNameWarn('⚠️ Kötelező egyedi játékosnevet megadni!');
          if (nameInput) nameInput.focus();
          return;
        }
        if (val.length > 12) {
          showNameWarn('⚠️ A név legfeljebb 12 karakter lehet!');
          if (nameInput) nameInput.focus();
          return;
        }

        clearNameWarn();
        this.playerName = val;
        try { localStorage.setItem('idle_breakout_player_name', this.playerName); } catch (err) {}
        const pcInput = document.getElementById('player-name-input-pc');
        const mobileInput = document.getElementById('player-name-input-mobile');
        if (pcInput) pcInput.value = this.playerName;
        if (mobileInput) mobileInput.value = this.playerName;

        this.renderLeaderboard();
        this.broadcastMyStatus();
        this.save();
        if (this.cloud) this.cloud.syncLeaderboardToCloud(true);
        this.closeWelcomeMenu();
        if (window.soundEngine) window.soundEngine.playCoin();
        this.showToast(`👋 Üdvözlünk, <strong>${this.escapeHtml(this.playerName)}</strong>!`, 3200);
      });
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        if (this.cloud && typeof this.cloud.openAuthModal === 'function') {
          this.cloud.openAuthModal('login');
        }
      });
    }

    if (regBtn) {
      regBtn.addEventListener('click', () => {
        const typedName = (nameInput ? nameInput.value : '').trim();
        if (this.cloud && typeof this.cloud.openAuthModal === 'function') {
          this.cloud.openAuthModal('register', typedName);
        }
      });
    }

    if (this.needsWelcomeName()) {
      this.openWelcomeMenu();
    }
  }

  // --- Real-Time Multiplayer Leaderboard System (EMQX MQTT over WebSocket) ---
  initLeaderboard() {
    this.renderLeaderboard();

    const bindLengthGuard = (inputId, warnId, maxLen) => {
      const inp = document.getElementById(inputId);
      const warn = document.getElementById(warnId);
      if (!inp) return;
      const syncWarn = () => {
        const exceeded = (inp.value || '').trim().length > maxLen;
        if (warn) warn.style.display = exceeded ? 'block' : 'none';
        inp.classList.toggle('input-over-limit', exceeded);
      };
      inp.addEventListener('input', syncWarn);
    };
    bindLengthGuard('player-name-input-pc', 'name-limit-warn-pc', 12);
    bindLengthGuard('player-name-input-mobile', 'name-limit-warn-mobile', 12);
    bindLengthGuard('auth-reg-name', 'auth-reg-name-warn', 12);
    bindLengthGuard('auth-reg-password', 'auth-reg-pass-warn', 20);
    bindLengthGuard('auth-login-password', 'auth-login-pass-warn', 20);

    const saveName = (inputEl, warnId) => {
      if (this.cloud && this.cloud.currentUser) return;
      const val = (inputEl.value || '').trim();
      const warn = document.getElementById(warnId);
      if (!val) return;
      if (val.length > 12) {
        if (warn) warn.style.display = 'block';
        inputEl.classList.add('input-over-limit');
        this.showToast('⚠️ A játékosnév legfeljebb 12 karakter lehet!', 2600);
        return;
      }
      if (warn) warn.style.display = 'none';
      inputEl.classList.remove('input-over-limit');
      this.playerName = val;
      try { localStorage.setItem('idle_breakout_player_name', this.playerName); } catch (e) {}
      const pcInput = document.getElementById('player-name-input-pc');
      const mobileInput = document.getElementById('player-name-input-mobile');
      if (pcInput) pcInput.value = this.playerName;
      if (mobileInput) mobileInput.value = this.playerName;
      this.renderLeaderboard();
      this.broadcastMyStatus(); // Azonnali hálózati névfrissítés mindenkinél!
      this.showToast(`✅ Játékosnév mentve: <strong>${this.playerName}</strong>!`, 3000);
      this.save();
      if (this.cloud) {
        this.cloud.updateAuthUI();
        this.cloud.syncLeaderboardToCloud(true);
        this.cloud.saveToCloud(true);
      }
    };

    const pcInput = document.getElementById('player-name-input-pc');
    const pcSaveBtn = document.getElementById('btn-save-name-pc');
    if (pcInput) {
      pcInput.value = this.playerName;
      pcInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveName(pcInput, 'name-limit-warn-pc');
      });
    }
    if (pcSaveBtn && pcInput) {
      pcSaveBtn.addEventListener('click', () => saveName(pcInput, 'name-limit-warn-pc'));
    }

    const mobileInput = document.getElementById('player-name-input-mobile');
    const mobileSaveBtn = document.getElementById('btn-save-name-mobile');
    if (mobileInput) {
      mobileInput.value = this.playerName;
      mobileInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveName(mobileInput, 'name-limit-warn-mobile');
      });
    }
    if (mobileSaveBtn && mobileInput) {
      mobileSaveBtn.addEventListener('click', () => saveName(mobileInput, 'name-limit-warn-mobile'));
    }

    // Valós idejű multiplayer kapcsolat inicializálása
    this.initRealtimeLeaderboard();
  }

  initRealtimeLeaderboard() {
    if (typeof mqtt === 'undefined' || !mqtt.connect) {
      console.warn('MQTT library nem elérhető; offline állapot.');
      this.updateLeaderboardConnUI(false);
      return;
    }

    const brokerUrls = [
      'wss://broker.emqx.io:8084/mqtt',
      'wss://broker.hivemq.com:8884/mqtt'
    ];
    let currentBrokerIdx = 0;

    const connectToBroker = () => {
      const url = brokerUrls[currentBrokerIdx];
      try {
        const client = mqtt.connect(url, {
          clientId: 'ib_' + this.myPlayerId + '_' + Math.random().toString(16).substring(2, 6),
          keepalive: 30,
          clean: true,
          connectTimeout: 7000,
          reconnectPeriod: 6000
        });

        this.mqttClient = client;

        client.on('connect', () => {
          this.mqttConnected = true;
          this.updateLeaderboardConnUI(true);

          // Feliratkozás az összes játékos állapotára, szinkron kérésekre és fejlesztői szabályokra
          client.subscribe('shirelix/idle_breakout_v4/players/+', { qos: 0 });
          client.subscribe('shirelix/idle_breakout_v4/sync', { qos: 0 });
          client.subscribe('shirelix/idle_breakout_v4/admin/rules', { qos: 0 });

          // Ha már be van jelentkezve, takarítsuk le az esetleges korábbi vendég/duplikált MQTT topicokat:
          if (this.cloud && this.cloud.currentUser) {
            this.cleanupDuplicateMqttForUid(this.cloud.currentUser.uid);
          }

          // Saját állapot azonnali közzététele (retain: true, hogy az újonnan érkezők azonnal megkapják!)
          this.broadcastMyStatus();

          // Szinkron kérés küldése a már online lévő többi játékos felé
          try {
            client.publish('shirelix/idle_breakout_v4/sync', JSON.stringify({
              type: 'ping',
              sender: this.myPlayerId
            }), { qos: 0 });
          } catch (e) {}
        });

        client.on('message', (topic, payload) => {
          try {
            const str = payload.toString();
            if (topic.startsWith('shirelix/idle_breakout_v4/players/')) {
              const topicId = topic.slice('shirelix/idle_breakout_v4/players/'.length);
              if (!str || !str.trim()) {
                if (topicId && this.remotePlayers[topicId]) {
                  delete this.remotePlayers[topicId];
                  try {
                    localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers));
                  } catch (e) {}
                  this.renderLeaderboard();
                }
                return;
              }

              const data = JSON.parse(str);
              const myUid = (this.cloud && this.cloud.currentUser) ? this.cloud.currentUser.uid : null;
              const canonKey = (data && (data.uid || data.id)) || topicId;
              const isSelf = !data ||
                data.id === this.myPlayerId ||
                topicId === this.myPlayerId ||
                (myUid && (data.uid === myUid || canonKey === myUid));

              if (!isSelf) {
                const nowMs = Date.now();
                const existing = this.remotePlayers[canonKey];
                const dReb = Math.max(0, Number(data.rebirths) || 0);
                const dLvl = Math.max(1, Number(data.level) || 1);
                const dBrk = Math.max(0, Number(data.bricks) || 0);
                const optNum = (v) => (v !== undefined && v !== null && !Number.isNaN(Number(v))) ? Math.max(0, Math.floor(Number(v))) : null;
                const dMoney = optNum(data.money);
                const dBb = optNum(data.bb);
                const dBt = optNum(data.bt);
                const dBpStage = optNum(data.bpStage);
                const dTs = Math.min(Number(data.ts) || nowMs, nowMs);
                const isProtectedRemote = !!(data.uid || (existing && (existing.uid || existing.fromFirestore || existing.keepInTop10)));
                if (!isProtectedRemote && (nowMs - dTs >= this.GUEST_RETENTION_MS)) {
                  // Csak a >3 napos inaktív, nem Top 10 vendég maradjon ki
                  return;
                }

                const dAdminTs = Number(data.adminUpdatedAt) || 0;
                const dSeasonToken = String(data.seasonResetToken || '').trim();
                const incomingPreReset = this.isPreSeasonResetRecord({ ts: dTs, adminUpdatedAt: dAdminTs, seasonResetToken: dSeasonToken });
                const existingPreReset = existing ? this.isPreSeasonResetRecord(existing) : false;
                const isSeasonResetTransition = !incomingPreReset && existingPreReset;
                const incomingStalePreReset = !!(existing && incomingPreReset && !existingPreReset);

                let keepReb = dReb;
                let keepLvl = dLvl;
                let keepBrk = dBrk;
                let keepMoney = dMoney ?? (existing ? existing.money ?? null : null);
                let keepBb = dBb ?? (existing ? existing.bb ?? null : null);
                let keepBt = dBt ?? (existing ? existing.bt ?? null : null);
                let keepBpStage = dBpStage ?? (existing ? existing.bpStage ?? null : null);
                let keepSeasonToken = dSeasonToken || null;
                if (existing) {
                  const exReb = Math.max(0, Number(existing.rebirths) || 0);
                  const exLvl = Math.max(1, Number(existing.level) || 1);
                  const exBrk = Math.max(0, Number(existing.bricks) || 0);
                  const exAdminTs = Number(existing.adminUpdatedAt) || 0;
                  const incomingNewerAdmin = isSeasonResetTransition || dAdminTs > exAdminTs;
                  const existingStrictlyHigher = !incomingNewerAdmin && ((exReb > dReb) || (exReb === dReb && exLvl > dLvl));
                  const existingNewerAdmin = !isSeasonResetTransition && exAdminTs > dAdminTs && dTs <= exAdminTs + 5000;

                  // Egy normál játékos sosem esik vissza alacsonyabb Rebirth-re vagy ugyanazon Rebirth-en alacsonyabb szintre
                  // (kivéve újabb admin szerkesztés vagy globális Szezon Reset).
                  if (incomingStalePreReset || existingNewerAdmin || existingStrictlyHigher) {
                    keepReb = exReb;
                    keepLvl = exLvl;
                    keepBrk = exBrk;
                    keepMoney = existing.money ?? keepMoney;
                    keepBb = existing.bb ?? keepBb;
                    keepBt = existing.bt ?? keepBt;
                    keepBpStage = existing.bpStage ?? keepBpStage;
                    keepSeasonToken = existing.seasonResetToken || keepSeasonToken;
                  }
                }

                const incomingName = (data.name || '').trim().slice(0, 12);
                const prevName = (existing && existing.name || '').trim().slice(0, 12);
                const resolvedName = (incomingName && incomingName !== 'Játékos')
                  ? incomingName
                  : ((prevName && prevName !== 'Játékos') ? prevName : (incomingName || prevName || 'Játékos'));

                const prevLocalSeen = (existing && existing.lastSeenLocalMs) ? Number(existing.lastSeenLocalMs) : 0;
                const mqttChangedProgressOrTs = !!(existing && (
                  dReb !== (existing.rebirths || 0) ||
                  dLvl !== (existing.level || 1) ||
                  dBrk !== (existing.bricks || 0) ||
                  dTs > (existing.ts || 0) + 1000
                ));
                const mqttFreshTs = (nowMs - dTs) < 45000;
                const nextLocalSeen = (mqttChangedProgressOrTs || mqttFreshTs) ? nowMs : prevLocalSeen;

                this.remotePlayers[canonKey] = {
                  id: canonKey,
                  uid: data.uid || (existing && existing.uid) || null,
                  docId: (existing && existing.docId) || null,
                  clientId: data.id || (existing && existing.clientId) || null,
                  fromFirestore: !!(existing && existing.fromFirestore),
                  _liveMqttInSession: true,
                  keepInTop10: !!(existing && existing.keepInTop10),
                  name: resolvedName,
                  rebirths: keepReb,
                  level: keepLvl,
                  bricks: keepBrk,
                  money: keepMoney,
                  bb: keepBb,
                  bt: keepBt,
                  bpStage: keepBpStage,
                  seasonResetToken: keepSeasonToken,
                  ts: Math.min(nowMs, Math.max(dTs, (existing && existing.ts) || 0)),
                  lastSeenLocalMs: nextLocalSeen,
                  adminUpdatedAt: Math.max((existing && existing.adminUpdatedAt) || 0, dAdminTs)
                };

                // Ha külön kliens-ID alatt is bent volt ugyanez az UID, töröljük a duplikált kulcsot
                if (data.id && data.id !== canonKey && this.remotePlayers[data.id]) {
                  delete this.remotePlayers[data.id];
                }
                if (topicId && topicId !== canonKey && this.remotePlayers[topicId]) {
                  delete this.remotePlayers[topicId];
                }

                try {
                  localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers));
                } catch (e) {}
                this.renderLeaderboard();
              } else if (myUid && data && data.uid === myUid && topicId && topicId !== myUid) {
                // Saját fiók régebbi böngészős duplikált MQTT üzenetének automatikus eltüntetése a brókerről!
                this.clearRetainedMqttPlayer(topicId);
              }
            } else if (topic === 'shirelix/idle_breakout_v4/sync') {
              const ping = JSON.parse(str);
              if (ping && ping.sender && ping.sender !== this.myPlayerId) {
                // Új játékos csatlakozott a hálózathoz vagy a fejlesztő élő szinkront kért! Küldjük el azonnal az állapotunkat:
                this.broadcastMyStatus();
                if (ping.reason === 'dev_sync' && this.cloud) {
                  this.cloud.syncLeaderboardToCloud(true);
                }
              }
            } else if (topic === 'shirelix/idle_breakout_v4/admin/rules') {
              if (str && str.trim()) {
                const rulesData = JSON.parse(str);
                this.applyIncomingAdminRules(rulesData, 'mqtt');
              }
            }
          } catch (err) {
            console.error('MQTT message error:', err);
          }
        });

        client.on('close', () => {
          this.mqttConnected = false;
          this.updateLeaderboardConnUI(false);
        });

        client.on('error', (err) => {
          console.warn('MQTT connection error on ' + url + ':', err);
          this.mqttConnected = false;
          this.updateLeaderboardConnUI(false);
          // Ha nem sikerült, próbáljuk a tartalék brókert
          try { client.end(true); } catch (e) {}
          currentBrokerIdx = (currentBrokerIdx + 1) % brokerUrls.length;
          setTimeout(connectToBroker, 5000);
        });
      } catch (e) {
        console.error('Failed to init MQTT:', e);
      }
    };

    connectToBroker();
  }

  updateLeaderboardConnUI(isConnected) {
    const fbReady = !!(this.cloud && this.cloud.isReady && this.cloud.isConfigured);
    const mqttOk = typeof isConnected === 'boolean' ? isConnected : !!this.mqttConnected;
    for (const suffix of ['-pc', '-mobile']) {
      const el = document.getElementById(`lb-conn-status${suffix}`);
      if (el) {
        if (mqttOk && fbReady) {
          el.classList.add('connected');
          el.innerHTML = '<span class="conn-dot"></span> ÉLŐ MULTIPLAYER';
        } else if (mqttOk) {
          el.classList.add('connected');
          el.innerHTML = '<span class="conn-dot"></span> MQTT ÉLŐ (FELHŐ NÉLKÜL)';
        } else if (fbReady) {
          el.classList.remove('connected');
          el.innerHTML = '<span class="conn-dot"></span> CSATLAKOZÁS...';
        } else {
          el.classList.remove('connected');
          el.innerHTML = '<span class="conn-dot"></span> 💾 HELYI MÓD (OFFLINE)';
        }
      }
    }
  }

  clearRetainedMqttPlayer(topicPlayerId) {
    if (!topicPlayerId || !this.mqttClient || !this.mqttConnected) return;
    try {
      this.mqttClient.publish(`shirelix/idle_breakout_v4/players/${topicPlayerId}`, '', { retain: true, qos: 0 });
    } catch (e) {}
  }

  cleanupDuplicateMqttForUid(uid) {
    if (!uid) return;
    if (this.myPlayerId && this.myPlayerId !== uid) {
      this.clearRetainedMqttPlayer(this.myPlayerId);
    }
    if (this.remotePlayers) {
      let pruned = false;
      for (const k of Object.keys(this.remotePlayers)) {
        const rp = this.remotePlayers[k];
        if (!rp) continue;
        if (k === uid || rp.uid === uid) {
          if (k !== uid) this.clearRetainedMqttPlayer(k);
          if (rp.clientId && rp.clientId !== uid) this.clearRetainedMqttPlayer(rp.clientId);
          delete this.remotePlayers[k];
          pruned = true;
        }
      }
      if (pruned) {
        try {
          localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers));
        } catch (e) {}
        this.renderLeaderboard();
      }
    }
  }

  getCurrentBattlePassStage(bricks = this.totalBricksDestroyed) {
    const count = Math.max(0, Number(bricks) || 0);
    let stageNum = 1;
    for (let i = 0; i < BATTLE_PASS_STAGES.length; i++) {
      if (count >= BATTLE_PASS_STAGES[i].bricks) {
        stageNum = BATTLE_PASS_STAGES[i].stage;
      } else {
        break;
      }
    }
    return stageNum;
  }

  broadcastMyStatus() {
    if (!this.mqttClient || !this.mqttConnected) return;
    try {
      const myUid = (this.cloud && this.cloud.currentUser) ? this.cloud.currentUser.uid : null;
      const publishKey = myUid || this.myPlayerId;
      const payload = JSON.stringify({
        id: this.myPlayerId,
        uid: myUid,
        name: this.playerName || 'Játékos',
        rebirths: this.rebirthCount || 0,
        level: this.level || 1,
        bricks: this.totalBricksDestroyed || 0,
        money: Math.floor(Math.max(0, Number(this.money) || 0)),
        bb: Math.max(0, Math.floor(Number(this.bb) || 0)),
        bt: Math.max(0, Math.floor(Number(this.bossTokens) || 0)),
        bpStage: this.getCurrentBattlePassStage(),
        seasonResetToken: this.appliedSeasonResetToken || '',
        adminUpdatedAt: this.lastAdminEditAt || 0,
        ts: Date.now()
      });
      this.mqttClient.publish(`shirelix/idle_breakout_v4/players/${publishKey}`, payload, { retain: true, qos: 0 });
    } catch (e) {}
  }

  syncWalletChangeNow(immediate = false) {
    if (immediate) {
      if (this._walletSyncTimer) {
        clearTimeout(this._walletSyncTimer);
        this._walletSyncTimer = null;
      }
      this.broadcastMyStatus();
      if (this.cloud) this.cloud.syncLeaderboardToCloud(false);
      return;
    }
    if (this._walletSyncTimer) return;
    this._walletSyncTimer = setTimeout(() => {
      this._walletSyncTimer = null;
      this.broadcastMyStatus();
      if (this.cloud) this.cloud.syncLeaderboardToCloud(false);
    }, 600);
  }

  requestLivePeersSync() {
    if (!this.mqttClient || !this.mqttConnected) return;
    try {
      this.mqttClient.publish('shirelix/idle_breakout_v4/sync', JSON.stringify({
        sender: this.myPlayerId,
        reason: 'dev_sync',
        ts: Date.now()
      }), { qos: 0 });
    } catch (e) {}
  }

  compareAppVersions(a, b) {
    const pa = String(a || '0').split('.').map(n => parseInt(n, 10) || 0);
    const pb = String(b || '0').split('.').map(n => parseInt(n, 10) || 0);
    const len = Math.max(pa.length, pb.length);
    for (let i = 0; i < len; i++) {
      const da = pa[i] || 0;
      const db = pb[i] || 0;
      if (da !== db) return da - db;
    }
    return 0;
  }

  startAutoUpdateWatcher() {
    if (typeof window === 'undefined' || window.location.protocol === 'file:') return;
    if (this._updateWatcherStarted) return;
    this._updateWatcherStarted = true;
    this._lastVersionCheckAt = 0;

    const checkVersionJson = async () => {
      const now = Date.now();
      if (now - this._lastVersionCheckAt < 15000) return;
      this._lastVersionCheckAt = now;
      try {
        const res = await fetch(`./version.json?t=${now}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.version && this.compareAppVersions(data.version, APP_VERSION) > 0) {
          this.triggerSafeAutoUpdate(String(data.version), 'ver:' + data.version);
        }
      } catch (e) {}
    };

    setTimeout(checkVersionJson, 12000);
    setInterval(checkVersionJson, 45000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkVersionJson();
      }
    });
  }

  async triggerSafeAutoUpdate(targetVersion, reloadKey) {
    if (this._autoUpdateTriggered) return;
    const key = String(reloadKey || targetVersion || 'auto');
    try {
      if (sessionStorage.getItem('idle_breakout_last_reload_key') === key) return;
      const lastAt = Number(sessionStorage.getItem('idle_breakout_last_reload_at') || 0);
      if (lastAt > 0 && (Date.now() - lastAt) < 30000) return;
      sessionStorage.setItem('idle_breakout_last_reload_key', key);
      sessionStorage.setItem('idle_breakout_last_reload_at', String(Date.now()));
    } catch (e) {}

    this._autoUpdateTriggered = true;
    this.showToast(`🔄 <strong>Új frissítés érkezett (v${this.escapeHtml(targetVersion)})!</strong> Haladás mentése és automatikus újratöltés...`, 3500);

    try {
      this.save();
      this.broadcastMyStatus();
      if (this.cloud && this.cloud.currentUser) {
        await Promise.race([
          this.cloud.saveToCloud(true, { silent: true }),
          new Promise(r => setTimeout(r, 1800))
        ]);
      }
    } catch (e) {}

    setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('v', `${targetVersion}_${Date.now().toString(36)}`);
        window.location.replace(url.toString());
      } catch (e) {
        window.location.reload();
      }
    }, 1600);
  }

  escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  getDefaultAdminRules() {
    return {
      version: 2,
      updatedAt: 0,
      minClientVersion: '',
      forceReloadToken: 0,
      seasonResetAt: 0,
      seasonResetToken: '',
      maintenanceMode: false,
      maintenanceMessage: 'Technikai karbantartás zajlik. Kérjük, várj egy pillanatot — amint elkészültünk, a játék automatikusan visszatölt!',
      maintenanceUpdatedAt: 0,
      hideDefaultName: false,
      hideGuests: false,
      hideOffline: false,
      whitelistOnly: false,
      filterLocalSelf: false,
      bannedIds: [],
      bannedNames: [],
      whitelistNames: [],
      overrides: {},
      playerCommands: {},
      currencyGifts: {},
      customPlayers: [],
      adminMails: []
    };
  }

  normalizeAdminRules(raw) {
    const def = this.getDefaultAdminRules();
    if (!raw || typeof raw !== 'object') return def;
    const normList = (arr) => Array.isArray(arr)
      ? [...new Set(arr.map(x => String(x || '').trim()).filter(Boolean))]
      : [];
    const customPlayers = Array.isArray(raw.customPlayers)
      ? raw.customPlayers
          .filter(cp => cp && cp.id)
          .map(cp => ({
            id: String(cp.id),
            name: String(cp.name || 'Játékos').slice(0, 12),
            rebirths: Math.max(0, Number(cp.rebirths) || 0),
            level: Math.max(1, Number(cp.level) || 1),
            bricks: Math.max(0, Number(cp.bricks) || 0),
            isOnline: cp.isOnline !== false
          }))
      : [];
    const overrides = (raw.overrides && typeof raw.overrides === 'object') ? { ...raw.overrides } : {};
    const currencyGifts = {};
    const giftEntries = [];
    const optSet = (v) => (v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v)))
      ? Math.max(0, Math.floor(Number(v)))
      : null;
    if (raw.currencyGifts && typeof raw.currencyGifts === 'object') {
      for (const k of Object.keys(raw.currencyGifts)) {
        const g = raw.currencyGifts[k];
        if (g && typeof g === 'object' && g.cmdId) {
          giftEntries.push([k, {
            cmdId: String(g.cmdId),
            targetIds: normList(g.targetIds),
            targetNameLower: String(g.targetNameLower || '').trim().toLowerCase(),
            addBB: Math.trunc(Number(g.addBB) || 0),
            addBT: Math.trunc(Number(g.addBT) || 0),
            addMoney: Math.trunc(Number(g.addMoney) || 0),
            setBB: optSet(g.setBB),
            setBT: optSet(g.setBT),
            setMoney: optSet(g.setMoney),
            issuedAt: Number(g.issuedAt) || 0
          }]);
        }
      }
    }

    const optInt = (v, min, max) => (v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v)))
      ? Math.max(min, Math.min(max, Math.floor(Number(v))))
      : null;

    const playerCommands = {};
    if (raw.playerCommands && typeof raw.playerCommands === 'object') {
      const entries = [];
      for (const k of Object.keys(raw.playerCommands)) {
        const c = raw.playerCommands[k];
        if (c && typeof c === 'object' && c.cmdId) {
          const isNullGift = (c.rebirths === null || c.rebirths === undefined) && (c.level === null || c.level === undefined) && !c.name;
          const cAddBB = Math.trunc(Number(c.addBB) || 0);
          const cAddBT = Math.trunc(Number(c.addBT) || 0);
          const cAddMoney = Math.trunc(Number(c.addMoney) || 0);
          if (isNullGift) {
            if (cAddBB !== 0 || cAddBT !== 0 || cAddMoney !== 0) {
              giftEntries.push([c.cmdId, {
                cmdId: String(c.cmdId),
                targetIds: normList(c.targetIds),
                targetNameLower: String(c.targetNameLower || '').trim().toLowerCase(),
                addBB: cAddBB,
                addBT: cAddBT,
                addMoney: cAddMoney,
                issuedAt: Number(c.issuedAt) || 0
              }]);
            }
            continue;
          }
          entries.push([k, {
            cmdId: String(c.cmdId),
            targetIds: normList(c.targetIds),
            targetNameLower: String(c.targetNameLower || '').trim().toLowerCase(),
            name: c.name ? String(c.name).trim().slice(0, 12) : '',
            rebirths: optInt(c.rebirths, 0, 999999),
            level: optInt(c.level, 1, 999999),
            addBB: cAddBB,
            addBT: cAddBT,
            addMoney: cAddMoney,
            setBB: optSet(c.setBB),
            setBT: optSet(c.setBT),
            setMoney: optSet(c.setMoney),
            issuedAt: Number(c.issuedAt) || 0
          }]);
        }
      }
      entries.sort((a, b) => (a[1].issuedAt || 0) - (b[1].issuedAt || 0));
      for (const [k, v] of entries.slice(-140)) {
        playerCommands[k] = v;
      }
    }

    giftEntries.sort((a, b) => (a[1].issuedAt || 0) - (b[1].issuedAt || 0));
    for (const [k, v] of giftEntries.slice(-140)) {
      currencyGifts[k] = v;
    }

    const adminMails = Array.isArray(raw.adminMails)
      ? raw.adminMails
          .filter(m => m && typeof m === 'object' && m.id && (m.title || m.body))
          .map(m => ({
            id: String(m.id),
            title: String(m.title || 'Admin üzenet').trim().slice(0, 60),
            body: String(m.body || '').trim().slice(0, 500),
            targetMode: m.targetMode === 'player' ? 'player' : 'all',
            targetIds: normList(m.targetIds),
            targetName: String(m.targetName || 'Mindenki').trim().slice(0, 24),
            targetNameLower: String(m.targetNameLower || '').trim().toLowerCase(),
            sentAt: Number(m.sentAt) || 0
          }))
          .sort((a, b) => a.sentAt - b.sentAt)
          .slice(-40)
      : [];

    return {
      version: 2,
      updatedAt: Number(raw.updatedAt) || 0,
      minClientVersion: String(raw.minClientVersion || '').trim().slice(0, 16),
      forceReloadToken: Math.max(0, Number(raw.forceReloadToken) || 0),
      seasonResetAt: Math.max(0, Number(raw.seasonResetAt) || 0),
      seasonResetToken: String(raw.seasonResetToken || '').trim().slice(0, 64),
      maintenanceMode: !!raw.maintenanceMode,
      maintenanceMessage: String(raw.maintenanceMessage || def.maintenanceMessage || '').trim().slice(0, 300) || def.maintenanceMessage,
      maintenanceUpdatedAt: Math.max(0, Number(raw.maintenanceUpdatedAt) || 0),
      hideDefaultName: !!raw.hideDefaultName,
      hideGuests: !!raw.hideGuests,
      hideOffline: !!raw.hideOffline,
      whitelistOnly: !!raw.whitelistOnly,
      filterLocalSelf: !!raw.filterLocalSelf,
      bannedIds: normList(raw.bannedIds),
      bannedNames: normList(raw.bannedNames).map(s => s.toLowerCase()),
      whitelistNames: normList(raw.whitelistNames).map(s => s.toLowerCase()),
      overrides,
      playerCommands,
      currencyGifts,
      customPlayers,
      adminMails
    };
  }

  loadLocalAdminRules() {
    try {
      const raw = localStorage.getItem('idle_breakout_dev_lb_rules');
      return this.normalizeAdminRules(raw ? JSON.parse(raw) : null);
    } catch (e) {
      return this.getDefaultAdminRules();
    }
  }

  saveAdminRulesLocally() {
    try {
      localStorage.setItem('idle_breakout_dev_lb_rules', JSON.stringify(this.lbAdminRules));
    } catch (e) {}
  }

  processPendingAdminCommands(reloadContext = null) {
    const cmdsObj = (this.lbAdminRules && this.lbAdminRules.playerCommands) || {};
    const giftsObj = (this.lbAdminRules && this.lbAdminRules.currencyGifts) || {};
    const cmdList = [
      ...Object.values(cmdsObj).map(c => (c && typeof c === 'object' ? { ...c, _kind: 'stat' } : null)),
      ...Object.values(giftsObj).map(g => (g && typeof g === 'object' ? { ...g, _kind: 'gift' } : null))
    ]
      .filter(Boolean)
      .sort((a, b) => (a.issuedAt || 0) - (b.issuedAt || 0));
    if (cmdList.length === 0) return false;

    const myUid = (this.cloud && this.cloud.currentUser) ? this.cloud.currentUser.uid : null;
    const myIds = [myUid, this.myPlayerId].filter(Boolean).map(String);
    const myNameLower = (this.playerName || '').trim().toLowerCase();
    const hasReloadCtx = !!(reloadContext && typeof reloadContext === 'object');
    const saveCmdSet = hasReloadCtx ? new Set(reloadContext.saveCmdIds || []) : null;
    const saveTs = hasReloadCtx ? (Number(reloadContext.saveTs) || 0) : 0;
    let changed = false;
    let statEdited = false;
    let giftedBB = 0;
    let giftedBT = 0;
    let giftedMoney = 0;
    let setBBVal = null;
    let setBTVal = null;
    let setMoneyVal = null;

    for (const cmd of cmdList) {
      if (!cmd || !cmd.cmdId) continue;
      if ((this.appliedAdminCmdIds || []).includes(cmd.cmdId)) {
        continue;
      }
      if (hasReloadCtx) {
        const alreadyInLoadedSave = saveCmdSet.has(cmd.cmdId) || (saveTs > 0 && saveTs >= (cmd.issuedAt || 0));
        if (alreadyInLoadedSave) continue;
      }

      const idMatch = Array.isArray(cmd.targetIds) && cmd.targetIds.some(id => myIds.includes(String(id)));
      const nameMatch = !!cmd.targetNameLower && cmd.targetNameLower !== 'játékos' && myNameLower === cmd.targetNameLower;
      if (!idMatch && !nameMatch) continue;

      if (!this.appliedAdminCmdIds.includes(cmd.cmdId)) {
        this.appliedAdminCmdIds.push(cmd.cmdId);
      }
      if (this.appliedAdminCmdIds.length > 100) {
        this.appliedAdminCmdIds = this.appliedAdminCmdIds.slice(-100);
      }
      try { localStorage.setItem('idle_breakout_applied_admin_cmds', JSON.stringify(this.appliedAdminCmdIds)); } catch (e) {}

      if (cmd._kind === 'stat') {
        if (cmd.rebirths !== null && cmd.rebirths !== undefined) {
          this.rebirthCount = Math.max(0, Math.min(999999, Math.floor(Number(cmd.rebirths) || 0)));
          this.rebirthMultiplier = this.getRebirthMultiplier();
          statEdited = true;
          changed = true;
        }
        if (cmd.level !== null && cmd.level !== undefined) {
          const newLvl = Math.max(1, Math.min(999999, Math.floor(Number(cmd.level) || 1)));
          const lvlChanged = newLvl !== this.level;
          this.level = newLvl;
          if (lvlChanged && this.width && this.height) {
            this.generateLevel(this.level);
          }
          statEdited = true;
          changed = true;
        }
        if (cmd.name) {
          this.setPlayerNameDirect(cmd.name);
          statEdited = true;
          changed = true;
        }
      }

      const addBB = Math.trunc(Number(cmd.addBB) || 0);
      const addBT = Math.trunc(Number(cmd.addBT) || 0);
      const addMoney = Math.trunc(Number(cmd.addMoney) || 0);
      if (cmd.setBB !== null && cmd.setBB !== undefined) {
        this.bb = Math.max(0, Math.floor(Number(cmd.setBB) || 0));
        setBBVal = this.bb;
        changed = true;
      } else if (addBB !== 0) {
        this.bb = Math.max(0, this.bb + addBB);
        giftedBB += addBB;
        changed = true;
      }
      if (cmd.setBT !== null && cmd.setBT !== undefined) {
        this.bossTokens = Math.max(0, Math.floor(Number(cmd.setBT) || 0));
        setBTVal = this.bossTokens;
        changed = true;
      } else if (addBT !== 0) {
        this.bossTokens = Math.max(0, this.bossTokens + addBT);
        giftedBT += addBT;
        changed = true;
      }
      if (cmd.setMoney !== null && cmd.setMoney !== undefined) {
        this.money = Math.max(0, Math.floor(Number(cmd.setMoney) || 0));
        setMoneyVal = this.money;
        changed = true;
      } else if (addMoney !== 0) {
        this.money = Math.max(0, this.money + addMoney);
        giftedMoney += addMoney;
        changed = true;
      }
    }

    if (changed) {
      this.lastAdminEditAt = Math.max(this.lastAdminEditAt || 0, Date.now());
      this.updateHUD();
      this.refreshOpenModals();
      this.renderLeaderboard();
      this.save();
      this.broadcastMyStatus();
      if (this.cloud) {
        this.cloud.syncLeaderboardToCloud(true);
        if (this.cloud.currentUser) {
          this.cloud.saveToCloud(true);
        }
      }
      if (window.soundEngine) window.soundEngine.playCoin();
      const parts = [];
      if (statEdited) parts.push(`Rebirth ${this.rebirthCount} | Szint ${this.level}`);
      if (setBBVal !== null) parts.push(`⭐ BB = ${setBBVal.toLocaleString('hu-HU')}`);
      else if (giftedBB !== 0) parts.push(`${giftedBB > 0 ? '+' : ''}${this.formatNumber(giftedBB)} ⭐ BB`);
      if (setBTVal !== null) parts.push(`👑 BT = ${setBTVal.toLocaleString('hu-HU')}`);
      else if (giftedBT !== 0) parts.push(`${giftedBT > 0 ? '+' : ''}${this.formatNumber(giftedBT)} 👑 BT`);
      if (setMoneyVal !== null) parts.push(`💵 Pénz = $${this.formatNumber(setMoneyVal)}`);
      else if (giftedMoney !== 0) parts.push(`${giftedMoney > 0 ? '+' : '-'}$${this.formatNumber(Math.abs(giftedMoney))}`);
      this.showToast(`🛠️ Fejlesztő frissítette az állapotod: ${parts.join(' • ')}!`, 5000);
    }
    return changed;
  }

  isSavePostSeasonReset(saveData) {
    if (!saveData || typeof saveData !== 'object') return false;
    if (saveData.appliedSeasonResetId !== SEASON_RESET_ID) return false;
    const resetAt = Number(this.lbAdminRules && this.lbAdminRules.seasonResetAt) || 0;
    const resetToken = String((this.lbAdminRules && this.lbAdminRules.seasonResetToken) || '').trim();
    if (!resetToken) return true;
    if (saveData.appliedSeasonResetToken === resetToken) return true;
    const savedAt = Math.max(Number(saveData.lastSavedAt) || 0, Number(saveData.lastAdminEditAt) || 0);
    if (resetAt > 0 && savedAt >= resetAt + 15000) return true;
    return false;
  }

  isPreSeasonResetRecord(rec) {
    const resetAt = Number(this.lbAdminRules && this.lbAdminRules.seasonResetAt) || 0;
    const resetToken = String((this.lbAdminRules && this.lbAdminRules.seasonResetToken) || '').trim();
    if (!resetAt || !rec || typeof rec !== 'object') return false;
    if (resetToken && rec.seasonResetToken === resetToken) return false;
    const recTs = Number(rec.ts) || 0;
    if (recTs >= resetAt + 120000) return false;
    const recAdminTs = Number(rec.adminUpdatedAt) || 0;
    if (!resetToken && recAdminTs >= resetAt) return false;
    return true;
  }

  applyIncomingAdminRules(raw, source = 'remote') {
    if (!raw || typeof raw !== 'object') return;
    const incoming = this.normalizeAdminRules(raw);
    const curUpdated = (this.lbAdminRules && this.lbAdminRules.updatedAt) || 0;
    let rulesUpdated = false;
    if (incoming.updatedAt > curUpdated) {
      this.lbAdminRules = incoming;
      this.saveAdminRulesLocally();
      rulesUpdated = true;
      this.processPendingAdminCommands();
      this.renderLeaderboard();
      const devModal = document.getElementById('dev-leaderboard-modal');
      if (devModal && devModal.classList.contains('open')) {
        this.renderDevLeaderboardPanel();
      }
    } else {
      this.processPendingAdminCommands();
    }

    const activeResetAt = Number(this.lbAdminRules && this.lbAdminRules.seasonResetAt) || 0;
    const activeResetToken = String((this.lbAdminRules && this.lbAdminRules.seasonResetToken) || '').trim();
    let migratedSeasonNow = false;
    if (activeResetAt > 0 && activeResetToken && this.appliedSeasonResetToken !== activeResetToken && !this._applyingSeasonReset) {
      const alreadyFreshS2 = (
        this.appliedSeasonResetId === SEASON_RESET_ID &&
        (this.rebirthCount || 0) === 0 &&
        (this.level || 1) <= 1 &&
        (this.totalBricksDestroyed || 0) === 0 &&
        (this.money || 0) === 0 &&
        (this.bb || 0) === 1 &&
        (this.bossTokens || 0) === 5
      );
      const localRaw = this.readRawLocalSave();
      const localSavedAfterReset = (
        this.appliedSeasonResetId === SEASON_RESET_ID &&
        Math.max(Number(localRaw?.lastSavedAt) || 0, Number(this.lastAdminEditAt) || 0) >= activeResetAt + 15000
      );
      if (alreadyFreshS2 || localSavedAfterReset) {
        this.appliedSeasonResetToken = activeResetToken;
        try { localStorage.setItem('idle_breakout_season_reset_token', activeResetToken); } catch (e) {}
        this.save();
        this.broadcastMyStatus();
        if (this.cloud) this.cloud.syncLeaderboardToCloud(true);
      } else {
        this._applyingSeasonReset = true;
        migratedSeasonNow = true;
        try {
          this.applySeasonResetMigration(null, true, activeResetToken);
        } finally {
          this._applyingSeasonReset = false;
        }
      }
    }
    if (activeResetAt > 0 && (!rulesUpdated || migratedSeasonNow)) {
      this.renderLeaderboard();
    }

    if (incoming.minClientVersion && this.compareAppVersions(incoming.minClientVersion, APP_VERSION) > 0) {
      this.triggerSafeAutoUpdate(incoming.minClientVersion, 'ver:' + incoming.minClientVersion);
    } else if (incoming.forceReloadToken > 0 && (Date.now() - incoming.forceReloadToken) < 5 * 60 * 1000 && !this.isDevUnlocked()) {
      this.triggerSafeAutoUpdate(incoming.minClientVersion || APP_VERSION, 'tok:' + incoming.forceReloadToken);
    }

    this.updateMaintenanceOverlay(true);
    this.updateMailUnreadBadge(true);
    const mailModal = document.getElementById('mail-modal');
    if (mailModal && mailModal.classList.contains('open')) {
      this.renderMailInboxModal();
    }
  }

  async syncAdminRulesGlobally(showToast = true) {
    this.lbAdminRules.updatedAt = Date.now();
    this.saveAdminRulesLocally();
    this.renderLeaderboard();
    this.renderDevLeaderboardPanel();

    let mqttSent = false;
    if (this.mqttClient && this.mqttConnected) {
      try {
        this.mqttClient.publish(
          'shirelix/idle_breakout_v4/admin/rules',
          JSON.stringify(this.lbAdminRules),
          { retain: true, qos: 0 }
        );
        mqttSent = true;
      } catch (e) {}
    }

    let cloudRes = { ok: false };
    if (this.cloud && this.cloud.db) {
      cloudRes = await this.cloud.saveAdminRulesToCloud(this.lbAdminRules);
    }

    if (showToast) {
      if (cloudRes.ok || mqttSent) {
        const dest = [mqttSent ? 'MQTT' : null, cloudRes.ok ? 'Firestore' : null].filter(Boolean).join(' + ');
        this.showToast(`🛠️ Szabályok alkalmazva és szinkronizálva (${dest})!`, 2600);
      } else {
        this.showToast('🛠️ Szabályok elmentve helyben! (Kapcsolódás után szinkronizálódik)', 2600);
      }
    }
  }

  getDeduplicatedRemotePlayers(myUid = null) {
    const now = Date.now();
    const clientToUid = {};
    for (const pid in this.remotePlayers) {
      const rp = this.remotePlayers[pid];
      if (!rp) continue;
      if (rp.uid && rp.clientId) clientToUid[rp.clientId] = rp.uid;
      if (rp.uid && rp.id && rp.id !== rp.uid) clientToUid[rp.id] = rp.uid;
    }

    const byKey = new Map();
    const mergeInto = (groupKey, rp, rawKey = null) => {
      const existing = byKey.get(groupKey);
      const rpEffTs = Math.max(Number(rp.ts) || 0, Number(rp.lastSeenLocalMs) || 0);
      const rpOnline = (rpEffTs > 0) && ((now - rpEffTs) < 45000);
      const keysToAdd = [rawKey, rp.id, rp.uid, rp.docId, rp.clientId].filter(Boolean);
      if (!existing) {
        byKey.set(groupKey, {
          id: rp.uid || rp.id,
          uid: rp.uid || null,
          docId: rp.docId || null,
          clientId: rp.clientId || null,
          fromFirestore: !!rp.fromFirestore,
          keepInTop10: !!rp.keepInTop10,
          rawKeys: [...new Set(keysToAdd)],
          name: rp.name || 'Játékos',
          rebirths: Number(rp.rebirths) || 0,
          level: Number(rp.level) || 1,
          bricks: Number(rp.bricks) || 0,
          money: (rp.money !== undefined && rp.money !== null) ? Number(rp.money) : null,
          bb: (rp.bb !== undefined && rp.bb !== null) ? Number(rp.bb) : null,
          bt: (rp.bt !== undefined && rp.bt !== null) ? Number(rp.bt) : null,
          bpStage: (rp.bpStage !== undefined && rp.bpStage !== null) ? Number(rp.bpStage) : null,
          seasonResetToken: rp.seasonResetToken || null,
          ts: Number(rp.ts) || 0,
          lastSeenLocalMs: Number(rp.lastSeenLocalMs) || 0,
          adminUpdatedAt: Number(rp.adminUpdatedAt) || 0,
          isOnline: rpOnline
        });
        return;
      }

      for (const k of keysToAdd) {
        if (!existing.rawKeys.includes(k)) existing.rawKeys.push(k);
      }
      if (!existing.docId && rp.docId) existing.docId = rp.docId;
      if (!existing.clientId && rp.clientId) existing.clientId = rp.clientId;
      if (rp.fromFirestore) existing.fromFirestore = true;
      if (rp.keepInTop10) existing.keepInTop10 = true;

      const rReb = Math.max(0, Number(rp.rebirths) || 0);
      const rLvl = Math.max(1, Number(rp.level) || 1);
      const rBrk = Math.max(0, Number(rp.bricks) || 0);
      const rMoney = (rp.money !== undefined && rp.money !== null) ? Number(rp.money) : null;
      const rBb = (rp.bb !== undefined && rp.bb !== null) ? Number(rp.bb) : null;
      const rBt = (rp.bt !== undefined && rp.bt !== null) ? Number(rp.bt) : null;
      const rBpStage = (rp.bpStage !== undefined && rp.bpStage !== null) ? Number(rp.bpStage) : null;
      const rTs = Number(rp.ts) || 0;
      const rLocalSeen = Number(rp.lastSeenLocalMs) || 0;
      const rAdminTs = Number(rp.adminUpdatedAt) || 0;
      const exAdminTs = Number(existing.adminUpdatedAt) || 0;
      const rPreReset = this.isPreSeasonResetRecord({ ts: rTs, adminUpdatedAt: rAdminTs, seasonResetToken: rp.seasonResetToken || '' });
      const exPreReset = this.isPreSeasonResetRecord(existing);
      const isSeasonResetTransition = !rPreReset && exPreReset;
      const incomingStalePreReset = rPreReset && !exPreReset;

      const adminWins = isSeasonResetTransition || (rAdminTs > exAdminTs);
      const existingHasNewerAdmin = incomingStalePreReset || (!isSeasonResetTransition && exAdminTs > rAdminTs);
      const higherProgressWins = !existingHasNewerAdmin && (
        rReb > existing.rebirths ||
        (rReb === existing.rebirths && rLvl > existing.level)
      );
      const sameProgressPreferFirestoreOrNewer = !existingHasNewerAdmin && (
        rReb === existing.rebirths &&
        rLvl === existing.level &&
        ((rp.fromFirestore && !existing.fromFirestore) || rTs >= existing.ts)
      );

      existing.lastSeenLocalMs = Math.max(existing.lastSeenLocalMs || 0, rLocalSeen);
      existing.ts = Math.max(existing.ts || 0, rTs);

      if (adminWins || higherProgressWins || sameProgressPreferFirestoreOrNewer) {
        existing.ts = Math.max(existing.ts, rTs);
        existing.adminUpdatedAt = Math.max(exAdminTs, rAdminTs);
        existing.rebirths = rReb;
        existing.level = rLvl;
        existing.bricks = rBrk;
        if (rp.seasonResetToken) existing.seasonResetToken = rp.seasonResetToken;
        if (rMoney !== null) existing.money = rMoney;
        if (rBb !== null) existing.bb = rBb;
        if (rBt !== null) existing.bt = rBt;
        if (rBpStage !== null) existing.bpStage = rBpStage;
        const rn = (rp.name || '').trim().slice(0, 12);
        if (rn && (rn !== 'Játékos' || !existing.name || existing.name === 'Játékos')) {
          existing.name = rn;
        }
      } else {
        if (existing.money === null && rMoney !== null) existing.money = rMoney;
        if (existing.bb === null && rBb !== null) existing.bb = rBb;
        if (existing.bt === null && rBt !== null) existing.bt = rBt;
        if (existing.bpStage === null && rBpStage !== null) existing.bpStage = rBpStage;
      }
      if (!existing.uid && rp.uid) existing.uid = rp.uid;
      if (rpOnline) existing.isOnline = true;
    };

    for (const pid in this.remotePlayers) {
      const rp = this.remotePlayers[pid];
      if (!rp) continue;
      if (!rp.uid && !rp.fromFirestore && !rp.keepInTop10 && (now - (rp.ts || 0) >= this.GUEST_RETENTION_MS)) continue;
      const resolvedUid = rp.uid || clientToUid[rp.id] || clientToUid[pid] || null;
      if (pid === this.myPlayerId || rp.id === this.myPlayerId || rp.clientId === this.myPlayerId) continue;
      if (myUid && (pid === myUid || resolvedUid === myUid)) continue;

      const cleanName = (rp.name || 'Játékos').trim();
      const lowerName = cleanName.toLowerCase();
      let groupKey;
      if (resolvedUid) {
        groupKey = `uid:${resolvedUid}`;
      } else if (lowerName && lowerName !== 'játékos') {
        groupKey = `name:${lowerName}`;
      } else {
        groupKey = `id:${rp.id || pid}`;
      }
      mergeInto(groupKey, { ...rp, uid: resolvedUid }, pid);
    }

    // Ha ugyanahhoz az egyéni névhez létezik UID-s és régi UID nélküli bejegyzés is, vonjuk össze őket:
    const nameToUidKey = new Map();
    for (const [k, v] of byKey.entries()) {
      if (k.startsWith('uid:')) {
        const ln = (v.name || '').trim().toLowerCase();
        if (ln && ln !== 'játékos' && !nameToUidKey.has(ln)) {
          nameToUidKey.set(ln, k);
        }
      }
    }
    for (const [k, v] of [...byKey.entries()]) {
      if (k.startsWith('name:')) {
        const targetUidKey = nameToUidKey.get(k.slice(5));
        if (targetUidKey) {
          mergeInto(targetUidKey, v);
          byKey.delete(k);
        }
      }
    }

    const myLower = (this.playerName || '').trim().toLowerCase();
    if (myLower && myLower !== 'játékos') {
      byKey.delete(`name:${myLower}`);
    }

    const result = [...byKey.values()];

    for (const e of result) {
      if (this.isPreSeasonResetRecord(e)) {
        e.rebirths = 0;
        e.level = 1;
        e.bricks = 0;
        e.money = 0;
        e.bb = 1;
        e.bt = 5;
        e.bpStage = 1;
      }
    }

    // Alkalmazzuk a még le nem futott (távoli/offline) admin parancsokat a ranglista-nézetre is,
    // hogy az újratöltés után se essen vissza a retained MQTT / korábbi felhő állapotra:
    const pendingCmds = Object.values((this.lbAdminRules && this.lbAdminRules.playerCommands) || {})
      .filter(c => c && typeof c === 'object' && (c.issuedAt || 0) > 0)
      .sort((a, b) => (a.issuedAt || 0) - (b.issuedAt || 0));
    const pendingGifts = Object.values((this.lbAdminRules && this.lbAdminRules.currencyGifts) || {})
      .filter(g => g && typeof g === 'object' && (g.issuedAt || 0) > 0 && (g.setBB !== null && g.setBB !== undefined || g.setBT !== null && g.setBT !== undefined || g.setMoney !== null && g.setMoney !== undefined))
      .sort((a, b) => (a.issuedAt || 0) - (b.issuedAt || 0));

    if (pendingCmds.length > 0 || pendingGifts.length > 0) {
      for (const e of result) {
        const entryIds = [e.uid, e.id, e.docId, e.clientId, ...(e.rawKeys || [])].filter(Boolean).map(String);
        const entryNameLower = (e.name || '').trim().toLowerCase();
        const matchesRule = (rule) => {
          const idHit = Array.isArray(rule.targetIds) && rule.targetIds.some(id => entryIds.includes(String(id)));
          const nameHit = !!rule.targetNameLower && rule.targetNameLower !== 'játékos' && entryNameLower === rule.targetNameLower;
          return idHit || nameHit;
        };
        const baseEffBaseline = Math.max(Number(e.ts) || 0, Number(e.adminUpdatedAt) || 0);

        for (const cmd of pendingCmds) {
          if ((cmd.issuedAt || 0) <= baseEffBaseline) continue;
          if (!matchesRule(cmd)) continue;
          if (cmd.rebirths !== null && cmd.rebirths !== undefined) {
            e.rebirths = Math.max(0, Math.min(999999, Math.floor(Number(cmd.rebirths) || 0)));
          }
          if (cmd.level !== null && cmd.level !== undefined) {
            e.level = Math.max(1, Math.min(999999, Math.floor(Number(cmd.level) || 1)));
          }
          if (cmd.name) {
            e.name = String(cmd.name).trim().slice(0, 12);
          }
          e.adminUpdatedAt = Math.max(Number(e.adminUpdatedAt) || 0, Number(cmd.issuedAt) || 0);
        }

        for (const g of pendingGifts) {
          if ((g.issuedAt || 0) <= baseEffBaseline) continue;
          if (!matchesRule(g)) continue;
          if (g.setBB !== null && g.setBB !== undefined) e.bb = Math.max(0, Math.floor(Number(g.setBB) || 0));
          if (g.setBT !== null && g.setBT !== undefined) e.bt = Math.max(0, Math.floor(Number(g.setBT) || 0));
          if (g.setMoney !== null && g.setMoney !== undefined) e.money = Math.max(0, Math.floor(Number(g.setMoney) || 0));
          e.adminUpdatedAt = Math.max(Number(e.adminUpdatedAt) || 0, Number(g.issuedAt) || 0);
        }
      }
    }

    return result;
  }

  getEntryMatchIds(entry) {
    const ids = [entry.uid, entry.id, entry.docId, entry.clientId, ...(entry.rawKeys || [])].filter(Boolean);
    return [...new Set(ids.map(String))];
  }

  applyEntryOverride(entry) {
    // A régi fagyasztott kliensoldali felülírások helyett minden szerkesztés valós időben
    // a játékos adatát és a Firestore ranglistát frissíti (playerCommands + adminUpdateLeaderboardDoc).
    return entry;
  }

  getEntryFilterReason(entry) {
    const rules = this.lbAdminRules || this.getDefaultAdminRules();
    const myUid = (this.cloud && this.cloud.currentUser) ? this.cloud.currentUser.uid : null;
    const matchIds = this.getEntryMatchIds(entry);
    const cleanLower = (entry.name || '').trim().toLowerCase();
    const origLower = (entry._origName || entry.name || '').trim().toLowerCase();

    for (const id of matchIds) {
      if (rules.bannedIds.includes(id)) return 'Tiltott ID/UID';
    }
    if (rules.bannedNames.includes(cleanLower) || rules.bannedNames.includes(origLower)) {
      return 'Tiltott név';
    }

    if (entry.isPlayer && !rules.filterLocalSelf) {
      return null;
    }

    if (rules.hideDefaultName && (!cleanLower || cleanLower === 'játékos')) {
      return 'Alap „Játékos”';
    }

    if (rules.hideGuests) {
      const isCloudAcc = !!(entry.uid || entry.fromFirestore || entry.isCustom || (entry.isPlayer && myUid));
      if (!isCloudAcc) return 'Vendég fiók';
    }

    if (rules.hideOffline && !entry.isOnline && !entry.isCustom) {
      return 'Offline';
    }

    if (rules.whitelistOnly) {
      const wl = rules.whitelistNames || [];
      const inWl = wl.includes(cleanLower) ||
        wl.includes(origLower) ||
        matchIds.some(id => wl.includes(id.toLowerCase()));
      if (!inWl) return 'Nincs Whitelisten';
    }

    return null;
  }

  getRawLeaderboardRoster() {
    const myUid = (this.cloud && this.cloud.currentUser) ? this.cloud.currentUser.uid : null;
    const raw = [];

    raw.push({
      id: myUid || this.myPlayerId,
      uid: myUid,
      clientId: this.myPlayerId,
      fromFirestore: !!myUid,
      rawKeys: [this.myPlayerId, myUid].filter(Boolean),
      name: this.playerName || 'Játékos',
      _origName: this.playerName || 'Játékos',
      rebirths: this.rebirthCount,
      level: this.level,
      bricks: this.totalBricksDestroyed,
      money: Math.floor(Math.max(0, Number(this.money) || 0)),
      bb: Math.max(0, Math.floor(Number(this.bb) || 0)),
      bt: Math.max(0, Math.floor(Number(this.bossTokens) || 0)),
      bpStage: this.getCurrentBattlePassStage(),
      ts: Date.now(),
      isPlayer: true,
      isOnline: true,
      isCustom: false
    });

    const remoteList = this.getDeduplicatedRemotePlayers(myUid);
    for (const rp of remoteList) {
      raw.push({
        id: rp.id,
        uid: rp.uid,
        docId: rp.docId,
        clientId: rp.clientId,
        fromFirestore: !!rp.fromFirestore,
        rawKeys: rp.rawKeys || [rp.id],
        name: rp.name,
        _origName: rp.name,
        rebirths: rp.rebirths,
        level: rp.level,
        bricks: rp.bricks,
        money: rp.money ?? null,
        bb: rp.bb ?? null,
        bt: rp.bt ?? null,
        bpStage: rp.bpStage ?? this.getCurrentBattlePassStage(rp.bricks || 0),
        ts: rp.ts,
        lastSeenLocalMs: rp.lastSeenLocalMs || 0,
        isPlayer: false,
        isOnline: !!rp.isOnline,
        isCustom: false
      });
    }

    const customs = (this.lbAdminRules && this.lbAdminRules.customPlayers) || [];
    for (const cp of customs) {
      raw.push({
        id: cp.id,
        uid: cp.id,
        rawKeys: [cp.id],
        name: cp.name,
        _origName: cp.name,
        rebirths: cp.rebirths,
        level: cp.level,
        bricks: cp.bricks || 0,
        money: null,
        bb: null,
        bt: null,
        bpStage: this.getCurrentBattlePassStage(cp.bricks || 0),
        ts: Date.now(),
        isPlayer: false,
        isOnline: cp.isOnline !== false,
        isCustom: true
      });
    }

    return raw.map(e => {
      const overridden = this.applyEntryOverride(e);
      overridden._filterReason = this.getEntryFilterReason(overridden);
      return overridden;
    });
  }

  formatLeaderboardStat(val) {
    const n = Number(val) || 0;
    if (!Number.isFinite(n)) return 'MAX';
    if (Math.abs(n) >= 10000) return this.formatNumber(Math.floor(n));
    return String(Math.floor(n));
  }

  renderLeaderboard() {
    const roster = this.getRawLeaderboardRoster();
    const entries = roster.filter(e => !e._filterReason);

    // Rangsorolás: Rebirth csökkenő, azon belül Szint csökkenő, azon belül Kiütött blokkok csökkenő
    entries.sort((a, b) => {
      if (b.rebirths !== a.rebirths) return b.rebirths - a.rebirths;
      if (b.level !== a.level) return b.level - a.level;
      return (b.bricks || 0) - (a.bricks || 0);
    });

    const playerIdx = entries.findIndex(e => e.isPlayer);
    const playerRank = playerIdx >= 0 ? `#${playerIdx + 1}` : '#--';

    for (const prefix of ['', '-mobile']) {
      const rebEl = document.getElementById(`lb-player-rebirths${prefix}`);
      const lvlEl = document.getElementById(`lb-player-level${prefix}`);
      const rnkEl = document.getElementById(`lb-player-rank${prefix}`);
      if (rebEl) rebEl.textContent = this.rebirthCount;
      if (lvlEl) lvlEl.textContent = this.level;
      if (rnkEl) rnkEl.textContent = playerRank;
    }

    // A TOP 10 játékosokat megjelöljük, hogy offline állapotban és újratöltéskor se tűnjenek el!
    let top10Dirty = false;
    const top10Ids = new Set();
    for (const e of entries.slice(0, 10)) {
      if (e && !e.isPlayer && !e.isCustom) {
        for (const k of this.getEntryMatchIds(e)) top10Ids.add(k);
      }
    }
    if (this.remotePlayers) {
      for (const pid in this.remotePlayers) {
        const rp = this.remotePlayers[pid];
        if (!rp) continue;
        const shouldPin = top10Ids.has(pid) || top10Ids.has(rp.id) || (rp.uid && top10Ids.has(rp.uid));
        if (shouldPin && !rp.keepInTop10) {
          rp.keepInTop10 = true;
          top10Dirty = true;
        }
      }
      if (top10Dirty) {
        try { localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers)); } catch (e) {}
      }
    }

    // Mindig csak a TOP 10 látszik + ha a helyi játékos nincs a TOP 10-ben, közvetlenül utána ő (pl. #16, #50, #163)
    const displayRows = entries.slice(0, 10).map((entry, idx) => ({
      entry,
      rank: idx + 1,
      pinnedAfterTop10: false
    }));
    if (playerIdx >= 10) {
      displayRows.push({
        entry: entries[playerIdx],
        rank: playerIdx + 1,
        pinnedAfterTop10: true
      });
    }

    const now = Date.now();
    let rowsHtml = displayRows.map(({ entry, rank, pinnedAfterTop10 }) => {
      let medal = `#${rank}`;
      let rankClass = '';
      if (rank === 1) { medal = '🥇 1'; rankClass = 'rank-top1'; }
      else if (rank === 2) { medal = '🥈 2'; rankClass = 'rank-top2'; }
      else if (rank === 3) { medal = '🥉 3'; rankClass = 'rank-top3'; }

      const meClass = entry.isPlayer ? 'player-row-me' : '';
      const pinnedClass = pinnedAfterTop10 ? 'player-pinned-after-top10' : '';
      const meBadge = entry.isPlayer ? '<span class="badge-me">TE</span>' : '';

      // Online státusz: ha 45 mp-en belül jött élő jel (vagy élő Firestore/MQTT frissítés), különben utoljára online idő
      const effTs = Math.max(Number(entry.ts) || 0, Number(entry.lastSeenLocalMs) || 0);
      const isOnline = entry.isPlayer || entry.isOnline || (effTs > 0 && (now - effTs) < 45000);
      const ageSec = isOnline ? 0 : (effTs > 0 ? Math.max(0, Math.floor((now - effTs) / 1000)) : null);
      const lastSeenLabel = isOnline
        ? 'Online'
        : (ageSec !== null ? this.formatLastSeenAgo(ageSec) : 'Offline');
      const dotTitle = isOnline
        ? 'Élőben online'
        : (ageSec !== null ? `Utoljára online: ${this.formatLastSeenAgo(ageSec)}` : 'Offline (mentett pontszám)');
      const dotHtml = isOnline
        ? `<span class="live-dot online" title="${dotTitle}">🟢</span>`
        : `<span class="live-dot offline" title="${dotTitle}">⚪</span>`;

      const dividerHtml = (pinnedAfterTop10 && rank > 11)
        ? '<div class="leaderboard-gap-divider">• • •</div>'
        : '';

      return `${dividerHtml}
        <div class="leaderboard-row ${rankClass} ${meClass} ${pinnedClass}">
          <span class="col-rank">${medal}</span>
          <span class="col-name" title="${dotTitle}">
            <span class="lb-name-main">${dotHtml}<span class="lb-name-txt">${this.escapeHtml(entry.name)}</span>${meBadge}</span>
            <span class="lb-last-seen ${isOnline ? 'is-online' : ''}">${lastSeenLabel}</span>
          </span>
          <span class="col-reb">${this.formatLeaderboardStat(entry.rebirths)}</span>
          <span class="col-lvl">${this.formatLeaderboardStat(entry.level)}</span>
        </div>
      `;
    }).join('');

    if (entries.length <= 1) {
      rowsHtml += `
        <div class="leaderboard-empty-hint">
          🌐 <strong>Valós idejű multiplayer aktív!</strong><br>
          Küldd el a játék linkjét barátaidnak: amint megnyitják, automatikusan megjelennek itt és élőben frissül a pontszámuk!
        </div>
      `;
    }

    const pcList = document.getElementById('leaderboard-list-pc');
    const mobileList = document.getElementById('leaderboard-list-mobile');
    if (pcList) pcList.innerHTML = rowsHtml;
    if (mobileList) mobileList.innerHTML = rowsHtml;

    const devModal = document.getElementById('dev-leaderboard-modal');
    if (devModal && devModal.classList.contains('open')) {
      this.renderDevLeaderboardPanel();
    }
  }

  // --- Fejlesztői Ranglista Kezelő Felület ---
  isDevUnlocked() {
    try {
      return sessionStorage.getItem('idle_breakout_dev_unlocked') === '1';
    } catch (e) {
      return !!this._devSessionUnlocked;
    }
  }

  async verifyDevCode(rawCode) {
    const payload = DEV_AUTH_SALT + String(rawCode || '').trim();
    try {
      if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload));
        const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        return hex === DEV_AUTH_HASH;
      }
    } catch (e) {}
    return sha256HexFallback(payload) === DEV_AUTH_HASH;
  }

  openDevPanel() {
    const modal = document.getElementById('dev-leaderboard-modal');
    if (!modal) return;
    const pinErr = document.getElementById('dev-pin-error');
    const pinIn = document.getElementById('dev-pin-input');
    if (pinErr) { pinErr.textContent = ''; pinErr.style.display = 'none'; }
    if (pinIn) pinIn.value = '';
    this.updateDevLockView();
    this.openModal('dev-leaderboard-modal');
    if (!this.isDevUnlocked() && pinIn) {
      setTimeout(() => pinIn.focus(), 60);
    }
    if (window.soundEngine) window.soundEngine.playClickHit();
  }

  isMaintenanceBlocked() {
    return Boolean(this.lbAdminRules && this.lbAdminRules.maintenanceMode && !this.isDevUnlocked());
  }

  updateMaintenanceOverlay(announceResume = false) {
    const active = Boolean(this.lbAdminRules && this.lbAdminRules.maintenanceMode);
    const blocked = active && !this.isDevUnlocked();
    const overlay = document.getElementById('maintenance-overlay');
    const msgEl = document.getElementById('maintenance-message-text');
    const defaultMsg = 'Technikai karbantartás zajlik. Kérjük, várj egy pillanatot — amint elkészültünk, a játék automatikusan visszatölt!';

    if (msgEl) {
      msgEl.textContent = (this.lbAdminRules && this.lbAdminRules.maintenanceMessage) || defaultMsg;
    }
    if (overlay) {
      overlay.classList.toggle('active', blocked);
    }

    if (this._wasMaintenanceBlocked && !blocked) {
      this.lastTime = performance.now();
      this.lastTickMs = Date.now();
      if (announceResume) {
        this.showToast('✅ A technikai karbantartás véget ért! Jó játékot!', 4500);
      }
    }
    this._wasMaintenanceBlocked = blocked;

    const btn = document.getElementById('btn-dev-maintenance-toggle');
    if (btn) {
      btn.classList.toggle('is-active', active);
      btn.textContent = active ? '✅ KARBANTARTÁS VÉGE' : '🛠️ KARBANTARTÁS';
      btn.title = active
        ? 'Kattints a pipára: minden játékos azonnal visszakerül a játékba!'
        : 'Azonnali technikai karbantartás bekapcsolása minden más játékosnál';
    }
  }

  async devToggleMaintenanceMode() {
    if (!this.lbAdminRules) this.lbAdminRules = this.getDefaultAdminRules();
    const currentlyActive = !!this.lbAdminRules.maintenanceMode;
    if (!currentlyActive) {
      if (!confirm('Biztosan bekapcsolod a TECHNIKAI KARBANTARTÁS módot?\n\nMinden más játékosnál AZONNAL eltűnik a játék, és csak a karbantartás üzenet látszik. Ha kész vagy, nyomj a zöld ✅ pipára!')) {
        return;
      }
      this.lbAdminRules.maintenanceMode = true;
      this.lbAdminRules.maintenanceUpdatedAt = Date.now();
      this.updateMaintenanceOverlay(false);
      await this.syncAdminRulesGlobally(false);
      this.showToast('🛠️ Technikai karbantartás AKTIVÁLVA minden más játékosnál! Ha végeztél, kattints a zöld ✅ pipára!', 4500);
    } else {
      this.lbAdminRules.maintenanceMode = false;
      this.lbAdminRules.maintenanceUpdatedAt = Date.now();
      this.updateMaintenanceOverlay(false);
      await this.syncAdminRulesGlobally(false);
      this.showToast('✅ Karbantartás leállítva — minden játékos azonnal visszakerült a játékba!', 4000);
    }
  }

  updateDevLockView() {
    const unlocked = this.isDevUnlocked();
    const gate = document.getElementById('dev-auth-gate');
    const body = document.getElementById('dev-panel-body');
    const lockBtn = document.getElementById('btn-dev-lock');
    if (gate) gate.style.display = unlocked ? 'none' : 'flex';
    if (body) body.style.display = unlocked ? 'flex' : 'none';
    if (lockBtn) lockBtn.style.display = unlocked ? 'inline-flex' : 'none';
    this.updateMaintenanceOverlay(false);
    if (unlocked) {
      this.requestLivePeersSync();
      this.renderDevLeaderboardPanel();
    }
  }

  initDevPanel() {
    const modal = document.getElementById('dev-leaderboard-modal');
    const closeBtn = document.getElementById('btn-close-dev');
    const closeFooter = document.getElementById('btn-close-dev-footer');
    const lockBtn = document.getElementById('btn-dev-lock');

    for (const id of ['btn-open-dev-pc', 'btn-open-dev-mobile']) {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.openDevPanel());
    }

    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        this.openDevPanel();
      }
    });

    const closeModal = () => this.closeModal('dev-leaderboard-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeFooter) closeFooter.addEventListener('click', closeModal);

    if (lockBtn) {
      lockBtn.addEventListener('click', () => {
        this._devSessionUnlocked = false;
        try { sessionStorage.removeItem('idle_breakout_dev_unlocked'); } catch (e) {}
        this.updateDevLockView();
      });
    }

    const pinForm = document.getElementById('dev-pin-form');
    if (pinForm) {
      pinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pinIn = document.getElementById('dev-pin-input');
        const pinErr = document.getElementById('dev-pin-error');
        const entered = (pinIn ? pinIn.value : '').trim();
        const valid = await this.verifyDevCode(entered);
        if (valid) {
          this._devSessionUnlocked = true;
          try { sessionStorage.setItem('idle_breakout_dev_unlocked', '1'); } catch (err) {}
          if (pinErr) { pinErr.textContent = ''; pinErr.style.display = 'none'; }
          this.updateDevLockView();
          if (window.soundEngine) window.soundEngine.playLevelUp();
        } else {
          if (pinErr) {
            pinErr.textContent = 'Hibás fejlesztői kód!';
            pinErr.style.display = 'block';
          }
        }
      });
    }

    // Tab switching
    this.switchDevTab = (tab) => {
      this.activeDevTab = tab;
      this._devInlineEditActive = false;
      this._cancelActiveInlineEdit = null;
      const pPane = document.getElementById('dev-tab-players');
      const rPane = document.getElementById('dev-tab-rules');
      const mPane = document.getElementById('dev-tab-mail');
      const pBtn = document.getElementById('btn-dev-tab-players');
      const rBtn = document.getElementById('btn-dev-tab-rules');
      const mBtn = document.getElementById('btn-dev-tab-mail');
      if (pPane) pPane.style.display = (tab === 'players') ? 'flex' : 'none';
      if (rPane) rPane.style.display = (tab === 'rules') ? 'flex' : 'none';
      if (mPane) mPane.style.display = (tab === 'mail') ? 'flex' : 'none';
      if (pBtn) pBtn.classList.toggle('active', tab === 'players');
      if (rBtn) rBtn.classList.toggle('active', tab === 'rules');
      if (mBtn) mBtn.classList.toggle('active', tab === 'mail');
      this.renderDevLeaderboardPanel();
    };
    const tabP = document.getElementById('btn-dev-tab-players');
    const tabR = document.getElementById('btn-dev-tab-rules');
    const tabM = document.getElementById('btn-dev-tab-mail');
    if (tabP) tabP.addEventListener('click', () => this.switchDevTab('players'));
    if (tabR) tabR.addEventListener('click', () => this.switchDevTab('rules'));
    if (tabM) tabM.addEventListener('click', () => this.switchDevTab('mail'));

    const devMailForm = document.getElementById('dev-mail-form');
    if (devMailForm) {
      devMailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.devSendAdminMail();
      });
    }

    // Quick toolbar actions
    const pruneBtn = document.getElementById('btn-dev-prune-cache');
    const syncBtn = document.getElementById('btn-dev-sync-now');
    const forceReloadBtn = document.getElementById('btn-dev-force-reload');
    if (pruneBtn) pruneBtn.addEventListener('click', () => this.devPruneStaleEntries());
    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        this.requestLivePeersSync();
        this.syncAdminRulesGlobally(true);
      });
    }
    if (forceReloadBtn) {
      forceReloadBtn.addEventListener('click', async () => {
        this.lbAdminRules.minClientVersion = APP_VERSION;
        this.lbAdminRules.forceReloadToken = Date.now();
        await this.syncAdminRulesGlobally(false);
        this.showToast(`🔄 <strong>Frissítési parancs kiküldve (v${APP_VERSION})!</strong> Minden online játékos pár másodpercen belül automatikusan újratölt.`, 4500);
      });
    }
    const seasonWipeBtn = document.getElementById('btn-dev-season-wipe');
    if (seasonWipeBtn) {
      seasonWipeBtn.addEventListener('click', () => this.devExecuteGlobalSeasonWipe());
    }
    const maintToggleBtn = document.getElementById('btn-dev-maintenance-toggle');
    if (maintToggleBtn) {
      maintToggleBtn.addEventListener('click', () => this.devToggleMaintenanceMode());
    }
    const maintIconTrigger = document.getElementById('maintenance-icon-trigger');
    if (maintIconTrigger) {
      let tapCount = 0;
      let tapTimer = null;
      maintIconTrigger.addEventListener('click', () => {
        tapCount++;
        clearTimeout(tapTimer);
        if (tapCount >= 5) {
          tapCount = 0;
          this.openDevPanel();
        } else {
          tapTimer = setTimeout(() => { tapCount = 0; }, 1200);
        }
      });
    }

    // Add manual custom player
    const addForm = document.getElementById('dev-add-player-form');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.devAddCustomPlayer();
      });
    }

    // Edit drawer save/cancel
    const saveEditBtn = document.getElementById('btn-dev-save-edit');
    const cancelEditBtn = document.getElementById('btn-dev-cancel-edit');
    if (saveEditBtn) saveEditBtn.addEventListener('click', () => this.devSaveEditEntry());
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', () => {
        this.devEditTarget = null;
        const box = document.getElementById('dev-edit-box');
        if (box) box.style.display = 'none';
      });
    }

    // Rule checkboxes
    const bindRuleToggle = (elId, prop) => {
      const cb = document.getElementById(elId);
      if (cb) {
        cb.addEventListener('change', () => {
          this.lbAdminRules[prop] = !!cb.checked;
          if (prop === 'whitelistOnly' && cb.checked && this.lbAdminRules.whitelistNames.length === 0) {
            const myClean = (this.playerName || '').trim().toLowerCase();
            if (myClean && myClean !== 'játékos') {
              this.lbAdminRules.whitelistNames.push(myClean);
            }
          }
          this.syncAdminRulesGlobally(true);
        });
      }
    };
    bindRuleToggle('dev-rule-hide-default', 'hideDefaultName');
    bindRuleToggle('dev-rule-hide-guests', 'hideGuests');
    bindRuleToggle('dev-rule-hide-offline', 'hideOffline');
    bindRuleToggle('dev-rule-whitelist-only', 'whitelistOnly');
    bindRuleToggle('dev-rule-filter-self', 'filterLocalSelf');

    // Whitelist & Banlist manual additions
    const addWlBtn = document.getElementById('btn-dev-add-whitelist');
    const wlInput = document.getElementById('dev-whitelist-input');
    const doAddWl = () => {
      const val = (wlInput ? wlInput.value : '').trim().toLowerCase();
      if (!val) return;
      if (!this.lbAdminRules.whitelistNames.includes(val)) {
        this.lbAdminRules.whitelistNames.push(val);
      }
      if (wlInput) wlInput.value = '';
      this.syncAdminRulesGlobally(true);
    };
    if (addWlBtn) addWlBtn.addEventListener('click', doAddWl);
    if (wlInput) wlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doAddWl(); } });

    const addBanBtn = document.getElementById('btn-dev-add-ban');
    const banInput = document.getElementById('dev-ban-input');
    const doAddBan = () => {
      const val = (banInput ? banInput.value : '').trim();
      if (!val) return;
      const lower = val.toLowerCase();
      if (!this.lbAdminRules.bannedNames.includes(lower)) {
        this.lbAdminRules.bannedNames.push(lower);
      }
      if (!this.lbAdminRules.bannedIds.includes(val)) {
        this.lbAdminRules.bannedIds.push(val);
      }
      if (banInput) banInput.value = '';
      this.syncAdminRulesGlobally(true);
    };
    if (addBanBtn) addBanBtn.addEventListener('click', doAddBan);
    if (banInput) banInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doAddBan(); } });

    // Reset all rules
    const resetRulesBtn = document.getElementById('btn-dev-reset-rules');
    if (resetRulesBtn) {
      resetRulesBtn.addEventListener('click', () => {
        if (!confirm('Biztosan törlöd az összes tiltást, engedélyezőlistát és parancsot?')) return;
        this.lbAdminRules = this.getDefaultAdminRules();
        this.syncAdminRulesGlobally(true);
      });
    }
  }

  devAddCustomPlayer() {
    const nameIn = document.getElementById('dev-add-name');
    const rebIn = document.getElementById('dev-add-reb');
    const lvlIn = document.getElementById('dev-add-lvl');
    const rawName = (nameIn ? nameIn.value : '').trim();
    if (!rawName) {
      this.showToast('⚠️ Adj meg egy játékosnevet!', 2200);
      return;
    }
    if (rawName.length > 12) {
      this.showToast('⚠️ A név legfeljebb 12 karakter lehet!', 2400);
      return;
    }
    const name = rawName.slice(0, 12);
    const rebirths = Math.max(0, Math.min(999999, Math.floor(parseInt(rebIn ? rebIn.value : '0', 10) || 0)));
    const level = Math.max(1, Math.min(999999, Math.floor(parseInt(lvlIn ? lvlIn.value : '1', 10) || 1)));
    this.lbAdminRules.customPlayers.push({
      id: 'custom_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5),
      name,
      rebirths,
      level,
      bricks: level * 100,
      isOnline: true
    });
    if (nameIn) nameIn.value = '';
    this.syncAdminRulesGlobally(true);
  }

  devOpenEditDrawer(entry) {
    this.devEditTarget = entry;
    this.devEditInitial = {
      name: entry.name || 'Játékos',
      rebirths: Number(entry.rebirths) || 0,
      level: Number(entry.level) || 1
    };
    const box = document.getElementById('dev-edit-box');
    const lbl = document.getElementById('dev-edit-target-label');
    const nIn = document.getElementById('dev-edit-name');
    const rIn = document.getElementById('dev-edit-reb');
    const lIn = document.getElementById('dev-edit-lvl');
    const bbIn = document.getElementById('dev-edit-add-bb');
    const btIn = document.getElementById('dev-edit-add-bt');
    const moneyIn = document.getElementById('dev-edit-add-money');
    const currRow = document.getElementById('dev-edit-currency-row');

    if (lbl) lbl.textContent = `${entry.name} (${entry.isPlayer ? 'TE' : (entry.isCustom ? 'Kézi' : 'Távoli')})`;
    if (nIn) nIn.value = entry.name || 'Játékos';
    if (rIn) rIn.value = entry.rebirths ?? 0;
    if (lIn) lIn.value = entry.level ?? 1;
    if (bbIn) bbIn.value = '0';
    if (btIn) btIn.value = '0';
    if (moneyIn) moneyIn.value = '0';
    if (currRow) currRow.style.display = entry.isCustom ? 'none' : 'flex';
    if (box) box.style.display = 'flex';
  }

  async devSaveEditEntry() {
    const entry = this.devEditTarget;
    if (!entry) return;
    const nIn = document.getElementById('dev-edit-name');
    const rIn = document.getElementById('dev-edit-reb');
    const lIn = document.getElementById('dev-edit-lvl');
    const bbIn = document.getElementById('dev-edit-add-bb');
    const btIn = document.getElementById('dev-edit-add-bt');
    const moneyIn = document.getElementById('dev-edit-add-money');

    const init = this.devEditInitial || {
      name: entry.name || 'Játékos',
      rebirths: Number(entry.rebirths) || 0,
      level: Number(entry.level) || 1
    };

    const rawName = (nIn ? nIn.value : entry.name).trim();
    if (rawName.length > 12) {
      this.showToast('⚠️ A név legfeljebb 12 karakter lehet!', 2400);
      return;
    }
    const newName = rawName.slice(0, 12) || String(init.name || entry.name || 'Játékos').slice(0, 12);
    const parsedReb = rIn ? parseInt(rIn.value, 10) : NaN;
    const parsedLvl = lIn ? parseInt(lIn.value, 10) : NaN;
    const newReb = Number.isNaN(parsedReb) ? init.rebirths : Math.max(0, Math.min(999999, parsedReb));
    const newLvl = Number.isNaN(parsedLvl) ? init.level : Math.max(1, Math.min(999999, parsedLvl));
    const addBB = Math.trunc(Number(bbIn ? bbIn.value : 0) || 0);
    const addBT = Math.trunc(Number(btIn ? btIn.value : 0) || 0);
    const addMoney = Math.trunc(Number(moneyIn ? moneyIn.value : 0) || 0);

    const nameChanged = newName !== init.name;
    const rebChanged = newReb !== init.rebirths;
    const lvlChanged = newLvl !== init.level;
    const hasCurrencyGift = addBB !== 0 || addBT !== 0 || addMoney !== 0;

    // Régi statikus felülírások törlése, hogy a játékos ne ragadjon be fix számra:
    if (this.lbAdminRules && this.lbAdminRules.overrides) {
      for (const k of [
        entry.uid,
        entry.id,
        entry.docId,
        ...(entry.rawKeys || []),
        entry._origName ? `name:${entry._origName.trim().toLowerCase()}` : null,
        `name:${newName.trim().toLowerCase()}`
      ].filter(Boolean)) {
        delete this.lbAdminRules.overrides[k];
      }
    }

    if (entry.isPlayer) {
      if (rebChanged || lvlChanged || nameChanged || hasCurrencyGift) {
        this.lastAdminEditAt = Date.now();
      }
      if (rebChanged) {
        this.rebirthCount = newReb;
        this.rebirthMultiplier = this.getRebirthMultiplier();
      }
      if (lvlChanged) {
        const levelDiffers = newLvl !== this.level;
        this.level = newLvl;
        if (levelDiffers) this.generateLevel(this.level);
      }
      if (nameChanged) {
        this.setPlayerNameDirect(newName);
      }
      if (addBB !== 0) this.bb = Math.max(0, this.bb + addBB);
      if (addBT !== 0) this.bossTokens = Math.max(0, this.bossTokens + addBT);
      if (addMoney !== 0) this.money = Math.max(0, this.money + addMoney);
      this.updateHUD();
      this.refreshOpenModals();
      this.save();
      this.broadcastMyStatus();
      if (this.cloud) {
        await this.cloud.syncLeaderboardToCloud(true);
        if (this.cloud.currentUser) {
          await this.cloud.saveToCloud(true);
        }
      }
      if (hasCurrencyGift) {
        if (window.soundEngine) window.soundEngine.playCoin();
        const giftParts = [];
        if (addBB !== 0) giftParts.push(`${addBB > 0 ? '+' : ''}${this.formatNumber(addBB)} ⭐ BB`);
        if (addBT !== 0) giftParts.push(`${addBT > 0 ? '+' : ''}${this.formatNumber(addBT)} 👑 BT`);
        if (addMoney !== 0) giftParts.push(`${addMoney > 0 ? '+' : '-'}$${this.formatNumber(Math.abs(addMoney))}`);
        this.showToast(`🎁 Saját jóváírás: ${giftParts.join(' • ')}!`, 3500);
      }
    } else if (entry.isCustom) {
      const cp = this.lbAdminRules.customPlayers.find(c => c.id === entry.id);
      if (cp) {
        cp.name = newName;
        cp.rebirths = newReb;
        cp.level = newLvl;
      }
    } else if (nameChanged || rebChanged || lvlChanged || hasCurrencyGift) {
      const now = Date.now();
      const matchIds = this.getEntryMatchIds(entry);
      const origLower = (entry._origName || entry.name || '').trim().toLowerCase();

      if (nameChanged || rebChanged || lvlChanged) {
        if (!this.lbAdminRules.playerCommands || typeof this.lbAdminRules.playerCommands !== 'object') {
          this.lbAdminRules.playerCommands = {};
        }
        const cmdId = 'cmd_' + now.toString(36) + '_' + Math.random().toString(36).slice(2, 6);
        this.lbAdminRules.playerCommands[cmdId] = {
          cmdId,
          targetIds: matchIds,
          targetNameLower: origLower,
          name: nameChanged ? newName : '',
          rebirths: rebChanged ? newReb : null,
          level: lvlChanged ? newLvl : null,
          issuedAt: now
        };

        const cmdKeys = Object.keys(this.lbAdminRules.playerCommands);
        if (cmdKeys.length > 80) {
          cmdKeys
            .sort((a, b) => (this.lbAdminRules.playerCommands[a].issuedAt || 0) - (this.lbAdminRules.playerCommands[b].issuedAt || 0))
            .slice(0, cmdKeys.length - 80)
            .forEach(k => delete this.lbAdminRules.playerCommands[k]);
        }

        if (this.remotePlayers) {
          for (const pid of Object.keys(this.remotePlayers)) {
            const rp = this.remotePlayers[pid];
            if (rp && (matchIds.includes(pid) || matchIds.includes(rp.id) || (rp.uid && matchIds.includes(rp.uid)))) {
              if (nameChanged) rp.name = newName;
              if (rebChanged) rp.rebirths = newReb;
              if (lvlChanged) rp.level = newLvl;
              rp.adminUpdatedAt = now;
            }
          }
          try { localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers)); } catch (e) {}
        }

        if (this.cloud && (entry.docId || entry.uid)) {
          const docPatch = { adminUpdatedAt: now };
          if (nameChanged) docPatch.name = newName;
          if (rebChanged) docPatch.rebirths = newReb;
          if (lvlChanged) docPatch.level = newLvl;
          await this.cloud.adminUpdateLeaderboardDoc(entry.docId || entry.uid, docPatch);
        }
      }

      if (hasCurrencyGift) {
        if (!this.lbAdminRules.currencyGifts || typeof this.lbAdminRules.currencyGifts !== 'object') {
          this.lbAdminRules.currencyGifts = {};
        }
        const giftId = 'gift_' + now.toString(36) + '_' + Math.random().toString(36).slice(2, 6);
        this.lbAdminRules.currencyGifts[giftId] = {
          cmdId: giftId,
          targetIds: matchIds,
          targetNameLower: origLower,
          addBB,
          addBT,
          addMoney,
          issuedAt: now
        };

        const giftKeys = Object.keys(this.lbAdminRules.currencyGifts);
        if (giftKeys.length > 80) {
          giftKeys
            .sort((a, b) => (this.lbAdminRules.currencyGifts[a].issuedAt || 0) - (this.lbAdminRules.currencyGifts[b].issuedAt || 0))
            .slice(0, giftKeys.length - 80)
            .forEach(k => delete this.lbAdminRules.currencyGifts[k]);
        }

        const giftParts = [];
        if (addBB !== 0) giftParts.push(`${addBB > 0 ? '+' : ''}${this.formatNumber(addBB)} ⭐ BB`);
        if (addBT !== 0) giftParts.push(`${addBT > 0 ? '+' : ''}${this.formatNumber(addBT)} 👑 BT`);
        if (addMoney !== 0) giftParts.push(`${addMoney > 0 ? '+' : '-'}$${this.formatNumber(Math.abs(addMoney))}`);
        this.showToast(`🎁 Kiküldve ${this.escapeHtml(entry.name)} számára: ${giftParts.join(' • ')}!`, 3800);
      }
    }

    this.devEditTarget = null;
    this.devEditInitial = null;
    const box = document.getElementById('dev-edit-box');
    if (box) box.style.display = 'none';
    await this.syncAdminRulesGlobally(!hasCurrencyGift);
  }

  parseDevNumericInput(rawStr, allowRelative = true) {
    let s = String(rawStr ?? '').trim().toLowerCase().replace(/[\s$~]/g, '');
    if (!s) return null;
    let sign = null;
    if (allowRelative && (s[0] === '+' || s[0] === '-')) {
      sign = s[0];
      s = s.slice(1).trim();
    }
    if (!s) return null;

    let mult = 1;
    const lastCh = s[s.length - 1];
    if (lastCh === 'k') { mult = 1e3; s = s.slice(0, -1); }
    else if (lastCh === 'm') { mult = 1e6; s = s.slice(0, -1); }
    else if (lastCh === 'b') { mult = 1e9; s = s.slice(0, -1); }
    else if (lastCh === 't') { mult = 1e12; s = s.slice(0, -1); }

    s = s.replace(/,/g, '.');
    if (!/^\d+(\.\d+)?$/.test(s)) return null;
    const num = Number(s) * mult;
    if (!Number.isFinite(num)) return null;

    if (sign === '+') return { mode: 'delta', value: Math.trunc(num) };
    if (sign === '-') return { mode: 'delta', value: -Math.trunc(num) };
    return { mode: 'set', value: Math.max(0, Math.floor(num)) };
  }

  devStartInlineEdit(targetEl, entry, field) {
    if (!targetEl || !entry || !field) return;
    if (targetEl.querySelector('.dev-inline-input')) {
      const existingInput = targetEl.querySelector('.dev-inline-input');
      if (existingInput) existingInput.focus();
      return;
    }
    if (typeof this._cancelActiveInlineEdit === 'function') {
      try { this._cancelActiveInlineEdit(); } catch (e) {}
    }

    const isName = (field === 'name');
    const hostEl = isName ? targetEl : targetEl.querySelector('.dev-stat-val');
    if (!hostEl) return;

    const origHtml = hostEl.innerHTML;
    const origStyle = hostEl.getAttribute('style') || '';

    let initVal = '';
    let placeholder = '';
    let maxLenAttr = '';
    if (field === 'name') {
      initVal = entry.name || 'Játékos';
      placeholder = 'Név (max 12)';
      maxLenAttr = 'maxlength="12"';
    } else if (field === 'bb') {
      initVal = (entry.bb !== null && entry.bb !== undefined) ? String(Math.max(0, Math.floor(Number(entry.bb) || 0))) : '';
      placeholder = 'pl. 50 / -10 / +10';
    } else if (field === 'bt') {
      initVal = (entry.bt !== null && entry.bt !== undefined) ? String(Math.max(0, Math.floor(Number(entry.bt) || 0))) : '';
      placeholder = 'pl. 25 / -5 / +5';
    } else if (field === 'money') {
      initVal = (entry.money !== null && entry.money !== undefined) ? String(Math.max(0, Math.floor(Number(entry.money) || 0))) : '';
      placeholder = 'pl. 500k / -100k';
    } else if (field === 'rebirths') {
      initVal = String(Math.max(0, Math.floor(Number(entry.rebirths) || 0)));
      placeholder = 'pontos szám (pl. 4)';
    } else if (field === 'level') {
      initVal = String(Math.max(1, Math.floor(Number(entry.level) || 1)));
      placeholder = 'pontos szám (pl. 50)';
    }

    let finished = false;
    const restoreOnly = () => {
      if (!isName) targetEl.classList.remove('is-editing');
      hostEl.innerHTML = origHtml;
      if (origStyle) hostEl.setAttribute('style', origStyle);
      else hostEl.removeAttribute('style');
    };

    this._devInlineEditActive = true;
    this._cancelActiveInlineEdit = () => {
      if (finished) return;
      finished = true;
      restoreOnly();
      this._devInlineEditActive = false;
      this._cancelActiveInlineEdit = null;
    };

    if (!isName) targetEl.classList.add('is-editing');
    hostEl.removeAttribute('style');
    hostEl.innerHTML = `
      <span class="dev-inline-edit-wrap ${isName ? 'is-name-edit' : ''}">
        <input type="text" class="dev-inline-input" ${maxLenAttr} placeholder="${this.escapeHtml(placeholder)}" />
        <button type="button" class="dev-inline-btn ok" title="Mentés (Enter)">✓</button>
        <button type="button" class="dev-inline-btn cancel" title="Mégse (Esc)">✕</button>
      </span>
    `;

    const wrap = hostEl.querySelector('.dev-inline-edit-wrap');
    const inp = hostEl.querySelector('.dev-inline-input');
    const okBtn = hostEl.querySelector('.dev-inline-btn.ok');
    const cancelBtn = hostEl.querySelector('.dev-inline-btn.cancel');
    if (!inp) {
      restoreOnly();
      this._devInlineEditActive = false;
      this._cancelActiveInlineEdit = null;
      return;
    }
    inp.value = initVal;

    const commit = () => {
      if (finished) return;
      finished = true;
      const val = inp.value;
      restoreOnly();
      this._devInlineEditActive = false;
      this._cancelActiveInlineEdit = null;
      this.devCommitInlineField(entry, field, val);
    };

    const cancel = () => {
      if (finished) return;
      finished = true;
      restoreOnly();
      this._devInlineEditActive = false;
      this._cancelActiveInlineEdit = null;
    };

    if (wrap) wrap.addEventListener('click', (e) => e.stopPropagation());
    if (okBtn) {
      okBtn.addEventListener('mousedown', (e) => e.preventDefault());
      okBtn.addEventListener('click', (e) => { e.stopPropagation(); commit(); });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('mousedown', (e) => e.preventDefault());
      cancelBtn.addEventListener('click', (e) => { e.stopPropagation(); cancel(); });
    }
    inp.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        commit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    });
    inp.addEventListener('blur', () => {
      setTimeout(() => {
        if (!finished && document.activeElement !== okBtn && document.activeElement !== cancelBtn) {
          cancel();
        }
      }, 150);
    });

    inp.focus();
    inp.select();
  }

  async devCommitInlineField(entry, field, rawValue) {
    this._devInlineEditActive = false;
    this._cancelActiveInlineEdit = null;
    if (!entry || !field) {
      this.renderDevLeaderboardPanel();
      return;
    }

    const curName = String(entry.name || 'Játékos').slice(0, 12);
    const curReb = Math.max(0, Math.floor(Number(entry.rebirths) || 0));
    const curLvl = Math.max(1, Math.floor(Number(entry.level) || 1));

    let newName = curName;
    let newReb = curReb;
    let newLvl = curLvl;
    let parsedNum = null;

    if (field === 'name') {
      const trimmed = String(rawValue ?? '').trim();
      if (!trimmed) {
        this.renderDevLeaderboardPanel();
        return;
      }
      if (trimmed.length > 12) {
        this.showToast('⚠️ A név legfeljebb 12 karakter lehet!', 2400);
        this.renderDevLeaderboardPanel();
        return;
      }
      newName = trimmed;
      if (newName === curName) {
        this.renderDevLeaderboardPanel();
        return;
      }
    } else if (field === 'rebirths') {
      parsedNum = this.parseDevNumericInput(rawValue, true);
      if (!parsedNum) {
        this.showToast('⚠️ Érvénytelen szám! (pl. 10 vagy +2)', 2400);
        this.renderDevLeaderboardPanel();
        return;
      }
      newReb = parsedNum.mode === 'delta'
        ? Math.max(0, Math.min(999999, curReb + parsedNum.value))
        : Math.max(0, Math.min(999999, parsedNum.value));
      if (newReb === curReb) {
        this.renderDevLeaderboardPanel();
        return;
      }
    } else if (field === 'level') {
      parsedNum = this.parseDevNumericInput(rawValue, true);
      if (!parsedNum) {
        this.showToast('⚠️ Érvénytelen szám! (pl. 100 vagy +10)', 2400);
        this.renderDevLeaderboardPanel();
        return;
      }
      newLvl = parsedNum.mode === 'delta'
        ? Math.max(1, Math.min(999999, curLvl + parsedNum.value))
        : Math.max(1, Math.min(999999, parsedNum.value));
      if (newLvl === curLvl) {
        this.renderDevLeaderboardPanel();
        return;
      }
    } else if (field === 'bb' || field === 'bt' || field === 'money') {
      parsedNum = this.parseDevNumericInput(rawValue, true);
      if (!parsedNum) {
        this.showToast('⚠️ Érvénytelen összeg! (pl. 50, +10, 500k)', 2600);
        this.renderDevLeaderboardPanel();
        return;
      }
      if (parsedNum.mode === 'delta' && parsedNum.value === 0) {
        this.renderDevLeaderboardPanel();
        return;
      }
    } else {
      this.renderDevLeaderboardPanel();
      return;
    }

    // Régi statikus felülírások törlése, hogy ne akadályozzák az új értéket:
    if (this.lbAdminRules && this.lbAdminRules.overrides) {
      for (const k of [
        entry.uid,
        entry.id,
        entry.docId,
        ...(entry.rawKeys || []),
        entry._origName ? `name:${entry._origName.trim().toLowerCase()}` : null,
        `name:${newName.trim().toLowerCase()}`
      ].filter(Boolean)) {
        delete this.lbAdminRules.overrides[k];
      }
    }

    if (entry.isPlayer) {
      let toastMsg = '';
      if (field === 'name') {
        this.setPlayerNameDirect(newName);
        toastMsg = `✏️ Saját név módosítva: <strong>${this.escapeHtml(newName)}</strong>`;
      } else if (field === 'rebirths') {
        this.rebirthCount = newReb;
        this.rebirthMultiplier = this.getRebirthMultiplier();
        toastMsg = `🔄 Saját Rebirth: <strong>${newReb}</strong>`;
      } else if (field === 'level') {
        const differs = newLvl !== this.level;
        this.level = newLvl;
        if (differs) this.generateLevel(this.level);
        toastMsg = `🚩 Saját Szint: <strong>${newLvl}</strong>`;
      } else if (field === 'bb') {
        this.bb = parsedNum.mode === 'delta' ? Math.max(0, this.bb + parsedNum.value) : Math.max(0, parsedNum.value);
        toastMsg = `⭐ Saját BB = <strong>${this.bb.toLocaleString('hu-HU')}</strong>`;
      } else if (field === 'bt') {
        this.bossTokens = parsedNum.mode === 'delta' ? Math.max(0, this.bossTokens + parsedNum.value) : Math.max(0, parsedNum.value);
        toastMsg = `👑 Saját BT = <strong>${this.bossTokens.toLocaleString('hu-HU')}</strong>`;
      } else if (field === 'money') {
        this.money = parsedNum.mode === 'delta' ? Math.max(0, this.money + parsedNum.value) : Math.max(0, parsedNum.value);
        toastMsg = `💵 Saját Pénz = <strong>$${this.formatNumber(this.money)}</strong>`;
      }

      this.lastAdminEditAt = Date.now();
      this.updateHUD();
      this.refreshOpenModals();
      this.save();
      this.broadcastMyStatus();
      if (this.cloud) {
        await this.cloud.syncLeaderboardToCloud(true);
        if (this.cloud.currentUser) {
          await this.cloud.saveToCloud(true);
        }
      }
      if (window.soundEngine) window.soundEngine.playCoin();
      if (toastMsg) this.showToast(toastMsg, 3200);
      this.renderDevLeaderboardPanel(true);
      return;
    }

    if (entry.isCustom) {
      const cp = this.lbAdminRules.customPlayers.find(c => c.id === entry.id);
      if (cp) {
        cp.name = newName;
        cp.rebirths = newReb;
        cp.level = newLvl;
      }
      await this.syncAdminRulesGlobally(true);
      return;
    }

    // Távoli játékos szerkesztése
    const now = Date.now();
    const matchIds = this.getEntryMatchIds(entry);
    const origLower = (entry._origName || entry.name || '').trim().toLowerCase();

    if (field === 'name' || field === 'rebirths' || field === 'level') {
      if (!this.lbAdminRules.playerCommands || typeof this.lbAdminRules.playerCommands !== 'object') {
        this.lbAdminRules.playerCommands = {};
      }
      const cmdId = 'cmd_' + now.toString(36) + '_' + Math.random().toString(36).slice(2, 6);
      this.lbAdminRules.playerCommands[cmdId] = {
        cmdId,
        targetIds: matchIds,
        targetNameLower: origLower,
        name: field === 'name' ? newName : '',
        rebirths: field === 'rebirths' ? newReb : null,
        level: field === 'level' ? newLvl : null,
        issuedAt: now
      };

      const cmdKeys = Object.keys(this.lbAdminRules.playerCommands);
      if (cmdKeys.length > 80) {
        cmdKeys
          .sort((a, b) => (this.lbAdminRules.playerCommands[a].issuedAt || 0) - (this.lbAdminRules.playerCommands[b].issuedAt || 0))
          .slice(0, cmdKeys.length - 80)
          .forEach(k => delete this.lbAdminRules.playerCommands[k]);
      }

      const editedVal = field === 'name' ? newName : (field === 'rebirths' ? newReb : newLvl);
      if (this.remotePlayers) {
        for (const pid of Object.keys(this.remotePlayers)) {
          const rp = this.remotePlayers[pid];
          if (rp && (matchIds.includes(pid) || matchIds.includes(rp.id) || (rp.uid && matchIds.includes(rp.uid)))) {
            rp[field] = editedVal;
            rp.adminUpdatedAt = now;
          }
        }
        try { localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers)); } catch (e) {}
      }

      if (this.cloud && (entry.docId || entry.uid)) {
        await this.cloud.adminUpdateLeaderboardDoc(entry.docId || entry.uid, {
          [field]: editedVal,
          adminUpdatedAt: now
        });
      }

      this.showToast(`✅ ${this.escapeHtml(entry.name)} frissítve!`, 2800);
      await this.syncAdminRulesGlobally(false);
      this.renderDevLeaderboardPanel(true);
      return;
    }

    // BB / BT / Pénz közvetlen beállítása vagy módosítása (külön currencyGifts ágban — nem nulláz semmilyen statot!)
    if (!this.lbAdminRules.currencyGifts || typeof this.lbAdminRules.currencyGifts !== 'object') {
      this.lbAdminRules.currencyGifts = {};
    }
    const giftId = 'gift_' + now.toString(36) + '_' + Math.random().toString(36).slice(2, 6);
    const giftPayload = {
      cmdId: giftId,
      targetIds: matchIds,
      targetNameLower: origLower,
      addBB: 0,
      addBT: 0,
      addMoney: 0,
      setBB: null,
      setBT: null,
      setMoney: null,
      issuedAt: now
    };

    let resolvedVal = null;
    let toastMsg = '';
    if (field === 'bb') {
      if (parsedNum.mode === 'set') {
        giftPayload.setBB = parsedNum.value;
        resolvedVal = parsedNum.value;
        toastMsg = `⭐ ${this.escapeHtml(entry.name)} BB beállítva: ${resolvedVal.toLocaleString('hu-HU')}!`;
      } else {
        giftPayload.addBB = parsedNum.value;
        if (entry.bb !== null && entry.bb !== undefined) {
          resolvedVal = Math.max(0, Math.floor(Number(entry.bb) || 0) + parsedNum.value);
        }
        toastMsg = `🎁 ${this.escapeHtml(entry.name)}: ${parsedNum.value > 0 ? '+' : ''}${parsedNum.value.toLocaleString('hu-HU')} ⭐ BB!`;
      }
    } else if (field === 'bt') {
      if (parsedNum.mode === 'set') {
        giftPayload.setBT = parsedNum.value;
        resolvedVal = parsedNum.value;
        toastMsg = `👑 ${this.escapeHtml(entry.name)} BT beállítva: ${resolvedVal.toLocaleString('hu-HU')}!`;
      } else {
        giftPayload.addBT = parsedNum.value;
        if (entry.bt !== null && entry.bt !== undefined) {
          resolvedVal = Math.max(0, Math.floor(Number(entry.bt) || 0) + parsedNum.value);
        }
        toastMsg = `🎁 ${this.escapeHtml(entry.name)}: ${parsedNum.value > 0 ? '+' : ''}${parsedNum.value.toLocaleString('hu-HU')} 👑 BT!`;
      }
    } else if (field === 'money') {
      if (parsedNum.mode === 'set') {
        giftPayload.setMoney = parsedNum.value;
        resolvedVal = parsedNum.value;
        toastMsg = `💵 ${this.escapeHtml(entry.name)} pénze beállítva: $${this.formatNumber(resolvedVal)}!`;
      } else {
        giftPayload.addMoney = parsedNum.value;
        if (entry.money !== null && entry.money !== undefined) {
          resolvedVal = Math.max(0, Math.floor(Number(entry.money) || 0) + parsedNum.value);
        }
        toastMsg = `🎁 ${this.escapeHtml(entry.name)}: ${parsedNum.value > 0 ? '+' : '-'}$${this.formatNumber(Math.abs(parsedNum.value))}!`;
      }
    }

    this.lbAdminRules.currencyGifts[giftId] = giftPayload;
    const giftKeys = Object.keys(this.lbAdminRules.currencyGifts);
    if (giftKeys.length > 80) {
      giftKeys
        .sort((a, b) => (this.lbAdminRules.currencyGifts[a].issuedAt || 0) - (this.lbAdminRules.currencyGifts[b].issuedAt || 0))
        .slice(0, giftKeys.length - 80)
        .forEach(k => delete this.lbAdminRules.currencyGifts[k]);
    }

    if (resolvedVal !== null && this.remotePlayers) {
      for (const pid of Object.keys(this.remotePlayers)) {
        const rp = this.remotePlayers[pid];
        if (rp && (matchIds.includes(pid) || matchIds.includes(rp.id) || (rp.uid && matchIds.includes(rp.uid)))) {
          rp[field] = resolvedVal;
          rp.adminUpdatedAt = now;
        }
      }
      try { localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers)); } catch (e) {}
    }

    if (resolvedVal !== null && this.cloud && (entry.docId || entry.uid)) {
      await this.cloud.adminUpdateLeaderboardDoc(entry.docId || entry.uid, {
        [field]: resolvedVal,
        adminUpdatedAt: now
      });
    }

    if (toastMsg) this.showToast(toastMsg, 3500);
    await this.syncAdminRulesGlobally(false);
    this.renderDevLeaderboardPanel(true);
  }

  async devBanOrUnbanEntry(entry) {
    const isBanned = entry._filterReason === 'Tiltott ID/UID' || entry._filterReason === 'Tiltott név';
    const matchIds = this.getEntryMatchIds(entry);
    const cleanLower = (entry._origName || entry.name || '').trim().toLowerCase();

    if (isBanned) {
      this.lbAdminRules.bannedIds = this.lbAdminRules.bannedIds.filter(id => !matchIds.includes(id));
      this.lbAdminRules.bannedNames = this.lbAdminRules.bannedNames.filter(n => n !== cleanLower);
    } else {
      for (const id of matchIds) {
        if (!this.lbAdminRules.bannedIds.includes(id)) this.lbAdminRules.bannedIds.push(id);
      }
      if (cleanLower && cleanLower !== 'játékos' && !this.lbAdminRules.bannedNames.includes(cleanLower)) {
        this.lbAdminRules.bannedNames.push(cleanLower);
      }
      if (!entry.isPlayer && !entry.isCustom) {
        for (const k of matchIds) {
          this.clearRetainedMqttPlayer(k);
        }
      }
    }
    await this.syncAdminRulesGlobally(true);
  }

  async devToggleWhitelistEntry(entry) {
    const cleanLower = (entry._origName || entry.name || '').trim().toLowerCase();
    const targetKey = (cleanLower && cleanLower !== 'játékos') ? cleanLower : String(entry.uid || entry.id || '').toLowerCase();
    if (!targetKey) return;
    const idx = this.lbAdminRules.whitelistNames.indexOf(targetKey);
    if (idx >= 0) {
      this.lbAdminRules.whitelistNames.splice(idx, 1);
    } else {
      this.lbAdminRules.whitelistNames.push(targetKey);
    }
    await this.syncAdminRulesGlobally(true);
  }

  async devDeleteEntry(entry) {
    if (entry.isPlayer) {
      this.showToast('ℹ️ A saját (TE) sorodat Tiltással vagy „Saját sorom szűrése” kapcsolóval tudod elrejteni.', 3200);
      return;
    }
    if (entry.isCustom) {
      this.lbAdminRules.customPlayers = this.lbAdminRules.customPlayers.filter(c => c.id !== entry.id);
      await this.syncAdminRulesGlobally(true);
      return;
    }

    const keys = this.getEntryMatchIds(entry);
    for (const k of keys) {
      this.clearRetainedMqttPlayer(k);
      if (this.remotePlayers && this.remotePlayers[k]) {
        delete this.remotePlayers[k];
      }
    }
    if (this.remotePlayers) {
      for (const pid of Object.keys(this.remotePlayers)) {
        const rp = this.remotePlayers[pid];
        if (rp && (keys.includes(pid) || keys.includes(rp.id) || (rp.uid && keys.includes(rp.uid)))) {
          delete this.remotePlayers[pid];
        }
      }
      try { localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers)); } catch (e) {}
    }

    let cloudNote = '';
    if (this.cloud && this.cloud.db) {
      const res = await this.cloud.adminDeleteLeaderboardDocs([entry.docId, entry.uid, entry.id].filter(Boolean));
      if (res.deleted > 0) cloudNote = ' (+ Firestore törölve)';
      else if (res.permissionDenied) {
        // Ha a Firestore szabály tiltja más dokumentumának törlését, automatikusan ID-tiltással biztosítjuk, hogy ne jöjjön vissza!
        for (const k of keys) {
          if (!this.lbAdminRules.bannedIds.includes(k)) this.lbAdminRules.bannedIds.push(k);
        }
        cloudNote = ' (Firestore jogosultság hiányában globális elrejtés aktiválva!)';
        await this.syncAdminRulesGlobally(false);
      }
    }

    this.renderLeaderboard();
    this.renderDevLeaderboardPanel();
    this.showToast(`🗑️ „${this.escapeHtml(entry.name)}” eltávolítva${cloudNote}`, 3200);
  }

  async devPruneStaleEntries() {
    const now = Date.now();
    let pruned = 0;
    const toDeleteFirestore = [];
    const guestExpiryMs = this.GUEST_RETENTION_MS || (3 * 24 * 60 * 60 * 1000);
    for (const k of Object.keys(this.remotePlayers)) {
      const rp = this.remotePlayers[k];
      if (!rp) {
        delete this.remotePlayers[k];
        pruned++;
        continue;
      }
      const isUnnamed = (rp.name || '').trim().toLowerCase() === 'játékos';
      const isProtected = !!(rp.fromFirestore || rp.uid || rp.keepInTop10);
      const isExpiredGuest = !isProtected && (now - (rp.ts || 0) > guestExpiryMs);
      const isStaleUnnamedGhost = isUnnamed && !rp.uid && !rp.fromFirestore && (now - (rp.ts || 0) > 25000);
      if (isExpiredGuest || isStaleUnnamedGhost) {
        this.clearRetainedMqttPlayer(k);
        if (rp.clientId) this.clearRetainedMqttPlayer(rp.clientId);
        if (rp.docId) toDeleteFirestore.push(rp.docId);
        delete this.remotePlayers[k];
        pruned++;
      }
    }
    try { localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers)); } catch (e) {}
    if (this.cloud && toDeleteFirestore.length > 0) {
      await this.cloud.adminDeleteLeaderboardDocs(toDeleteFirestore);
    }
    this.renderLeaderboard();
    this.renderDevLeaderboardPanel();
    this.showToast(`🧹 ${pruned} lejárt / névtelen cache bejegyzés megtisztítva!`, 3000);
  }

  // --- Admin Mail System (Játékos Postafiók + Fejlesztői Levélküldő) ---
  initMailSystem() {
    const openBtn = document.getElementById('btn-open-mail');
    const modal = document.getElementById('mail-modal');
    const closeBtn = document.getElementById('btn-close-mail');
    const closeFooter = document.getElementById('btn-close-mail-footer');
    if (openBtn) openBtn.addEventListener('click', () => this.openMailModal());
    const closeMail = () => {
      this.closeModal('mail-modal');
      if (window.soundEngine) window.soundEngine.playClickHit();
    };
    if (closeBtn) closeBtn.addEventListener('click', closeMail);
    if (closeFooter) closeFooter.addEventListener('click', closeMail);
    this.updateMailUnreadBadge(false);
  }

  saveReadMailIds() {
    try {
      localStorage.setItem('idle_breakout_read_mail_ids', JSON.stringify((this.readMailIds || []).slice(-120)));
    } catch (e) {}
  }

  getPlayerInboxMails() {
    const rawMails = (this.lbAdminRules && Array.isArray(this.lbAdminRules.adminMails))
      ? [...this.lbAdminRules.adminMails]
      : [];
    if (!rawMails.some(m => m && m.id === SEASON_RESET_MAIL.id)) {
      rawMails.push({ ...SEASON_RESET_MAIL });
    }
    const myUid = (this.cloud && this.cloud.currentUser) ? this.cloud.currentUser.uid : null;
    const myIds = [myUid, this.myPlayerId].filter(Boolean).map(String);
    const myNameLower = (this.playerName || '').trim().toLowerCase();

    return rawMails.filter(m => {
      if (!m) return false;
      if (m.targetMode !== 'player') return true;
      const idMatch = Array.isArray(m.targetIds) && m.targetIds.some(id => myIds.includes(String(id)));
      const nameMatch = !!m.targetNameLower && m.targetNameLower !== 'játékos' && myNameLower === m.targetNameLower;
      return idMatch || nameMatch;
    }).sort((a, b) => (b.sentAt || 0) - (a.sentAt || 0));
  }

  async devExecuteGlobalSeasonWipe() {
    if (!confirm('Biztosan nullázod MINDENKI statját (Szint 1, Rebirth 0, +5 BT és +1 BB kárpótlás), és kiküldöd a globális Szezon 2 levelet? (A skinek megmaradnak!)')) {
      return;
    }
    const now = Date.now();
    const resetToken = `${SEASON_RESET_ID}_${now}`;

    this.lbAdminRules.seasonResetAt = now;
    this.lbAdminRules.seasonResetToken = resetToken;
    this.lbAdminRules.overrides = {};
    if (Array.isArray(this.lbAdminRules.customPlayers)) {
      for (const cp of this.lbAdminRules.customPlayers) {
        if (!cp) continue;
        cp.rebirths = 0;
        cp.level = 1;
        cp.bricks = 0;
      }
    }
    if (!this.lbAdminRules.adminMails || !Array.isArray(this.lbAdminRules.adminMails)) {
      this.lbAdminRules.adminMails = [];
    }
    if (!this.lbAdminRules.adminMails.some(m => m && m.id === SEASON_RESET_MAIL.id)) {
      this.lbAdminRules.adminMails.push({ ...SEASON_RESET_MAIL, sentAt: now });
    }
    this.lbAdminRules.minClientVersion = APP_VERSION;
    this.lbAdminRules.forceReloadToken = now;
    if (!this.lbAdminRules.playerCommands || typeof this.lbAdminRules.playerCommands !== 'object') {
      this.lbAdminRules.playerCommands = {};
    }
    if (!this.lbAdminRules.currencyGifts || typeof this.lbAdminRules.currencyGifts !== 'object') {
      this.lbAdminRules.currencyGifts = {};
    }

    const roster = this.getRawLeaderboardRoster().filter(e => !e.isPlayer && !e.isCustom);
    let cmdIdx = 0;
    for (const entry of roster) {
      const matchIds = this.getEntryMatchIds(entry);
      const nameLower = (entry._origName || entry.name || '').trim().toLowerCase();
      if (matchIds.length === 0 && (!nameLower || nameLower === 'játékos')) continue;
      cmdIdx++;
      const statCmdId = 'sr_stat_' + now.toString(36) + '_' + cmdIdx;
      const curCmdId = 'sr_cur_' + now.toString(36) + '_' + cmdIdx;
      this.lbAdminRules.playerCommands[statCmdId] = {
        cmdId: statCmdId,
        targetIds: matchIds,
        targetNameLower: nameLower,
        name: '',
        rebirths: 0,
        level: 1,
        addBB: 0,
        addBT: 0,
        addMoney: 0,
        issuedAt: now
      };
      this.lbAdminRules.currencyGifts[curCmdId] = {
        cmdId: curCmdId,
        targetIds: matchIds,
        targetNameLower: nameLower,
        addBB: 0,
        addBT: 0,
        addMoney: 0,
        setBB: 1,
        setBT: 5,
        setMoney: 0,
        issuedAt: now
      };
    }

    const trimAdminMap = (obj) => {
      const keys = Object.keys(obj);
      if (keys.length > 140) {
        keys
          .sort((a, b) => (obj[a].issuedAt || 0) - (obj[b].issuedAt || 0))
          .slice(0, keys.length - 140)
          .forEach(k => delete obj[k]);
      }
    };
    trimAdminMap(this.lbAdminRules.playerCommands);
    trimAdminMap(this.lbAdminRules.currencyGifts);

    let fsOkCount = 0;
    let fsDeniedCount = 0;
    if (this.remotePlayers) {
      for (const pid of Object.keys(this.remotePlayers)) {
        const rp = this.remotePlayers[pid];
        if (!rp) continue;
        rp.rebirths = 0;
        rp.level = 1;
        rp.bricks = 0;
        rp.money = 0;
        rp.bb = 1;
        rp.bt = 5;
        rp.bpStage = 1;
        rp.adminUpdatedAt = now;
        rp.seasonResetToken = '';
        if (this.cloud && (rp.docId || rp.uid || pid)) {
          const res = await this.cloud.adminUpdateLeaderboardDoc(rp.docId || rp.uid || pid, {
            rebirths: 0,
            level: 1,
            bricks: 0,
            money: 0,
            bb: 1,
            bt: 5,
            bpStage: 1,
            seasonResetToken: '',
            adminUpdatedAt: now
          });
          if (res && res.ok) fsOkCount++;
          else if (res && res.reason === 'permission-denied') fsDeniedCount++;
        }
      }
      try { localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers)); } catch (e) {}
    }

    this.appliedSeasonResetId = null;
    this.appliedSeasonResetToken = null;
    this.applySeasonResetMigration(null, false, resetToken);

    await this.syncAdminRulesGlobally(false);
    this.renderLeaderboard();
    this.renderDevLeaderboardPanel(true);

    const fsNote = fsDeniedCount > 0 && fsOkCount === 0
      ? ' (Globális szabály + élő parancsok aktívak mindenkinek!)'
      : '';
    this.showToast(`🧹 Szezon 2 Globális Reset + 5 BT & 1 BB kárpótlás + Levél kiküldve!${fsNote}`, 5500);
  }

  updateMailUnreadBadge(notifyNew = false) {
    const mails = this.getPlayerInboxMails();
    const readSet = new Set(this.readMailIds || []);
    const unread = mails.filter(m => !readSet.has(m.id));
    const badge = document.getElementById('mail-unread-badge');
    if (badge) {
      badge.style.display = unread.length > 0 ? 'flex' : 'none';
      badge.textContent = unread.length > 9 ? '9+' : String(unread.length);
    }

    if (notifyNew && unread.length > 0) {
      const newest = unread[0];
      if (!this._toastedMailIds) this._toastedMailIds = new Set();
      if (!this._toastedMailIds.has(newest.id) && (newest.sentAt || 0) >= ((this._sessionStartedAt || Date.now()) - 120000)) {
        this._toastedMailIds.add(newest.id);
        if (window.soundEngine) window.soundEngine.playCoin();
        this.showToast(`📩 <strong>Új admin levél:</strong> ${this.escapeHtml(newest.title)} — nézd meg a ✉️ gombon!`, 5000);
      }
    }
  }

  openMailModal() {
    const modal = document.getElementById('mail-modal');
    if (!modal) return;
    const mails = this.getPlayerInboxMails();
    const readSet = new Set(this.readMailIds || []);
    const newlyReadSet = new Set();
    let added = false;
    for (const m of mails) {
      if (!readSet.has(m.id)) {
        newlyReadSet.add(m.id);
        this.readMailIds.push(m.id);
        added = true;
      }
    }
    if (added) {
      this.readMailIds = this.readMailIds.slice(-120);
      this.saveReadMailIds();
    }
    this.updateMailUnreadBadge(false);
    this.renderMailInboxModal(newlyReadSet);
    this.openModal('mail-modal');
    if (window.soundEngine) window.soundEngine.playClickHit();
  }

  renderMailInboxModal(newlyReadSet = null) {
    const listEl = document.getElementById('mail-inbox-list');
    if (!listEl) return;
    const mails = this.getPlayerInboxMails();
    if (mails.length === 0) {
      listEl.innerHTML = '<div class="mail-empty-state">📭 Még nincs üzeneted az admintól.</div>';
      return;
    }

    const now = Date.now();
    listEl.innerHTML = mails.map(m => {
      const isUnreadHighlight = !!(newlyReadSet && newlyReadSet.has(m.id));
      const secAgo = m.sentAt ? Math.max(0, Math.floor((now - m.sentAt) / 1000)) : null;
      const agoTxt = secAgo !== null ? this.formatLastSeenAgo(secAgo) : '';
      const dateTxt = m.sentAt ? new Date(m.sentAt).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
      const scopePill = m.targetMode === 'player'
        ? '<span class="mail-pill-scope is-personal">🎯 Személyes</span>'
        : '<span class="mail-pill-scope">🌍 Mindenkinek</span>';
      const newPill = isUnreadHighlight ? '<span class="mail-pill-new">ÚJ</span>' : '';
      return `
        <div class="mail-card ${isUnreadHighlight ? 'is-unread' : ''}">
          <div class="mail-card-head">
            <span class="mail-card-title">${this.escapeHtml(m.title)}</span>
            <span class="mail-card-badges">${newPill}${scopePill}</span>
          </div>
          <div class="mail-card-meta">🛠️ Admin • ${dateTxt}${agoTxt ? ` (${agoTxt})` : ''}</div>
          <div class="mail-card-body">${this.escapeHtml(m.body)}</div>
        </div>
      `;
    }).join('');
  }

  renderDevMailTab(roster) {
    const allMails = (this.lbAdminRules && Array.isArray(this.lbAdminRules.adminMails))
      ? this.lbAdminRules.adminMails
      : [];
    const countBadge = document.getElementById('dev-mail-count');
    if (countBadge) countBadge.textContent = String(allMails.length);

    const sel = document.getElementById('dev-mail-target');
    if (sel) {
      const prevVal = sel.value || '__ALL__';
      const playerOpts = (roster || [])
        .filter(e => !e.isCustom)
        .map(e => {
          const val = e.uid || e.id || '';
          const tag = e.isPlayer ? ' (TE)' : '';
          return `<option value="${this.escapeHtml(val)}">👤 ${this.escapeHtml(e.name)}${tag}</option>`;
        }).join('');
      sel.innerHTML = `<option value="__ALL__">🌍 Minden játékosnak (Globális)</option>${playerOpts}`;
      if ([...sel.options].some(o => o.value === prevVal)) {
        sel.value = prevVal;
      }
    }

    const sentEl = document.getElementById('dev-sent-mails-list');
    if (sentEl) {
      if (allMails.length === 0) {
        sentEl.innerHTML = '<div class="leaderboard-empty-hint">Még nem küldtél levelet.</div>';
      } else {
        const now = Date.now();
        sentEl.innerHTML = [...allMails].sort((a, b) => (b.sentAt || 0) - (a.sentAt || 0)).map(m => {
          const secAgo = m.sentAt ? Math.max(0, Math.floor((now - m.sentAt) / 1000)) : null;
          const agoTxt = secAgo !== null ? this.formatLastSeenAgo(secAgo) : '';
          const scopeLabel = m.targetMode === 'player' ? `🎯 ${m.targetName}` : '🌍 Mindenkinek';
          return `
            <div class="dev-sent-mail-item">
              <div class="dev-sent-mail-head">
                <span class="dev-sent-mail-title">${this.escapeHtml(m.title)}</span>
                <span class="dev-sent-mail-meta">
                  <span>${this.escapeHtml(scopeLabel)}${agoTxt ? ` • ${agoTxt}` : ''}</span>
                  <button type="button" class="dev-act-btn act-del" data-del-mail="${this.escapeHtml(m.id)}" title="Levél visszavonása / törlése">🗑️</button>
                </span>
              </div>
              <div class="dev-sent-mail-body">${this.escapeHtml(m.body)}</div>
            </div>
          `;
        }).join('');

        sentEl.querySelectorAll('[data-del-mail]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-del-mail');
            if (id) this.devDeleteAdminMail(id);
          });
        });
      }
    }
  }

  async devSendAdminMail() {
    const sel = document.getElementById('dev-mail-target');
    const titleEl = document.getElementById('dev-mail-title');
    const bodyEl = document.getElementById('dev-mail-body');
    const title = (titleEl ? titleEl.value : '').trim().slice(0, 60);
    const body = (bodyEl ? bodyEl.value : '').trim().slice(0, 500);
    if (!title || !body) {
      this.showToast('⚠️ Add meg a levél címét és szövegét!', 2500);
      return;
    }

    const targetVal = sel ? sel.value : '__ALL__';
    let targetMode = 'all';
    let targetIds = [];
    let targetName = 'Mindenki';
    let targetNameLower = '';

    if (targetVal && targetVal !== '__ALL__') {
      const roster = this.getRawLeaderboardRoster();
      const targetEntry = roster.find(e => !e.isCustom && (e.uid === targetVal || e.id === targetVal));
      if (targetEntry) {
        targetMode = 'player';
        targetIds = this.getEntryMatchIds(targetEntry);
        targetName = targetEntry.name || 'Játékos';
        targetNameLower = (targetEntry._origName || targetEntry.name || '').trim().toLowerCase();
      }
    }

    if (!Array.isArray(this.lbAdminRules.adminMails)) {
      this.lbAdminRules.adminMails = [];
    }
    const now = Date.now();
    this.lbAdminRules.adminMails.push({
      id: 'mail_' + now.toString(36) + '_' + Math.random().toString(36).slice(2, 6),
      title,
      body,
      targetMode,
      targetIds,
      targetName,
      targetNameLower,
      sentAt: now
    });
    if (this.lbAdminRules.adminMails.length > 40) {
      this.lbAdminRules.adminMails = this.lbAdminRules.adminMails.slice(-40);
    }

    if (titleEl) titleEl.value = '';
    if (bodyEl) bodyEl.value = '';
    await this.syncAdminRulesGlobally(false);
    this.updateMailUnreadBadge(false);
    this.renderDevLeaderboardPanel();
    this.showToast(`📨 Levél elküldve (${this.escapeHtml(targetName)})!`, 3200);
  }

  async devDeleteAdminMail(mailId) {
    if (!Array.isArray(this.lbAdminRules.adminMails)) return;
    this.lbAdminRules.adminMails = this.lbAdminRules.adminMails.filter(m => m && m.id !== mailId);
    await this.syncAdminRulesGlobally(false);
    this.updateMailUnreadBadge(false);
    this.renderDevLeaderboardPanel();
    this.showToast('🗑️ Levél törölve!', 2500);
  }

  renderDevLeaderboardPanel(forceRender = false) {
    if (!this.isDevUnlocked()) return;
    this.updateMaintenanceOverlay(false);
    const roster = this.getRawLeaderboardRoster();
    roster.sort((a, b) => {
      if (b.rebirths !== a.rebirths) return b.rebirths - a.rebirths;
      if (b.level !== a.level) return b.level - a.level;
      return (b.bricks || 0) - (a.bricks || 0);
    });
    const visibleCount = roster.filter(e => !e._filterReason).length;
    const countEl = document.getElementById('dev-count-summary');
    if (countEl) countEl.textContent = `${visibleCount}/${roster.length}`;

    // Players list (ne írjuk felül a DOM-ot, amíg egy kártyán belüli mezőt épp ír a fejlesztő)
    const listEl = document.getElementById('dev-players-list');
    const isInlineEditing = !forceRender && !!(listEl && (this._devInlineEditActive || listEl.querySelector('.dev-inline-input')));
    if (listEl && !isInlineEditing) {
      listEl.innerHTML = roster.map((entry, idx) => {
        const srcBadge = entry.isPlayer
          ? '<span class="dev-src-tag src-te">TE</span>'
          : (entry.isCustom
              ? '<span class="dev-src-tag src-custom">KÉZI</span>'
              : (entry.fromFirestore
                  ? '<span class="dev-src-tag src-cloud">☁️ FELHŐ</span>'
                  : '<span class="dev-src-tag src-mqtt">📡 MQTT</span>'));
        const dot = entry.isOnline ? '🟢' : '⚪';
        const statusBadge = entry._filterReason
          ? `<span class="dev-vis-tag vis-hidden">🚫 ${this.escapeHtml(entry._filterReason)}</span>`
          : '<span class="dev-vis-tag vis-shown">✅ Látható</span>';
        const wlCheckKey = (entry._origName || entry.name || '').trim().toLowerCase();
        const inWl = (this.lbAdminRules.whitelistNames || []).includes(wlCheckKey);
        const isBanned = entry._filterReason === 'Tiltott ID/UID' || entry._filterReason === 'Tiltott név';
        const idText = entry.uid || entry.id || '-';
        const hasSyncedMoney = (entry.money !== null && entry.money !== undefined);
        const moneyAmount = hasSyncedMoney ? entry.money : this.estimateApproxMoney(entry.level, entry.rebirths);
        const moneyTxt = this.formatApproxMoney(moneyAmount);
        const moneyTitle = (hasSyncedMoney
          ? 'Közelítő pénz (szinkronizálva)'
          : 'Becsült közelítő pénz (szint + rebirth alapján)')
          + (entry.isCustom ? '' : ' • Kattints az átíráshoz (pl. 500k vagy +100k)');
        const hasExactBb = (entry.bb !== null && entry.bb !== undefined);
        const hasExactBt = (entry.bt !== null && entry.bt !== undefined);
        const bbTxt = hasExactBb ? Math.max(0, Math.floor(Number(entry.bb) || 0)).toLocaleString('hu-HU') : '—';
        const btTxt = hasExactBt ? Math.max(0, Math.floor(Number(entry.bt) || 0)).toLocaleString('hu-HU') : '—';
        const bbTitle = (hasExactBb
          ? 'Pontos szinkronizált BB egyenleg'
          : 'Pontos BB — frissítés után szinkronizál')
          + (entry.isCustom ? '' : ' • Kattints az átíráshoz (pl. 50 vagy +10)');
        const btTitle = (hasExactBt
          ? 'Pontos szinkronizált BT egyenleg'
          : 'Pontos BT — frissítés után szinkronizál')
          + (entry.isCustom ? '' : ' • Kattints az átíráshoz (pl. 25 vagy +5)');
        const rebMultTxt = this.getRebirthMultiplier(entry.rebirths || 0).toFixed(2);
        const brkTxt = this.formatNumber(entry.bricks || 0);
        const bpStg = entry.bpStage || this.getCurrentBattlePassStage(entry.bricks || 0);
        const effTs = Math.max(Number(entry.ts) || 0, Number(entry.lastSeenLocalMs) || 0);
        const isOnlineNow = entry.isPlayer || entry.isOnline || (effTs > 0 && (Date.now() - effTs) < 45000);
        const ageSec = isOnlineNow ? 0 : (effTs > 0 ? Math.max(0, Math.floor((Date.now() - effTs) / 1000)) : null);
        const seenTxt = isOnlineNow ? 'Online most' : (ageSec !== null ? `Online volt: ${this.formatLastSeenAgo(ageSec)}` : 'Offline');

        return `
          <div class="dev-player-card ${entry._filterReason ? 'is-filtered' : ''}" data-dev-idx="${idx}">
            <div class="dev-pc-top">
              <span class="dev-pc-name">${dot} <strong class="dev-pc-name-editable" data-edit-field="name" title="Kattints a név átírásához">${this.escapeHtml(entry.name)}</strong> ${srcBadge}</span>
              ${statusBadge}
            </div>
            <div class="dev-pc-stat-grid">
              <div class="dev-stat-chip chip-money ${entry.isCustom ? '' : 'is-editable'}" ${entry.isCustom ? '' : 'data-edit-field="money"'} title="${moneyTitle}">
                <span class="dev-stat-lbl">💵 PÉNZ</span>
                <span class="dev-stat-val"${hasSyncedMoney ? '' : ' style="opacity:0.85;"'}>${moneyTxt}</span>
              </div>
              <div class="dev-stat-chip chip-bb ${entry.isCustom ? '' : 'is-editable'}" ${entry.isCustom ? '' : 'data-edit-field="bb"'} title="${bbTitle}">
                <span class="dev-stat-lbl">⭐ BB</span>
                <span class="dev-stat-val">${bbTxt}</span>
              </div>
              <div class="dev-stat-chip chip-bt ${entry.isCustom ? '' : 'is-editable'}" ${entry.isCustom ? '' : 'data-edit-field="bt"'} title="${btTitle}">
                <span class="dev-stat-lbl">👑 BT</span>
                <span class="dev-stat-val">${btTxt}</span>
              </div>
              <div class="dev-stat-chip chip-reb is-editable" data-edit-field="rebirths" title="Kattints a pontos Rebirth beállításához (pl. 4 vagy 1, csökkentéshez is)">
                <span class="dev-stat-lbl">🔄 REB (${rebMultTxt}x)</span>
                <span class="dev-stat-val">${this.formatLeaderboardStat(entry.rebirths)}</span>
              </div>
              <div class="dev-stat-chip chip-lvl is-editable" data-edit-field="level" title="Kattints a pontos Szint beállításához (pl. 100 vagy 1)">
                <span class="dev-stat-lbl">🚩 SZINT</span>
                <span class="dev-stat-val">${this.formatLeaderboardStat(entry.level)}</span>
              </div>
              <div class="dev-stat-chip chip-brk">
                <span class="dev-stat-lbl">🧱 BLOKK • BP</span>
                <span class="dev-stat-val">${brkTxt} • Stg ${bpStg}</span>
              </div>
            </div>
            <div class="dev-pc-id">
              <span>ID: <code>${this.escapeHtml(String(idText).slice(0, 22))}</code></span>
              <span>${seenTxt}</span>
            </div>
            <div class="dev-pc-actions">
              <button type="button" class="dev-act-btn act-edit" data-act="edit" title="Összes mező egyszerre">✏️ Szerk</button>
              ${!entry.isCustom ? '<button type="button" class="dev-act-btn act-mail" data-act="mail" title="Levél írása ennek a játékosnak">✉️</button>' : ''}
              <button type="button" class="dev-act-btn ${inWl ? 'act-wl-on' : 'act-wl'}" data-act="wl" title="Engedélyezőlistára tesz / levesz">${inWl ? '✅ WL' : '+ WL'}</button>
              <button type="button" class="dev-act-btn ${isBanned ? 'act-unban' : 'act-ban'}" data-act="ban" title="${isBanned ? 'Tiltás feloldása' : 'Tiltás és elrejtés'}">${isBanned ? '🔓 Felold' : '🚫 Tilt'}</button>
              ${!entry.isPlayer ? '<button type="button" class="dev-act-btn act-del" data-act="del" title="Törlés (MQTT/Cache/Firestore)">🗑️</button>' : ''}
            </div>
          </div>
        `;
      }).join('') || '<div class="leaderboard-empty-hint">Nincs észlelt játékos.</div>';

      listEl.querySelectorAll('.dev-player-card').forEach((card) => {
        const idx = parseInt(card.getAttribute('data-dev-idx'), 10);
        const entry = roster[idx];
        if (!entry) return;
        card.querySelectorAll('[data-edit-field]').forEach((el) => {
          el.addEventListener('click', (e) => {
            if (e.target && e.target.closest('.dev-inline-edit-wrap')) return;
            const field = el.getAttribute('data-edit-field');
            if (field) this.devStartInlineEdit(el, entry, field);
          });
        });
        card.querySelectorAll('.dev-act-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            const act = btn.getAttribute('data-act');
            if (act === 'edit') this.devOpenEditDrawer(entry);
            else if (act === 'mail') {
              if (typeof this.switchDevTab === 'function') this.switchDevTab('mail');
              const sel = document.getElementById('dev-mail-target');
              const val = entry.uid || entry.id || '__ALL__';
              if (sel && [...sel.options].some(o => o.value === val)) sel.value = val;
              const tIn = document.getElementById('dev-mail-title');
              if (tIn) setTimeout(() => tIn.focus(), 40);
            }
            else if (act === 'wl') this.devToggleWhitelistEntry(entry);
            else if (act === 'ban') this.devBanOrUnbanEntry(entry);
            else if (act === 'del') this.devDeleteEntry(entry);
          });
        });
      });
    }

    this.renderDevMailTab(roster);

    // Rule checkboxes
    const rules = this.lbAdminRules;
    const setCb = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
    setCb('dev-rule-hide-default', rules.hideDefaultName);
    setCb('dev-rule-hide-guests', rules.hideGuests);
    setCb('dev-rule-hide-offline', rules.hideOffline);
    setCb('dev-rule-whitelist-only', rules.whitelistOnly);
    setCb('dev-rule-filter-self', rules.filterLocalSelf);

    // Chips: Whitelist
    const wlWrap = document.getElementById('dev-whitelist-chips');
    if (wlWrap) {
      wlWrap.innerHTML = (rules.whitelistNames || []).map((w) =>
        `<span class="dev-chip wl-chip">${this.escapeHtml(w)} <button type="button" class="dev-chip-x" data-wl="${this.escapeHtml(w)}">✕</button></span>`
      ).join('') || '<span class="dev-empty-chips">Üres engedélyezőlista</span>';
      wlWrap.querySelectorAll('.dev-chip-x').forEach((btn) => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-wl');
          this.lbAdminRules.whitelistNames = this.lbAdminRules.whitelistNames.filter(x => x !== val);
          this.syncAdminRulesGlobally(true);
        });
      });
    }

    // Chips: Banlist (Names + IDs)
    const banWrap = document.getElementById('dev-ban-chips');
    if (banWrap) {
      const chips = [
        ...(rules.bannedNames || []).map(n => ({ kind: 'name', val: n, label: `Név: ${n}` })),
        ...(rules.bannedIds || []).map(id => ({ kind: 'id', val: id, label: `ID: ${String(id).slice(0, 14)}` }))
      ];
      banWrap.innerHTML = chips.map((c) =>
        `<span class="dev-chip ban-chip">${this.escapeHtml(c.label)} <button type="button" class="dev-chip-x" data-kind="${c.kind}" data-val="${this.escapeHtml(c.val)}">✕</button></span>`
      ).join('') || '<span class="dev-empty-chips">Nincs tiltott név vagy ID</span>';
      banWrap.querySelectorAll('.dev-chip-x').forEach((btn) => {
        btn.addEventListener('click', () => {
          const kind = btn.getAttribute('data-kind');
          const val = btn.getAttribute('data-val');
          if (kind === 'name') {
            this.lbAdminRules.bannedNames = this.lbAdminRules.bannedNames.filter(x => x !== val);
          } else {
            this.lbAdminRules.bannedIds = this.lbAdminRules.bannedIds.filter(x => x !== val);
          }
          this.syncAdminRulesGlobally(true);
        });
      });
    }
  }

  // --- Battle Pass System ---
  initBattlePass() {
    this.updateBattlePassHUD();
    this.renderBattlePass();

    const switchTab = (tab) => {
      this.activeBPTab = tab;
      const isStages = (tab === 'stages');

      const stagesPc = document.getElementById('bp-stages-container-pc');
      const armoryPc = document.getElementById('bp-armory-container-pc');
      const btnStagesPc = document.getElementById('btn-bp-tab-stages-pc');
      const btnArmoryPc = document.getElementById('btn-bp-tab-armory-pc');

      if (stagesPc) stagesPc.style.display = isStages ? 'flex' : 'none';
      if (armoryPc) armoryPc.style.display = isStages ? 'none' : 'flex';
      if (btnStagesPc) btnStagesPc.classList.toggle('active', isStages);
      if (btnArmoryPc) btnArmoryPc.classList.toggle('active', !isStages);

      const stagesMob = document.getElementById('bp-stages-container-mobile');
      const armoryMob = document.getElementById('bp-armory-container-mobile');
      const btnStagesMob = document.getElementById('btn-bp-tab-stages-mobile');
      const btnArmoryMob = document.getElementById('btn-bp-tab-armory-mobile');

      if (stagesMob) stagesMob.style.display = isStages ? 'flex' : 'none';
      if (armoryMob) armoryMob.style.display = isStages ? 'none' : 'flex';
      if (btnStagesMob) btnStagesMob.classList.toggle('active', isStages);
      if (btnArmoryMob) btnArmoryMob.classList.toggle('active', !isStages);

      this.renderBattlePass();
    };

    const tabStagesPc = document.getElementById('btn-bp-tab-stages-pc');
    const tabArmoryPc = document.getElementById('btn-bp-tab-armory-pc');
    if (tabStagesPc) tabStagesPc.addEventListener('click', () => switchTab('stages'));
    if (tabArmoryPc) tabArmoryPc.addEventListener('click', () => switchTab('armory'));

    const tabStagesMob = document.getElementById('btn-bp-tab-stages-mobile');
    const tabArmoryMob = document.getElementById('btn-bp-tab-armory-mobile');
    if (tabStagesMob) tabStagesMob.addEventListener('click', () => switchTab('stages'));
    if (tabArmoryMob) tabArmoryMob.addEventListener('click', () => switchTab('armory'));

    const triggerPayPalCheckout = () => {
      // Új ablakban / lapon megnyitja a PayPalt, de a Prémium NEM aktiválható a kliensben!
      try {
        window.open(PAYPAL_CHECKOUT_URL, '_blank', 'noopener,noreferrer');
      } catch (e) {
        window.location.href = PAYPAL_CHECKOUT_URL;
      }

      const checkoutModal = document.getElementById('premium-checkout-modal');
      if (checkoutModal) checkoutModal.classList.remove('open');

      this.showToast('💳 PayPal megnyitva új ablakban! (A Prémium Breaker Pass manuálisan nem aktiválható.)', 4000);
    };

    const unlockPc = document.getElementById('btn-unlock-premium-pc');
    const unlockMob = document.getElementById('btn-unlock-premium-mobile');
    if (unlockPc) unlockPc.addEventListener('click', triggerPayPalCheckout);
    if (unlockMob) unlockMob.addEventListener('click', triggerPayPalCheckout);

    const confirmPay = document.getElementById('btn-confirm-premium-pay');
    const cancelPay = document.getElementById('btn-cancel-premium-pay');
    const checkoutModal = document.getElementById('premium-checkout-modal');

    if (confirmPay) confirmPay.addEventListener('click', triggerPayPalCheckout);
    if (cancelPay) {
      cancelPay.addEventListener('click', () => {
        if (checkoutModal) checkoutModal.classList.remove('open');
      });
    }
  }

  // A Prémium Battle Pass semmilyen módon nem aktiválható kliensoldalról
  get battlePassPremium() {
    return false;
  }

  set battlePassPremium(_val) {
    // Tiltott aktiválás: szándékosan figyelmen kívül hagyva
  }

  unlockBattlePassPremium() {
    this.showToast('🔒 A Prémium Breaker Pass közvetlenül nem aktiválható!', 3500);
    this.renderBattlePass();
  }

  updateBattlePassHUD(skipStageRender = false) {
    let curStageIdx = 0;
    for (let i = 0; i < BATTLE_PASS_STAGES.length; i++) {
      if (this.totalBricksDestroyed >= BATTLE_PASS_STAGES[i].bricks) {
        curStageIdx = i;
      } else {
        break;
      }
    }

    const curStage = BATTLE_PASS_STAGES[curStageIdx];
    const nextStage = BATTLE_PASS_STAGES[curStageIdx + 1] || null;

    let progressPercent = 100;
    let progressLabel = `${this.formatNumber(this.totalBricksDestroyed)} BLOKK (MAX)`;

    if (nextStage) {
      const prevBricks = curStage.bricks;
      const targetBricks = nextStage.bricks;
      const diff = targetBricks - prevBricks;
      const currentInStage = Math.max(0, this.totalBricksDestroyed - prevBricks);
      progressPercent = Math.min(100, Math.max(0, (currentInStage / diff) * 100));
      progressLabel = `${this.formatNumber(this.totalBricksDestroyed)} / ${this.formatNumber(targetBricks)}`;
    }

    for (const suffix of ['-pc', '-mobile']) {
      const stageEl = document.getElementById(`bp-current-stage${suffix}`);
      const bricksEl = document.getElementById(`bp-total-bricks${suffix}`);
      const fillEl = document.getElementById(`bp-progress-fill${suffix}`);
      const textEl = document.getElementById(`bp-progress-text${suffix}`);

      if (stageEl) stageEl.textContent = `Stage ${curStage.stage}/${BATTLE_PASS_STAGES.length}`;
      if (bricksEl) bricksEl.textContent = this.formatNumber(this.totalBricksDestroyed);
      if (fillEl) fillEl.style.width = `${progressPercent.toFixed(1)}%`;
      if (textEl) textEl.textContent = progressLabel;
    }

    const prevStage = this.lastRenderedBPStage;
    this.lastRenderedBPStage = curStage.stage;
    if (!skipStageRender && prevStage !== null && curStage.stage !== prevStage) {
      this.renderBattlePass();
      if (curStage.stage > prevStage && !this.suppressAudioAndVisuals) {
        const rewardNote = curStage.free ? ` Átveheted: ${curStage.free.name}` : '';
        this.showToast(`🎖️ <strong>BREAKER PASS STAGE ${curStage.stage} ELÉRVE!</strong>${rewardNote}`, 4500);
        if (window.soundEngine) window.soundEngine.playLevelUp();
      }
    }
  }

  getUnlockedCosmetics() {
    const unlocked = {
      skins: new Set(['default']),
      effects: new Set(['none']),
      breakEffects: new Set(['none'])
    };

    if (this.preservedCosmetics) {
      (this.preservedCosmetics.skins || []).forEach(id => unlocked.skins.add(id));
      (this.preservedCosmetics.effects || []).forEach(id => unlocked.effects.add(id));
      (this.preservedCosmetics.breakEffects || []).forEach(id => unlocked.breakEffects.add(id));
    }

    for (const stage of BATTLE_PASS_STAGES) {
      if (this.battlePassClaimedFree[stage.stage] && stage.free && stage.free.type !== 'currency') {
        if (stage.free.type === 'skin') unlocked.skins.add(stage.free.id);
        if (stage.free.type === 'effect') unlocked.effects.add(stage.free.id);
        if (stage.free.type === 'break_effect') unlocked.breakEffects.add(stage.free.id);
      }
    }
    return unlocked;
  }

  renderBattlePass() {
    this.updateBattlePassHUD(true);

    for (const suffix of ['-pc', '-mobile']) {
      const btn = document.getElementById(`btn-unlock-premium${suffix}`);
      if (btn) {
        if (this.battlePassPremium) {
          btn.textContent = '✅ PRÉMIUM AKTÍV';
          btn.classList.add('premium-unlocked');
        } else {
          btn.textContent = '💳 PRÉMIUM VÁSÁRLÁSA (4 999 FT)';
          btn.classList.remove('premium-unlocked');
        }
      }
    }

    const stagesHtml = BATTLE_PASS_STAGES.map(stage => {
      const isReached = this.totalBricksDestroyed >= stage.bricks;

      let freeTrackHtml = '';
      if (stage.free) {
        const isFreeClaimed = !!this.battlePassClaimedFree[stage.stage];
        let freeActionHtml = '';
        if (isFreeClaimed) {
          freeActionHtml = '<span class="badge-claimed">✓ ÁTVÉVE</span>';
        } else if (isReached) {
          freeActionHtml = `<button class="btn-claim-reward" data-bp-stage="${stage.stage}" data-bp-track="free">ÁTVÉTEL</button>`;
        } else {
          freeActionHtml = `<button class="btn-claim-reward" disabled>${this.formatNumber(stage.bricks)} BLOKK</button>`;
        }
        const multiTag = (stage.free.maxEquip && stage.free.maxEquip > 1)
          ? ` <span class="armory-multi-badge">🔗 ${stage.free.maxEquip}×</span>`
          : '';
        const freeLabel = stage.free.name + (stage.free.isRare ? ' ⭐' : '') + multiTag;
        freeTrackHtml = `
          <div class="bp-track-row">
            <span class="track-pill pill-free">FREE</span>
            <div class="reward-info-box">
              <span class="reward-name">${freeLabel}</span>
              <span class="reward-tag">${stage.free.desc || ''}</span>
            </div>
            ${freeActionHtml}
          </div>`;
      } else {
        freeTrackHtml = `
          <div class="bp-track-row empty-free-row">
            <span class="track-pill pill-free pill-muted">FREE</span>
            <div class="reward-info-box">
              <span class="bp-empty-text">— ÜRES SZINT — Haladj a következő mérföldkőig!</span>
            </div>
            <span class="bp-empty-lock">—</span>
          </div>`;
      }

      const paidActionHtml = '<span class="badge-locked">🔒 PRÉMIUM</span>';
      const paidLabel = stage.paid ? stage.paid.name : '';

      return `
        <div class="bp-stage-card ${stage.free ? '' : 'bp-stage-free-empty'} ${isReached ? 'stage-reached' : ''}">
          <div class="bp-card-top-row">
            <strong>Stage ${stage.stage}</strong>
            <span style="color:#777;">${stage.bricks === 0 ? 'INGYENES' : this.formatNumber(stage.bricks) + ' blokk'}</span>
          </div>
          ${freeTrackHtml}
          <div class="bp-track-row premium-row">
            <span class="track-pill pill-paid">PRÉMIUM</span>
            <div class="reward-info-box">
              <span class="reward-name">${paidLabel}</span>
              <span class="reward-tag">${(stage.paid && stage.paid.desc) || ''}</span>
            </div>
            ${paidActionHtml}
          </div>
        </div>
      `;
    }).join('');

    for (const suffix of ['-pc', '-mobile']) {
      const el = document.getElementById(`bp-stages-container${suffix}`);
      if (el) {
        const prevScroll = el.scrollTop;
        el.innerHTML = stagesHtml;
        el.scrollTop = prevScroll;
        el.querySelectorAll('.btn-claim-reward[data-bp-stage]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const stg = parseInt(btn.getAttribute('data-bp-stage'));
            const trk = btn.getAttribute('data-bp-track');
            if (trk === 'free') this.claimBattlePassReward(stg, trk);
          });
        });
      }
    }

    const unlocked = this.getUnlockedCosmetics();
    const allSkins = [{ id: 'default', name: 'Alapértelmezett' }];
    const allEffects = [{ id: 'none', name: 'Nincs effekt' }];
    const allBreakEffects = [{ id: 'none', name: 'Nincs törés effekt' }];
    const addedSkins = new Set(['default']);
    const addedEffects = new Set(['none']);
    const addedBreakEffects = new Set(['none']);

    for (const stage of BATTLE_PASS_STAGES) {
      if (stage.free && stage.free.type === 'skin' && unlocked.skins.has(stage.free.id) && !addedSkins.has(stage.free.id)) {
        addedSkins.add(stage.free.id);
        allSkins.push({ id: stage.free.id, name: stage.free.name, maxEquip: stage.free.maxEquip || 1 });
      }
      if (stage.free && stage.free.type === 'effect' && unlocked.effects.has(stage.free.id) && !addedEffects.has(stage.free.id)) {
        addedEffects.add(stage.free.id);
        allEffects.push({ id: stage.free.id, name: stage.free.name, maxEquip: stage.free.maxEquip || 1 });
      }
      if (stage.free && stage.free.type === 'break_effect' && unlocked.breakEffects.has(stage.free.id) && !addedBreakEffects.has(stage.free.id)) {
        addedBreakEffects.add(stage.free.id);
        allBreakEffects.push({ id: stage.free.id, name: stage.free.name, maxEquip: stage.free.maxEquip || 1 });
      }
      if (stage.paid && stage.paid.type === 'skin' && unlocked.skins.has(stage.paid.id) && !addedSkins.has(stage.paid.id)) {
        addedSkins.add(stage.paid.id);
        allSkins.push({ id: stage.paid.id, name: stage.paid.name, maxEquip: stage.paid.maxEquip || 1 });
      }
      if (stage.paid && stage.paid.type === 'effect' && unlocked.effects.has(stage.paid.id) && !addedEffects.has(stage.paid.id)) {
        addedEffects.add(stage.paid.id);
        allEffects.push({ id: stage.paid.id, name: stage.paid.name, maxEquip: stage.paid.maxEquip || 1 });
      }
      if (stage.paid && stage.paid.type === 'break_effect' && unlocked.breakEffects.has(stage.paid.id) && !addedBreakEffects.has(stage.paid.id)) {
        addedBreakEffects.add(stage.paid.id);
        allBreakEffects.push({ id: stage.paid.id, name: stage.paid.name, maxEquip: stage.paid.maxEquip || 1 });
      }
    }

    // Régi Szezon 1 skinek & effektek hozzáadása (megőrzés újrakezdés után!)
    for (const sId of unlocked.skins) {
      if (!addedSkins.has(sId)) {
        addedSkins.add(sId);
        allSkins.push({ id: sId, name: (LEGACY_COSMETIC_META.skins && LEGACY_COSMETIC_META.skins[sId]) || sId, maxEquip: 1 });
      }
    }
    for (const eId of unlocked.effects) {
      if (!addedEffects.has(eId)) {
        addedEffects.add(eId);
        allEffects.push({ id: eId, name: (LEGACY_COSMETIC_META.effects && LEGACY_COSMETIC_META.effects[eId]) || eId, maxEquip: 1 });
      }
    }
    for (const bId of unlocked.breakEffects) {
      if (!addedBreakEffects.has(bId)) {
        addedBreakEffects.add(bId);
        allBreakEffects.push({ id: bId, name: (LEGACY_COSMETIC_META.breakEffects && LEGACY_COSMETIC_META.breakEffects[bId]) || bId, maxEquip: 1 });
      }
    }

    const armoryLabels = {
      normal: { one: 'Normál labda', many: 'Normál labdák' },
      speedy: { one: 'Speedy labda', many: 'Speedy labdák' },
      heavy: { one: 'Heavy labda', many: 'Heavy labdák' },
      smasher: { one: 'Smasher labda', many: 'Smasher labdák' },
      poison: { one: 'Poison labda', many: 'Poison labdák' },
      coin: { one: 'Coin labda', many: 'Coin labdák' },
      rocket: { one: 'Rocket labda', many: 'Rocket labdák' },
      ghost: { one: 'Ghost labda', many: 'Ghost labdák' },
      multiply: { one: 'Multiply labda', many: 'Multiply labdák' },
      symbiot: { one: 'Symbiot labda', many: 'Symbiot labdák' }
    };

    const ownedBallTypes = Object.keys(this.ballTypes).filter(k => this.ballTypes[k].count > 0);
    let armoryHtml = '';
    if (ownedBallTypes.length === 0) {
      armoryHtml = `
        <div style="padding: 16px; text-align: center; color: #555; line-height: 1.4;">
          🎱 <strong>Még nincs egyetlen labdád sem!</strong><br><br>
          Vásárolj legalább 1 labdát a fenti menüből ($25-tól), hogy felruházhasd a Breaker Pass-ből feloldott egyedi skinekkel és vizuális effektekkel!
        </div>
      `;
    } else {
      armoryHtml = `<div style="font-size:12px; color:#555; margin-bottom:4px; line-height:1.25;">
        ℹ️ Alap kozmetikák <strong>1 labdára</strong> tehetők, de a <strong>🔗 2× / 3×</strong> jelű Szezon 2 skinek és effektek egyszerre akár <strong>2–3 labdatípuson és több labdán</strong> is aktívak lehetnek!
      </div>`;

      for (const typeKey of ownedBallTypes) {
        const cnt = this.ballTypes[typeKey].count;
        const lbl = armoryLabels[typeKey] || { one: this.ballTypes[typeKey].name, many: this.ballTypes[typeKey].name };
        const typeDisplay = cnt > 1 ? lbl.many : lbl.one;
        const curEquip = (this.ballTypeEquips && this.ballTypeEquips[typeKey]) || { skinId: 'default', effectId: 'none', breakEffectId: 'none' };

        const formatMultiNote = (cosId, propName, maxEq) => {
          if (!this.ballTypeEquips) return '';
          const usedBy = Object.keys(this.ballTypeEquips)
            .filter(ok => ok !== typeKey && this.ballTypeEquips[ok] && this.ballTypeEquips[ok][propName] === cosId);
          if (maxEq > 1) {
            return usedBy.length > 0 ? ` [${usedBy.length}/${maxEq} másikon]` : ` [🔗 ${maxEq}×]`;
          }
          if (usedBy.length > 0) {
            const otherLbl = armoryLabels[usedBy[0]] ? armoryLabels[usedBy[0]].one : usedBy[0];
            return ` (${otherLbl}-n van)`;
          }
          return '';
        };

        const skinOptions = allSkins.map(s => {
          const sel = (s.id === curEquip.skinId) ? 'selected' : '';
          const note = s.id !== 'default' ? formatMultiNote(s.id, 'skinId', s.maxEquip || 1) : '';
          return `<option value="${s.id}" ${sel}>${s.name}${note}</option>`;
        }).join('');

        const effectOptions = allEffects.map(fx => {
          const sel = (fx.id === curEquip.effectId) ? 'selected' : '';
          const note = fx.id !== 'none' ? formatMultiNote(fx.id, 'effectId', fx.maxEquip || 1) : '';
          return `<option value="${fx.id}" ${sel}>${fx.name}${note}</option>`;
        }).join('');

        const breakEffectOptions = allBreakEffects.map(bfx => {
          const sel = (bfx.id === (curEquip.breakEffectId || 'none')) ? 'selected' : '';
          const note = bfx.id !== 'none' ? formatMultiNote(bfx.id, 'breakEffectId', bfx.maxEquip || 1) : '';
          return `<option value="${bfx.id}" ${sel}>${bfx.name}${note}</option>`;
        }).join('');

        const visSlots = this.getMaxVisualCosmeticSlotsForEquip(curEquip);
        armoryHtml += `
          <div class="armory-ball-card">
            <div class="armory-ball-header">
              <span class="armory-ball-title"><span class="ball-dot ball-icon-${typeKey}"></span> ${typeDisplay} (${cnt}x)</span>
              <span class="armory-ball-sub">${visSlots > 1 ? `akár ${visSlots} db-on` : '1 db-on'}</span>
            </div>
            <div class="armory-select-row">
              <label>Skin:</label>
              <select class="armory-select" data-ball-type="${typeKey}" data-cosmetic-type="skin">
                ${skinOptions}
              </select>
            </div>
            <div class="armory-select-row">
              <label>Effekt:</label>
              <select class="armory-select" data-ball-type="${typeKey}" data-cosmetic-type="effect">
                ${effectOptions}
              </select>
            </div>
            <div class="armory-select-row">
              <label>Törés:</label>
              <select class="armory-select" data-ball-type="${typeKey}" data-cosmetic-type="break_effect">
                ${breakEffectOptions}
              </select>
            </div>
          </div>
        `;
      }
    }

    for (const suffix of ['-pc', '-mobile']) {
      const el = document.getElementById(`bp-armory-container${suffix}`);
      if (el) {
        el.innerHTML = armoryHtml;
        el.querySelectorAll('.armory-select').forEach(sel => {
          sel.addEventListener('change', () => {
            const ballType = sel.getAttribute('data-ball-type');
            const type = sel.getAttribute('data-cosmetic-type');
            this.equipCosmeticToBallType(ballType, type, sel.value);
          });
        });
      }
    }
  }

  equipCosmeticToBallType(typeKey, type, cosmeticId) {
    if (!this.ballTypeEquips) this.ballTypeEquips = {};
    if (!this.ballTypeEquips[typeKey]) {
      this.ballTypeEquips[typeKey] = { skinId: 'default', effectId: 'none', breakEffectId: 'none' };
    }
    const labelMap = {
      normal: 'Normál labda',
      speedy: 'Speedy labda',
      heavy: 'Heavy labda',
      smasher: 'Smasher labda',
      poison: 'Poison labda',
      coin: 'Coin labda',
      rocket: 'Rocket labda',
      ghost: 'Ghost labda',
      multiply: 'Multiply labda',
      symbiot: 'Symbiot labda'
    };
    const friendly = labelMap[typeKey] || typeKey;

    const enforceMaxEquip = (kind, prop, emptyVal, id) => {
      const maxEq = this.getCosmeticMaxEquip(kind, id);
      if (id !== emptyVal) {
        const others = Object.keys(this.ballTypeEquips)
          .filter(ok => ok !== typeKey && this.ballTypeEquips[ok] && this.ballTypeEquips[ok][prop] === id);
        while (others.length >= maxEq) {
          const removeKey = others.shift();
          this.ballTypeEquips[removeKey][prop] = emptyVal;
        }
      }
      this.ballTypeEquips[typeKey][prop] = id;
      const activeCnt = id === emptyVal ? 0 : Object.keys(this.ballTypeEquips)
        .filter(ok => this.ballTypeEquips[ok] && this.ballTypeEquips[ok][prop] === id).length;
      return { maxEq, activeCnt };
    };

    if (type === 'skin') {
      const info = enforceMaxEquip('skin', 'skinId', 'default', cosmeticId);
      const capTxt = info.maxEq > 1 ? `${info.activeCnt}/${info.maxEq} típuson aktív` : '1 db-on aktív';
      this.showToast(`🎨 ${friendly} skin frissítve (${capTxt})!`, 2400);
    } else if (type === 'effect') {
      const info = enforceMaxEquip('effect', 'effectId', 'none', cosmeticId);
      const capTxt = info.maxEq > 1 ? `${info.activeCnt}/${info.maxEq} típuson aktív` : '1 db-on aktív';
      this.showToast(`✨ ${friendly} effekt beállítva (${capTxt})!`, 2400);
    } else if (type === 'break_effect') {
      const info = enforceMaxEquip('break_effect', 'breakEffectId', 'none', cosmeticId);
      const capTxt = info.maxEq > 1 ? `${info.activeCnt}/${info.maxEq} típuson aktív` : '1 db-on aktív';
      this.showToast(`💥 ${friendly} törés effekt beállítva (${capTxt})!`, 2400);
    }
    if (window.soundEngine) window.soundEngine.playCosmeticEquip();
    this.renderBattlePass();
    this.save();
  }

  claimBattlePassReward(stageNum, track) {
    const stage = BATTLE_PASS_STAGES.find(s => s.stage === stageNum);
    if (!stage) return;

    if (track === 'free') {
      if (!stage.free || this.battlePassClaimedFree[stageNum]) return;
      if (this.totalBricksDestroyed < stage.bricks) return;
      this.battlePassClaimedFree[stageNum] = true;
      const rew = stage.free;
      if (rew.type === 'currency') {
        if (rew.currency === 'money') this.money += rew.amount;
        if (rew.currency === 'bb') this.bb += rew.amount;
        if (rew.currency === 'bt') this.bossTokens += rew.amount;
        if (rew.currency === 'bb_bt') {
          this.bb += (rew.bb || 0);
          this.bossTokens += (rew.bt || 0);
        }
        this.showToast(`🎁 <strong>Jutalom átvéve:</strong> ${rew.name}!`, 3500);
      } else {
        this.showToast(`🎉 <strong>Új Kozmetika Feloldva:</strong> ${rew.name}! Húzd rá bármelyik labdádra a Labda Skinek fülön!`, 4500);
      }
    } else if (track === 'paid') {
      // A Prémium Battle Pass sáv semmilyen módon nem aktiválható / nem vehető át!
      return;
    }

    if (window.soundEngine) window.soundEngine.playCoin();
    this.updateHUD();
    this.renderBattlePass();
    this.save();
    this.syncWalletChangeNow(true);
    if (this.cloud) this.cloud.saveToCloud(false);
  }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.game = new IdleBreakoutGame();
  window.game.init();
});
