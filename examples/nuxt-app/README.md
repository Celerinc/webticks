# Nuxt Pomodoro Timer with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a Nuxt 3 application with SSR support. The app is a fully-functional Pomodoro timer built with TypeScript and Vue 3 Composition API.

## 🎯 What You'll Learn

- How to install and configure WebTicks in Nuxt 3
- How to handle SSR-safe event tracking
- How to use WebTicks with Vue 3 Composition API in Nuxt
- Best practices for analytics in server-rendered applications

## 🚀 Quick Start

### Installation

```bash
cd examples/nuxt-app
pnpm install
pnpm dev
```

Open `http://localhost:3000` to see the Pomodoro timer in action.

## 📦 WebTicks Integration Tutorial

### Step 1: Install WebTicks

```bash
pnpm add @webticks/vue
```

### Step 2: Add to Root Layout

In `app/app.vue`, import and render the `WebticksAnalytics` component:

```vue
<script setup lang="ts">
import { WebticksAnalytics } from '@webticks/vue'
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <WebticksAnalytics />
    <!-- Your app content -->
  </div>
</template>
```

### Step 3: SSR-Safe Event Tracking

Always check for browser context before tracking:

```vue
<script setup lang="ts">
const trackEvent = (eventName: string, metadata: Record<string, any> = {}) => {
  // Check if we're in the browser
  if (process.client && window.webticks) {
    window.webticks.trackEvent(eventName, metadata)
    console.log(`✅ WebTicks tracked: ${eventName}`, metadata)
  }
}
</script>
```

### Step 4: Use Nuxt Auto-Imports

Nuxt auto-imports Vue composables:

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue' // Auto-imported!

const timeLeft = ref(1500)
const isRunning = ref(false)

const formatTime = computed(() => {
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})
</script>
```

### Step 5: Handle Audio in Browser Only

```vue
<script setup lang="ts">
const playNotification = () => {
  if (!process.client) return // SSR-safe check
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    // ... play audio
  } catch (e) {
    console.log('Audio not available')
  }
}
</script>
```

## 🍅 Pomodoro App Features

This example implements a complete Pomodoro timer with:

- **25-minute work sessions** (customizable)
- **5-minute short breaks** (customizable)
- **15-minute long breaks** after every 4 Pomodoros (customizable)
- **Session counter** tracking completed Pomodoros
- **Pause/Resume** functionality
- **Reset** functionality
- **Audio notifications** (browser-only)
- **Settings panel** to customize timer durations
- **Visual progress bar** with smooth animations
- **Color-coded states** with scoped CSS
- **SSR-compatible** implementation

## 📊 Tracked Events

All 9 event types are tracked (client-side only):

- `pomodoro_started` - Work session begins
- `pomodoro_completed` - Work session completes
- `break_started` - Break begins
- `break_completed` - Break completes
- `timer_paused` - Timer paused
- `timer_resumed` - Timer resumed
- `timer_reset` - Timer reset
- `settings_changed` - Settings modified
- `session_milestone` - Every 4 Pomodoros

## 💡 Best Practices

### 1. Always Use process.client

```vue
<script setup lang="ts">
const trackEvent = (name: string, data: any) => {
  if (process.client && window.webticks) {
    window.webticks.trackEvent(name, data)
  }
}
</script>
```

### 2. TypeScript Types

```vue
<script setup lang="ts">
type SessionType = 'work' | 'shortBreak' | 'longBreak'

const sessionType = ref<SessionType>('work')
</script>
```

### 3. Environment Variables

Use `NUXT_PUBLIC_` prefix for client-side variables:

```env
NUXT_PUBLIC_WEBTICKS_BACKEND_URL=https://your-backend.com/api/track
```

### 4. Reactive State with Refs

```vue
<script setup lang="ts">
import { ref } from 'vue'

const timeLeft = ref(1500)
const isRunning = ref(false)

// Access with .value
timeLeft.value = 1200
</script>
```

### 5. Computed Properties

```vue
<script setup lang="ts">
import { computed } from 'vue'

const progress = computed(() => {
  return ((1500 - timeLeft.value) / 1500) * 100
})
</script>

<template>
  <div :style="{ width: `${progress}%` }"></div>
</template>
```

## 🔧 Configuration

### Environment Variables

Create `.env`:

```env
NUXT_PUBLIC_WEBTICKS_BACKEND_URL=https://your-analytics-backend.com/api/track
```

### Nuxt Config

No special configuration needed! WebTicks works with:
- SSR (Server-Side Rendering)
- CSR (Client-Side Rendering)
- Auto-imports
- TypeScript

## 📁 Project Structure

```
app/
└── app.vue           # Main app with Pomodoro timer
```

## 🎨 Viewing Tracked Events

Open your browser's Developer Console:

```
✅ WebTicks tracked: pomodoro_started {
  duration: 1500,
  sessionType: "work",
  completedPomodoros: 0,
  timestamp: "2025-12-04T15:30:00.000Z"
}
```

## 🔗 Learn More

- [WebTicks Core Documentation](../../packages/core)
- [Nuxt 3 Documentation](https://nuxt.com)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

## 📝 Example Code

See [`app/app.vue`](./app/app.vue) for the complete implementation showing:
- SSR-safe WebTicks integration
- TypeScript types for type safety
- Vue 3 Composition API patterns
- Scoped CSS with color-coded states
- Browser-only audio notifications
