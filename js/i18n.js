/**
 * Grand Slot - Internationalization (i18n) Engine
 * Primary language: Serbian (sr) | Secondary: English (en)
 */
(function() {
  const TRANSLATIONS = {
    sr: {
      brandSub: 'GRAND KAZINO',
      leverTitle: 'Povuci ručicu za spin!',
      ready: 'SPREMNI ZA IGRU!',
      spinning: 'VRTENJE U TOKU...',
      tryAgain: 'POKUŠAJTE PONOVO!',
      winPrefix: 'DOBITAK: +',
      combo_flower_jackpot: '3x ZLATNI CVET (JACKPOT!)',
      combo_flower_2x: '2x ZLATNI CVET!',
      combo_bar_3x: '3x BAR!',
      combo_bar_2x: '2x BAR!',
      combo_seven_3x: '3x ZLATNA 7!',
      combo_seven_2x: '2x ZLATNA 7!',
      combo_bell_3x: '3x ZVONO!',
      combo_bell_2x: '2x ZVONO!',
      combo_coin_3x: '3x ZLATNIK!',
      combo_coin_2x: '2x ZLATNIK!',
      combo_diamond_3x: '3x DIJAMANT!',
      combo_diamond_2x: '2x DIJAMANT!',
      combo_flower_bar: 'CVET & BAR KOMBO!',
      freeSpinsWon: '💎 5 BESPLATNIH SPINOVA OSVOJENO! 💎',
      freeSpinRemaining: 'BESPLATAN SPIN! Preostalo: ',
      bigWin: '🎰 VELIKI DOBITAK! +',
      notEnoughCredits: 'NEMATE DOVOLJNO KREDITA! Dopunite besplatno.',
      creditsAdded: 'DODATO +{amount} KREDITA!',
      happyHourActive: '🔥 HAPPY HOUR AKTIVAN! x{mult} MNOŽILAC! 🔥',

      credits: 'Krediti',
      bet: 'Ulog',
      win: 'Dobitak',

      addCredits: '+ KREDITI',
      addCreditsTitle: 'Dodaj besplatne kredite',
      betLabel: 'ULOG',
      maxBet: 'MAX BET',
      spin: 'SPIN',
      autoSpin: 'AUTO',
      autoSpinOn: 'STOP',
      decreaseBet: 'Smanji ulog',
      increaseBet: 'Povećaj ulog',

      rulesAndPayouts: 'Pravila i Isplate',
      installApp: 'Instaliraj App',
      sound: 'Zvuk',

      paytableTitle: '🏆 TABELA DOBITAKA',
      symFlower: 'Zlatni Cvet (Jackpot)',
      symBar: 'BAR Simbol',
      symSeven: 'Zlatna Sedmica (7)',
      symBell: 'Zlatno Zvono',
      symCoin: 'Zlatnik (Coin)',
      symDiamond: 'Dijamant (Bonus)',
      freeSpinsRuleHeading: '✨ PRAVILA IGRE & BONUSI',
      freeSpinsRuleText: 'Pogodak 3 Dijamanta donosi <strong>5 BESPLATNIH SPINOVA</strong>!',
      instructionsRuleText: 'Možete povući i 3D ručicu sa desne strane za pokretanje valjaka ili pritisnuti taster Space na tastaturi.'
    },
    en: {
      brandSub: 'GRAND CASINO',
      leverTitle: 'Pull lever to spin!',
      ready: 'READY TO PLAY!',
      spinning: 'SPINNING...',
      tryAgain: 'TRY AGAIN!',
      winPrefix: 'WIN: +',
      combo_flower_jackpot: '3x GOLDEN FLOWER (JACKPOT!)',
      combo_flower_2x: '2x GOLDEN FLOWER!',
      combo_bar_3x: '3x BAR!',
      combo_bar_2x: '2x BAR!',
      combo_seven_3x: '3x GOLDEN 7!',
      combo_seven_2x: '2x GOLDEN 7!',
      combo_bell_3x: '3x BELL!',
      combo_bell_2x: '2x BELL!',
      combo_coin_3x: '3x GOLD COIN!',
      combo_coin_2x: '2x GOLD COIN!',
      combo_diamond_3x: '3x DIAMOND!',
      combo_diamond_2x: '2x DIAMOND!',
      combo_flower_bar: 'FLOWER & BAR COMBO!',
      freeSpinsWon: '💎 5 FREE SPINS WON! 💎',
      freeSpinRemaining: 'FREE SPIN! Remaining: ',
      bigWin: '🎰 BIG WIN! +',
      notEnoughCredits: 'NOT ENOUGH CREDITS! Refill for free.',
      creditsAdded: 'ADDED +{amount} CREDITS!',
      happyHourActive: '🔥 HAPPY HOUR ACTIVE! x{mult} MULTIPLIER! 🔥',

      credits: 'Credits',
      bet: 'Bet',
      win: 'Win',

      addCredits: '+ CREDITS',
      addCreditsTitle: 'Add free credits',
      betLabel: 'BET',
      maxBet: 'MAX BET',
      spin: 'SPIN',
      autoSpin: 'AUTO',
      autoSpinOn: 'STOP',
      decreaseBet: 'Decrease bet',
      increaseBet: 'Increase bet',

      rulesAndPayouts: 'Rules & Payouts',
      installApp: 'Install App',
      sound: 'Sound',

      paytableTitle: '🏆 PAYTABLE & RULES',
      symFlower: 'Golden Flower (Jackpot)',
      symBar: 'BAR Symbol',
      symSeven: 'Golden Seven (7)',
      symBell: 'Golden Bell',
      symCoin: 'Gold Coin',
      symDiamond: 'Diamond (Bonus)',
      freeSpinsRuleHeading: '✨ GAME RULES & BONUSES',
      freeSpinsRuleText: 'Hit 3 Diamonds to win <strong>5 FREE SPINS</strong>!',
      instructionsRuleText: 'You can also pull the 3D lever on the right side to spin the reels or press the Spacebar.'
    }
  };

  class I18nEngine {
    constructor() {
      // Default: Serbian (sr), check localStorage
      const savedLang = localStorage.getItem('grand_slot_lang');
      this.currentLang = (savedLang === 'en' || savedLang === 'sr') ? savedLang : 'sr';
    }

    t(key, params = {}) {
      const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.sr;
      let text = dict[key] || TRANSLATIONS.sr[key] || key;
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
      }
      return text;
    }

    setLanguage(lang) {
      if (lang !== 'sr' && lang !== 'en') return;
      this.currentLang = lang;
      localStorage.setItem('grand_slot_lang', lang);
      this.applyTranslations();
      if (window.slotGame && typeof window.slotGame.onLanguageChanged === 'function') {
        window.slotGame.onLanguageChanged();
      }
    }

    toggleLanguage() {
      const nextLang = this.currentLang === 'sr' ? 'en' : 'sr';
      this.setLanguage(nextLang);
    }

    applyTranslations() {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
          el.textContent = this.t(key);
        }
      });
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (key) {
          el.innerHTML = this.t(key);
        }
      });
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
          el.setAttribute('title', this.t(key));
        }
      });

      // Update discreet lang pill label
      const langLabel = document.getElementById('lang-current-label');
      if (langLabel) {
        langLabel.textContent = this.currentLang.toUpperCase();
      }
      const langToggleBtn = document.getElementById('lang-toggle');
      if (langToggleBtn) {
        langToggleBtn.title = this.currentLang === 'sr' ? 'Prebaci na English' : 'Switch to Srpski';
      }

      // Update lang switch buttons active state (if present)
      const btnSr = document.getElementById('lang-sr');
      const btnEn = document.getElementById('lang-en');
      if (btnSr) btnSr.classList.toggle('active', this.currentLang === 'sr');
      if (btnEn) btnEn.classList.toggle('active', this.currentLang === 'en');
      
      // Update HTML lang attribute
      document.documentElement.lang = this.currentLang;
    }
  }

  window.i18n = new I18nEngine();
})();
