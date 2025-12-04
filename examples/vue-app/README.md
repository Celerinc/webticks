# Vue Pomodoro Timer with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a Vue 3 application. The app is a fully-functional Pomodoro timer that tracks all user interactions and timer events.

## 🎯 What You'll Learn

- How to install and configure WebTicks in Vue 3
- How to track custom events with the Composition API
- How to implement comprehensive analytics in a real application
- Best practices for event tracking in Vue

## 🚀 Quick Start

### Installation

```bash
cd examples/vue-app
pnpm install
pnpm dev
```

Open `http://localhost:5173` to see the Pomodoro timer in action.

## 📦 WebTicks Integration Tutorial

### Step 1: Install WebTicks

```bash
pnpm add @webticks/vue
```

### Step 2: Add the Analytics Component

In your main `App.vue`, import and render the `WebticksAnalytics` component:

```vue
<script setup>
import { WebticksAnalytics } from '@webticks/vue'
</script>

<template>
  <WebticksAnalytics />
  <!-- Your app content -->
</template>
```

**That's it!** Page views are now automatically tracked.

### Step 3: Track Custom Events

Use `window.webticks.trackEvent()` to track any custom event:

```vue
<script setup>
const handleButtonClick = () => {
  if (window.webticks) {
    window.webticks.trackEvent('button_click', {
      buttonName: 'start_timer',
      timestamp: new Date().toISOString()
    })
  }
}
</script>
```

### Step 4: Create a Tracking Helper

Use Vue's Composition API to create reusable tracking logic:

```vue
<script setup>
import { ref } from 'vue'

const sessionType = ref('work')
const completedPomodoros = ref(0)

const trackEvent = (eventName, metadata = {}) => {
  if (window.webticks) {
    const eventData = {
      ...metadata,
      sessionType: sessionType.value,
      completedPomodoros: completedPomodoros.value,
      timestamp: new Date().toISOString()
    }
    window.webticks.trackEvent(eventName, eventData)
    console.log(`✅ WebTicks tracked: ${eventName}`, eventData)
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
- **Audio notifications** when sessions complete
- **Settings panel** to customize timer durations
- **Visual progress bar** showing session progress
- **Color-coded states** (work = red, short break = green, long break = blue)

## 📊 Tracked Events

The Pomodoro timer tracks 9 event types:

| Event Name | When It Fires | Metadata Included |
|------------|---------------|-------------------|
| `pomodoro_started` | Work session begins | `duration`, `sessionType`, `completedPomodoros` |
| `pomodoro_completed` | Work session completes | `duration`, `totalCompleted` |
| `break_started` | Break begins | `breakType` (short/long), `duration` |
| `break_completed` | Break completes | `breakType`, `duration` |
| `timer_paused` | User pauses timer | `timeRemaining`, `timeElapsed` |
| `timer_resumed` | User resumes timer | `timeRemaining` |
| `timer_reset` | User resets timer | `previousTimeLeft`, `resetTo` |
| `settings_changed` | User modifies settings | `settingType`, `newValue`, `unit` |
| `session_milestone` | Every 4 Pomodoros | `milestone`, `message` |

## 💡 Best Practices

### 1. Use Reactive Refs for State

```vue
<script setup>
import { ref } from 'vue'

const timeLeft = ref(1500)
const isRunning = ref(false)
</script>
```

### 2. Track Events in Methods

```vue
<script setup>
const handleStartPause = () => {
  if (isRunning.value) {
    trackEvent('timer_paused', {
      timeRemaining: timeLeft.value
    })
  } else {
    trackEvent('timer_resumed', {
      timeRemaining: timeLeft.value
    })
  }
  isRunning.value = !isRunning.value
}
</script>
```

### 3. Use Computed Properties for Derived State

```vue
<script setup>
import { computed } from 'vue'

const formatTime = computed(() => {
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})
</script>
```

### 4. Clean Up on Unmount

```vue
<script setup>
import { onUnmounted } from 'vue'

let intervalId = null

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for production:

```env
VITE_WEBTICKS_BACKEND_URL=https://your-analytics-backend.com/api/track
```

For development, the tracker uses a local endpoint by default.

## 📁 Project Structure

```
src/
├── App.vue           # Pomodoro timer with WebTicks integration
├── main.js           # Application entry point
├── components/       # Vue components
└── assets/           # Static assets
```

## 🎨 Viewing Tracked Events

Open your browser's Developer Console to see tracked events:

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
- [Vue Package Documentation](../../packages/vue)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

## 📝 Example Code

See [`App.vue`](./src/App.vue) for the complete implementation showing:
- Vue 3 Composition API with `ref`, `computed`, and lifecycle hooks
- Event tracking for all user interactions
- Audio notifications using Web Audio API
- Scoped CSS with color-coded states
