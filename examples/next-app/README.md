# Next.js Pomodoro Timer with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a Next.js 16 application using the `@webticks/react` package with App Router. The app is a fully-functional Pomodoro timer built with TypeScript that tracks all user interactions and timer events.

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
- **TypeScript** for type safety
- **Tailwind CSS** for styling with dark mode support

### WebTicks Analytics Integration
- Automatic page view tracking with App Router
- Session and user ID management
- Event batching to minimize API calls
- Server-side rendering compatible
- TypeScript support
- Comprehensive event tracking for all user interactions

## Installation

From the monorepo root:

```bash
cd examples/next-app
pnpm install
```

## Environment Variables

No environment variables are required for development. For production, create a `.env.local` file:

```env
NEXT_PUBLIC_WEBTICKS_BACKEND_URL=https://your-analytics-backend.com/api/track
```

**Note:** Environment variables used in client-side code must be prefixed with `NEXT_PUBLIC_` in Next.js.

## Running the Application

Development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

Build for production:
```bash
pnpm build
pnpm start
```

## Usage

WebTicks is integrated in the root layout (`app/layout.tsx`):

```tsx
import WebticksAnalytics from "@webticks/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WebticksAnalytics />
        {children}
      </body>
    </html>
  );
}
```

**Important:** The component must be placed in a Client Component context. Since layouts in Next.js App Router are Server Components by default, we use the `"use client"` directive in the WebTicks package.

## Tracked Events

The Pomodoro timer tracks the following events through WebTicks:

### Timer Events
- **`pomodoro_started`** - Fired when a work session begins
  - Metadata: `duration`, `sessionType`, `completedPomodoros`, `timestamp`
  
- **`pomodoro_completed`** - Fired when a work session completes
  - Metadata: `duration`, `totalCompleted`, `sessionType`, `completedPomodoros`, `timestamp`

- **`break_started`** - Fired when a break begins (short or long)
  - Metadata: `breakType`, `duration`, `sessionType`, `completedPomodoros`, `timestamp`

- **`break_completed`** - Fired when a break completes
  - Metadata: `breakType`, `duration`, `sessionType`, `completedPomodoros`, `timestamp`

### User Interaction Events
- **`timer_paused`** - Fired when user pauses the timer
  - Metadata: `timeRemaining`, `timeElapsed`, `sessionType`, `completedPomodoros`, `timestamp`

- **`timer_resumed`** - Fired when user resumes the timer
  - Metadata: `timeRemaining`, `sessionType`, `completedPomodoros`, `timestamp`

- **`timer_reset`** - Fired when user resets the timer
  - Metadata: `previousTimeLeft`, `resetTo`, `sessionType`, `completedPomodoros`, `timestamp`

- **`settings_changed`** - Fired when user modifies timer durations
  - Metadata: `settingType`, `newValue`, `unit`, `sessionType`, `completedPomodoros`, `timestamp`

- **`settings_toggled`** - Fired when user opens/closes settings panel
  - Metadata: `opened`, `sessionType`, `completedPomodoros`, `timestamp`

### Milestone Events
- **`session_milestone`** - Fired every 4 completed Pomodoros
  - Metadata: `milestone`, `message`, `sessionType`, `completedPomodoros`, `timestamp`

## TypeScript Types

The app uses TypeScript for type safety:

```tsx
type SessionType = 'work' | 'shortBreak' | 'longBreak';

const trackEvent = (eventName: string, metadata: Record<string, any> = {}) => {
  // Track events with type-safe metadata
};
```

## Viewing Tracked Events

Open your browser's developer console to see WebTicks event logs. Each tracked event will appear with the prefix:

```
✅ WebTicks tracked: <event_name>
```

followed by the event metadata.

## Project Structure

```
app/
├── layout.tsx        # Root layout with WebTicks
├── page.tsx          # Pomodoro timer component
├── globals.css       # Global styles
└── favicon.ico       # Favicon
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- @webticks/react

## Next Steps

- Configure your analytics backend URL via environment variables
- Customize timer durations in the settings panel
- Monitor event tracking in the browser console
- Leverage Next.js routing for automatic page tracking
- Explore TypeScript types for custom event metadata

For more information, see the [@webticks/react](../../packages/react) package documentation.

