/**
 * Comprehensive test for both browser and server-side tracking
 */

import { AnalyticsTracker } from './tracker.js';
import { createServerTracker } from './server-middleware.js';

console.log('🧪 Running WebTicks Comprehensive Tests\n');

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        passedTests++;
    } catch (err) {
        console.error(`❌ ${name}: ${err.message}`);
        failedTests++;
    }
}

// Test 1: Create tracker in Node.js environment
test('Create tracker in Node.js', () => {
    const tracker = new AnalyticsTracker({
        backendUrl: 'https://api.example.com/track'
    });
    if (!tracker) throw new Error('Tracker not created');
    if (!tracker.userId) throw new Error('User ID not generated');
});

// Test 2: Create server tracker
test('Create server tracker', () => {
    const tracker = createServerTracker({
        backendUrl: 'https://api.example.com/track'
    });
    if (!tracker) throw new Error('Server tracker not created');
});

// Test 3: Track server request
test('Track server request', () => {
    const tracker = createServerTracker({
        backendUrl: 'https://api.example.com/track'
    });

    tracker.trackServerRequest({
        method: 'GET',
        path: '/test',
        headers: { 'user-agent': 'Test' }
    });

    if (tracker.eventQueue.length !== 1) {
        throw new Error(`Expected 1 event, got ${tracker.eventQueue.length}`);
    }

    if (tracker.eventQueue[0].type !== 'server_request') {
        throw new Error(`Expected server_request type, got ${tracker.eventQueue[0].type}`);
    }
});

// Test 4: Track custom event
test('Track custom event', () => {
    const tracker = createServerTracker({
        backendUrl: 'https://api.example.com/track'
    });

    tracker.trackEvent('test_event', { test: true });

    if (tracker.eventQueue.length !== 1) {
        throw new Error(`Expected 1 event, got ${tracker.eventQueue.length}`);
    }

    if (tracker.eventQueue[0].type !== 'custom') {
        throw new Error(`Expected custom type, got ${tracker.eventQueue[0].type}`);
    }
});

// Test 5: Event queue batching
test('Event queue batching', () => {
    const tracker = createServerTracker({
        backendUrl: 'https://api.example.com/track'
    });

    tracker.trackEvent('event1', {});
    tracker.trackEvent('event2', {});
    tracker.trackEvent('event3', {});

    if (tracker.eventQueue.length !== 3) {
        throw new Error(`Expected 3 events, got ${tracker.eventQueue.length}`);
    }
});

// Test 6: Platform adapter selection
test('Platform adapter selection (Node.js)', () => {
    const tracker = new AnalyticsTracker({
        backendUrl: 'https://api.example.com/track'
    });

    if (!tracker.adapter) {
        throw new Error('No adapter assigned');
    }

    // In Node.js, should use NodeAdapter
    if (tracker.adapter.constructor.name !== 'NodeAdapter') {
        throw new Error(`Expected NodeAdapter, got ${tracker.adapter.constructor.name}`);
    }
});

// Test 7: User ID persistence
test('User ID persistence', () => {
    const tracker1 = new AnalyticsTracker({ backendUrl: 'test' });
    const tracker2 = new AnalyticsTracker({ backendUrl: 'test' });

    // Different instances should have different user IDs in Node.js
    // (no shared localStorage like browser)
    if (!tracker1.userId || !tracker2.userId) {
        throw new Error('User IDs not generated');
    }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests Passed: ${passedTests}`);
console.log(`Tests Failed: ${failedTests}`);
console.log('='.repeat(50));

if (failedTests > 0) {
    process.exit(1);
} else {
    console.log('\n✨ All tests passed!\n');
    process.exit(0);
}
