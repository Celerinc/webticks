# @webticks/node

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

// Track a server request
tracker.trackServerRequest({
  method: 'GET',
  path: '/api/users',
  headers: { 'user-agent': req.headers['user-agent'] }
});
```

## Best Practices: Environment Variables

For security and flexibility, it is **highly recommended** to source your configuration from environment variables.

```javascript
const tracker = createServerTracker({
  backendUrl: process.env.WEBTICKS_BACKEND_URL,
  appId: process.env.WEBTICKS_APP_ID
});
```

## Express Middleware Example

```javascript
import express from 'express';
import { createServerTracker } from '@webticks/node';

const app = express();
const tracker = createServerTracker({
  backendUrl: process.env.WEBTICKS_BACKEND_URL,
  appId: process.env.WEBTICKS_APP_ID
});

app.use((req, res, next) => {
  tracker.trackServerRequest({
    method: req.method,
    path: req.url,
    headers: { 'user-agent': req.headers['user-agent'] }
  });
  next();
});
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
