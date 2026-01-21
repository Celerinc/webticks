# @webticks/sveltekit

SvelteKit integration for WebTicks analytics.

## Installation

```bash
npm install @webticks/sveltekit
```

## Quick Start

Add the component to your root layout with explicit configuration:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { WebticksAnalytics } from '@webticks/sveltekit';
</script>

<WebticksAnalytics 
  backendUrl="https://your-api.com/track" 
  appId="your-app-id" 
/>
<slot />
```

## Best Practices: Environment Variables

For security and flexibility, it is **highly recommended** to source your configuration from SvelteKit's environment modules.

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { PUBLIC_WEBTICKS_BACKEND_URL, PUBLIC_WEBTICKS_APP_ID } from '$env/static/public';
</script>

<WebticksAnalytics 
  backendUrl={PUBLIC_WEBTICKS_BACKEND_URL} 
  appId={PUBLIC_WEBTICKS_APP_ID} 
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
