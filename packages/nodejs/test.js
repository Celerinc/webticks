/**
 * Node package tests
 */

import { createServerTracker } from './src/index.js';

console.log('🧪 Running WebTicks Node Tests\n');

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

// Test 1: Create server tracker
test('Create server tracker', () => {
    const tracker = createServerTracker({
        backendUrl: 'https://api.example.com/track'
    });
    if (!tracker) throw new Error('Server tracker not created');
    if (!tracker.userId) throw new Error('User ID not generated');
});

// Test 2: Track server request
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

// Test 3: Track custom event
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

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests Passed: ${passedTests}`);
console.log(`Tests Failed: ${failedTests}`);
console.log('='.repeat(50));

if (failedTests > 0) {
    process.exit(1);
} else {
    console.log('\n✨ All Node tests passed!\n');
    process.exit(0);
}
