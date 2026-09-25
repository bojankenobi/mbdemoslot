/**
 * Hold & Win Bonus Game Module
 * Triggered by 3+ coins, features 3 respins with sticky gold coins and animated vortex respins.
 */
class HoldAndWinGame {
  constructor(wallet, onComplete) {
    this.wallet = wallet;
    this.onComplete = onComplete;
    this.isActive = false;
    this.respinsLeft = 3;
    this.tiles = new Array(9).fill(null);
    this.total = 0;

    this.modal = document.getElementById('hold-win-modal');
    this.grid = document.getElementById('hold-win-grid');
    this.spinBtn = document.getElementById('hw-spin-btn');
    this.totalEl = document.getElementById('hw-total-amount');
    this.respinsPips = document.getElementById('respins-pips');

    this.jSilverVal = document.getElementById('j-silver-val');
    this.jGoldVal = document.getElementById('j-gold-val');
    this.jDiamondVal = document.getElementById('j-diamond-val');

    if (this.spinBtn) {
      this.spinBtn.addEventListener('click', () => this.executeRespin());
    }
  }

  trigger(sourceMatrix, bet) {
    this.isActive = true;
    this.respinsLeft = 3;
    this.tiles = new Array(9).fill(null);
    this.total = 0;
    this.bet = bet;

    // Display mini-jackpot reward badges
    if (this.jSilverVal) this.jSilverVal.textContent = (this.bet * 30).toLocaleString();
    if (this.jGoldVal) this.jGoldVal.textContent = (this.bet * 75).toLocaleString();
    if (this.jDiamondVal) this.jDiamondVal.textContent = (this.bet * 300).toLocaleString();

    // Map landing coins into the 9 tiles
    let tileIdx = 0;
    for (let row of ['top', 'center', 'bottom']) {
      for (let c = 0; c < 3; c++) {
        if (sourceMatrix[c][row].id === 'coin') {
          const coinVal = this.bet * (Math.floor(Math.random() * 4) + 2);
          this.tiles[tileIdx] = { val: coinVal };
          this.total += coinVal;
        }
        tileIdx++;
      }
    }

    if (window.slotAudio) window.slotAudio.playJackpot();
    if (window.particleEngine) window.particleEngine.spawnCelebration(true);

    this.renderGrid();
    this.updateUI();

    if (this.modal) this.modal.classList.add('active');
  }

  updateUI() {
    if (this.totalEl) this.totalEl.textContent = this.total.toLocaleString();
    if (this.respinsPips) {
      const pips = this.respinsPips.querySelectorAll('.respin-pip');
      pips.forEach((pip, idx) => {
        pip.classList.toggle('active', idx < this.respinsLeft);
      });
    }
  }

  renderGrid() {
    if (!this.grid) return;
    const tilesEls = this.grid.querySelectorAll('.hw-tile');
    tilesEls.forEach((tile, idx) => {
      const data = this.tiles[idx];
      tile.className = 'hw-tile';
      if (data) {
        tile.classList.add('locked');
        let jpTagClass = '';
        let displayVal = `+${data.val.toLocaleString()}`;

        if (data.isJackpot === 'SILVER') {
          tile.classList.add('is-silver-jackpot');
          jpTagClass = 'jp-tag-silver';
          displayVal = '🥈 SILVER';
        } else if (data.isJackpot === 'GOLD') {
          tile.classList.add('is-gold-jackpot');
          jpTagClass = 'jp-tag-gold';
          displayVal = '🏆 GOLD';
        } else if (data.isJackpot === 'DIAMOND') {
          tile.classList.add('is-diamond-jackpot');
          jpTagClass = 'jp-tag-diamond';
          displayVal = '💎 DIAMOND';
        }

        tile.innerHTML = `
          <div class="hw-coin-wrapper">
            <img src="assets/symbols/coin.svg" alt="Coin" class="hw-coin-img" />
            <span class="hw-coin-val ${jpTagClass}">${displayVal}</span>
          </div>
        `;
      } else {
        tile.innerHTML = '<div class="hw-cell-inner"></div>';
      }
    });
  }

  executeRespin() {
    if (!this.isActive || this.respinsLeft <= 0) return;

    if (this.spinBtn) this.spinBtn.disabled = true;
    if (window.slotAudio) window.slotAudio.startSpinningSound();

    let newCoinsLocked = 0;
    const emptyIndices = [];
    this.tiles.forEach((t, i) => { if (!t) emptyIndices.push(i); });

    if (this.grid) {
      const tilesEls = this.grid.querySelectorAll('.hw-tile');
      emptyIndices.forEach((idx) => {
        const tile = tilesEls[idx];
        if (tile) {
          tile.classList.add('is-respinning');
          tile.innerHTML = `
            <div class="hw-spinning-placeholder">
              <img src="assets/symbols/coin.svg" alt="Spinning" class="hw-spinning-coin-ghost" />
            </div>
          `;
        }
      });
    }

    setTimeout(() => {
      if (window.slotAudio) window.slotAudio.stopSpinningSound();

      if (this.grid) {
        const tilesEls = this.grid.querySelectorAll('.hw-tile');
        emptyIndices.forEach((idx) => {
          const tile = tilesEls[idx];
          if (tile) tile.classList.remove('is-respinning');
        });
      }

      emptyIndices.forEach((idx) => {
        const hitChance = Math.random();
        if (hitChance < 0.32) {
          newCoinsLocked++;
          let jackpotType = null;
          let coinVal = 0;
          if (hitChance < 0.035) {
            jackpotType = 'GOLD';
            coinVal = this.bet * 75;
          } else if (hitChance < 0.09) {
            jackpotType = 'SILVER';
            coinVal = this.bet * 30;
          } else {
            coinVal = this.bet * (Math.floor(Math.random() * 6) + 1);
          }

          this.tiles[idx] = { val: coinVal, isJackpot: jackpotType };
          this.total += coinVal;
        }
      });

      if (newCoinsLocked > 0) {
        this.respinsLeft = 3;
        if (window.slotAudio) window.slotAudio.playCoinLock();
        if (window.particleEngine) window.particleEngine.spawnCelebration(false);
      } else {
        this.respinsLeft--;
        if (window.slotAudio) window.slotAudio.playReelStop(2);
      }

      this.renderGrid();
      this.updateUI();

      const allFilled = this.tiles.every(t => t !== null);
      if (allFilled) {
        const diamondBonus = this.bet * 300;
        this.total += diamondBonus;
        this.updateUI();
        if (window.slotAudio) window.slotAudio.playJackpot();
        if (window.particleEngine) window.particleEngine.spawnCelebration(true);
        setTimeout(() => this.finish(), 2400);
        return;
      }

      if (this.respinsLeft <= 0) {
        setTimeout(() => this.finish(), 1200);
      } else {
        if (this.spinBtn) this.spinBtn.disabled = false;
      }
    }, 900);
  }

  finish() {
    this.isActive = false;
    if (this.wallet) {
      this.wallet.addWin(this.total);
    }
    if (this.modal) {
      this.modal.classList.remove('active');
    }
    if (this.spinBtn) this.spinBtn.disabled = false;

    if (window.slotAudio) window.slotAudio.playJackpot();
    if (window.particleEngine) window.particleEngine.spawnCelebration(true);

    if (this.onComplete) {
      this.onComplete(this.total);
    }
  }
}

window.HoldAndWinGame = HoldAndWinGame;
