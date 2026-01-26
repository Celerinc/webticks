import { AnalyticsTracker } from "./tracker.js";

/**
 * Injects the WebTicks tracker into the global window object.
 * @param {Object} config - Tracker configuration
 * @param {string} config.serverUrl - URL to send analytics data
 * @param {string} [config.appId] - Application ID for tracking
 */
export default function inject(config = {}) {
  // Only auto-inject in browser environments
  if (typeof window === 'undefined') {
    console.warn("webticks auto-inject skipped: Not in a browser environment.");
    return;
  }

  if (window.webticks) {
    console.warn("webticks tracker already initialized.");
    return;
  }

  const tracker = new AnalyticsTracker(config);
  tracker.autoTrackPageViews();
  window.webticks = tracker;
};

// Only auto-execute in browser
if (typeof window !== 'undefined') {
  inject();
}