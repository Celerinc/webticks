# @webticks/core

[![npm version](https://img.shields.io/npm/v/@webticks/core.svg)](https://www.npmjs.com/package/@webticks/core)
[![license](https://img.shields.io/npm/l/@webticks/core.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/core)](https://bundlephobia.com/package/@webticks/core)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Lightweight analytics library for modern web applications.

## Installation

```bash
npm install @webticks/core
```

## Quick Start

```javascript
import inject from '@webticks/core';

// Initialize analytics with explicit config
inject({
  serverUrl: 'https://your-api.com/track',
  appId: 'your-app-id'
});
```

## Best Practices: Environment Variables

For security and flexibility, it is **highly recommended** to source your configuration from environment variables rather than hardcoding them in your source code.

```javascript
// Example using Vite or other modern bundlers
inject({
  serverUrl: import.meta.env.VITE_WEBTICKS_SERVER_URL,
  appId: import.meta.env.VITE_WEBTICKS_APP_ID
});

// Example using Node.js / Webpack
inject({
  serverUrl: process.env.WEBTICKS_SERVER_URL,
  appId: process.env.WEBTICKS_APP_ID
});
```

## Exports

| Export | Description |
|--------|-------------|
| `@webticks/core` | Injector function (default) |
| `@webticks/core/tracker` | `AnalyticsTracker` class for manual tracking |

## API

### `inject(config)`

| Option | Type | Description |
|--------|------|-------------|
| `serverUrl` | `string` | Recommended. URL to send analytics data to. Defaults to `/api/track`. |
| `appId` | `string` | Required. Your application ID. |
| `debug` | `boolean` | Optional. Enable console logging for debugging. Defaults to `false`. |

> [!NOTE]
> `appId` and `serverUrl` are typically provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) project, which you can self-host. Alternatively, you can use any backend that implements the WebTicks ingestion API.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
