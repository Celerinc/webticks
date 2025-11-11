/**
 * MyAnalytics Tracker
 * (Updated with Navigation API and extensible history patching)
 * * This is the core, framework-agnostic analytics logic.
 * It's exported as a class to be instantiated by a framework-specific "injector".
 */
export class AnalyticsTracker {
  constructor(config) {
    this.config = config || { backendUrl: "/api/track" }; // Default config
    this.eventQueue = [];
    this.lastPath = "";
    this.batchSendInterval = 3000; // Send batch every 3 seconds (as requested)
    this.sendTimer = null;

    // Bind methods
    this.checkPageChange = this.checkPageChange.bind(this);
    this.sendQueue = this.sendQueue.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handlePageHide = this.handlePageHide.bind(this);

    console.log("AnalyticsTracker class constructed.");
  }

  /**
   * Starts the automatic page view tracking.
   * This is the "automated" part you requested.
   *
   * It now uses the modern Navigation API if available,
   * otherwise it falls back to patching the History API.
   */
  autoTrackPageViews() {
    console.log("Starting auto-tracking...");
    if (typeof window === 'undefined') {
      console.warn("Auto-tracking disabled: Not in a browser environment.");
      return;
    }

    // --- Progressive Enhancement for Navigation ---

    if (window.navigation) {
      // 1. MODERN APPROACH (Chrome, Edge, Opera)
      // Use the new Navigation API.
      // 'navigatesuccess' fires *after* the navigation, just when we need it.
      console.log("Using modern Navigation API.");
      window.navigation.addEventListener('navigatesuccess', this.checkPageChange);

    } else {
      // 2. LEGACY FALLBACK (Firefox, Safari)
      // Use the "monkey-patching" method.
      console.log("Using legacy history patching (fallback).");

      // Store the original history functions
      this.originalPushState = window.history.pushState;
      this.originalReplaceState = window.history.replaceState;

      // 1. Patch pushState (for app navigation) - Revamped with your logic
      window.history.pushState = (...args) => {
        // Call the original function first so the URL changes
        const result = this.originalPushState.apply(window.history, args);

        // Call our internal tracker
        this.checkPageChange();
        console.log('URL changed via pushState:', location.href);

        // NEW: Call the custom hook if it exists (as you suggested)
        if (typeof window.history.onpushstate === "function") {
          window.history.onpushstate({ state: args[0] });
        }
        
        return result;
      };

      // 2. Patch replaceState (for app navigation) - Revamped with your logic
      window.history.replaceState = (...args) => {
        // Call the original function first so the URL changes
        const result = this.originalReplaceState.apply(window.history, args);

        // Call our internal tracker
        this.checkPageChange();
        console.log('URL changed via replaceState:', location.href);

        // NEW: Call the custom hook if it exists
        if (typeof window.history.onreplacestate === "function") {
          window.history.onreplacestate({ state: args[0] });
        }
        
        return result;
      };

      // 3. Listen for popstate (for back/forward button clicks)
      window.addEventListener('popstate', this.checkPageChange);
    }

    // --- Add other automated event listeners (run for both) ---

    // 4. Listen for visibility changes (tabbing away)
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // 5. Listen for page hide (closing tab/browser) to send queue
    window.addEventListener('pagehide', this.handlePageHide);


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
   * Handles visibility change events (e.g., user tabs away).
   */
  handleVisibilityChange() {
    if (document.hidden) {
      this.trackEvent('visibility_change', { visible: false });
    } else {
      this.trackEvent('visibility_change', { visible: true });
    }
  }

  /**
   * Handles page hide events (e.g., user closes tab).
   * This is a last chance to send any pending events.
   */
  handlePageHide() {
    // Note: 'pagehide' often doesn't allow async network requests.
    // In a real app, you'd use navigator.sendBeacon() here.
    // For this demo, we'll just log that it *would* send.
    console.log("Page hidden, attempting final batch send.");
    this.sendQueue();
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

    // Printing all queued events to the console (as requested)
    console.group(`Analytics Batch Send (every ${this.batchSendInterval / 1000}s)`);
    console.log(`Printing ${eventsToSend.length} events from the queue:`);
    console.table(eventsToSend);
    console.log(`(Simulating send to ${this.config.backendUrl})`);
    console.groupEnd();

    // --- Backend Call Stub ---
    // In a real app, you would use fetch() here.
    /*
    fetch(this.config.backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventsToSend)
    })
    // ... (fetch logic) ...
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

    // --- Conditional cleanup based on which method was used ---
    if (window.navigation) {
      // 1. Cleanup modern listener
      window.navigation.removeEventListener('navigatesuccess', this.checkPageChange);
    } else {
      // 2. Cleanup legacy listeners and restore functions
      if (this.originalPushState) {
        window.history.pushState = this.originalPushState;
      }
      if (this.originalReplaceState) {
        window.history.replaceState = this.originalReplaceState;
      }
      window.removeEventListener('popstate', this.checkPageChange);
    }

    // Remove other listeners
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('pagehide', this.handlePageHide);
  }
}