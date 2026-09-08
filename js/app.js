/**
 * Happy Hour Slot 3D - Application Controller & PWA Manager
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles and 3D Game Engine
  const particles = new window.ParticleEngine('fx-canvas');
  window.particleEngine = particles;

  const game = new window.SlotGame();
  window.slotGame = game;

  // Universal Responsive Scaler (Guarantees cylinder + lever are 100% visible on any phone)
  function updateSlotScale() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const availW = Math.max(260, vw - 22);
    const scaleW = Math.min(1.0, availW / 490);
    const availH = Math.max(100, vh - 300);
    const scaleH = Math.min(1.0, availH / 160);
    const finalScale = Math.min(scaleW, scaleH);
    document.documentElement.style.setProperty('--slot-scale', finalScale.toFixed(4));
  }
  window.addEventListener('resize', updateSlotScale);
  window.addEventListener('orientationchange', () => setTimeout(updateSlotScale, 100));
  updateSlotScale();

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

  // 3D Lever Interaction: Click, Touch Tap, and Mobile Swipe / Drag Down
  if (lever) {
    const leverArm = lever.querySelector('.lever-pivot-arm');
    let startY = 0;
    let currentDeltaY = 0;
    let isDragging = false;
    let justSwiped = false;

    // Standard click handler (tap or click without dragging)
    lever.addEventListener('click', () => {
      if (justSwiped) return;
      game.spin();
    });

    // Pointer events for real-time swipe / pull tracking
    lever.addEventListener('pointerdown', (e) => {
      if (game.isSpinning) return;
      startY = e.clientY;
      currentDeltaY = 0;
      isDragging = true;
      try {
        lever.setPointerCapture(e.pointerId);
      } catch (err) {}
      if (leverArm) {
        leverArm.style.transition = 'none';
      }
    });

    lever.addEventListener('pointermove', (e) => {
      if (!isDragging || game.isSpinning) return;
      const deltaY = e.clientY - startY;

      if (deltaY > 0) {
        currentDeltaY = deltaY;
        if (leverArm) {
          // Pivot arm rests at rotate(50deg), swings to rotate(115deg)
          const pullAngle = 50 + Math.min(65, deltaY * 0.75);
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

      if (currentDeltaY >= 25 && !game.isSpinning) {
        // Dragged down far enough to trigger spin!
        justSwiped = true;
        setTimeout(() => { justSwiped = false; }, 450);

        if (leverArm) {
          leverArm.style.transition = 'transform 0.12s ease-in';
          leverArm.style.transform = 'rotate(115deg) scaleY(0.85)';
        }

        game.spin();

        // Release back to rest position smoothly
        setTimeout(() => {
          if (leverArm) {
            leverArm.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.35)';
            leverArm.style.transform = '';
            setTimeout(() => {
              if (leverArm) leverArm.style.transition = '';
            }, 360);
          }
        }, 220);
      } else {
        // Drag was small -> spring back to resting angle
        if (leverArm) {
          leverArm.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.35)';
          leverArm.style.transform = '';
          setTimeout(() => {
            if (leverArm) leverArm.style.transition = '';
          }, 260);
        }
      }
      currentDeltaY = 0;
    };

    lever.addEventListener('pointerup', finishLeverDrag);
    lever.addEventListener('pointercancel', finishLeverDrag);
  }

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
          ? "📲 To install grandslot on iPhone/iPad:\n1. Tap the Share button in Safari (⎋)\n2. Scroll down and tap 'Add to Home Screen' (⊞)\n\nThe app will launch in full screen without browser bars!" 
          : "📲 Za instalaciju grandslot aplikacije na iPhone/iPad:\n1. Dodirnite dugme Deli u Safariju (⎋)\n2. Izaberite 'Dodaj na početni ekran' (⊞)\n\nAplikacija će se otvarati preko celog ekrana kao prava izvorna igra!");
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
