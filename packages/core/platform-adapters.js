/**
 * Platform adapters to abstract browser vs Node.js environment differences
 */

// Environment detection
export function isServer() {
    return typeof window === 'undefined';
}

export function isBrowser() {
    return typeof window !== 'undefined';
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
    async sendRequest(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
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
 * Node.js-specific adapter
 */
export class NodeAdapter {
    constructor() {
        this.userId = null;
        this.crypto = null;
        this.http = null;
        this.https = null;

        // Lazy load Node.js modules
        this._initModules();
    }

    async _initModules() {
        if (isServer()) {
            try {
                this.crypto = await import('crypto');
                this.http = await import('http');
                this.https = await import('https');
            } catch (err) {
                console.warn('Failed to load Node.js modules:', err);
            }
        }
    }

    // Generate or retrieve user ID (server-side uses in-memory or persistent storage)
    getUserId() {
        if (!this.userId) {
            // Use Node.js crypto to generate UUID
            this.userId = this.crypto?.randomUUID() || Math.random().toString(36).substring(7);
        }
        return this.userId;
    }

    // Send HTTP request (Node.js native or fetch if available)
    async sendRequest(url, data) {
        // Try to use native fetch if available (Node.js 18+)
        if (typeof fetch !== 'undefined') {
            return fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        // Fallback to http/https modules
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const protocol = urlObj.protocol === 'https:' ? this.https : this.http;

            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname + urlObj.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(data))
                }
            };

            const req = protocol.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    resolve({
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        status: res.statusCode,
                        json: async () => JSON.parse(body)
                    });
                });
            });

            req.on('error', reject);
            req.write(JSON.stringify(data));
            req.end();
        });
    }

    // Get current path (not applicable in server context)
    getCurrentPath() {
        return null; // Server doesn't have a "current path"
    }

    // Setup auto-tracking (server-side)
    // Note: Due to ES module restrictions, we can't automatically patch HTTP modules
    // Users should call tracker.trackServerRequest() in their request handler
    setupAutoTracking(tracker) {
        console.log('Server-side auto-tracking: Call tracker.trackServerRequest() in your request handler');
        console.log('Example: app.use((req, res, next) => { tracker.trackServerRequest({method: req.method, path: req.url}); next(); })');

        // Start batch sending
        // (Already started in autoTrackPageViews, but keeping for consistency)
    }

    // Cleanup auto-tracking
    cleanupAutoTracking(tracker) {
        // Nothing to clean up on server
    }
}

/**
 * Factory function to get the appropriate adapter
 */
export function getPlatformAdapter() {
    if (isBrowser()) {
        return new BrowserAdapter();
    } else if (isServer()) {
        return new NodeAdapter();
    }
    throw new Error('Unknown platform');
}
