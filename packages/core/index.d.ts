/**
 * Extend this interface via declaration merging to add your own event types
 * and get autocomplete across your project.
 *
 * @example
 * // webticks.d.ts
 * declare module '@webticks/core' {
 *   interface WebticksEventTypeMap {
 *     auth: true;
 *     commerce: true;
 *     navigation: true;
 *   }
 * }
 */
export interface WebticksEventTypeMap {}

/**
 * Event type/category for grouping events.
 * Predefined values show in autocomplete; any string is still accepted.
 */
export type WebticksEventType =
  | keyof WebticksEventTypeMap
  | (string & {});

export interface WebticksOptions {
  serverUrl?: string;
  appId?: string;
  debug?: boolean;
  /** Batch flush interval in milliseconds. Default: 10000 */
  flushInterval?: number;
  /** Maximum events held in memory before oldest are dropped. Default: 500 */
  maxQueueSize?: number;
  /**
   * Set to false to disable History API patching and the initial page view.
   * Use this when the framework wrapper handles page view tracking itself (e.g. @webticks/next).
   * Default: true
   */
  autoTrackPageViews?: boolean;
}

export interface WebticksTracker {
  trackEvent<TDetails extends Record<string, unknown> = Record<string, unknown>>(
    name: string,
    type: WebticksEventType,
    details?: TDetails
  ): void;
  trackPageView(path: string): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  reset(): void;
  sendQueue(): Promise<void>;
  destroy(): void;
}

declare global {
  interface Window {
    webticks?: WebticksTracker;
  }
}

/**
 * Initialize WebTicks and attach it to window.webticks.
 * Safe to call in SSR — no-ops outside the browser.
 */
declare function inject(config?: WebticksOptions): void;

/**
 * Track a custom event. No-ops if tracker isn't initialized or in SSR.
 *
 * Pass a generic to enforce the shape of your details payload:
 * @example
 * track<{ role: string }>('login_success', { role: 'admin' });
 * track<{ role: string }>('login_success', 'auth', { role: 'admin' });
 */
export declare function track<TDetails extends Record<string, unknown> = Record<string, unknown>>(
  name: string,
  details?: TDetails
): void;
export declare function track<TDetails extends Record<string, unknown> = Record<string, unknown>>(
  name: string,
  type: WebticksEventType,
  details?: TDetails
): void;

/**
 * Associate subsequent events with a known user ID.
 */
export declare function identify(userId: string, traits?: Record<string, unknown>): void;

/**
 * Reset to an anonymous user and start a new session.
 */
export declare function reset(): void;

export default inject;
