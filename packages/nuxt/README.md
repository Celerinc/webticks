# @webticks/nuxt

[![npm version](https://img.shields.io/npm/v/@webticks/nuxt.svg)](https://www.npmjs.com/package/@webticks/nuxt)
[![license](https://img.shields.io/npm/l/@webticks/nuxt.svg)](https://github.com/Celerinc/webticks/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@webticks/nuxt)](https://bundlephobia.com/package/@webticks/nuxt)
![Nuxt.js](https://img.shields.io/badge/Nuxt.js-00DC82?logo=nuxtdotjs&logoColor=white)

Nuxt 3 module for WebTicks analytics.

## Installation

```bash
npm install @webticks/nuxt
```

## Quick Start

Configure the module in your Nuxt config:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@webticks/nuxt'],
  runtimeConfig: {
    public: {
      webticks: {
        backendUrl: 'https://your-api.com/track',
        appId: 'your-app-id'
      }
    }
  }
});
```

## Best Practices: Environment Variables

Nuxt 3 naturally supports environment variables via `runtimeConfig`. This is the **recommended** way to configure WebTicks.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      webticks: {
        // These can be overridden by NUXT_PUBLIC_WEBTICKS_BACKEND_URL 
        // and NUXT_PUBLIC_WEBTICKS_APP_ID env variables
        backendUrl: '', 
        appId: ''
      }
    }
  }
});
```

## Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `backendUrl` | `string` | Recommended. URL to send analytics. Defaults to `/api/track`. |
| `appId` | `string` | Required. Your application ID. |

> [!NOTE]
> `appId` and `backendUrl` are typically provided by the [webticks-api](https://github.com/Celerinc/webticks-api.git) project, which you can self-host. Alternatively, you can use any backend that implements the WebTicks ingestion API.

## License

[MPL-2.0](https://github.com/Celerinc/webticks/blob/main/LICENSE)
