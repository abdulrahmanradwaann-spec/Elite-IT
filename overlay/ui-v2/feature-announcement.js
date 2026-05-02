/* 
  Elite IT Smart Campus PWA - Overlay System
  Feature Announcement One-Time Notification
*/

class FeatureAnnouncement {
  constructor() {
    this.currentVersion = 'v2.0.0'; // Update this to show the modal again
    this.storageKey = 'elite_app_version';
    this.init();
  }

  init() {
    const savedVersion = localStorage.getItem(this.storageKey);
    
    // Only show if the version is different or doesn't exist
    if (savedVersion !== this.currentVersion) {
      // Delay slightly to let the splash screen finish
      setTimeout(() => {
        this.buildUI();
      }, 3000); 
    }
  }

  buildUI() {
    // Avoid duplicates
    if (document.getElementById('featureAnnouncementModal')) return;

    this.overlay = document.createElement('div');
    this.overlay.id = 'featureAnnouncementModal';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 99999;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.5s ease;
    `;

    this.modal = document.createElement('div');
    this.modal.style.cssText = `
      background: rgba(20, 20, 30, 0.7);
      border: 1px solid rgba(138, 43, 226, 0.4);
      box-shadow: 0 0 30px rgba(138, 43, 226, 0.2), inset 0 0 15px rgba(0, 210, 255, 0.1);
      border-radius: 20px;
      padding: 30px;
      width: 90%;
      max-width: 450px;
      text-align: center;
      color: #fff;
      transform: translateY(30px);
      transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
      font-family: inherit;
    `;

    this.modal.innerHTML = `
      <div style="font-size: 3rem; color: var(--overlay-neon-secondary); margin-bottom: 15px; animation: pulseGlow 2s infinite alternate;">
        🚀
      </div>
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 15px; color: #fff;">تحديث جديد للنظام</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 25px; line-height: 1.6;">
        تم ترقية النظام إلى النسخة الأحدث (2026 Ultra Pro) بنجاح.
      </p>
      
      <div style="text-align: right; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; margin-bottom: 25px;">
        <h4 style="color: var(--overlay-neon-primary); margin-bottom: 10px; font-size: 0.9rem;">🆕 أبرز التحديثات:</h4>
        <ul style="list-style: none; padding: 0; margin: 0; color: #e2e8f0; font-size: 0.85rem; line-height: 1.8;">
          <li><i class="fas fa-check-circle" style="color: var(--success); margin-left: 8px;"></i>تحسين واجهة المستخدم إلى 2026 Ultra Pro</li>
          <li><i class="fas fa-check-circle" style="color: var(--success); margin-left: 8px;"></i>إضافة نظام الإشعارات الذكي وتأثيرات الحركة</li>
          <li><i class="fas fa-check-circle" style="color: var(--success); margin-left: 8px;"></i>تحسين الأداء وسرعة التنقل</li>
          <li><i class="fas fa-check-circle" style="color: var(--success); margin-left: 8px;"></i>تحسين الحماية وعزل البيانات</li>
        </ul>
      </div>

      <button id="btnDismissFeature" style="
        background: linear-gradient(45deg, var(--overlay-neon-primary), var(--overlay-neon-secondary));
        border: none;
        color: #fff;
        padding: 12px 30px;
        font-size: 1rem;
        font-weight: bold;
        border-radius: 10px;
        cursor: pointer;
        width: 100%;
        box-shadow: 0 4px 15px rgba(138, 43, 226, 0.4);
        transition: transform 0.2s;
      ">موافق / فهمت</button>
    `;

    this.overlay.appendChild(this.modal);
    document.body.appendChild(this.overlay);

    // Animate in
    requestAnimationFrame(() => {
      this.overlay.style.opacity = '1';
      this.modal.style.transform = 'translateY(0)';
    });

    // Handle close
    document.getElementById('btnDismissFeature').addEventListener('click', () => {
      this.dismiss();
    });
  }

  dismiss() {
    // Save version to localStorage to prevent showing again
    localStorage.setItem(this.storageKey, this.currentVersion);

    // Animate out
    this.overlay.style.opacity = '0';
    this.modal.style.transform = 'translateY(20px)';
    
    // Remove from DOM
    setTimeout(() => {
      this.overlay.remove();
    }, 500);
  }
}

// Export
window.FeatureAnnouncement = FeatureAnnouncement;
