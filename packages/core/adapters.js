/**
 * Platform adapters to abstract browser vs Node.js environment differences
 */

// Environment detection
export function isBrowser() {
    return typeof window !== 'undefined';
}

export function isServer() {
    return typeof window === 'undefined';
}

/**
 * Browser-specific adapter
 */
export class BrowserAdapter {
    constructor() {
        this.storage = window.localStorage;
    }

    // Generate or retrieve user ID
    getUserId() {
        let userId = this.storage.getItem('webticks_uid');
        if (!userId) {
            userId = crypto.randomUUID();
            this.storage.setItem('webticks_uid', userId);
        }
        return userId;
    }

    // Send HTTP request
    async sendRequest(url, data, appId) {
        const headers = { 'Content-Type': 'application/json' };

        // Add webticks-app-id header if appId is provided
        if (appId) {
            headers['webticks-app-id'] = appId;
        }

        return fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        }).catch((err) => console.warn('Error sending request:', err));
    }

    // Get current path
    getCurrentPath() {
        return window.location.href;
    }

    // Setup auto-tracking (browser-specific)
    setupAutoTracking(tracker) {
        // Patch history API
        tracker.originalPushState = window.history.pushState;
        tracker.originalReplaceState = window.history.replaceState;

        window.history.pushState = (...args) => {
            const result = tracker.originalPushState.apply(window.history, args);
            tracker.checkPageChange();
            if (typeof window.history.onpushstate === "function") {
                window.history.onpushstate({ state: args[0] });
            }
            return result;
        };

        window.history.replaceState = (...args) => {
            const result = tracker.originalReplaceState.apply(window.history, args);
            tracker.checkPageChange();
            if (typeof window.history.onreplacestate === "function") {
                window.history.onreplacestate({ state: args[0] });
            }
            return result;
        };

        window.addEventListener('popstate', tracker.checkPageChange);
        document.addEventListener('visibilitychange', tracker.handleVisibilityChange);
        window.addEventListener('pagehide', tracker.handlePageHide);

        // Track initial page view
        tracker.lastPath = window.location.href;
        tracker.trackPageView(tracker.lastPath);
    }

    // Cleanup auto-tracking
    cleanupAutoTracking(tracker) {
        if (tracker.originalPushState) {
            window.history.pushState = tracker.originalPushState;
        }
        if (tracker.originalReplaceState) {
            window.history.replaceState = tracker.originalReplaceState;
        }
        window.removeEventListener('popstate', tracker.checkPageChange);
        document.removeEventListener('visibilitychange', tracker.handleVisibilityChange);
        window.removeEventListener('pagehide', tracker.handlePageHide);
    }
}

/**
 * Factory function to get the appropriate adapter
 * Core package only provides browser adapter
 * For Node.js, use @webticks/node package
 */
export function getPlatformAdapter() {
    if (isBrowser()) {
        return new BrowserAdapter();
    }
    // For server-side, users should use @webticks/node package
    console.warn('Running in server environment. Please use @webticks/node package for server-side tracking.');
    return null;
}
