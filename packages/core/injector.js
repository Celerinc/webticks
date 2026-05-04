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
}

/**
 * Track a custom event. No-ops if tracker isn't initialized or in SSR.
 * @param {string} name
 * @param {Record<string, unknown>} [details]
 */
export function track(name, details = {}) {
  if (typeof window === 'undefined' || !window.webticks) return;
  window.webticks.trackEvent(name, details);
}

/**
 * Associate subsequent events with a known user ID.
 * @param {string} userId
 * @param {Record<string, unknown>} [traits]
 */
export function identify(userId, traits = {}) {
  if (typeof window === 'undefined' || !window.webticks) return;
  window.webticks.identify(userId, traits);
}

/**
 * Reset to an anonymous user and start a new session.
 */
export function reset() {
  if (typeof window === 'undefined' || !window.webticks) return;
  window.webticks.reset();
}