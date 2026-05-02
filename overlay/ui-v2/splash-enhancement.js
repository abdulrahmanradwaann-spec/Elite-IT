/* 
  Elite IT Smart Campus PWA - Overlay System
  Splash Screen Enhancements
*/

class SplashEnhancer {
  constructor() {
    this.enhance();
  }

  enhance() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return; // Splash screen might have already been removed or doesn't exist

    // Create the background glow
    const glow = document.createElement('div');
    glow.className = 'splash-overlay-glow';
    splash.appendChild(glow);

    // Add particle effects (simulated with tiny dots)
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 3 + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = '#fff';
      particle.style.borderRadius = '50%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.opacity = Math.random();
      particle.style.animation = `pulseGlow ${Math.random() * 2 + 1}s infinite alternate`;
      particle.style.zIndex = '1';
      splash.appendChild(particle);
    }
  }
}

// Export
window.SplashEnhancer = SplashEnhancer;
