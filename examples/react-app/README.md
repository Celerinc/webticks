# React Pomodoro Timer with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a React application using the `@webticks/react` package. The app is a fully-functional Pomodoro timer that tracks all user interactions and timer events.

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
- React hooks integration
- Comprehensive event tracking for all user interactions

## Installation

From the monorepo root:

```bash
cd examples/react-app
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

The WebTicks component is integrated in `App.jsx`:

```jsx
import WebticksAnalytics from '@webticks/react'

function App() {
  return (
    <>
      <WebticksAnalytics />
      {/* Your Pomodoro timer app */}
    </>
  )
}
```

WebTicks will automatically:
- Track page views
- Monitor route changes
- Batch and send events
- Manage user sessions

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

## Viewing Tracked Events

Open your browser's developer console to see WebTicks event logs. Each tracked event will appear with the prefix:

```
✅ WebTicks tracked: <event_name>
```

followed by the event metadata.

## Project Structure

```
src/
├── App.jsx           # Pomodoro timer with WebTicks integration
├── App.css           # Pomodoro timer styles
├── main.jsx          # Application entry point
├── index.css         # Global styles
└── assets/           # Static assets
```

## Tech Stack

- React 19
- Vite 7
- @webticks/react

## Next Steps

- Set up your analytics backend URL
- Customize timer durations in the settings panel
- Monitor event tracking in the browser console
- Configure event batching intervals if needed

For more information, see the [@webticks/react](../../packages/react) package documentation.

