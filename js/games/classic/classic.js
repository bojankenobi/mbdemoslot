/**
 * Classic 1-Line Slot Machine Engine
 * 3D Golden Cylinder with Mechanical Lever and single center payline.
 */
class ClassicSlotGame {
  constructor(wallet, jackpots, onSpinComplete) {
    this.wallet = wallet;
    this.jackpots = jackpots;
    this.onSpinComplete = onSpinComplete;
    this.isSpinning = false;
    this.tileHeight = 72;
    this.restingY = -36; // Centered for 1-line

    this.assemblyWrap = document.querySelector('.slot-assembly-wrap');
    this.drumElements = [
      document.getElementById('reel-drum-1'),
      document.getElementById('reel-drum-2'),
      document.getElementById('reel-drum-3')
    ];
    this.viewport3 = document.getElementById('viewport-3');
    this.leverEl = document.getElementById('slot-lever');

    this.currentSymbols = [
      { top: CLASSIC_SYMBOLS[0], center: CLASSIC_SYMBOLS[6], bottom: CLASSIC_SYMBOLS[1] },
      { top: CLASSIC_SYMBOLS[2], center: CLASSIC_SYMBOLS[6], bottom: CLASSIC_SYMBOLS[3] },
      { top: CLASSIC_SYMBOLS[4], center: CLASSIC_SYMBOLS[6], bottom: CLASSIC_SYMBOLS[5] }
    ];
    this.spinTimeouts = [];
  }

  clearSpinTimeouts() {
    this.spinTimeouts.forEach(t => clearTimeout(t));
    this.spinTimeouts = [];
  }

  mount() {
    this.clearSpinTimeouts();
    this.isSpinning = false;
    if (this.assemblyWrap) {
      this.assemblyWrap.classList.remove('game-mode-3x3', 'game-mode-fullfocus');
      this.assemblyWrap.classList.add('game-mode-classic');
    }
    const stageArea = document.querySelector('.stage-area');
    if (stageArea) {
      stageArea.classList.remove('has-3x3', 'has-fullfocus');
    }
    const stageScaler = document.querySelector('.slot-stage-scaler');
    if (stageScaler) {
      stageScaler.classList.remove('is-fullfocus');
    }
    this.initReels();
  }

  unmount() {
    this.clearSpinTimeouts();
    this.isSpinning = false;
    this.clearHighlights();
  }

  initReels() {
    for (let r = 0; r < 3; r++) {
      const drum = this.drumElements[r];
      if (!drum) continue;
      const s = this.currentSymbols[r];

      drum.innerHTML = `
        <div class="reel-tile" data-idx="0" data-row="top">
          <img src="${s.top.svg}" alt="${s.top.name}" class="symbol-img" />
        </div>
        <div class="reel-tile" data-idx="1" data-row="center">
          <img src="${s.center.svg}" alt="${s.center.name}" class="symbol-img" />
        </div>
        <div class="reel-tile" data-idx="2" data-row="bottom">
          <img src="${s.bottom.svg}" alt="${s.bottom.name}" class="symbol-img" />
        </div>
      `;
      drum.style.transition = 'none';
      drum.style.transform = `translateY(${this.restingY}px)`;
    }
  }

  clearHighlights() {
    document.querySelectorAll('.reel-tile').forEach(t => {
      t.classList.remove('win-center', 'win-line');
    });
    if (this.viewport3) this.viewport3.classList.remove('near-miss-active');
  }

  getRandomSymbol() {
    const totalWeight = CLASSIC_SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const sym of CLASSIC_SYMBOLS) {
      if (rand < sym.weight) return sym;
      rand -= sym.weight;
    }
    return CLASSIC_SYMBOLS[CLASSIC_SYMBOLS.length - 1];
  }

  spin() {
    if (this.isSpinning) return;
    if (!this.wallet.canAffordSpin()) {
      if (window.slotAudio) window.slotAudio.playClick();
      return { success: false, reason: 'NO_CREDITS' };
    }

    const spinTx = this.wallet.deductSpinBet();
    if (!spinTx) return { success: false, reason: 'NO_CREDITS' };

    this.isSpinning = true;
    this.clearHighlights();

    if (this.jackpots) {
      this.jackpots.incrementOnSpin(this.wallet.bet);
    }

    // Animate mechanical lever
    if (this.leverEl) {
      this.leverEl.classList.add('pulled');
      setTimeout(() => this.leverEl.classList.remove('pulled'), 400);
    }

    if (window.slotAudio) {
      window.slotAudio.playLever();
      window.slotAudio.startSpinningSound();
    }

    const targetMatrix = [
      { top: this.getRandomSymbol(), center: this.getRandomSymbol(), bottom: this.getRandomSymbol() },
      { top: this.getRandomSymbol(), center: this.getRandomSymbol(), bottom: this.getRandomSymbol() },
      { top: this.getRandomSymbol(), center: this.getRandomSymbol(), bottom: this.getRandomSymbol() }
    ];

    const r0Center = targetMatrix[0].center;
    const r1Center = targetMatrix[1].center;
    const isBigJackpotCombo = (r0Center.id === r1Center.id && ['flower', 'crown', 'seven', 'bar'].includes(r0Center.id));
    const isNearMiss = isBigJackpotCombo;

    const reel3Duration = isNearMiss ? 3.2 : 2.15;
    const durations = [1.1, 1.5, reel3Duration];
    const tileCounts = [20, 26, isNearMiss ? 46 : 32];

    this.clearSpinTimeouts();

    for (let r = 0; r < 3; r++) {
      const drum = this.drumElements[r];
      const res = targetMatrix[r];
      const count = tileCounts[r];

      const stripTiles = new Array(count);
      stripTiles[0] = res.top;
      stripTiles[1] = res.center;
      stripTiles[2] = res.bottom;

      for (let i = 3; i < count - 3; i++) {
        stripTiles[i] = this.getRandomSymbol();
      }

      stripTiles[count - 3] = this.currentSymbols[r].top;
      stripTiles[count - 2] = this.currentSymbols[r].center;
      stripTiles[count - 1] = this.currentSymbols[r].bottom;

      drum.innerHTML = stripTiles.map((sym, idx) => `
        <div class="reel-tile" data-idx="${idx}">
          <img src="${sym.svg}" alt="${sym.name}" class="symbol-img" />
        </div>
      `).join('');

      const startY = this.restingY - (count - 3) * this.tileHeight;
      drum.style.transition = 'none';
      drum.style.transform = `translateY(${startY}px)`;
      void drum.offsetWidth;

      const kickY = startY - 18;
      drum.style.transition = 'transform 0.11s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      drum.style.transform = `translateY(${kickY}px)`;

      const dur = durations[r];
      const targetY = this.restingY;
      const overshootY = targetY + 14;

      const t1 = setTimeout(() => {
        drum.classList.add('spinning');

        if (r === 2 && isNearMiss) {
          if (this.viewport3) this.viewport3.classList.add('near-miss-active');
          try {
            if (window.slotAudio && window.slotAudio.playNearMissTension) {
              window.slotAudio.playNearMissTension();
            }
          } catch (e) {}
        }

        drum.style.transition = `transform ${dur}s cubic-bezier(0.12, 0.78, 0.28, 1.0)`;
        drum.style.transform = `translateY(${overshootY}px)`;

        const t2 = setTimeout(() => {
          drum.classList.remove('spinning');
          try {
            if (window.slotAudio) window.slotAudio.playReelStop(r);
          } catch (e) {}

          drum.style.transition = 'transform 0.14s cubic-bezier(0.175, 0.885, 0.32, 1.45)';
          drum.style.transform = `translateY(${targetY}px)`;
          this.currentSymbols[r] = res;

          const t3 = setTimeout(() => {
            drum.innerHTML = `
              <div class="reel-tile" data-idx="0" data-row="top">
                <img src="${res.top.svg}" alt="${res.top.name}" class="symbol-img" />
              </div>
              <div class="reel-tile" data-idx="1" data-row="center">
                <img src="${res.center.svg}" alt="${res.center.name}" class="symbol-img" />
              </div>
              <div class="reel-tile" data-idx="2" data-row="bottom">
                <img src="${res.bottom.svg}" alt="${res.bottom.name}" class="symbol-img" />
              </div>
            `;
            drum.style.transition = 'none';
            drum.style.transform = `translateY(${this.restingY}px)`;
          }, 150);
          this.spinTimeouts.push(t3);

          if (r === 2) {
            if (this.viewport3) this.viewport3.classList.remove('near-miss-active');
            try {
              if (window.slotAudio) window.slotAudio.stopSpinningSound();
            } catch (e) {}

            const t4 = setTimeout(() => {
              this.evaluateResults([targetMatrix[0].center, targetMatrix[1].center, targetMatrix[2].center], targetMatrix);
            }, 220);
            this.spinTimeouts.push(t4);
          }
        }, dur * 1000);
        this.spinTimeouts.push(t2);
      }, 110);
      this.spinTimeouts.push(t1);
    }

    const maxSpinTime = (Math.max(...durations) + 1.2) * 1000;
    const tMax = setTimeout(() => {
      try { if (window.slotAudio) window.slotAudio.stopSpinningSound(); } catch (e) {}
      if (this.viewport3) this.viewport3.classList.remove('near-miss-active');
      if (this.isSpinning) {
        this.isSpinning = false;
        if (this.onSpinComplete) this.onSpinComplete(null);
      }
    }, maxSpinTime);
    this.spinTimeouts.push(tMax);

    return { success: true, isFree: spinTx.isFree };
  }

  evaluateResults(centerSymbols, fullMatrix) {
    this.isSpinning = false;
    let winMultiplier = 0;
    let winAmount = 0;
    let winningReels = [];
    try {
      const [s1, s2, s3] = centerSymbols;
      if (s1 && s2 && s3) {
        if (s1.id === s2.id && s2.id === s3.id) {
          winMultiplier = s1.payout3;
          winningReels = [0, 1, 2];
        } else if (s1.id === s2.id) {
          winMultiplier = s1.payout2;
          winningReels = [0, 1];
        } else if (s2.id === s3.id) {
          winMultiplier = s2.payout2;
          winningReels = [1, 2];
        } else if (s1.id === s3.id) {
          winMultiplier = s1.payout2;
          winningReels = [0, 2];
        }
      }

      if (winMultiplier > 0) {
        winAmount = Math.round(this.wallet.bet * winMultiplier * this.wallet.happyHourMultiplier);
        this.wallet.addWin(winAmount);

        winningReels.forEach(r => {
          const drum = this.drumElements[r];
          if (drum) {
            const centerTile = drum.querySelector('.reel-tile[data-row="center"]');
            if (centerTile) centerTile.classList.add('win-center');
          }
        });

        if (winMultiplier >= 30) {
          if (window.slotAudio) window.slotAudio.playJackpot();
          if (window.particleEngine) window.particleEngine.spawnCelebration(true);
        } else {
        if (window.slotAudio) window.slotAudio.playWin();
        if (window.particleEngine) window.particleEngine.spawnCelebration(false);
      }
    }
  } catch (err) {
    console.error('Error in classic evaluateResults:', err);
  } finally {
    this.isSpinning = false;
    if (this.onSpinComplete) {
      this.onSpinComplete({
        game: 'classic',
        winAmount,
        winMultiplier,
        fullMatrix
      });
    }
  }
}
}

window.ClassicSlotGame = ClassicSlotGame;
