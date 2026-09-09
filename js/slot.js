/**
 * Happy Hour Slot - 3D Cylindrical Reel Engine & Game Logic
 */
const SYMBOLS = [
  { id: 'flower', name: 'Zlatni Cvet', svg: 'assets/symbols/logo-flower.svg', weight: 4, payout3: 100, payout2: 10 },
  { id: 'bar', name: 'BAR', svg: 'assets/symbols/bar.svg', weight: 6, payout3: 40, payout2: 5 },
  { id: 'seven', name: 'Zlatna 7', svg: 'assets/symbols/seven.svg', weight: 8, payout3: 25, payout2: 3 },
  { id: 'bell', name: 'Zvono', svg: 'assets/symbols/bell.svg', weight: 12, payout3: 15, payout2: 2 },
  { id: 'coin', name: 'Zlatnik', svg: 'assets/symbols/coin.svg', weight: 15, payout3: 10, payout2: 1.5 },
  { id: 'diamond', name: 'Dijamant', svg: 'assets/symbols/diamond.svg', weight: 10, payout3: 20, payout2: 2 }
];

class SlotGame3D {
  constructor() {
    this.balance = 1000;
    this.bet = 20;
    this.minBet = 5;
    this.maxBet = 100;
    this.lastWin = 0;
    this.isSpinning = false;
    this.isAutoSpin = false;
    this.freeSpins = 0;
    this.happyHourMultiplier = 1;

    // Reel Geometry
    this.tileHeight = 72; // Height of each symbol tile in px

    // DOM Elements
    this.drumElements = [
      document.getElementById('reel-drum-1'),
      document.getElementById('reel-drum-2'),
      document.getElementById('reel-drum-3')
    ];
    this.leverEl = document.getElementById('slot-lever');
    this.spinBtn = document.getElementById('spin-btn');
    this.autoBtn = document.getElementById('auto-btn');
    this.balanceEl = document.getElementById('val-balance');
    this.betEl = document.getElementById('val-bet');
    this.winEl = document.getElementById('val-win');
    this.messageBanner = document.getElementById('status-banner');

    // Current visible 3 rows for each reel [top, center, bottom]
    // Default initial poster view: Top = BAR, Center = Star Flower, Bottom = BAR
    this.currentSymbols = [
      { top: SYMBOLS[1], center: SYMBOLS[0], bottom: SYMBOLS[1] },
      { top: SYMBOLS[1], center: SYMBOLS[0], bottom: SYMBOLS[1] },
      { top: SYMBOLS[1], center: SYMBOLS[0], bottom: SYMBOLS[1] }
    ];

    this.initReels();
    this.updateUI();
  }

  getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const sym of SYMBOLS) {
      if (rand < sym.weight) return sym;
      rand -= sym.weight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
  }

  // Initialize reel strips with 3 visible rows (Top, Center, Bottom)
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
      drum.style.transform = 'translateY(-36px)';
    }
  }

  // REAL CASINO PHYSICAL REEL SPIN EXECUTION
  // Downward rolling continuous strip with speed blur, recoil snap & clunk audio
  spin() {
    if (this.isSpinning) return;
    if (this.freeSpins <= 0 && this.balance < this.bet) {
      this.showMessage(window.i18n ? window.i18n.t('notEnoughCredits') : 'NEMATE DOVOLJNO KREDITA!', 'warning');
      window.slotAudio.playClick();
      return;
    }

    if (this.freeSpins > 0) {
      this.freeSpins--;
      const msg = window.i18n ? `${window.i18n.t('freeSpinRemaining')}${this.freeSpins}` : `BESPLATAN SPIN! (Preostalo: ${this.freeSpins})`;
      this.showMessage(msg, 'gold');
    } else {
      this.balance -= this.bet;
      this.showMessage(window.i18n ? window.i18n.t('spinning') : 'VRTENJE U TOKU...', 'normal');
    }

    this.isSpinning = true;
    this.lastWin = 0;
    this.updateUI();

    // Clear previous win highlight
    document.querySelectorAll('.reel-tile').forEach(t => t.classList.remove('win-center'));

    // Trigger illumination flash effect on the round Grandslot spin button
    if (this.spinBtn) {
      this.spinBtn.classList.remove('flash-active');
      void this.spinBtn.offsetWidth;
      this.spinBtn.classList.add('flash-active');
      setTimeout(() => {
        if (this.spinBtn) this.spinBtn.classList.remove('flash-active');
      }, 420);
    }

    // Animate mechanical lever on right hub
    if (this.leverEl) {
      this.leverEl.classList.add('pulled');
      setTimeout(() => this.leverEl.classList.remove('pulled'), 400);
    }

    window.slotAudio.playLever();
    window.slotAudio.startSpinningSound();

    // Select target symbols for the 3 reels
    const targetSymbols = [
      this.getRandomSymbol(),
      this.getRandomSymbol(),
      this.getRandomSymbol()
    ];

    const targetTops = [this.getRandomSymbol(), this.getRandomSymbol(), this.getRandomSymbol()];
    const targetBottoms = [this.getRandomSymbol(), this.getRandomSymbol(), this.getRandomSymbol()];

    // Staggered stop durations: Reel 1 (1.15s), Reel 2 (1.65s), Reel 3 (2.15s)
    const durations = [1.15, 1.65, 2.15];
    const tileCounts = [18, 24, 30];

    for (let r = 0; r < 3; r++) {
      const drum = this.drumElements[r];
      const targetSym = targetSymbols[r];
      const targetTop = targetTops[r];
      const targetBottom = targetBottoms[r];
      const count = tileCounts[r];

      // Build continuous reel strip:
      // Index 0: targetTop
      // Index 1: targetCenter (The landing result!)
      // Index 2: targetBottom
      // Indices 3 to count - 4: Fast scrolling randomized symbols
      // Indices count - 3 to count - 1: Previous visible [top, center, bottom]
      const stripTiles = new Array(count);
      stripTiles[0] = targetTop;
      stripTiles[1] = targetSym;
      stripTiles[2] = targetBottom;

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

      // Set initial position: aligned with the starting visible symbol (index count - 2)
      const startY = 36 - (count - 2) * this.tileHeight;
      drum.style.transition = 'none';
      drum.style.transform = `translateY(${startY}px)`;
      drum.offsetHeight; // Force layout reflow

      // Phase 1: Mechanical Anticipation - quick 18px pull-up
      const kickY = startY - 18;
      drum.style.transition = 'transform 0.11s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      drum.style.transform = `translateY(${kickY}px)`;

      // Phase 2: High-speed continuous downward roll
      setTimeout(() => {
        drum.classList.add('spinning');
        const targetY = 36 - 1 * this.tileHeight; // -36px, centers target at index 1
        const overshootY = targetY + 14; // Overshoot downward for physical bounce
        const dur = durations[r];

        // Smooth physics curve: explosive start -> high speed stream -> graceful deceleration
        drum.style.transition = `transform ${dur}s cubic-bezier(0.12, 0.78, 0.28, 1.0)`;
        drum.style.transform = `translateY(${overshootY}px)`;

        // Phase 3: Landing snap, physical recoil bounce & clunk audio
        setTimeout(() => {
          drum.classList.remove('spinning');
          window.slotAudio.playReelStop(r);

          // Spring bounce back into exact locked center
          drum.style.transition = 'transform 0.14s cubic-bezier(0.175, 0.885, 0.32, 1.45)';
          drum.style.transform = `translateY(${targetY}px)`;

          // Save current state for next spin
          this.currentSymbols[r] = { top: targetTop, center: targetSym, bottom: targetBottom };

          // Final reel (Reel 3) stopped handler
          if (r === 2) {
            window.slotAudio.stopSpinningSound();
            setTimeout(() => {
              this.evaluateResults(targetSymbols);
            }, 200);
          }
        }, dur * 1000);
      }, 110);
    }
  }

  // Payout calculation
  evaluateResults(results) {
    this.isSpinning = false;
    const [s1, s2, s3] = results;
    let winMultiplier = 0;
    let winType = '';
    let winningReels = [];

    // 3 of a kind
    if (s1.id === s2.id && s2.id === s3.id) {
      winMultiplier = s1.payout3;
      winType = window.i18n ? window.i18n.t(`combo_${s1.id}_3x`) : `3x ${s1.name.toUpperCase()}!`;
      winningReels = [0, 1, 2];
    }
    // 2 of a kind
    else if (s1.id === s2.id) {
      winMultiplier = s1.payout2;
      winType = window.i18n ? window.i18n.t(`combo_${s1.id}_2x`) : `2x ${s1.name.toUpperCase()}!`;
      winningReels = [0, 1];
    } else if (s2.id === s3.id) {
      winMultiplier = s2.payout2;
      winType = window.i18n ? window.i18n.t(`combo_${s2.id}_2x`) : `2x ${s2.name.toUpperCase()}!`;
      winningReels = [1, 2];
    } else if (s1.id === s3.id) {
      winMultiplier = s1.payout2;
      winType = window.i18n ? window.i18n.t(`combo_${s1.id}_2x`) : `2x ${s1.name.toUpperCase()}!`;
      winningReels = [0, 2];
    }
    // Any Flower + BAR combo
    else if (
      (s1.id === 'bar' || s1.id === 'flower') &&
      (s2.id === 'bar' || s2.id === 'flower') &&
      (s3.id === 'bar' || s3.id === 'flower')
    ) {
      winMultiplier = 5;
      winType = window.i18n ? window.i18n.t('combo_flower_bar') : 'CVET & BAR KOMBO!';
      winningReels = [0, 1, 2];
    }

    // 3 Diamonds trigger Free Spins
    const diamondCount = [s1, s2, s3].filter(s => s.id === 'diamond').length;
    const isDiamondBonus = (diamondCount === 3);
    if (isDiamondBonus) {
      this.freeSpins += 5;
    }

    if (winMultiplier > 0) {
      const totalWin = Math.round(this.bet * winMultiplier * this.happyHourMultiplier);
      this.balance += totalWin;
      this.lastWin = totalWin;

      if (isDiamondBonus) {
        const msg = window.i18n 
          ? window.i18n.t('freeSpinsPlusWin', { amount: totalWin }) 
          : `💎 5 BESPLATNIH SPINOVA + ${totalWin}! 💎`;
        this.showMessage(msg, 'jackpot');
        window.slotAudio.playJackpot();
        if (window.particleEngine) window.particleEngine.spawnCelebration(true);
      } else {
        const isJackpot = winMultiplier >= 40 || s1.id === 'flower';
        if (isJackpot) {
          this.showMessage(`${window.i18n ? window.i18n.t('bigWin') : '🎰 VELIKI DOBITAK! +'}${totalWin} 🎰`, 'jackpot');
          window.slotAudio.playJackpot();
          if (window.particleEngine) window.particleEngine.spawnCelebration(true);
        } else {
          const prefix = window.i18n ? window.i18n.t('winPrefix') : 'DOBITAK: +';
          this.showMessage(`${prefix}${totalWin} (${winType})`, 'win');
          window.slotAudio.playWin();
          if (window.particleEngine) window.particleEngine.spawnCelebration(false);
        }
      }

      // Highlight winning center tiles
      this.highlightWinningTiles(winningReels);
    } else {
      if (this.freeSpins <= 0) {
        this.showMessage(window.i18n ? window.i18n.t('tryAgain') : 'POKUŠAJTE PONOVO!', 'normal');
      }
    }

    this.updateUI();

    // Auto spin handling
    if (this.isAutoSpin) {
      if (this.balance >= this.bet || this.freeSpins > 0) {
        setTimeout(() => {
          if (this.isAutoSpin) this.spin();
        }, 1200);
      } else {
        this.toggleAutoSpin(false);
      }
    }
  }

  highlightWinningTiles(indices = [0, 1, 2]) {
    indices.forEach(r => {
      const drum = this.drumElements[r];
      if (drum) {
        const winTile = drum.querySelector('.reel-tile[data-idx="1"]');
        if (winTile) winTile.classList.add('win-center');
      }
    });
  }

  showMessage(msg, type = 'normal') {
    if (!this.messageBanner) return;
    this.messageBanner.textContent = msg;
    this.messageBanner.className = `status-banner status-${type}`;
  }

  changeBet(delta) {
    if (this.isSpinning) return;
    window.slotAudio.playClick();
    this.bet = Math.max(this.minBet, Math.min(this.maxBet, this.bet + delta));
    this.updateUI();
  }

  setMaxBet() {
    if (this.isSpinning) return;
    window.slotAudio.playClick();
    this.bet = this.maxBet;
    this.updateUI();
  }

  toggleAutoSpin(forcedState = null) {
    window.slotAudio.playClick();
    this.isAutoSpin = (forcedState !== null) ? forcedState : !this.isAutoSpin;
    if (this.autoBtn) {
      this.autoBtn.classList.toggle('active', this.isAutoSpin);
      const label = this.isAutoSpin 
        ? (window.i18n ? window.i18n.t('autoSpinOn') : 'STOP') 
        : (window.i18n ? window.i18n.t('autoSpin') : 'AUTO');
      this.autoBtn.textContent = label;
    }
    if (this.isAutoSpin && !this.isSpinning) {
      this.spin();
    }
  }

  addCredits(amount = 500) {
    window.slotAudio.playCoinDrop();
    this.balance += amount;
    this.showMessage(window.i18n ? window.i18n.t('creditsAdded', { amount }) : `DODATO +${amount} KREDITA!`, 'gold');
    this.updateUI();
  }

  onLanguageChanged() {
    if (!this.isSpinning && this.lastWin === 0) {
      this.showMessage(window.i18n ? window.i18n.t('ready') : 'SPREMNI ZA IGRU!', 'normal');
    }
    if (this.autoBtn) {
      const label = this.isAutoSpin 
        ? (window.i18n ? window.i18n.t('autoSpinOn') : 'STOP') 
        : (window.i18n ? window.i18n.t('autoSpin') : 'AUTO');
      this.autoBtn.textContent = label;
    }
    this.updateUI();
  }

  updateUI() {
    if (this.balanceEl) this.balanceEl.textContent = this.balance.toLocaleString();
    if (this.betEl) this.betEl.textContent = this.bet.toLocaleString();
    if (this.winEl) this.winEl.textContent = this.lastWin.toLocaleString();
    if (this.spinBtn) {
      this.spinBtn.disabled = this.isSpinning;
      this.spinBtn.classList.toggle('disabled', this.isSpinning);
    }
  }
}

window.SlotGame = SlotGame3D;
