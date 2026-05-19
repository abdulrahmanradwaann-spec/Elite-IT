/* 
  Elite IT Smart Campus PWA - Overlay System
  Eid al-Adha Greeting Experience
  Pure UI - No Backend Logic
*/

class EidGreeting {
  constructor() {
    this.storageKey = 'elite_eid_greeting_1447';
    this.eidStart = new Date('2026-05-27T00:00:00');
    this.eidEnd = new Date('2026-06-05T23:59:59');
    this.isEid = this.checkEidPeriod();
    this.init();
  }

  checkEidPeriod() {
    var now = new Date();
    return now >= this.eidStart && now <= this.eidEnd;
  }

  init() {
    if (!this.isEid) return;
    document.documentElement.classList.add('eid-mode');
    this.replaceLogos();
    this.showGreetingOnce();
    this.showNotificationOnce();
  }

  replaceLogos() {
    var eidLogo = 'assets/eid-logo.svg';
    var logos = document.querySelectorAll('img[src*="logo.png"], img[src*="logo"], .sidebar-logo, .splash-logo, .app-logo-login, .id-logo');
    logos.forEach(function(img) {
      img.setAttribute('src', eidLogo);
      img.setAttribute('srcset', '');
    });
  }

  showGreetingOnce() {
    if (localStorage.getItem(this.storageKey + '_greeting')) return;
    localStorage.setItem(this.storageKey + '_greeting', 'shown');

    setTimeout(function() {
      new EidModal();
    }, 2000);
  }

  showNotificationOnce() {
    if (localStorage.getItem(this.storageKey + '_notif')) return;
    localStorage.setItem(this.storageKey + '_notif', 'shown');

    setTimeout(function() {
      if (window.showOverlayNotification) {
        window.showOverlayNotification(
          'عيد أضحى مبارك',
          'نتمنى لكم عيداً سعيداً مليئاً بالفرح والنجاح',
          'fa-moon'
        );
      }
    }, 6000);
  }
}

class EidModal {
  constructor() {
    this.built = false;
    this.build();
  }

  build() {
    if (document.getElementById('eidGreetingModal')) return;

    var overlay = document.createElement('div');
    overlay.id = 'eidGreetingModal';
    overlay.className = 'eid-overlay';

    var modal = document.createElement('div');
    modal.className = 'eid-modal';

    modal.innerHTML =
      '<div class="eid-ambient"></div>' +
      '<div class="eid-particles" id="eidParticles"></div>' +
      '<div class="eid-crescent-wrap">' +
        '<div class="eid-crescent">' +
          '<svg viewBox="0 0 60 60" class="eid-crescent-svg">' +
            '<defs>' +
              '<linearGradient id="eidCrescentGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" stop-color="#fbbf24"/>' +
                '<stop offset="100%" stop-color="#d97706"/>' +
              '</linearGradient>' +
              '<filter id="eidGlowFilter">' +
                '<feGaussianBlur stdDeviation="1.5" result="blur"/>' +
                '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
              '</filter>' +
            '</defs>' +
            '<path d="M30 4 C14 4 4 16 4 30 C4 44 14 56 30 56 C20 50 14 40 14 30 C14 20 20 10 30 4Z" fill="url(#eidCrescentGrad)" filter="url(#eidGlowFilter)"/>' +
          '</svg>' +
        '</div>' +
        '<div class="eid-crescent-ring"></div>' +
      '</div>' +
      '<div class="eid-content">' +
        '<div class="eid-logo-icon">' +
          '<img src="assets/eid-logo.svg" alt="Eid Logo">' +
        '</div>' +
        '<h2 class="eid-title">عيد أضحى مبارك</h2>' +
        '<p class="eid-message">نسأل الله أن يملأ أيامكم بالفرح والطمأنينة والتوفيق، وكل عام وأنتم بخير.</p>' +
        '<button class="eid-btn" onclick="this.closest(\'.eid-overlay\').remove(); document.documentElement.classList.remove(\'eid-modal-open\');">' +
          'وعساكم من عواده <span class="eid-btn-icon">✦</span>' +
        '</button>' +
      '</div>';

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.documentElement.classList.add('eid-modal-open');

    this.createParticles();

    requestAnimationFrame(function() {
      overlay.classList.add('show');
      modal.classList.add('show');
    });
  }

  createParticles() {
    var container = document.getElementById('eidParticles');
    if (!container) return;
    for (var i = 0; i < 20; i++) {
      var p = document.createElement('span');
      p.className = 'eid-particle';
      p.style.left = (Math.random() * 100) + '%';
      p.style.animationDelay = (Math.random() * 6) + 's';
      p.style.animationDuration = (4 + Math.random() * 4) + 's';
      p.style.width = (2 + Math.random() * 4) + 'px';
      p.style.height = p.style.width;
      container.appendChild(p);
    }
  }
}

window.EidGreeting = EidGreeting;
