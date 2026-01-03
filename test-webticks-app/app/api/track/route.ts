import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const events = await request.json();

    // Log the tracking events (in production, you'd send to your analytics backend)
    console.log("📊 WebTicks Events Received:", JSON.stringify(events, null, 2));

    return NextResponse.json({ success: true, received: events.length });
}
