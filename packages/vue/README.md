# @webticks/vue

[![npm version](https://img.shields.io/npm/v/@webticks/vue.svg)](https://www.npmjs.com/package/@webticks/vue)
[![license](https://img.shields.io/npm/l/@webticks/vue.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/vue)](https://bundlephobia.com/package/@webticks/vue)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?logo=vuedotjs&logoColor=white)

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
    serverUrl="https://your-api.com/track" 
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
    :serverUrl="import.meta.env.VITE_WEBTICKS_SERVER_URL" 
    :appId="import.meta.env.VITE_WEBTICKS_APP_ID" 
  />
</template>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `serverUrl` | `string` | Recommended. URL to send analytics. Defaults to `/api/track`. |
| `appId` | `string` | Required. Your application ID. |
| `debug` | `boolean` | Optional. Enable console logging. Defaults to `false`. |

> [!NOTE]
> `appId` and `serverUrl` are typically provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) project, which you can self-host. Alternatively, you can use any backend that implements the WebTicks ingestion API.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
