/**
 * Node.js-specific platform adapter
 * This extends the core tracker with Node.js-specific functionality
 */

import { isServer } from '@webticks/core/platform-adapters';

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

    // Generate or retrieve user ID
    getUserId() {
        if (!this.userId) {
            this.userId = this.crypto?.randomUUID() || Math.random().toString(36).substring(7);
        }
        return this.userId;
    }

    // Send HTTP request
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

    getCurrentPath() {
        return null; // Server doesn't have a "current path"
    }

    setupAutoTracking(tracker) {
        console.log('Server-side tracking: Call tracker.trackServerRequest() in your request handler');
    }

    cleanupAutoTracking(tracker) {
        // Nothing to clean up
    }
}
