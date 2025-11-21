# Angular App with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into an Angular application using the `@webticks/angular` package.

## Features

- Automatic page view tracking
- Session and user ID management
- Event batching to minimize API calls
- TypeScript support

## Installation

From the monorepo root:

```bash
cd examples/angular-app
pnpm install
```

## Environment Variables

No environment variables are required for development. The tracker is configured to send events to a local endpoint by default.

For production, you can configure the backend URL in your environment:

```typescript
// In your app configuration
{
  backendUrl: environment.webticksUrl || 'https://your-analytics-backend.com/api/track'
}
```

## Running the Application

Development server:
```bash
pnpm start
```

The app will be available at `http://localhost:4200`

Build for production:
```bash
pnpm build
```

## Usage

The WebTicks component is already integrated in `app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { WebticksTrackerComponent } from '@webticks/angular';

@Component({
  selector: 'app-root',
  imports: [WebticksTrackerComponent],
  template: `
    <webticks-tracker />
    <h1>Angular + WebTicks</h1>
  `
})
export class AppComponent {}
```

That's it! WebTicks will automatically:
- Track page views
- Monitor route changes
- Batch and send events
- Manage user sessions

## Custom Event Tracking

Track custom events anywhere in your application:

```typescript
if (window.webticks) {
  window.webticks.trackEvent('button_click', { 
    label: 'signup_button' 
  });
}
```

## Project Structure

```
src/
├── app/
│   ├── app.component.ts      # Main app with WebTicks integration
│   └── app.config.ts          # App configuration
└── main.ts                    # Application bootstrap
```

## Next Steps

- Customize the backend URL for your analytics service
- Add custom event tracking for user interactions
- Configure event batching intervals if needed

For more information, see the [@webticks/angular](../../packages/angular) package documentation.
