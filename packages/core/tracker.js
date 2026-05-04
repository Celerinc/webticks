import { getPlatformAdapter, isServer, isBrowser } from './adapters.js';

export class AnalyticsTracker {
  constructor(config = {}) {
    this.config = config;
    this.serverUrl = config.serverUrl || "/api/track";
    this.appId = config.appId || null;
    this.debug = config.debug || false;
    this.eventQueue = [];
    this.lastPath = "";
    this.batchSendInterval = config.flushInterval || 10000;
    this.maxQueueSize = config.maxQueueSize || 500;
    this.sendTimer = null;
    this.userId = null;
    this.sessionId = null;
    this.adapter = config.adapter || getPlatformAdapter();

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
    if (!this.adapter) return;
    if (!this.userId) {
      this.userId = this.adapter.getUserId();
    }
  }

  initializeSession() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      this.sessionId = crypto.randomUUID();
      if (this.debug) console.log(`Session initialized: ${this.sessionId}`);
    } else {
      this.sessionId = this.generateFallbackId();
      if (this.debug) console.warn('crypto.randomUUID not available, using fallback ID generation');
    }
  }

  generateFallbackId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  autoTrackPageViews() {
    if (this.debug) {
      console.log(isServer() ? "Setting up automatic server-side tracking..." : "Setting up automatic page view tracking...");
    }

    this.adapter.setupAutoTracking(this);

    // Drain any events persisted from the previous session
    if (this.adapter && this.adapter.loadPersistedQueue) {
      const persisted = this.adapter.loadPersistedQueue();
      if (persisted.length > 0) {
        this.eventQueue.unshift(...persisted);
        this.adapter.clearPersistedQueue();
        if (this.debug) console.log(`Loaded ${persisted.length} persisted events from previous session`);
      }
    }

    this.sendTimer = setInterval(this.sendQueue, this.batchSendInterval);
  }

  // Start batch timer without history patching (used by @webticks/next)
  startBatchTimer() {
    this.sendTimer = setInterval(this.sendQueue, this.batchSendInterval);
    if (isBrowser()) {
      window.addEventListener('pagehide', this.handlePageHide);
    }
  }

  checkPageChange() {
    if (isServer()) return;
    const currentPath = this.adapter.getCurrentPath();
    if (currentPath !== this.lastPath) {
      if (this.debug) console.log(`Page change detected: ${this.lastPath} -> ${currentPath}`);
      this.lastPath = currentPath;
      this.trackPageView(currentPath);
    }
  }

  handleVisibilityChange() {
    if (isServer()) return;
    this.trackEvent('visibility_change', { visible: !document.hidden });
  }

  handlePageHide() {
    if (this.debug) console.log("Page hidden, attempting final batch send.");
    this.sendQueue();
    // Persist remaining queue so the next session can drain it
    if (this.adapter && this.adapter.persistQueue) {
      this.adapter.persistQueue(this.eventQueue);
    }
  }

  _enforceQueueLimit() {
    if (this.eventQueue.length >= this.maxQueueSize) {
      this.eventQueue.shift();
      if (this.debug) console.warn('WebTicks: queue size limit reached, dropping oldest event');
    }
  }

  trackPageView(path) {
    this._enforceQueueLimit();
    const event = {
      requestId: crypto.randomUUID ? crypto.randomUUID() : this.generateFallbackId(),
      type: 'pageview',
      path,
      timestamp: new Date().toISOString()
    };
    this.eventQueue.push(event);
    return event;
  }

  trackEvent(eventName, details = {}) {
    this._enforceQueueLimit();
    const event = {
      requestId: crypto.randomUUID ? crypto.randomUUID() : this.generateFallbackId(),
      type: 'custom',
      name: eventName,
      details,
      path: isBrowser() ? window.location.pathname : null,
      timestamp: new Date().toISOString()
    };
    this.eventQueue.push(event);
    return event;
  }

  trackServerRequest(requestData) {
    this._enforceQueueLimit();
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

  identify(userId, traits = {}) {
    this.userId = userId;
    if (this.adapter && this.adapter.setUserId) {
      this.adapter.setUserId(userId);
    }
    if (this.debug) console.log(`User identified: ${userId}`, traits);
  }

  reset() {
    if (this.adapter && this.adapter.clearUserId) {
      this.adapter.clearUserId();
    }
    this.userId = this.adapter ? this.adapter.getUserId() : null;
    this.sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : this.generateFallbackId();
    if (this.debug) console.log('Tracker reset: new anonymous session started');
  }

  async sendQueue() {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];

    try {
      const response = await this.adapter.sendRequest(this.serverUrl, {
        uid: this.userId,
        sessionId: this.sessionId,
        events: eventsToSend,
        datetime: new Date().toISOString()
      }, this.appId);

      if (response.ok) {
        this.eventQueue = [];
        if (this.adapter && this.adapter.clearPersistedQueue) {
          this.adapter.clearPersistedQueue();
        }
      } else {
        if (this.debug) console.error(`Failed to send analytics batch: ${response.status}`);
        this.eventQueue = [...eventsToSend];
      }
    } catch (err) {
      if (this.debug) console.error("Failed to send analytics batch:", err);
      this.eventQueue = [...eventsToSend];
    }
  }

  destroy() {
    if (this.debug) console.log("Destroying tracker...");
    if (this.sendTimer) clearInterval(this.sendTimer);
    this.adapter.cleanupAutoTracking(this);
  }
}