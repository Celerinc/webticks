# @webticks/core

[![npm version](https://img.shields.io/npm/v/@webticks/core.svg)](https://www.npmjs.com/package/@webticks/core)
[![license](https://img.shields.io/npm/l/@webticks/core.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/core)](https://bundlephobia.com/package/@webticks/core)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Lightweight analytics library for modern web applications. Self-hosted, privacy-first, framework-agnostic.

> **Using a framework?** Pick the right package for your stack:
> [`@webticks/next`](https://www.npmjs.com/package/@webticks/next) · [`@webticks/react`](https://www.npmjs.com/package/@webticks/react) · [`@webticks/vue`](https://www.npmjs.com/package/@webticks/vue) · [`@webticks/sveltekit`](https://www.npmjs.com/package/@webticks/sveltekit) · [`@webticks/nuxt`](https://www.npmjs.com/package/@webticks/nuxt) · [`@webticks/angular`](https://www.npmjs.com/package/@webticks/angular) · [`@webticks/node`](https://www.npmjs.com/package/@webticks/node)

---

## Installation

```bash
npm install @webticks/core
```

---

## Setup

### Step 1 — Initialize once at your app entry point

```js
import inject from '@webticks/core';

inject({
  serverUrl: 'https://your-api.com/track', // your webticks-api URL
  appId: 'your-app-id',                    // from your webticks-api dashboard
});
```

### Step 2 — Track events anywhere in your app

```js
import { track } from '@webticks/core';

// Simple event
track('page_loaded');

// Event with details
track('button_clicked', { label: 'Sign Up', page: '/home' });

// Event with a category for grouping in your dashboard
track('login_success', 'auth', { method: 'magic_link' });
```

### Step 3 — Identify users and handle sessions

```js
import { identify, reset } from '@webticks/core';

// After a user logs in
identify('user-123', { plan: 'pro', role: 'admin' });

// After a user logs out
reset();
```

---

## Common Patterns

```js
import { track, identify, reset } from '@webticks/core';

// Auth flow
track('magic_link_requested', 'auth', { email: 'user@example.com' });
track('login_success', 'auth', { role: 'admin' });
identify('user-123', { role: 'admin' });

// UI interactions
track('button_clicked', { label: 'Upgrade', location: 'navbar' });
track('form_submitted', { form: 'checkout', step: 3 });

// Errors
track('error_occurred', { code: 404, path: '/missing' });

// Logout
track('logout', 'auth');
reset();
```

---

## TypeScript

### Typed event details

Pass a generic to enforce the shape of your `details` payload:

```ts
import { track } from '@webticks/core';

// TypeScript will error if role is missing or wrong type
track<{ role: string; method: string }>('login_success', 'auth', {
  role: 'admin',
  method: 'magic_link',
});
```

### Typed event categories (autocomplete)

Create a `webticks.d.ts` file anywhere in your project to define your event categories:

```ts
// webticks.d.ts
declare module '@webticks/core' {
  interface WebticksEventTypeMap {
    auth: true;
    commerce: true;
    navigation: true;
    user: true;
    error: true;
  }
}

export {};
```

After this, the second argument of `track()` will autocomplete your defined categories. Any string is still accepted as a fallback.

---

## Debug Mode

Enable `debug: true` during development to see all events logged in the browser console:

```js
inject({
  serverUrl: 'https://your-api.com/track',
  appId: 'your-app-id',
  debug: process.env.NODE_ENV === 'development',
});
```

Console output:
```
[webticks] initialized { serverUrl: '...', appId: '...' }
[webticks] track login_success auth { role: 'admin' }
[webticks] identify user-123 { plan: 'pro' }
[webticks] reset
```

---

## Environment Variables

Never hardcode your API credentials. Use environment variables:

```js
// Vite / modern bundlers
inject({
  serverUrl: import.meta.env.VITE_WEBTICKS_SERVER_URL,
  appId: import.meta.env.VITE_WEBTICKS_APP_ID,
});

// Webpack / CRA
inject({
  serverUrl: process.env.REACT_APP_WEBTICKS_SERVER_URL,
  appId: process.env.REACT_APP_WEBTICKS_APP_ID,
});
```

---

## API Reference

### `inject(config)`

Call once at app startup. Initializes the tracker and attaches it to `window.webticks`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serverUrl` | `string` | `/api/track` | URL of your webticks-api endpoint |
| `appId` | `string` | — | Your application ID |
| `debug` | `boolean` | `false` | Log all events to the browser console |
| `flushInterval` | `number` | `10000` | How often to batch-send events (ms) |
| `maxQueueSize` | `number` | `500` | Max events held in memory before oldest are dropped |

### `track(name, details?)`
### `track(name, type, details?)`

Track a custom event. Safe to call in SSR — no-ops until `inject()` is called.

| Param | Type | Description |
|-------|------|-------------|
| `name` | `string` | Event name (e.g. `'login_success'`, `'button_clicked'`) |
| `type` | `WebticksEventType` | Category for grouping (e.g. `'auth'`, `'commerce'`). Extend `WebticksEventTypeMap` for autocomplete. |
| `details` | `TDetails` | Arbitrary payload. Pass a generic `<T>` to enforce shape. |

### `identify(userId, traits?)`

Associate all subsequent events with a known user. Persists the user ID to `localStorage`.

### `reset()`

Clear the identified user and start a new anonymous session.

---

> [!NOTE]
> `serverUrl` and `appId` are provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) — a self-hosted NestJS + MongoDB backend you can run yourself.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
