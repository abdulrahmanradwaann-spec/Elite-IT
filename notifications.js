/**
 * Elite IT Professional Notifications Manager - Pure System Mode
 * Handles official system notifications outside the app.
 */

const NOTIF_CONFIG = {
    key: "elite_portal_maintenance_2026_v4_premium",
    title: "🔧 تنبيه صيانة النظام",
    body: "نقوم حالياً بعملية صيانة وتحسين أداء النظام لضمان تجربة أفضل.",
    icon: './logo.png',
    badge: './icon.svg',
    image: './images/maintenance-banner.png',
    tag: 'system-maintenance'
};

class ProfessionalNotificationSystem {
    constructor() {
        this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    }

    async init() {
        if (!this.isSupported) return;

        // If already delivered, do nothing (Show Once logic)
        if (this.isAlreadyDelivered()) return;

        // If permission is already granted, deliver once
        if (Notification.permission === 'granted') {
            this.deliverOfficialNotification();
        } else if (Notification.permission !== 'denied') {
            // Request permission naturally (browser prompt) after some user interaction or delay
            // We'll wait for a small delay then ask
            setTimeout(async () => {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    this.deliverOfficialNotification();
                }
            }, 5000);
        }
    }

    isAlreadyDelivered() {
        return localStorage.getItem(NOTIF_CONFIG.key) === 'true';
    }

    markAsDelivered() {
        localStorage.setItem(NOTIF_CONFIG.key, 'true');
    }

    getStudentFirstName() {
        try {
            const session = localStorage.getItem('student_session');
            if (session) {
                const data = JSON.parse(session);
                return data.name ? data.name.split(' ')[0] : "عبيد";
            }
        } catch (e) { }
        return "عبيد";
    }

    async deliverOfficialNotification() {
        if (this.isAlreadyDelivered()) return;

        try {
            this.markAsDelivered();
            const firstName = this.getStudentFirstName();
            const personalizedTitle = `مرحباً ${firstName} | ${NOTIF_CONFIG.title}`;

            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(personalizedTitle, {
                body: NOTIF_CONFIG.body,
                icon: NOTIF_CONFIG.icon,
                badge: NOTIF_CONFIG.badge,
                image: NOTIF_CONFIG.image,
                vibrate: [300, 100, 300, 100, 300],
                tag: NOTIF_CONFIG.tag,
                requireInteraction: true,
                data: {
                    url: window.location.origin + '/dashboard.html',
                    timestamp: Date.now()
                },
                actions: [
                    { action: 'open', title: 'فتح النظام', icon: 'https://img.icons8.com/color/48/external-link.png' },
                    { action: 'close', title: 'تجاهل', icon: 'https://img.icons8.com/color/48/close-window.png' }
                ]
            });
        } catch (err) {
            console.warn("[Elite Notifs] Delivery failed.", err);
        }
    }
}

const eliteProfessionalNotifs = new ProfessionalNotificationSystem();
document.addEventListener('DOMContentLoaded', () => eliteProfessionalNotifs.init());
window.triggerMaintenanceNotification = () => eliteProfessionalNotifs.deliverOfficialNotification();
