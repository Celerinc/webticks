# Server-Side Framework Examples

All examples use the same simple pattern: create a tracker, then call `trackServerRequest()` in your request handler.

## Express

```javascript
import express from 'express';
import { createServerTracker } from '@webticks/core/server';

const app = express();
const tracker = createServerTracker({
  backendUrl: 'https://api.example.com/track'
});

// Track in your routes or middleware
app.use((req, res, next) => {
  tracker.trackServerRequest({
    method: req.method,
    path: req.url,
    headers: req.headers
  });
  next();
});

app.listen(3000);
```

## NestJS

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { createServerTracker } from '@webticks/core/server';

@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
  private tracker = createServerTracker({
    backendUrl: 'https://api.example.com/track'
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.tracker.trackServerRequest({
      method: req.method,
      path: req.url,
      headers: req.headers
    });
    next();
  }
}
```

## Fastify

```javascript
import Fastify from 'fastify';
import { createServerTracker } from '@webticks/core/server';

const fastify = Fastify();
const tracker = createServerTracker({
  backendUrl: 'https://api.example.com/track'
});

fastify.addHook('onRequest', async (request, reply) => {
  tracker.trackServerRequest({
    method: request.method,
    path: request.url,
    headers: request.headers
  });
});

await fastify.listen({ port: 3000 });
```

## Koa

```javascript
import Koa from 'koa';
import { createServerTracker } from '@webticks/core/server';

const app = new Koa();
const tracker = createServerTracker({
  backendUrl: 'https://api.example.com/track'
});

app.use(async (ctx, next) => {
  tracker.trackServerRequest({
    method: ctx.method,
    path: ctx.path,
    headers: ctx.headers
  });
  await next();
});

app.listen(3000);
```

## Bun

```javascript
import { createServerTracker } from '@webticks/core/server';

const tracker = createServerTracker({
  backendUrl: 'https://api.example.com/track'
});

Bun.serve({
  port: 3000,
  fetch(request) {
    tracker.trackServerRequest({
      method: request.method,
      path: new URL(request.url).pathname,
      headers: Object.fromEntries(request.headers)
    });
    
    return new Response('Hello World');
  }
});
```

## Elysia

```javascript
import { Elysia } from 'elysia';
import { createServerTracker } from '@webticks/core/server';

const tracker = createServerTracker({
  backendUrl: 'https://api.example.com/track'
});

new Elysia()
  .onBeforeHandle(({ request, path }) => {
    tracker.trackServerRequest({
      method: request.method,
      path: path,
      headers: Object.fromEntries(request.headers)
    });
  })
  .get('/', () => 'Hello World')
  .listen(3000);
```

## Next.js API Routes

```javascript
import { createServerTracker } from '@webticks/core/server';

const tracker = createServerTracker({
  backendUrl: process.env.ANALYTICS_URL
});

export default async function handler(req, res) {
  tracker.trackServerRequest({
    method: req.method,
    path: req.url,
    headers: req.headers
  });

  res.status(200).json({ message: 'Success' });
}
```

## Serverless (AWS Lambda, Vercel, etc.)

```javascript
import { createServerTracker } from '@webticks/core/server';

const tracker = createServerTracker({
  backendUrl: process.env.ANALYTICS_URL
});

export async function handler(event, context) {
  tracker.trackServerRequest({
    method: event.httpMethod,
    path: event.path,
    headers: event.headers
  });

  // Send immediately (no batching in serverless)
  await tracker.sendQueue();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' })
  };
}
```

---

## Key Points

✅ **One Create Pattern** - All frameworks use the same simple approach  
✅ **No Framework Lock-in** - Integrate however you want  
✅ **Easy to Maintain** - No framework-specific adapters to update  
✅ **Works Everywhere** - Same tracker code in browser and server  

The tracker automatically uses the right platform adapter (browser vs Node.js) and handles everything else!
