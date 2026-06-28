class SplashEnhancer {
  constructor() {
    this.enhance();
  }

  enhance() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;

    const glow = document.createElement('div');
    glow.className = 'splash-overlay-glow';
    splash.appendChild(glow);

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'splash-particle-enhanced';
      var size = Math.random() * 2.5 + 1;
      p.style.cssText =
        'position:absolute;width:' + size + 'px;height:' + size + 'px;' +
        'border-radius:50%;' +
        'top:' + (Math.random() * 100) + '%;' +
        'left:' + (Math.random() * 100) + '%;' +
        'opacity:' + (Math.random() * 0.3 + 0.05) + ';' +
        'animation:splashFloat ' + (Math.random() * 3 + 2) + 's ease-in-out infinite alternate;' +
        'animation-delay:' + (Math.random() * 3) + 's;' +
        'z-index:1;';
      var colors = ['rgba(139,92,246,', 'rgba(6,182,212,', 'rgba(16,185,129,', 'rgba(255,255,255,'];
      p.style.background = colors[Math.floor(Math.random() * colors.length)] + (Math.random() * 0.12 + 0.03) + ')';
      splash.appendChild(p);
    }

    for (let i = 0; i < 6; i++) {
      const line = document.createElement('div');
      line.className = 'splash-data-line';
      line.style.top = (Math.random() * 100) + '%';
      line.style.left = (Math.random() * 100) + '%';
      line.style.width = (Math.random() * 120 + 60) + 'px';
      line.style.animationDelay = (Math.random() * 3) + 's';
      line.style.animationDuration = (Math.random() * 2 + 2) + 's';
      splash.appendChild(line);
    }
  }
}

window.SplashEnhancer = SplashEnhancer;
