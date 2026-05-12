import { AnalyticsTracker } from "./tracker.js";

/**
 * Initialize WebTicks and attach it to window.webticks.
 * Safe to call in SSR — no-ops outside the browser.
 * @param {Object} [config]
 * @param {string} [config.serverUrl]
 * @param {string} [config.appId]
 * @param {boolean} [config.debug]
 * @param {number} [config.flushInterval] - Batch send interval in ms (default 10000)
 * @param {number} [config.maxQueueSize] - Max events in memory queue (default 500)
 * @param {boolean} [config.autoTrackPageViews=true] - Set false to handle page views yourself (e.g. @webticks/next)
 */
export default function inject(config = {}) {
  if (typeof window === 'undefined') return;
  if (window.webticks) return;

  const tracker = new AnalyticsTracker(config);

  if (config.autoTrackPageViews !== false) {
    tracker.autoTrackPageViews();
  } else {
    tracker.startBatchTimer();
  }

  window.webticks = tracker;

  if (config.debug) {
    console.log('[webticks] initialized', {
      serverUrl: config.serverUrl || '/api/track',
      appId: config.appId,
      debug: true,
    });
  }
}

/**
 * Track a custom event. No-ops if tracker isn't initialized or in SSR.
 * @param {string} name
 * @param {string | Record<string, unknown>} [typeOrDetails] - Event type/category string, or details object if no type needed
 * @param {Record<string, unknown>} [details] - Event details (only when typeOrDetails is a string)
 */
export function track(name, typeOrDetails = '', details = {}) {
  if (typeof typeOrDetails === 'object') {
    details = typeOrDetails;
    typeOrDetails = '';
  }
  if (typeof window === 'undefined') return;
  if (!window.webticks) {
    console.warn('[webticks] track() called before inject(). Event dropped:', name);
    return;
  }
  if (window.webticks.debug) {
    console.log('[webticks] track', name, ...(typeOrDetails ? [typeOrDetails] : []), details);
  }
  window.webticks.trackEvent(name, typeOrDetails, details);
}

/**
 * Associate subsequent events with a known user ID.
 * @param {string} userId
 * @param {Record<string, unknown>} [traits]
 */
export function identify(userId, traits = {}) {
  if (typeof window === 'undefined') return;
  if (!window.webticks) {
    console.warn('[webticks] identify() called before inject(). Skipped.');
    return;
  }
  if (window.webticks.debug) {
    console.log('[webticks] identify', userId, traits);
  }
  window.webticks.identify(userId, traits);
}

/**
 * Reset to an anonymous user and start a new session.
 */
export function reset() {
  if (typeof window === 'undefined') return;
  if (!window.webticks) {
    console.warn('[webticks] reset() called before inject(). Skipped.');
    return;
  }
  if (window.webticks.debug) {
    console.log('[webticks] reset');
  }
  window.webticks.reset();
}
