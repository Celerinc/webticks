# Vanilla JavaScript with WebTicks Analytics

The simplest possible example of integrating WebTicks analytics using plain HTML and JavaScript.

## Features

- Pure JavaScript (no framework)
- Automatic page view tracking
- Custom event tracking
- Just one HTML file

## Installation

From the monorepo root:

```bash
cd examples/vanilla-js
pnpm install
```

## Running the Example

Open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node
npx http-server . -p 8000

# Or just open the file
open index.html
```

Then visit `http://localhost:8000`

## How It Works

The entire integration is in `index.html`:

```html
<!-- Initialize WebTicks -->
<script type="module">
  import { inject } from '@webticks/core/injector';

  inject({
    backendUrl: '/api/track',
    debug: true
  });
</script>

<!-- Track custom events -->
<script>
  function trackCustomEvent() {
    window.webticks.trackEvent('button_click', { 
      button: 'custom_event' 
    });
  }
</script>
```

That's it! WebTicks will automatically track:
- Initial page view
- Custom events via `window.webticks.trackEvent()`

## What You'll See

Open the browser console to see:
- ✅ WebTicks initialization message
- 📊 Tracked page views
- 🔵 Custom event tracking

## Customization

Change the backend URL for production:

```javascript
inject({
  backendUrl: 'https://your-analytics-backend.com/api/track'
});
```

## Next Steps

- Point `backendUrl` to your analytics server
- Add more custom event tracking
- Use in your own vanilla JS projects

For more information, see the [@webticks/core](../../packages/core) package documentation.
