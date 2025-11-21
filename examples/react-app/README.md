# React App with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a React application using the `@webticks/react` package.

## Features

- Automatic page view tracking
- Session and user ID management
- Event batching to minimize API calls
- React hooks integration
- Custom event tracking

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
      <h1>React + WebTicks</h1>
      {/* Your app content */}
    </>
  )
}
```

WebTicks will automatically:
- Track page views
- Monitor route changes
- Batch and send events
- Manage user sessions

## Custom Event Tracking

Track custom events in your components:

```jsx
const handleClick = () => {
  if (window.webticks) {
    window.webticks.trackEvent('button_click', { 
      count: count + 1 
    });
  }
  setCount(count + 1);
};
```

## Project Structure

```
src/
├── App.jsx           # Main app with WebTicks integration
├── main.jsx          # Application entry point
└── assets/           # Static assets
```

## Tech Stack

- React 19
- Vite 7
- @webticks/react

## Next Steps

- Set up your analytics backend URL
- Add custom event tracking for user interactions
- Configure event batching intervals if needed

For more information, see the [@webticks/react](../../packages/react) package documentation.
