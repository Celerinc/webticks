import { AnalyticsTracker } from "./tracker.js";

export default function inject() {
  if (window.MyAnalytics) {
    console.warn("MyAnalytics tracker already initialized.");
    return;
  }

  const config = {
    backendUrl: "https://api.example.com/track"
  };

  const tracker = new AnalyticsTracker(config);
  tracker.autoTrackPageViews();
  window.MyAnalytics = tracker;

  console.log("MyAnalytics tracker injected and initialized (Vanilla).");
  console.log("You can now use 'window.MyAnalytics.trackEvent(\"my_event\")' anywhere.");
};

inject()