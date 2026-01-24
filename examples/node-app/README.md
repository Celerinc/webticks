# Node.js/Express Backend API with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a Node.js/Express backend API using the `@webticks/node` package. This is a **client application** that uses `@webticks/node` to track server-side requests and send them to the WebTicks API for storage and analysis.

## Architecture

```
┌─────────────────────┐
│  Your Node.js App   │  ← This example
│  (Port 3001)        │
│                     │
│  Uses:              │
│  @webticks/node     │
└──────────┬──────────┘
           │
           │ Sends tracked events
           ▼
┌─────────────────────┐
│  WebTicks API       │  ← Separate service
│  (Port 3002)        │     (webticks-api repo)
│                     │
│  Stores analytics   │
│  data               │
└─────────────────────┘
```

## Features

- **Pure Backend API** - No frontend code, just REST endpoints
- **Automatic Request Tracking** - All API requests tracked via middleware
- **Sends to WebTicks API** - Events are sent to your WebTicks API instance
- **Session Management** - User ID and session tracking handled automatically
- **Event Batching** - Minimizes network calls for efficiency

## Installation

From the monorepo root:

```bash
cd examples/node-app
pnpm install
```

## Prerequisites

You need a running WebTicks API instance to receive the tracked events. See the [webticks-api](https://github.com/Celerinc/webticks-api) repository for setup instructions.

## Running the Application

Start the server:
```bash
node demo-server.js
```

The server will be available at `http://localhost:3001`

## Usage

### Option 1: Auto-Track All Requests

The simplest approach - automatically track every HTTP request:

```javascript
import express from 'express';
import { createServerTracker } from '@webticks/node';

const app = express();

const tracker = createServerTracker({
  backendUrl: 'http://localhost:3002/api/track',
  appId: 'your-app-id'
});

// One-line middleware - tracks ALL requests
app.use(tracker.middleware());

// All endpoints are automatically tracked
app.get('/api/users', (req, res) => {
  res.json({ users: [...] });
});

app.post('/api/orders', (req, res) => {
  res.json({ success: true });
});
```

Every request is tracked as a `server_request` event.

### Option 2: Auto-Track + Custom Events

Track both the server request AND custom business events. By default, both are recorded:

```javascript
import express from 'express';
import { createServerTracker } from '@webticks/node';

const app = express();

const tracker = createServerTracker({
  backendUrl: 'http://localhost:3002/api/track',
  appId: 'your-app-id'
});

app.use(tracker.middleware());

// Regular endpoint - auto-tracked as server_request
app.get('/api/users', (req, res) => {
  res.json({ users: [...] });
});

// Custom event endpoint - BOTH events are tracked:
// 1. server_request (from middleware)
// 2. checkout_completed (from trackEvent)
app.post('/api/checkout', (req, res) => {
  tracker.trackEvent('checkout_completed', {
    userId: req.body.userId,
    total: req.body.total
  });
  res.json({ success: true });
});
```

### Controlling Auto-Tracking

By default, calling `trackEvent()` does NOT skip auto-tracking - both events are recorded.

To skip auto-tracking (only record your custom event), use `isAutoTracked: true`:

```javascript
app.post('/api/checkout', (req, res) => {
  // Only 'checkout_completed' is tracked (auto-tracking skipped)
  tracker.trackEvent('checkout_completed', { total: req.body.total }, { 
    isAutoTracked: true,  // "I'm handling tracking, skip auto-track"
    req 
  });
  res.json({ success: true });
});
```

Without the flag, both events are tracked:

```javascript
app.post('/api/checkout', (req, res) => {
  // Both 'checkout_completed' AND 'server_request' are tracked
  tracker.trackEvent('checkout_completed', { total: req.body.total });
  res.json({ success: true });
});
```

## API Endpoints

The demo server includes example endpoints:

- `GET /health` - Health check endpoint
- `GET /api/users` - List users
- `POST /api/users` - Create a new user
- `GET /api/products` - List products
- `GET /api/orders` - List orders

All of these endpoints are automatically tracked when accessed.

## Testing

Test the tracking with curl:

```bash
# Health check
curl http://localhost:3001/health

# List users (tracked)
curl http://localhost:3001/api/users

# Create a user (tracked)
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# List products (tracked)
curl http://localhost:3001/api/products
```

Each request will be tracked and sent to your WebTicks API at `http://localhost:3002/api/track`.

## Configuration

Update the tracker configuration in `app.js`:

```javascript
const tracker = createServerTracker({
  backendUrl: process.env.WEBTICKS_API_URL || 'http://localhost:3002/api/track',
  appId: process.env.WEBTICKS_APP_ID || 'your-app-id'
});
```

## Project Structure

```
├── app.js            # Express server with WebTicks integration
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## Tech Stack

- Node.js (ES Modules)
- Express.js
- @webticks/node

## How It Works

1. Your Node.js app receives HTTP requests
2. The tracking middleware captures request details
3. `@webticks/node` batches events for efficiency
4. Events are sent to the WebTicks API endpoint
5. The WebTicks API stores and processes the analytics data

## Next Steps

- Set up the [WebTicks API](https://github.com/Celerinc/webticks-api) to receive events
- Configure your production WebTicks API URL
- Add custom event tracking for business logic
- Filter sensitive routes from tracking
- Implement user authentication tracking
- Deploy both your app and WebTicks API to production

For more information, see the [@webticks/node](../../packages/node) package documentation.
