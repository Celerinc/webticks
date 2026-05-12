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

/** A single tracked event inside a batch. */
export interface WebticksEvent {
  requestId: string;
  type: 'pageview' | 'custom' | 'server_request';
  name?: string;
  customType?: string;
  path?: string | null;
  timestamp: string;
  details?: Record<string, unknown>;
  method?: string;
}

/** The batch payload passed to every destination's send() method. */
export interface WebTicksBatch {
  uid: string | null;
  sessionId: string;
  datetime: string;
  events: WebticksEvent[];
}

/**
 * Implement this interface to send webticks batches to any analytics backend.
 *
 * Pass a **single destination** to route all events exclusively to it:
 * ```tsx
 * <WebticksAnalytics destinations={new AppInsightsDestination({ connectionString: '...' })} />
 * ```
 *
 * Pass an **array** to fan-out to multiple destinations in parallel:
 * ```tsx
 * <WebticksAnalytics destinations={[appInsightsDest, webticksApiDest]} />
 * ```
 *
 * Each destination receives the same batch. One destination failing never blocks the others.
 */
export interface WebticksDestination {
  /** Human-readable name shown in debug logs and error messages. */
  name: string;
  /** Called with every flushed batch. Throw to signal failure (logged as a warning). */
  send(batch: WebTicksBatch): Promise<void>;
}

/**
 * Built-in destination that POSTs batches to your webticks-api endpoint.
 * Used automatically when you pass serverUrl/appId props.
 */
export declare class WebticksApiDestination implements WebticksDestination {
  name: 'webticks-api';
  constructor(options?: { serverUrl?: string; appId?: string });
  send(batch: WebTicksBatch): Promise<void>;
}

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
  /**
   * Where to send events.
   *
   * - **Single destination**: all events go exclusively to that one destination.
   *   ```ts
   *   inject({ destinations: new AppInsightsDestination({ connectionString: '...' }) })
   *   ```
   * - **Array of destinations**: events are fanned out to all in parallel.
   *   One failing never blocks the others.
   *   ```ts
   *   inject({ destinations: [appInsightsDest, webticksApiDest] })
   *   ```
   *
   * When `destinations` is set, `serverUrl`/`appId` are ignored unless you
   * explicitly include `WebticksApiDestination` in the array.
   */
  destinations?: WebticksDestination | WebticksDestination[];
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
