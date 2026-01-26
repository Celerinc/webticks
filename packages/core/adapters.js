/**
 * Platform adapters to abstract browser vs Node.js environment differences
 */

// Environment detection
/**
 * Check if running in a browser environment
 * @returns {boolean} True if in browser
 */
export function isBrowser() {
    return typeof window !== 'undefined';
}

/**
 * Check if running in a server environment
 * @returns {boolean} True if in server (Node.js)
 */
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

    /**
     * Generate or retrieve user ID from local storage
     * @returns {string} The persistent user ID
     */
    getUserId() {
        let userId = this.storage.getItem('webticks_uid');
        if (!userId) {
            userId = crypto.randomUUID();
            this.storage.setItem('webticks_uid', userId);
        }
        return userId;
    }

    /**
     * Send HTTP request using fetch API
     * @param {string} url - Destination URL
     * @param {Object} data - Payload data
     * @param {string} [appId] - Application ID header
     * @returns {Promise<Response>} Fetch response
     */
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

    /**
     * Get current page URL
     * @returns {string} Current URL
     */
    getCurrentPath() {
        return window.location.href;
    }

    /**
     * Setup auto-tracking listeners (history API, visibility, etc.)
     * @param {import('./tracker.js').AnalyticsTracker} tracker - Tracker instance
     */
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

    /**
     * Cleanup event listeners and restore history API
     * @param {import('./tracker.js').AnalyticsTracker} tracker - Tracker instance
     */
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
 * @returns {BrowserAdapter|null} Adapter instance or null if on server
 */
export function getPlatformAdapter() {
    if (isBrowser()) {
        return new BrowserAdapter();
    }
    // For server-side, users should use @webticks/node package
    console.warn('Running in server environment. Please use @webticks/node package for server-side tracking.');
    return null;
}
