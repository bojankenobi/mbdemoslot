# MaxBet Multi-Game Casino Terminal & Slot Engine

Profesionalna veb i PWA platforma kazino igara inspirisana modernim kopnenim kazino aparatima (EGT / Novomatic / Aristocrat). Aplikacija integriše autentični mehanički 3D slot kabinet, napredne matematičke modele verovatnoće (RNG), dinamičke progresivne džekpotove i mini-igre nove generacije u jedinstvenom klijentskom okruženju visokih performansi.

---

## 🎰 Ključne Karakteristike Platforme

- **Autentičan MaxBet Vizuelni Identitet:**
  - Zvanične klupske boje: duboka smaragdno-zelena (`#06402d`), šampanj-zlatna (`#c7b783`), vatreno-crvena (`#ed1c24`) i mint tirkizna (`#3ba8aa`).
  - Vektorski renderovan krunski amblem sa lovorovim vencem kao najvredniji džekpot simbol, reljefni centar SPIN dugmeta i 3D lebdeći novčići.
- **Multigame Terminal Arhitektura:**
  - **Classic 1-Line Slot:** Tradicionalni mehanički slot sa jednom centralnom isplatnom linijom, animacijom poluga/čilindara i Hold & Win bonusom na 3 zlatnika.
  - **Royal 3x3 Multi-Line:** 5 fiksnih isplatnih linija, proširena tabela isplata, dinamičke linije dobitka sa sjajem.
  - **MaxBet Mines X:** Crash/Mines igra sa podesivom težinom rešetke (3x3 do 9x9), prilagodljivim brojem mina (1 do 24), dinamičkom krivom množioca i trenutnom isplatom (Cashout).
  - **Mini-Mines Slot Bonus:** Interaktivna bonus runda koja se aktivira sakupljanjem 3+ simbola novčića unutar slota, sa akumuliranjem nagrada i izbegavanjem skrivenih mina.
  - **Xtension Link:** Prošireni slot mod sa specijalnim "Link Sfera" mehanizmom.
- **Multi-Level Mistery Jackpots:**
  - Tri nivoa progresivnog džekpota: **Silver**, **Gold** i **Diamond**.
  - Matematička akumulacija pri svakom spinu i nasumično okidanje u zavisnosti od uloga.
- **Gamble (Duplanje):**
  - Crveno/Crno pogađanje karte sa animiranim mešanjem, istorijom izvučenih karata i limitom koraka za udvostručavanje dobitka.
- **Web Audio FX Sinteza:**
  - Kompletan zvučni pejzaž realizovan je pomoću Web Audio API-ja (oscilatori, filteri, frekventne modulacije). Nema eksternih MP3/WAV fajlova koji usporavaju učitavanje — zvuk je 100% klijentski generisan u realnom vremenu (mehanički klikovi, okretanje valjaka, dobitne fanfare, kaskade novčića, eksplozije mina).
- **Progresivna Veb Aplikacija (PWA):**
  - Potpuna podrška za instalaciju na mobilne (Android/iOS) i desktop sisteme.
  - Offline keširanje preko Service Worker-a (`CacheFirst` strategija za statičke resurse i ikone).
  - Podrška za Fullscreen API i prilagođavanje Safe Area marginama (Notch podrška).

---

## ⚙️ Arhitektura i Tehnički Mehanizmi

Projekat je strukturiran modularno prema principima klijentskog softverskog inženjeringa bez teških eksternih biblioteka, obezbeđujući stabilnih 60–120 FPS na svim uređajima.

```
maxbet/
│
├── assets/
│   ├── icons/            # PWA manifest ikone, maskable i favicon resursi
│   ├── symbols/          # Vektorski SVG simboli (novčić, kruna, zvono, sedmica, bar, dijamant, mina)
│   ├── logo.svg          # Zvanični MaxBet horizontalni logotip
│   └── logo-badge.svg    # MaxBet vertikalni amblem
│
├── css/
│   └── style.css         # EGT kabinet, 3D transformacije valjaka, responsive grid, neonski efekti
│
├── js/
│   ├── core/
│   │   ├── wallet.js        # Upravljanje balansom, ulogom, transakcijama i perzistencijom
│   │   ├── math-manager.js  # Matematički RNG modeli, raspodele verovatnoća i RTP profili
│   │   ├── jackpots.js      # Silver / Gold / Diamond progresivni džekpot kontroler
│   │   ├── gamble.js        # Crveno/crno mehanika rizika sa proverom karti
│   │   ├── meters.js        # Prikaz dobitaka, animirano odbrojavanje kredita (ticker)
│   │   ├── admin.js         # Skriveni servisni meni za dijagnostiku i testiranje isplata
│   │   └── lobby.js         # Menadžer tranzicije između igara unutar kabineta
│   │
│   ├── games/
│   │   ├── classic/         # Logika 1-Line Classic slota i definicije simbola
│   │   ├── royal3x3/        # Logika 3x3 slota sa 5 linija
│   │   ├── mines/           # Samostalna Mines igra i Mini-Mines bonus modul
│   │   ├── hold-win/        # Respin mehanika sa lepljivim novčićima
│   │   └── xtension/        # Xtension Link engine
│   │
│   ├── app.js               # Glavna orkestracija i inicijalizacija terminala
│   ├── audio.js             # Web Audio API zvučni sintisajzer
│   ├── i18n.js              # Dvojezični lokalizacioni podsistem (Srpski / Engleski)
│   └── particles.js         # Canvas 2D/3D partikl endžin za fiziku novčića i konfeta
│
├── index.html               # Glavni interfejs kazino kabineta
├── manifest.webmanifest     # PWA konfiguracioni manifest
└── sw.js                    # Service Worker keš menadžer
```

---

## 🧮 Matematički Model i RNG

Matematika igre je implementirana u [`js/core/math-manager.js`](js/core/math-manager.js) sa fokusom na realističan raspored verovatnoća:

1. **RNG i Težine Simbola (Reel Strips):**
   - Za svaki valjak koristi se ponderisano nasumično biranje (weighted random selection) zasnovano na kriptografski bezbednom ili pseudo-nasumičnom generatoru.
   - Svaki simbol nosi definisanu težinu (`weight`). Simboli niske vrednosti (trešnja, limun) imaju veće frekvencije pojavljivanja, dok MaxBet kruna i dijamant imaju znatno niže težine koje garantuju balansiran Volatility.
2. **Kalkulacija Isplata i RTP:**
   - Podržana su 3 predefinisana matematička profila: **Standard (96.2% RTP)**, **Loose / Promo (98.0% RTP)** i **Tight (94.0% RTP)**.
   - Profili dinamički prilagođavaju težine simbola, verovatnoću okidanja Hold & Win respin runde i pragove džekpota.
3. **Mines Crash Kriva:**
   - Verovatnoća uspeha u koraku $k$ definisana je formulom hipergeometrijske raspodele bez ponavljanja:
     $$P(\text{uspeh do koraka } k) = \prod_{i=0}^{k-1} \frac{N_{\text{sigurna}} - i}{N_{\text{ukupno}} - i}$$
   - Množilac u svakom koraku računa se uz uračunat House Edge od 3.5% ($RTP = 96.5\%$):
     $$\text{Množilac}_k = \frac{1 - \text{HouseEdge}}{P(\text{uspeh do koraka } k)}$$

---

## 🚀 Pokretanje Projekta

Igra je razvijena u čistom klijentskom HTML5/ES6 standardu i ne zahteva proces bildovanja ili Node.js runtime u produkciji.

### Lokalni razvoj / Pokretanje:

Bilo koji lokalni HTTP server je dovoljan:

```bash
# Opcija 1: Python 3
python -m http.server 8080

# Opcija 2: Node npx serve
npx serve .

# Opcija 3: VS Code Live Server ekstenzija
# Klik na "Go Live" na index.html
```

Nakon pokretanja otvorite browser na adresi: `http://localhost:8080`.

---

## 📱 PWA Instalacija

1. Otvorite igru u Chrome, Safari ili Edge pregledaču.
2. Na mobilnom uređaju odaberite **"Add to Home Screen"** (ili ikonicu za instalaciju u adresnoj traci na desktopu).
3. Igra se pokreće u nativnom celoekranskom režimu (standalone) bez navigacionih elemenata pretraživača.

---

## 🛡️ Licenca

Autorska prava zadržana. Projekat namenjen za demonstracione i produkcione potrebe MaxBet kazino platforme.
