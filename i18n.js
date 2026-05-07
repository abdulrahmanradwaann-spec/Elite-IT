const translations = {
    ar: {
        "lang-text": "English",
        "brand-text": "نخبة IT",
        "home": "الرئيسية",
        "exams": "جدول الاختبارات",
        "projects": "المشاريع",
        "trips": "الرحلات",
        "account": "حسابي",
        "welcome": "مرحباً بك في <span style='color: var(--primary);'>النخبة</span>",
        "welcome-user": "أهلاً بك، <span style='color: var(--primary);'>{name}</span>",
        "sub-header": "النظام الأكاديمي الموحد - جامعة القرآن الكريم والعلوم الإسلامية",
        "exams-title": "جدول <span style='color: var(--primary);'>الامتحانات النهائية</span>",
        "exams-desc": "الفصل الدراسي الثاني - المستوى الثاني (IT)",
        "exams-btn": "عرض جدول الامتحانات",
        "status-done": "قد تم",
        "table-subject": "المادة الدراسية",
        "table-date": "التاريخ",
        "table-day": "اليوم",
        "table-lecturer": "المحاضر",
        "projects-title": "إدارة <span class='text-gradient'>المشاريع البرمجية</span>",
        "projects-sub": "تابع تقدم مشاريعك وتواصل مع فريقك",
        "no-projects": "لا توجد مشاريع متاحة حالياً",
        "projects-coming": "قسم المشاريع جاهز ومخصص لعرض إبداعات الطلاب التقنية. سيتم إضافة المشاريع والتطبيقات قريباً جداً لتكون مرجعاً للجميع.",
        "coming-soon": "قريباً",
        "trips-title": "الرحلات <span class='text-gradient'>والفعاليات</span>",
        "trips-sub": "استكشف العالم خارج القاعات الدراسية",
        "no-trips": "لا توجد رحلات موثقة بعد",
        "trips-coming": "قسم الرحلات والفعاليات في انتظار مغامراتكم. سيتم مشاركة تجارب السفر والرحلات الاستكشافية قريباً.",
        "profile-title": "الملف <span style='color: var(--primary);'>الأكاديمي</span>",
        "profile-sub": "بيانات الطالب الشخصية والنشاطات",
        "profile-active": "حساب نشط",
        "profile-uni": "الجامعة",
        "profile-uni-name": "القرآن الكريم والعلوم الإسلامية",
        "profile-dept": "القسم / المستوى",
        "profile-dept-name": "تقنية المعلومات | المستوى الثاني",
        "profile-skills": "النشاطات والمهارات",
        "no-skills": "لا توجد نشاطات مسجلة حالياً. سيتم تحديث هذا القسم قريباً بناءً على إنجازاتك في الكلية.",
        "footer-dev": "المطور: فريق نخبة تقنية المعلومات &copy; 2026",
        "install-app": "تثبيت التطبيق",
        "logout": "تسجيل الخروج",
        "login": "تسجيل الدخول"
    },
    en: {
        "lang-text": "العربية",
        "brand-text": "Elite IT",
        "home": "Home",
        "exams": "Exam Schedule",
        "projects": "Projects",
        "trips": "Trips",
        "account": "Profile",
        "welcome": "Welcome to <span style='color: var(--primary);'>Elite</span>",
        "welcome-user": "Welcome, <span style='color: var(--primary);'>{name}</span>",
        "sub-header": "Unified Academic System - University of Holy Quran & Islamic Sciences",
        "exams-title": "Final <span style='color: var(--primary);'>Exam Schedule</span>",
        "exams-desc": "Second Semester - Level Two (IT)",
        "exams-btn": "View Exam Schedule",
        "status-done": "Completed",
        "table-subject": "Subject",
        "table-date": "Date",
        "table-day": "Day",
        "table-lecturer": "Lecturer",
        "projects-title": "Software <span class='text-gradient'>Project Management</span>",
        "projects-sub": "Track your project progress and connect with your team",
        "no-projects": "No projects available at the moment",
        "projects-coming": "The projects section is ready to showcase students' technical creations. Projects and applications will be added very soon.",
        "coming-soon": "Coming Soon",
        "trips-title": "Trips & <span class='text-gradient'>Events</span>",
        "trips-sub": "Explore the world outside classrooms",
        "no-trips": "No trips documented yet",
        "trips-coming": "The trips and events section is awaiting your adventures. Exploration experiences will be shared soon.",
        "profile-title": "Academic <span style='color: var(--primary);'>Profile</span>",
        "profile-sub": "Personal student data and activities",
        "profile-active": "Active Account",
        "profile-uni": "University",
        "profile-uni-name": "Holy Quran and Islamic Sciences",
        "profile-dept": "Department / Level",
        "profile-dept-name": "Information Technology | Level 2",
        "profile-skills": "Activities & Skills",
        "no-skills": "No activities registered yet. This section will be updated soon based on your achievements.",
        "footer-dev": "Developer: Elite IT Team &copy; 2026",
        "install-app": "Install App",
        "logout": "Logout",
        "login": "Login"
    }
};

let currentLang = localStorage.getItem('app_lang') || 'ar';

function applyTranslations() {
    const t = translations[currentLang];
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // Update text elements by ID
    const langText = document.getElementById('lang-text');
    if (langText) langText.innerText = t['lang-text'];
    
    // Brand
    const brand = document.querySelector('.brand-text') || document.querySelector('.brand-name');
    if (brand) brand.innerText = t['brand-text'];

    // Sidebar & Bottom Nav
    const navMap = {
        "fas fa-home": "home",
        "fas fa-calendar-alt": "exams",
        "fas fa-briefcase": "projects",
        "fas fa-bus": "trips",
        "fas fa-user-circle": "account",
        "fas fa-user-graduate": "account"
    };

    document.querySelectorAll('.nav-link, .bottom-link').forEach(link => {
        const icon = link.querySelector('i');
        const span = link.querySelector('span');
        if (icon && span) {
            // Find key by looking for any class that matches our map
            const iconClasses = icon.className.split(' ');
            let key = null;
            for (const cls of iconClasses) {
                const fullCls = `fas ${cls}`; // simplified check
                // Try exact match or just the specific icon class
                if (navMap[icon.className]) key = navMap[icon.className];
                else if (navMap[`fas ${cls}`]) key = navMap[`fas ${cls}`];
            }
            if (key) span.innerText = t[key];
        }
    });

    // Welcome Message
    const welcome = document.querySelector('.welcome-msg');
    if (welcome) {
        const session = localStorage.getItem('student_session');
        if (session) {
            const data = JSON.parse(session);
            const name = data.name ? data.name.split(' ')[0] : 'الطالب';
            welcome.innerHTML = t['welcome-user'].replace('{name}', name);
        } else {
            // Check if it's a page title or general welcome
            if (currentPath === 'index.html' || currentPath === '') {
                welcome.innerHTML = t['welcome'];
            } else if (currentPath === 'exams.html') {
                welcome.innerHTML = t['exams-title'];
            } else if (currentPath === 'projects.html') {
                welcome.innerHTML = t['projects-title'];
            } else if (currentPath === 'trips.html') {
                welcome.innerHTML = t['trips-title'];
            } else if (currentPath === 'student.html') {
                welcome.innerHTML = t['profile-title'];
            }
        }
    }

    // Header Sub
    const subHeader = document.querySelector('.header-sub') || document.querySelector('.main-content .text-muted');
    if (subHeader) {
        if (currentPath === 'index.html' || currentPath === '') {
            subHeader.innerText = t['sub-header'];
        } else if (currentPath === 'exams.html') {
            subHeader.innerText = t['exams-desc'];
        } else if (currentPath === 'projects.html') {
            subHeader.innerText = t['projects-sub'];
        } else if (currentPath === 'trips.html') {
            subHeader.innerText = t['trips-sub'];
        } else if (currentPath === 'student.html') {
            subHeader.innerText = t['profile-sub'];
        }
    }

    // Footer
    const footer = document.querySelector('.footer p');
    if (footer) footer.innerHTML = t['footer-dev'];

    // Empty States
    const emptyTitle = document.querySelector('.empty-state-card h2');
    const emptyDesc = document.querySelector('.empty-state-card p');
    const emptyBtn = document.querySelector('.empty-state-card button span');

    if (emptyTitle) {
        if (currentPath === 'projects.html') emptyTitle.innerText = t['no-projects'];
        if (currentPath === 'trips.html') emptyTitle.innerText = t['no-trips'];
    }
    if (emptyDesc) {
        if (currentPath === 'projects.html') emptyDesc.innerText = t['projects-coming'];
        if (currentPath === 'trips.html') emptyDesc.innerText = t['trips-coming'];
    }
    if (emptyBtn) emptyBtn.innerText = t['coming-soon'];

    // Profile Page Specifics
    if (currentPath === 'student.html') {
        const profileActive = document.querySelector('.status-badge:last-child span');
        if (profileActive) profileActive.innerText = t['profile-active'];
        
        // Fix labels without :contains
        document.querySelectorAll('.card-master p').forEach(p => {
            const text = p.innerText.toUpperCase();
            if (text.includes('الجامعة') || text.includes('UNIVERSITY')) {
                p.innerText = t['profile-uni'];
                if (p.nextElementSibling) p.nextElementSibling.innerText = t['profile-uni-name'];
            }
            if (text.includes('القسم') || text.includes('DEPARTMENT')) {
                p.innerText = t['profile-dept'];
                if (p.nextElementSibling) p.nextElementSibling.innerText = t['profile-dept-name'];
            }
        });

        const skillsTitle = document.querySelector('.mt-30 h3');
        const skillsDesc = document.querySelector('.mt-30 p');
        if (skillsTitle) skillsTitle.innerHTML = `<i class="fas fa-brain" style="margin-left: 10px;"></i> ${t['profile-skills']}`;
        if (skillsDesc) skillsDesc.innerText = t['no-skills'];
    }

    // Table Headers
    const headers = document.querySelectorAll('th');
    if (headers.length >= 4) {
        headers[0].innerText = t['table-subject'];
        headers[1].innerText = t['table-date'];
        headers[2].innerText = t['table-day'];
        headers[3].innerText = t['table-lecturer'];
    }

    const statusBadge = document.querySelector('.status-badge span');
    if (statusBadge) {
        if (statusBadge.innerText.includes('تم') || statusBadge.innerText.includes('Done') || statusBadge.innerText.includes('Completed')) {
            statusBadge.innerText = t['status-done'];
        }
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('app_lang', currentLang);
    applyTranslations();
    
    if (window.showToast) {
        window.showToast(currentLang === 'ar' ? 'تم تغيير اللغة للعربية' : 'Language changed to English');
    }
}

document.addEventListener('DOMContentLoaded', applyTranslations);
