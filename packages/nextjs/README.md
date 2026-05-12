# @webticks/next

[![npm version](https://img.shields.io/npm/v/@webticks/next.svg)](https://www.npmjs.com/package/@webticks/next)
[![license](https://img.shields.io/npm/l/@webticks/next.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/next)](https://bundlephobia.com/package/@webticks/next)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)

Next.js integration for WebTicks analytics. Uses `usePathname` for reliable App Router SPA navigation tracking.

---

## Installation

```bash
npm install @webticks/next
```

---

## Setup

### Step 1 — Add the component to your root layout

```tsx
// app/layout.tsx
import WebticksAnalytics from '@webticks/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <WebticksAnalytics
          serverUrl={process.env.NEXT_PUBLIC_WEBTICKS_SERVER_URL}
          appId={process.env.NEXT_PUBLIC_WEBTICKS_APP_ID!}
        />
        {children}
      </body>
    </html>
  );
}
```

Add to your `.env.local`:
```bash
NEXT_PUBLIC_WEBTICKS_SERVER_URL=https://your-api.com/track
NEXT_PUBLIC_WEBTICKS_APP_ID=your-app-id
```

> Variables must be prefixed with `NEXT_PUBLIC_` to be available in the browser.

### Step 2 — Track events anywhere

Import `track` directly — works in both Client and Server Components (no-ops in SSR automatically):

```tsx
'use client';
import { track } from '@webticks/next';

export function SignupButton() {
  return (
    <button onClick={() => track('button_clicked', { label: 'Sign Up' })}>
      Sign Up
    </button>
  );
}
```

### Step 3 — Identify users and handle sessions

```ts
import { identify, reset } from '@webticks/next';

// After login
identify('user-123', { role: 'admin', plan: 'pro' });

// After logout
reset();
```

---

## Common Patterns

```ts
import { track, identify, reset } from '@webticks/next';

// Auth flow
track('magic_link_requested', 'auth');
track('login_success', 'auth', { role: 'expert' });
identify('user-123', { role: 'expert' });

// Form submissions
track('form_submitted', { form: 'onboarding', step: 2 });
track('form_error', { form: 'onboarding', field: 'email' });

// Feature usage
track('filter_applied', { category: 'design', view: 'grid' });
track('profile_viewed', { expertId: 'abc123' });

// Logout
track('logout', 'auth');
reset();
```

---

## TypeScript

### Typed event details

```tsx
import { track } from '@webticks/next';

track<{ role: 'expert' | 'client' | 'reviewer' }>('login_success', 'auth', {
  role: 'expert', // TypeScript enforces the union
});
```

### Typed event categories (autocomplete)

Create a `webticks.d.ts` file in your project:

```ts
// src/types/webticks.d.ts
declare module '@webticks/core' {
  interface WebticksEventTypeMap {
    auth: true;
    application: true;
    profile: true;
    mission: true;
    review: true;
    directory: true;
  }
}

export {};
```

The second argument of `track()` will now autocomplete your defined categories across your entire project.

---

## Locale Stripping

If you use `next-intl` or locale-prefixed routing, strip locale prefixes from tracked paths so `/fr/dashboard` and `/en/dashboard` are recorded as the same page:

```tsx
<WebticksAnalytics
  serverUrl={process.env.NEXT_PUBLIC_WEBTICKS_SERVER_URL}
  appId={process.env.NEXT_PUBLIC_WEBTICKS_APP_ID!}
  stripLocales={['en', 'fr']}
/>
```

---

## Debug Mode

```tsx
<WebticksAnalytics
  serverUrl={process.env.NEXT_PUBLIC_WEBTICKS_SERVER_URL}
  appId={process.env.NEXT_PUBLIC_WEBTICKS_APP_ID!}
  debug={process.env.NODE_ENV === 'development'}
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
| `stripLocales` | `string[]` | `[]` | Locale prefixes to strip from tracked paths |

> [!NOTE]
> `serverUrl` and `appId` are provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) — a self-hosted NestJS + MongoDB backend you can run yourself.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
