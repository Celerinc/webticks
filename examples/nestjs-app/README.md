# NestJS REST API with WebTicks Analytics

A demonstration NestJS REST API application that uses `@webticks/node` middleware to automatically track all HTTP requests.

## Features

- **WebTicks Integration**: Automatic request tracking via middleware
- **REST API**: Full CRUD operations for Items resource
- **Analytics Dashboard**: View all tracked events
- **TypeScript**: Fully typed NestJS application
- **ES Modules**: Modern JavaScript module system

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Main application module
├── webticks.middleware.ts     # WebTicks tracking middleware
├── items.controller.ts        # REST API for Items
└── analytics.controller.ts    # Analytics events endpoint
```

## Installation

From the project root:

```bash
cd examples/nestjs-app
pnpm install
```

## Running the Application

Development mode:
```bash
pnpm start:dev
```

Production mode:
```bash
pnpm build
pnpm start:prod
```

## API Endpoints

### Items Resource (CRUD)

- `GET /items` - Get all items
- `GET /items/:id` - Get a specific item
- `POST /items` - Create a new item
  ```json
  {
    "name": "New Item",
    "description": "Item description"
  }
  ```
- `PUT /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item

### Analytics

- `GET /api/events` - View all tracked events

## WebTicks Middleware

The `WebticksMiddleware` automatically tracks all incoming HTTP requests:

```typescript
@Injectable()
export class WebticksMiddleware implements NestMiddleware {
  private tracker;

  constructor() {
    this.tracker = createServerTracker({
      serverUrl: 'http://localhost:3000/api/track'
    });
  }

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

The middleware is registered globally in `app.module.ts`:

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(WebticksMiddleware).forRoutes('*');
  }
}
```

## Testing

Try the following requests:

```bash
# Get all items
curl http://localhost:3000/items

# Create a new item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"A test item"}'

# View tracked events
curl http://localhost:3000/api/events
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `WEBTICKS_BACKEND_URL` - Analytics backend URL (default: http://localhost:3000/api/track)

## How It Works

1. **Request comes in** → WebTicks middleware intercepts it
2. **Tracking happens** → Request details sent to analytics backend
3. **Request continues** → Normal NestJS routing and controller logic
4. **Events stored** → View them at `/api/events`

All requests are automatically tracked without any changes to your controllers!
