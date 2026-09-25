# MaxBet Multi-Game Casino Terminal & Slot Engine

[![Platform](https://img.shields.io/badge/Platform-HTML5%20%7C%20PWA-06402d.svg)](#)
[![Performance](https://img.shields.io/badge/Performance-60--120%20FPS%20GPU-c7b783.svg)](#)
[![Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API%20Synthesized-ed1c24.svg)](#)
[![License](https://img.shields.io/badge/License-Proprietary-darkgreen.svg)](#)

> **Language / Jezik:** [English](#english-documentation) | [Srpski](#srpska-dokumentacija)

---

<a name="english-documentation"></a>
## 🇬🇧 English Documentation

A high-performance web and progressive web application (PWA) casino gaming platform inspired by modern land-based cabinets (EGT / Novomatic / Aristocrat). The application features an authentic mechanical 3D slot cabinet, advanced mathematical probability models (RNG), dynamic progressive jackpots, and next-generation mini-games in a unified zero-dependency client architecture.

### 🎰 Key Features

- **MaxBet Visual Identity:**
  - Official brand palette: deep emerald green (`#06402d`), champagne gold (`#c7b783`), crimson red (`#ed1c24`), and mint teal (`#3ba8aa`).
  - Vector-rendered crown and laurel wreath emblem as the top-tier jackpot symbol, embossed SPIN button face, and 3D bullion coins.
- **Multigame Terminal Architecture:**
  - **Classic 1-Line Slot:** Mechanical single-line slot with physical arm/cylinder rotation, sound synthesis, and Hold & Win bonus triggered on 3 coins.
  - **Royal 3x3 Multi-Line:** 5 fixed paylines, expanded paytable, dynamic glowing win-line renderers.
  - **MaxBet Mines X:** Next-gen crash/mines game with configurable grid size (3x3 to 9x9), adjustable mine count (1 to 24), real-time multiplier curve, and instant cashout.
  - **Mini-Mines Slot Bonus:** In-game bonus round activated by collecting 3+ coin symbols across slot reels, rewarding cumulative safe-gem picks while avoiding hidden mines.
  - **Xtension Link:** Extended slot variant featuring Link Spheres and multi-tier credit accumulation.
- **Multi-Tier Mystery Jackpots:**
  - Three progressive tiers: **Silver**, **Gold**, and **Diamond**.
  - Dynamic mathematical increment per spin with threshold-based trigger probabilities correlated to active stake size.
- **Double-Up Gamble Feature:**
  - Red / Black card prediction mechanic featuring animated card shuffles, history ledger, and multi-step doubling ceilings.
- **Zero-Asset Web Audio FX Synthesis:**
  - The complete soundscape is synthesized purely via the client-side Web Audio API (custom oscillators, biquad filters, ADSR envelopes, and frequency modulation). No heavy MP3/WAV files to load—all mechanical clicks, reel whooshes, win chimes, coin cascades, and explosion rumbles are synthesized in real-time.
- **Progressive Web Application (PWA):**
  - Installable across iOS, Android, and Desktop platforms.
  - Resilient offline caching via Service Worker (`CacheFirst` asset strategy).
  - Native display support: Edge-to-edge layout, Fullscreen API, and Safe Area notch handling.

---

### ⚙️ Architecture & Directory Structure

The project is structured according to clean, modular ES6 architecture without third-party frameworks, maintaining 60–120 FPS render loops across mobile and desktop browsers:

```
maxbet/
│
├── assets/
│   ├── icons/            # PWA manifest icons, maskables, and favicons
│   ├── symbols/          # Scalable vector assets (coin, crown, bell, seven, bar, diamond, bomb)
│   ├── logo.svg          # Official horizontal MaxBet vector logo
│   └── logo-badge.svg    # Official stacked badge vector logo
│
├── css/
│   └── style.css         # EGT cabinet framing, 3D cylinder transforms, responsive viewports
│
├── js/
│   ├── core/
│   │   ├── wallet.js        # Credit management, bet sizing, ledger persistence
│   │   ├── math-manager.js  # Mathematical RNG engines, symbol weights, and RTP profiles
│   │   ├── jackpots.js      # Silver / Gold / Diamond progressive jackpot pool controller
│   │   ├── gamble.js        # Red/Black risk engine with history tracking
│   │   ├── meters.js        # Real-time win ticker and credit counter animations
│   │   ├── admin.js         # Diagnostic engineering console for payout testing
│   │   └── lobby.js         # Cabinet state router and multi-game lifecycle manager
│   │
│   ├── games/
│   │   ├── classic/         # 1-Line classic slot controller and symbol definitions
│   │   ├── royal3x3/        # 3x3 multi-line slot controller (5 lines)
│   │   ├── mines/           # Standalone Mines X engine and Mini-Mines bonus controller
│   │   ├── hold-win/        # Respin lock & hold engine with sticky coins
│   │   └── xtension/        # Xtension Link feature engine
│   │
│   ├── app.js               # Terminal runtime orchestrator and bootloader
│   ├── audio.js             # Real-time Web Audio API sound synthesizer
│   ├── i18n.js              # Internationalization subsystem (English / Serbian)
│   └── particles.js         # Canvas 2D/3D physics engine for floating ambient coins and win bursts
│
├── index.html               # Main casino terminal DOM view
├── manifest.webmanifest     # PWA deployment manifest
└── sw.js                    # Service Worker offline cache controller
```

---

### 🧮 Mathematical Engine & Probability Specification

Implemented in [`js/core/math-manager.js`](js/core/math-manager.js), the platform leverages rigorous probability distributions:

1. **Reel Strip Weighting (Weighted Random Sampling):**
   - Each reel uses independent weighted random index selection.
   - Low-tier symbols (Cherries, Lemons) carry higher weight values, while top-tier symbols (MaxBet Crown, Diamonds) carry constrained weights that maintain game volatility according to certified casino standards.
2. **Configurable RTP Profiles:**
   - **Standard Profile:** ~96.20% Return-to-Player (Default production configuration).
   - **Promo / Loose Profile:** ~98.00% Return-to-Player (Promotional and VIP terminals).
   - **Tight Profile:** ~94.00% Return-to-Player (Conservative land-based emulation).
3. **Mines Crash Curve Formulation:**
   - The cumulative probability of uncovering $k$ consecutive safe gems without hitting a mine is modeled by the hypergeometric distribution without replacement:
     $$P(\text{success up to step } k) = \prod_{i=0}^{k-1} \frac{N_{\text{safe}} - i}{N_{\text{total}} - i}$$
   - Multipliers at step $k$ are derived by factoring in a 3.5% house edge ($RTP = 96.5\%$):
     $$\text{Multiplier}_k = \frac{1 - \text{HouseEdge}}{P(\text{success up to step } k)}$$

---

### 🚀 Getting Started

The platform runs purely on client-side standards (HTML5 / ES6 / Web Audio / Canvas) and does not require complex build tools or Node.js runtime servers for production deployment.

#### Local Development:

Run any static HTTP server from the root directory:

```bash
# Option 1: Python 3
python -m http.server 8080

# Option 2: Node.js npx serve
npx serve .

# Option 3: VS Code Live Server extension
# Click "Go Live" on index.html
```

Access the game via browser: `http://localhost:8080`.

---

<br />

---

<a name="srpska-dokumentacija"></a>
## 🇷🇸 Srpska Dokumentacija

Veb i PWA kazino terminal inspirisan modernim aparatima (EGT / Novomatic / Aristocrat). Aplikacija kombinuje 3D slot kabinet, matematičke modele verovatnoće (RNG), progresivne džekpotove i interaktivne mini-igre u jedinstvenom klijentskom rešenju visokih performansi.

### 🎰 Karakteristike

- **MaxBet Vizuelni Identitet:**
  - Zvanične klupske boje: smaragdno-zelena (`#06402d`), šampanj-zlatna (`#c7b783`), crvena (`#ed1c24`) i mint tirkizna (`#3ba8aa`).
  - Vektorski krunski amblem sa lovorovim vencem kao najvredniji džekpot simbol, reljef na SPIN dugmetu i 3D lebdeći novčići.
- **Multigame Terminal:**
  - **Classic 1-Line Slot:** Tradicionalni slot sa jednom linijom, mehaničkim polugama i Hold & Win bonusom na 3 novčića.
  - **Royal 3x3:** 5 fiksnih isplatnih linija, proširena paytable tabela i dinamičke linije dobitaka.
  - **MaxBet Mines X:** Crash/Mines igra sa podesivom rešetkom (3x3 do 9x9), brojem mina (1 do 24), krivom množioca i opcijom za trenutnu isplatu (Cashout).
  - **Mini-Mines Slot Bonus:** Bonus runda unutar slota (aktivira se na 3+ zlatnika) u kojoj igrač otkriva sigurna polja i izbegava mine.
  - **Xtension Link:** Prošireni slot mod sa specijalnim "Link Sfera" mehanizmom.
- **Progresivni Džekpotovi:**
  - Tri nivoa: **Silver**, **Gold** i **Diamond** sa matematičkom akumulacijom pri svakom spinu.
- **Gamble (Duplanje):**
  - Pogađanje crveno/crno sa animiranim mešanjem, istorijom karata i limitom koraka.
- **Web Audio FX Sinteza Zvuka:**
  - Kompletan zvuk generiše se u realnom vremenu preko Web Audio API-ja (oscilatori, filteri). Nema eksternih audio fajlova.
- **PWA i Optimizacija:**
  - Podrška za instalaciju na telefone i desktop, rad u punom ekranu i offline keširanje preko Service Worker-a.

---

### ⚙️ Struktura Projekta

Modularni JavaScript sistem bez teških biblioteka obezbeđuje 60–120 FPS:

```
maxbet/
│
├── assets/
│   ├── icons/            # PWA ikone i favicon
│   ├── symbols/          # Vektorski SVG simboli (novčić, kruna, zvono, sedmica, bar, dijamant, mina)
│   ├── logo.svg          # Zvanični MaxBet horizontalni logo
│   └── logo-badge.svg    # Zvanični MaxBet vertikalni logo
│
├── css/
│   └── style.css         # EGT kabinet, 3D cilindri, responzivni lejaut
│
├── js/
│   ├── core/
│   │   ├── wallet.js        # Balans, ulog i evidencija kredita
│   │   ├── math-manager.js  # Matematički modeli, težine simbola i RTP
│   │   ├── jackpots.js      # Kontroler Silver / Gold / Diamond džekpotova
│   │   ├── gamble.js        # Mehanika crveno/crno duplanja
│   │   ├── meters.js        # Ticker animacija dobitaka
│   │   ├── admin.js         # Servisni dijagnostički meni
│   │   └── lobby.js         # Tranzicija između igara u kabinetu
│   │
│   ├── games/
│   │   ├── classic/         # Logika 1-Line Classic slota
│   │   ├── royal3x3/        # Logika Royal 3x3 slota
│   │   ├── mines/           # Mines X igra i Mini-Mines bonus
│   │   ├── hold-win/        # Hold & Win respin mehanizam
│   │   └── xtension/        # Xtension Link mod
│   │
│   ├── app.js               # Glavna orkestracija terminala
│   ├── audio.js             # Web Audio API sintisajzer
│   ├── i18n.js              # Lokalizacija (Srpski / Engleski)
│   └── particles.js         # Canvas partikli i 3D novčići sa MaxBet reljefom
│
├── index.html               # Glavni interfejs terminala
├── manifest.webmanifest     # PWA manifest
└── sw.js                    # Service Worker keširanje
```

---

### 🧮 Matematika i Verovatnoća

Definisano u [`js/core/math-manager.js`](js/core/math-manager.js):
- **Težine simbola:** Svaki točak koristi ponderisani nasumični izbor (Weighted Random) gde simboli niže vrednosti imaju veću frekvenciju, dok kruna i dijamant balansiraju volatilnost.
- **RTP profili:** Standardni (96.2%), Promotivni (98.0%) i Konzervativni (94.0%).
- **Mines kriva:** Verovatnoća otkrivanja $k$ dijamanata računa se hipergeometrijskom raspodelom, uz podešen House Edge od 3.5%.

---

### 🚀 Pokretanje

Nije potreban proces bildovanja. Pokrenite bilo koji lokalni HTTP server:

```bash
# Python 3
python -m http.server 8080

# ili Node npx serve
npx serve .
```

Otvorite u pretraživaču: `http://localhost:8080`.

---

## 🛡️ License

All rights reserved. Proprietary software for MaxBet gaming platforms.
