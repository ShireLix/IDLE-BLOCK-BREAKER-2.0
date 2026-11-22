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

  // 1. Ball Hit Sound (customized per ball type)
  playHit(ballType = 'normal') {
    if (!this.canPlay('hit_' + ballType, 50)) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    let startFreq = 480;
    let endFreq = 260;
    let type = 'sine';
    let duration = 0.05;
    let vol = this.volume * 0.35;

    switch (ballType) {
      case 'heavy':
      case 'strong':
        type = 'triangle';
        startFreq = 165;
        endFreq = 65;
        duration = 0.095;
        vol = this.volume * 0.55;
        break;
      case 'speedy':
      case 'fast':
        type = 'sine';
        startFreq = 780;
        endFreq = 480;
        duration = 0.032;
        vol = this.volume * 0.22;
        break;
      case 'multiply':
        type = 'triangle';
        startFreq = 600;
        endFreq = 920;
        duration = 0.045;
        vol = this.volume * 0.28;
        break;
      case 'ghost':
        type = 'sine';
        startFreq = 540;
        endFreq = 680;
        duration = 0.055;
        vol = this.volume * 0.22;
        break;
      case 'piercing_special':
        type = 'sawtooth';
        startFreq = 720;
        endFreq = 1100;
        duration = 0.04;
        vol = this.volume * 0.28;
        break;
      case 'rocket':
        type = 'square';
        startFreq = 260;
        endFreq = 85;
        duration = 0.085;
        vol = this.volume * 0.45;
        break;
      case 'poison':
        type = 'sine';
        startFreq = 340;
        endFreq = 220;
        duration = 0.06;
        vol = this.volume * 0.3;
        break;
      case 'superball':
      case 'turbo':
        type = 'sawtooth';
        startFreq = 420;
        endFreq = 980;
        duration = 0.04;
        vol = this.volume * 0.24;
        break;
      default:
        type = 'sine';
        startFreq = 480;
        endFreq = 260;
        break;
    }

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + duration);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
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

