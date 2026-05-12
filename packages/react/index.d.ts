import { FC } from 'react';

export interface WebticksAnalyticsProps {
    serverUrl?: string;
    appId?: string;
    debug?: boolean;
}

declare const WebticksAnalytics: FC<WebticksAnalyticsProps>;

export default WebticksAnalytics;

export { track, identify, reset, WebticksEventType, WebticksEventTypeMap } from '@webticks/core';
