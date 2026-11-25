/**
 * Sound System - Procedural Web Audio API Synthesizer
 * Works standalone with zero external audio assets.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.35;
    this.lastSoundTimes = {};
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Throttle sound to prevent audio distortion with many simultaneous hits
  canPlay(key, minIntervalMs = 45) {
    if (!this.enabled || !this.ctx) return false;
    const now = performance.now();
    const last = this.lastSoundTimes[key] || 0;
    if (now - last < minIntervalMs) return false;
    this.lastSoundTimes[key] = now;
    return true;
  }

  // Internal shared tone synthesis helper (supports optional filter sweep + delay)
  _playTone({
    type = 'sine',
    freqStart = 440,
    freqEnd = 220,
    duration = 0.08,
    vol = 0.35,
    delay = 0,
    ramp = 'exp',
    filterType = null,
    filterFreqStart = 1200,
    filterFreqEnd = 400,
    q = 1
  }) {
    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freqStart), t);
    if (ramp === 'linear') {
      osc.frequency.linearRampToValueAtTime(Math.max(20, freqEnd), t + duration);
    } else {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t + duration);
    }

    const peak = Math.max(0.002, this.volume * vol);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(peak, t + Math.min(0.006, duration * 0.2));
    gain.gain.exponentialRampToValueAtTime(0.0008, t + duration);

    if (filterType) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = filterType;
      filter.Q.value = q;
      filter.frequency.setValueAtTime(Math.max(40, filterFreqStart), t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, filterFreqEnd), t + duration);
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  // Internal shared noise burst helper
  _playNoise({
    duration = 0.16,
    vol = 0.35,
    delay = 0,
    filterType = 'lowpass',
    filterFreqStart = 900,
    filterFreqEnd = 140,
    q = 1
  }) {
    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime + delay;
    const sampleCount = Math.max(256, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, sampleCount, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(Math.max(40, filterFreqStart), t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, filterFreqEnd), t + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(Math.max(0.002, this.volume * vol), t);
    gain.gain.exponentialRampToValueAtTime(0.0008, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + duration + 0.01);
  }

  // 1. Ball Hit Sound (special balls get distinct layered synthesis; normal/speedy stay light)
  playHit(ballType = 'normal') {
    if (ballType === 'smasher_splash') return; // Splash hits accompany primary Smasher thud cleanly
    if (!this.canPlay('hit_' + ballType, ballType === 'smasher' || ballType === 'heavy' ? 65 : 50)) return;
    this.ensureContext();
    if (!this.ctx) return;

    switch (ballType) {
      case 'smasher':
        // Seismic crunch slam: sub-bass punch + lowpass gritty transient
        this._playTone({ type: 'triangle', freqStart: 145, freqEnd: 40, duration: 0.13, vol: 0.56 });
        this._playTone({ type: 'sawtooth', freqStart: 320, freqEnd: 78, duration: 0.08, vol: 0.28, filterType: 'lowpass', filterFreqStart: 1100, filterFreqEnd: 220 });
        this._playNoise({ duration: 0.065, vol: 0.22, filterType: 'lowpass', filterFreqStart: 950, filterFreqEnd: 180 });
        return;

      case 'heavy':
      case 'strong':
        // Heavy iron anvil thud
        this._playTone({ type: 'triangle', freqStart: 155, freqEnd: 46, duration: 0.105, vol: 0.54 });
        this._playTone({ type: 'sine', freqStart: 95, freqEnd: 38, duration: 0.11, vol: 0.42 });
        return;

      case 'rocket':
        // Metallic rocket casing thump
        this._playTone({ type: 'square', freqStart: 250, freqEnd: 68, duration: 0.09, vol: 0.34, filterType: 'lowpass', filterFreqStart: 1400, filterFreqEnd: 300 });
        this._playTone({ type: 'triangle', freqStart: 140, freqEnd: 48, duration: 0.1, vol: 0.44 });
        return;

      case 'ghost':
        // Haunting spectral dual-detuned harmonic shimmer
        this._playTone({ type: 'sine', freqStart: 510, freqEnd: 690, duration: 0.075, vol: 0.2 });
        this._playTone({ type: 'sine', freqStart: 775, freqEnd: 1030, duration: 0.09, vol: 0.13, delay: 0.01 });
        return;

      case 'poison':
        // Acidic bubbling resonant splash
        this._playTone({ type: 'sawtooth', freqStart: 420, freqEnd: 175, duration: 0.075, vol: 0.24, filterType: 'bandpass', filterFreqStart: 900, filterFreqEnd: 340, q: 3.5 });
        this._playTone({ type: 'sine', freqStart: 580, freqEnd: 310, duration: 0.055, vol: 0.16, delay: 0.025 });
        return;

      case 'multiply':
        // Crisp glassy crystalline bounce
        this._playTone({ type: 'triangle', freqStart: 610, freqEnd: 940, duration: 0.05, vol: 0.26 });
        this._playTone({ type: 'sine', freqStart: 915, freqEnd: 1410, duration: 0.045, vol: 0.14 });
        return;

      case 'piercing_special':
        // Electric plasma slice
        this._playTone({ type: 'sawtooth', freqStart: 1080, freqEnd: 460, duration: 0.055, vol: 0.22, filterType: 'bandpass', filterFreqStart: 2200, filterFreqEnd: 850, q: 2 });
        this._playTone({ type: 'sine', freqStart: 1560, freqEnd: 1920, duration: 0.04, vol: 0.16 });
        return;

      case 'speedy':
      case 'fast':
        this._playTone({ type: 'sine', freqStart: 780, freqEnd: 480, duration: 0.032, vol: 0.22 });
        return;

      default:
        this._playTone({ type: 'sine', freqStart: 480, freqEnd: 260, duration: 0.05, vol: 0.35 });
        return;
    }
  }

  // Special Ball & Ability Event Sounds
  playRocketLaunch() {
    if (!this.canPlay('rocket_launch', 180)) return;
    this.ensureContext();
    if (!this.ctx) return;
    this._playNoise({ duration: 0.14, vol: 0.26, filterType: 'bandpass', filterFreqStart: 420, filterFreqEnd: 1900, q: 1.8 });
    this._playTone({ type: 'triangle', freqStart: 185, freqEnd: 510, duration: 0.12, vol: 0.25 });
  }

  playRocketExplosion() {
    if (!this.canPlay('rocket_explosion', 110)) return;
    this.ensureContext();
    if (!this.ctx) return;
    this._playTone({ type: 'sine', freqStart: 135, freqEnd: 28, duration: 0.26, vol: 0.68 });
    this._playTone({ type: 'sawtooth', freqStart: 190, freqEnd: 44, duration: 0.16, vol: 0.3, filterType: 'lowpass', filterFreqStart: 850, filterFreqEnd: 140 });
    this._playNoise({ duration: 0.21, vol: 0.45, filterType: 'lowpass', filterFreqStart: 1450, filterFreqEnd: 140 });
  }

  playGhostBomb() {
    if (!this.canPlay('ghost_bomb', 140)) return;
    this.ensureContext();
    if (!this.ctx) return;
    this._playTone({ type: 'sine', freqStart: 118, freqEnd: 34, duration: 0.24, vol: 0.52 });
    this._playTone({ type: 'sine', freqStart: 940, freqEnd: 230, duration: 0.22, vol: 0.26 });
    this._playTone({ type: 'triangle', freqStart: 1320, freqEnd: 660, duration: 0.18, vol: 0.16, delay: 0.02 });
    this._playNoise({ duration: 0.15, vol: 0.22, filterType: 'bandpass', filterFreqStart: 1600, filterFreqEnd: 380, q: 2.2 });
  }

  playMultiplySplit() {
    if (!this.canPlay('multiply_split', 160)) return;
    this.ensureContext();
    if (!this.ctx) return;
    this._playTone({ type: 'triangle', freqStart: 780, freqEnd: 1170, duration: 0.055, vol: 0.22 });
    this._playTone({ type: 'sine', freqStart: 1046, freqEnd: 1568, duration: 0.065, vol: 0.18, delay: 0.03 });
  }

  playShockwave() {
    if (!this.canPlay('shockwave_pulse', 420)) return;
    this.ensureContext();
    if (!this.ctx) return;
    this._playTone({ type: 'triangle', freqStart: 92, freqEnd: 225, duration: 0.14, vol: 0.36 });
    this._playTone({ type: 'sine', freqStart: 215, freqEnd: 58, duration: 0.22, vol: 0.34, delay: 0.04 });
    this._playNoise({ duration: 0.16, vol: 0.16, filterType: 'bandpass', filterFreqStart: 650, filterFreqEnd: 1800, q: 2.5 });
  }

  playCosmeticEquip() {
    if (!this.canPlay('cosmetic_equip', 80)) return;
    this.ensureContext();
    if (!this.ctx) return;
    this._playTone({ type: 'sine', freqStart: 740, freqEnd: 987, duration: 0.06, vol: 0.26 });
    this._playTone({ type: 'triangle', freqStart: 1108, freqEnd: 1480, duration: 0.09, vol: 0.28, delay: 0.045 });
  }

  playEffect(effectId) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    switch (effectId) {
      case 'shockwave':
        this.playShockwave();
        break;
      case 'gold_level':
      case 'gold_level_active': {
        if (!this.canPlay('fx_gold_level', 200)) return;
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        notes.forEach((f, idx) => {
          this._playTone({ type: 'triangle', freqStart: f, freqEnd: f * 1.02, duration: 0.24, vol: 0.36, delay: idx * 0.055 });
        });
        break;
      }
      case 'gold_boss': {
        if (!this.canPlay('fx_gold_boss', 200)) return;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((f, idx) => {
          this._playTone({ type: 'triangle', freqStart: f, freqEnd: f, duration: 0.22, vol: 0.36, delay: idx * 0.06 });
        });
        break;
      }
      case '2x_dmg':
      case 'speed_boost':
      case 'piercing':
        if (!this.canPlay('fx_surge_' + effectId, 120)) return;
        this._playTone({ type: 'sawtooth', freqStart: 240, freqEnd: 880, duration: 0.18, vol: 0.26, filterType: 'lowpass', filterFreqStart: 600, filterFreqEnd: 2400 });
        this._playTone({ type: 'sine', freqStart: 880, freqEnd: 1320, duration: 0.14, vol: 0.28, delay: 0.08 });
        break;
      default:
        this.playCoin();
        break;
    }
  }

  // 2. Brick Destroy Sound
  playBrickDestroy(tier = 1) {
    if (!this.canPlay('destroy', 60)) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 250 + Math.min(tier * 35, 400);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, t + 0.04);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);

    gain.gain.setValueAtTime(this.volume * 0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  // 3. Explosion Sound (white noise burst + deep sine boom)
  playExplosion() {
    if (!this.canPlay('explosion', 120)) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Deep sub-bass boom
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, t);
    subOsc.frequency.exponentialRampToValueAtTime(30, t + 0.3);
    subGain.gain.setValueAtTime(this.volume * 0.7, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.3);

    // Noise rumble
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.linearRampToValueAtTime(120, t + 0.2);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.volume * 0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.2);
  }

  // 4. Click Brick Attack Sound
  playClickHit() {
    if (!this.canPlay('clickHit', 40)) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(this.volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  // 5. Purchase / Coin chime
  playCoin() {
    if (!this.canPlay('coin', 70)) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, t); // B5
    osc1.frequency.setValueAtTime(1318.51, t + 0.06); // E6

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1975.53, t);
    osc2.frequency.setValueAtTime(2637.02, t + 0.06);

    gain.gain.setValueAtTime(this.volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.25);
    osc2.stop(t + 0.25);
  }

  // 6. Level Up Fanfare
  playLevelUp() {
    this.ensureContext();
    if (!this.ctx || !this.enabled) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(this.volume * 0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  // 7. Prestige Cosmic Chime
  playPrestige() {
    this.ensureContext();
    if (!this.ctx || !this.enabled) return;

    const freqs = [440, 554.37, 659.25, 830.61, 1108.73];
    freqs.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 1.05, t + 0.6);

      gain.gain.setValueAtTime(this.volume * 0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.8);
    });
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  toggleMute() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// Global instance
window.soundEngine = new SoundEngine();

// Seamless audio unlock on first user gesture
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    if (window.soundEngine) {
      window.soundEngine.ensureContext();
    }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
}

