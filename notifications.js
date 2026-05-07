/**
 * Elite IT Professional Notifications Manager - Production Fixed 2026
 * Handles FCM Tokens, Permissions, and One-Time Official Alerts.
 * Ensuring "Show Once" logic is bulletproof across sessions and users.
 */

const NOTIF_CONFIG = {
    // Unique key for this specific notification campaign
    key: "elite_portal_maintenance_2026_v3_fixed",
    title: "🔧 تحديثات وتحسينات النظام",
    body: "مرحباً عزيزي الطالب، نعمل حالياً على تحسين التطبيق وتطويره ليكون أفضل وأسرع وأكثر استقراراً. شكراً لثقتك بنا.",
    icon: './logo.png',
    badge: './logo.png',
    tag: 'system-maintenance'
};

class ProfessionalNotificationSystem {
    constructor() {
        this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    }

    async init() {
        if (!this.isSupported) return;

        // CRITICAL CHECK: If already accepted or permission already granted by browser
        // We stop here to ensure the banner never bothers the user again.
        if (this.isAlreadyDelivered() || Notification.permission === 'granted') {
            // If browser has permission but our app doesn't have the "delivered" flag, 
            // we send it once and set the flag quietly.
            if (Notification.permission === 'granted' && !this.isAlreadyDelivered()) {
                this.deliverOfficialNotification();
            }
            return;
        }

        // If permission is explicitly denied, don't show anything
        if (Notification.permission === 'denied') return;

        // Show reminder banner after a short delay for non-decided users
        setTimeout(() => this.showPermissionBanner(), 3000);
    }

    isAlreadyDelivered() {
        // Global device-level flag to prevent repeats across logins/logouts
        return localStorage.getItem(NOTIF_CONFIG.key) === 'true';
    }

    markAsDelivered() {
        localStorage.setItem(NOTIF_CONFIG.key, 'true');
        console.log("[Elite Notifs] State locked: Notification will not repeat.");
    }

    async deliverOfficialNotification() {
        try {
            // We mark it as delivered FIRST to prevent race conditions
            this.markAsDelivered();

            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(NOTIF_CONFIG.title, {
                body: NOTIF_CONFIG.body,
                icon: NOTIF_CONFIG.icon,
                badge: NOTIF_CONFIG.badge,
                vibrate: [200, 100, 200],
                tag: NOTIF_CONFIG.tag,
                requireInteraction: true,
                data: {
                    url: window.location.origin + '/dashboard.html',
                    timestamp: Date.now()
                }
            });
        } catch (err) {
            // Even if the visual notification fails, the user "agreed", so we keep the flag.
            this.markAsDelivered();
            console.warn("[Elite Notifs] Delivery failed but state saved.", err);
        }
    }

    showPermissionBanner() {
        if (this.isAlreadyDelivered() || document.getElementById('notif-permission-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'notif-permission-banner';
        banner.innerHTML = `
            <div class="permission-banner-content animate-fade-down">
                <div class="banner-icon">🔧</div>
                <div class="banner-text">
                    <strong>تفعيل إشعارات النظام</strong>
                    <span>تأكد من تفعيل التنبيهات لتلقي تحديثات الصيانة والجداول فوراً.</span>
                </div>
                <div class="banner-actions">
                    <button onclick="eliteProfessionalNotifs.requestFullPermission()" class="btn-banner-action">تفعيل الآن</button>
                    <button onclick="eliteProfessionalNotifs.remindMeLater()" class="btn-banner-close">لاحقاً</button>
                </div>
            </div>
        `;
        document.body.prepend(banner);

        if (!document.getElementById('banner-styles-v3')) {
            const style = document.createElement('style');
            style.id = 'banner-styles-v3';
            style.textContent = `
                #notif-permission-banner {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 10000;
                    background: rgba(10, 10, 18, 0.98); backdrop-filter: blur(15px);
                    border-bottom: 2px solid var(--primary); padding: 15px 25px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    direction: rtl; font-family: inherit;
                }
                .permission-banner-content {
                    display: flex; align-items: center; gap: 20px; max-width: 1100px; margin: 0 auto;
                }
                .banner-icon { font-size: 2rem; }
                .banner-text { flex: 1; display: flex; flex-direction: column; gap: 4px; }
                .banner-text strong { color: #fff; font-size: 1.1rem; }
                .banner-text span { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
                .banner-actions { display: flex; gap: 12px; }
                .btn-banner-action {
                    background: var(--primary, #6366f1); color: #fff; border: none; padding: 10px 24px;
                    border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.3s;
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
                }
                .btn-banner-action:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
                .btn-banner-close {
                    background: rgba(255,255,255,0.05); color: #ccc; border: 1px solid rgba(255,255,255,0.1);
                    padding: 10px 20px; border-radius: 10px; cursor: pointer; transition: 0.2s;
                }
                .btn-banner-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
                
                @media (max-width: 768px) {
                    .permission-banner-content { flex-direction: column; text-align: center; gap: 15px; }
                    .banner-actions { width: 100%; justify-content: center; }
                    .btn-banner-action, .btn-banner-close { flex: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    remindMeLater() {
        document.getElementById('notif-permission-banner')?.remove();
    }

    async requestFullPermission() {
        const banner = document.getElementById('notif-permission-banner');
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                // IMPORTANT: Mark as delivered immediately on grant
                this.markAsDelivered();
                banner?.remove();
                await this.deliverOfficialNotification();
                if (window.showToast) window.showToast("تم تفعيل الإشعارات بنجاح ✅", "success");
            } else {
                // User dismissed or denied - remove for this session
                banner?.remove();
            }
        } catch (err) {
            banner?.remove();
            console.error("[Elite Notifs] Permission flow error:", err);
        }
    }

    async getAndLogToken() {
        if (window.messaging && window.VAPID_KEY && window.VAPID_KEY !== "YOUR_PUBLIC_VAPID_KEY") {
            try {
                const token = await window.messaging.getToken({ vapidKey: window.VAPID_KEY });
                if (token) console.log("[Elite Notifs] Device Token:", token);
            } catch (err) {
                console.warn("[Elite Notifs] FCM error:", err);
            }
        }
    }
}

const eliteProfessionalNotifs = new ProfessionalNotificationSystem();
document.addEventListener('DOMContentLoaded', () => eliteProfessionalNotifs.init());
window.triggerMaintenanceNotification = () => eliteProfessionalNotifs.deliverOfficialNotification();
