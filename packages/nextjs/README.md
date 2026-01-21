# @webticks/next

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
          backendUrl="https://your-api.com/track" 
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
  backendUrl={process.env.NEXT_PUBLIC_WEBTICKS_BACKEND_URL} 
  appId={process.env.NEXT_PUBLIC_WEBTICKS_APP_ID} 
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `backendUrl` | `string` | Recommended. URL to send analytics. Defaults to `/api/track`. |
| `appId` | `string` | Required. Your application ID. |

> [!NOTE]
> `appId` and `backendUrl` are typically provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) project, which you can self-host. Alternatively, you can use any backend that implements the WebTicks ingestion API.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
