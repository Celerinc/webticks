# React Pomodoro Timer with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a React application. The app is a fully-functional Pomodoro timer that tracks all user interactions and timer events.

## 🎯 What You'll Learn

- How to install and configure WebTicks in React
- How to track custom events with metadata
- How to implement comprehensive analytics in a real application
- Best practices for event tracking

## 🚀 Quick Start

### Installation

```bash
cd examples/react-app
pnpm install
pnpm dev
```

Open `http://localhost:5173` to see the Pomodoro timer in action.

## 📦 WebTicks Integration Tutorial

### Step 1: Install WebTicks

```bash
pnpm add @webticks/react
```

### Step 2: Add the Analytics Component

In your main `App.jsx`, import and render the `WebticksAnalytics` component:

```jsx
import WebticksAnalytics from '@webticks/react'

function App() {
  return (
    <>
      <WebticksAnalytics />
      {/* Your app content */}
    </>
  )
}
```

**That's it!** Page views are now automatically tracked.

### Step 3: Track Custom Events

Use `window.webticks.trackEvent()` to track any custom event:

```jsx
const handleButtonClick = () => {
  if (window.webticks) {
    window.webticks.trackEvent('button_click', {
      buttonName: 'start_timer',
      timestamp: new Date().toISOString()
    })
  }
}
```

### Step 4: Add Event Metadata

Include relevant context with every event:

```jsx
const trackEvent = (eventName, metadata = {}) => {
  if (window.webticks) {
    const eventData = {
      ...metadata,
      sessionType: 'work',
      completedPomodoros: 5,
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

All events automatically include:
- `sessionType` - Current session type (work/shortBreak/longBreak)
- `completedPomodoros` - Total Pomodoros completed
- `timestamp` - ISO 8601 timestamp

## 💡 Best Practices

### 1. Always Check for WebTicks Availability

```jsx
if (window.webticks) {
  window.webticks.trackEvent('event_name', metadata)
}
```

### 2. Use Consistent Event Names

Use snake_case for event names: `timer_started`, `button_clicked`, `form_submitted`

### 3. Include Relevant Context

```jsx
trackEvent('timer_paused', {
  timeRemaining: 1200,
  timeElapsed: 300,
  sessionType: 'work'
})
```

### 4. Log Events for Debugging

```jsx
console.log(`✅ WebTicks tracked: ${eventName}`, eventData)
```

### 5. Create Helper Functions

```jsx
const trackEvent = (eventName, metadata = {}) => {
  if (window.webticks) {
    const eventData = {
      ...metadata,
      // Add common metadata
      timestamp: new Date().toISOString()
    }
    window.webticks.trackEvent(eventName, eventData)
  }
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for production:

```env
VITE_WEBTICKS_BACKEND_URL=https://your-analytics-backend.com/api/track
```

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

