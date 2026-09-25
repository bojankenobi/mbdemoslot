/**
 * MaxBet - Math & Configuration Manager
 * Manages RTP Presets, Symbol Weights, Multipliers and provides a High-Speed Monte Carlo Simulator.
 */
class SlotMathManager {
  constructor() {
    this.STORAGE_KEY = 'maxbet_math_config_v1';
    
    // Preset definitions
    this.PRESETS = {
      promo: {
        id: 'promo',
        name: 'Promo / Prezentacija (Visok RTP ~98.5%)',
        desc: 'Idealno za promocije, sajmove i reklame. Česti dobici, brz adrenalin i aktivne bonus runde.',
        targetRtp: 98.5,
        weights: {
          flower: 6,
          crown: 8,
          bar: 10,
          horseshoe: 12,
          seven: 14,
          bell: 16,
          coin: 20,
          diamond: 14
        },
        minesHouseEdge: 0.02, // 98% RTP za mine
        happyHourRate: 1.5,   // 50% brže punjenje metera
      },
      standard: {
        id: 'standard',
        name: 'Casino Standard (~96.2%)',
        desc: 'Originalna industrijska matematika za kazino i online slotove. Balansiran odnos rizika i dobitaka.',
        targetRtp: 96.2,
        weights: {
          flower: 4,
          crown: 5,
          bar: 6,
          horseshoe: 8,
          seven: 9,
          bell: 12,
          coin: 15,
          diamond: 10
        },
        minesHouseEdge: 0.035, // 96.5% RTP za mine
        happyHourRate: 1.0,
      },
      tight: {
        id: 'tight',
        name: 'High Volatility (~93.8%)',
        desc: 'Čvršći model za izazov. Ređi manji dobici, veći pikovi i visoka tenzija.',
        targetRtp: 93.8,
        weights: {
          flower: 2,
          crown: 3,
          bar: 5,
          horseshoe: 7,
          seven: 9,
          bell: 14,
          coin: 22,
          diamond: 7
        },
        minesHouseEdge: 0.05, // 95% RTP za mine
        happyHourRate: 0.75,
      }
    };

    this.activePreset = 'standard';
    this.loadConfig();
    this.applyToGames();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) || localStorage.getItem('grandslot_math_config_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activePreset && this.PRESETS[parsed.activePreset]) {
          this.activePreset = parsed.activePreset;
        }
        if (parsed.customWeights) {
          this.customWeights = parsed.customWeights;
        }
      }
    } catch (e) {
      console.warn('Could not load math config, using defaults:', e);
    }
  }

  saveConfig() {
    try {
      const data = {
        activePreset: this.activePreset,
        customWeights: this.customWeights || null
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save math config:', e);
    }
  }

  setPreset(presetId) {
    if (!this.PRESETS[presetId]) return;
    this.activePreset = presetId;
    this.customWeights = null;
    this.saveConfig();
    this.applyToGames();
  }

  getActiveWeights() {
    if (this.customWeights) return this.customWeights;
    return this.PRESETS[this.activePreset].weights;
  }

  setCustomWeight(symbolId, weightVal) {
    if (!this.customWeights) {
      this.customWeights = Object.assign({}, this.getActiveWeights());
    }
    this.customWeights[symbolId] = Math.max(1, parseInt(weightVal, 10) || 1);
    this.activePreset = 'custom';
    this.saveConfig();
    this.applyToGames();
  }

  applyToGames() {
    const weights = this.getActiveWeights();
    
    // 1. Update CLASSIC_SYMBOLS
    if (window.CLASSIC_SYMBOLS) {
      window.CLASSIC_SYMBOLS.forEach(sym => {
        if (weights[sym.id] !== undefined) {
          sym.weight = weights[sym.id];
        }
      });
    }

    // 2. Update ROYAL_SYMBOLS
    if (window.ROYAL_SYMBOLS) {
      window.ROYAL_SYMBOLS.forEach(sym => {
        if (weights[sym.id] !== undefined) {
          sym.weight = weights[sym.id];
        }
      });
    }

    // 3. Update Mines RTP if preset is set
    const preset = this.PRESETS[this.activePreset];
    if (preset && window.slotApp && window.slotApp.minesGame) {
      window.slotApp.minesGame.houseEdge = preset.minesHouseEdge;
    }
  }

  /**
   * High-Speed Monte Carlo Simulation
   * Runs N spins without DOM/audio overhead to calculate exact statistical RTP, hit frequency, and max win.
   * @param {string} gameType - 'classic' or 'royal3x3'
   * @param {number} totalSpins - e.g. 10000, 100000, 1000000
   * @param {Function} progressCallback - callback(percent)
   * @returns {Object} { spins, totalBet, totalWon, rtp, hitRate, maxWinMultiplier, symbolBreakdown }
   */
  runSimulation(gameType = 'royal3x3', totalSpins = 50000, progressCallback = null) {
    const symbols = (gameType === 'classic') ? window.CLASSIC_SYMBOLS : window.ROYAL_SYMBOLS;
    const weights = this.getActiveWeights();

    // Prepare weighted array for ultra-fast sampling
    const symList = symbols.map(s => ({
      id: s.id,
      name: s.name,
      weight: weights[s.id] !== undefined ? weights[s.id] : s.weight,
      payout3: s.payout3,
      payout2: s.payout2
    }));

    const totalWeight = symList.reduce((sum, s) => sum + s.weight, 0);

    const getRandomSym = () => {
      let r = Math.random() * totalWeight;
      for (let i = 0; i < symList.length; i++) {
        if (r < symList[i].weight) return symList[i];
        r -= symList[i].weight;
      }
      return symList[symList.length - 1];
    };

    let totalBet = 0;
    let totalWon = 0;
    let hits = 0;
    let maxWinMult = 0;
    const symbolHits = {};
    symList.forEach(s => { symbolHits[s.id] = { count: 0, won: 0 }; });

    const bet = 100; // standard bet unit for simulation

    for (let spin = 0; spin < totalSpins; spin++) {
      totalBet += bet;
      let spinWin = 0;

      if (gameType === 'classic') {
        const s1 = getRandomSym();
        const s2 = getRandomSym();
        const s3 = getRandomSym();

        let winMult = 0;
        let winSymId = null;

        if (s1.id === s2.id && s2.id === s3.id) {
          winMult = s1.payout3;
          winSymId = s1.id;
        } else if (s1.id === s2.id) {
          winMult = s1.payout2;
          winSymId = s1.id;
        } else if (s2.id === s3.id) {
          winMult = s2.payout2;
          winSymId = s2.id;
        } else if (s1.id === s3.id) {
          winMult = s1.payout2;
          winSymId = s1.id;
        }

        if (winMult > 0) {
          spinWin = bet * winMult;
          symbolHits[winSymId].count++;
          symbolHits[winSymId].won += spinWin;
        }
      } else {
        // Royal 3x3 (5 fixed lines, lineBet = bet / 5)
        const lineBet = bet / 5;
        // Generate 3x3 matrix
        const m = [
          [getRandomSym(), getRandomSym(), getRandomSym()],
          [getRandomSym(), getRandomSym(), getRandomSym()],
          [getRandomSym(), getRandomSym(), getRandomSym()]
        ];

        // 5 paylines: top, center, bottom, diag1, diag2
        const lines = [
          [m[0][0], m[1][0], m[2][0]],
          [m[0][1], m[1][1], m[2][1]],
          [m[0][2], m[1][2], m[2][2]],
          [m[0][0], m[1][1], m[2][2]],
          [m[0][2], m[1][1], m[2][0]]
        ];

        let totalLineMult = 0;
        lines.forEach(l => {
          const s0 = l[0], s1 = l[1], s2 = l[2];
          let lMult = 0;
          let wSym = null;
          if (s0.id === s1.id && s1.id === s2.id) {
            lMult = s0.payout3;
            wSym = s0.id;
          } else if (s0.id === s1.id) {
            lMult = s0.payout2;
            wSym = s0.id;
          }

          if (lMult > 0) {
            totalLineMult += lMult;
            const lWin = lineBet * lMult;
            symbolHits[wSym].count++;
            symbolHits[wSym].won += lWin;
          }
        });

        spinWin = lineBet * totalLineMult;
      }

      if (spinWin > 0) {
        hits++;
        totalWon += spinWin;
        const currentMult = spinWin / bet;
        if (currentMult > maxWinMult) maxWinMult = currentMult;
      }
    }

    const rtp = ((totalWon / totalBet) * 100).toFixed(2);
    const hitRate = ((hits / totalSpins) * 100).toFixed(2);

    return {
      gameType,
      spins: totalSpins,
      totalBet,
      totalWon,
      rtp: parseFloat(rtp),
      hitRate: parseFloat(hitRate),
      maxWinMult: parseFloat(maxWinMult.toFixed(1)),
      symbolHits
    };
  }
}

window.SlotMathManager = SlotMathManager;
