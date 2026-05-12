# @webticks/sveltekit

[![npm version](https://img.shields.io/npm/v/@webticks/sveltekit.svg)](https://www.npmjs.com/package/@webticks/sveltekit)
[![license](https://img.shields.io/npm/l/@webticks/sveltekit.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/sveltekit)](https://bundlephobia.com/package/@webticks/sveltekit)
![Svelte](https://img.shields.io/badge/Svelte-FF3E00?logo=svelte&logoColor=white)

SvelteKit integration for WebTicks analytics.

---

## Installation

```bash
npm install @webticks/sveltekit
```

---

## Setup

### Step 1 — Add the component to your root layout

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import WebticksAnalytics from '@webticks/sveltekit';
  import { PUBLIC_WEBTICKS_SERVER_URL, PUBLIC_WEBTICKS_APP_ID } from '$env/static/public';
</script>

<WebticksAnalytics
  serverUrl={PUBLIC_WEBTICKS_SERVER_URL}
  appId={PUBLIC_WEBTICKS_APP_ID}
/>
<slot />
```

Add to your `.env`:

```bash
PUBLIC_WEBTICKS_SERVER_URL=https://your-api.com/track
PUBLIC_WEBTICKS_APP_ID=your-app-id
```

> Variables must be prefixed with `PUBLIC_` to be accessible in the browser via SvelteKit's `$env/static/public`.

### Step 2 — Track events anywhere

Import `track` directly — no wrapper or store needed:

```svelte
<script>
  import { track } from '@webticks/sveltekit';
</script>

<button on:click={() => track('button_clicked', { label: 'Sign Up' })}>
  Sign Up
</button>
```

### Step 3 — Identify users and handle sessions

```js
import { identify, reset } from '@webticks/sveltekit';

// After login
identify('user-123', { role: 'admin', plan: 'pro' });

// After logout
reset();
```

---

## Common Patterns

```js
import { track, identify, reset } from '@webticks/sveltekit';

// Auth flow
track('magic_link_requested', 'auth');
track('login_success', 'auth', { method: 'magic_link' });
identify('user-123', { role: 'admin' });

// Form submissions
track('form_submitted', { form: 'onboarding', step: 1 });
track('form_error', { form: 'onboarding', field: 'email' });

// Feature usage
track('filter_applied', { category: 'design', view: 'grid' });
track('profile_viewed', { profileId: 'abc123' });

// Logout
track('logout', 'auth');
reset();
```

---

## TypeScript

### Typed event details

```ts
import { track } from '@webticks/sveltekit';

track<{ method: 'magic_link' | 'google' }>('login_success', 'auth', {
  method: 'magic_link', // TypeScript enforces the union
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

```svelte
<WebticksAnalytics
  serverUrl={PUBLIC_WEBTICKS_SERVER_URL}
  appId={PUBLIC_WEBTICKS_APP_ID}
  debug={import.meta.env.DEV}
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
