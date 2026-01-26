/**
 * Demo Server - Node.js server-side tracking example
 * This is a sample backend application that uses @webticks/node to track
 * server-side requests and send them to the WebTicks API for storage.
 * 
 * Run with: node demo-server.js
 */

import express from 'express';
import { createServerTracker } from '@webticks/node';

const app = express();
const PORT = 3001;

// Create tracker instance - sends events to your WebTicks API
const tracker = createServerTracker({
    serverUrl: "http://localhost:3002/api/track", // Your WebTicks API endpoint
    appId: '97069816-8b25-4640-833f-f17259208a42'  // Your application ID
});

// Middleware
app.use(express.json());

// Tracking middleware - automatically tracks all requests
// Use { isAutoTracked: true, req } to skip auto-tracking (when handling manually)
app.use(tracker.middleware());

// Example API endpoints for your application

app.get('/api/users', (req, res) => {
    res.json({
        users: [
            { id: 1, name: 'Alice', email: 'alice@example.com' },
            { id: 2, name: 'Bob', email: 'bob@example.com' }
        ]
    });
});

app.post('/api/users', (req, res) => {
    console.log('Creating user:', req.body);
    res.status(201).json({
        message: 'User created successfully',
        user: { id: 3, ...req.body }
    });
});

app.get('/api/products', (req, res) => {
    res.json({
        products: [
            { id: 1, name: 'Product A', price: 29.99 },
            { id: 2, name: 'Product B', price: 49.99 },
            { id: 3, name: 'Product C', price: 79.99 }
        ]
    });
});

app.get('/api/orders', (req, res) => {
    res.json({
        orders: [
            { id: 1, userId: 1, productId: 1, total: 29.99 },
            { id: 2, userId: 2, productId: 2, total: 49.99 }
        ]
    });
});

// Example of manual event tracking
// Both this custom event AND the server_request event will be tracked
app.post('/api/checkout', (req, res) => {
    const { userId, items, total } = req.body;

    // Track custom event (server_request also tracked via middleware)
    tracker.trackEvent('checkout_completed', {
        userId,
        itemCount: items?.length || 0,
        total,
        timestamp: new Date().toISOString()
    });

    res.json({
        success: true,
        message: 'Checkout completed',
        orderId: Math.floor(Math.random() * 10000)
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        tracking: 'enabled'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 WebTicks Node.js Backend API Example');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ Features:');
    console.log('  • Automatic request tracking via middleware');
    console.log('  • Events sent to WebTicks API for storage');
    console.log('  • Pure backend API (no frontend code)');
    console.log('  • Example REST endpoints');
    console.log('\n📡 Available endpoints:');
    console.log('  GET  /health          - Health check');
    console.log('  GET  /api/users       - List users');
    console.log('  POST /api/users       - Create user');
    console.log('  GET  /api/products    - List products');
    console.log('  GET  /api/orders      - List orders');
    console.log('  POST /api/checkout    - Checkout (manual tracking)');
    console.log('\n📊 Analytics:');
    console.log('  All requests are tracked and sent to:');
    console.log('  http://localhost:3002/api/track');
    console.log('\n💡 Test with: curl http://localhost:3001/api/users\n');
});
