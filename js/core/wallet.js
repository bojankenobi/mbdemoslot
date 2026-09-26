/**
 * Core Platform - Wallet & Bet Manager
 * Centralized credit, bet, and payout ledger across all slot games.
 */
class CasinoWallet {
  constructor(initialBalance = 1000, initialBet = 20) {
    this.balance = initialBalance; // Balance in credits
    this.bet = initialBet;         // Bet in credits
    this.minBet = 5;
    this.maxBet = 100;
    this.lastWin = 0;             // Last win in credits
    this.freeSpins = 0;
    this.happyHourMultiplier = 1;

    // Denomination settings: 0.2, 0.5, 1, 2, 4 RSD per credit
    this.denominations = [0.2, 0.5, 1, 2, 4];
    this.activeDenom = 1; // Default: 1 RSD = 1 Credit

    // Try loading saved denomination
    try {
      const savedDenom = parseFloat(localStorage.getItem('maxbet_denomination'));
      if (savedDenom && this.denominations.includes(savedDenom)) {
        this.activeDenom = savedDenom;
      }
    } catch (e) {}

    this.balanceEl = document.getElementById('val-balance');
    this.betEl = document.getElementById('val-bet');
    this.winEl = document.getElementById('val-win');
    this.denomValEl = document.getElementById('hud-denom-val');
    this.denomSubEl = document.getElementById('hud-denom-sub');
    this.balanceRsdEl = document.getElementById('hud-balance-rsd');
    this.betRsdEl = document.getElementById('hud-bet-rsd');

    this.updateUI();
  }

  setDenomination(val) {
    const num = parseFloat(val);
    if (this.denominations.includes(num)) {
      this.activeDenom = num;
      try {
        localStorage.setItem('maxbet_denomination', num.toString());
      } catch (e) {}
      if (window.slotAudio) window.slotAudio.playClick();
      this.updateUI();
    }
  }

  cycleDenomination() {
    const currentIndex = this.denominations.indexOf(this.activeDenom);
    const nextIndex = (currentIndex + 1) % this.denominations.length;
    this.setDenomination(this.denominations[nextIndex]);
  }

  getRsdAmount(credits) {
    return +(credits * this.activeDenom).toFixed(2);
  }

  canAffordSpin() {
    return this.freeSpins > 0 || this.balance >= this.bet;
  }

  deductSpinBet() {
    if (this.freeSpins > 0) {
      this.freeSpins--;
      return { isFree: true, remainingFree: this.freeSpins, betAmount: this.bet };
    }
    if (this.balance >= this.bet) {
      this.balance -= this.bet;
      this.lastWin = 0;
      this.updateUI();
      return { isFree: false, remainingFree: 0, betAmount: this.bet };
    }
    return null;
  }

  addWin(amount) {
    if (amount > 0) {
      this.balance += amount;
      this.lastWin = amount;
      this.updateUI();
    }
  }

  setLastWin(amount) {
    this.lastWin = amount;
    this.updateUI();
  }

  addCredits(amount = 500) {
    this.balance += amount;
    this.updateUI();
    if (window.slotAudio) window.slotAudio.playCoinDrop();
  }

  addFictionalRsd(rsdAmount = 1000) {
    const credits = Math.round(rsdAmount / this.activeDenom);
    this.balance += credits;
    this.updateUI();
    if (window.slotAudio) window.slotAudio.playCoinDrop();
    return credits;
  }

  changeBet(delta) {
    const newBet = Math.max(this.minBet, Math.min(this.maxBet, this.bet + delta));
    if (newBet !== this.bet) {
      this.bet = newBet;
      if (window.slotAudio) window.slotAudio.playClick();
      this.updateUI();
    }
  }

  setMaxBet() {
    if (this.bet !== this.maxBet) {
      this.bet = this.maxBet;
      if (window.slotAudio) window.slotAudio.playClick();
      this.updateUI();
    }
  }

  addFreeSpins(count) {
    this.freeSpins += count;
  }

  updateUI() {
    const rsdBalance = this.getRsdAmount(this.balance);
    const rsdBet = this.getRsdAmount(this.bet);
    const rsdWin = this.getRsdAmount(this.lastWin);

    if (this.balanceEl) this.balanceEl.textContent = this.balance.toLocaleString();
    if (this.betEl) this.betEl.textContent = this.bet.toLocaleString();
    if (this.winEl) this.winEl.textContent = this.lastWin.toLocaleString();

    if (this.balanceRsdEl) {
      this.balanceRsdEl.textContent = `≈ ${rsdBalance.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} RSD`;
    }
    if (this.betRsdEl) {
      this.betRsdEl.textContent = `≈ ${rsdBet.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} RSD`;
    }

    if (this.denomValEl) {
      this.denomValEl.textContent = `${this.activeDenom} RSD`;
    }
    if (this.denomSubEl) {
      this.denomSubEl.textContent = `1 KR = ${this.activeDenom} RSD`;
    }

    // Update active state on any denomination quick buttons
    document.querySelectorAll('.denom-pill-btn').forEach(btn => {
      const dVal = parseFloat(btn.getAttribute('data-denom'));
      btn.classList.toggle('active', dVal === this.activeDenom);
    });
  }
}

window.CasinoWallet = CasinoWallet;
