/**
 * Simple test to verify Node.js server-side tracking works
 */

import { AnalyticsTracker } from './tracker.js';
import { createServerMiddleware } from './server-middleware.js';

console.log('🧪 Testing WebTicks Server-Side Support\n');

// Test 1: Create tracker in Node.js environment
console.log('Test 1: Creating tracker in Node.js...');
try {
    const tracker = new AnalyticsTracker({
        backendUrl: 'https://api.example.com/track'
    });
    console.log('✅ Tracker created successfully');
    console.log(`   User ID: ${tracker.userId}`);
} catch (err) {
    console.error('❌ Failed to create tracker:', err);
}

// Test 2: Track server request
console.log('\nTest 2: Tracking server request...');
try {
    const tracker = new AnalyticsTracker({
        backendUrl: 'https://api.example.com/track'
    });

    tracker.trackServerRequest({
        method: 'GET',
        path: '/api/users',
        query: { page: 1 },
        headers: {
            'user-agent': 'Node.js Test'
        }
    });

    console.log('✅ Server request tracked');
    console.log(`   Event queue length: ${tracker.eventQueue.length}`);
    console.log(`   Event type: ${tracker.eventQueue[0].type}`);
} catch (err) {
    console.error('❌ Failed to track request:', err);
}

// Test 3: Track custom event
console.log('\nTest 3: Tracking custom event...');
try {
    const tracker = new AnalyticsTracker({
        backendUrl: 'https://api.example.com/track'
    });

    tracker.trackEvent('test_event', {
        environment: 'nodejs',
        test: true
    });

    console.log('✅ Custom event tracked');
    console.log(`   Event queue length: ${tracker.eventQueue.length}`);
} catch (err) {
    console.error('❌ Failed to track event:', err);
}

// Test 4: Create middleware
console.log('\nTest 4: Creating server middleware...');
try {
    const middleware = createServerMiddleware({
        backendUrl: 'https://api.example.com/track'
    });
    console.log('✅ Middleware created successfully');
    console.log(`   Type: ${typeof middleware}`);
} catch (err) {
    console.error('❌ Failed to create middleware:', err);
}

console.log('\n✨ All tests completed!');
