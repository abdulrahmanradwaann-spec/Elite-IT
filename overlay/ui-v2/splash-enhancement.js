class SplashEnhancer {
  constructor() {
    this.enhance();
  }

  enhance() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;
    var isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    var pCount = isMobile ? 8 : 20;
    for (let i = 0; i < pCount; i++) {
      const p = document.createElement('div');
      p.className = 'splash-particle-enhanced';
      var size = Math.random() * 2 + 1;
      p.style.cssText =
        'position:absolute;width:' + size + 'px;height:' + size + 'px;' +
        'border-radius:50%;' +
        'top:' + (Math.random() * 100) + '%;' +
        'left:' + (Math.random() * 100) + '%;' +
        'opacity:' + (Math.random() * 0.2 + 0.05) + ';' +
        'animation:splashFloat ' + (Math.random() * 3 + 2) + 's ease-in-out infinite alternate;' +
        'animation-delay:' + (Math.random() * 3) + 's;' +
        'z-index:1;' +
        '-webkit-transform:translateZ(0);transform:translateZ(0);';
      var colors = ['rgba(139,92,246,', 'rgba(6,182,212,', 'rgba(16,185,129,'];
      p.style.background = colors[Math.floor(Math.random() * colors.length)] + (Math.random() * 0.1 + 0.03) + ')';
      splash.appendChild(p);
    }
    if (!isMobile) {
      for (let i = 0; i < 4; i++) {
        const line = document.createElement('div');
        line.className = 'splash-data-line';
        line.style.top = (Math.random() * 100) + '%';
        line.style.left = (Math.random() * 100) + '%';
        line.style.width = (Math.random() * 80 + 40) + 'px';
        line.style.animationDelay = (Math.random() * 3) + 's';
        line.style.animationDuration = (Math.random() * 2 + 2) + 's';
        splash.appendChild(line);
      }
    }
  }
}
window.SplashEnhancer = SplashEnhancer;