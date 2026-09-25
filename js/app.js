/**
 * MaxBet - Application Controller & Platform Orchestrator
 * Integrates Core Services (Wallet, Jackpots, Audio, Lobby) with Game Engines.
 */
class MaxBetApp {
  constructor() {
    this.messageBanner = document.getElementById('status-banner');
    this.spinBtn = document.getElementById('spin-btn');
    this.autoBtn = document.getElementById('auto-btn');
    this.isAutoSpin = false;

    // 1. Core Services
    this.wallet = new window.CasinoWallet(1000, 20);
    this.jackpots = new window.CasinoJackpots(this.wallet);
    this.meters = new window.BonusMeters(this.wallet);

    // 2. Auxiliary Engines
    this.gamble = new window.CardGambleGame(this.wallet, (amount) => {
      this.wallet.updateUI();
    });

    this.miniMines = new window.MiniMinesBonus(this.wallet, (totalWin) => {
      this.showMessage(window.i18n ? window.i18n.t('miniMinesFinished', { amount: totalWin }) : `💣 ZAVRŠEN MINES BONUS: +${totalWin}!`, 'jackpot');
      this.gamble.showTrigger(totalWin);
      this.wallet.updateUI();
      this.updateSpinButtonState();
    });

    // 3. Game Engines
    this.classicGame = new window.ClassicSlotGame(
      this.wallet,
      this.jackpots,
      (res) => this.handleSpinResult(res)
    );

    this.royalGame = new window.Royal3x3Game(
      this.wallet,
      this.jackpots,
      (res) => this.handleSpinResult(res),
      (matrix) => this.handleTriggerHoldWin(matrix)
    );

    this.minesGame = new window.MinesGame(this.wallet, this.jackpots);

    // 4. Lobby
    this.lobby = new window.CasinoLobby(this.wallet, this.jackpots);
    this.lobby.registerGame('classic', this.classicGame);
    this.lobby.registerGame('royal3x3', {
      mount: () => {
        const stage = document.querySelector('.slot-stage-scaler');
        if (stage) stage.style.display = 'flex';
        this.royalGame.mount(false);
      },
      unmount: () => this.royalGame.unmount(),
      spin: () => this.royalGame.spin(),
      get isSpinning() { return this.gameInstance.isSpinning; },
      gameInstance: this.royalGame
    });
    this.lobby.registerGame('fullfocus', {
      mount: () => {
        const stage = document.querySelector('.slot-stage-scaler');
        if (stage) stage.style.display = 'flex';
        this.royalGame.mount(true);
      },
      unmount: () => this.royalGame.unmount(),
      spin: () => this.royalGame.spin(),
      get isSpinning() { return this.gameInstance.isSpinning; },
      gameInstance: this.royalGame
    });
    this.lobby.registerGame('mines', {
      mount: () => {
        const stage = document.querySelector('.slot-stage-scaler');
        if (stage) stage.style.display = 'none';
        
        // Hide slot controls panel (Bet stepper, Max Bet, Gamble, and Big Spin button)
        const controlsPanel = document.querySelector('.controls-panel');
        if (controlsPanel) controlsPanel.style.display = 'none';

        // Hide regular slot status banner to avoid clutter
        const bannerWrap = document.querySelector('.status-banner-wrap');
        if (bannerWrap) bannerWrap.style.display = 'none';

        // Add class to container for clean vertical layout
        const container = document.querySelector('.game-container');
        if (container) container.classList.add('in-mines-mode');

        // Cancel any active auto spin
        if (this.isAutoSpin) this.toggleAutoSpin(false);

        this.minesGame.mount();
      },
      unmount: () => {
        this.minesGame.unmount();

        const stage = document.querySelector('.slot-stage-scaler');
        if (stage) stage.style.display = 'flex';

        // Restore slot controls panel and status banner
        const controlsPanel = document.querySelector('.controls-panel');
        if (controlsPanel) controlsPanel.style.display = 'flex';

        const bannerWrap = document.querySelector('.status-banner-wrap');
        if (bannerWrap) bannerWrap.style.display = 'block';

        const container = document.querySelector('.game-container');
        if (container) container.classList.remove('in-mines-mode');
      },
      spin: () => {
        if (this.minesGame.gameState === 'idle' || this.minesGame.gameState === 'cashed_out' || this.minesGame.gameState === 'exploded') {
          this.minesGame.startGame();
        } else if (this.minesGame.gameState === 'playing') {
          this.minesGame.cashout();
        }
      },
      get isSpinning() { return this.gameInstance.isSpinning; },
      gameInstance: this.minesGame
    });

    // Default Game: Classic
    this.lobby.switchGame('classic');

    this.initControls();

    // 5. Open Lobby Menu Immediately on App Entry
    if (this.lobby) {
      this.lobby.openModal();
    }

    // 6. Admin / Operator Control Panel
    if (window.AdminPanel) {
      this.adminPanel = new window.AdminPanel(this);
    }
  }

  showMessage(msg, type = 'normal') {
    if (!this.messageBanner) return;
    this.messageBanner.textContent = msg;
    this.messageBanner.className = `status-banner status-${type}`;
  }

  spin() {
    if (!this.lobby || !this.lobby.activeGame) return;
    if (this.lobby.activeGame.isSpinning || (this.miniMines && this.miniMines.isActive)) return;

    if (!this.wallet.canAffordSpin()) {
      this.showMessage(window.i18n ? window.i18n.t('notEnoughCredits') : 'NEMATE DOVOLJNO KREDITA!', 'warning');
      if (window.slotAudio) window.slotAudio.playClick();
      return;
    }

    this.gamble.hideTrigger();
    this.animateSpinButton();
    this.showMessage(window.i18n ? window.i18n.t('spinning') : 'VRTENJE U TOKU...', 'normal');

    const result = this.lobby.activeGame.spin();
    if (result && result.success !== false) {
      if (this.meters) {
        this.meters.chargeOnSpin(this.wallet.bet);
      }
    }
    this.updateSpinButtonState();
  }

  animateSpinButton() {
    if (this.spinBtn) {
      this.spinBtn.classList.remove('flash-active');
      void this.spinBtn.offsetWidth;
      this.spinBtn.classList.add('flash-active');
      setTimeout(() => {
        if (this.spinBtn) this.spinBtn.classList.remove('flash-active');
      }, 420);
    }
  }

  updateSpinButtonState() {
    if (this.spinBtn) {
      const isSpinning = (this.lobby.activeGame && this.lobby.activeGame.isSpinning) || (this.miniMines && this.miniMines.isActive);
      this.spinBtn.disabled = isSpinning;
      this.spinBtn.classList.toggle('disabled', isSpinning);
    }
  }

  handleTriggerHoldWin(sourceMatrix) {
    this.showMessage(window.i18n ? window.i18n.t('miniMinesBonusTitle') : '💎 GRAND MINES BONUS! 💣', 'jackpot');
    if (this.miniMines) {
      this.miniMines.trigger(sourceMatrix, this.wallet.bet);
    }
    this.updateSpinButtonState();
  }

  handleSpinResult(result) {
    this.updateSpinButtonState();
    if (!result) return;

    const { winAmount, winMultiplier, isDiamondBonus, winningLines } = result;

    if (winAmount > 0) {
      if (isDiamondBonus) {
        const msg = window.i18n ? window.i18n.t('freeSpinsPlusWin', { amount: winAmount }) : `💎 5 BESPLATNIH SPINOVA + ${winAmount}! 💎`;
        this.showMessage(msg, 'jackpot');
      } else if (winMultiplier >= 30) {
        this.showMessage(`${window.i18n ? window.i18n.t('bigWin') : '🎰 VELIKI DOBITAK! +'}${winAmount} 🎰`, 'jackpot');
      } else {
        const linesCount = winningLines ? winningLines.length : 1;
        const msg = (linesCount > 1) 
          ? `+${winAmount} (${linesCount} LINIJA)` 
          : `${window.i18n ? window.i18n.t('winPrefix') : 'DOBITAK: +'}${winAmount}`;
        this.showMessage(msg, 'win');
      }
      this.gamble.showTrigger(winAmount);
    } else {
      if (this.wallet.freeSpins <= 0) {
        this.showMessage(window.i18n ? window.i18n.t('tryAgain') : 'POKUŠAJTE PONOVO!', 'normal');
      }
    }

    // Check Mystery Jackpots on spin end
    this.jackpots.checkMysteryJackpot((tier, prize, msgKey) => {
      const defaultMsg = tier === 'diamond' 
        ? `💎 DIAMOND JACKPOT! +${prize.toLocaleString()} RSD! 💎`
        : (tier === 'gold' 
          ? `🏆 GOLD JACKPOT! +${prize.toLocaleString()} RSD! 🏆`
          : `🥈 SILVER JACKPOT! +${prize.toLocaleString()} RSD! 🥈`);
      this.showMessage(window.i18n ? window.i18n.t(msgKey, { amount: prize.toLocaleString() }) : defaultMsg, 'jackpot');
      this.gamble.showTrigger(prize);
    });

    // Auto-spin next cycle
    if (this.isAutoSpin) {
      if (this.wallet.canAffordSpin()) {
        setTimeout(() => {
          if (this.isAutoSpin) this.spin();
        }, 1300);
      } else {
        this.toggleAutoSpin(false);
      }
    }
  }

  toggleAutoSpin(forcedState = null) {
    if (window.slotAudio) window.slotAudio.playClick();
    this.isAutoSpin = (forcedState !== null) ? forcedState : !this.isAutoSpin;
    if (this.autoBtn) {
      this.autoBtn.classList.toggle('active', this.isAutoSpin);
      const label = this.isAutoSpin 
        ? (window.i18n ? window.i18n.t('autoSpinOn') : 'STOP') 
        : (window.i18n ? window.i18n.t('autoSpin') : 'AUTO');
      this.autoBtn.textContent = label;
    }
    if (this.isAutoSpin && (!this.lobby.activeGame || !this.lobby.activeGame.isSpinning)) {
      this.spin();
    }
  }

  initControls() {
    if (this.spinBtn) {
      this.spinBtn.addEventListener('click', () => this.spin());
    }
    if (this.autoBtn) {
      this.autoBtn.addEventListener('click', () => this.toggleAutoSpin());
    }

    const betMinusBtn = document.getElementById('bet-minus');
    const betPlusBtn = document.getElementById('bet-plus');
    const maxBetBtn = document.getElementById('max-bet-btn');
    const refillBtn = document.getElementById('refill-credits-btn');

    if (betMinusBtn) betMinusBtn.addEventListener('click', () => this.wallet.changeBet(-5));
    if (betPlusBtn) betPlusBtn.addEventListener('click', () => this.wallet.changeBet(5));
    if (maxBetBtn) maxBetBtn.addEventListener('click', () => this.wallet.setMaxBet());
    if (refillBtn) refillBtn.addEventListener('click', () => {
      this.wallet.addCredits(500);
      this.showMessage(window.i18n ? window.i18n.t('creditsAdded', { amount: 500 }) : 'DODATO +500 KREDITA!', 'gold');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const particles = new window.ParticleEngine('fx-canvas');
  window.particleEngine = particles;

  const app = new MaxBetApp();
  window.MaxBetApp = MaxBetApp;
  window.GrandSlotApp = MaxBetApp; // Backwards compatibility
  window.slotApp = app;
  window.slotGame = app; // Backwards compatibility for inspect/dev

  // Universal Responsive Scaler
  function updateSlotScale() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw <= 600;
    const isFullFocus = (app.lobby && app.lobby.activeGameId === 'fullfocus');
    const is3x3 = (app.lobby && (app.lobby.activeGameId === 'royal3x3' || isFullFocus));

    const baseW = (isFullFocus || isMobile) ? 416 : 514;
    const availW = Math.max(260, vw - ((isFullFocus || isMobile) ? 16 : 24));
    const scaleW = Math.min(1.22, availW / baseW);

    const baseH = is3x3 ? 250 : 165;
    const availH = Math.max(100, vh - 320);
    const scaleH = Math.min(1.22, availH / baseH);
    const finalScale = Math.max(0.48, Math.min(scaleW, scaleH));
    document.documentElement.style.setProperty('--slot-scale', finalScale.toFixed(4));
  }
  window.updateSlotScale = updateSlotScale;
  window.addEventListener('resize', updateSlotScale);
  window.addEventListener('orientationchange', () => setTimeout(updateSlotScale, 100));
  updateSlotScale();

  // Mechanical Lever Interaction
  const lever = document.getElementById('slot-lever');
  if (lever) {
    const leverArm = lever.querySelector('.lever-pivot-arm');
    let startY = 0;
    let currentDeltaY = 0;
    let isDragging = false;
    let justSwiped = false;

    lever.addEventListener('click', () => {
      if (justSwiped) return;
      app.spin();
    });

    lever.addEventListener('pointerdown', (e) => {
      if (app.lobby.activeGame && app.lobby.activeGame.isSpinning) return;
      startY = e.clientY;
      currentDeltaY = 0;
      isDragging = true;
      try { lever.setPointerCapture(e.pointerId); } catch (err) {}
      if (leverArm) leverArm.style.transition = 'none';
    });

    lever.addEventListener('pointermove', (e) => {
      if (!isDragging || (app.lobby.activeGame && app.lobby.activeGame.isSpinning)) return;
      const deltaY = e.clientY - startY;
      if (deltaY > 0) {
        currentDeltaY = deltaY;
        if (leverArm) {
          const pullAngle = 38 + Math.min(72, deltaY * 0.75);
          const pullScale = 1 - Math.min(0.15, (deltaY / 90) * 0.15);
          leverArm.style.transform = `rotate(${pullAngle}deg) scaleY(${pullScale})`;
        }
      }
    });

    const finishLeverDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        if (e && e.pointerId && lever.hasPointerCapture(e.pointerId)) {
          lever.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}

      if (currentDeltaY >= 25 && (!app.lobby.activeGame || !app.lobby.activeGame.isSpinning)) {
        justSwiped = true;
        setTimeout(() => { justSwiped = false; }, 450);

        if (leverArm) {
          leverArm.style.transition = 'transform 0.12s ease-in';
          leverArm.style.transform = 'rotate(110deg) scaleY(0.86)';
        }

        app.spin();

        setTimeout(() => {
          if (leverArm) {
            leverArm.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.35)';
            leverArm.style.transform = '';
            setTimeout(() => { if (leverArm) leverArm.style.transition = ''; }, 360);
          }
        }, 220);
      } else {
        if (leverArm) {
          leverArm.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.35)';
          leverArm.style.transform = '';
          setTimeout(() => { if (leverArm) leverArm.style.transition = ''; }, 260);
        }
      }
      currentDeltaY = 0;
    };

    lever.addEventListener('pointerup', finishLeverDrag);
    lever.addEventListener('pointercancel', finishLeverDrag);
  }

  // Spacebar Spin
  window.addEventListener('keydown', (e) => {
    const paytableModal = document.getElementById('paytable-modal');
    if (e.code === 'Space' && !e.repeat && (!paytableModal || !paytableModal.classList.contains('active'))) {
      e.preventDefault();
      app.spin();
    }
  });

  // Sound toggle
  const soundBtn = document.getElementById('sound-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = window.slotAudio.toggleMute();
      soundBtn.classList.toggle('muted', isMuted);
      const onIcon = soundBtn.querySelector('.sound-on-icon');
      const offIcon = soundBtn.querySelector('.sound-off-icon');
      if (onIcon && offIcon) {
        onIcon.style.display = isMuted ? 'none' : 'block';
        offIcon.style.display = isMuted ? 'block' : 'none';
      }
    });
  }

  // Language toggle
  const langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      if (window.slotAudio) window.slotAudio.playClick();
      if (window.i18n) window.i18n.toggleLanguage();
    });
  }

  // Paytable Modal
  const paytableBtn = document.getElementById('paytable-btn');
  const paytableModal = document.getElementById('paytable-modal');
  const closePaytableBtn = document.getElementById('close-paytable');
  if (paytableBtn && paytableModal) {
    paytableBtn.addEventListener('click', () => {
      if (window.slotAudio) window.slotAudio.playClick();
      paytableModal.classList.add('active');
    });
  }
  if (closePaytableBtn && paytableModal) {
    closePaytableBtn.addEventListener('click', () => {
      if (window.slotAudio) window.slotAudio.playClick();
      paytableModal.classList.remove('active');
    });
  }
  if (paytableModal) {
    paytableModal.addEventListener('click', (e) => {
      if (e.target === paytableModal) paytableModal.classList.remove('active');
    });
  }

  // PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then((reg) => reg.update())
      .catch((err) => console.error('PWA SW registration failed:', err));
  }
});
