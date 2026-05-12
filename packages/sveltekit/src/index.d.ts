import type { SvelteComponent } from 'svelte';

export interface WebticksAnalyticsProps {
    serverUrl?: string;
    appId?: string;
    debug?: boolean;
}

export declare class WebticksAnalytics extends SvelteComponent<WebticksAnalyticsProps> {}

export default WebticksAnalytics;

export { track, identify, reset, WebticksEventType, WebticksEventTypeMap } from '@webticks/core';
