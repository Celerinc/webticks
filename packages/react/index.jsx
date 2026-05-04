'use client';
import inject from '@webticks/core';
import { useEffect } from 'react';

export { track, identify, reset } from '@webticks/core';

function WebticksAnalytics({ serverUrl, appId, debug }) {
    useEffect(() => {
        inject({ serverUrl, appId, debug });
    }, [serverUrl, appId, debug]);
    return null;
}

export default WebticksAnalytics;