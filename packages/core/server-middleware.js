/**
 * Server-side middleware for automatic HTTP request tracking
 * Works with Express, Connect, and similar Node.js frameworks
 */

import { AnalyticsTracker } from './tracker.js';

/**
 * Create Express/Connect-style middleware for tracking HTTP requests
 * @param {Object} config - Configuration options
 * @param {string} config.backendUrl - URL to send analytics data to
 * @param {Function} config.shouldTrack - Optional function to filter which requests to track
 * @returns {Function} Express middleware function
 */
export function createServerMiddleware(config = {}) {
    const tracker = new AnalyticsTracker(config);

    const shouldTrack = config.shouldTrack || ((req) => {
        // By default, don't track static assets and common dev files
        const path = req.path || req.url;
        return !path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i) &&
            !path.startsWith('/_next/') &&
            !path.startsWith('/api/_');
    });

    return function webticksMiddleware(req, res, next) {
        // Skip if shouldn't track
        if (!shouldTrack(req)) {
            return next();
        }

        const startTime = Date.now();

        // Track the request as a "page view"
        const requestData = {
            method: req.method,
            path: req.path || req.url,
            query: req.query,
            headers: {
                'user-agent': req.headers['user-agent'],
                'referer': req.headers['referer']
            }
        };

        tracker.trackServerRequest(requestData);

        // Intercept response to track completion
        const originalEnd = res.end;
        res.end = function (...args) {
            const duration = Date.now() - startTime;

            // Track response details
            tracker.trackEvent('request_complete', {
                path: req.path || req.url,
                method: req.method,
                statusCode: res.statusCode,
                duration
            });

            // Call original end
            originalEnd.apply(res, args);
        };

        next();
    };
}

/**
 * Create a standalone tracker instance for manual tracking
 * Useful for API routes, serverless functions, etc.
 * @param {Object} config - Configuration options
 * @returns {AnalyticsTracker} Tracker instance
 */
export function createServerTracker(config = {}) {
    return new AnalyticsTracker(config);
}

export default createServerMiddleware;
