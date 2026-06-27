/* 
  Elite IT Smart Campus PWA - Overlay System
  Feature Announcement One-Time Notification v2.1
*/

class FeatureAnnouncement {
  constructor() {
    this.currentVersion = 'v2.1.0';
    this.storageKey = 'elite_app_version';
    this._dismissing = false;
    this.init();
  }

  init() {
    const savedVersion = localStorage.getItem(this.storageKey);

    if (savedVersion !== this.currentVersion) {
      setTimeout(() => {
        this.buildUI();
      }, 3500);
    }
  }

  buildUI() {
    const existing = document.getElementById('fa-styles');
    if (existing) existing.remove();

    const styles = document.createElement('style');
    styles.id = 'fa-styles';
    styles.textContent = `
      @keyframes faFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      @keyframes faFadeUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes faPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      @keyframes faSlideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      .fa-overlay { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; background: rgba(4,4,12,0.8); backdrop-filter: blur(20px); padding: 20px; }
      .fa-modal { background: linear-gradient(145deg, rgba(15,15,35,0.98), rgba(8,8,20,0.98)); border: 1px solid rgba(139,92,246,0.15); border-radius: 28px; padding: 40px 32px; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 0 80px rgba(139,92,246,0.06); animation: faFadeUp 0.6s cubic-bezier(0.175,0.885,0.32,1.275) both; position: relative; }
      .fa-icon-wrap { margin-bottom: 24px; }
      .fa-icon { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.06)); display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 2.2rem; border: 1.5px solid rgba(139,92,246,0.12); animation: faFloat 2.5s ease-in-out infinite; }
      .fa-title { font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 8px; }
      .fa-desc { font-size: 0.88rem; color: rgba(161,161,170,0.6); line-height: 1.7; margin-bottom: 24px; }
      .fa-features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; text-align: right; }
      .fa-feat { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: rgba(255,255,255,0.02); border-radius: 12px; font-size: 0.85rem; color: rgba(161,161,170,0.7); }
      .fa-feat i { font-size: 0.9rem; }
      .fa-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 16px 24px; border-radius: 16px; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #fff; font-weight: 700; font-size: 1rem; border: none; cursor: pointer; font-family: inherit; box-shadow: 0 8px 28px rgba(139,92,246,0.25); transition: transform 0.3s ease, box-shadow 0.3s ease; }
      .fa-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(139,92,246,0.35); }
      .fa-btn:active { transform: scale(0.97); }
      .fa-close { position: absolute; top: 16px; left: 16px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: rgba(148,163,184,0.3); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; font-size: 1rem; }
      .fa-close:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.2); color: #ef4444; transform: rotate(90deg); }
    `;
    document.head.appendChild(styles);

    const overlay = document.createElement('div');
    overlay.className = 'fa-overlay';
    overlay.id = 'fa-overlay';

    overlay.innerHTML = `
      <div class="fa-modal">
        <button class="fa-close" id="faCloseBtn" aria-label="إغلاق">&times;</button>
        <div class="fa-icon-wrap">
          <div class="fa-icon"><i class="fas fa-rocket"></i></div>
        </div>
        <h3 class="fa-title">نخبة تقنية المعلومات 2.1</h3>
        <p class="fa-desc">تم تحديث التطبيق بإصدار جديد كلياً مع تحسينات شاملة في التصميم والأداء والميزات.</p>
        <div class="fa-features">
          <div class="fa-feat"><i class="fas fa-check-circle" style="color:#10b981;"></i><span>تصميم فاخر وحديث بواجهة زجاجية</span></div>
          <div class="fa-feat"><i class="fas fa-check-circle" style="color:#10b981;"></i><span>تحسينات بصرية متطورة ورسوم متحركة فريدة</span></div>
          <div class="fa-feat"><i class="fas fa-check-circle" style="color:#10b981;"></i><span>نظام دعم فني متكامل بتذاكر ذكية</span></div>
          <div class="fa-feat"><i class="fas fa-check-circle" style="color:#10b981;"></i><span>مكتبة دورات برمجية بأحدث التقنيات</span></div>
        </div>
        <button class="fa-btn" id="faStartBtn">
          <i class="fas fa-sparkles"></i>
          <span>بدء الاستخدام</span>
        </button>
      </div>
    `;
    document.body.appendChild(overlay);

    const dismiss = () => {
      if (this._dismissing) return;
      this._dismissing = true;
      localStorage.setItem(this.storageKey, this.currentVersion);
      overlay.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(0.95)';
      setTimeout(() => overlay.remove(), 500);
    };

    var startBtn = document.getElementById('faStartBtn');
    var closeBtn = document.getElementById('faCloseBtn');
    if (startBtn) startBtn.addEventListener('click', dismiss);
    if (closeBtn) closeBtn.addEventListener('click', dismiss);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) dismiss();
    });
  }
}
