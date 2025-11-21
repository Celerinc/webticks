/**
 * Node.js-specific platform adapter
 * This extends the core tracker with Node.js-specific functionality
 */

import { isServer } from '@webticks/core/platform-adapters';

export class NodeAdapter {
    constructor() {
        this.userId = null;
        this.crypto = null;

        // Synchronously import crypto for Node.js
        if (isServer()) {
            try {
                // Use dynamic import with await, but we'll handle it synchronously
                import('crypto').then(mod => {
                    this.crypto = mod;
                });
                // For immediate use, we can use require if available
                if (typeof require !== 'undefined') {
                    this.crypto = require('crypto');
                }
            } catch (err) {
                console.warn('Failed to load crypto module:', err);
            }
        }
    }

    // Generate or retrieve user ID
    getUserId() {
        if (!this.userId) {
            // Use crypto.randomUUID if available, otherwise fallback
            if (this.crypto && this.crypto.randomUUID) {
                this.userId = this.crypto.randomUUID();
            } else {
                // Fallback for older Node versions or if crypto isn't loaded
                this.userId = `user-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            }
        }
        return this.userId;
    }

    // Send HTTP request
    async sendRequest(url, data) {
        // Use native fetch (Node.js 18+)
        if (typeof fetch !== 'undefined') {
            return fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        // If fetch is not available, log error
        console.error('fetch is not available. Please use Node.js 18 or higher.');
        return Promise.resolve({ ok: false, status: 0 });
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
