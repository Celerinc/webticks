/**
 * App Module - Main application module
 * Configures WebTicks middleware to track all requests
 */

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ItemsController } from './items.controller.js';
import { AnalyticsController } from './analytics.controller.js';
import { WebticksMiddleware } from './webticks.middleware.js';

@Module({
    imports: [],
    controllers: [ItemsController, AnalyticsController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Apply WebTicks middleware to all routes
        consumer
            .apply(WebticksMiddleware)
            .forRoutes('*');
    }
}
