# WebTicks Test App

A standalone Next.js application demonstrating WebTicks analytics integration using yalc for local package development.

## Setup

This app was created to test the WebTicks package installed via yalc:

```bash
# Create Next.js app
npx create-next-app@latest test-webticks-app --typescript --tailwind --app

# Add WebTicks packages via yalc
cd test-webticks-app
yalc add @webticks/next @webticks/react @webticks/core
npm install
```

## Running the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Click Tracking**: Click the "Track Click Event" button to generate tracking events
- **Debug Mode**: Open browser console to see tracking events in real-time
- **API Route**: Events are sent to `/api/track` which logs them to the server console

## WebTicks Integration

### Layout (`app/layout.tsx`)

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

### Page (`app/page.tsx`)

```tsx
const handleClick = () => {
  if (window.webticks) {
    window.webticks.trackEvent("button_clicked", { count: newCount });
  }
};
```

### API Route (`app/api/track/route.ts`)

```tsx
export async function POST(request: NextRequest) {
  const events = await request.json();
  console.log("📊 WebTicks Events Received:", events);
  return NextResponse.json({ success: true });
}
```

## Testing

1. Start the dev server
2. Open the app in your browser
3. Click the "Track Click Event" button
4. Open browser console to see client-side tracking logs
5. Check terminal to see server-side API logs

## Yalc Workflow

To update WebTicks packages:

```bash
# In the webticks monorepo root
cd packages/core && yalc push
cd packages/react && yalc push

# Changes will automatically update in this app
```

## Notes

- Uses `@webticks/react` directly (not `@webticks/next`)
- Tracks events using `window.webticks.trackEvent()`
- Debug mode enabled to see events in console
- Simple, clean UI with Tailwind CSS
