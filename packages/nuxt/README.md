# @webticks/nuxt

[![npm version](https://img.shields.io/npm/v/@webticks/nuxt.svg)](https://www.npmjs.com/package/@webticks/nuxt)
[![license](https://img.shields.io/npm/l/@webticks/nuxt.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/nuxt)](https://bundlephobia.com/package/@webticks/nuxt)
![Nuxt.js](https://img.shields.io/badge/Nuxt.js-00DC82?logo=nuxtdotjs&logoColor=white)

Nuxt 3 module for WebTicks analytics.

---

## Installation

```bash
npm install @webticks/nuxt
```

---

## Setup

### Step 1 — Register the module in your Nuxt config

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@webticks/nuxt'],
  runtimeConfig: {
    public: {
      webticks: {
        serverUrl: process.env.NUXT_PUBLIC_WEBTICKS_SERVER_URL,
        appId: process.env.NUXT_PUBLIC_WEBTICKS_APP_ID,
      },
    },
  },
});
```

Add to your `.env`:

```bash
NUXT_PUBLIC_WEBTICKS_SERVER_URL=https://your-api.com/track
NUXT_PUBLIC_WEBTICKS_APP_ID=your-app-id
```

> Nuxt automatically maps `NUXT_PUBLIC_*` env variables to `runtimeConfig.public.*` — no extra wiring needed.

### Step 2 — Track events anywhere

Import `track` directly — works in components, composables, and plugins:

```vue
<script setup>
import { track } from '@webticks/nuxt';
</script>

<template>
  <button @click="track('button_clicked', { label: 'Sign Up' })">
    Sign Up
  </button>
</template>
```

### Step 3 — Identify users and handle sessions

```ts
import { identify, reset } from '@webticks/nuxt';

// After login
identify('user-123', { role: 'admin', plan: 'pro' });

// After logout
reset();
```

---

## Common Patterns

```ts
import { track, identify, reset } from '@webticks/nuxt';

// Auth flow
track('magic_link_requested', 'auth');
track('login_success', 'auth', { method: 'magic_link' });
identify('user-123', { role: 'admin' });

// Form submissions
track('form_submitted', { form: 'onboarding', step: 1 });
track('form_error', { form: 'onboarding', field: 'email' });

// Feature usage
track('tab_changed', { from: 'overview', to: 'settings' });
track('profile_viewed', { profileId: 'abc123' });

// Logout
track('logout', 'auth');
reset();
```

---

## TypeScript

### Typed event details

```ts
import { track } from '@webticks/nuxt';

track<{ method: 'magic_link' | 'google' }>('login_success', 'auth', {
  method: 'magic_link', // TypeScript enforces the union
});
```

### Typed event categories (autocomplete)

Create a `webticks.d.ts` file in your project:

```ts
// types/webticks.d.ts
declare module '@webticks/core' {
  interface WebticksEventTypeMap {
    auth: true;
    navigation: true;
    commerce: true;
    ui: true;
    error: true;
  }
}

export {};
```

The second argument of `track()` will now autocomplete your defined categories across the project.

---

## Debug Mode

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@webticks/nuxt'],
  runtimeConfig: {
    public: {
      webticks: {
        serverUrl: process.env.NUXT_PUBLIC_WEBTICKS_SERVER_URL,
        appId: process.env.NUXT_PUBLIC_WEBTICKS_APP_ID,
        debug: process.env.NODE_ENV === 'development',
      },
    },
  },
});
```

All events and page views will be logged to the browser console in debug mode.

---

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serverUrl` | `string` | `/api/track` | URL of your webticks-api endpoint |
| `appId` | `string` | — | Your application ID |
| `debug` | `boolean` | `false` | Log all events to the console |

> [!NOTE]
> `serverUrl` and `appId` are provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) — a self-hosted NestJS + MongoDB backend you can run yourself.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
