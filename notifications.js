/**
 * Elite IT Notifications Manager
 * Handles Push Notification permissions, FCM registration, and specific maintenance alerts.
 */

const NOTIFICATION_TITLE = "🔧 تحسينات النظام";
const NOTIFICATION_BODY = "مرحباً عزيزي الطالب، نحن نقوم حالياً بتحسين التطبيق ليكون أفضل وأسرع وأكثر استقراراً من أجلك.";
const NOTIFICATION_ICON = "./logo.png"; // Or a specific maintenance icon if available
const STORAGE_KEY = "maintenance_notification_sent";

class NotificationManager {
    constructor() {
        this.messaging = null;
        this.initialized = false;
    }

    async init() {
        if (!('Notification' in window)) {
            console.warn("Notifications not supported in this browser.");
            return;
        }

        // Initialize logic
        this.checkExistingFlag();
        
        // Register Service Worker if not already done
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                console.log("[Notifications] SW Ready");
                this.initialized = true;
            } catch (err) {
                console.error("[Notifications] SW Registration failed:", err);
            }
        }
    }

    checkExistingFlag() {
        const alreadySent = localStorage.getItem(STORAGE_KEY);
        if (alreadySent === 'true') {
            console.log("[Notifications] Maintenance alert already delivered previously.");
            return true;
        }
        return false;
    }

    async requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log("[Notifications] Permission granted.");
                this.handleFirstTimeLogic();
                return true;
            } else {
                console.warn("[Notifications] Permission denied.");
                return false;
            }
        } catch (err) {
            console.error("[Notifications] Error requesting permission:", err);
            return false;
        }
    }

    async handleFirstTimeLogic() {
        if (this.checkExistingFlag()) return;

        // Display the notification once per user
        try {
            const registration = await navigator.serviceWorker.ready;
            
            // Show system notification
            registration.showNotification(NOTIFICATION_TITLE, {
                body: NOTIFICATION_BODY,
                icon: NOTIFICATION_ICON,
                badge: NOTIFICATION_ICON,
                vibrate: [200, 100, 200],
                data: {
                    url: window.location.origin + '/index.html'
                }
            });

            // Set the flag
            localStorage.setItem(STORAGE_KEY, 'true');
            console.log("[Notifications] One-time maintenance notification sent and flag saved.");
            
            // Trigger a UI success toast if available in app.js
            if (window.showToast) {
                window.showToast("تم تفعيل الإشعارات بنجاح ✅", "success");
            }
        } catch (err) {
            console.error("[Notifications] Error showing initial notification:", err);
        }
    }

    // This can be called from FCM background handler or manually
    static async showSystemNotification(title, body, icon) {
        if (!('serviceWorker' in navigator)) return;
        
        const registration = await navigator.serviceWorker.ready;
        return registration.showNotification(title || NOTIFICATION_TITLE, {
            body: body || NOTIFICATION_BODY,
            icon: icon || NOTIFICATION_ICON,
            badge: icon || NOTIFICATION_ICON
        });
    }
}

// Initialize on load
const eliteNotifications = new NotificationManager();

document.addEventListener('DOMContentLoaded', () => {
    eliteNotifications.init();
    
    // Check if we should ask for permission (e.g., after login or on a specific interaction)
    // For this specific task, we'll try to trigger it if the user interacts with the page
    document.body.addEventListener('click', () => {
        if (Notification.permission === 'default' && !eliteNotifications.checkExistingFlag()) {
            eliteNotifications.requestPermission();
        }
    }, { once: true });
});

// Expose for manual triggering/testing
window.simulatePush = () => {
    localStorage.removeItem(STORAGE_KEY);
    eliteNotifications.requestPermission();
};
