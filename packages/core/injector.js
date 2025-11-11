import { AnalyticsTracker } from "./tracker.js";

export default function inject() {
  if (window.webticks) {
    console.warn("webticks tracker already initialized.");
    return;
  }

  const config = {
    backendUrl: "https://api.example.com/track"
  };

  const tracker = new AnalyticsTracker(config);
  tracker.autoTrackPageViews();
  window.webticks = tracker;
};

inject()