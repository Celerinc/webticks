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

### Frontend (React, Vue, Next.js Client)
```javascript
import { AnalyticsTracker } from '@webticks/core/tracker';

const tracker = new AnalyticsTracker({
  backendUrl: "https://your-api.com/api/track",
  appId: "your-application-id" // Generated from the webticks API
});
```

### Backend (Express, NestJS, Next.js Server)
```javascript
import { createServerTracker } from '@webticks/node';

const tracker = createServerTracker({
  backendUrl: "https://your-api.com/api/track",
  appId: "your-application-id" // Generated from the webticks API
});
```

## 3. Usage & Tracking

### Automatic Tracking
Enable automatic page view tracking in the browser or request tracking in Node.js:

```javascript
// Browser: Tracks URL changes automatically
// Node.js: Tracks incoming requests automatically
tracker.autoTrackPageViews();
```

### Custom Event Tracking
Track custom user interactions manually from either environment:

```javascript
tracker.trackEvent('button_clicked', { 
  buttonId: 'checkout-btn',
  amount: 49.99
});
```

### Backend Middleware (Express Example)
Capture backend request data easily:

```javascript
app.use((req, res, next) => {
  tracker.trackServerRequest({
    method: req.method,
    path: req.url,
    headers: req.headers
  });
  next();
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