'use client';
import inject from '@webticks/core';
import { useEffect } from 'react';

export { track, identify, reset } from '@webticks/core';

function WebticksAnalytics({ serverUrl, appId, debug, destinations }) {
    useEffect(() => {
        inject({ serverUrl, appId, debug, destinations });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
}

export default WebticksAnalytics;