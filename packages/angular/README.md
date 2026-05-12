# @webticks/angular

[![npm version](https://img.shields.io/npm/v/@webticks/angular.svg)](https://www.npmjs.com/package/@webticks/angular)
[![license](https://img.shields.io/npm/l/@webticks/angular.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/angular)](https://bundlephobia.com/package/@webticks/angular)
![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)

Angular integration for WebTicks analytics.

---

## Installation

```bash
npm install @webticks/angular
```

---

## Setup

### Step 1 — Add the component to your root app

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebticksAnalytics } from '@webticks/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WebticksAnalytics],
  template: `
    <webticks-tracker
      [serverUrl]="serverUrl"
      [appId]="appId"
    />
    <router-outlet />
  `
})
export class AppComponent {
  serverUrl = import.meta.env['WEBTICKS_SERVER_URL'] ?? '/api/track';
  appId = import.meta.env['WEBTICKS_APP_ID'] ?? '';
}
```

Add to your `environment.ts` files:

```typescript
// src/environments/environment.ts
export const environment = {
  webticksServerUrl: 'https://your-api.com/track',
  webticksAppId: 'your-app-id',
};
```

Then reference from your component:

```typescript
import { environment } from '../environments/environment';

export class AppComponent {
  serverUrl = environment.webticksServerUrl;
  appId = environment.webticksAppId;
}
```

### Step 2 — Track events anywhere

Import `track` directly — works in any component, service, or guard:

```typescript
import { track } from '@webticks/angular';

@Component({ ... })
export class SignupComponent {
  onSignup() {
    track('button_clicked', { label: 'Sign Up' });
  }
}
```

### Step 3 — Identify users and handle sessions

```typescript
import { identify, reset } from '@webticks/angular';

// After login
identify('user-123', { role: 'admin', plan: 'pro' });

// After logout
reset();
```

---

## Common Patterns

```typescript
import { track, identify, reset } from '@webticks/angular';

// Auth flow
track('magic_link_requested', 'auth');
track('login_success', 'auth', { role: 'admin' });
identify('user-123', { role: 'admin' });

// Form submissions
track('form_submitted', { form: 'onboarding', step: 2 });
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

```typescript
import { track } from '@webticks/angular';

track<{ role: 'admin' | 'user' }>('login_success', 'auth', {
  role: 'admin', // TypeScript enforces the union
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

```typescript
// app.component.ts
<webticks-tracker
  [serverUrl]="serverUrl"
  [appId]="appId"
  [debug]="!environment.production"
/>
```

All events and page views will be logged to the browser console in debug mode.

---

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `serverUrl` | `string` | `/api/track` | URL of your webticks-api endpoint |
| `appId` | `string` | — | Your application ID |
| `debug` | `boolean` | `false` | Log all events to the console |

> [!NOTE]
> `serverUrl` and `appId` are provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) — a self-hosted NestJS + MongoDB backend you can run yourself.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
