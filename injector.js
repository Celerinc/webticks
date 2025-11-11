/**
 * Vanilla JS Injector
 * * This file is loaded as a module in a standard HTML page.
 * It imports the core tracker, instantiates it, and *injects* it
 * into the window object, as you requested.
 */
import { AnalyticsTracker } from "index";

export default function inject() {
  // 1. Check if tracker is already running
  if (window.MyAnalytics) {
    console.warn("MyAnalytics tracker already initialized.");
    return;
  }

  // 2. Define configuration (can be hardcoded or loaded)
  const config = {
    backendUrl: "https://api.example.com/track"
  };

  // 3. Instantiate and initialize
  const tracker = new AnalyticsTracker(config);
  tracker.autoTrackPageViews(); // Start tracking

  // 4. Inject the tracker instance into the window object
  // This makes it globally accessible.
  window.MyAnalytics = tracker;

  console.log("MyAnalytics tracker injected and initialized (Vanilla).");
  console.log("You can now use 'window.MyAnalytics.trackEvent(\"my_event\")' anywhere.");

};