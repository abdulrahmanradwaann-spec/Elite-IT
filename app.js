/**
 * نخبة تقنية المعلومات - Master Logic 2026 v3.1
 */

const STUDENT_DB = [
  { "id": "24090111002", "name": "أنور محمد عبد الرحمن محمد صديق", "password": "auto123", "verified": false },
  { "id": "24090111003", "name": "جمال أحمد عبده عبد الله", "password": "auto123", "verified": false },
  { "id": "24090111004", "name": "حبيب الله أرسلان محمد علي الدبعي", "password": "auto123", "verified": false },
  { "id": "24090111005", "name": "عبد الرحمن رضوان سلطان أحمد", "password": "auto123", "verified": true },
  { "id": "24090111006", "name": "علي أحمد علي حسن باشعيب", "password": "auto123", "verified": false },
  { "id": "24090111007", "name": "عمر عبد الله عمر صالح بادقيل", "password": "auto123", "verified": false },
  { "id": "24090111010", "name": "محسن أحمد عبد الله محمد المحضار", "password": "auto123", "verified": false },
  { "id": "24090111013", "name": "محمد علي صالح محمد صورة", "password": "auto123", "verified": false },
  { "id": "24090111014", "name": "موفق عبد الرحمن علي سعيد", "password": "auto123", "verified": false },
  { "id": "24090111016", "name": "يوسف أمين برك محمد التميمي", "password": "auto123", "verified": false },
  { "id": "24090111017", "name": "يونس محمد سليمان سالم يحيى", "password": "auto123", "verified": false },
  { "id": "24090111018", "name": "يونس أحمد عبد الملك محمود", "password": "auto123", "verified": false }
];

if (!localStorage.getItem('elite_students')) {
    try { localStorage.setItem('elite_students', JSON.stringify(STUDENT_DB)); } catch (e) {}
}

if (!localStorage.getItem('elite_verified')) {
    try { localStorage.setItem('elite_verified', JSON.stringify(["24090111005"])); } catch (e) {}
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
    document.body.classList.remove('offline-mode');
    var indicator = document.getElementById('offlineIndicator');
    if (indicator) indicator.remove();
    showToast('تم استعادة الاتصال بالإنترنت', 'success');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline-mode');
    if (!document.getElementById('offlineIndicator')) {
        var bar = document.createElement('div');
        bar.id = 'offlineIndicator';
        bar.style.cssText = 'position:fixed;bottom:calc(var(--bottom-nav-height,68px) + env(safe-area-inset-bottom,0));left:0;right:0;background:rgba(239,68,68,0.9);backdrop-filter:blur(8px);color:#fff;text-align:center;padding:6px;font-size:0.8rem;font-weight:700;z-index:9999;font-family:inherit;';
        bar.textContent = 'وضع عدم الاتصال — التطبيق يعمل من النسخة المحفوظة';
        document.body.appendChild(bar);
    }
    showToast('أنت الآن تعمل بدون إنترنت', 'error');
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
    showToast('حسناً', 'success');
});

const PROTECTED_PAGES = ['student.html', 'dashboard.html', 'admin.html', 'admin-notifications.html'];
const RESTRICTED_PAGES = {
    'courses.html': 'access_courses',
    'support.html': 'access_support'
};

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    initGlobalUI();
});

function getPermissions() {
    var session = null;
    try { session = JSON.parse(localStorage.getItem('student_session') || '{}'); } catch (e) {}
    if (!session || !session.id) return {};
    var verified = [];
    try { verified = JSON.parse(localStorage.getItem('elite_verified') || '[]'); } catch (e) {}
    var students = [];
    try { students = JSON.parse(localStorage.getItem('elite_students') || '[]'); } catch (e) {}
    var studentRecord = students.find(function(s) { return s.id === session.id; });
    var isVerified = verified.indexOf(session.id) !== -1 || (studentRecord && studentRecord.verified === true);
    return { access_courses: isVerified, access_support: isVerified };
}

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
        return;
    }
    if (session) {
        var restricted = RESTRICTED_PAGES[path];
        if (restricted) {
            var permissions = getPermissions();
            if (!permissions[restricted]) {
                window.location.href = 'student.html';
            }
        }
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
            var nameEls = ['sidebarName', 'welcomeName', 'idCardName'];
            nameEls.forEach(function(id) { var e = document.getElementById(id); if (e) e.innerText = data.name; });
            var idEl = document.getElementById('sidebarId');
            if (idEl) idEl.innerText = data.id;
        } catch (e) {}

        // Log page visit
        if (currentPath !== 'index.html' && currentPath !== 'login.html') {
            try {
                var data2 = JSON.parse(session);
                var log = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
                var pageNames = { 'dashboard.html': 'فتح لوحة التحكم', 'student.html': 'عرض الملف الأكاديمي', 'exams.html': 'عرض جدول الامتحانات', 'courses.html': 'تصفح الدورات', 'grades.html': 'عرض الدرجات', 'support.html': 'زيارة الدعم الفني', 'projects.html': 'عرض المشاريع', 'tests.html': 'عرض الاختبارات', 'trips.html': 'عرض الرحلات' };
                log.push({ studentId: data2.id, action: pageNames[currentPath] || 'تصفح ' + currentPath, time: new Date().toLocaleString('ar-EG') });
                if (log.length > 100) log = log.slice(-100);
                localStorage.setItem('elite_activity_log', JSON.stringify(log));
            } catch (logErr) {}
        }
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

    initSidebarToggle();
    updateVerificationBadges();
}

function initSidebarToggle() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    var overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }

    overlay.addEventListener('click', closeSidebar);

    document.querySelectorAll('.menu-toggle, .sidebar-toggle-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSidebar();
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) closeSidebar();
    });
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

function updateVerificationBadges() {
    var isVerified = false;
    try {
        var session = JSON.parse(localStorage.getItem('student_session') || '{}');
        var verified = JSON.parse(localStorage.getItem('elite_verified') || '[]');
        var students = JSON.parse(localStorage.getItem('elite_students') || '[]');
        var studentRecord = students.find(function(s) { return s.id === session.id; });
        isVerified = verified.includes(session.id) || (studentRecord && studentRecord.verified === true);
    } catch (e) {}

    var badgeHTML = '<span class="verified-badge-icon" data-tooltip="موثّق من الجامعة">' +
        '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' +
        '</span>';

    document.querySelectorAll('.verified-badge-icon').forEach(function(b) {
        if (!b.closest('[data-keep-badge]')) {
            b.remove();
        }
    });

    if (isVerified) {
        var targets = [
            { id: 'sidebarName', mode: 'inside' },
            { id: 'welcomeName', mode: 'after' },
            { id: 'studentFullName', mode: 'inside' },
            { id: 'idCardName', mode: 'inside' }
        ];

        targets.forEach(function(t) {
            var el = document.getElementById(t.id);
            if (!el) return;
            var parent = el.parentNode;
            if (parent.querySelector('.verified-badge-icon')) return;
            if (t.mode === 'inside') {
                el.insertAdjacentHTML('beforeend', badgeHTML);
            } else {
                el.insertAdjacentHTML('afterend', badgeHTML);
            }
        });
    }

    applyNavigationRestrictions();
}

function applyNavigationRestrictions() {
    var session = null;
    try { session = localStorage.getItem('student_session'); } catch (e) {}
    var permissions = session ? getPermissions() : {};
    try { localStorage.setItem('elite_permissions', JSON.stringify(permissions)); } catch (e) {}

    var restrictedSelectors = [];
    Object.keys(RESTRICTED_PAGES).forEach(function(page) {
        restrictedSelectors.push('.nav-link[href="' + page + '"]');
        restrictedSelectors.push('.bottom-link[href="' + page + '"]');
        restrictedSelectors.push('a.offline-link[href="' + page + '"]');
    });

    document.querySelectorAll(restrictedSelectors.join(', ')).forEach(function(link) {
        var page = link.getAttribute('href');
        var perm = RESTRICTED_PAGES[page];
        var hasPermission = permissions[perm];
        if (hasPermission) {
            link.style.display = '';
            link.style.visibility = 'visible';
            var li = link.closest('.nav-item');
            if (li) { li.style.display = ''; li.style.visibility = 'visible'; }
        } else {
            link.style.display = 'none';
            var li = link.closest('.nav-item');
            if (li) { li.style.display = 'none'; }
        }
    });

    var courseBtn = document.querySelector('a.btn[href="courses.html"]');
    if (courseBtn) {
        courseBtn.style.display = permissions.access_courses ? '' : 'none';
    }
}

window.handleLogout = function() {
    localStorage.removeItem('student_session');
    localStorage.removeItem('elite_permissions');
    showToast('تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => window.location.href = 'login.html', 1000);
};
