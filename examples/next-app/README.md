# Next.js App with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a Next.js 16 application using the `@webticks/react` package with App Router.

## Features

- Automatic page view tracking with App Router
- Session and user ID management
- Event batching to minimize API calls
- Server-side rendering compatible
- TypeScript support

## Installation

From the monorepo root:

```bash
cd examples/next-app
pnpm install
```

## Environment Variables

No environment variables are required for development. For production, create a `.env.local` file:

```env
NEXT_PUBLIC_WEBTICKS_BACKEND_URL=https://your-analytics-backend.com/api/track
```

**Note:** Environment variables used in client-side code must be prefixed with `NEXT_PUBLIC_` in Next.js.

## Running the Application

Development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

Build for production:
```bash
pnpm build
pnpm start
```

## Usage

WebTicks is integrated in the root layout (`app/layout.tsx`):

```tsx
import WebticksAnalytics from "@webticks/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WebticksAnalytics />
        {children}
      </body>
    </html>
  );
}
```

**Important:** The component must be placed in a Client Component context. Since layouts in Next.js App Router are Server Components by default, we use the `"use client"` directive in the WebTicks package.

## Custom Event Tracking

Track custom events in Client Components:

```tsx
'use client';

export default function MyComponent() {
  const handleClick = () => {
    if (window.webticks) {
      window.webticks.trackEvent('button_click', { 
        page: 'home' 
      });
    }
  };

  return <button onClick={handleClick}>Track Event</button>;
}
```

## Project Structure

```
app/
├── layout.tsx        # Root layout with WebTicks
├── page.tsx          # Home page
└── globals.css       # Global styles
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- @webticks/react

## Next Steps

- Configure your analytics backend URL via environment variables
- Add custom event tracking for user interactions
- Leverage Next.js routing for automatic page tracking

For more information, see the [@webticks/react](../../packages/react) package documentation.
