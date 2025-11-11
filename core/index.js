/**
 * MyAnalytics Tracker
 * * This is the core, framework-agnostic analytics logic.
 * It's exported as a class to be instantiated by a framework-specific "injector".
 */
export class AnalyticsTracker {
  constructor(config) {
    this.config = config || { backendUrl: "/api/track" }; // Default config
    this.eventQueue = [];
    this.lastPath = "";
    this.batchSendInterval = 5000; // Send batch every 5 seconds
    this.sendTimer = null;

    // Bind methods
    this.checkPageChange = this.checkPageChange.bind(this);
    this.sendQueue = this.sendQueue.bind(this);

    console.log("AnalyticsTracker class constructed.");
  }

  /**
   * Starts the automatic page view tracking.
   * This is the "automated" part you requested.
   */
  autoTrackPageViews() {
    console.log("Starting auto-tracking...");
    if (typeof window === 'undefined') {
      console.warn("Auto-tracking disabled: Not in a browser environment.");
      return;
    }

    // Store the original history functions
    this.originalPushState = window.history.pushState;
    this.originalReplaceState = window.history.replaceState;

    // --- Monkey-patching History API ---
    // This is the correct way to detect SPA route changes without an interval.

    // Patch pushState
    window.history.pushState = (...args) => {
      this.originalPushState.apply(window.history, args);
      this.checkPageChange();
    };

    // Patch replaceState
    window.history.replaceState = (...args) => {
      this.originalReplaceState.apply(window.history, args);
      this.checkPageChange();
    };

    // Listen for back/forward button clicks
    window.addEventListener('popstate', this.checkPageChange);

    // Track the initial page load
    this.lastPath = window.location.href;
    this.trackPageView(this.lastPath);

    // Start the batch sending interval
    this.sendTimer = setInterval(this.sendQueue, this.batchSendInterval);
  }

  /**
   * Checks if the window.location.href has changed.
   * If it has, it tracks a new page view.
   */
  checkPageChange() {
    const currentPath = window.location.href;
    if (currentPath !== this.lastPath) {
      console.log(`Page change detected: ${this.lastPath} -> ${currentPath}`);
      this.lastPath = currentPath;
      this.trackPageView(currentPath);
    }
  }

  /**
   * Adds a page view event to the queue.
   * @param {string} path - The URL path to track.
   */
  trackPageView(path) {
    const event = {
      type: 'pageview',
      path: path,
      timestamp: new Date().toISOString()
    };
    
    console.log("Queueing event:", event);
    this.eventQueue.push(event);
  }

  /**
   * Adds a custom event to the queue.
   * @param {string} eventName - The name of the event (e.g., 'button_click').
   * @param {object} details - Any additional data.
   */
  trackEvent(eventName, details = {}) {
    const event = {
      type: 'custom',
      name: eventName,
      details: details,
      path: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    console.log("Queueing event:", event);
    this.eventQueue.push(event);
  }


  /**
   * Sends all queued events to the backend in a single batch.
   */
  sendQueue() {
    if (this.eventQueue.length === 0) {
      return; // No events to send
    }

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = []; // Clear the queue immediately

    console.log(`Sending ${eventsToSend.length} events to ${this.config.backendUrl}...`, eventsToSend);

    // --- Backend Call Stub ---
    // In a real app, you would use fetch() here.
    // We just log it for this example.
    /*
    fetch(this.config.backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventsToSend)
    })
    .then(response => {
      if (!response.ok) {
        console.error("Failed to send analytics batch.");
        // If it fails, you might want to re-queue the events
        // this.eventQueue = [...eventsToSend, ...this.eventQueue];
      } else {
        console.log("Analytics batch sent successfully.");
      }
    })
    .catch(error => {
      console.error("Error sending analytics:", error);
      // Re-queue events on network failure
      // this.eventQueue = [...eventsToSend, ...this.eventQueue];
    });
    */
  }

  /**
   * Cleans up listeners and timers.
   */
  destroy() {
    console.log("Destroying tracker...");
    
    // Stop the batch sender
    if (this.sendTimer) {
      clearInterval(this.sendTimer);
    }

    // Restore original history functions
    if (this.originalPushState) {
      window.history.pushState = this.originalPushState;
    }
    if (this.originalReplaceState) {
      window.history.replaceState = this.originalReplaceState;
    }

    // Remove event listener
    window.removeEventListener('popstate', this.checkPageChange);
  }
}