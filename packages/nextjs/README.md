# @webticks/next

[![npm version](https://img.shields.io/npm/v/@webticks/next.svg)](https://www.npmjs.com/package/@webticks/next)
[![license](https://img.shields.io/npm/l/@webticks/next.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/next)](https://bundlephobia.com/package/@webticks/next)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)

Next.js integration for WebTicks analytics.

## Installation

```bash
npm install @webticks/next
```

## Quick Start

### App Router

Add to your root layout with explicit configuration:

```tsx
// app/layout.tsx
import WebticksAnalytics from '@webticks/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebticksAnalytics 
          serverUrl="https://your-api.com/track" 
          appId="your-app-id" 
        />
        {children}
      </body>
    </html>
  );
}
```

## Best Practices: Environment Variables

For security and flexibility, it is **highly recommended** to source your configuration from environment variables rather than hardcoding them. 

In Next.js, make sure to prefix your variables with `NEXT_PUBLIC_` to make them available in the browser.

```tsx
<WebticksAnalytics 
  serverUrl={process.env.NEXT_PUBLIC_WEBTICKS_SERVER_URL} 
  appId={process.env.NEXT_PUBLIC_WEBTICKS_APP_ID} 
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
