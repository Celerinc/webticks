# WebTicks

A lightweight, universal analytics tracking library for modern web applications. Automatically tracks page views, page changes, and custom events with built-in event batching to minimize backend calls.

## Supported Frameworks

WebTicks provides official integrations for all major frameworks:

- **[@webticks/angular](./packages/angular)** - Angular components
- **[@webticks/react](./packages/react)** - React hooks and components
- **[@webticks/vue](./packages/vue)** - Vue 3 composables and components
- **[@webticks/next](./packages/nextjs)** - Next.js App Router compatible
- **[@webticks/nuxt](./packages/nuxt)** - Nuxt 3 modules
- **[@webticks/sveltekit](./packages/sveltekit)** - SvelteKit components
- **[@webticks/node](./packages/node)** - Server-side tracking for Node.js/Express
- **[@webticks/core](./packages/core)** - Framework-agnostic core library

## Features

- **Lightweight & Fast** - Minimal overhead, maximum performance
- **Event Batching** - Reduces API calls by queuing and sending events in bulk
- **Auto Page Tracking** - Automatically detects and tracks page changes in SPAs
- **Universal** - Works with any JavaScript framework or vanilla JS
- **Drop-in Integration** - Simple setup with framework-specific components
- **Privacy Focused** - Session and user ID management built-in
- **Server & Client** - Track events on both client and server side
- **Debug Mode** - Built-in logging for development

## Examples

Working example applications demonstrating WebTicks integration:

### Client-Side Examples

- **[Angular](./examples/angular-app)** - Angular application with WebTicks component
- **[React](./examples/react-app)** - React app using WebTicks hooks
- **[Vue](./examples/vue-app)** - Vue 3 app with WebTicks composables
- **[Next.js](./examples/next-app)** - Next.js 16 with App Router integration
- **[Nuxt](./examples/nuxt-app)** - Nuxt 3 module integration
- **[SvelteKit](./examples/sveltekit-app)** - SvelteKit with WebTicks components
- **[Vanilla JS](./examples/vanilla-js)** - Plain JavaScript integration

### Server-Side Examples

- **[Node.js/Express](./examples/node-app)** - Express server with request tracking
- **[NestJS](./examples/nestjs-app)** - NestJS REST API with middleware tracking

Each example includes complete setup instructions and demonstrates best practices for integrating WebTicks into your application.