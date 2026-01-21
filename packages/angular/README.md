# @webticks/angular

Angular integration for WebTicks analytics.

## Installation

```bash
npm install @webticks/angular
```

## Quick Start

Import and use the standalone component with explicit configuration:

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { WebticksAnalytics } from '@webticks/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WebticksAnalytics],
  template: `
    <webticks-tracker 
      backendUrl="https://your-api.com/track" 
      appId="your-app-id" 
    />
    <router-outlet />
  `
})
export class AppComponent {}
```

## Best Practices: Environment Variables

For security and flexibility, it is **highly recommended** to source your configuration from Angular's `environment` files or process variables rather than hardcoding them.

```typescript
// app.component.ts
import { environment } from '../environments/environment';

@Component({
  template: `
    <webticks-tracker 
      [backendUrl]="environment.webticksUrl" 
      [appId]="environment.webticksAppId" 
    />
  `
})
```

## Inputs

| Input | Type | Description |
|-------|------|-------------|
| `backendUrl` | `string` | Recommended. URL to send analytics. Defaults to `/api/track`. |
| `appId` | `string` | Required. Your application ID. |

> [!NOTE]
> `appId` and `backendUrl` are typically provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) project, which you can self-host. Alternatively, you can use any backend that implements the WebTicks ingestion API.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
