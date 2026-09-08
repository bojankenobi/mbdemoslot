/**
 * Happy Hour Slot - Web Audio API Synthesizer
 * Produces crisp, casino-grade sound effects without external audio files.
 */
class SlotAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.spinInterval = null;
    this.initContext();
  }

  initContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  ensureAudio() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Click / Beep for buttons
  playClick() {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Lever pull ratchet sound
  playLever() {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300 + i * 50, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }, i * 40);
    }
  }

  // Continuous spinning reel sound
  startSpinningSound() {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    this.stopSpinningSound();
    let tickCount = 0;
    this.spinInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'square';
      // alternating subtle frequencies for rolling sensation
      osc.frequency.setValueAtTime(140 + (tickCount % 2) * 40, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
      tickCount++;
    }, 70);
  }

  stopSpinningSound() {
    if (this.spinInterval) {
      clearInterval(this.spinInterval);
      this.spinInterval = null;
    }
  }

  // Reel Stop thud
  playReelStop(index = 0) {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Low frequency punch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120 + index * 30, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    // High metal snap
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = 'triangle';
    click.frequency.setValueAtTime(1200, now);
    click.frequency.exponentialRampToValueAtTime(200, now + 0.03);
    clickGain.gain.setValueAtTime(0.15, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    click.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    click.start(now);
    click.stop(now + 0.03);
  }

  // Win chime
  playWin() {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      }, idx * 100);
    });
  }

  // Jackpot / Huge Win fanfare & coins
  playJackpot() {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    const fanfare = [
      { f: 523.25, d: 150 }, // C5
      { f: 523.25, d: 150 }, // C5
      { f: 523.25, d: 150 }, // C5
      { f: 659.25, d: 350 }, // E5
      { f: 783.99, d: 300 }, // G5
      { f: 1046.50, d: 700 } // C6
    ];

    let delay = 0;
    fanfare.forEach((item) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sawtooth';
        osc2.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, now);
        osc2.frequency.setValueAtTime(item.f * 1.005, now); // slight chorus

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + item.d / 1000);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + item.d / 1000);
        osc2.stop(now + item.d / 1000);
      }, delay);
      delay += item.d;
    });

    // Metallic coin shower sounds
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        this.playCoinDrop();
      }, 500 + i * 90);
    }
  }

  // Coin drop / ting sound
  playCoinDrop() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    const freqs = [1800, 2200, 2600, 3100];
    const f = freqs[Math.floor(Math.random() * freqs.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }
}

window.slotAudio = new SlotAudio();
