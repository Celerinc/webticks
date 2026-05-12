# @webticks/node

[![npm version](https://img.shields.io/npm/v/@webticks/node.svg)](https://www.npmjs.com/package/@webticks/node)
[![license](https://img.shields.io/npm/l/@webticks/node.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/node)](https://bundlephobia.com/package/@webticks/node)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)

Server-side tracking for WebTicks analytics. Works with Express, NestJS, Fastify, and any Node.js HTTP framework.

---

## Installation

```bash
npm install @webticks/node
```

---

## Setup

### Step 1 — Create a tracker instance

```js
// src/analytics.js (or analytics.ts)
import { createServerTracker } from '@webticks/node';

export const tracker = createServerTracker({
  serverUrl: process.env.WEBTICKS_SERVER_URL,
  appId: process.env.WEBTICKS_APP_ID,
});
```

Add to your `.env`:

```bash
WEBTICKS_SERVER_URL=https://your-api.com/track
WEBTICKS_APP_ID=your-app-id
```

### Step 2 — Add auto-tracking middleware (Express)

Mount the middleware once at your app root to automatically track all incoming requests:

```js
import express from 'express';
import { tracker } from './analytics.js';

const app = express();

app.use(tracker.middleware());
```

### Step 2 — Add auto-tracking middleware (NestJS)

In a NestJS app, apply it as a global middleware:

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { tracker } from './analytics';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(tracker.middleware());
  await app.listen(3000);
}
bootstrap();
```

### Step 3 — Track custom events

```js
import { tracker } from './analytics.js';

app.post('/api/checkout', (req, res) => {
  tracker.trackEvent('checkout_completed', {
    total: 99.99,
    currency: 'USD',
    plan: 'pro',
  });
  res.json({ success: true });
});
```

By default, both your custom event **and** the automatic `server_request` event are recorded.

---

## Common Patterns

```js
import { tracker } from './analytics.js';

// Auth
tracker.trackEvent('login_success', { method: 'magic_link', userId: 'user-123' });
tracker.trackEvent('login_failed', { reason: 'invalid_token' });

// Business events
tracker.trackEvent('subscription_created', { plan: 'pro', userId: 'user-123' });
tracker.trackEvent('subscription_cancelled', { reason: 'too_expensive' });

// Errors
tracker.trackEvent('error_occurred', { code: 500, path: req.url, message: err.message });
```

---

## Controlling Auto-Tracking

When you call `trackEvent()` in a route, the middleware also records a `server_request` event for the same request — you get both.

To **skip** the auto-tracked `server_request` (record only your custom event), pass `{ isAutoTracked: true, req }`:

```js
app.post('/api/checkout', (req, res) => {
  // Only 'checkout_completed' is recorded — no duplicate server_request
  tracker.trackEvent('checkout_completed', { total: 99.99 }, { isAutoTracked: true, req });
  res.json({ success: true });
});
```

---

## Debug Mode

```js
const tracker = createServerTracker({
  serverUrl: process.env.WEBTICKS_SERVER_URL,
  appId: process.env.WEBTICKS_APP_ID,
  debug: process.env.NODE_ENV === 'development',
});
```

All tracked events will be logged to the console in debug mode.

---

## API Reference

### `createServerTracker(config)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serverUrl` | `string` | — | URL of your webticks-api endpoint |
| `appId` | `string` | — | Your application ID |
| `debug` | `boolean` | `false` | Log all events to the console |
| `flushInterval` | `number` | `10000` | How often to batch-send events (ms) |
| `maxQueueSize` | `number` | `500` | Max events held in memory before oldest are dropped |

### `tracker.middleware()`

Returns an Express/Connect-compatible middleware function. Mount once at app root. Automatically tracks all requests as `server_request` events on response finish.

### `tracker.trackEvent(name, data?, options?)`

| Param | Type | Description |
|-------|------|-------------|
| `name` | `string` | Event name (e.g. `'checkout_completed'`) |
| `data` | `object` | Arbitrary payload |
| `options.isAutoTracked` | `boolean` | Set to `true` to skip auto-tracking for this request |
| `options.req` | `object` | Express request object (required when using `isAutoTracked`) |

### `tracker.sendQueue()`

Manually flush all queued events. Called automatically on `SIGINT` and `SIGTERM`.

### `tracker.destroy()`

Stop the batch timer and clean up. Call on graceful shutdown if needed.

---

> [!NOTE]
> `serverUrl` and `appId` are provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) — a self-hosted NestJS + MongoDB backend you can run yourself.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
