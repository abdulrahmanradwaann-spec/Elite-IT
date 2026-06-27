/* 
  Elite IT Smart Campus PWA - Overlay System
  Widgets Core - Future Widget Container
*/

class OverlayWidgets {
  constructor() {
    this.container = document.getElementById('overlayWidgetsPanel');
    if (!this.container) {
      this.createContainer();
    }
  }

  createContainer() {
    const panel = document.createElement('div');
    panel.id = 'overlayWidgetsPanel';
    panel.className = 'overlay-widgets-panel';
    document.body.appendChild(panel);
    this.container = panel;
  }
}
