export class AnalyticsTracker {
  constructor(config) {
    this.config = config || { backendUrl: "/api/track" };
    this.eventQueue = [];
    this.lastPath = "";
    this.batchSendInterval = 10000;
    this.sendTimer = null;
    this.userId = null;

    // Bind methods
    this.checkPageChange = this.checkPageChange.bind(this);
    this.sendQueue = this.sendQueue.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handlePageHide = this.handlePageHide.bind(this);
    this.initializeUser = this.initializeUser.bind(this);

    this.initializeUser();

    console.log("AnalyticsTracker class constructed.");
  }

  initializeUser() {
    if (!this.userId) {
      this.userId = crypto.randomUUID();
    }
  }

  autoTrackPageViews() {
    if (typeof window === 'undefined') {
      console.warn("Auto-tracking disabled: Not in a browser environment.");
      return;
    }

    console.log("Using legacy history patching (fallback).");

    this.originalPushState = window.history.pushState;
    this.originalReplaceState = window.history.replaceState;

    window.history.pushState = (...args) => {
      // Call the original function first so the URL changes
      const result = this.originalPushState.apply(window.history, args);

      this.checkPageChange();

      // NEW: Call the custom hook if it exists (as you suggested)
      if (typeof window.history.onpushstate === "function") {
        window.history.onpushstate({ state: args[0] });
      }

      return result;
    };

    window.history.replaceState = (...args) => {
      // Call the original function first so the URL changes
      const result = this.originalReplaceState.apply(window.history, args);

      // Call our internal tracker
      this.checkPageChange();

      if (typeof window.history.onreplacestate === "function") {
        window.history.onreplacestate({ state: args[0] });
      }

      return result;
    };

    window.addEventListener('popstate', this.checkPageChange);


    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    window.addEventListener('pagehide', this.handlePageHide);

    this.lastPath = window.location.href;
    this.trackPageView(this.lastPath);

    this.sendTimer = setInterval(this.sendQueue, this.batchSendInterval);
  }

  checkPageChange() {
    const currentPath = window.location.href;
    if (currentPath !== this.lastPath) {
      console.log(`Page change detected: ${this.lastPath} -> ${currentPath}`);
      this.lastPath = currentPath;
      this.trackPageView(currentPath);
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.trackEvent('visibility_change', { visible: false });
    } else {
      this.trackEvent('visibility_change', { visible: true });
    }
  }

  handlePageHide() {
    console.log("Page hidden, attempting final batch send.");
    this.sendQueue();
  }

  trackPageView(path) {
    const event = {
      type: 'pageview',
      path: path,
      timestamp: new Date().toISOString()
    };

    this.eventQueue.push(event);
  }

  trackEvent(eventName, details = {}) {
    const event = {
      type: 'custom',
      name: eventName,
      details: details,
      path: window.location.href,
      timestamp: new Date().toISOString()
    };

    this.eventQueue.push(event);
  }

  sendQueue() {
    if (this.eventQueue.length === 0) {
      return;
    }

    const eventsToSend = [...this.eventQueue];

    // console.group(`Analytics Batch Send (every ${this.batchSendInterval / 1000}s)`);
    // console.log(`Printing ${eventsToSend.length} events from the queue:`);
    // console.table(eventsToSend);
    // console.log(`(Simulating send to ${this.config.backendUrl})`);
    // console.groupEnd();

    fetch(this.config.backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: this.userId,
        events: eventsToSend,
        datetime: new Date().toISOString()
      })
    }).then(d => {
      this.eventQueue = [];
    }).catch(err => {
      console.error("Failed to send analytics batch:", err);
      this.eventQueue = [...eventsToSend]
    });

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