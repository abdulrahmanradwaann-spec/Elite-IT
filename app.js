/**
 * نخبة تقنية المعلومات - Master Logic 2026 v2.1
 */

const STUDENT_DB = [
  { "id": "24090111002", "name": "أنور محمد عبد الرحمن محمد صديق", "password": "auto123" },
  { "id": "24090111003", "name": "جمال أحمد عبده عبد الله", "password": "auto123" },
  { "id": "24090111004", "name": "حبيب الله أرسلان محمد علي الدبعي", "password": "auto123" },
  { "id": "24090111005", "name": "عبد الرحمن رضوان سلطان أحمد", "password": "auto123" },
  { "id": "24090111006", "name": "علي أحمد علي حسن باشعيب", "password": "auto123" },
  { "id": "24090111007", "name": "عمر عبد الله عمر صالح بادقيل", "password": "auto123" },
  { "id": "24090111010", "name": "محسن أحمد عبد الله محمد المحضار", "password": "auto123" },
  { "id": "24090111013", "name": "محمد علي صالح محمد صوره", "password": "auto123" },
  { "id": "24090111014", "name": "موفق عبد الرحمن علي سعيد", "password": "auto123" },
  { "id": "24090111016", "name": "يوسف أمين برك محمد التميمي", "password": "auto123" },
  { "id": "24090111017", "name": "يونس محمد سليمان سالم يحيى", "password": "auto123" },
  { "id": "24090111018", "name": "يونس أحمد عبد الملك محمود", "password": "auto123" }
];

if (!localStorage.getItem('elite_students')) {
    try { localStorage.setItem('elite_students', JSON.stringify(STUDENT_DB)); } catch (e) {}
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').then(reg => {
            reg.onupdatefound = () => {
                const installingWorker = reg.installing;
                if (installingWorker) {
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showToast('تم تحديث النظام تلقائياً للنسخة الأحدث', 'success');
                            setTimeout(() => window.location.reload(), 2000);
                        }
                    };
                }
            };
        }).catch(() => {});
    });
}

window.addEventListener('online', () => {
    showToast('تم استعادة الاتصال بالإنترنت', 'success');
    document.body.classList.remove('offline-mode');
});

window.addEventListener('offline', () => {
    showToast('أنت الآن تعمل بدون إنترنت (وضع الأوفلاين)', 'error');
    document.body.classList.add('offline-mode');
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !document.getElementById('install-pwa-btn')) {
        const installLi = document.createElement('li');
        installLi.className = 'nav-item';
        installLi.id = 'install-pwa-btn';
        installLi.innerHTML = `
            <a href="javascript:void(0)" class="nav-link" style="color: var(--success); background: rgba(0, 255, 136, 0.05); border: 1px dashed var(--success);">
                <i class="fas fa-download"></i>
                <span>تثبيت التطبيق</span>
            </a>
        `;
        installLi.onclick = (el) => {
            el.preventDefault();
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        installLi.remove();
                    }
                    deferredPrompt = null;
                });
            }
        };
        navLinks.appendChild(installLi);
    }
});

window.addEventListener('appinstalled', () => {
    showToast('تم تثبيت التطبيق بنجاح على جهازك', 'success');
});

const PROTECTED_PAGES = ['student.html', 'dashboard.html', 'admin.html', 'admin-notifications.html'];

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    initGlobalUI();
});

function checkSession() {
    var session = null;
    try { session = localStorage.getItem('student_session'); } catch (e) {}
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (PROTECTED_PAGES.includes(path) && !session) {
        window.location.href = 'login.html';
        return;
    }
    if (path === 'login.html' && session) {
        window.location.href = 'student.html';
    }
}

function initGlobalUI() {
    document.body.style.opacity = '1';

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .bottom-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    var session = null;
    try { session = localStorage.getItem('student_session'); } catch (e) {}
    const userContainer = document.querySelector('.sidebar-user');
    if (session && userContainer) {
        try {
            const data = JSON.parse(session);
            const nameEl = document.getElementById('sidebarName');
            const idEl = document.getElementById('sidebarId');
            if (nameEl) nameEl.innerText = data.name;
            if (idEl) idEl.innerText = data.id;
        } catch (e) {}
    } else if (userContainer) {
        userContainer.innerHTML = `
            <div class="user-avatar" style="background: var(--primary-glow); display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-user-lock"></i>
            </div>
            <div class="user-info">
                <h6>بوابة الطلاب</h6>
                <p>سجل دخولك الآن</p>
            </div>
        `;
        userContainer.href = 'login.html';
    }
}

function showToast(msg, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast glass ${type}`;
    toast.style.cssText = `
        padding: 15px 25px; border-radius: 12px; border: 1px solid var(--glass-border);
        color: #fff; font-weight: 600; display: flex; align-items: center; gap: 12px;
        box-shadow: var(--shadow-soft);
    `;

    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    const color = type === 'success' ? 'var(--success)' : 'var(--error)';

    const iconEl = document.createElement('i');
    iconEl.className = `fas fa-${icon}`;
    iconEl.style.color = color;
    toast.appendChild(iconEl);

    const spanEl = document.createElement('span');
    spanEl.textContent = msg;
    toast.appendChild(spanEl);

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

window.handleLogout = function() {
    localStorage.removeItem('student_session');
    showToast('تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => window.location.href = 'login.html', 1000);
};
