/**
 * Happy Hour Slot 3D - Application Controller & PWA Manager
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles and 3D Game Engine
  const particles = new window.ParticleEngine('fx-canvas');
  window.particleEngine = particles;

  const game = new window.SlotGame();
  window.slotGame = game;

  // 2. User Controls Bindings
  const spinBtn = document.getElementById('spin-btn');
  const autoBtn = document.getElementById('auto-btn');
  const lever = document.getElementById('slot-lever');
  const betMinusBtn = document.getElementById('bet-minus');
  const betPlusBtn = document.getElementById('bet-plus');
  const maxBetBtn = document.getElementById('max-bet-btn');
  const soundBtn = document.getElementById('sound-btn');
  const paytableBtn = document.getElementById('paytable-btn');
  const paytableModal = document.getElementById('paytable-modal');
  const closePaytableBtn = document.getElementById('close-paytable');
  const refillBtn = document.getElementById('refill-credits-btn');
  const langSrBtn = document.getElementById('lang-sr');
  const langEnBtn = document.getElementById('lang-en');

  const langToggleBtn = document.getElementById('lang-toggle');

  // Initialize and apply translations
  if (window.i18n) {
    window.i18n.applyTranslations();
  }

  // Discreet single-click language toggle (SR <-> EN)
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      window.slotAudio.playClick();
      window.i18n.toggleLanguage();
    });
  }

  // Language switch triggers (if present)
  if (langSrBtn) {
    langSrBtn.addEventListener('click', () => {
      window.slotAudio.playClick();
      window.i18n.setLanguage('sr');
    });
  }
  if (langEnBtn) {
    langEnBtn.addEventListener('click', () => {
      window.slotAudio.playClick();
      window.i18n.setLanguage('en');
    });
  }

  // Spin triggers: button, 3D lever, and Space key
  if (spinBtn) spinBtn.addEventListener('click', () => game.spin());
  if (lever) lever.addEventListener('click', () => game.spin());

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.repeat && !paytableModal.classList.contains('active')) {
      e.preventDefault();
      game.spin();
    }
  });

  // Auto spin
  if (autoBtn) autoBtn.addEventListener('click', () => game.toggleAutoSpin());

  // Bet adjustments
  if (betMinusBtn) betMinusBtn.addEventListener('click', () => game.changeBet(-5));
  if (betPlusBtn) betPlusBtn.addEventListener('click', () => game.changeBet(5));
  if (maxBetBtn) maxBetBtn.addEventListener('click', () => game.setMaxBet());

  // Refill credits
  if (refillBtn) refillBtn.addEventListener('click', () => game.addCredits(500));

  // Sound toggle
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = window.slotAudio.toggleMute();
      soundBtn.classList.toggle('muted', isMuted);
      soundBtn.querySelector('.icon').textContent = isMuted ? '🔇' : '🔊';
    });
  }

  // Paytable Modal
  if (paytableBtn && paytableModal) {
    paytableBtn.addEventListener('click', () => {
      window.slotAudio.playClick();
      paytableModal.classList.add('active');
    });
  }

  if (closePaytableBtn && paytableModal) {
    closePaytableBtn.addEventListener('click', () => {
      window.slotAudio.playClick();
      paytableModal.classList.remove('active');
    });
  }

  if (paytableModal) {
    paytableModal.addEventListener('click', (e) => {
      if (e.target === paytableModal) paytableModal.classList.remove('active');
    });
  }

  // 3. PWA Installation & Native App UX
  let deferredPrompt;
  const pwaInstallBtn = document.getElementById('pwa-install-btn');
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       window.matchMedia('(display-mode: fullscreen)').matches ||
                       window.navigator.standalone === true;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Hide install button if already running as installed native PWA
  if (isStandalone && pwaInstallBtn) {
    pwaInstallBtn.style.display = 'none';
  } else if (isIOS && pwaInstallBtn) {
    // Show install button for iOS users
    pwaInstallBtn.style.display = 'inline-flex';
  }

  // Prevent context menu (long-press popup on mobile) for true native game feel
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaInstallBtn && !isStandalone) {
      pwaInstallBtn.style.display = 'inline-flex';
    }
  });

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async () => {
      window.slotAudio.playClick();
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          pwaInstallBtn.style.display = 'none';
        }
        deferredPrompt = null;
      } else if (isIOS) {
        const isEn = window.i18n && window.i18n.currentLang === 'en';
        alert(isEn 
          ? "📲 To install Grand Slot on iPhone/iPad:\n1. Tap the Share button in Safari (⎋)\n2. Scroll down and tap 'Add to Home Screen' (⊞)\n\nThe app will launch in full screen without browser bars!" 
          : "📲 Za instalaciju Grand Slota na iPhone/iPad:\n1. Dodirnite dugme Deli u Safariju (⎋)\n2. Izaberite 'Dodaj na početni ekran' (⊞)\n\nAplikacija će se otvarati preko celog ekrana kao prava izvorna igra!");
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    if (pwaInstallBtn) pwaInstallBtn.style.display = 'none';
  });

  // 4. Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
      .catch((err) => console.error('PWA Service Worker registration failed:', err));
  }
});
