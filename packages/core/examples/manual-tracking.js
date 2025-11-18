/**
 * Example: Manual Server-Side Tracking
 * 
 * This demonstrates how to manually track events in Node.js
 * without using middleware (useful for serverless, API routes, etc.)
 */

import { AnalyticsTracker } from '@webticks/core/tracker';

// Create a tracker instance
const tracker = new AnalyticsTracker({
    backendUrl: 'https://api.example.com/track'
});

// Example: Next.js API Route
export default async function handler(req, res) {
    // Track the incoming request
    tracker.trackServerRequest({
        method: req.method,
        path: req.url,
        query: req.query,
        headers: {
            'user-agent': req.headers['user-agent'],
            'referer': req.headers['referer']
        }
    });

    // Your API logic
    const data = { message: 'Hello World' };

    // Track a custom event
    tracker.trackEvent('api_call_success', {
        endpoint: req.url,
        responseSize: JSON.stringify(data).length
    });

    res.status(200).json(data);
}

// Example: AWS Lambda / Serverless Function
export async function lambdaHandler(event, context) {
    const tracker = new AnalyticsTracker({
        backendUrl: process.env.ANALYTICS_URL
    });

    tracker.trackServerRequest({
        method: event.httpMethod,
        path: event.path,
        query: event.queryStringParameters,
        headers: event.headers
    });

    // Send events immediately (no batching in serverless)
    await tracker.sendQueue();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' })
    };
}
