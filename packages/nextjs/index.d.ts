import { FC } from 'react';

export interface WebticksAnalyticsProps {
    serverUrl?: string;
    appId: string;
    debug?: boolean;
    /** Locale prefixes to strip from tracked paths, e.g. ['fr', 'en'] */
    stripLocales?: string[];
}

declare const WebticksAnalytics: FC<WebticksAnalyticsProps>;

export default WebticksAnalytics;

export { track, identify, reset, WebticksEventType, WebticksEventTypeMap } from '@webticks/react';
