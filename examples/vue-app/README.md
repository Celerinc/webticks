# Vue Pomodoro Timer with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a Vue 3 application using the `@webticks/vue` package. The app is a fully-functional Pomodoro timer built with Vue 3 Composition API that tracks all user interactions and timer events.

## Features

### Pomodoro Timer
- **25-minute work sessions** (customizable)
- **5-minute short breaks** (customizable)
- **15-minute long breaks** after every 4 Pomodoros (customizable)
- **Session counter** tracking completed Pomodoros
- **Pause/Resume** functionality
- **Reset** functionality
- **Audio notifications** when sessions complete
- **Settings panel** to customize timer durations
- **Visual progress bar** showing session progress
- **Color-coded states** (work = red, short break = green, long break = blue)

### WebTicks Analytics Integration
- Automatic page view tracking
- Session and user ID management
- Event batching to minimize API calls
- Vue 3 Composition API integration
- Comprehensive event tracking for all user interactions

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
  <!-- Your Pomodoro timer app -->
</template>
```

WebTicks will automatically:
- Track page views
- Monitor route changes
- Batch and send events
- Manage user sessions

## Tracked Events

The Pomodoro timer tracks 9 event types through WebTicks:

- **`pomodoro_started`** - Work session begins
- **`pomodoro_completed`** - Work session completes
- **`break_started`** - Break begins (short or long)
- **`break_completed`** - Break completes
- **`timer_paused`** - Timer paused
- **`timer_resumed`** - Timer resumed
- **`timer_reset`** - Timer reset
- **`settings_changed`** - Settings modified
- **`session_milestone`** - Every 4 Pomodoros

All events include metadata: `sessionType`, `completedPomodoros`, `timestamp`, and event-specific data.

## Project Structure

```
src/
├── App.vue           # Pomodoro timer with WebTicks integration
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
- Customize timer durations in the settings panel
- Monitor event tracking in the browser console

For more information, see the [@webticks/vue](../../packages/vue) package documentation.

