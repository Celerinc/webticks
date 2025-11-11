# WebTicks

A lightweight, framework-agnostic analytics tracking library that automatically tracks page views, page changes, and custom events. Events are queued and sent in bulk to minimize backend calls.

## ✨ Features

- 🚀 **Lightweight & Fast** - Minimal overhead, maximum performance
- 📦 **Event Batching** - Reduces API calls by queuing and sending events in bulk
- 🎯 **Auto Page Tracking** - Automatically detects and tracks page changes in SPAs
- 🔧 **Framework Agnostic** - Works with Vanilla JS, React, Vue, Angular, and more
- 🎨 **Easy Integration** - Simple setup for any tech stack
- 🔒 **Privacy Focused** - Session and user ID management built-in
- 🐛 **Debug Mode** - Built-in logging for development

## 📦 Installation

### NPM (Recommended)

```bash
# For Vanilla JS
npm install @webticks/vanilla

# For React/Next.js
npm install @webticks/react

# For Vue
npm install @webticks/vue
```

### CDN

```html
<!-- Vanilla JS -->
<script src="https://cdn.example.com/webticks/vanilla/latest.min.js"></script>

<!-- React -->
<script src="https://cdn.example.com/webticks/react/latest.min.js"></script>
```

## 🚀 Quick Start

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <script src="path/to/tracker.js"></script>
    <script src="path/to/vanilla-injector.js"></script>
</head>
<body>
    <script>
        // Initialize tracker
        const tracker = initAnalytics({
            apiEndpoint: 'https://api.yourdomain.com/analytics',
            flushInterval: 30000,  // Send every 30 seconds
            maxQueueSize: 50,      // Or when 50 events collected
            autoTrackPages: true,  // Auto-track page views
            debug: false
        });

        // Track custom events
        trackEvent('button_clicked', {
            buttonId: 'signup',
            location: 'homepage'
        });

        // Set user ID
        setAnalyticsUserId('user_123');

        // Manual flush
        flushEvents();
    </script>
</body>
</html>
```

### React / Next.js

```jsx
// app/layout.jsx or _app.js
import AnalyticsTracker from '@webticks/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <AnalyticsTracker 
        apiEndpoint="https://api.yourdomain.com/analytics"
        flushInterval={30000}
        maxQueueSize={50}
        autoTrackPages={true}
        debug={false}
      />
      <Component {...pageProps} />
    </>
  );
}
```

```jsx
// Track custom events anywhere in your app
import { trackEvent, setUserId } from '@webticks/react';

function MyComponent() {
  const handleClick = () => {
    trackEvent('button_clicked', {
      component: 'MyComponent',
      action: 'signup'
    });
  };

  return <button onClick={handleClick}>Sign Up</button>;
}
```

### Next.js App Router

```jsx
// app/layout.jsx
import AnalyticsTracker from '@webticks/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsTracker 
          apiEndpoint={process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}
          autoTrackPages={true}
        />
        {children}
      </body>
    </html>
  );
}
```

## 📖 API Reference

### Configuration Options

```javascript
{
  apiEndpoint: string,        // Required: Your analytics API endpoint
  flushInterval: number,      // Default: 30000 (30s)
  maxQueueSize: number,       // Default: 50
  autoTrackPages: boolean,    // Default: true
  autoTrackClicks: boolean,   // Default: false
  debug: boolean,             // Default: false
  sessionTimeout: number      // Default: 1800000 (30 min)
}
```

### Global Functions (Vanilla JS)

```javascript
// Initialize tracker
initAnalytics(config)

// Track custom event
trackEvent(eventName, eventData)

// Track page view manually
trackPageView(path)

// Flush events immediately
flushEvents()

// Set user ID
setAnalyticsUserId(userId)

// Access tracker instance
window.analyticsTracker
```

### React Exports

```javascript
// Component
import AnalyticsTracker from '@webticks/react';

// Helper functions
import { 
  trackEvent, 
  trackPageView, 
  setUserId, 
  flushEvents,
  getTracker 
} from '@webticks/react';
```

## 🎯 Event Types

### Automatic Events

1. **page_view** - Initial page load
2. **page_change** - SPA route changes

### Custom Events

```javascript
trackEvent('event_name', {
  // Your custom data
  product_id: '123',
  price: 99.99,
  category: 'electronics'
});
```

## 🔄 How It Works

### Event Queue System

1. **Collection**: Events are added to an in-memory queue
2. **Batching**: Events are held until one of these conditions:
   - Timer expires (default: 30 seconds)
   - Queue reaches max size (default: 50 events)
   - Manual flush is triggered
   - Page unload is detected
3. **Sending**: All queued events sent in a single API call
4. **Retry**: Failed requests re-queue events for next flush

### Page Change Detection

The tracker monitors:
- `history.pushState()` - Used by React Router, Next.js
- `history.replaceState()` - State replacements
- `popstate` events - Back/forward navigation
- `hashchange` events - Hash-based routing

## 📊 Event Data Structure

Each event sent to your backend includes:

```javascript
{
  type: 'page_view' | 'page_change' | 'custom_event' | 'click',
  timestamp: 1234567890,
  sessionId: 'session_abc123',
  userId: 'user_xyz789',
  userAgent: 'Mozilla/5.0...',
  screenResolution: '1920x1080',
  viewport: '1440x900',
  data: {
    // Event-specific data
    path: '/products',
    url: 'https://example.com/products',
    title: 'Products - My Site',
    // ... custom data
  }
}
```

## 🛠️ Backend Integration

### Expected Endpoint

Your backend should accept POST requests:

```javascript
POST /analytics/events
Content-Type: application/json

{
  "events": [
    {
      "type": "page_view",
      "timestamp": 1234567890,
      "sessionId": "...",
      // ... more event data
    }
  ]
}
```

### Example Backend (Node.js/Express)

```javascript
app.post('/analytics/events', (req, res) => {
  const { events } = req.body;
  
  // Process events (save to database, forward to analytics service, etc.)
  events.forEach(event => {
    console.log(`Event: ${event.type}`, event);
    // Save to database
    // Forward to analytics platform
  });

  res.json({ success: true, count: events.length });
});
```

## 🎨 Framework Examples

See the `/examples` directory for complete implementations:

- `/examples/vanilla-html` - Basic HTML site
- `/examples/react-spa` - React single-page app
- `/examples/nextjs-app` - Next.js application
- `/examples/vue-app` - Vue.js application

## 🧪 Testing

```bash
# Run tests
npm test

# Test specific framework
npm test -- vanilla
npm test -- react
```

## 📦 Building

```bash
# Build all packages
npm run build

# Build specific package
npm run build:vanilla
npm run build:react
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Your Name]

## 🔗 Links

- [Documentation](https://docs.example.com)
- [API Reference](https://docs.example.com/api)
- [GitHub](https://github.com/yourusername/webticks)
- [NPM](https://npmjs.com/package/@webticks/core)

## 💡 Tips

### Reduce API Calls

```javascript
// Increase flush interval for less frequent sends
initAnalytics({
  flushInterval: 60000, // 1 minute
  maxQueueSize: 100     // Larger batches
});
```

### Debug Mode

```javascript
// Enable debug logging during development
initAnalytics({
  debug: true
});
```

### Custom User Identification

```javascript
// After user logs in
setAnalyticsUserId('user_12345');

// Or in React
import { setUserId } from '@webticks/react';
setUserId('user_12345');
```

### Manual Event Flushing

```javascript
// Force immediate send (e.g., before navigation)
flushEvents();

// Or in React
import { flushEvents } from '@webticks/react';
flushEvents();
```

## 🐛 Troubleshooting

### Events Not Sending

1. Check `apiEndpoint` is correct
2. Verify CORS settings on backend
3. Enable `debug: true` to see logs
4. Check browser network tab for failed requests

### Duplicate Events

1. Ensure tracker is only initialized once
2. Check for multiple script includes
3. Verify React component isn't remounting

### Missing Page Changes

1. Ensure `autoTrackPages: true`
2. Check framework routing is using History API
3. Verify tracker is initialized before routing