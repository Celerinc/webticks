# Vue App with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a Vue 3 application using the `@webticks/vue` package.

## Features

- Automatic page view tracking
- Session and user ID management
- Event batching to minimize API calls
- Vue 3 Composition API integration
- Custom event tracking

## Installation

From the monorepo root:

```bash
cd examples/vue-app
pnpm install
```

## Environment Variables

No environment variables are required for development. The tracker is configured to send events to a local endpoint by default.

For production, create a `.env` file:

```env
VITE_WEBTICKS_BACKEND_URL=https://your-analytics-backend.com/api/track
```

## Running the Application

Development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

Build for production:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

## Usage

The WebTicks component is integrated in `App.vue`:

```vue
<script setup>
import { WebticksAnalytics } from '@webticks/vue'
</script>

<template>
  <WebticksAnalytics />
  <h1>Vue + WebTicks</h1>
  <!-- Your app content -->
</template>
```

WebTicks will automatically:
- Track page views
- Monitor route changes
- Batch and send events
- Manage user sessions

## Custom Event Tracking

Track custom events in your components:

```vue
<script setup>
const handleClick = () => {
  if (window.webticks) {
    window.webticks.trackEvent('button_click', { 
      action: 'signup' 
    });
  }
};
</script>
```

## Project Structure

```
src/
├── App.vue           # Main app with WebTicks integration
├── main.js           # Application entry point
├── components/       # Vue components
└── assets/           # Static assets
```

## Tech Stack

- Vue 3.5
- Vite 7
- @webticks/vue

## Next Steps

- Set up your analytics backend URL
- Add custom event tracking for user interactions
- Use Vue Router for automatic route tracking

For more information, see the [@webticks/vue](../../packages/vue) package documentation.
