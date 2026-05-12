# @webticks/vue

[![npm version](https://img.shields.io/npm/v/@webticks/vue.svg)](https://www.npmjs.com/package/@webticks/vue)
[![license](https://img.shields.io/npm/l/@webticks/vue.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/vue)](https://bundlephobia.com/package/@webticks/vue)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?logo=vuedotjs&logoColor=white)

Vue 3 integration for WebTicks analytics.

---

## Installation

```bash
npm install @webticks/vue
```

---

## Setup

### Step 1 — Add the component to your app root

```vue
<!-- src/App.vue -->
<template>
  <WebticksAnalytics
    :serverUrl="serverUrl"
    :appId="appId"
  />
  <RouterView />
</template>

<script setup>
import WebticksAnalytics from '@webticks/vue';

const serverUrl = import.meta.env.VITE_WEBTICKS_SERVER_URL;
const appId = import.meta.env.VITE_WEBTICKS_APP_ID;
</script>
```

Add to your `.env`:

```bash
VITE_WEBTICKS_SERVER_URL=https://your-api.com/track
VITE_WEBTICKS_APP_ID=your-app-id
```

> Variables must be prefixed with `VITE_` to be accessible in the browser.

### Step 2 — Track events anywhere

Import `track` directly — no composable or plugin needed:

```vue
<script setup>
import { track } from '@webticks/vue';
</script>

<template>
  <button @click="track('button_clicked', { label: 'Sign Up' })">
    Sign Up
  </button>
</template>
```

### Step 3 — Identify users and handle sessions

```js
import { identify, reset } from '@webticks/vue';

// After login
identify('user-123', { role: 'admin', plan: 'pro' });

// After logout
reset();
```

---

## Common Patterns

```js
import { track, identify, reset } from '@webticks/vue';

// Auth flow
track('magic_link_requested', 'auth');
track('login_success', 'auth', { method: 'google' });
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
import { track } from '@webticks/vue';

track<{ method: 'google' | 'email' }>('login_success', 'auth', {
  method: 'google', // TypeScript enforces the union
});
```

### Typed event categories (autocomplete)

Create a `webticks.d.ts` file in your project:

```ts
// src/types/webticks.d.ts
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

```vue
<WebticksAnalytics
  :serverUrl="serverUrl"
  :appId="appId"
  :debug="import.meta.env.DEV"
/>
```

All events and page views will be logged to the browser console in debug mode.

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `serverUrl` | `string` | `/api/track` | URL of your webticks-api endpoint |
| `appId` | `string` | — | Your application ID |
| `debug` | `boolean` | `false` | Log all events to the console |

> [!NOTE]
> `serverUrl` and `appId` are provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) — a self-hosted NestJS + MongoDB backend you can run yourself.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
