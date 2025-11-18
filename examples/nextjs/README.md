# WebTicks Next.js Example

## Installation

```bash
npm install @webticks/react
```

## Usage

### App Router (Next.js 13+)

Add to your root layout:

```tsx
// app/layout.tsx
import WebTicksAnalytics from '@webticks/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WebTicksAnalytics />
        {children}
      </body>
    </html>
  );
}
```

### Pages Router (Next.js 12 and below)

Add to `_app.tsx`:

```tsx
// pages/_app.tsx
import WebTicksAnalytics from '@webticks/react';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <WebTicksAnalytics />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

## Server-Side Tracking

For API routes or server components, use `@webticks/node`:

```typescript
// app/api/route.ts
import { createServerTracker } from '@webticks/node';

const tracker = createServerTracker({
  backendUrl: process.env.ANALYTICS_URL
});

export async function GET(request: Request) {
  tracker.trackServerRequest({
    method: 'GET',
    path: '/api/test',
    headers: Object.fromEntries(request.headers)
  });
  
  return Response.json({ hello: 'world' });
}
```
