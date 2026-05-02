/* 
  Elite IT Smart Campus PWA - Overlay System
  Motion UI Transitions & Animations Layer
*/

class MotionUIEngine {
  constructor() {
    this.init();
  }

  init() {
    this.applyPageTransition();
    this.enhanceCards();
    this.enhanceButtons();
  }

  applyPageTransition() {
    // Add enter animation class to main content area
    const mainContent = document.querySelector('main.main-content');
    if (mainContent) {
      mainContent.classList.add('overlay-page-enter');
    }
  }

  enhanceCards() {
    // Apply glassmorphism and hover effects to existing cards
    const cards = document.querySelectorAll('.card-master, .card, .glass-card');
    cards.forEach((card, index) => {
      // Dynamic delay based on index for a cascade effect
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  enhanceButtons() {
    // Add subtle click ripples or scale effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
      btn.addEventListener('mousedown', () => {
        btn.style.transform = 'scale(0.95)';
        btn.style.transition = 'transform 0.1s ease';
      });
      btn.addEventListener('mouseup', () => {
        btn.style.transform = 'scale(1)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
      });
    });
  }
}

// Export for the bridge engine
window.MotionUIEngine = MotionUIEngine;
