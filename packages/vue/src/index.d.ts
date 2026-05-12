import type { DefineComponent } from 'vue';

export interface WebticksAnalyticsProps {
    serverUrl?: string;
    appId?: string;
    debug?: boolean;
}

declare const WebticksAnalytics: DefineComponent<WebticksAnalyticsProps>;

export { WebticksAnalytics };
export default WebticksAnalytics;

export { track, identify, reset, WebticksEventType, WebticksEventTypeMap } from '@webticks/core';
