# @webticks/appinsights

[![npm version](https://img.shields.io/npm/v/@webticks/appinsights.svg)](https://www.npmjs.com/package/@webticks/appinsights)
[![license](https://img.shields.io/npm/l/@webticks/appinsights.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
![Azure](https://img.shields.io/badge/Azure-Application_Insights-0078D4?logo=microsoftazure&logoColor=white)

Azure Application Insights destination for WebTicks analytics.

**No Azure SDK required.** This package uses raw `fetch` to talk directly to the App Insights ingestion endpoint. Installing `@webticks/appinsights` is all you need — `@microsoft/applicationinsights-web` is not installed, not bundled, and not needed.

---

## Installation

```bash
npm install @webticks/appinsights
```

No other packages needed. Zero additional dependencies.

---

## Setup

### Step 1 — Get your connection string

In the Azure portal: **App Insights resource → Overview → Connection String**

It looks like:
```
InstrumentationKey=abc123...;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;...
```

### Step 2 — Add to your app

The `destinations` prop accepts **a single destination** (exclusive) or **an array** (fan-out).

#### App Insights only (exclusive)

Pass a single instance — all events go only to App Insights:

```tsx
// app/layout.tsx
import WebticksAnalytics from '@webticks/next';
import { AppInsightsDestination } from '@webticks/appinsights';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebticksAnalytics
          destinations={new AppInsightsDestination({
            connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING!,
          })}
        />
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

#### App Insights + webticks-api (fan-out)

Pass an array — events are sent to all destinations in parallel.
One failing never blocks the others:

```tsx
import WebticksAnalytics from '@webticks/next';
import { WebticksApiDestination } from '@webticks/core';
import { AppInsightsDestination } from '@webticks/appinsights';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebticksAnalytics
          destinations={[
            new WebticksApiDestination({
              serverUrl: process.env.NEXT_PUBLIC_WEBTICKS_SERVER_URL,
              appId: process.env.NEXT_PUBLIC_WEBTICKS_APP_ID,
            }),
            new AppInsightsDestination({
              connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING!,
            }),
          ]}
        />
        {children}
      </body>
    </html>
  );
}
```

#### React (Vite) — exclusive

```jsx
// src/App.jsx
import WebticksAnalytics from '@webticks/react';
import { AppInsightsDestination } from '@webticks/appinsights';

function App() {
  return (
    <>
      <WebticksAnalytics
        destinations={new AppInsightsDestination({
          connectionString: import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING,
        })}
      />
      {/* rest of app */}
    </>
  );
}
```

---

## How it works

WebTicks batches events in memory and flushes them every 10 seconds (configurable). When a flush happens, `AppInsightsDestination.send()` is called with the full batch.

### 1. Connection string parsing

The constructor parses your connection string to extract two values:

```
InstrumentationKey=abc123;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/
                   ^^^^^^                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                   iKey                     base URL for the ingestion endpoint
```

The ingestion URL becomes `IngestionEndpoint + /v2/track`. If no `IngestionEndpoint` is present, it falls back to `https://dc.services.visualstudio.com/v2/track`.

### 2. Event mapping

Each webticks event is converted to an [App Insights telemetry envelope](https://github.com/microsoft/ApplicationInsights-dotnet/blob/main/BASE/Schema/PublicSchema/Envelope.bond) — the same JSON format the official SDK uses:

```json
{
  "name": "Microsoft.ApplicationInsights.<iKey>.Event",
  "time": "2026-05-12T14:00:00.000Z",
  "iKey": "<iKey>",
  "tags": {
    "appInsights.userId": "<uid>",
    "appInsights.sessionId": "<sessionId>"
  },
  "data": {
    "baseType": "EventData",
    "baseData": {
      "ver": 2,
      "name": "login_success",
      "properties": {
        "uid": "user-123",
        "sessionId": "...",
        "path": "/fr/auth/callback",
        "eventType": "auth",
        "role": "expert"
      }
    }
  }
}
```

Page view events use `baseType: "PageViewData"` instead and include a `url` field — App Insights treats them as page views in the **Page Views** blade rather than custom events.

### 3. Batch POST

All envelopes from the flush are sent as a single JSON array in one `POST` request to the ingestion endpoint. App Insights accepts up to 100 items per request. If the response is not `2xx`, an error is thrown — webticks logs it as a warning and retries on the next flush.

### 4. User and session tracking

The `appInsights.userId` and `appInsights.sessionId` tags are set from webticks' own `uid` (persisted in `localStorage`) and `sessionId` (reset on `reset()`). This means App Insights **Users**, **Sessions**, and **Retention** reports work out of the box without any extra configuration.

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
