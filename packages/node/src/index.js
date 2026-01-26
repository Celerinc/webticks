/**
 * @webticks/node - Node.js server-side tracking
 * 
 * This package provides Node.js-specific functionality for WebTicks analytics.
 * It depends on @webticks/core for the base tracker implementation.
 */

import { AnalyticsTracker } from '@webticks/core/tracker';
import { NodeAdapter } from './adapter.js';

/**
 * Create a tracker instance for server-side tracking
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.serverUrl - URL to send analytics data to
 * @returns {AnalyticsTracker} Tracker instance configured for Node.js
 * 
 * @example
 * import { createServerTracker } from '@webticks/node';
 * 
 * const tracker = createServerTracker({
 *   serverUrl: 'https://api.example.com/track'
 * });
 * 
 * // Use the middleware helper (recommended):
 * app.use(tracker.middleware());
 * 
 * // Routes are auto-tracked unless you use trackEvent()
 * app.post('/api/checkout', (req, res) => {
 *   tracker.trackEvent('checkout_completed', {...}, req);
 *   res.json({ success: true });
 * });
 */
export function createServerTracker(config = {}) {
    // Create the adapter first
    const adapter = new NodeAdapter();

    // Create tracker
    const tracker = new AnalyticsTracker(config);

    // Override the adapter with Node-specific one before initialization runs
    tracker.adapter = adapter;

    // Re-initialize user with the correct adapter
    tracker.initializeUser();

    // Store original trackEvent method
    const originalTrackEvent = tracker.trackEvent.bind(tracker);

    /**
     * Track a custom event
     * 
     * @param {string} eventName - Name of the event
     * @param {Object} eventData - Event data
     * @param {Object} [options] - Options
     * @param {boolean} [options.isAutoTracked=false] - Set to true to skip auto-tracking (you're handling it)
     * @param {Object} [options.req] - Express request object (required when using options)
     * 
     * @example
     * // Track custom event AND let middleware auto-track (both events)
     * tracker.trackEvent('checkout', { total: 100 });
     * 
     * // Track custom event only, skip auto-tracking
     * tracker.trackEvent('checkout', { total: 100 }, { isAutoTracked: true, req });
     */
    tracker.trackEvent = function (eventName, eventData, options = {}) {
        // If isAutoTracked is true, mark request to skip middleware auto-tracking
        if (options.isAutoTracked && options.req) {
            options.req._webticks_tracked = true;
        }
        return originalTrackEvent(eventName, eventData);
    };

    /**
     * Express middleware for automatic request tracking
     * Automatically tracks all requests unless trackEvent() is called with req
     * 
     * @returns {Function} Express middleware function
     * 
     * @example
     * app.use(tracker.middleware());
     */
    tracker.middleware = function () {
        return (req, res, next) => {
            res.on('finish', () => {
                // Only auto-track if trackEvent wasn't called with this req
                if (!req._webticks_tracked) {
                    tracker.trackServerRequest({
                        method: req.method,
                        path: req.url,
                        headers: req.headers
                    });
                }
            });
            next();
        };
    };

    return tracker;
}

export { NodeAdapter } from './adapter.js';
export default createServerTracker;
