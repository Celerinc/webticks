# WebTicks Analytics

WebTicks is a powerful, lightweight analytics library designed for modern web applications. It provides seamless event tracking and page view monitoring with built-in batching and platform adapters for both browser and server environments.

## 1. Installation

### Browser (Frontend)
```bash
npm install @webticks/core
# or
pnpm add @webticks/core
# or
bun add @webticks/core
```

### Node.js (Backend)
```bash
npm install @webticks/node
# or
pnpm add @webticks/node
# or
bun add @webticks/node
```

## 2. Initialization

> **Note:** Initialization differs depending on your framework. See the framework-specific packages for detailed setup instructions:
> - **React**: [@webticks/react](./packages/react/README.md)
> - **Vue**: [@webticks/vue](./packages/vue/README.md)
> - **Angular**: [@webticks/angular](./packages/angular/README.md)
> - **Next.js**: [@webticks/next](./packages/nextjs/README.md)
> - **SvelteKit**: [@webticks/sveltekit](./packages/sveltekit/README.md)
> - **Nuxt**: [@webticks/nuxt](./packages/nuxt/README.md)
> - **Node.js**: [@webticks/node](./packages/node/README.md)
> - **Core (Vanilla JS)**: [@webticks/core](./packages/core/README.md)

## 3. Usage & Tracking

### Frontend Auto-Tracking
Automatic page view tracking is enabled by default when using framework-specific packages (React, Vue, Angular, Next.js, SvelteKit, Nuxt).

> **Note:** Both vanilla JS and framework packages handle this automatically in the background. No need for any setup after initialization. 

This is done when calling the inject function from the core package which is also called in all framework-specific packages.

### Backend Auto-Tracking
For backend environments, use the built-in middleware helper to automatically capture incoming requests:

```javascript
// Express example
app.use(tracker.middleware());
```

> [!TIP]
> The middleware automatically detects when you call `tracker.trackEvent()` in a route and skips auto-tracking for that request to prevent double-tracking.

> **Note:** Backend tracking requires middleware integration to mimic the auto-tracking behavior available in frontend environments.

### Manual Event Tracking
Track custom events from any environment:

```javascript
tracker.trackEvent('button_clicked', { 
  buttonId: 'checkout-btn',
  amount: 49.99
});
```

## 4. Cleanup

When the application or component is unmounting, clean up the tracker:

```javascript
tracker.destroy();
```

## Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `backendUrl` | `string` | The endpoint where analytics data will be sent. |
| `appId` | `string` | Your unique application identifier for validation. |

---

Made with ❤️ by the WebTicks Team.