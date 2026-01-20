'use client';
import { AnalyticsTracker } from '@webticks/core/tracker';
import { useEffect } from 'react';

// Extend Window interface to include webticks
declare global {
    interface Window {
        webticks?: AnalyticsTracker;
    }
}

export default function WebticksConfig() {
    useEffect(() => {
        // Only initialize in browser environments
        if (typeof window === 'undefined') {
            console.warn("webticks auto-inject skipped: Not in a browser environment.");
            return;
        }

        if (window.webticks) {
            console.warn("webticks tracker already initialized.");
            return;
        }

        const config = {
            backendUrl: "http://localhost:3002/api/track",
            appId: "97069816-8b25-4640-833f-f17259208a42"
        };

        const tracker = new AnalyticsTracker(config);
        tracker.autoTrackPageViews();
        window.webticks = tracker;

        console.log("✅ WebTicks initialized with custom config:", config);
    }, []);

    return null;
}
