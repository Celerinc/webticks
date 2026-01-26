# @webticks/react

[![npm version](https://img.shields.io/npm/v/@webticks/react.svg)](https://www.npmjs.com/package/@webticks/react)
[![license](https://img.shields.io/npm/l/@webticks/react.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/react)](https://bundlephobia.com/package/@webticks/react)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)

React integration for WebTicks analytics.

## Installation

```bash
npm install @webticks/react
```

## Quick Start

Add the component to your app's root with explicit configuration:

```jsx
import WebticksAnalytics from '@webticks/react';

function App() {
  return (
    <>
      <WebticksAnalytics 
        serverUrl="https://your-api.com/track" 
        appId="your-app-id" 
      />
      {/* Your app */}
    </>
  );
}
```

## Best Practices: Environment Variables

For security and flexibility, it is **highly recommended** to source your configuration from environment variables rather than hardcoding them in your source code.

```jsx
// Example using Vite
<WebticksAnalytics 
  serverUrl={import.meta.env.VITE_WEBTICKS_SERVER_URL} 
  appId={import.meta.env.VITE_WEBTICKS_APP_ID} 
/>

// Example using Create React App
<WebticksAnalytics 
  serverUrl={process.env.REACT_APP_WEBTICKS_SERVER_URL} 
  appId={process.env.REACT_APP_WEBTICKS_APP_ID} 
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `serverUrl` | `string` | Recommended. URL to send analytics. Defaults to `/api/track`. |
| `appId` | `string` | Required. Your application ID. |
| `debug` | `boolean` | Optional. Enable console logging. Defaults to `false`. |

> [!NOTE]
> `appId` and `serverUrl` are typically provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) project, which you can self-host. Alternatively, you can use any backend that implements the WebTicks ingestion API.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
