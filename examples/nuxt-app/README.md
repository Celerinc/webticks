# Nuxt App with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a Nuxt 3 application using the `@webticks/nuxt` module.

## Features

- Automatic page view tracking
- Session and user ID management
- Event batching to minimize API calls
- Nuxt 3 module integration
- Server-side rendering compatible
- TypeScript support

## Installation

From the monorepo root:

```bash
cd examples/nuxt-app
pnpm install
```

## Environment Variables

No environment variables are required for development. For production, create a `.env` file:

```env
NUXT_PUBLIC_WEBTICKS_BACKEND_URL=https://your-analytics-backend.com/api/track
```

**Note:** Environment variables for client-side use in Nuxt 3 should be prefixed with `NUXT_PUBLIC_`.

## Running the Application

Development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

Build for production:
```bash
pnpm build
pnpm preview
```

## Usage

WebTicks is configured in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@webticks/nuxt']
})
```

That's it! The module automatically:
- Initializes the tracker on app mount
- Tracks page views and route changes
- Manages user sessions
- Batches and sends events

No additional setup required in your components.

## Custom Event Tracking

Track custom events in your components:

```vue
<script setup>
const trackClick = () => {
  if (process.client && window.webticks) {
    window.webticks.trackEvent('button_click', { 
      label: 'cta_button' 
    });
  }
};
</script>

<template>
  <button @click="trackClick">Click Me</button>
</template>
```

## Project Structure

```
├── app.vue           # Main app component
├── nuxt.config.ts    # Nuxt configuration with WebTicks module
└── pages/            # Auto-routed pages
```

## Tech Stack

- Nuxt 3
- Vue 3
- @webticks/nuxt module

## Next Steps

- Configure your analytics backend URL via environment variables
- Add custom event tracking throughout your app
- Leverage Nuxt's automatic routing for page tracking

For more information, see the [@webticks/nuxt](../../packages/nuxt) package documentation.
