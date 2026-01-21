/**
 * WebTicks Analytics Middleware for NestJS
 * 
 * This middleware tracks all HTTP requests passing through the NestJS application.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createServerTracker } from '@webticks/node';

@Injectable()
export class WebticksMiddleware implements NestMiddleware {
    private tracker;

    constructor() {
        // Initialize the WebTicks tracker
        this.tracker = createServerTracker({
            backendUrl: 'http://localhost:3002/api/track',
            appId: '97069816-8b25-4640-833f-f17259208a42'
        });

        console.log('✓ WebTicks Analytics Middleware initialized');
    }

    use(req: Request, res: Response, next: NextFunction) {
        // Skip tracking for static assets and health checks
        const skipPaths = ['.ico', '.png', '.jpg', '.css', '.js', '/health'];
        const shouldSkip = skipPaths.some(path => req.path.includes(path));

        if (!shouldSkip) {
            // Track the request
            this.tracker.trackServerRequest({
                method: req.method,
                path: req.url,
                headers: req.headers
            });

            console.log(`[WebTicks] Tracked: ${req.method} ${req.url}`);
        }

        next();
    }
}
