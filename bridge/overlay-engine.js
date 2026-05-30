/* 
  Elite IT Smart Campus PWA - Overlay System
  Bridge Layer - Overlay Engine (Lazy Loading & Initialization)
*/

class OverlayEngine {
  constructor() {
    this.scriptsToLoad = [
      'overlay/motion-ui/transitions.js',
      'overlay/widgets/widgets-core.js',
      'overlay/ui-v2/splash-enhancement.js',
      'overlay/ui-v2/feature-announcement.js'
    ];
    this.init();
  }

  async init() {
    console.log("🚀 [Elite IT] Initializing 2026 Overlay Engine...");
    
    // Aesthetic Layer: Inject Ultra Aesthetics Patch
    this.injectAestheticsPatch();

    // Performance Layer: Lazy load the overlay scripts
    await this.loadScripts();
    
    // Initialize components
    if (window.SplashEnhancer) new window.SplashEnhancer();
    if (window.MotionUIEngine) new window.MotionUIEngine();
    if (window.OverlayWidgets) new window.OverlayWidgets();
    if (window.FeatureAnnouncement) new window.FeatureAnnouncement();
    
    this.setupNotificationBridge();
    this.setupBackToTop();
    this.setupRippleEffect();
    this.setupCardTilt();
    this.setupThemeToggle();
  }

  injectAestheticsPatch() {
    // 1. Inject CSS Patch
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'overlay/themes/ultra-aesthetics.css';
    link.id = 'ultra-aesthetics-patch';
    document.head.appendChild(link);
    console.log("✨ [Aesthetics] Ultra UI Patch Applied. (To remove, delete this injection)");
  }

  loadScripts() {
    return Promise.all(this.scriptsToLoad.map(src => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }));
  }

  setupNotificationBridge() {
    // Add floating notification container
    const container = document.createElement('div');
    container.className = 'overlay-notification-container';
    container.id = 'overlayNotificationContainer';
    document.body.appendChild(container);

    // Expose a global method to trigger overlay notifications
    window.showOverlayNotification = (title, message, icon = 'fa-bell') => {
      const notif = document.createElement('div');
      notif.className = 'overlay-notification';
      notif.innerHTML = `
        <div style="font-size: 1.5rem; color: var(--overlay-neon-primary);">
          <i class="fas ${icon}"></i>
        </div>
        <div>
          <h4 style="margin: 0; font-size: 1rem; color: #fff;">${title}</h4>
          <p style="margin: 5px 0 0; font-size: 0.85rem; color: var(--text-muted);">${message}</p>
        </div>
      `;
      
      container.appendChild(notif);
      
      // Animate in
      requestAnimationFrame(() => {
        notif.classList.add('show');
      });

      // Remove after 5 seconds
      setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 500); // Wait for transition
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
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          btn.classList.toggle('visible', window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  setupRippleEffect() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn, .nav-link, .bottom-link, .card-master');
      if (!target) return;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute; width: 0; height: 0; border-radius: 50%;
        background: rgba(139,92,246,0.12); transform: translate(-50%,-50%);
        pointer-events: none; z-index: 9999;
      `;
      const rect = target.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      target.style.position = target.style.position || 'relative';
      target.style.overflow = 'hidden';
      target.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) * 2 + 'px';
        ripple.style.opacity = '0';
        ripple.style.transition = 'width 0.5s ease, height 0.5s ease, opacity 0.5s ease';
      });

      setTimeout(() => ripple.remove(), 600);
    });
  }

  setupCardTilt() {
    document.querySelectorAll('.card-master, .module-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  setupThemeToggle() {
    const saved = localStorage.getItem('elite_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);

    const langSwitcher = document.querySelector('.lang-switcher');
    if (!langSwitcher) return;

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
    });

    langSwitcher.appendChild(btn);
  }
}

// Start the engine
document.addEventListener('DOMContentLoaded', () => {
  new OverlayEngine();
});
