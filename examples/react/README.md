# WebTicks React Example

## Installation

```bash
npm install @webticks/react
```

## Usage

```jsx
import React from 'react';
import WebTicksAnalytics from '@webticks/react';

function App() {
  return (
    <div>
      <WebTicksAnalytics />
      <h1>My App</h1>
      {/* Your app content */}
    </div>
  );
}

export default App;
```

That's it! WebTicks will automatically track:
- Page views
- Navigation changes
- Custom events (if you call `window.webticks.trackEvent()`)

## Configuration

The tracker is initialized with default settings. To customize:

```jsx
// Access the global tracker instance
if (window.webticks) {
  window.webticks.trackEvent('custom_event', { data: 'value' });
}
```
