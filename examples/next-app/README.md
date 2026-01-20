# Next.js Pomodoro Timer with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a Next.js application with the App Router. The app is a fully-functional Pomodoro timer built with TypeScript.

## 🎯 What You'll Learn

- How to install and configure WebTicks in Next.js App Router
- How to use WebTicks in Client Components
- How to track custom events with TypeScript
- Best practices for analytics in Next.js applications

## 🚀 Quick Start

### Installation

```bash
cd examples/next-app
pnpm install
pnpm dev
```

Open `http://localhost:3000` to see the Pomodoro timer in action.

## 📦 WebTicks Integration Tutorial

### Step 1: Install WebTicks

```bash
pnpm add @webticks/react
```

### Step 2: Add to Root Layout

In `app/layout.tsx`, import and render the `WebticksAnalytics` component:

```tsx
import WebticksAnalytics from '@webticks/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WebticksAnalytics />
        {children}
      </body>
    </html>
  )
}
```

**Important:** Place `WebticksAnalytics` in the root layout to track across all pages.

### Step 3: Use in Client Components

Mark components that track events with `'use client'`:

```tsx
'use client'

import { useState } from 'react'

export default function Page() {
  const handleClick = () => {
    if (window.webticks) {
      window.webticks.trackEvent('button_click', {
        page: 'home',
        timestamp: new Date().toISOString()
      })
    }
  }
  
  return <button onClick={handleClick}>Track Event</button>
}
```

### Step 4: Add TypeScript Types

Extend the Window interface for type safety:

```tsx
declare global {
  interface Window {
    webticks?: {
      trackEvent: (eventName: string, metadata?: Record<string, any>) => void
    }
  }
}
```

### Step 5: Create Tracking Helpers

```tsx
const trackEvent = (eventName: string, metadata: Record<string, any> = {}) => {
  if (window.webticks) {
    const eventData = {
      ...metadata,
      timestamp: new Date().toISOString()
    }
    window.webticks.trackEvent(eventName, eventData)
    console.log(`✅ WebTicks tracked: ${eventName}`, eventData)
  }
}
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
- **Visual progress bar** with Tailwind CSS animations
- **Color-coded states** with Tailwind gradients
- **Dark mode support** out of the box

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

### 1. Use Client Components for Tracking

```tsx
'use client'

export default function TrackedComponent() {
  // Can access window.webticks here
}
```

### 2. Environment Variables

Use `NEXT_PUBLIC_` prefix for client-side variables:

```env
NEXT_PUBLIC_WEBTICKS_BACKEND_URL=https://your-backend.com/api/track
```

### 3. Type Safety with TypeScript

```tsx
type EventMetadata = {
  sessionType: 'work' | 'shortBreak' | 'longBreak'
  completedPomodoros: number
  timestamp: string
}

const trackEvent = (name: string, metadata: EventMetadata) => {
  if (window.webticks) {
    window.webticks.trackEvent(name, metadata)
  }
}
```

### 4. Server vs Client Components

- **Server Components**: Cannot access `window.webticks`
- **Client Components**: Can track events with `'use client'`

### 5. App Router Patterns

```tsx
// app/layout.tsx - Root layout with WebTicks
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebticksAnalytics />
        {children}
      </body>
    </html>
  )
}

// app/page.tsx - Client component for tracking
'use client'
export default function Page() {
  // Track events here
}
```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_WEBTICKS_BACKEND_URL=https://your-analytics-backend.com/api/track
```

### Next.js Config

No special configuration needed! WebTicks works out of the box with:
- App Router
- Server Components
- Client Components
- TypeScript

## 📁 Project Structure

```
app/
├── layout.tsx        # Root layout with WebticksAnalytics
├── page.tsx          # Pomodoro timer (Client Component)
└── globals.css       # Tailwind CSS styles
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
- [Next.js App Router](https://nextjs.org/docs/app)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

## 📝 Example Code

See [`app/page.tsx`](./app/page.tsx) for the complete implementation showing:
- TypeScript types for event metadata
- Client Component with `'use client'`
- Tailwind CSS for styling
- Dark mode support
- Event tracking for all user interactions
