/**
 * Core Platform - Wallet & Bet Manager
 * Centralized credit, bet, and payout ledger across all slot games.
 */
class CasinoWallet {
  constructor(initialBalance = 1000, initialBet = 20) {
    this.balance = initialBalance;
    this.bet = initialBet;
    this.minBet = 5;
    this.maxBet = 100;
    this.lastWin = 0;
    this.freeSpins = 0;
    this.happyHourMultiplier = 1;

    this.balanceEl = document.getElementById('val-balance');
    this.betEl = document.getElementById('val-bet');
    this.winEl = document.getElementById('val-win');

    this.updateUI();
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
    if (this.balanceEl) this.balanceEl.textContent = this.balance.toLocaleString();
    if (this.betEl) this.betEl.textContent = this.bet.toLocaleString();
    if (this.winEl) this.winEl.textContent = this.lastWin.toLocaleString();
  }
}

window.CasinoWallet = CasinoWallet;
