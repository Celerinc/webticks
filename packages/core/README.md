# WebTicks Core - Usage Examples

## Browser Usage (No Changes Required!)

Your existing React/Next.js packages continue to work exactly as before:

```jsx
import WebTicksAnalytics from '@webticks/react';

function App() {
  return (
    <div>
      <WebTicksAnalytics />
      {/* Your app */}
    </div>
  );
}
```

## Server-Side Usage

### Option 1: Express Middleware (Automatic)

```javascript
import express from 'express';
import { createServerMiddleware } from '@webticks/core/server';

const app = express();

// Automatically track all HTTP requests
app.use(createServerMiddleware({
  backendUrl: 'https://api.example.com/track'
}));

app.listen(3000);
```

### Option 2: Manual Tracking

```javascript
import { AnalyticsTracker } from '@webticks/core/tracker';

const tracker = new AnalyticsTracker({
  backendUrl: 'https://api.example.com/track'
});

// Track server requests
tracker.trackServerRequest({
  method: 'GET',
  path: '/api/users',
  query: { page: 1 },
  headers: { 'user-agent': 'Mozilla/5.0' }
});

// Track custom events
tracker.trackEvent('database_query', {
  table: 'users',
  duration: 45
});

// Send immediately (useful for serverless)
await tracker.sendQueue();
```

### Next.js Example

```javascript
// pages/api/users.js
import { AnalyticsTracker } from '@webticks/core/tracker';

const tracker = new AnalyticsTracker({
  backendUrl: process.env.ANALYTICS_URL
});

export default async function handler(req, res) {
  tracker.trackServerRequest({
    method: req.method,
    path: req.url,
    query: req.query,
    headers: {
      'user-agent': req.headers['user-agent']
    }
  });

  // Your API logic here
  const data = await getUsers();
  
  res.status(200).json(data);
}
```

## Key Benefits

✅ **Centralized Logic**: All tracking logic lives in `@webticks/core`  
✅ **Environment Agnostic**: Works in browser and Node.js  
✅ **Zero Breaking Changes**: Existing packages work without modifications  
✅ **Easy Updates**: Fix bugs once, all environments benefit  
✅ **Flexible**: Works with any framework (Express, Koa, Fastify, serverless, etc.)
