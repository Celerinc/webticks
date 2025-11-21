/**
 * Analytics Controller
 * Mock endpoint to receive tracked events from WebTicks
 */

import { Controller, Post, Body, Get } from '@nestjs/common';

interface AnalyticsEvent {
    uid: string;
    sessionId: string;
    events: any[];
    datetime: string;
}

@Controller('api')
export class AnalyticsController {
    private allEvents: any[] = [];

    @Post('track')
    receiveEvents(@Body() data: AnalyticsEvent) {
        const { uid, sessionId, events, datetime } = data;

        console.log('\n📊 Analytics Batch Received');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`User ID: ${uid}`);
        console.log(`Session ID: ${sessionId}`);
        console.log(`Date/Time: ${datetime}`);
        console.log(`Events Count: ${events.length}`);
        console.log('\nEvents:');

        events.forEach((event, index) => {
            console.log(`  ${index + 1}. [${event.type}] ${event.path || event.name || 'N/A'}`);
            console.log(`      Request ID: ${event.requestId}`);
            console.log(`      Timestamp: ${event.timestamp}`);
            this.allEvents.push({ ...event, uid, sessionId, receivedAt: datetime });
        });

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        return {
            success: true,
            message: 'Events tracked successfully',
            count: events.length
        };
    }

    @Get('events')
    getAllEvents() {
        return {
            total: this.allEvents.length,
            events: this.allEvents
        };
    }
}
