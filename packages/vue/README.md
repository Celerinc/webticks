# @webticks/vue

Vue 3 integration for WebTicks analytics.

## Installation

```bash
npm install @webticks/vue
```

## Quick Start

Add the component to your App.vue with explicit configuration:

```vue
<template>
  <WebticksAnalytics 
    backendUrl="https://your-api.com/track" 
    appId="your-app-id" 
  />
  <RouterView />
</template>

<script setup>
import { WebticksAnalytics } from '@webticks/vue';
</script>
```

## Best Practices: Environment Variables

For security and flexibility, it is **highly recommended** to source your configuration from environment variables rather than hardcoding them.

```vue
<template>
  <!-- Using Vite (default for Vue 3) -->
  <WebticksAnalytics 
    :backendUrl="import.meta.env.VITE_WEBTICKS_BACKEND_URL" 
    :appId="import.meta.env.VITE_WEBTICKS_APP_ID" 
  />
</template>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `backend-url` | `string` | Recommended. URL to send analytics. Defaults to `/api/track`. |
| `app-id` | `string` | Required. Your application ID. |

> [!NOTE]
> `appId` and `backendUrl` are typically provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) project, which you can self-host. Alternatively, you can use any backend that implements the WebTicks ingestion API.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
