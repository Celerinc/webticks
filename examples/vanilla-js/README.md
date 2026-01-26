# Vanilla JS Pomodoro Timer with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a vanilla JavaScript application **without any framework**. The app is a fully-functional Pomodoro timer in a single HTML file.

## 🎯 What You'll Learn

- How to use WebTicks with vanilla JavaScript (no framework needed!)
- How to track events in a plain HTML/JS application
- How to implement analytics without build tools
- Best practices for event tracking in vanilla JS

## 🚀 Quick Start

Simply open `index.html` in your browser or use a local server:

```bash
cd examples/vanilla-js
python3 -m http.server 8000
# Or use any other local server
```

Open `http://localhost:8000` to see the Pomodoro timer.

## 📦 WebTicks Integration Tutorial

### Step 1: Import WebTicks Core

Add the WebTicks injector script to your HTML:

```html
<script type="module">
  import inject from '@webticks/core';
  
  inject({
    serverUrl: '/api/track',
    debug: true
  });
  
  console.log('✅ WebTicks initialized');
</script>
```

**That's it!** WebTicks is now active and tracking page views.

### Step 2: Track Custom Events

Use `window.webticks.trackEvent()` anywhere in your JavaScript:

```html
<script>
  function handleButtonClick() {
    if (window.webticks) {
      window.webticks.trackEvent('button_click', {
        buttonName: 'start_timer',
        timestamp: new Date().toISOString()
      });
    }
  }
</script>
```

### Step 3: Add Event Listeners

Track user interactions with standard DOM events:

```javascript
document.getElementById('startBtn').addEventListener('click', () => {
  if (window.webticks) {
    window.webticks.trackEvent('timer_started', {
      duration: 1500,
      sessionType: 'work'
    });
  }
});
```

### Step 4: Track State Changes

Monitor application state and log changes:

```javascript
let timeLeft = 1500;
let isRunning = false;

function startTimer() {
  isRunning = true;
  
  if (window.webticks) {
    window.webticks.trackEvent('timer_started', {
      timeRemaining: timeLeft,
      timestamp: new Date().toISOString()
    });
  }
  
  intervalId = setInterval(tick, 1000);
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
- **Audio notifications** using Web Audio API
- **Settings panel** to customize timer durations
- **Visual progress bar** with smooth animations
- **Color-coded states** with CSS gradients

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

### 1. Always Check for WebTicks

```javascript
if (window.webticks) {
  window.webticks.trackEvent('event_name', metadata);
}
```

### 2. Use Helper Functions

```javascript
function trackEvent(eventName, metadata = {}) {
  if (window.webticks) {
    const eventData = {
      ...metadata,
      timestamp: new Date().toISOString()
    };
    window.webticks.trackEvent(eventName, eventData);
    console.log(`✅ WebTicks tracked: ${eventName}`, eventData);
  }
}
```

### 3. Track DOM Updates

```javascript
function updateUI() {
  document.getElementById('timer').textContent = formatTime(timeLeft);
  document.getElementById('progress').style.width = `${progress}%`;
}
```

### 4. Use Web Audio API for Notifications

```javascript
function playNotification() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  // ... configure and play
}
```

## 🔧 Configuration

The WebTicks injector accepts these options:

```javascript
inject({
  serverUrl: '/api/track',  // Your analytics endpoint
  debug: true                 // Enable console logging
});
```

## 📁 Project Structure

```
vanilla-js/
├── index.html        # Complete Pomodoro app with inline CSS/JS
├── README.md         # This file
└── public/           # Static assets
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
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [DOM Events](https://developer.mozilla.org/en-US/docs/Web/Events)

## 📝 Key Takeaways

- **No build tools required** - Just HTML, CSS, and JavaScript
- **No framework needed** - WebTicks works with vanilla JS
- **Simple integration** - One script import, ready to track
- **Full functionality** - All features work without a framework

See [`index.html`](./index.html) for the complete single-file implementation!
