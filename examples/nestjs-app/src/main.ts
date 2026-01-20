/**
 * NestJS Application Entry Point
 * REST API with WebTicks Analytics Integration
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'error', 'warn', 'debug']
    });

    // Enable CORS for development
    app.enableCors();

    const PORT = process.env.PORT || 3000;

    await app.listen(PORT);

    console.log('\n WebTicks NestJS Demo Server Running');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(` URL: http://localhost:${PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n Available Endpoints:');
    console.log('  GET    /items          - Get all items');
    console.log('  GET    /items/:id      - Get item by ID');
    console.log('  POST   /items          - Create new item');
    console.log('  PUT    /items/:id      - Update item');
    console.log('  DELETE /items/:id      - Delete item');
    console.log('  GET    /api/events     - View tracked events');
    console.log('\n✨ WebTicks middleware is tracking all requests!\n');
}

bootstrap();
