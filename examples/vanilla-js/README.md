# WebTicks Vanilla JS Example

A simple HTML + JavaScript example demonstrating WebTicks integration without any build tools or frameworks.

## Features

- ✅ Pure HTML/JavaScript (no build step required)
- ✅ WebTicks core package integration
- ✅ Automatic page view tracking
- ✅ Custom event tracking
- ✅ Interactive demo buttons
- ✅ Console logging for debugging

## How to Run

### Option 1: Simple HTTP Server (Python)
```bash
cd examples/vanilla-js
python3 -m http.server 8000
# Open http://localhost:8000
```

### Option 2: Node HTTP Server
```bash
cd examples/vanilla-js
npx http-server -p 8000
# Open http://localhost:8000
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## What's Demonstrated

### Automatic Tracking
- **Page Views**: Automatically tracked when the page loads
- **Navigation**: Tracked when using `history.pushState()`

### Custom Events
Three interactive buttons demonstrate custom event tracking:
1. **Track Custom Event** - Manual event with custom data
2. **Navigate to /about** - Tests navigation tracking
3. **Increment Counter** - Tracks counter increments

### Code Structure

```javascript
// 1. Import and initialize WebTicks
import { inject } from '../../packages/core/injector.js';

inject({
    backendUrl: '/api/track',
    debug: true
});

// 2. Track custom events
window.webticks.trackEvent('event_name', { data: 'value' });
```

## Console Output

Open your browser console to see:
- ✅ Initialization messages
- 📊 Tracker status (User ID, backend URL)
- 📄 Page view events
- ✅ Custom event confirmations

## Key Features

- **No Dependencies**: Just HTML and JavaScript
- **Module Import**: Uses ES6 modules to import WebTicks
- **Local Package**: Imports directly from `packages/core`
- **Interactive**: Multiple buttons to test different tracking scenarios
- **Styled**: Clean, modern UI to make testing pleasant

## Notes

- This example imports directly from the local `packages/core` directory
- In production, you would install `@webticks/core` via npm
- The example uses relative imports which work with modern browsers
- All tracking events are logged to the console for easy debugging
