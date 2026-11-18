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
    baseDesc: 'Alap: 1 sebzés/mp (30 mp).',
    levels: [
      '5 sebzés másodpercenként.',
      '8 sebzés másodpercenként.',
      '13 sebzés másodpercenként.',
      '10 körön keresztül folyamatosan aktív (13 dmg/s).',
      'A következő Rebirthig folyamatosan aktív (13 dmg/s)!'
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
    baseDesc: 'Alap: 15 mp-ig automatikusan sebez random blokkokat (Click Power/mp).',
    levels: [
      '30 másodperc időtartam.',
      '60 másodperc időtartam.',
      '120 másodperc időtartam.',
      '5 körön keresztül folyamatosan aktív.',
      '10 körön keresztül folyamatosan aktív!'
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
    this.bossTokens = 0; // 1 Boss kill = +1 Boss Token; 5 Boss Token = 1 BB
    this.BOSS_TOKEN_COST = 5;
    this.MAX_MULTIPLY_BALLS = 15;
    this.MAX_GHOST_BALLS = 40;
    this.MAX_ROCKET_BALLS = 5;
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
      rocket: 0    // 0..1 (10 BT)
    };

    // Pierce Ball separate $ speed upgrade (unlocked at bbUpgrades.piercing >= 5)
    this.pierceSpeedUpgradeLevel = 0;

    // Gold Boss pending flag
    this.nextBossIsGold = false;

    // Upgrade Caps
    this.MAX_CLICK_LEVEL = 100;
    this.MAX_PIERCE_SPEED_LEVEL = 20;

    // Base Speed Reference (1x = 4.2) & 6 Distinct Ball Types
    this.BASE_SPEED = 4.2;
    this.ballTypes = {
      normal: {
        id: 'normal',
        name: 'NORMAL BALL',
        shortDesc: '1x sebesség, 1x sebzés',
        color: '#ffee00',
        count: 0,
        baseCost: 25,
        costMult: 1.15,
        speedFactor: 1.0,
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
        basePower: 20.0, // Már az 1. szinten 20-at sebez!
        powerStep: 10.0,
        speedLevel: 1,
        maxSpeedLevel: 35,
        speedBaseCost: 1200,
        powerLevel: 1,
        maxPowerLevel: 50,
        powerBaseCost: 2000,
        radius: 10.0
      },
      poison: {
        id: 'poison',
        name: 'POISON BALL',
        shortDesc: '1.5x sebesség, azonnali sebzés + BT méreg',
        color: '#22c55e',
        count: 0,
        baseCost: 3000,
        costMult: 1.22,
        speedFactor: 1.5,
        basePower: 1.0, // Csak az azonnali becsapódás sebzése (pl. lvl 23 = 23 dmg)
        powerStep: 1.0,
        speedLevel: 1,
        maxSpeedLevel: 40,
        speedBaseCost: 4000,
        powerLevel: 1,
        maxPowerLevel: 50,
        powerBaseCost: 7500,
        radius: 7.5
      },
      ghost: {
        id: 'ghost',
        name: 'GHOSTBALL',
        shortDesc: '1x sebesség, áthalad + BT szellembomba (max 40)',
        color: '#c8f4ff',
        count: 0,
        baseCost: 45000,
        costMult: 1.28,
        speedFactor: 1.0,
        basePower: 4.0,
        powerStep: 3.0,
        speedLevel: 1,
        maxSpeedLevel: 40,
        speedBaseCost: 50000,
        powerLevel: 1,
        maxPowerLevel: 50,
        powerBaseCost: 80000,
        radius: 8.0
      },
      multiply: {
        id: 'multiply',
        name: 'MULTIPLY BALL',
        shortDesc: '1x sebesség, osztódik (BT: 2→4→8→16, 5 mp)',
        color: '#d900b8',
        count: 0,
        baseCost: 65000,
        costMult: 1.28,
        speedFactor: 1.0,
        basePower: 10.0,
        powerStep: 5.0,
        speedLevel: 1,
        maxSpeedLevel: 35,
        speedBaseCost: 45000,
        powerLevel: 1,
        maxPowerLevel: 40,
        powerBaseCost: 65000,
        radius: 9.0
      },
      rocket: {
        id: 'rocket',
        name: 'ROCKET BALL',
        shortDesc: '10 dmg labda | rakéta 100/50/20 (max 5 db)',
        color: '#f97316',
        count: 0,
        baseCost: 90000,
        costMult: 1.28,
        speedFactor: 1.0,
        basePower: 10.0,
        powerStep: 5.0,
        speedLevel: 1,
        maxSpeedLevel: 40,
        speedBaseCost: 60000,
        powerLevel: 1,
        maxPowerLevel: 50,
        powerBaseCost: 90000,
        radius: 8.5
      }
    };

    // Active entities in arena
    this.balls = [];
    this.bricks = [];
    this.perimeterBricks = [];
    this.floatingTexts = [];
    this.visualRings = []; // Click area ripples, auto-clicker pings, shockwave rings
    this.bossSparks = [];
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

    // Quick Time Money (Coin Orb) Event
    this.bonusOrb = null;
    this.nextBonusOrbTime = 18;
    this.guaranteedCoinTimer = 0; // For QTM Level 3 (every 180s guaranteed)

    // Hold-to-Damage Mouse/Touch State
    this.isPointerDown = false;
    this.pointerX = 0;
    this.pointerY = 0;
    this.holdDamageTimer = 0;

    // Animation Clock
    this.animTime = 0;

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

    // Ensure any permanent-for-run BB lvl 4/5 effects that were saved as active or unlocked are ready
    this.restoreActivePowerUpVisuals();

    // Apply offline progress if the game was closed for >= 5s and player has balls
    if (this.pendingOfflineSeconds >= 5 && this.getTotalBalls() > 0) {
      this.applyOfflineProgress(this.pendingOfflineSeconds, true);
      this.pendingOfflineSeconds = 0;
    }

    // Bind UI & Canvas events
    this.bindEvents();
    this.renderPowerUpsHUD();
    this.updateHUD();

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
    const cols = Math.max(7, Math.min(11, Math.floor(arenaW / 60)));
    const rows = Math.max(9, Math.min(14, Math.floor(arenaH / 34)));

    const brickW = arenaW / cols;
    const brickH = arenaH / rows;
    this.gridCellW = brickW;
    this.gridCellH = brickH;
    const blockHp = lvl;

    // Kizárólag a legalsó sor marad üresen (r < rows - 1), a labdák pozícióját nem kerüli ki!
    const activeRows = rows - 1;
    let idCounter = 0;

    for (let r = 0; r < activeRows; r++) {
      for (let c = 0; c < cols; c++) {
        this.bricks.push({
          id: `b_${lvl}_${idCounter++}`,
          x: perimeterPadding + c * brickW,
          y: perimeterPadding + r * brickH,
          w: brickW,
          h: brickH,
          hp: blockHp,
          maxHp: blockHp,
          isBoss: false,
          isGoldBoss: false,
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

  // --- Brick Damage & Money Reward ---
  damageBrick(brick, dmg, source = 'click', options = {}) {
    if (!brick || brick.hp <= 0) return;

    let actualDmg = dmg;
    if (source === 'piercing_special') {
      if (brick.isBoss) {
        actualDmg = Math.max(15, Math.round(brick.maxHp * 0.03)); // 3% HP per hit on boss
      } else {
        actualDmg = brick.hp; // Instant destroy normal bricks
      }
    } else if (options.instantKill && !brick.isBoss) {
      actualDmg = brick.hp;
    }

    // Apply 2x Damage & All Ball Speed lvl 2/3/5 damage multiplier
    if (source !== 'piercing_special' && !options.instantKill) {
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
    }

    let reward = actualDmg * baseRewardPerDmg * this.rebirthMultiplier;
    if (this.isPowerUpActive('2x_money')) {
      reward *= 2;
    }

    this.money += reward;

    const silent = this.suppressAudioAndVisuals || document.hidden;

    if (!silent) {
      if (reward >= 1 || brick.hp <= 0) {
        this.addFloatingText(`+$${this.formatNumber(Math.max(1, Math.round(reward)))}`, brick.x + brick.w / 2, brick.y + brick.h / 2);
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
      if (!silent && window.soundEngine) window.soundEngine.playBrickDestroy(brick.isBoss ? 5 : 1);

      if (brick.isBoss) {
        let bossBonus = this.getBossKillBonus(this.level) * this.rebirthMultiplier;
        if (brick.isGoldBoss) bossBonus *= 2;
        if (this.isPowerUpActive('2x_money')) bossBonus *= 2;
        bossBonus = Math.round(bossBonus);
        this.money += bossBonus;
        this.bossTokens += 1; // Minden Boss megölése után +1 Boss Token!
        if (!silent) {
          const prefix = brick.isGoldBoss ? '✨ GOLD BOSS' : '👑 BOSS';
          this.addFloatingText(`${prefix} BONUS: +$${this.formatNumber(bossBonus)} | +1 👑 BT!`, brick.x + brick.w / 2, brick.y + brick.h / 2 - 20);
        }
      } else if (source !== 'piercing_special' && source !== 'shockwave' && source !== 'dot') {
        this.rollPowerUpDrop(brick.x + brick.w / 2, brick.y + brick.h / 2);
      }

      this.checkLevelClear();
    } else {
      if (!silent && window.soundEngine && source !== 'dot') {
        if (source === 'click' || source === 'auto_clicker') window.soundEngine.playClickHit();
        else window.soundEngine.playHit(source);
      }
    }

    if (!this.suppressAudioAndVisuals) {
      this.updateHUD();
    }
  }

  checkLevelClear() {
    const remaining = this.bricks.filter(b => b.hp > 0).length;
    if (remaining === 0) {
      this.level++;
      this.onRoundCleared();
      if (!this.suppressAudioAndVisuals && !document.hidden && window.soundEngine) {
        window.soundEngine.playLevelUp();
      }
      this.generateLevel(this.level);
    }
  }

  onRoundCleared() {
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
      if (key === 'gold_boss') continue;
      if (p.mode !== 'until_rebirth') {
        return true;
      }
    }
    return false;
  }

  rollPowerUpDrop(x, y) {
    // Ha már van aktív időzített / körhöz kötött power-up, ne halmozódjanak egymásra!
    // (A Rebirthig tartósan aktív lvl 5 bónuszok NEM blokkolják a többi power-up esését!)
    if (this.hasTemporaryActivePowerUp()) {
      return;
    }

    // Átlagosan minden ~700 blokk után 1 power-up (100 / 700 = ~0.143% blokkonként), rebirth-enként +0.02%
    const totalDropPercent = (100 / 700) + (this.rebirthCount * 0.02);
    const roll = Math.random() * 100;
    if (roll >= totalDropPercent) {
      return;
    }

    // Power-up súlyozás a kért arányokkal:
    // - 2x Money, 2x Damage, Shock Wave (Heatwave), Gold Boss: 5.0% súly
    // - Minden egyéb power-up: 0.65% súly (0.6-0.7% sáv közepe)
    const candidates = [
      { id: '2x_money',     weight: 5.0  },
      { id: '2x_dmg',       weight: 5.0  },
      { id: 'shockwave',    weight: 5.0  },
      { id: 'gold_boss',    weight: 5.0  },
      { id: 'speed_boost',  weight: 0.65 },
      { id: 'auto_clicker', weight: 0.65 },
      { id: 'discount',     weight: 0.65 },
      { id: 'piercing',     weight: 0.65 },
      { id: 'free_upgrade', weight: 0.65 }
    ].filter(c => {
      if (c.id === 'gold_boss' && this.nextBossIsGold) return false;
      const active = this.activePowerUps[c.id];
      if (active && active.mode === 'until_rebirth' && c.id !== 'piercing') return false;
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
        const dmgTable = [1, 5, 8, 13, 13, 13];
        const dmgPerSec = dmgTable[lvl] || 1;
        if (lvl >= 5) {
          this.activatePowerUp('shockwave', '🌊', 'Shock Wave', `${dmgPerSec} sebzés/mp a következő Rebirthig!`, { mode: 'until_rebirth', extra: { dmgPerSec } });
        } else if (lvl === 4) {
          this.activatePowerUp('shockwave', '🌊', 'Shock Wave', `${dmgPerSec} sebzés/mp 10 körön keresztül!`, { mode: 'rounds', rounds: 10, extra: { dmgPerSec } });
        } else {
          this.activatePowerUp('shockwave', '🌊', 'Shock Wave', `${dmgPerSec} területi sebzés/mp 30 mp-ig!`, { mode: 'timed', duration: 30, extra: { dmgPerSec } });
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

      case 'auto_clicker': {
        const lvl = this.bbUpgrades.autoClicker;
        if (lvl >= 5) {
          this.activatePowerUp('auto_clicker', '🤖', 'Auto Clicker', `Automatikusan sebez (${this.clickPower}/mp) 10 körön át!`, { mode: 'rounds', rounds: 10 });
        } else if (lvl === 4) {
          this.activatePowerUp('auto_clicker', '🤖', 'Auto Clicker', `Automatikusan sebez (${this.clickPower}/mp) 5 körön át!`, { mode: 'rounds', rounds: 5 });
        } else {
          const durations = [15, 30, 60, 120];
          const sec = durations[lvl] || 15;
          this.activatePowerUp('auto_clicker', '🤖', 'Auto Clicker', `Automatikusan sebez random blokkokat (${this.clickPower}/mp) ${sec} mp-ig!`, { mode: 'timed', duration: sec });
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
      window.soundEngine.playCoin();
    }
    if (!this.suppressAudioAndVisuals) {
      this.renderPowerUpsHUD();
      this.updateHUD();
    }
  }

  isPowerUpActive(id) {
    const p = this.activePowerUps[id];
    if (!p) return false;
    if (p.mode === 'until_rebirth') return true;
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

    // Shockwave ticker (every 1.0 second while active)
    if (this.isPowerUpActive('shockwave')) {
      this.shockwaveTimer += dt;
      if (this.shockwaveTimer >= 1.0) {
        this.shockwaveTimer = 0;
        const dmg = this.activePowerUps['shockwave'].extra?.dmgPerSec ?? 1;
        this.triggerShockwave(dmg);
      }
    }

    // Auto Clicker ticker (every 1.0 second while active: deals exact clickPower to 1 random brick)
    if (this.isPowerUpActive('auto_clicker')) {
      this.autoClickerTimer += dt;
      if (this.autoClickerTimer >= 1.0) {
        this.autoClickerTimer = 0;
        this.triggerAutoClickerHit();
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

  triggerShockwave(dmgPerSec = 1) {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const maxRadius = Math.min(this.width, this.height) * 0.48;

    if (!this.suppressAudioAndVisuals) {
      this.visualRings.push({ x: cx, y: cy, radius: 10, maxRadius, alpha: 0.85, color: '59, 130, 246', speed: 260 });
    }

    for (const b of this.bricks) {
      if (b.hp <= 0) continue;
      const bx = b.x + b.w / 2;
      const by = b.y + b.h / 2;
      if (Math.hypot(bx - cx, by - cy) <= maxRadius) {
        this.damageBrick(b, dmgPerSec, 'shockwave');
      }
    }
  }

  triggerAutoClickerHit() {
    const alive = this.bricks.filter(b => b.hp > 0);
    if (alive.length === 0) return;

    const target = alive[Math.floor(Math.random() * alive.length)];
    const tx = target.x + target.w / 2;
    const ty = target.y + target.h / 2;

    if (!this.suppressAudioAndVisuals) {
      this.visualRings.push({ x: tx, y: ty, radius: 4, maxRadius: 28, alpha: 0.9, color: '168, 85, 247', speed: 120 });
    }
    this.damageBrick(target, this.clickPower, 'auto_clicker');
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

  spawnRocketFromBall(ball) {
    if (this.rockets.length >= 80) return;
    const isHoming = (this.btUpgrades.rocket || 0) >= 1;
    let angle = Math.random() * Math.PI * 2;
    let target = null;

    if (isHoming) {
      target = this.findNearestBrickTo(ball.x, ball.y);
      if (target) {
        angle = Math.atan2((target.y + target.h / 2) - ball.y, (target.x + target.w / 2) - ball.x);
      }
    }

    const rocketSpeed = 9.5;
    // Alap labda 10 dmg -> rakéta: 100 közvetlen, 50 mellette lévő blokkok, 20 az amellett lévő blokkok!
    const powerScale = Math.max(1, ball.power / this.ballTypes.rocket.basePower);
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
      badge.className = `powerup-hud-badge ${p.mode === 'until_rebirth' ? 'perm-badge' : ''}`;
      badge.id = `pu-badge-${p.id}`;

      let miniLabel = '';
      let statusLine = '';
      if (p.mode === 'until_rebirth') {
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
    // Ha már lvl 4+ Pierce Ball megvan és nincs permanens Pierce Ball, a következő drop vagy vásárlás hozza be;
    // mentett aktív Rebirthig tartó power-upok visszatöltése:
    if (this.nextBossIsGold && !this.activePowerUps['gold_boss']) {
      this.activatePowerUp('gold_boss', '👑', 'Gold Boss', 'A következő Boss blokk Gold Boss lesz (2x Boss pénz)!', { mode: 'until_rebirth' });
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

  // --- Rebirth Ball Slot Limits (Alap: 15, 3.: 25, 5.: 35, 7.: 50, 9.: 65, 11.: 80, 13.+: 100 max!) ---
  getMaxBalls(rebirthCount = this.rebirthCount) {
    if (rebirthCount >= 13) return 100;
    if (rebirthCount >= 11) return 80;
    if (rebirthCount >= 9) return 65;
    if (rebirthCount >= 7) return 50;
    if (rebirthCount >= 5) return 35;
    if (rebirthCount >= 3) return 25;
    return 15;
  }

  getMaxBallTypeLimit(typeKey) {
    if (typeKey === 'multiply') {
      return this.getMaxBalls() >= 100 ? 25 : this.MAX_MULTIPLY_BALLS;
    }
    if (typeKey === 'ghost') {
      return this.MAX_GHOST_BALLS;
    }
    if (typeKey === 'rocket') {
      return this.MAX_ROCKET_BALLS;
    }
    return null;
  }

  // --- Ball Purchase, Spawning & Stats ---
  getBallSpeed(typeKey) {
    const b = this.ballTypes[typeKey];
    const base = this.BASE_SPEED * b.speedFactor;
    return base + (b.speedLevel - 1) * (0.35 * Math.max(0.6, b.speedFactor));
  }

  getBallPower(typeKey) {
    const b = this.ballTypes[typeKey];
    return b.basePower + (b.powerLevel - 1) * b.powerStep;
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
      ghostHitSet: typeKey === 'ghost' ? new Set() : null,
      ghostBombTimer: 0,
      rocketTimer: 0
    });
  }

  // Multiply Ball Split (BT fejleszthető: Alap 2 -> 3 BT: 4 -> 20 BT: 8 -> 50 BT: 16; minden osztódott 5 mp-ig él!)
  getMultiplyMaxSplitTier() {
    return 1 + (this.btUpgrades.multiply || 0);
  }

  spawnMultiplyChildren(parentBall) {
    const maxTier = this.getMultiplyMaxSplitTier();
    const nextTier = (parentBall.splitTier || 0) + 1;
    if (nextTier > maxTier) return;

    // Performance cap: max 160 active multiply mini-balls
    const currentChildren = this.balls.filter(b => b.isSplitChild).length;
    if (currentChildren >= 160) return;

    const bDef = this.ballTypes.multiply;
    const powerScale = this.getBallPower('multiply') / bDef.basePower;
    const tierBaseDamages = [10, 5, 2, 1, 0.5];
    const tierRadii = [9.0, 6.8, 5.4, 4.3, 3.4];
    const tierColors = ['#d900b8', '#f038d0', '#ff70e5', '#ffb8f2', '#ffe0fa'];
    const childDmg = (tierBaseDamages[nextTier] ?? 0.5) * powerScale;
    const childSpeed = this.getBallSpeed('multiply') * (1 + nextTier * 0.06);

    const baseAngle = Math.atan2(parentBall.vy, parentBall.vx);
    const offsets = [-0.45, 0.45];

    for (const off of offsets) {
      const a = baseAngle + off;
      this.balls.push({
        type: 'multiply',
        color: tierColors[nextTier] || '#ffe0fa',
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
        timeLeft: 5.0 // 5 másodperc múlva eltűnnek az osztódások!
      });
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
    const raw = Math.round(b.powerBaseCost * Math.pow(1.25, b.powerLevel - 1));
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
      const tierBaseDamages = [10, 5, 2, 1, 0.5];

      this.balls.forEach(ball => {
        if (ball.type === typeKey && !ball.isPiercing) {
          if (ball.isSplitChild) {
            ball.power = (tierBaseDamages[ball.splitTier] ?? 0.5) * multScale;
          } else {
            ball.power = newPower;
          }
        }
      });

      if (window.soundEngine) window.soundEngine.playCoin();
      this.updateHUD();
      this.renderUpgradesMenu();
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
  }

  onBBUpgradePurchased(key, newLvl) {
    // Ha a játékos most érte el a Rebirthig tartósan aktív szintet, azonnal aktiváljuk a futó menetben!
    if (key === 'shockwave' && newLvl === 5) {
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
  }

  // --- Rebirth System ---
  getRequiredRebirthLevel() {
    return (this.rebirthCount + 1) * 20;
  }

  canRebirth() {
    return this.level >= this.getRequiredRebirthLevel();
  }

  executeRebirth() {
    if (!this.canRebirth()) return;

    this.rebirthCount++;
    this.rebirthMultiplier = Math.pow(1.25, this.rebirthCount); // +25% pénz / rebirth
    this.bb += 1;

    // Reset run progress completely back to level 1
    // (BB valuta, Boss Tokenek, BB/BT fejlesztések és a megnövekedett labdaférőhely MEGMARADNAK!)
    this.level = 1;
    this.money = 0;
    this.balls = [];
    this.activePowerUps = {};
    this.nextBossIsGold = false;
    this.bonusOrb = null;
    this.visualRings = [];
    this.bossSparks = [];
    this.ghostBombs = [];
    this.rockets = [];
    this.floatingTexts = [];
    this.shockwaveTimer = 0;
    this.autoClickerTimer = 0;
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

    this.generateLevel(1);
    this.renderPowerUpsHUD();

    if (window.soundEngine) window.soundEngine.playPrestige();
    this.save();
    this.updateHUD();
    this.refreshOpenModals();
    this.showToast(`🔄 <strong>REBIRTH #${this.rebirthCount} SIKERES!</strong> +1 ⭐ BB | Szorzó: ${this.rebirthMultiplier.toFixed(2)}x | Max labda: ${this.getMaxBalls()}`, 5000);
  }

  // --- Floating Combat Texts & Toasts ---
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
    }

    // 7. Autosave every 3s
    this.autosaveTimer += dt;
    if (this.autosaveTimer >= 3.0) {
      this.autosaveTimer = 0;
      this.save();
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
      for (const key in this.ballTypes) {
        const b = this.ballTypes[key];
        if (b.count <= 0) continue;
        const speed = this.getBallSpeed(key);
        const power = this.getBallPower(key);
        let hitRate = speed * 0.42;
        if (key === 'ghost') hitRate = speed * 0.85;
        if (key === 'multiply') hitRate = speed * 0.65;
        totalDps += b.count * power * hitRate;
      }

      let remainingDamage = totalDps * cappedSec;
      let earned = 0;

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
    this.save();

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

      // Ghostball BT szellembomba időzítő (10 mp / 5 mp / 1 mp)
      if (ball.type === 'ghost' && ghostCfg) {
        ball.ghostBombTimer = (ball.ghostBombTimer || 0) + dt;
        if (ball.ghostBombTimer >= ghostCfg.cooldown) {
          ball.ghostBombTimer -= ghostCfg.cooldown;
          this.spawnGhostBomb(ball.x, ball.y, ghostCfg);
        }
      }

      // Rocket Ball rakétakilövő időzítő (Alap: 10 mp random | 10 BT: 3 mp önirányító!)
      if (ball.type === 'rocket') {
        ball.rocketTimer = (ball.rocketTimer || 0) + dt;
        if (ball.rocketTimer >= rocketCooldown) {
          ball.rocketTimer -= rocketCooldown;
          this.spawnRocketFromBall(ball);
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

        const isPassThrough = ball.isPiercing || ball.type === 'ghost';

        // Ghostball tracks bricks it is currently inside so it hits each brick ONCE per pass-through
        const currentlyTouchingIds = ball.type === 'ghost' ? new Set() : null;

        for (const brick of this.bricks) {
          if (brick.hp <= 0) continue;

          const cx = Math.max(brick.x, Math.min(ball.x, brick.x + brick.w));
          const cy = Math.max(brick.y, Math.min(ball.y, brick.y + brick.h));
          const distX = ball.x - cx;
          const distY = ball.y - cy;

          if (distX * distX + distY * distY < ball.radius * ball.radius) {
            if (ball.type === 'ghost') {
              // Ghostball passes straight through ALL bricks (including Boss) without bouncing!
              currentlyTouchingIds.add(brick.id);
              if (!ball.ghostHitSet.has(brick.id)) {
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

        // Clear exited brick IDs from Ghostball's hit set so it can hit them again on next pass!
        if (ball.type === 'ghost' && ball.ghostHitSet) {
          for (const id of ball.ghostHitSet) {
            if (!currentlyTouchingIds.has(id)) {
              ball.ghostHitSet.delete(id);
            }
          }
        }
      }
    }
  }

  handleBallBrickImpact(ball, brick) {
    if (ball.type === 'poison') {
      // A $ Power fejlesztés CSAK az azonnali sebzésre vonatkozik (pl. lvl 23 = 23 dmg),
      // a méreg (dmg/s + időtartam) pedig a BT fejlesztésből jön!
      this.damageBrick(brick, ball.power, 'poison');
      if (brick.hp > 0) {
        this.applyPoisonToBrick(brick);
      }
    } else if (ball.type === 'heavy') {
      // Heavy Ball: lassú, de az 1. szinttől 20+ azonnali sebzés (nincs BT upgrade)
      this.damageBrick(brick, ball.power, 'heavy');
    } else if (ball.type === 'multiply') {
      this.damageBrick(brick, ball.power, 'multiply');
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
    } else {
      this.damageBrick(brick, ball.power, ball.type);
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
        this.ctx.fillStyle = b.flash > 0 ? '#ffffff' : this.getBlockColor(b.hp);
        this.ctx.fillRect(b.x, b.y, b.w, b.h);

        // Finom retro 3D fényél és alsó árnyék a téglákon
        if (b.flash <= 0) {
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
          this.ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, 3);
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
          this.ctx.fillRect(b.x + 2, b.y + b.h - 5, b.w - 4, 3);
        }

        // Poison subtle top tint (normál blokkon max 1 méreg)
        if (b.poison) {
          this.ctx.fillStyle = b.poison.infinite ? 'rgba(16, 185, 129, 0.6)' : 'rgba(34, 197, 94, 0.45)';
          this.ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, 5);
        }

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#000000';
        this.ctx.strokeRect(b.x, b.y, b.w, b.h);

        if (b.poison) {
          // Ha mérgezett a blokk: HP feljebb, alatta jól olvasható "x dmg/s" jelzés!
          this.ctx.font = 'bold 15px "VT323", "Courier New", Courier, monospace';
          this.ctx.fillStyle = '#000000';
          this.ctx.fillText(Math.ceil(b.hp).toString(), b.x + b.w / 2, b.y + b.h * 0.38);

          const dpsText = `${Math.round(b.poison.dps)} dmg/s`;
          this.ctx.font = 'bold 11px "VT323", "Courier New", Courier, monospace';
          this.ctx.fillStyle = '#064e3b';
          this.ctx.fillText(dpsText, b.x + b.w / 2, b.y + b.h * 0.77);
        } else {
          this.ctx.font = 'bold 16px "VT323", "Courier New", Courier, monospace';
          this.ctx.fillStyle = '#000000';
          this.ctx.fillText(Math.ceil(b.hp).toString(), b.x + b.w / 2, b.y + b.h / 2);
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

    // 4. Draw Balls (All 7 types visually distinct + Pierce Ball)
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
      } else {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();
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
        rebirthBtn.title = `Az újjászületés a(z) ${reqLvl}. szint után válik elérhetővé!`;
      }
    }

    document.title = `LVL ${this.level} | $${this.formatNumber(Math.floor(this.money))} - Idle Breakout`;
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
    this.showToast('👑 <strong>5 Boss Token beváltva ➔ <span style="color:#fde047;">+1 BB!</span></strong>', 3000);
    this.updateHUD();
    this.refreshOpenModals();
    this.save();
  }

  formatNumber(num) {
    if (num === 0) return '0';
    if (num < 1000) return Math.round(num).toString();
    if (num < 1_000_000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1_000_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    return (num / 1_000_000_000).toFixed(1) + 'B';
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

    for (const key in this.ballTypes) {
      const b = this.ballTypes[key];
      if (b.count === 0) continue;

      const col = document.createElement('div');
      col.className = 'ball-upgrade-section';

      const spdMaxed = b.speedLevel >= b.maxSpeedLevel;
      const pwrMaxed = b.powerLevel >= b.maxPowerLevel;

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
        const bottomLabel = btIsMax
          ? 'MAX'
          : (!baseMaxed ? `🔒 MAX Speed+Power (${btCost} BT)` : `${btCost} BT`);
        btBtnHtml = `
          <div id="wrap-upg-bt-${key}" style="width:100%; max-width:140px;">
            <button class="ball-bt-btn ${btCls}" id="btn-upg-bt-${key}" ${(!canBuyBT || btIsMax) ? 'disabled' : ''}>
              <div class="btn-top-info">👑 Ability ${btLvl}/${btMax}</div>
              <div class="btn-cost-bottom" style="font-size:${!baseMaxed && !btIsMax ? '12px' : '15px'};">${bottomLabel}</div>
            </button>
          </div>
        `;
      }

      col.innerHTML = `
        <div class="ball-title-label">
          <span style="font-size: 14px; color: #555;">(x${b.count}${typeLimit !== null ? '/' + typeLimit : ''})</span>
          <span>${b.name}</span>
          <span style="font-size: 13px; color: #444;">${b.shortDesc}</span>
          <div class="ball-dot ball-icon-${key}" style="margin-top: 4px;"></div>
        </div>

        <button class="ball-upgrade-btn ${spdClass}" id="btn-upg-spd-${key}" ${spdMaxed ? 'disabled' : ''}>
          <div class="btn-top-info">${spdMaxed ? `Speed ${b.maxSpeedLevel}/${b.maxSpeedLevel}` : `Speed ${b.speedLevel}/${b.maxSpeedLevel} >> ${b.speedLevel + 1}`}</div>
          <div class="btn-cost-bottom">${spdMaxed ? 'MAX' : (pirateActive ? 'FREE!' : '$' + this.formatNumber(spdCost))}</div>
        </button>

        <button class="ball-upgrade-btn ${pwrClass}" id="btn-upg-pwr-${key}" ${pwrMaxed ? 'disabled' : ''}>
          <div class="btn-top-info">${pwrMaxed ? `Power ${b.maxPowerLevel}/${b.maxPowerLevel}` : `Power ${b.powerLevel}/${b.maxPowerLevel} >> ${b.powerLevel + 1}`}</div>
          <div class="btn-cost-bottom">${pwrMaxed ? 'MAX' : (pirateActive ? 'FREE!' : '$' + this.formatNumber(pwrCost))}</div>
        </button>

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
          ? '🔒 Először maxold ki a labda Speed és Power fejlesztéseit!'
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
      const pClass = pierceMaxed
        ? 'maxed-upg-btn'
        : (pirateActive ? 'pirate-free' : (canAffordPierce ? 'affordable' : ''));

      const pierceCol = document.createElement('div');
      pierceCol.className = 'ball-upgrade-section';
      pierceCol.innerHTML = `
        <div class="ball-title-label">
          <span style="font-size: 14px; color: #b45309;">PIERCE LVL 5 BONUS</span>
          <span>⚡ PIERCE SPEED</span>
          <span style="font-size: 13px; color: #444;">Külön áttörő sebesség</span>
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
    const clickClass = clickMaxed
      ? 'maxed-upg-btn'
      : (pirateActive ? 'pirate-free' : (canAffordClick ? 'affordable' : ''));

    const clickCol = document.createElement('div');
    clickCol.className = 'ball-upgrade-section';
    clickCol.innerHTML = `
      <div class="ball-title-label">
        <span style="font-size: 14px; color: #555;">MANUAL</span>
        <span>CLICK POWER</span>
        <div style="font-size: 20px; margin-top: 4px;">👆</div>
      </div>

      <button class="ball-upgrade-btn ${clickClass}" id="btn-upg-click" ${clickMaxed ? 'disabled' : ''}>
        <div class="btn-top-info">${clickMaxed ? `Click ${this.MAX_CLICK_LEVEL}/${this.MAX_CLICK_LEVEL}` : `Click ${this.clickUpgradeLevel}/${this.MAX_CLICK_LEVEL} >> ${this.clickUpgradeLevel + 1}`}</div>
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

    // Boss Token Exchange Buttons (5 Boss Token ➔ +1 BB)
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
        if (!this.canRebirth()) {
          alert(`Az újjászületéshez el kell érned legalább a(z) ${reqLvl}. szintet!\nJelenlegi szinted: ${this.level}\n(1. rebirth: lvl 20, 2. rebirth: lvl 40, 3. rebirth: lvl 60...)`);
          return;
        }

        document.getElementById('rebirth-current-lvl').textContent = this.level;
        document.getElementById('rebirth-required-lvl').textContent = reqLvl;
        document.getElementById('rebirth-current-mult').textContent = this.rebirthMultiplier.toFixed(2) + 'x';
        document.getElementById('rebirth-next-mult').textContent = (this.rebirthMultiplier * 1.25).toFixed(2) + 'x';

        const curSlots = this.getMaxBalls(this.rebirthCount);
        const nextSlots = this.getMaxBalls(this.rebirthCount + 1);
        const slotsEl = document.getElementById('rebirth-slots-info');
        if (slotsEl) slotsEl.textContent = `${curSlots} ➔ ${nextSlots}`;

        const curChance = ((100 / 700) + this.rebirthCount * 0.02).toFixed(2);
        const nextChance = ((100 / 700) + (this.rebirthCount + 1) * 0.02).toFixed(2);
        document.getElementById('rebirth-chance-info').textContent = `${curChance}% ➔ ${nextChance}%`;
        document.getElementById('rebirth-crit-info').textContent = `${5 + this.rebirthCount}% ➔ ${5 + this.rebirthCount + 1}%`;

        rebirthModal.classList.add('open');
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
  }

  // --- Save & Load (with legacy ball-type save migration!) ---
  save() {
    if (this.isResetting) return;

    // Persist until_rebirth & rounds power-ups across page reloads
    const persistedPowerUps = {};
    for (const key in this.activePowerUps) {
      const p = this.activePowerUps[key];
      if (p.mode === 'until_rebirth' || p.mode === 'rounds') {
        persistedPowerUps[key] = { ...p };
      }
    }

    const data = {
      money: this.money,
      level: this.level,
      bb: this.bb,
      bossTokens: this.bossTokens,
      rebirthCount: this.rebirthCount,
      clickUpgradeLevel: this.clickUpgradeLevel,
      bbUpgrades: { ...this.bbUpgrades },
      btUpgrades: { ...this.btUpgrades },
      pierceSpeedUpgradeLevel: this.pierceSpeedUpgradeLevel,
      nextBossIsGold: this.nextBossIsGold,
      hasPermanentPierce: this.balls.some(b => b.isPiercing && b.isPermanentPierce),
      persistedPowerUps,
      lastSavedAt: Date.now(),
      balls: {}
    };

    for (const key in this.ballTypes) {
      data.balls[key] = {
        count: this.ballTypes[key].count,
        speedLevel: this.ballTypes[key].speedLevel,
        powerLevel: this.ballTypes[key].powerLevel
      };
    }

    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Save failed:', e);
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      this.money = data.money ?? 0;
      this.level = data.level ?? 1;
      this.bb = data.bb ?? 0;
      this.bossTokens = data.bossTokens ?? 0;
      this.rebirthCount = data.rebirthCount ?? 0;
      this.rebirthMultiplier = Math.pow(1.25, this.rebirthCount);
      this.clickUpgradeLevel = Math.min(this.MAX_CLICK_LEVEL, data.clickUpgradeLevel ?? 1);
      this.clickPower = this.clickUpgradeLevel;
      this.pierceSpeedUpgradeLevel = Math.min(this.MAX_PIERCE_SPEED_LEVEL, data.pierceSpeedUpgradeLevel ?? 0);
      this.nextBossIsGold = !!data.nextBossIsGold;

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
          if (p && (p.mode === 'until_rebirth' || (p.mode === 'rounds' && p.roundsLeft > 0))) {
            this.activePowerUps[key] = p;
          }
        }
      }

      if (data.lastSavedAt) {
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

        // Enforce ball cap (and Ghost=40 / Multiply=15 or 25 caps) cleanly and spawn owned balls
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
    } catch (e) {
      console.error('Load failed:', e);
    }
  }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.game = new IdleBreakoutGame();
  window.game.init();
});
