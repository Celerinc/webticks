# @webticks/appinsights

[![npm version](https://img.shields.io/npm/v/@webticks/appinsights.svg)](https://www.npmjs.com/package/@webticks/appinsights)
[![license](https://img.shields.io/npm/l/@webticks/appinsights.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
![Azure](https://img.shields.io/badge/Azure-Application_Insights-0078D4?logo=microsoftazure&logoColor=white)

Azure Application Insights destination for WebTicks analytics. No SDK dependency — uses raw `fetch`.

---

## Installation

```bash
npm install @webticks/appinsights
```

---

## Setup

### Step 1 — Get your connection string

In the Azure portal: **App Insights resource → Overview → Connection String**

It looks like:
```
InstrumentationKey=abc123...;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;...
```

### Step 2 — Add to your app

#### Next.js

```tsx
// app/layout.tsx
import WebticksAnalytics from '@webticks/next';
import { AppInsightsDestination } from '@webticks/appinsights';

const destinations = [
  new AppInsightsDestination({
    connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING!,
  }),
];

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebticksAnalytics destinations={destinations} />
        {children}
      </body>
    </html>
  );
}
```

Add to your `.env.local`:
```bash
NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING=InstrumentationKey=...;IngestionEndpoint=...
```

#### React (Vite)

```jsx
// src/App.jsx
import WebticksAnalytics from '@webticks/react';
import { AppInsightsDestination } from '@webticks/appinsights';

const destinations = [
  new AppInsightsDestination({
    connectionString: import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING,
  }),
];

function App() {
  return (
    <>
      <WebticksAnalytics destinations={destinations} />
      {/* rest of app */}
    </>
  );
}
```

---

## Sending to multiple destinations

You can combine App Insights with your webticks-api in the same `destinations` array:

```tsx
import { AppInsightsDestination } from '@webticks/appinsights';
import { WebticksApiDestination } from '@webticks/core';

const destinations = [
  new WebticksApiDestination({
    serverUrl: process.env.NEXT_PUBLIC_WEBTICKS_SERVER_URL,
    appId: process.env.NEXT_PUBLIC_WEBTICKS_APP_ID,
  }),
  new AppInsightsDestination({
    connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING!,
  }),
];

<WebticksAnalytics destinations={destinations} />
```

Events are fanned out to all destinations in parallel. One destination failing never blocks the others.

---

## What gets sent

| Webticks event type | App Insights telemetry | `baseType` |
|---------------------|------------------------|------------|
| `pageview` | Page View | `PageViewData` |
| `custom` | Custom Event | `EventData` |
| `server_request` | Custom Event | `EventData` |

All event properties, `uid`, `sessionId`, `path`, and `eventType` (category) are forwarded as custom properties visible in the App Insights **Logs** blade:

```kusto
customEvents
| where name == "login_success"
| project timestamp, name, customDimensions
```

---

## Props / Constructor options

| Option | Type | Description |
|--------|------|-------------|
| `connectionString` | `string` | Azure App Insights connection string (required) |

> [!NOTE]
> The connection string is safe to expose in browser bundles — it's a write-only ingestion key, not an admin key.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
