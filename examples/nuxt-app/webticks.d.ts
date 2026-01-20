// Type declarations for WebTicks Analytics
interface WebTicksAnalytics {
    trackEvent(eventName: string, metadata?: Record<string, any>): void;
    // Add other WebTicks methods here if needed
}

interface Window {
    webticks?: WebTicksAnalytics;
}
