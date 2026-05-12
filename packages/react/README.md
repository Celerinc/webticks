# @webticks/react

[![npm version](https://img.shields.io/npm/v/@webticks/react.svg)](https://www.npmjs.com/package/@webticks/react)
[![license](https://img.shields.io/npm/l/@webticks/react.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/react)](https://bundlephobia.com/package/@webticks/react)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)

React integration for WebTicks analytics.

> **Using Next.js?** Use [`@webticks/next`](https://www.npmjs.com/package/@webticks/next) instead — it handles App Router navigation tracking automatically.

---

## Installation

```bash
npm install @webticks/react
```

---

## Setup

### Step 1 — Add the component to your app root

```jsx
// src/main.jsx or App.jsx
import WebticksAnalytics from '@webticks/react';

function App() {
  return (
    <>
      <WebticksAnalytics
        serverUrl={import.meta.env.VITE_WEBTICKS_SERVER_URL}
        appId={import.meta.env.VITE_WEBTICKS_APP_ID}
      />
      {/* rest of your app */}
    </>
  );
}
```

Add to your `.env`:
```bash
VITE_WEBTICKS_SERVER_URL=https://your-api.com/track
VITE_WEBTICKS_APP_ID=your-app-id
```

### Step 2 — Track events anywhere

Import `track` directly — no hook, no context, no wrapper needed:

```jsx
import { track } from '@webticks/react';

function SignupButton() {
  return (
    <button onClick={() => track('button_clicked', { label: 'Sign Up' })}>
      Sign Up
    </button>
  );
}
```

### Step 3 — Identify users and handle sessions

```js
import { identify, reset } from '@webticks/react';

// After login
identify('user-123', { plan: 'pro' });

// After logout
reset();
```

---

## Common Patterns

```js
import { track, identify, reset } from '@webticks/react';

// Auth
track('login_success', 'auth', { method: 'google' });
identify('user-123', { role: 'admin' });

// Forms
track('form_submitted', { form: 'signup', step: 1 });
track('form_error', { form: 'signup', field: 'email' });

// Navigation
track('tab_changed', { from: 'overview', to: 'settings' });

// Logout
track('logout', 'auth');
reset();
```

---

## TypeScript

### Typed event details

```tsx
import { track } from '@webticks/react';

track<{ label: string; location: string }>('button_clicked', {
  label: 'Upgrade',
  location: 'navbar',
});
```

### Typed event categories (autocomplete)

Create a `webticks.d.ts` file in your project:

```ts
// webticks.d.ts
declare module '@webticks/core' {
  interface WebticksEventTypeMap {
    auth: true;
    commerce: true;
    ui: true;
  }
}

export {};
```

The second argument of `track()` will now autocomplete your categories.

---

## Debug Mode

```jsx
<WebticksAnalytics
  serverUrl={import.meta.env.VITE_WEBTICKS_SERVER_URL}
  appId={import.meta.env.VITE_WEBTICKS_APP_ID}
  debug={import.meta.env.DEV}
/>
```

All events will be logged to the browser console in debug mode.

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
