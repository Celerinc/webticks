import { FC } from 'react';
import { WebticksDestination } from '@webticks/core';

export interface WebticksAnalyticsProps {
  serverUrl?: string;
  appId?: string;
  debug?: boolean;
  /**
   * Where to send events.
   *
   * **Single destination** — all events go exclusively to that one:
   * ```tsx
   * import { AppInsightsDestination } from '@webticks/appinsights';
   *
   * <WebticksAnalytics
   *   destinations={new AppInsightsDestination({ connectionString: '...' })}
   * />
   * ```
   *
   * **Array of destinations** — events are fanned out to all in parallel.
   * One failing never blocks the others:
   * ```tsx
   * import { WebticksApiDestination } from '@webticks/core';
   * import { AppInsightsDestination } from '@webticks/appinsights';
   *
   * <WebticksAnalytics
   *   destinations={[
   *     new WebticksApiDestination({ serverUrl: '...', appId: '...' }),
   *     new AppInsightsDestination({ connectionString: '...' }),
   *   ]}
   * />
   * ```
   *
   * When `destinations` is set, `serverUrl`/`appId` props are ignored unless
   * you explicitly include `WebticksApiDestination` in the array.
   */
  destinations?: WebticksDestination | WebticksDestination[];
}

declare const WebticksAnalytics: FC<WebticksAnalyticsProps>;

export default WebticksAnalytics;

export {
  track,
  identify,
  reset,
  WebticksEventType,
  WebticksEventTypeMap,
  WebticksDestination,
  WebticksApiDestination,
  WebTicksBatch,
  WebticksEvent,
} from '@webticks/core';
