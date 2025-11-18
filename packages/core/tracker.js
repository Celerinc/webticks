import { getPlatformAdapter, isServer, isBrowser } from './platform-adapters.js';

export class AnalyticsTracker {
  constructor(config) {
    this.config = config || { backendUrl: "/api/track" };
    this.eventQueue = [];
    this.lastPath = "";
    this.batchSendInterval = 10000;
    this.sendTimer = null;
    this.userId = null;
    this.adapter = getPlatformAdapter();

    // Bind methods
    this.checkPageChange = this.checkPageChange.bind(this);
    this.sendQueue = this.sendQueue.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handlePageHide = this.handlePageHide.bind(this);

    this.initializeUser();

    console.log(`AnalyticsTracker initialized in ${isServer() ? 'Node.js' : 'Browser'} environment.`);
  }

  initializeUser() {
    if (!this.userId) {
      this.userId = this.adapter.getUserId();
    }
  }

  /**
   * Automatically track page views (browser) or HTTP requests (server)
   * Works in both environments!
   */
  autoTrackPageViews() {
    if (isServer()) {
      console.log("Setting up automatic server-side tracking...");
    } else {
      console.log("Setting up automatic page view tracking...");
    }

    // Use adapter to setup platform-specific tracking
    this.adapter.setupAutoTracking(this);

    // Start the batch send timer
    this.sendTimer = setInterval(this.sendQueue, this.batchSendInterval);
  }

  /**
   * Check for page changes (browser-only)
   */
  checkPageChange() {
    if (isServer()) return;

    const currentPath = this.adapter.getCurrentPath();
    if (currentPath !== this.lastPath) {
      console.log(`Page change detected: ${this.lastPath} -> ${currentPath}`);
      this.lastPath = currentPath;
      this.trackPageView(currentPath);
    }
  }

  /**
   * Handle visibility changes (browser-only)
   */
  handleVisibilityChange() {
    if (isServer()) return;

    if (document.hidden) {
      this.trackEvent('visibility_change', { visible: false });
    } else {
      this.trackEvent('visibility_change', { visible: true });
    }
  }

  /**
   * Handle page hide event (browser-only)
   */
  handlePageHide() {
    console.log("Page hidden, attempting final batch send.");
    this.sendQueue();
  }

  /**
   * Track a page view
   * @param {string} path - The path/URL to track
   */
  trackPageView(path) {
    const event = {
      type: 'pageview',
      path: path,
      timestamp: new Date().toISOString()
    };

    this.eventQueue.push(event);
  }

  /**
   * Track a custom event
   * @param {string} eventName - Name of the event
   * @param {Object} details - Event details/metadata
   */
  trackEvent(eventName, details = {}) {
    const event = {
      type: 'custom',
      name: eventName,
      details: details,
      path: isBrowser() ? window.location.href : null,
      timestamp: new Date().toISOString()
    };

    this.eventQueue.push(event);
  }

  /**
   * Track a server-side HTTP request (server-only)
   * @param {Object} requestData - Request information (method, path, headers, etc.)
   */
  trackServerRequest(requestData) {
    const event = {
      type: 'server_request',
      method: requestData.method,
      path: requestData.path,
      query: requestData.query,
      headers: requestData.headers,
      timestamp: new Date().toISOString()
    };

    this.eventQueue.push(event);
  }

  /**
   * Send queued events to the backend
   */
  async sendQueue() {
    if (this.eventQueue.length === 0) {
      return;
    }

    const eventsToSend = [...this.eventQueue];

    try {
      const response = await this.adapter.sendRequest(this.config.backendUrl, {
        uid: this.userId,
        events: eventsToSend,
        datetime: new Date().toISOString()
      });

      if (response.ok) {
        // Clear queue on success
        this.eventQueue = [];
      } else {
        console.error(`Failed to send analytics batch: ${response.status}`);
        // Keep events in queue to retry
        this.eventQueue = [...eventsToSend];
      }
    } catch (err) {
      console.error("Failed to send analytics batch:", err);
      // Keep events in queue to retry
      this.eventQueue = [...eventsToSend];
    }
  }

  /**
   * Cleans up listeners and timers
   */
  destroy() {
    console.log("Destroying tracker...");

    // Stop the batch sender
    if (this.sendTimer) {
      clearInterval(this.sendTimer);
    }

    // Use adapter to cleanup platform-specific tracking
    this.adapter.cleanupAutoTracking(this);
  }
}