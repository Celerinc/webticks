# SvelteKit Pomodoro Timer with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a SvelteKit application. The app is a fully-functional Pomodoro timer built with Svelte's reactive stores and TypeScript.

## 🎯 What You'll Learn

- How to install and configure WebTicks in SvelteKit
- How to use WebTicks with Svelte's reactive declarations
- How to handle browser-only code in SvelteKit
- Best practices for analytics in Svelte applications

## 🚀 Quick Start

### Installation

```bash
cd examples/sveltekit-app
pnpm install
pnpm dev
```

Open `http://localhost:5173` to see the Pomodoro timer in action.

## 📦 WebTicks Integration Tutorial

### Step 1: Install WebTicks

```bash
pnpm add @webticks/svelte
```

### Step 2: Add to Root Layout

In `src/routes/+layout.svelte`, import and render the `WebticksAnalytics` component:

```svelte
<script lang="ts">
  import { WebticksAnalytics } from '@webticks/svelte'
</script>

<WebticksAnalytics />
<slot />
```

### Step 3: Browser-Safe Event Tracking

Use `browser` from `$app/environment`:

```svelte
<script lang="ts">
  import { browser } from '$app/environment'
  
  function trackEvent(eventName: string, metadata: Record<string, any> = {}) {
    if (browser && (window as any).webticks) {
      (window as any).webticks.trackEvent(eventName, metadata)
      console.log(`✅ WebTicks tracked: ${eventName}`, metadata)
    }
  }
</script>
```

### Step 4: Use Reactive Declarations

Svelte's `$:` syntax makes reactive state simple:

```svelte
<script lang="ts">
  let timeLeft = 1500
  let sessionType: 'work' | 'shortBreak' | 'longBreak' = 'work'
  
  // Reactive computed value
  $: formatTime = (() => {
    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  })()
  
  // Reactive class binding
  $: timerCardClass = `timer-card ${sessionType}`
</script>

<div class={timerCardClass}>
  <div class="timer-display">{formatTime}</div>
</div>
```

### Step 5: Lifecycle Hooks

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  
  let intervalId: ReturnType<typeof setInterval> | null = null
  
  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })
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
- **Color-coded states** with scoped styles
- **Reactive UI** with Svelte's `$:` syntax

## 📊 Tracked Events

All 9 event types are tracked:

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

### 1. Use browser from $app/environment

```svelte
<script lang="ts">
  import { browser } from '$app/environment'
  
  if (browser) {
    // Browser-only code
  }
</script>
```

### 2. Reactive Declarations

```svelte
<script lang="ts">
  let count = 0
  
  // Automatically updates when count changes
  $: doubled = count * 2
  $: console.log(`Count is ${count}`)
</script>
```

### 3. Event Handlers

```svelte
<script lang="ts">
  function handleClick() {
    trackEvent('button_click', { timestamp: new Date().toISOString() })
  }
</script>

<button on:click={handleClick}>Click Me</button>
```

### 4. Conditional Rendering

```svelte
<script lang="ts">
  let showSettings = false
</script>

{#if showSettings}
  <div class="settings-panel">
    <!-- Settings content -->
  </div>
{/if}
```

### 5. Style Binding

```svelte
<script lang="ts">
  let progress = 50
</script>

<div class="progress-fill" style="width: {progress}%"></div>
```

## 🔧 Configuration

### Environment Variables

Create `.env`:

```env
PUBLIC_WEBTICKS_BACKEND_URL=https://your-analytics-backend.com/api/track
```

Note: Use `PUBLIC_` prefix for client-side variables in SvelteKit.

## 📁 Project Structure

```
src/
├── routes/
│   ├── +layout.svelte    # Root layout with WebticksAnalytics
│   └── +page.svelte      # Pomodoro timer
└── app.html              # HTML template
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
- [SvelteKit Documentation](https://kit.svelte.dev)
- [Svelte Tutorial](https://svelte.dev/tutorial)

## 📝 Example Code

See [`src/routes/+page.svelte`](./src/routes/+page.svelte) for the complete implementation showing:
- Svelte's reactive declarations (`$:`)
- Browser-safe code with `browser` check
- TypeScript types for type safety
- Scoped styles with color-coded states
- Event tracking for all user interactions
