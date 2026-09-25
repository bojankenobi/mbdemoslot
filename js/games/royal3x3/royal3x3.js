/**
 * Royal 3x3 Slot Game Engine
 * 3x3 Matrix, 5 Fixed Neon Paylines, Full Focus Mode, Diamond Free Spins and Hold & Win Hook.
 */
class Royal3x3Game {
  constructor(wallet, jackpots, onSpinComplete, onTriggerHoldWin) {
    this.wallet = wallet;
    this.jackpots = jackpots;
    this.onSpinComplete = onSpinComplete;
    this.onTriggerHoldWin = onTriggerHoldWin;
    this.isSpinning = false;
    this.isFullFocus = false;
    this.tileHeight = 72;
    this.restingY = 7; // In 230px drum height: (230 - 216)/2 = 7px

    this.assemblyWrap = document.querySelector('.slot-assembly-wrap');
    this.drumElements = [
      document.getElementById('reel-drum-1'),
      document.getElementById('reel-drum-2'),
      document.getElementById('reel-drum-3')
    ];
    this.viewport3 = document.getElementById('viewport-3');
    this.paylinesOverlay = document.getElementById('paylines-overlay');
    this.leverEl = document.getElementById('slot-lever');

    this.currentSymbols = [
      { top: ROYAL_SYMBOLS[0], center: ROYAL_SYMBOLS[1], bottom: ROYAL_SYMBOLS[2] },
      { top: ROYAL_SYMBOLS[3], center: ROYAL_SYMBOLS[4], bottom: ROYAL_SYMBOLS[5] },
      { top: ROYAL_SYMBOLS[6], center: ROYAL_SYMBOLS[7], bottom: ROYAL_SYMBOLS[0] }
    ];
    this.spinTimeouts = [];
  }

  clearSpinTimeouts() {
    this.spinTimeouts.forEach(t => clearTimeout(t));
    this.spinTimeouts = [];
  }

  mount(isFullFocus = false) {
    this.clearSpinTimeouts();
    this.isSpinning = false;
    this.isFullFocus = isFullFocus;
    if (this.assemblyWrap) {
      this.assemblyWrap.classList.remove('game-mode-classic');
      this.assemblyWrap.classList.toggle('game-mode-3x3', !isFullFocus);
      this.assemblyWrap.classList.toggle('game-mode-fullfocus', isFullFocus);
    }
    const stageArea = document.querySelector('.stage-area');
    if (stageArea) {
      stageArea.classList.toggle('has-3x3', !isFullFocus);
      stageArea.classList.toggle('has-fullfocus', isFullFocus);
    }
    this.initReels();
  }

  unmount() {
    this.clearPaylines();
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

  clearPaylines() {
    if (this.paylinesOverlay) {
      this.paylinesOverlay.innerHTML = '';
    }
    document.querySelectorAll('.reel-tile').forEach(t => {
      t.classList.remove('win-line', 'win-center');
    });
    if (this.viewport3) this.viewport3.classList.remove('near-miss-active');
  }

  drawPaylines(winningLines) {
    if (!this.paylinesOverlay || !winningLines || winningLines.length === 0) return;

    const colX = [50, 152, 254];
    const rowY = [36, 108, 180];

    let svgHtml = '';
    winningLines.forEach((line) => {
      const p0 = `${colX[0]},${rowY[line.rows[0]]}`;
      const p1 = `${colX[1]},${rowY[line.rows[1]]}`;
      const p2 = `${colX[2]},${rowY[line.rows[2]]}`;
      svgHtml += `<polyline points="${p0} ${p1} ${p2}" class="payline-svg-path" />`;

      for (let r = 0; r < 3; r++) {
        const rowIdx = line.rows[r];
        const drum = this.drumElements[r];
        if (drum) {
          const tile = drum.querySelector(`.reel-tile[data-idx="${rowIdx}"]`);
          if (tile) tile.classList.add('win-line');
        }
      }
    });

    this.paylinesOverlay.innerHTML = svgHtml;
  }

  getRandomSymbol() {
    const totalWeight = ROYAL_SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const sym of ROYAL_SYMBOLS) {
      if (rand < sym.weight) return sym;
      rand -= sym.weight;
    }
    return ROYAL_SYMBOLS[ROYAL_SYMBOLS.length - 1];
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
    this.clearPaylines();

    if (this.jackpots) {
      this.jackpots.incrementOnSpin(this.wallet.bet);
    }

    if (!this.isFullFocus && this.leverEl) {
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

    const coinCountFirstTwo = [targetMatrix[0].top, targetMatrix[0].center, targetMatrix[0].bottom,
                               targetMatrix[1].top, targetMatrix[1].center, targetMatrix[1].bottom].filter(s => s.id === 'coin').length;
    const r0Center = targetMatrix[0].center;
    const r1Center = targetMatrix[1].center;
    const isBigCombo = (r0Center.id === r1Center.id && ['flower', 'crown', 'seven', 'bar'].includes(r0Center.id));
    const isNearMiss = isBigCombo || (coinCountFirstTwo >= 2);

    const reel3Duration = isNearMiss ? 3.4 : 2.15;
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
              // Check Hold & Win condition (3+ coins)
              let totalCoins = 0;
              for (let c = 0; c < 3; c++) {
                if (targetMatrix[c].top.id === 'coin') totalCoins++;
                if (targetMatrix[c].center.id === 'coin') totalCoins++;
                if (targetMatrix[c].bottom.id === 'coin') totalCoins++;
              }

              // Mini-Mines bonus is STRICTLY available only when the Emerald Mines bar is 100% full (active frenzy)!
              const isMinesUnlocked = (window.slotApp && window.slotApp.meters && window.slotApp.meters.isMinesUnlocked());
              
              if (isMinesUnlocked && totalCoins >= 2 && this.onTriggerHoldWin) {
                this.isSpinning = false;
                this.onTriggerHoldWin(targetMatrix);
              } else {
                this.evaluateResults3x3(targetMatrix);
              }
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

  evaluateResults3x3(matrix) {
    this.isSpinning = false;
    let totalWinMultiplier = 0;
    const winningLines = [];
    let diamondCount = 0;
    let totalWin = 0;

    try {
      for (let r = 0; r < 3; r++) {
        ['top', 'center', 'bottom'].forEach(row => {
          if (matrix[r] && matrix[r][row] && matrix[r][row].id === 'diamond') diamondCount++;
        });
      }

      ROYAL_PAYLINES.forEach(line => {
        const s0 = line.rows[0] === 0 ? matrix[0].top : (line.rows[0] === 1 ? matrix[0].center : matrix[0].bottom);
        const s1 = line.rows[1] === 0 ? matrix[1].top : (line.rows[1] === 1 ? matrix[1].center : matrix[1].bottom);
        const s2 = line.rows[2] === 0 ? matrix[2].top : (line.rows[2] === 1 ? matrix[2].center : matrix[2].bottom);

        let lineMult = 0;
        if (s0 && s1 && s2) {
          if (s0.id === s1.id && s1.id === s2.id) {
            lineMult = s0.payout3;
          } else if (s0.id === s1.id) {
            lineMult = s0.payout2;
          }
        }

        if (lineMult > 0) {
          totalWinMultiplier += lineMult;
          winningLines.push(line);
        }
      });

      const isDiamondBonus = (diamondCount >= 3);
      if (isDiamondBonus) {
        this.wallet.addFreeSpins(5);
      }

      if (totalWinMultiplier > 0) {
        const lineBet = Math.max(1, Math.round(this.wallet.bet / 5));
        totalWin = Math.round(lineBet * totalWinMultiplier * this.wallet.happyHourMultiplier);
        this.wallet.addWin(totalWin);
        this.drawPaylines(winningLines);

        if (isDiamondBonus || totalWinMultiplier >= 30) {
          if (window.slotAudio) window.slotAudio.playJackpot();
          if (window.particleEngine) window.particleEngine.spawnCelebration(true);
        } else {
          if (window.slotAudio) window.slotAudio.playWin();
          if (window.particleEngine) window.particleEngine.spawnCelebration(false);
        }
      }
    } catch (err) {
      console.error('Error in evaluateResults3x3:', err);
    } finally {
      this.isSpinning = false;
      if (this.onSpinComplete) {
        this.onSpinComplete({
          game: this.isFullFocus ? 'fullfocus' : 'royal3x3',
          winAmount: totalWin,
          winMultiplier: totalWinMultiplier,
          winningLines,
          isDiamondBonus: diamondCount >= 3,
          fullMatrix: matrix
        });
      }
    }
  }
}

window.Royal3x3Game = Royal3x3Game;
