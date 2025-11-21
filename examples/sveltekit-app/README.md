# SvelteKit App with WebTicks Analytics

This example demonstrates how to integrate WebTicks analytics into a SvelteKit application using the `@webticks/sveltekit` package.

## Features

- Automatic page view tracking
- Session and user ID management
- Event batching to minimize API calls
- SvelteKit routing integration
- TypeScript support

## Installation

From the monorepo root:

```bash
cd examples/sveltekit-app
pnpm install
```

## Environment Variables

No environment variables are required for development. For production, create a `.env` file:

```env
PUBLIC_WEBTICKS_BACKEND_URL=https://your-analytics-backend.com/api/track
```

**Note:** Environment variables for client-side use in SvelteKit must be prefixed with `PUBLIC_`.

## Running the Application

Development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

Build for production:
```bash
pnpm build
pnpm preview
```

## Usage

WebTicks can be integrated in your root layout (`src/routes/+layout.svelte`):

```svelte
<script>
  import { WebticksAnalytics } from '@webticks/sveltekit';
</script>

<WebticksAnalytics />

<slot />
```

WebTicks will automatically:
- Track page views
- Monitor navigation changes
- Batch and send events
- Manage user sessions

## Custom Event Tracking

Track custom events in your components:

```svelte
<script>
  function handleClick() {
    if (window.webticks) {
      window.webticks.trackEvent('button_click', { 
        action: 'download' 
      });
    }
  }
</script>

<button on:click={handleClick}>Download</button>
```

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte    # Root layout (add WebTicks here)
│   └── +page.svelte      # Home page
└── app.html              # HTML template
```

## Tech Stack

- SvelteKit 2
- Svelte 5
- Vite 7
- @webticks/sveltekit

## Next Steps

- Configure your analytics backend URL via environment variables
- Add custom event tracking for user interactions
- Leverage SvelteKit routing for automatic page tracking

For more information, see the [@webticks/sveltekit](../../packages/sveltekit) package documentation.
