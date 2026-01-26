import { getPlatformAdapter, isServer, isBrowser } from './adapters.js';

// Import type definitions
/**
 * @typedef {import('./types.js').Event} Event
 * @typedef {import('./types.js').PageViewEvent} PageViewEvent
 * @typedef {import('./types.js').CustomEvent} CustomEvent
 * @typedef {import('./types.js').ServerRequestEvent} ServerRequestEvent
 * @typedef {import('./types.js').AnalyticsBatch} AnalyticsBatch
 */

export class AnalyticsTracker {
  /**
   * Create a new AnalyticsTracker instance
   * @param {Object} config - Tracker configuration
   * @param {string} config.serverUrl - URL to send analytics data
   * @param {string} [config.appId] - Application ID for tracking (can also be set via WEBTICKS_APP_ID env variable)
   * @param {boolean} [config.debug] - Enable debug logging
   */
  constructor(config = {}) {
    this.config = config;
    this.serverUrl = config.serverUrl || "/api/track";
    this.appId = config.appId || null;
    this.debug = config.debug || false;

    /** @type {Event[]} */
    this.eventQueue = [];
    this.lastPath = "";
    this.batchSendInterval = 10000;
    this.sendTimer = null;
    /** @type {string|null} */
    this.userId = null;
    /** @type {string|null} */
    this.sessionId = null; // Session ID stored in memory
    this.adapter = getPlatformAdapter();

    // Bind methods
    this.checkPageChange = this.checkPageChange.bind(this);
    this.sendQueue = this.sendQueue.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handlePageHide = this.handlePageHide.bind(this);

    this.initializeUser();
    this.initializeSession();

    if (this.debug) {
      console.log(`AnalyticsTracker initialized in ${isServer() ? 'Node.js' : 'Browser'} environment.`);
    }
  }

  initializeUser() {
    // Skip if adapter is not available (will be initialized later in server environments)
    if (!this.adapter) {
      return;
    }

    if (!this.userId) {
      this.userId = this.adapter.getUserId();
    }
  }

  /**
   * Initialize session ID
   * Session is stored in memory and will be destroyed when the page/instance is closed
   */
  initializeSession() {
    // Generate new session ID using crypto (available in both browser and Node.js)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      this.sessionId = crypto.randomUUID();
      if (this.debug) {
        console.log(`Session initialized: ${this.sessionId}`);
      }
    } else {
      // Fallback for older environments
      this.sessionId = this.generateFallbackId();
      if (this.debug) {
        console.warn('crypto.randomUUID not available, using fallback ID generation');
      }
    }
  }

  /**
   * Generate fallback ID if crypto.randomUUID is not available
   * @returns {string} The generated UUID
   */
  generateFallbackId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Automatically track page views (browser) or HTTP requests (server)
   * Works in both environments!
   */
  autoTrackPageViews() {
    if (this.debug) {
      if (isServer()) {
        console.log("Setting up automatic server-side tracking...");
      } else {
        console.log("Setting up automatic page view tracking...");
      }
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
      if (this.debug) {
        console.log(`Page change detected: ${this.lastPath} -> ${currentPath}`);
      }
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
    if (this.debug) {
      console.log("Page hidden, attempting final batch send.");
    }
    this.sendQueue();
  }

  /**
   * Track a page view
   * @param {string} path - The path/URL to track
   * @returns {PageViewEvent} The created event
   */
  trackPageView(path) {
    /** @type {PageViewEvent} */
    const event = {
      requestId: crypto.randomUUID ? crypto.randomUUID() : this.generateFallbackId(),
      type: 'pageview',
      path: path,
      timestamp: new Date().toISOString()
    };

    this.eventQueue.push(event);
    return event;
  }

  /**
   * Track a custom event
   * @param {string} eventName - Name of the event
   * @param {Object} [details={}] - Event details/metadata
   * @returns {CustomEvent} The created event
   */
  trackEvent(eventName, details = {}) {
    /** @type {CustomEvent} */
    const event = {
      requestId: crypto.randomUUID ? crypto.randomUUID() : this.generateFallbackId(),
      type: 'custom',
      name: eventName,
      details: details,
      path: isBrowser() ? window.location.href : null,
      timestamp: new Date().toISOString()
    };

    this.eventQueue.push(event);
    return event;
  }

  /**
   * Track a server-side HTTP request (server-only)
   * @param {Object} requestData - Request information
   * @param {string} requestData.method - HTTP method (GET, POST, etc.)
   * @param {string} requestData.path - Request path
   * @param {Object} [requestData.query] - Query parameters
   * @param {Object} [requestData.headers] - Request headers
   * @returns {ServerRequestEvent} The created event
   */
  trackServerRequest(requestData) {
    /** @type {ServerRequestEvent} */
    const event = {
      requestId: crypto.randomUUID ? crypto.randomUUID() : this.generateFallbackId(),
      type: 'server_request',
      method: requestData.method,
      path: requestData.path,
      query: requestData.query,
      headers: requestData.headers,
      timestamp: new Date().toISOString()
    };

    this.eventQueue.push(event);
    return event;
  }

  /**
   * Send queued events to the backend
   * @returns {Promise<void>}
   */
  async sendQueue() {
    if (this.eventQueue.length === 0) {
      return;
    }

    const eventsToSend = [...this.eventQueue];

    try {
      const response = await this.adapter.sendRequest(this.serverUrl, {
        uid: this.userId,
        sessionId: this.sessionId,
        events: eventsToSend,
        datetime: new Date().toISOString()
      }, this.appId);

      if (response.ok) {
        // Clear queue on success
        this.eventQueue = [];
      } else {
        if (this.debug) {
          console.error(`Failed to send analytics batch: ${response.status}`);
        }
        // Keep events in queue to retry
        this.eventQueue = [...eventsToSend];
      }
    } catch (err) {
      if (this.debug) {
        console.error("Failed to send analytics batch:", err);
      }
      // Keep events in queue to retry
      this.eventQueue = [...eventsToSend];
    }
  }

  /**
   * Cleans up listeners and timers
   */
  destroy() {
    if (this.debug) {
      console.log("Destroying tracker...");
    }

    // Stop the batch sender
    if (this.sendTimer) {
      clearInterval(this.sendTimer);
    }

    // Use adapter to cleanup platform-specific tracking
    this.adapter.cleanupAutoTracking(this);
  }
}