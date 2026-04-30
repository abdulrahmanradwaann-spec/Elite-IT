/**
 * نخبة تقنية المعلومات - Master Logic 2026
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

// Initialize Local Database if not exists
if (!localStorage.getItem('elite_students')) {
    localStorage.setItem('elite_students', JSON.stringify(STUDENT_DB));
}

// 1. Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch(err => console.log('SW Error:', err));
    });
}

// 2. Global State
const PROTECTED_PAGES = ['student.html']; // Only student.html is protected now

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    initGlobalUI();
});

function checkSession() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const session = localStorage.getItem('student_session');
    
    // Redirect if accessing protected page without session
    if (PROTECTED_PAGES.includes(path) && !session) {
        window.location.href = 'login.html';
        return;
    }

    // Auto-login logic
    if (path === 'login.html' && session) {
        window.location.href = 'student.html';
    }
}

function initGlobalUI() {
    // Fade-in animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease-in-out';
    setTimeout(() => document.body.style.opacity = '1', 100);

    // Active Link Highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .bottom-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update Sidebar User if logged in
    const session = localStorage.getItem('student_session');
    const userContainer = document.querySelector('.sidebar-user');
    if (session && userContainer) {
        const data = JSON.parse(session);
        document.getElementById('sidebarName').innerText = data.name;
        document.getElementById('sidebarId').innerText = data.id;
        // Student images removed as requested
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

// 3. Shared Utilities
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
        box-shadow: var(--shadow-soft); animation: slideUp 0.3s forwards;
    `;
    
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    const color = type === 'success' ? 'var(--success)' : 'var(--error)';
    toast.innerHTML = `<i class="fas fa-${icon}" style="color: ${color}"></i> <span>${msg}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// 4. Logout Handler
window.handleLogout = function() {
    localStorage.removeItem('student_session');
    showToast('تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => window.location.href = 'login.html', 1000);
};

// 5. Global CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;
document.head.appendChild(style);
