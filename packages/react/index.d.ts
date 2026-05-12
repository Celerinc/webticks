import { FC } from 'react';
import { WebticksDestination } from '@webticks/core';

export interface WebticksAnalyticsProps {
    serverUrl?: string;
    appId?: string;
    debug?: boolean;
    /** Destination plugins. When provided, serverUrl/appId are ignored. */
    destinations?: WebticksDestination[];
}

declare const WebticksAnalytics: FC<WebticksAnalyticsProps>;

export default WebticksAnalytics;

export { track, identify, reset, WebticksEventType, WebticksEventTypeMap, WebticksDestination, WebticksApiDestination, WebTicksBatch } from '@webticks/core';
