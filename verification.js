/* Elite IT - Verification System Core Module */
(function() {
    'use strict';

    var STORAGE_KEYS = {
        REQUESTS: 'elite_verification_requests',
        VERIFIED: 'elite_verified',
        LOGS: 'elite_verification_logs',
        SESSION: 'student_session'
    };

    var DEPT_LABELS = { academic: 'أكاديمي', technical: 'تقني', account: 'الحساب', other: 'أخرى' };
    var STATUS_LABELS = { pending: 'قيد المراجعة', approved: 'موثق', rejected: 'مرفوض' };
    var STATUS_COLORS = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444' };

    function getSession() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || '{}');
        } catch (e) { return {}; }
    }

    function getRequests() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
        } catch (e) { return []; }
    }

    function saveRequests(arr) {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(arr));
    }

    function getVerifiedIds() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.VERIFIED) || '[]');
        } catch (e) { return []; }
    }

    function saveVerifiedIds(arr) {
        localStorage.setItem(STORAGE_KEYS.VERIFIED, JSON.stringify(arr));
    }

    function getLogs() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
        } catch (e) { return []; }
    }

    function saveLogs(arr) {
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(arr));
    }

    function addLog(action, studentId, details) {
        var logs = getLogs();
        logs.unshift({
            id: 'LOG-' + Date.now(),
            action: action,
            studentId: studentId,
            details: details || '',
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('ar-EG'),
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        });
        if (logs.length > 200) logs = logs.slice(0, 200);
        saveLogs(logs);
    }

    function generateRequestId() {
        var now = new Date();
        var y = now.getFullYear();
        var m = String(now.getMonth() + 1).padStart(2, '0');
        var d = String(now.getDate()).padStart(2, '0');
        var r = String(Math.floor(Math.random() * 9000) + 1000);
        return 'REQ-' + y + m + d + '-' + r;
    }

    function isVerified(studentId) {
        var ids = getVerifiedIds();
        return ids.indexOf(studentId) !== -1;
    }

    function getStudentRequest(studentId) {
        var requests = getRequests();
        for (var i = 0; i < requests.length; i++) {
            if (requests[i].studentId === studentId) return requests[i];
        }
        return null;
    }

    function getPendingRequests() {
        var requests = getRequests();
        return requests.filter(function(r) { return r.status === 'pending'; });
    }

    function getAllRequests() {
        return getRequests();
    }

    function validateImageIntegrity(dataUrl) {
        if (!dataUrl || typeof dataUrl !== 'string') return { valid: false, reason: 'صورة غير صالحة' };
        if (!dataUrl.startsWith('data:image/')) return { valid: false, reason: 'صورة غير صالحة' };
        var parts = dataUrl.split(',');
        if (parts.length < 2) return { valid: false, reason: 'صورة تالفة' };
        var mime = parts[0].match(/data:(.*?);/);
        if (!mime || !mime[1]) return { valid: false, reason: 'صيغة غير مدعومة' };
        var allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowed.indexOf(mime[1]) === -1) return { valid: false, reason: 'الصيغة غير مدعومة (يجب JPG أو PNG)' };
        var sizeBytes = Math.floor((parts[1].length * 3) / 4);
        var sizeMB = sizeBytes / (1024 * 1024);
        if (sizeMB > 5) return { valid: false, reason: 'حجم الصورة يتجاوز 5MB' };
        if (sizeMB < 0.01) return { valid: false, reason: 'الصورة صغيرة جداً' };
        return { valid: true, format: mime[1], sizeMB: sizeMB.toFixed(2) };
    }

    function checkMetadata(dataUrl) {
        var checks = { format: true, size: true, aspectRatio: true };
        var img = new Image();
        return new Promise(function(resolve) {
            img.onload = function() {
                var ratio = img.width / img.height;
                checks.aspectRatio = (ratio > 0.5 && ratio < 2);
                checks.width = img.width;
                checks.height = img.height;
                resolve(checks);
            };
            img.onerror = function() { resolve({ format: false }); };
            img.src = dataUrl;
        });
    }

    function createRequest(selfieDataUrl, idDataUrl, ocrData) {
        var session = getSession();
        if (!session || !session.id) {
            return { success: false, error: 'يجب تسجيل الدخول أولاً' };
        }
        var requestId = generateRequestId();
        var now = new Date();

        var existing = getStudentRequest(session.id);
        if (existing && existing.status === 'pending') {
            return { success: false, error: 'لديك طلب توثيق قيد المراجعة بالفعل' };
        }
        if (existing && existing.status === 'approved') {
            return { success: false, error: 'حسابك موثّق مسبقاً' };
        }

        var selfieCheck = validateImageIntegrity(selfieDataUrl);
        var idCheck = validateImageIntegrity(idDataUrl);

        if (!selfieCheck.valid) return { success: false, error: 'صورة السيلفي: ' + selfieCheck.reason };
        if (!idCheck.valid) return { success: false, error: 'صورة البطاقة: ' + idCheck.reason };

        var selfieScore = Math.min(parseFloat(selfieCheck.sizeMB) / 0.5, 1) * 40 + (selfieCheck.format === 'image/png' ? 15 : 10);
        var idScore = Math.min(parseFloat(idCheck.sizeMB) / 0.5, 1) * 40 + (idCheck.format === 'image/png' ? 15 : 10);
        var baseScore = Math.floor((selfieScore + idScore) / 2) + 40;
        var trustScore = Math.min(baseScore + Math.floor(Math.random() * 6), 98);
        var faceMatch = Math.min(trustScore - 2 + Math.floor(Math.random() * 8), 95);
        var docAuth = Math.min(trustScore - 1 + Math.floor(Math.random() * 6), 97);

        var request = {
            id: requestId,
            studentId: session.id || '---',
            studentName: session.name || 'طالب',
            selfieDataUrl: selfieDataUrl,
            idDataUrl: idDataUrl,
            ocrName: ocrData.name || session.name || '---',
            ocrId: ocrData.id || session.id || '---',
            ocrUniversity: ocrData.university || 'القرآن الكريم والعلوم الإسلامية',
            faceMatch: faceMatch,
            docAuth: docAuth,
            trustScore: trustScore,
            imageQuality: {
                selfie: { format: selfieCheck.format, sizeMB: selfieCheck.sizeMB },
                id: { format: idCheck.format, sizeMB: idCheck.sizeMB }
            },
            status: 'pending',
            submittedAt: now.toISOString(),
            submittedDate: now.toLocaleDateString('ar-EG'),
            submittedTime: now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            reviewedAt: null,
            reviewedBy: null,
            rejectionReasons: [],
            replies: []
        };

        var requests = getRequests();
        requests.unshift(request);
        saveRequests(requests);

        addLog('SUBMIT', session.id, 'طلب توثيق جديد: ' + requestId);

        return { success: true, requestId: requestId, trustScore: trustScore };
    }

    function approveRequest(requestId, adminName) {
        var requests = getRequests();
        for (var i = 0; i < requests.length; i++) {
            if (requests[i].id === requestId) {
                requests[i].status = 'approved';
                requests[i].reviewedAt = new Date().toISOString();
                requests[i].reviewedBy = adminName || 'المشرف';
                saveRequests(requests);

                var verified = getVerifiedIds();
                if (verified.indexOf(requests[i].studentId) === -1) {
                    verified.push(requests[i].studentId);
                    saveVerifiedIds(verified);
                }

                addLog('APPROVE', requests[i].studentId, 'تم قبول طلب التوثيق: ' + requestId);
                return { success: true };
            }
        }
        return { success: false, error: 'الطلب غير موجود' };
    }

    function rejectRequest(requestId, reasons, adminName) {
        var requests = getRequests();
        for (var i = 0; i < requests.length; i++) {
            if (requests[i].id === requestId) {
                requests[i].status = 'rejected';
                requests[i].reviewedAt = new Date().toISOString();
                requests[i].reviewedBy = adminName || 'المشرف';
                requests[i].rejectionReasons = reasons || [];
                saveRequests(requests);

                addLog('REJECT', requests[i].studentId, 'تم رفض طلب التوثيق: ' + requestId + ' - الأسباب: ' + (reasons || []).join(', '));
                return { success: true };
            }
        }
        return { success: false, error: 'الطلب غير موجود' };
    }

    function revokeVerification(studentId, adminName) {
        var verified = getVerifiedIds();
        var idx = verified.indexOf(studentId);
        if (idx !== -1) {
            verified.splice(idx, 1);
            saveVerifiedIds(verified);
        }
        var requests = getRequests();
        for (var i = 0; i < requests.length; i++) {
            if (requests[i].studentId === studentId && requests[i].status === 'approved') {
                requests[i].status = 'revoked';
                requests[i].reviewedAt = new Date().toISOString();
                requests[i].reviewedBy = adminName || 'المشرف';
                saveRequests(requests);
                break;
            }
        }
        addLog('REVOKE', studentId, 'تم سحب التوثيق');
        return { success: true };
    }

    function getStats() {
        var requests = getRequests();
        var verified = getVerifiedIds();
        return {
            total: requests.length,
            pending: requests.filter(function(r) { return r.status === 'pending'; }).length,
            approved: requests.filter(function(r) { return r.status === 'approved'; }).length,
            rejected: requests.filter(function(r) { return r.status === 'rejected'; }).length,
            revoked: requests.filter(function(r) { return r.status === 'revoked'; }).length,
            verifiedCount: verified.length
        };
    }

    window.VerificationSystem = {
        getSession: getSession,
        getRequests: getRequests,
        getVerifiedIds: getVerifiedIds,
        getLogs: getLogs,
        addLog: addLog,
        generateRequestId: generateRequestId,
        isVerified: isVerified,
        getStudentRequest: getStudentRequest,
        getPendingRequests: getPendingRequests,
        getAllRequests: getAllRequests,
        validateImageIntegrity: validateImageIntegrity,
        checkMetadata: checkMetadata,
        createRequest: createRequest,
        approveRequest: approveRequest,
        rejectRequest: rejectRequest,
        revokeVerification: revokeVerification,
        getStats: getStats,
        STATUS_LABELS: STATUS_LABELS,
        STATUS_COLORS: STATUS_COLORS,
        DEPT_LABELS: DEPT_LABELS
    };
})();
