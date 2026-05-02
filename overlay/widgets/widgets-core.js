/* 
  Elite IT Smart Campus PWA - Overlay System
  Widgets Core Layer
*/

class OverlayWidgets {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Only inject widgets on main pages (index, student, dashboard)
    const path = window.location.pathname;
    const validPages = ['index.html', 'student.html', 'dashboard.html', '/'];
    const isMainPage = validPages.some(p => path.endsWith(p));

    if (isMainPage) {
      this.createContainer();
      this.renderWidgets();
    }
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'overlay-widgets-panel';
    document.body.appendChild(this.container);
  }

  renderWidgets() {
    if (!this.container) return;

    this.container.innerHTML = `
      <!-- Widgets can be added here in the future -->
    `;
  }
}

// Export
window.OverlayWidgets = OverlayWidgets;
