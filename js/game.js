/**
 * Idle Breakout - Extended Arcade Edition
 * BB Upgrade System, 6 Distinct Ball Types, Redesigned Bosses (1-35),
 * All Power-Ups (incl. Gold Boss, Ball Army, Auto Clicker, Discount, QTM, Free Upgrade),
 * Background Tab & Offline Progression.
 */

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

// Nem fejleszthető Power-upok (elkülönítve megjelenítve a POWERUP UPGRADES menüben)
const NON_UPGRADABLE_POWERUPS = [
  {
    key: 'gold_boss',
    icon: '👑',
    name: 'Gold Boss',
    rarityBadge: '2.4 esély (~17%)',
    desc: 'A következő Boss blokkot Gold Boss-szá alakítja, amely dupla ($) pénzt ad sebzéskor és legyőzéskor is.',
    statusFn: (game) => game.nextBossIsGold ? '✨ BEÉLESÍTVE: A következő Boss GOLD BOSS lesz!' : 'Blokktöréskor véletlenszerűen eshet.'
  },
  {
    key: 'free_upgrade',
    icon: '🎁',
    name: 'Free Upgrade',
    rarityBadge: '0.70 esély (~5%)',
    desc: 'Véletlenszerűen +1 szintet ad egy még nem kimaxolt Power-up fejlesztésre (ha mind maxos: +5 BB).',
    statusFn: () => 'Azonnali jutalom eséskor.'
  },
  {
    key: 'gold_level',
    icon: '🌟',
    name: 'GOLD LEVEL',
    rarityBadge: '0.08 esély (~0.6%) • Rebirth 15+',
    isGoldSpecial: true,
    desc: 'Csak Rebirth 15 fölött van rá esély (~0,6% esély power-up dobásból)! A következő normál pálya minden egyes blokkja 500–2 000 HP-s aranyblokk lesz (20x pénz), az aranyblokkok ⭐ BB-t és 👑 BT-t dobhatnak, teljesítéskor pedig garantált +15 ⭐ BB és +25 👑 BT a jutalom!',
    statusFn: (game) => {
      if (game.isGoldLevelActive) return '🌟 JELENLEG AKTÍV A PÁLYÁN (20x pénz + BB & BT)!';
      if (game.nextLevelIsGold) return '🌟 BEÉLESÍTVE: A következő normál pálya GOLD LEVEL lesz!';
      if (game.rebirthCount <= 15) return `🔒 ZÁROLVA: Rebirth 15 fölött érhető el (jelenleg: ${game.rebirthCount}/16)`;
      return '✅ Feloldva (Rebirth > 15): 0,08 esély (~0,6% a power-up esésekből)!';
    }
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
  skin_p_godlight: '#fef08a'
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

// 30 Stages Seasonal Breaker Pass Catalog
// Free Track: Every stage grants either an exclusive Cosmetic or a ⭐ BB + 👑 BT reward bundle!
// Free Track: Skins, Effects, Breaking Effects + BB & BT bundles on every intermediate stage.
// Paid Track: Exclusive Prémium reward on EVERY single stage (1-30) - cannot be activated or claimed.
const BATTLE_PASS_STAGES = [
  {
    stage: 1,
    bricks: 0,
    free: { type: 'skin', id: 'skin_emerald', name: 'Smaragd Normal Skin', color: '#10b981', desc: 'Smaragdzöld élénk aura és fény' },
    paid: { type: 'skin', id: 'skin_p_ruby', name: 'Királyi Rubin Skin', color: '#e11d48', desc: 'Ragyogó mélyvörös rubinfény' }
  },
  {
    stage: 2,
    bricks: 5000,
    free: { type: 'currency', currency: 'bb_bt', bb: 2, bt: 3, name: '+2 ⭐ BB & +3 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'skin', id: 'skin_p_obsidian', name: 'Obszidián Éj Skin', color: '#27272a', desc: 'Sötét vulkáni obszidián páncélzat' }
  },
  {
    stage: 3,
    bricks: 12000,
    free: { type: 'effect', id: 'fx_saturn', name: '🪐 Szaturnusz Gyűrű Effekt', desc: 'Döntött arany-kozmikus bolygógyűrű és keringő hold a labda körül!' },
    paid: { type: 'currency', currency: 'money', amount: 1500, name: '$1,500 Pénzbónusz', desc: 'Azonnali prémium tőkeinjekció' }
  },
  {
    stage: 4,
    bricks: 25000,
    free: { type: 'currency', currency: 'bb_bt', bb: 2, bt: 4, name: '+2 ⭐ BB & +4 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'skin', id: 'skin_p_matrix', name: 'Mátrix Kód Skin', color: '#22c55e', desc: 'Zöld digitális neon mátrixfény' }
  },
  {
    stage: 5,
    bricks: 45000,
    free: { type: 'break_effect', id: 'brk_explode', name: '💥 Blokk Robbanás Breaking Effekt', desc: 'A kiválasztott labdád által tört blokkok látványos tűzgömbbel és lökéshullámmal felrobbannak!' },
    paid: { type: 'skin', id: 'skin_p_solar', name: 'Napvihar Narancs Skin', color: '#f97316', desc: 'Tüzes napkitörés plazmaív' }
  },
  {
    stage: 6,
    bricks: 70000,
    free: { type: 'skin', id: 'skin_violet', name: 'Neon Ibolya Skin', color: '#8b5cf6', desc: 'Elektromos ibolya villámkorona' },
    paid: { type: 'currency', currency: 'bb', amount: 5, name: '+5 Black Brick (BB)', desc: 'Ritka prestige valuta csomag' }
  },
  {
    stage: 7,
    bricks: 105000,
    free: { type: 'currency', currency: 'bb_bt', bb: 3, bt: 5, name: '+3 ⭐ BB & +5 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'effect', id: 'fx_p_golddust', name: 'Aranypor Uszály Effekt', desc: 'Fényes keringő aranyporszemek' }
  },
  {
    stage: 8,
    bricks: 150000,
    free: { type: 'currency', currency: 'bb_bt', bb: 4, bt: 6, name: '+4 ⭐ BB & +6 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'money', amount: 25000, name: '$25,000 Pénzbónusz', desc: 'Haladó fejlesztési alap' }
  },
  {
    stage: 9,
    bricks: 210000,
    free: { type: 'currency', currency: 'bb_bt', bb: 4, bt: 7, name: '+4 ⭐ BB & +7 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'skin', id: 'skin_p_quantum', name: 'Kvantum Cián Skin', color: '#06b6d4', desc: 'Kibernetikus kvantumrezgés aura' }
  },
  {
    stage: 10,
    bricks: 290000,
    free: { type: 'skin', id: 'skin_gold', name: 'Arany Fényű Skin', color: '#f59e0b', desc: '24 karátos aranyfény és csillogás' },
    paid: { type: 'skin', id: 'skin_p_sapphire', name: 'Óceáni Zafír Skin', color: '#0284c7', desc: 'Kristálytiszta mélykék zafír ragyogás' }
  },
  {
    stage: 11,
    bricks: 390000,
    free: { type: 'currency', currency: 'bb_bt', bb: 5, bt: 8, name: '+5 ⭐ BB & +8 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'bt', amount: 2, name: '+2 Boss Token (BT)', desc: 'Prémium szintlépő tokenek' }
  },
  {
    stage: 12,
    bricks: 510000,
    free: { type: 'currency', currency: 'bb_bt', bb: 6, bt: 9, name: '+6 ⭐ BB & +9 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'skin', id: 'skin_p_chrome', name: 'Króm Acél Skin', color: '#94a3b8', desc: 'Tükörfényes folyékony fémburkolat' }
  },
  {
    stage: 13,
    bricks: 650000,
    free: { type: 'currency', currency: 'bb_bt', bb: 6, bt: 10, name: '+6 ⭐ BB & +10 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'bb', amount: 15, name: '+15 Black Brick (BB)', desc: 'Erőteljes BB erősítő csomag' }
  },
  {
    stage: 14,
    bricks: 820000,
    free: { type: 'effect', id: 'fx_flame', name: 'Tűzcsóva Aura Effekt', desc: 'Lobogó lángoló tűzuszály a normál labdán' },
    paid: { type: 'effect', id: 'fx_p_lightning', name: 'Plazma Villám Effekt', desc: 'Magasfeszültségű kék elektromos ív' }
  },
  {
    stage: 15,
    bricks: 1020000,
    free: { type: 'currency', currency: 'bb_bt', bb: 8, bt: 12, name: '+8 ⭐ BB & +12 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'money', amount: 250000, name: '$250,000 Pénzbónusz', desc: 'Nagy tétű aranytartalék' }
  },
  {
    stage: 16,
    bricks: 1250000,
    free: { type: 'currency', currency: 'bb_bt', bb: 8, bt: 14, name: '+8 ⭐ BB & +14 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'effect', id: 'fx_p_violetlightning', name: 'Ibolya Villám Effekt', desc: 'Pulzáló lila villámcsapás ív' }
  },
  {
    stage: 17,
    bricks: 1510000,
    free: { type: 'currency', currency: 'bb_bt', bb: 10, bt: 15, name: '+10 ⭐ BB & +15 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'bt', amount: 4, name: '+4 Boss Token (BT)', desc: 'Különleges boss token jutalom' }
  },
  {
    stage: 18,
    bricks: 1800000,
    free: { type: 'skin', id: 'skin_cyber', name: 'Cyber Punk Skin', color: '#ec4899', desc: 'Neon pink és ciánkék vibrálás és glitch' },
    paid: { type: 'skin', id: 'skin_p_nebula', name: 'Bíbor Nebula Skin', color: '#a855f7', desc: 'Kozmikus lila csillagköd örvény' }
  },
  {
    stage: 19,
    bricks: 2130000,
    free: { type: 'currency', currency: 'bb_bt', bb: 10, bt: 16, name: '+10 ⭐ BB & +16 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'bb', amount: 30, name: '+30 Black Brick (BB)', desc: 'Elit Black Brick támogatás' }
  },
  {
    stage: 20,
    bricks: 2490000,
    free: { type: 'currency', currency: 'bb_bt', bb: 12, bt: 18, name: '+12 ⭐ BB & +18 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'skin', id: 'skin_p_godlight', name: 'Mennyei Fény Skin', color: '#fef08a', desc: 'Ragyogó arany-fehér szakrális aura' }
  },
  {
    stage: 21,
    bricks: 2890000,
    free: { type: 'currency', currency: 'bb_bt', bb: 12, bt: 20, name: '+12 ⭐ BB & +20 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'money', amount: 2500000, name: '$2.5M Pénzbónusz', desc: 'Prémium milliomos csomag' }
  },
  {
    stage: 22,
    bricks: 3330000,
    free: { type: 'effect', id: 'fx_frost', name: 'Jégkristály Csillogás Effekt', desc: 'Fagyos kristályaura és csillogó jégszilánkok' },
    paid: { type: 'effect', id: 'fx_p_rings', name: 'Plazmagyűrűk Pulzálás Effekt', desc: 'Táguló zöld plazma energiahullámok' }
  },
  {
    stage: 23,
    bricks: 3810000,
    free: { type: 'currency', currency: 'bb_bt', bb: 14, bt: 22, name: '+14 ⭐ BB & +22 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'bt', amount: 6, name: '+6 Boss Token (BT)', desc: 'Mesterfokú Boss Token láda' }
  },
  {
    stage: 24,
    bricks: 4330000,
    free: { type: 'currency', currency: 'bb_bt', bb: 15, bt: 24, name: '+15 ⭐ BB & +24 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'bb', amount: 60, name: '+60 Black Brick (BB)', desc: 'Kiemelt prestige BB láda' }
  },
  {
    stage: 25,
    bricks: 4900000,
    free: { type: 'skin', id: 'skin_blood', name: 'Vérhold Vörös Skin', color: '#ef4444', desc: 'Mélyvérvörös napfogyatkozás aura' },
    paid: { type: 'skin', id: 'skin_p_dragon', name: 'Sárkánytűz Skin', color: '#15803d', desc: 'Izzó pikkelymintás magmaréteg' }
  },
  {
    stage: 26,
    bricks: 5520000,
    free: { type: 'currency', currency: 'bb_bt', bb: 16, bt: 25, name: '+16 ⭐ BB & +25 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'money', amount: 15000000, name: '$15M Pénzbónusz', desc: 'Titáni vagyon injekció' }
  },
  {
    stage: 27,
    bricks: 6190000,
    free: { type: 'currency', currency: 'bb_bt', bb: 18, bt: 28, name: '+18 ⭐ BB & +28 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'bt', amount: 10, name: '+10 Boss Token (BT)', desc: 'Legendás Boss Token készlet' }
  },
  {
    stage: 28,
    bricks: 6910000,
    free: { type: 'effect', id: 'fx_starlight', name: 'Csillagfény Szikrák Effekt', desc: 'Keringő fényes arany csillagpor uszály' },
    paid: { type: 'effect', id: 'fx_p_darkflame', name: 'Sötét Láng Mágia Effekt', desc: 'Démoni lila-fekete lángnyom' }
  },
  {
    stage: 29,
    bricks: 7690000,
    free: { type: 'currency', currency: 'bb_bt', bb: 20, bt: 30, name: '+20 ⭐ BB & +30 👑 BT', desc: 'Ingyenes BB + Boss Token jutalomcsomag' },
    paid: { type: 'currency', currency: 'bb', amount: 120, name: '+120 Black Brick (BB)', desc: 'Végső hajrá prémium BB tartalék' }
  },
  {
    stage: 30,
    bricks: 8500000,
    free: { type: 'effect', id: 'fx_cosmic_rare', name: '🌌 Kozmikus Szingularitás (RITKA)', isRare: true, desc: 'Fekete lyuk örvény, keringő csillagpor és téridő görbület!' },
    paid: { type: 'effect', id: 'fx_p_godcrown', name: '👑 Istenkirály Halo & Korona', desc: 'Keringő aranymíves korona, szakrális glória és aranyfény!' }
  }
];

class IdleBreakoutGame {
  constructor() {
    // Új mentési kulcs (v3): a régi v2-es mentések egyszer, most automatikusan törlődnek mindenkinél,
    // de minden későbbi frissítésnél (amíg v3 marad) a játékosok haladása megmarad!
    this.SAVE_KEY = 'idle_breakout_classic_v3';
    try {
      localStorage.removeItem('idle_breakout_classic_v2');
    } catch (e) {}

    // Core Game State
    this.money = 0;
    this.level = 1;
    this.bb = 0; // Breakout Badges
    this.bossTokens = 0; // 1 Boss kill = +1 Boss Token; 10 Boss Token = 1 BB
    this.BOSS_TOKEN_COST = 10;
    this.MAX_MULTIPLY_BALLS = 7;
    this.MAX_GHOST_BALLS = 10;
    this.MAX_ROCKET_BALLS = 5;
    this.MAX_SYMBIOT_BALLS = 1;
    this.MAX_COIN_BALLS = 20;
    this.rebirthCount = 0;
    this.rebirthMultiplier = 1.0;
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

    // Battle Pass System (30 Stages, Free Track + Paid Track 4999 Ft - Prémium sáv szigorúan zárolva!)
    this.totalBricksDestroyed = 0;
    this.battlePassClaimedFree = {};
    this.battlePassClaimedPaid = {};
    this.normalBallEquips = {}; // legacy save migration
    this.ballTypeEquips = {};   // ballTypeKey -> { skinId, effectId }
    this.activeBPTab = 'stages'; // 'stages' | 'armory'
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
    this.bgWorker = null;
    this.bgInterval = null;
    this.isResetting = false;
    this.dec24TimerInterval = null;
    this.activeTooltipKind = null;
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
    if (lvl > 400) {
      const r = Math.random();
      if (r < 0.05) {
        return 5_000_000; // 1 a 20-ból (5%): 5 milliós Boss!
      }
      if (r < 0.75) {
        // 70% esély: 500.000 – 1.000.000 HP
        return Math.round((500_000 + Math.random() * 500_000) / 1000) * 1000;
      }
      // 25% esély: 1.000.000 – 1.950.000 HP (2 millió alatti)
      return Math.round((1_000_000 + Math.random() * 950_000) / 1000) * 1000;
    }
    if (BOSS_HP_TABLE[lvl] !== undefined) {
      return BOSS_HP_TABLE[lvl];
    }
    if (lvl === 175) return 65000;
    if (lvl === 225) return 77500;
    if (lvl === 275) return 86250;
    if (lvl === 325) return 95000;
    if (lvl === 375) return 300000;
    if (lvl === 400) return 500000;
    return lvl * 40;
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
      this.activatePowerUp('gold_level_active', '🌟', 'GOLD LEVEL (20x $ + BB/BT)', '500–2000 HP, 20x pénz, aranyblokkokból BB/BT esély + teljesítéskor +15 BB & +25 BT!', { mode: 'rounds', rounds: 1 });
      if (!this.suppressAudioAndVisuals) {
        this.showToast('🌟 <strong>GOLD LEVEL INDUL!</strong> 500–2000 HP-s aranyblokkok: 20x pénz, BB/BT esés + teljesítéskor +15 ⭐ BB & +25 👑 BT!', 5000);
      }
    }

    const cols = Math.max(7, Math.min(11, Math.floor(arenaW / 60)));
    const rows = Math.max(9, Math.min(14, Math.floor(arenaH / 34)));

    const brickW = arenaW / cols;
    const brickH = arenaH / rows;
    this.gridCellW = brickW;
    this.gridCellH = brickH;
    const blockHp = lvl;
    const isGoldLevel = !!this.isGoldLevelActive;

    // Kizárólag a legalsó sor marad üresen (r < rows - 1), a labdák pozícióját nem kerüli ki!
    const activeRows = rows - 1;
    let idCounter = 0;

    for (let r = 0; r < activeRows; r++) {
      for (let c = 0; c < cols; c++) {
        const brickHp = isGoldLevel ? (500 + Math.floor(Math.random() * 1501)) : blockHp;
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
    if (this.suppressAudioAndVisuals || document.hidden) return;
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

  isPrimaryCosmeticBall(ball) {
    if (!ball || ball.isPiercing || ball.isSplitChild) return false;
    for (const candidate of this.balls) {
      if (!candidate.isPiercing && !candidate.isSplitChild && candidate.type === ball.type) {
        return candidate === ball;
      }
    }
    return false;
  }

  // --- Breaking Effect: Blokk Robbanás Animáció (Stage 5) ---
  spawnBreakingExplosion(cx, cy, color, isBoss = false) {
    if (this.suppressAudioAndVisuals || document.hidden) return;
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

    actualDmg = Math.min(brick.hp, Math.max(0.01, actualDmg));
    brick.hp -= actualDmg;
    if (brick.hp < 0.001) brick.hp = 0;
    brick.flash = 0.09;
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
      if (brick.isBoss && this.bossSparks.length < 30) {
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

      const hasExplodeBreakFx = !!(
        options.ball &&
        this.isPrimaryCosmeticBall(options.ball) &&
        this.ballTypeEquips?.[options.ball.type]?.breakEffectId === 'brk_explode'
      );

      if (hasExplodeBreakFx) {
        if (!silent && window.soundEngine) window.soundEngine.playExplosion();
        this.spawnBreakingExplosion(brick.x + brick.w / 2, brick.y + brick.h / 2, preHitColor, brick.isBoss);
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
          if (Math.random() < 0.15) {
            this.bossTokens += 1;
            goldWalletChanged = true;
            if (!silent) {
              this.addFloatingText('+1 👑 BT!', brick.x + brick.w / 2, brick.y + brick.h / 2 - 14, '#fbbf24');
            }
          }
          if (Math.random() < 0.07) {
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
        if (source !== 'piercing_special' && source !== 'shockwave' && source !== 'dot') {
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
        const goldClearBB = 15;
        const goldClearBT = 25;
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

    // Kiegyensúlyozott power-up esély-eloszlás:
    // - Erős bónuszok (2x Money, 2x Damage, Gold Boss, Shock Wave): mérsékelt 2.2 - 2.6 esély
    // - Hasznos ritkább bónuszok (Speed, Discount, Pierce, Auto Clicker, Free Upg): 0.70 - 0.95 esély
    // - Gold Level (csak Rebirth 15 fölött!): 0.08 esély (~0.6% power-up dobásból)
    const candidates = [
      { id: '2x_money',     weight: 2.2  },
      { id: '2x_dmg',       weight: 2.2  },
      { id: 'gold_boss',    weight: 2.4  },
      { id: 'shockwave',    weight: 2.6  },
      { id: 'discount',     weight: 0.95 },
      { id: 'piercing',     weight: 0.95 },
      { id: 'speed_boost',  weight: 0.90 },
      { id: 'auto_clicker', weight: 0.85 },
      { id: 'free_upgrade', weight: 0.70 },
      { id: 'gold_level',   weight: 0.08 }
    ].filter(c => {
      if (c.id === 'gold_boss' && this.nextBossIsGold) return false;
      if (c.id === 'gold_level' && (this.rebirthCount <= 15 || this.nextLevelIsGold || this.isGoldLevelActive)) return false;
      if (c.id === 'auto_clicker' && this.bbUpgrades.autoClicker >= 1) return false;
      const active = this.activePowerUps[c.id];
      if (active && (active.mode === 'until_rebirth' || active.mode === 'forever') && c.id !== 'piercing') return false;
      return true;
    });

    if (candidates.length === 0) return;

    const totalWeight = candidates.reduce((acc, c) => acc + c.weight, 0);
    let pick = Math.random() * totalWeight;
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
    return Math.pow(1.15, Math.max(0, Number(rebirthCount) || 0));
  }

  getPowerUpDropChancePercent(rebirthCount = this.rebirthCount) {
    return (100 / 800) + (Math.max(0, Number(rebirthCount) || 0) * 0.005);
  }

  getRequiredRebirthLevel() {
    return (this.rebirthCount + 1) * 25;
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
    if (this.suppressAudioAndVisuals || document.hidden) return;
    this.screenShake = Math.min(cap, Math.max(this.screenShake || 0, intensity));
  }

  addFloatingText(txt, x, y, color = '#2cd64e') {
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

  // --- Core Simulation Step ---
  stepSimulation(dt, isBackground = false) {
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
    this.heartbeatTimer += dt;
    if (this.heartbeatTimer >= 6.0) {
      this.heartbeatTimer = 0;
      this.broadcastMyStatus();
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

    if (elapsedSec > maxRealSimSec && this.getTotalBalls() > 0) {
      this.applyOfflineProgress(elapsedSec - maxRealSimSec, false);
    }

    this.renderPowerUpsHUD();
    this.updateHUD();
  }

  // --- Offline Progress (when closed) ---
  applyOfflineProgress(seconds, showToast = true) {
    const cappedSec = Math.min(seconds, 86400);
    if (cappedSec < 5 || this.getTotalBalls() === 0) return;

    const startMoney = this.money;
    const startLevel = this.level;

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

      while (remainingDamage > 0) {
        const isBoss = this.isBossLevel(this.level);
        const levelTotalHp = isBoss ? this.getBossHpForLevel(this.level) : (this.level * 85);
        const dmgOnLevel = Math.min(remainingDamage, levelTotalHp);
        const rewardMult = isBoss ? this.getBossRewardPerDamage(this.level) : 1;

        earned += dmgOnLevel * rewardMult * this.rebirthMultiplier;
        remainingDamage -= dmgOnLevel;

        if (dmgOnLevel >= levelTotalHp) {
          if (isBoss) {
            earned += this.getBossKillBonus(this.level) * this.rebirthMultiplier;
            this.bossTokens += 1;
          }
          this.level++;
        } else {
          break;
        }
      }

      this.money += earned;
      this.generateLevel(this.level);
    }

    this.updateHUD();
    this.renderLeaderboard();
    this.save();
    this.syncWalletChangeNow(true);

    if (showToast) {
      const gainedMoney = Math.floor(this.money - startMoney);
      const gainedLevels = this.level - startLevel;
      if (gainedMoney > 0 || gainedLevels > 0) {
        const lvlText = gainedLevels > 0 ? ` | +${gainedLevels} szint` : '';
        this.showToast(`⏱️ <strong>OFFLINE HALADÁS (${this.formatDuration(cappedSec)}):</strong> <span style="color:#2cd64e;">+$${gainedMoney.toLocaleString()}</span>${lvlText}`, 6500);
      }
    }
  }

  formatDuration(sec) {
    const s = Math.floor(sec);
    if (s < 60) return `${s} mp`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} perc`;
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return remM > 0 ? `${h} óra ${remM} perc` : `${h} óra`;
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
        this.ctx.strokeStyle = b.isGoldBrick ? '#78350f' : '#000000';
        this.ctx.strokeRect(b.x, b.y, b.w, b.h);

        const hpNum = Math.ceil(b.hp);
        const hpStr = hpNum.toString();
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

    // 4. Draw Balls (All 9 types visually distinct + Pierce Ball + Universal Cosmetics)
    const cosmeticAppliedForType = {};
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
      if (!ball.isSplitChild && !cosmeticAppliedForType[ball.type]) {
        cosmeticAppliedForType[ball.type] = true;
        const eq = this.ballTypeEquips && this.ballTypeEquips[ball.type];
        if (eq && ((eq.skinId && eq.skinId !== 'default') || (eq.effectId && eq.effectId !== 'none') || (eq.breakEffectId && eq.breakEffectId !== 'none'))) {
          activeEquip = eq;
        }
      }

      if (activeEquip && activeEquip.effectId && activeEquip.effectId !== 'none') {
        this.drawCosmeticEffectLayer(this.ctx, ball, activeEquip.effectId);
      }
      if (activeEquip && activeEquip.breakEffectId === 'brk_explode') {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius + 3.5 + Math.sin(this.animTime * 11) * 1.2, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(249, 115, 22, 0.72)';
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

    document.title = `LVL ${this.level} | $${this.formatNumber(Math.floor(this.money))} - Idle Breakout`;
  }

  // --- Boss Token Exchange (10 Boss Token ➔ +1 BB) ---
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
  }

  formatNumber(num) {
    if (num === 0) return '0';
    if (num < 1000) return Math.round(num).toString();
    if (num < 1_000_000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1_000_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }

  formatApproxMoney(num) {
    const v = Math.max(0, Number(num) || 0);
    if (v === 0) return '~$0';
    if (v < 1000) {
      const rounded = v < 100 ? Math.round(v / 10) * 10 : Math.round(v / 50) * 50;
      return `~$${Math.max(10, rounded)}`;
    }
    if (v < 1_000_000) {
      const k = v / 1000;
      return `~$${v >= 100_000 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, '')}K`;
    }
    if (v < 1_000_000_000) {
      const m = v / 1_000_000;
      return `~$${v >= 100_000_000 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (v < 1_000_000_000_000) {
      const b = v / 1_000_000_000;
      return `~$${v >= 100_000_000_000 ? Math.round(b) : b.toFixed(1).replace(/\.0$/, '')}B`;
    }
    return `~$${(v / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '')}T`;
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

  // --- $ Upgrades Menu Rendering (Balls + Click Power + Pierce Ball $ Speed Upgrade) ---
  renderUpgradesMenu() {
    this.updateBossTokenExchangeUI();
    const upgMoney = document.getElementById('upg-modal-money');
    if (upgMoney) upgMoney.textContent = Math.floor(this.money).toLocaleString();
    const container = document.getElementById('upgrades-content-grid');
    if (!container) return;
    container.innerHTML = '';

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
      `;

      container.appendChild(col);

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

        <button class="ball-upgrade-btn ${pClass}" id="btn-upg-pierce-spd" ${pierceMaxed ? 'disabled' : ''}>
          <div class="btn-top-info">${pierceMaxed ? `${curMult}x (LVL ${this.MAX_PIERCE_SPEED_LEVEL})` : `${curMult}x >> ${nextMult}x`}</div>
          <div class="btn-cost-bottom">${pierceMaxed ? 'MAX' : (pirateActive ? 'FREE!' : '$' + this.formatNumber(pCost))}</div>
        </button>
      `;
      container.appendChild(pierceCol);
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

      <button class="ball-upgrade-btn ${clickClass}" id="btn-upg-click" ${clickMaxed ? 'disabled' : ''}>
        <div class="btn-top-info">${clickMaxed ? `Click ${this.MAX_CLICK_LEVEL}/${this.MAX_CLICK_LEVEL}` : `Click ${this.clickUpgradeLevel}/${this.MAX_CLICK_LEVEL} (+100%)`}</div>
        <div class="btn-cost-bottom">${clickMaxed ? 'MAX' : (pirateActive ? 'FREE!' : '$' + this.formatNumber(clickCost))}</div>
      </button>
    `;

    container.appendChild(clickCol);
    if (!clickMaxed) clickCol.querySelector('#btn-upg-click').addEventListener('click', () => this.upgradeClick());
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
          <div class="bb-phase-row next-phase"><strong>Hogyan szerezhető?</strong> Rebirth-tel (+1 BB), 10 Boss Token beváltásával (10 BT ➔ 1 BB), vagy Lvl 5 Quick Time Money coinokkal.</div>
          <div class="bb-phase-row"><strong>Mire jó?</strong> Tartós kattintás- és power-up fejlesztésekre a <strong>⚡ POWERUP UPGRADES</strong> menüben (1, 3, 5, 7, 10 BB).</div>
        `
      },
      bt: {
        title: '👑 Boss Token (BT)',
        body: `
          <div class="bb-phase-row unlocked"><strong>Mi ez?</strong> Különleges Boss valuta, amely <strong>Rebirth után is megmarad</strong>!</div>
          <div class="bb-phase-row next-phase"><strong>Hogyan szerezhető?</strong> Minden Boss blokk legyőzése után automatikusan kapsz <strong>+1 BT</strong>-t.</div>
          <div class="bb-phase-row"><strong>Mire jó?</strong> Beváltóható BB-re (<strong>10 BT ➔ 1 BB</strong>), illetve kimaxolt labdák (Poison, Ghost, Multiply, Rocket) különleges képességeinek fejlesztésére az <strong>UPGRADES</strong> menüben!</div>
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

  // --- POWERUP UPGRADES (BB) Modal Rendering ---
  renderPowerUpUpgradesModal() {
    const balanceEl = document.getElementById('bb-modal-balance');
    if (balanceEl) balanceEl.textContent = this.bb.toLocaleString();
    const bbMoney = document.getElementById('bb-modal-money');
    if (bbMoney) bbMoney.textContent = Math.floor(this.money).toLocaleString();
    this.updateBossTokenExchangeUI();

    const grid = document.getElementById('bb-upgrades-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (const item of BB_UPGRADE_CATALOG) {
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

      const btnClass = isMax
        ? 'bb-buy-btn maxed-btn'
        : (canAfford ? 'bb-buy-btn affordable' : 'bb-buy-btn');
      const btnText = isMax ? 'MAX SZINT' : `FEJLESZTÉS (${cost} BB)`;

      card.innerHTML = `
        <div>
          <div class="bb-card-header">
            <div class="bb-card-title"><span>${item.icon}</span><span>${item.name}</span></div>
            <div class="bb-card-lvl-tag">LVL ${curLvl}/5</div>
          </div>
          <div class="bb-pips-row" style="margin: 6px 0;">${pipsHtml}</div>
          <div class="bb-card-desc">${currentDesc}</div>
          <div style="margin-top: 6px;">${nextHtml}</div>
        </div>
        <button class="${btnClass}" id="btn-bb-upg-${item.key}" ${(!canAfford || isMax) ? 'disabled' : ''}>${btnText}</button>
      `;

      // Hover események az összes fázis megjelenítéséhez (Phase 1..5)
      card.addEventListener('mouseenter', (e) => this.showBBPhaseTooltip(item, curLvl, e));
      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 980 && window.innerHeight > 540) {
          this.positionBBPhaseTooltip(e);
        }
      });
      card.addEventListener('mouseleave', () => {
        if (window.innerWidth > 980 && window.innerHeight > 540) {
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

    // Elkülönített rész: nem fejleszthető Power-upok (Gold Boss, Free Upgrade, GOLD LEVEL)
    const nonUpgGrid = document.getElementById('bb-nonupgradable-grid');
    if (nonUpgGrid) {
      nonUpgGrid.innerHTML = '';
      for (const item of NON_UPGRADABLE_POWERUPS) {
        const card = document.createElement('div');
        card.className = `bb-upgrade-card non-upgradable-card ${item.isGoldSpecial ? 'gold-level-card' : ''}`;
        const statusText = item.statusFn ? item.statusFn(this) : '';
        const isLockedGold = item.key === 'gold_level' && this.rebirthCount <= 15;

        card.innerHTML = `
          <div>
            <div class="bb-card-header">
              <div class="bb-card-title"><span>${item.icon}</span><span>${item.name}</span></div>
              <div class="bb-nonupg-tag">NEM FEJLESZTHETŐ</div>
            </div>
            <div class="bb-nonupg-rarity">🎲 ${item.rarityBadge}</div>
            <div class="bb-card-desc">${item.desc}</div>
          </div>
          <div class="bb-nonupg-status ${isLockedGold ? 'locked-status' : ''}">${statusText}</div>
        `;
        nonUpgGrid.appendChild(card);
      }
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
        upgradesModal.classList.add('open');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }

    if (closeUpgradesBtn && upgradesModal) {
      closeUpgradesBtn.addEventListener('click', () => {
        this.hideBBPhaseTooltip();
        upgradesModal.classList.remove('open');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }

    // Power-Up Upgrades (BB) Modal
    const bbUpgradesBtn = document.getElementById('btn-open-powerup-upgrades');
    const bbUpgradesModal = document.getElementById('powerup-upgrades-modal');
    const closeBBUpgradesBtn = document.getElementById('btn-close-powerup-upgrades');

    if (bbUpgradesBtn && bbUpgradesModal) {
      bbUpgradesBtn.addEventListener('click', () => {
        this.renderPowerUpUpgradesModal();
        bbUpgradesModal.classList.add('open');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }

    if (closeBBUpgradesBtn && bbUpgradesModal) {
      closeBBUpgradesBtn.addEventListener('click', () => {
        this.hideBBPhaseTooltip();
        bbUpgradesModal.classList.remove('open');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
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

        if (confirmRebirthBtn) {
          confirmRebirthBtn.disabled = !canDo;
          confirmRebirthBtn.textContent = canDo
            ? 'ÚJJÁSZÜLETÉS MOST'
            : `ZÁROLVA (${this.level}/${reqLvl})`;
        }
        if (cancelRebirthBtn) {
          cancelRebirthBtn.textContent = canDo ? 'MÉGSE' : 'BEZÁRÁS';
        }

        rebirthModal.classList.add('open');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }

    if (confirmRebirthBtn && rebirthModal) {
      confirmRebirthBtn.addEventListener('click', () => {
        rebirthModal.classList.remove('open');
        this.executeRebirth();
      });
    }

    if (cancelRebirthBtn && rebirthModal) {
      cancelRebirthBtn.addEventListener('click', () => {
        rebirthModal.classList.remove('open');
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

    // Factory Reset
    const settingsBtn = document.getElementById('btn-settings');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        if (confirm('Biztosan újraindítod a játékot elölről (Factory Reset)?')) {
          this.isResetting = true;
          if (this.bgWorker) this.bgWorker.terminate();
          if (this.bgInterval) clearInterval(this.bgInterval);
          localStorage.removeItem(this.SAVE_KEY);
          window.location.reload();
        }
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
        lbModal.classList.add('open');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }
    const closeLb = () => {
      this.hideBBPhaseTooltip();
      if (lbModal) lbModal.classList.remove('open');
    };
    if (closeLbBtn) closeLbBtn.addEventListener('click', closeLb);
    if (closeLbFooter) closeLbFooter.addEventListener('click', closeLb);

    const openBpBtn = document.getElementById('btn-open-battlepass');
    const closeBpBtn = document.getElementById('btn-close-battlepass');
    const closeBpFooter = document.getElementById('btn-close-battlepass-footer');
    const bpModal = document.getElementById('battlepass-modal');

    if (openBpBtn && bpModal) {
      openBpBtn.addEventListener('click', () => {
        this.renderBattlePass();
        bpModal.classList.add('open');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }
    const closeBp = () => {
      this.hideBBPhaseTooltip();
      if (bpModal) bpModal.classList.remove('open');
    };
    if (closeBpBtn) closeBpBtn.addEventListener('click', closeBp);
    if (closeBpFooter) closeBpFooter.addEventListener('click', closeBp);

    // 1-Tap Mobile Switchers between Leaderboard & Battle Pass modals
    const switchLbToBp = document.getElementById('btn-switch-lb-to-bp');
    const switchBpToLb = document.getElementById('btn-switch-bp-to-lb');
    if (switchLbToBp && lbModal && bpModal) {
      switchLbToBp.addEventListener('click', () => {
        this.hideBBPhaseTooltip();
        lbModal.classList.remove('open');
        this.renderBattlePass();
        bpModal.classList.add('open');
        if (window.soundEngine) window.soundEngine.playClickHit();
      });
    }
    if (switchBpToLb && lbModal && bpModal) {
      switchBpToLb.addEventListener('click', () => {
        this.hideBBPhaseTooltip();
        bpModal.classList.remove('open');
        this.renderLeaderboard();
        lbModal.classList.add('open');
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
      const modal = document.getElementById('auth-modal');
      if (this.cloud) {
        this.cloud.clearError();
        this.cloud.hideDeleteConfirm();
        if (!this.cloud.currentUser && preferRegister) {
          this.cloud.switchAuthTab('register');
        }
        this.cloud.updateAuthUI();
      }
      if (modal) modal.classList.add('open');
      if (window.soundEngine) window.soundEngine.playClickHit();
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
      : (this.cloud && this.cloud.currentUser ? this.cloud.currentUser.uid : null);

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
    if (!data) return;
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
        return;
      }
    }
    this.applySaveData(data, { isLiveReload: false, ownerUid: data.saveOwnerUid || null });
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
      }

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
      this.clickUpgradeLevel = Math.min(this.MAX_CLICK_LEVEL, data.clickUpgradeLevel ?? 1);
      this.clickPower = this.clickUpgradeLevel;
      this.pierceSpeedUpgradeLevel = Math.min(this.MAX_PIERCE_SPEED_LEVEL, data.pierceSpeedUpgradeLevel ?? 0);
      this.coinBtHitCounter = Math.max(0, Number(data.coinBtHitCounter) || 0);
      this.coinBbHitCounter = Math.max(0, Number(data.coinBbHitCounter) || 0);
      this.nextBossIsGold = !!data.nextBossIsGold;
      this.nextLevelIsGold = !!data.nextLevelIsGold;
      this.isGoldLevelActive = !!data.isGoldLevelActive;

      this.totalBricksDestroyed = data.totalBricksDestroyed ?? 0;
      // A Prémium Battle Pass nem aktiválható mentésből sem: mindig zárolva marad!
      this.battlePassClaimedPaid = {};
      if (data.battlePassClaimedFree) this.battlePassClaimedFree = { ...data.battlePassClaimedFree };
      if (data.ballTypeEquips && typeof data.ballTypeEquips === 'object') {
        const unlocked = this.getUnlockedCosmetics();
        const usedSkins = new Set();
        const usedEffects = new Set();
        const usedBreakEffects = new Set();
        for (const tKey of Object.keys(data.ballTypeEquips)) {
          if (!this.ballTypes[tKey]) continue;
          const eq = data.ballTypeEquips[tKey] || {};
          let sId = (eq.skinId && unlocked.skins.has(eq.skinId) && !usedSkins.has(eq.skinId)) ? eq.skinId : 'default';
          let eId = (eq.effectId && unlocked.effects.has(eq.effectId) && !usedEffects.has(eq.effectId)) ? eq.effectId : 'none';
          let bId = (eq.breakEffectId && unlocked.breakEffects.has(eq.breakEffectId) && !usedBreakEffects.has(eq.breakEffectId)) ? eq.breakEffectId : 'none';
          if (sId !== 'default') usedSkins.add(sId);
          if (eId !== 'none') usedEffects.add(eId);
          if (bId !== 'none') usedBreakEffects.add(bId);
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
    } catch (e) {
      console.error('Load failed:', e);
    }
  }

  resetToFreshGuestState(refreshUI = true) {
    const now = Date.now();
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

                let keepReb = dReb;
                let keepLvl = dLvl;
                let keepBrk = dBrk;
                let keepMoney = dMoney ?? (existing ? existing.money ?? null : null);
                let keepBb = dBb ?? (existing ? existing.bb ?? null : null);
                let keepBt = dBt ?? (existing ? existing.bt ?? null : null);
                let keepBpStage = dBpStage ?? (existing ? existing.bpStage ?? null : null);
                if (existing) {
                  const exReb = Math.max(0, Number(existing.rebirths) || 0);
                  const exLvl = Math.max(1, Number(existing.level) || 1);
                  const exBrk = Math.max(0, Number(existing.bricks) || 0);
                  const exTs = Number(existing.ts) || 0;
                  const exAdminTs = Number(existing.adminUpdatedAt) || 0;
                  const incomingHigher = (dReb > exReb) || (dReb === exReb && dLvl > exLvl);
                  const existingNewerAdmin = exAdminTs > 0 && dTs < exAdminTs + 15000;
                  const existingStrictlyHigherAndFresher = (exReb > dReb || (exReb === dReb && exLvl > dLvl)) && dTs < exTs - 60000;

                  if (existingNewerAdmin || (!incomingHigher && existingStrictlyHigherAndFresher)) {
                    keepReb = exReb;
                    keepLvl = exLvl;
                    keepBrk = exBrk;
                    keepMoney = existing.money ?? keepMoney;
                    keepBb = existing.bb ?? keepBb;
                    keepBt = existing.bt ?? keepBt;
                    keepBpStage = existing.bpStage ?? keepBpStage;
                  }
                }

                const incomingName = (data.name || '').trim().slice(0, 12);
                const prevName = (existing && existing.name || '').trim().slice(0, 12);
                const resolvedName = (incomingName && incomingName !== 'Játékos')
                  ? incomingName
                  : ((prevName && prevName !== 'Játékos') ? prevName : (incomingName || prevName || 'Játékos'));

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
                  ts: Math.min(nowMs, Math.max(dTs, (existing && existing.ts) || 0)),
                  adminUpdatedAt: (existing && existing.adminUpdatedAt) || 0
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
    for (const suffix of ['-pc', '-mobile']) {
      const el = document.getElementById(`lb-conn-status${suffix}`);
      if (el) {
        if (isConnected) {
          el.classList.add('connected');
          el.innerHTML = '<span class="conn-dot"></span> ÉLŐ MULTIPLAYER';
        } else {
          el.classList.remove('connected');
          el.innerHTML = '<span class="conn-dot"></span> CSATLAKOZÁS...';
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
      customPlayers: []
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

    const playerCommands = {};
    if (raw.playerCommands && typeof raw.playerCommands === 'object') {
      const entries = [];
      for (const k of Object.keys(raw.playerCommands)) {
        const c = raw.playerCommands[k];
        if (c && typeof c === 'object' && c.cmdId) {
          const isNullGift = (c.rebirths === null || c.rebirths === undefined) && (c.level === null || c.level === undefined);
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
            rebirths: Math.max(0, Math.min(999999, Math.floor(Number(c.rebirths) || 0))),
            level: Math.max(1, Math.min(999999, Math.floor(Number(c.level) || 1))),
            addBB: cAddBB,
            addBT: cAddBT,
            addMoney: cAddMoney,
            issuedAt: Number(c.issuedAt) || 0
          }]);
        }
      }
      entries.sort((a, b) => (a[1].issuedAt || 0) - (b[1].issuedAt || 0));
      for (const [k, v] of entries.slice(-80)) {
        playerCommands[k] = v;
      }
    }

    giftEntries.sort((a, b) => (a[1].issuedAt || 0) - (b[1].issuedAt || 0));
    for (const [k, v] of giftEntries.slice(-80)) {
      currencyGifts[k] = v;
    }

    return {
      version: 2,
      updatedAt: Number(raw.updatedAt) || 0,
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
      customPlayers
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
      if (hasReloadCtx) {
        const alreadyInLoadedSave = saveCmdSet.has(cmd.cmdId) || (saveTs > 0 && saveTs >= (cmd.issuedAt || 0));
        if (alreadyInLoadedSave) continue;
      } else if ((this.appliedAdminCmdIds || []).includes(cmd.cmdId)) {
        continue;
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

  applyIncomingAdminRules(raw, source = 'remote') {
    if (!raw || typeof raw !== 'object') return;
    const incoming = this.normalizeAdminRules(raw);
    const curUpdated = (this.lbAdminRules && this.lbAdminRules.updatedAt) || 0;
    if (incoming.updatedAt > curUpdated) {
      this.lbAdminRules = incoming;
      this.saveAdminRulesLocally();
      this.processPendingAdminCommands();
      this.renderLeaderboard();
      const devModal = document.getElementById('dev-leaderboard-modal');
      if (devModal && devModal.classList.contains('open')) {
        this.renderDevLeaderboardPanel();
      }
    } else {
      this.processPendingAdminCommands();
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
      const rpOnline = (now - (rp.ts || 0)) < 25000;
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
          ts: Number(rp.ts) || 0,
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
      const rAdminTs = Number(rp.adminUpdatedAt) || 0;
      const exAdminTs = Number(existing.adminUpdatedAt) || 0;

      const adminWins = rAdminTs > exAdminTs;
      const higherProgressWins = !exAdminTs && (
        rReb > existing.rebirths ||
        (rReb === existing.rebirths && rLvl > existing.level)
      );
      const sameProgressPreferFirestoreOrNewer =
        rReb === existing.rebirths &&
        rLvl === existing.level &&
        ((rp.fromFirestore && !existing.fromFirestore) || rTs >= existing.ts);

      if (adminWins || higherProgressWins || sameProgressPreferFirestoreOrNewer) {
        existing.ts = Math.max(existing.ts, rTs);
        existing.adminUpdatedAt = Math.max(exAdminTs, rAdminTs);
        existing.rebirths = rReb;
        existing.level = rLvl;
        existing.bricks = rBrk;
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

    return [...byKey.values()];
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

      // Online státusz: ha 25 másodpercen belül küldött jelet
      const isOnline = entry.isPlayer || entry.isOnline || (now - (entry.ts || 0) < 25000);
      const dotHtml = isOnline
        ? '<span class="live-dot online" title="Élőben online">🟢</span>'
        : '<span class="live-dot offline" title="Offline (mentett pontszám)">⚪</span>';

      const dividerHtml = (pinnedAfterTop10 && rank > 11)
        ? '<div class="leaderboard-gap-divider">• • •</div>'
        : '';

      return `${dividerHtml}
        <div class="leaderboard-row ${rankClass} ${meClass} ${pinnedClass}">
          <span class="col-rank">${medal}</span>
          <span class="col-name">${dotHtml}${this.escapeHtml(entry.name)}${meBadge}</span>
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
    modal.classList.add('open');
    if (!this.isDevUnlocked() && pinIn) {
      setTimeout(() => pinIn.focus(), 60);
    }
    if (window.soundEngine) window.soundEngine.playClickHit();
  }

  updateDevLockView() {
    const unlocked = this.isDevUnlocked();
    const gate = document.getElementById('dev-auth-gate');
    const body = document.getElementById('dev-panel-body');
    const lockBtn = document.getElementById('btn-dev-lock');
    if (gate) gate.style.display = unlocked ? 'none' : 'flex';
    if (body) body.style.display = unlocked ? 'flex' : 'none';
    if (lockBtn) lockBtn.style.display = unlocked ? 'inline-flex' : 'none';
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

    const closeModal = () => {
      if (modal) modal.classList.remove('open');
      this.devEditTarget = null;
      this._devInlineEditActive = false;
      this._cancelActiveInlineEdit = null;
      const editBox = document.getElementById('dev-edit-box');
      if (editBox) editBox.style.display = 'none';
    };
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
    const switchDevTab = (tab) => {
      this.activeDevTab = tab;
      this._devInlineEditActive = false;
      this._cancelActiveInlineEdit = null;
      const isPlayers = (tab === 'players');
      const pPane = document.getElementById('dev-tab-players');
      const rPane = document.getElementById('dev-tab-rules');
      const pBtn = document.getElementById('btn-dev-tab-players');
      const rBtn = document.getElementById('btn-dev-tab-rules');
      if (pPane) pPane.style.display = isPlayers ? 'flex' : 'none';
      if (rPane) rPane.style.display = isPlayers ? 'none' : 'flex';
      if (pBtn) pBtn.classList.toggle('active', isPlayers);
      if (rBtn) rBtn.classList.toggle('active', !isPlayers);
      this.renderDevLeaderboardPanel();
    };
    const tabP = document.getElementById('btn-dev-tab-players');
    const tabR = document.getElementById('btn-dev-tab-rules');
    if (tabP) tabP.addEventListener('click', () => switchDevTab('players'));
    if (tabR) tabR.addEventListener('click', () => switchDevTab('rules'));

    // Quick toolbar actions
    const pruneBtn = document.getElementById('btn-dev-prune-cache');
    const syncBtn = document.getElementById('btn-dev-sync-now');
    if (pruneBtn) pruneBtn.addEventListener('click', () => this.devPruneStaleEntries());
    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        this.requestLivePeersSync();
        this.syncAdminRulesGlobally(true);
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
        const cmdKey = entry.uid || entry.docId || entry.id || `name:${origLower}`;
        this.lbAdminRules.playerCommands[cmdKey] = {
          cmdId: 'cmd_' + now.toString(36) + '_' + Math.random().toString(36).slice(2, 6),
          targetIds: matchIds,
          targetNameLower: origLower,
          name: newName,
          rebirths: newReb,
          level: newLvl,
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
              rp.name = newName;
              rp.rebirths = newReb;
              rp.level = newLvl;
              rp.ts = now;
              rp.adminUpdatedAt = now;
            }
          }
          try { localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers)); } catch (e) {}
        }

        if (this.cloud && (entry.docId || entry.uid)) {
          await this.cloud.adminUpdateLeaderboardDoc(entry.docId || entry.uid, {
            name: newName,
            rebirths: newReb,
            level: newLvl,
            ts: now
          });
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
      placeholder = 'pl. 50 / +10';
    } else if (field === 'bt') {
      initVal = (entry.bt !== null && entry.bt !== undefined) ? String(Math.max(0, Math.floor(Number(entry.bt) || 0))) : '';
      placeholder = 'pl. 25 / +5';
    } else if (field === 'money') {
      initVal = (entry.money !== null && entry.money !== undefined) ? String(Math.max(0, Math.floor(Number(entry.money) || 0))) : '';
      placeholder = 'pl. 500k / +1m';
    } else if (field === 'rebirths') {
      initVal = String(Math.max(0, Math.floor(Number(entry.rebirths) || 0)));
      placeholder = 'pl. 5 / +1';
    } else if (field === 'level') {
      initVal = String(Math.max(1, Math.floor(Number(entry.level) || 1)));
      placeholder = 'pl. 100 / +10';
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
      this.renderDevLeaderboardPanel();
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
      const cmdKey = entry.uid || entry.docId || entry.id || `name:${origLower}`;
      this.lbAdminRules.playerCommands[cmdKey] = {
        cmdId: 'cmd_' + now.toString(36) + '_' + Math.random().toString(36).slice(2, 6),
        targetIds: matchIds,
        targetNameLower: origLower,
        name: newName,
        rebirths: newReb,
        level: newLvl,
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
            rp.name = newName;
            rp.rebirths = newReb;
            rp.level = newLvl;
            rp.ts = now;
            rp.adminUpdatedAt = now;
          }
        }
        try { localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers)); } catch (e) {}
      }

      if (this.cloud && (entry.docId || entry.uid)) {
        await this.cloud.adminUpdateLeaderboardDoc(entry.docId || entry.uid, {
          name: newName,
          rebirths: newReb,
          level: newLvl,
          ts: now
        });
      }

      this.showToast(`✅ ${this.escapeHtml(entry.name)} frissítve!`, 2800);
      await this.syncAdminRulesGlobally(false);
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
          rp.ts = now;
          rp.adminUpdatedAt = now;
        }
      }
      try { localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.remotePlayers)); } catch (e) {}
    }

    if (resolvedVal !== null && this.cloud && (entry.docId || entry.uid)) {
      await this.cloud.adminUpdateLeaderboardDoc(entry.docId || entry.uid, {
        [field]: resolvedVal,
        ts: now
      });
    }

    if (toastMsg) this.showToast(toastMsg, 3500);
    await this.syncAdminRulesGlobally(false);
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

  renderDevLeaderboardPanel() {
    if (!this.isDevUnlocked()) return;
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
    const isInlineEditing = !!(listEl && (this._devInlineEditActive || listEl.querySelector('.dev-inline-input')));
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
        const ageSec = entry.isOnline ? 0 : Math.max(0, Math.floor((Date.now() - (entry.ts || 0)) / 1000));
        const seenTxt = entry.isOnline ? 'Online most' : (entry.ts ? `Aktív: ${this.formatDuration(ageSec)}e` : 'Offline');

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
              <div class="dev-stat-chip chip-reb is-editable" data-edit-field="rebirths" title="Kattints a Rebirth átírásához (pl. 10 vagy +1)">
                <span class="dev-stat-lbl">🔄 REB (${rebMultTxt}x)</span>
                <span class="dev-stat-val">${this.formatLeaderboardStat(entry.rebirths)}</span>
              </div>
              <div class="dev-stat-chip chip-lvl is-editable" data-edit-field="level" title="Kattints a Szint átírásához (pl. 100 vagy +10)">
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
            else if (act === 'wl') this.devToggleWhitelistEntry(entry);
            else if (act === 'ban') this.devBanOrUnbanEntry(entry);
            else if (act === 'del') this.devDeleteEntry(entry);
          });
        });
      });
    }

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

      if (stageEl) stageEl.textContent = `Stage ${curStage.stage}/30`;
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
        const freeLabel = stage.free.name + (stage.free.isRare ? ' ⭐' : '');
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

    for (const stage of BATTLE_PASS_STAGES) {
      if (stage.free && stage.free.type === 'skin' && unlocked.skins.has(stage.free.id)) {
        allSkins.push({ id: stage.free.id, name: stage.free.name });
      }
      if (stage.free && stage.free.type === 'effect' && unlocked.effects.has(stage.free.id)) {
        allEffects.push({ id: stage.free.id, name: stage.free.name });
      }
      if (stage.free && stage.free.type === 'break_effect' && unlocked.breakEffects.has(stage.free.id)) {
        allBreakEffects.push({ id: stage.free.id, name: stage.free.name });
      }
      if (stage.paid && stage.paid.type === 'skin' && unlocked.skins.has(stage.paid.id)) {
        allSkins.push({ id: stage.paid.id, name: stage.paid.name });
      }
      if (stage.paid && stage.paid.type === 'effect' && unlocked.effects.has(stage.paid.id)) {
        allEffects.push({ id: stage.paid.id, name: stage.paid.name });
      }
      if (stage.paid && stage.paid.type === 'break_effect' && unlocked.breakEffects.has(stage.paid.id)) {
        allBreakEffects.push({ id: stage.paid.id, name: stage.paid.name });
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
        ℹ️ Bármelyik labdatípusból <strong>1 db labdára</strong> tehetsz skint, vizuális effektet és törés (breaking) effektet. <strong>Minden kozmetika egyszerre csak 1 labdán lehet!</strong>
      </div>`;

      for (const typeKey of ownedBallTypes) {
        const cnt = this.ballTypes[typeKey].count;
        const lbl = armoryLabels[typeKey] || { one: this.ballTypes[typeKey].name, many: this.ballTypes[typeKey].name };
        const typeDisplay = cnt > 1 ? lbl.many : lbl.one;
        const curEquip = (this.ballTypeEquips && this.ballTypeEquips[typeKey]) || { skinId: 'default', effectId: 'none', breakEffectId: 'none' };

        const skinOptions = allSkins.map(s => {
          const sel = (s.id === curEquip.skinId) ? 'selected' : '';
          let note = '';
          if (s.id !== 'default' && this.ballTypeEquips) {
            for (const otherKey of Object.keys(this.ballTypeEquips)) {
              if (otherKey !== typeKey && this.ballTypeEquips[otherKey] && this.ballTypeEquips[otherKey].skinId === s.id) {
                const otherLbl = armoryLabels[otherKey] ? armoryLabels[otherKey].one : otherKey;
                note = ` (${otherLbl}-n van)`;
                break;
              }
            }
          }
          return `<option value="${s.id}" ${sel}>${s.name}${note}</option>`;
        }).join('');

        const effectOptions = allEffects.map(fx => {
          const sel = (fx.id === curEquip.effectId) ? 'selected' : '';
          let note = '';
          if (fx.id !== 'none' && this.ballTypeEquips) {
            for (const otherKey of Object.keys(this.ballTypeEquips)) {
              if (otherKey !== typeKey && this.ballTypeEquips[otherKey] && this.ballTypeEquips[otherKey].effectId === fx.id) {
                const otherLbl = armoryLabels[otherKey] ? armoryLabels[otherKey].one : otherKey;
                note = ` (${otherLbl}-n van)`;
                break;
              }
            }
          }
          return `<option value="${fx.id}" ${sel}>${fx.name}${note}</option>`;
        }).join('');

        const breakEffectOptions = allBreakEffects.map(bfx => {
          const sel = (bfx.id === (curEquip.breakEffectId || 'none')) ? 'selected' : '';
          let note = '';
          if (bfx.id !== 'none' && this.ballTypeEquips) {
            for (const otherKey of Object.keys(this.ballTypeEquips)) {
              if (otherKey !== typeKey && this.ballTypeEquips[otherKey] && this.ballTypeEquips[otherKey].breakEffectId === bfx.id) {
                const otherLbl = armoryLabels[otherKey] ? armoryLabels[otherKey].one : otherKey;
                note = ` (${otherLbl}-n van)`;
                break;
              }
            }
          }
          return `<option value="${bfx.id}" ${sel}>${bfx.name}${note}</option>`;
        }).join('');

        armoryHtml += `
          <div class="armory-ball-card">
            <div class="armory-ball-header">
              <span class="armory-ball-title"><span class="ball-dot ball-icon-${typeKey}"></span> ${typeDisplay} (${cnt}x)</span>
              <span class="armory-ball-sub">1 db-on</span>
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

    if (type === 'skin') {
      // 1 skin egyszerre csak 1 labdán lehet az összes típus között!
      if (cosmeticId !== 'default') {
        for (const otherKey of Object.keys(this.ballTypeEquips)) {
          if (otherKey !== typeKey && this.ballTypeEquips[otherKey] && this.ballTypeEquips[otherKey].skinId === cosmeticId) {
            this.ballTypeEquips[otherKey].skinId = 'default';
          }
        }
      }
      this.ballTypeEquips[typeKey].skinId = cosmeticId;
      this.showToast(`🎨 ${friendly} skin frissítve (1 db-on aktív)!`, 2400);
    } else if (type === 'effect') {
      // 1 effekt egyszerre csak 1 labdán lehet az összes típus között!
      if (cosmeticId !== 'none') {
        for (const otherKey of Object.keys(this.ballTypeEquips)) {
          if (otherKey !== typeKey && this.ballTypeEquips[otherKey] && this.ballTypeEquips[otherKey].effectId === cosmeticId) {
            this.ballTypeEquips[otherKey].effectId = 'none';
          }
        }
      }
      this.ballTypeEquips[typeKey].effectId = cosmeticId;
      this.showToast(`✨ ${friendly} effekt beállítva (1 db-on aktív)!`, 2400);
    } else if (type === 'break_effect') {
      // 1 törés effekt egyszerre csak 1 labdán lehet az összes típus között!
      if (cosmeticId !== 'none') {
        for (const otherKey of Object.keys(this.ballTypeEquips)) {
          if (otherKey !== typeKey && this.ballTypeEquips[otherKey] && this.ballTypeEquips[otherKey].breakEffectId === cosmeticId) {
            this.ballTypeEquips[otherKey].breakEffectId = 'none';
          }
        }
      }
      this.ballTypeEquips[typeKey].breakEffectId = cosmeticId;
      this.showToast(`💥 ${friendly} törés effekt beállítva (1 db-on aktív)!`, 2400);
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
