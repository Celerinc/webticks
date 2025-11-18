/**
 * Example: Using WebTicks with Express.js
 * 
 * This demonstrates how to use the WebTicks middleware
 * to automatically track all HTTP requests in your Express app.
 */

import express from 'express';
import { createServerMiddleware } from '@webticks/core/server';

const app = express();

// Add WebTicks middleware - tracks all requests automatically
app.use(createServerMiddleware({
    backendUrl: 'https://api.example.com/track',
    // Optional: Filter which requests to track
    shouldTrack: (req) => {
        // Don't track static assets or health checks
        return !req.path.match(/\.(js|css|png|jpg|svg)$/) &&
            !req.path.startsWith('/health');
    }
}));

// Your routes
app.get('/', (req, res) => {
    res.send('Home Page');
});

app.get('/about', (req, res) => {
    res.send('About Page');
});

app.get('/api/users', (req, res) => {
    res.json({ users: [] });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    console.log('WebTicks tracking enabled!');
});
