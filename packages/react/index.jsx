'use client';
import inject from '@webticks/core';
import { useEffect } from 'react';

function WebticksAnalytics({ backendUrl, appId }) {
    useEffect(() => {
        inject({ backendUrl, appId });
    }, [backendUrl, appId]);
    return null;
}

export default WebticksAnalytics;