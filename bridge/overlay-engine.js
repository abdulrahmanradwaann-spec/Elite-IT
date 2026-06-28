/* 
  Elite IT Smart Campus PWA - Overlay System v2.1
  Bridge Layer - Overlay Engine (Lazy Loading & Initialization)
*/

class OverlayEngine {
  constructor() {
    this.scriptsToLoad = [
      'overlay/motion-ui/transitions.js',
      'overlay/widgets/widgets-core.js',
      'overlay/ui-v2/splash-enhancement.js',
      'overlay/ui-v2/feature-announcement.js',
      'overlay/ui-v2/eid-greeting.js',
      'overlay/ui-v2/account-enhancements.js'
    ];
    this._rippleAbortController = new AbortController();
    this._scrollAbortController = new AbortController();
    this._cleanupFns = [];
    this.init();
  }

  async init() {
    this.injectAestheticsPatch();
    await this.loadScripts();

    if (window.SplashEnhancer) new window.SplashEnhancer();
    if (window.MotionUIEngine) new window.MotionUIEngine();
    if (window.OverlayWidgets) new window.OverlayWidgets();
    if (window.FeatureAnnouncement) new window.FeatureAnnouncement();
    if (window.EidGreeting) new window.EidGreeting();
    if (window.AccountEnhancements) new window.AccountEnhancements();

    this.setupNotificationBridge();
    this.setupBackToTop();
    this.setupRippleEffect();
    this.setupCardTilt();
    this.setupThemeToggle();
  }

  injectAestheticsPatch() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'overlay/themes/ultra-aesthetics.css';
    link.id = 'ultra-aesthetics-patch';
    link.onerror = () => {};
    document.head.appendChild(link);
  }

  loadScripts() {
    return Promise.all(this.scriptsToLoad.map(src => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = resolve;
        document.body.appendChild(script);
      });
    }));
  }

  setupNotificationBridge() {
    const container = document.createElement('div');
    container.className = 'overlay-notification-container';
    container.id = 'overlayNotificationContainer';
    document.body.appendChild(container);

    window.showOverlayNotification = (title, message, icon = 'fa-bell') => {
      const notif = document.createElement('div');
      notif.className = 'overlay-notification';

      const iconDiv = document.createElement('div');
      iconDiv.style.cssText = 'font-size: 1.5rem; color: var(--overlay-neon-primary);';
      const iconEl = document.createElement('i');
      iconEl.className = `fas ${icon}`;
      iconDiv.appendChild(iconEl);

      const textDiv = document.createElement('div');
      const h4 = document.createElement('h4');
      h4.style.cssText = 'margin: 0; font-size: 1rem; color: #fff;';
      h4.textContent = title;
      const p = document.createElement('p');
      p.style.cssText = 'margin: 5px 0 0; font-size: 0.85rem; color: var(--text-muted);';
      p.textContent = message;
      textDiv.appendChild(h4);
      textDiv.appendChild(p);

      notif.appendChild(iconDiv);
      notif.appendChild(textDiv);
      container.appendChild(notif);

      requestAnimationFrame(() => {
        notif.classList.add('show');
      });

      setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 500);
      }, 5000);
    };
  }

  setupBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    btn.setAttribute('aria-label', 'العودة للأعلى');
    document.body.appendChild(btn);

    let ticking = false;
    const signal = this._scrollAbortController.signal;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          btn.classList.toggle('visible', window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true, signal });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, { signal });

    this._cleanupFns.push(() => btn.remove());
  }

  setupRippleEffect() {
    const signal = this._rippleAbortController.signal;
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn, .nav-link, .bottom-link, .card-master');
      if (!target) return;
      var origPos = getComputedStyle(target).position;
      if (origPos === 'static') target.style.position = 'relative';

      const rippleContainer = document.createElement('span');
      rippleContainer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:inherit;';

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute; width: 0; height: 0; border-radius: 50%;
        background: rgba(139,92,246,0.12); transform: translate(-50%,-50%);
        pointer-events: none; z-index: 9999;
      `;

      const rect = target.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';

      rippleContainer.appendChild(ripple);
      target.appendChild(rippleContainer);

      requestAnimationFrame(() => {
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) * 2 + 'px';
        ripple.style.opacity = '0';
        ripple.style.transition = 'width 0.5s ease, height 0.5s ease, opacity 0.5s ease';
      });

      setTimeout(() => { if (origPos === 'static') target.style.position = 'static'; rippleContainer.remove(); }, 600);
    }, { signal });
  }

  setupCardTilt() {
    document.querySelectorAll('.card-master, .module-card').forEach(card => {
      const handlerIn = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      };

      const handlerOut = () => {
        card.style.transform = '';
      };

      card.addEventListener('mousemove', handlerIn);
      card.addEventListener('mouseleave', handlerOut);
    });
  }

  setupThemeToggle() {
    if (document.querySelector('.theme-toggle')) return;
    const saved = localStorage.getItem('elite_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);

    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'تبديل السمة');
    btn.innerHTML = saved === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('elite_theme', next);
      btn.innerHTML = next === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', next === 'dark' ? '#050508' : '#f1f5f9');
      }
    });

    document.body.appendChild(btn);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new OverlayEngine();
});
