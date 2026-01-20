# Node.js/Express Server with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a Node.js/Express server using the `@webticks/node` package for server-side request tracking.

## Features

- Server-side HTTP request tracking
- Session and user ID management
- Event batching to minimize backend calls
- Express middleware integration
- Analytics dashboard endpoint

## Installation

From the monorepo root:

```bash
cd examples/node-app
pnpm install
```

## Environment Variables

No environment variables are required for development. For production, create a `.env` file:

```env
PORT=3000
WEBTICKS_BACKEND_URL=https://your-analytics-backend.com/api/track
```

## Running the Application

Start the server:
```bash
pnpm start
```

Or use with nodemon for development:
```bash
pnpm dev
```

The server will be available at `http://localhost:3000`

## Usage

The WebTicks tracker is integrated as Express middleware in `demo-server.js`:

```javascript
import express from 'express';
import { createServerTracker } from '@webticks/node';

const app = express();
const tracker = createServerTracker({
  backendUrl: 'http://localhost:3000/api/track'
});

// Track all requests
app.use((req, res, next) => {
  tracker.trackServerRequest({
    method: req.method,
    path: req.url,
    headers: req.headers
  });
  next();
});
```

Every HTTP request to your server will be automatically tracked and batched for efficient analytics.

## API Endpoints

The demo server includes:

- `GET /` - Welcome page
- `GET /api/users` - Sample API endpoint (tracked)
- `POST /api/users` - Sample POST endpoint (tracked)
- `POST /api/track` - Analytics receiver endpoint
- `GET /api/events` - View all tracked events

## Testing

Test the tracking with curl:

```bash
# Make requests that will be tracked
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# View tracked events
curl http://localhost:3000/api/events
```

## Server Console Output

The server logs all tracked events:

```
📊 Analytics Batch Received
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User ID: abc123...
Session ID: xyz789...
Events Count: 2

Events:
  1. [server_request] /api/users
      Request ID: req_001
  2. [server_request] /api/users
      Request ID: req_002
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Project Structure

```
├── demo-server.js    # Express server with WebTicks integration
└── package.json      # Dependencies and scripts
```

## Tech Stack

- Node.js (ES Modules)
- Express.js
- @webticks/node

## Next Steps

- Configure your analytics backend URL
- Add custom event tracking for business logic
- Filter sensitive routes from tracking
- Implement authentication tracking

For more information, see the [@webticks/node](../../packages/node) package documentation.
