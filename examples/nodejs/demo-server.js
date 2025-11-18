/**
 * Demo Server - Node.js server-side tracking example
 * Run with: node demo-server.js
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServerTracker } from '@webticks/nodejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Create tracker instance
const tracker = createServerTracker({
    backendUrl: 'https://api.example.com/track'
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Add tracking - simple one-liner that works with any framework!
app.use((req, res, next) => {
    if (!req.path.match(/\.(js|css|png|jpg|svg|ico)$/)) {
        tracker.trackServerRequest({ method: req.method, path: req.url, headers: req.headers });
    }
    next();
});

// Serve tracker.js from core package
app.get('/tracker.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../tracker.js'));
});

// Serve platform-adapters.js
app.get('/platform-adapters.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../platform-adapters.js'));
});

// API endpoint to receive tracked events (simulated backend)
const allEvents = [];

app.post('/api/track', (req, res) => {
    const { uid, events, datetime } = req.body;

    console.log('\n📊 Analytics Batch Received');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`User ID: ${uid}`);
    console.log(`Date/Time: ${datetime}`);
    console.log(`Events Count: ${events.length}`);
    console.log('\nEvents:');
    events.forEach((event, index) => {
        console.log(`  ${index + 1}. [${event.type}] ${event.path || event.name || 'N/A'}`);
        allEvents.push({ ...event, uid, receivedAt: datetime });
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.json({
        success: true,
        message: 'Events tracked successfully',
        count: events.length
    });
});

// Test API endpoint
app.post('/api/test', (req, res) => {
    console.log('🧪 Test API called:', req.body);
    res.json({
        message: 'Test successful!',
        timestamp: new Date().toISOString(),
        data: req.body
    });
});

// Get all tracked events
app.get('/api/events', (req, res) => {
    res.json({
        total: allEvents.length,
        events: allEvents
    });
});

// Serve the demo page for any route (SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 WebTicks Demo Server Running');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ Using simplified tracker approach:');
    console.log('  • createServerTracker() - works with any framework');
    console.log('  • No framework-specific adapters needed');
    console.log('  • Same code works everywhere');
    console.log('\n💡 Open http://localhost:3000 in your browser\n');
});
