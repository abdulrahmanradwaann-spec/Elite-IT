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
    
    // Performance Layer: Lazy load the overlay scripts
    await this.loadScripts();
    
    // Initialize components
    if (window.SplashEnhancer) new window.SplashEnhancer();
    if (window.MotionUIEngine) new window.MotionUIEngine();
    if (window.OverlayWidgets) new window.OverlayWidgets();
    if (window.FeatureAnnouncement) new window.FeatureAnnouncement();
    
    this.setupNotificationBridge();
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
}

// Start the engine
document.addEventListener('DOMContentLoaded', () => {
  new OverlayEngine();
});
