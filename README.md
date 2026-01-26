<div align="center">
  <h1>WebTicks Analytics</h1>
  <p>
    <a href="https://www.npmjs.com/package/@webticks/core"><img src="https://img.shields.io/npm/v/@webticks/core?style=flat-square" alt="NPM Version"></a>
    <a href="https://github.com/celerinc/webticks/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@webticks/core?style=flat-square" alt="License"></a>
    <a href="https://www.npmjs.com/package/@webticks/core"><img src="https://img.shields.io/npm/dm/@webticks/core?style=flat-square" alt="Downloads"></a>
  </p>
  <p>A powerful, lightweight analytics library for modern web applications.</p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Frontend Integration](#frontend-integration)
- [Backend Integration](#backend-integration)
- [Common API](#common-api)
- [Configuration](#configuration-options)

---

## Overview

WebTicks is a tool that helps you understand how people use your application. It tracks page views and custom events (like button clicks) automatically or manually. It is designed to be very small so it does not slow down your site, and it works on both the client-side (browsers) and server-side (Node.js).

## Quick Start

**Which version do you need?**

- **I am building a website or frontend app** (using React, Vue, Next.js, etc.) -> Read the **[Frontend Integration](#frontend-integration)** section.
- **I am building a backend API or server** (using Node.js, Express, etc.) -> Read the **[Backend Integration](#backend-integration)** section.

---

## Frontend Integration

This section is for code that runs in a web browser.

### 1. Installation

Run one of the following commands in your terminal:

```bash
npm install @webticks/core
# or
pnpm add @webticks/core
# or
bun add @webticks/core
```

### 2. Setup for your Framework

The setup is slightly different depending on which tool you use. Click the link for your framework to see specific instructions:

- **React**: [@webticks/react](./packages/react/README.md)
- **Next.js**: [@webticks/next](./packages/nextjs/README.md)
- **Vue**: [@webticks/vue](./packages/vue/README.md)
- **Nuxt**: [@webticks/nuxt](./packages/nuxt/README.md)
- **SvelteKit**: [@webticks/sveltekit](./packages/sveltekit/README.md)
- **Angular**: [@webticks/angular](./packages/angular/README.md)
- **Vanilla JS**: [@webticks/core](./packages/core/README.md)

### 3. Automatic Tracking

Once you install the package for your framework, WebTicks will automatically track when users visit different pages. You do not need to write any extra code to enable this.

---

## Backend Integration

This section is for code that runs on a Node.js server.

### 1. Installation

Run one of the following commands in your terminal:

```bash
npm install @webticks/node
# or
pnpm add @webticks/node
# or
bun add @webticks/node
```

### 2. Middleware Setup

On the server, efficient tracking is done using "middleware". This sits in your application and automatically logs requests as they come in.

```javascript
// Example using Express
import { WebTicks } from '@webticks/node';

const tracker = new WebTicks({
  apiKey: "YOUR_API_KEY",
  host: "YOUR_API_HOST"
});

app.use(tracker.middleware());
```

> **Tip:** The middleware is smart. If you manually track an event inside a specific API route, the middleware will know not to double-count that request.

---

## Common API

These features work the same way in both Frontend and Backend environments.

### Manual Event Tracking

Sometimes you want to track specific user actions, like "User clicked checkout" or "Item purchased". You can use `trackEvent` for this.

```javascript
tracker.trackEvent('purchase_completed', { 
  itemId: 'item_123',
  amount: 49.99,
  currency: 'USD'
});
```

### Configuration Options

You can configure WebTicks with the following options:

| Option | Type | Description |
|--------|------|-------------|
| `serverUrl` | `string` | The URL where the data should be sent. |
| `appId` | `string` | A unique ID for your application. |

### Cleanup

If you need to completely stop the tracker (usually for testing purposes), you can use the destroy method:

```javascript
tracker.destroy();
```

---

<center>Made with ❤️ by the WebTicks Team @ <a href="https://celerinc.com">Celerinc</a></center>