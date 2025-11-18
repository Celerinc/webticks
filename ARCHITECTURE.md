# WebTicks Architecture Overview

## Before (Browser-Only)

```
@webticks/core
├── tracker.js (browser-only, uses window, document, fetch)
├── injector.js (auto-executes immediately)
└── package.json

@webticks/react → imports core → browser only
@webticks/nextjs → imports react → browser only
```

## After (Universal: Browser + Node.js)

```mermaid
graph TB
    subgraph "Core Package - Universal"
        A[tracker.js<br/>Centralized Logic] --> B[Platform Adapters]
        B --> C[BrowserAdapter<br/>window, DOM, localStorage]
        B --> D[NodeAdapter<br/>crypto, http/https]
        E[server-middleware.js] --> A
        F[injector.js] --> A
    end
    
    subgraph "Browser Usage"
        G[@webticks/react] --> F
        H[@webticks/nextjs] --> G
    end
    
    subgraph "Server Usage"
        I[Express App] --> E
        J[Next.js API] --> A
        K[Lambda/Serverless] --> A
    end
    
    style A fill:#4CAF50,color:#fff
    style B fill:#2196F3,color:#fff
    style E fill:#FF9800,color:#fff
```

## File Structure

```
packages/core/
├── tracker.js              ⭐ Refactored - works everywhere
├── platform-adapters.js    🆕 Browser vs Node.js abstraction
├── server-middleware.js    🆕 Express/Connect middleware
├── injector.js             ✏️  Updated - safe for Node.js
├── package.json            ✏️  Updated - multiple exports
├── README.md               🆕 Usage documentation
├── test-server.js          🆕 Verification tests
└── examples/
    ├── express-example.js      🆕 Express integration
    └── manual-tracking.js      🆕 API routes & serverless
```

## Key Principles

### 1. Single Source of Truth
All tracking logic lives in `tracker.js`. Changes propagate everywhere automatically.

### 2. Platform Adapters
Environment-specific operations are abstracted:
- Browser: Uses `window`, `localStorage`, `crypto.randomUUID()`, `fetch`
- Node.js: Uses `crypto`, `http/https`, in-memory storage

### 3. Zero Breaking Changes
- Existing packages work without modification
- Browser behavior is identical to before
- Server support is purely additive

### 4. Maximum Flexibility
Works with any Node.js framework or runtime:
- Traditional servers (Express, Koa, Fastify)
- Modern frameworks (Next.js, Remix, SvelteKit)
- Serverless (AWS Lambda, Vercel, Netlify)

## Usage Patterns

| Environment | Method | Code |
|------------|---------|------|
| **Browser (React)** | Auto-inject | `<WebTicksAnalytics />` |
| **Server (Express)** | Middleware | `app.use(createServerMiddleware())` |
| **Server (API Routes)** | Manual | `tracker.trackServerRequest(req)` |
| **Serverless** | Manual | `await tracker.sendQueue()` |

## Benefits

✅ **Centralized**: One package to maintain  
✅ **Consistent**: Same API across environments  
✅ **Efficient**: Update once, deploy everywhere  
✅ **Safe**: Backward compatible, no breaking changes  
✅ **Flexible**: Works with any framework
