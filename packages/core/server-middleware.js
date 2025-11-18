/**
 * Server-side tracking
 * Framework-agnostic - works with Express, Fastify, Koa, Bun, Elysia, NestJS, etc.
 * 
 * Simply create a tracker instance and call trackServerRequest() manually
 * in your framework's request handler. This keeps the code simple and maintainable.
 */

import { AnalyticsTracker } from './tracker.js';

/**
 * Create a tracker instance for server-side tracking
 * Works with ANY JavaScript server framework
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.backendUrl - URL to send analytics data to
 * @returns {AnalyticsTracker} Tracker instance
 * 
 * @example
 * // Create once, reuse everywhere
 * const tracker = createServerTracker({
 *   backendUrl: 'https://api.example.com/track'
 * });
 * 
 * // Then in your request handler (any framework):
 * tracker.trackServerRequest({
 *   method: req.method,
 *   path: req.url,
 *   headers: req.headers
 * });
 */
export function createServerTracker(config = {}) {
    return new AnalyticsTracker(config);
}

export default createServerTracker;
