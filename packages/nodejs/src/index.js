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
 * @param {string} config.backendUrl - URL to send analytics data to
 * @returns {AnalyticsTracker} Tracker instance configured for Node.js
 * 
 * @example
 * import { createServerTracker } from '@webticks/node';
 * 
 * const tracker = createServerTracker({
 *   backendUrl: 'https://api.example.com/track'
 * });
 * 
 * // In your request handler:
 * app.use((req, res, next) => {
 *   tracker.trackServerRequest({
 *     method: req.method,
 *     path: req.url,
 *     headers: req.headers
 *   });
 *   next();
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

    return tracker;
}

export { NodeAdapter } from './adapter.js';
export default createServerTracker;
