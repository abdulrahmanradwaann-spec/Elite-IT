/* 
  Elite IT Smart Campus PWA - Overlay System
  Feature Announcement One-Time Notification
*/

class FeatureAnnouncement {
  constructor() {
    this.currentVersion = 'v2.1.0'; // Update this to show the modal again
    this.storageKey = 'elite_app_version';
    this.init();
  }

  init() {
    const savedVersion = localStorage.getItem(this.storageKey);
    
    // Only show if the version is different or doesn't exist
    if (savedVersion !== this.currentVersion) {
      setTimeout(() => {
        this.buildUI();
      }, 3500); 
    }
  }

  buildUI() {
    if (document.getElementById('featureAnnouncementModal')) return;

    // Create container styles
    const styles = document.createElement('style');
    styles.textContent = `
      @keyframes faModalIn {
        from { opacity: 0; transform: scale(0.95) translateY(20px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes faGlowPulse {
        0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.1); }
        50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.2); }
      }
      @keyframes faIconFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
    `;
    document.head.appendChild(styles);

    this.overlay = document.createElement('div');
    this.overlay.id = 'featureAnnouncementModal';
    Object.assign(this.overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: '99999',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: '0',
      transition: 'opacity 0.5s ease'
    });

    this.modal = document.createElement('div');
    Object.assign(this.modal.style, {
      background: 'linear-gradient(145deg, rgba(15, 15, 30, 0.85), rgba(10, 10, 22, 0.9))',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      boxShadow: '0 0 40px rgba(139, 92, 246, 0.08), 0 20px 60px rgba(0, 0, 0, 0.4)',
      borderRadius: '24px',
      padding: '32px 28px',
      width: '90%',
      maxWidth: '400px',
      textAlign: 'center',
      color: '#fff',
      transform: 'translateY(20px)',
      transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      fontFamily: 'inherit',
      animation: 'faModalIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both'
    });

    this.modal.innerHTML = `
      <div style="font-size: 2.8rem; margin-bottom: 12px; animation: faIconFloat 2.5s ease-in-out infinite; line-height: 1;">
        <span style="color: #8b5cf6;">{</span><span style="color: #06b6d4;"> }</span>
      </div>
      
      <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 6px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        تحديث النخبة الجديد
      </h2>
      
      <p style="color: rgba(148, 163, 184, 0.8); font-size: 0.85rem; margin-bottom: 20px;">
        تم إضافة تحسينات جديدة للتطبيق
      </p>
      
      <div style="text-align: right; background: rgba(0, 0, 0, 0.25); padding: 16px 18px; border-radius: 16px; margin-bottom: 22px; border: 1px solid rgba(255, 255, 255, 0.04);">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; color: #a78bfa; font-size: 0.8rem; font-weight: 700;">
          <i class="fas fa-sparkles"></i>
          <span>أبرز التحديثات:</span>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.82rem; line-height: 2; color: #cbd5e1;">
          <li style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle" style="color: #10b981; font-size: 0.7rem;"></i>
            تصميم فاخر للواجهة بنظام Glassmorphism الجديد
          </li>
          <li style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle" style="color: #10b981; font-size: 0.7rem;"></i>
            شريط تنقل سفلي متطور مع تأثيرات نيون
          </li>
          <li style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle" style="color: #10b981; font-size: 0.7rem;"></i>
            أزهار وكروت متطورة مع حركات انسيابية
          </li>
          <li style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle" style="color: #10b981; font-size: 0.7rem;"></i>
            تحسين الأداء وتجربة الاستخدام
          </li>
        </ul>
      </div>

      <button id="btnDismissFeature" style="
        background: linear-gradient(135deg, #8b5cf6, #06b6d4);
        border: none;
        color: #fff;
        padding: 12px 0;
        font-size: 0.95rem;
        font-weight: 700;
        border-radius: 14px;
        cursor: pointer;
        width: 100%;
        box-shadow: 0 4px 20px rgba(139, 92, 246, 0.25);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: inherit;
        letter-spacing: 0.3px;
      "
      onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 30px rgba(139,92,246,0.35)'"
      onmouseout="this.style.transform=''; this.style.boxShadow=''"
      >فهمت ✓</button>
    `;

    this.overlay.appendChild(this.modal);
    document.body.appendChild(this.overlay);

    requestAnimationFrame(() => {
      this.overlay.style.opacity = '1';
      this.modal.style.transform = 'translateY(0)';
    });

    document.getElementById('btnDismissFeature').addEventListener('click', () => {
      this.dismiss();
    });

    // Also dismiss on overlay click (not modal)
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.dismiss();
    });
  }

  dismiss() {
    localStorage.setItem(this.storageKey, this.currentVersion);

    this.overlay.style.opacity = '0';
    this.modal.style.transform = 'translateY(20px) scale(0.95)';
    
    setTimeout(() => {
      this.overlay.remove();
    }, 500);
  }
}

// Export
window.FeatureAnnouncement = FeatureAnnouncement;
