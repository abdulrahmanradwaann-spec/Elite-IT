/* 
  Elite IT Smart Campus PWA - Overlay System
  Account Page Enhancements — UI/UX Premium
*/

class AccountEnhancements {
  constructor() {
    this.init();
  }

  init() {
    // Only run on the account page
    const card = document.querySelector('.card-master[style*="max-width: 900px"]');
    if (!card) return;

    this.card = card;
    this.addFingerprintTrigger();
    this.setupExpandableActivities();
  }

  addFingerprintTrigger() {
    const btn = document.createElement('button');
    btn.className = 'fingerprint-trigger';
    btn.innerHTML = '<i class="fas fa-fingerprint"></i> تسجيل الدخول بالبصمة';
    btn.addEventListener('click', () => this.showFingerprintModal());
    this.card.appendChild(btn);
  }

  showFingerprintModal() {
    if (document.getElementById('fingerprintModal')) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'fingerprint-overlay';
    overlay.id = 'fingerprintModal';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'fingerprint-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.addEventListener('click', () => this.closeModal(overlay));

    // Fingerprint circle
    const circle = document.createElement('div');
    circle.className = 'fingerprint-circle';
    circle.id = 'fpCircle';
    circle.innerHTML = '<i class="fas fa-fingerprint"></i>';

    // Title
    const title = document.createElement('p');
    title.className = 'fingerprint-title';
    title.textContent = 'تسجيل الدخول بالبصمة';

    // Subtitle
    const sub = document.createElement('p');
    sub.className = 'fingerprint-sub';
    sub.textContent = 'قم بتأكيد هويتك للمتابعة';

    // Success element
    const success = document.createElement('div');
    success.className = 'fingerprint-success';
    success.id = 'fpSuccess';
    success.innerHTML = '<i class="fas fa-check-circle"></i><span>تم التحقق بنجاح</span>';

    // Password reset container
    const resetContainer = document.createElement('div');
    resetContainer.className = 'password-reset-container';
    resetContainer.id = 'resetContainer';
    resetContainer.innerHTML = `
      <p class="reset-form-title">إعادة إنشاء رمز الدخول</p>
      <p class="reset-form-sub">أدخل رمز الدخول الجديد من فضلك</p>
      <div class="reset-input-group">
        <input type="password" id="newPass" placeholder=" " autocomplete="off">
        <label for="newPass">رمز الدخول الجديد</label>
      </div>
      <div class="reset-input-group">
        <input type="password" id="confirmPass" placeholder=" " autocomplete="off">
        <label for="confirmPass">تأكيد رمز الدخول</label>
      </div>
      <button class="reset-confirm-btn" id="confirmResetBtn">تأكيد الرمز الجديد ✓</button>
    `;

    overlay.append(closeBtn, circle, title, sub, success, resetContainer);
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add('show');
    });

    // Start fingerprint simulation
    setTimeout(() => {
      this.showFingerprintSuccess(circle, success, resetContainer, title, sub);
    }, 3000);

    // Handle reset confirmation
    document.getElementById('confirmResetBtn').addEventListener('click', () => {
      this.closeModal(overlay);
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeModal(overlay);
    });
  }

  showFingerprintSuccess(circle, success, resetContainer, title, sub) {
    circle.classList.add('success');
    circle.querySelector('i').className = 'fas fa-check-circle';
    success.classList.add('show');

    // After success animation, show password reset
    setTimeout(() => {
      success.classList.remove('show');
      circle.style.display = 'none';
      title.style.display = 'none';
      sub.style.display = 'none';
      resetContainer.classList.add('show');
    }, 2000);
  }

  closeModal(overlay) {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 500);
  }

  setupExpandableActivities() {
    const activities = this.card.querySelector('.mt-30');
    if (!activities) return;

    const content = activities.querySelector('p');
    const isExpanded = localStorage.getItem('activities_expanded') === 'true';

    if (isExpanded) {
      content.style.display = 'block';
      activities.style.cursor = 'default';
      activities.querySelector('h3').innerHTML = '<i class="fas fa-brain"></i> النشاطات والمهارات';
    } else {
      content.style.display = 'none';
      activities.addEventListener('click', () => this.toggleActivities(activities, content), { once: true });
    }

    // Remove the ::after arrow if already expanded
    if (isExpanded) {
      activities.style.setProperty('--arrow-display', 'none');
    }
  }

  toggleActivities(activities, content) {
    content.style.display = 'block';
    content.style.animation = 'successFadeIn 0.4s ease-out both';
    activities.style.cursor = 'default';
    activities.querySelector('h3').innerHTML = '<i class="fas fa-brain"></i> النشاطات والمهارات';
    localStorage.setItem('activities_expanded', 'true');
  }
}

window.AccountEnhancements = AccountEnhancements;
