# @webticks/node

[![npm version](https://img.shields.io/npm/v/@webticks/node.svg)](https://www.npmjs.com/package/@webticks/node)
[![license](https://img.shields.io/npm/l/@webticks/node.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/node)](https://bundlephobia.com/package/@webticks/node)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)

Node.js server-side tracking for WebTicks analytics.

## Installation

```bash
npm install @webticks/node
```

## Quick Start

```javascript
import { createServerTracker } from '@webticks/node';

const tracker = createServerTracker({
  backendUrl: 'https://your-api.com/track',
  appId: 'your-app-id'
});

// Use middleware for automatic request tracking (recommended)
app.use(tracker.middleware());
```

## Best Practices: Environment Variables

For security and flexibility, it is **highly recommended** to source your configuration from environment variables.

```javascript
const tracker = createServerTracker({
  backendUrl: process.env.WEBTICKS_BACKEND_URL,
  appId: process.env.WEBTICKS_APP_ID
});
```

## Express Middleware Integration

The `tracker.middleware()` helper automatically captures request details (method, path, headers) and batches them for efficient delivery to your WebTicks API.

```javascript
import express from 'express';
import { createServerTracker } from '@webticks/node';

const app = express();
const tracker = createServerTracker({
  backendUrl: process.env.WEBTICKS_BACKEND_URL,
  appId: process.env.WEBTICKS_APP_ID
});

// Captures all requests automatically
app.use(tracker.middleware());
```

## Custom Events + Auto-Tracking

By default, both your custom event AND the server_request are tracked. This gives you complete analytics:

```javascript
app.post('/api/checkout', (req, res) => {
  tracker.trackEvent('checkout_completed', { total: 99.99 });
  // Both 'checkout_completed' AND 'server_request' are recorded
  res.json({ success: true });
});
```

### Controlling Auto-Tracking

By default, both your custom event AND the server_request are tracked.

To skip auto-tracking (only record your custom event), use `isAutoTracked: true`:

```javascript
// Only custom event (auto-tracking skipped)
tracker.trackEvent('checkout', { total: 99.99 }, { isAutoTracked: true, req });
```

## API

### `createServerTracker(config)`

| Option | Type | Description |
|--------|------|-------------|
| `backendUrl` | `string` | Required. URL to send analytics. |
| `appId` | `string` | Required. Your application ID. |

> [!NOTE]
> `appId` and `backendUrl` are typically provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) project, which you can self-host. Alternatively, you can use any backend that implements the WebTicks ingestion API.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
