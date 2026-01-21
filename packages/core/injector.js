import { AnalyticsTracker } from "./tracker.js";

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