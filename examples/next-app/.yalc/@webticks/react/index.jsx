'use client';
import inject from '@webticks/core';
import { useEffect } from 'react';

/**
 * WebTicks Analytics Component for React
 * @param {Object} props
 * @param {string} props.serverUrl - URL to send analytics data
 * @param {string} [props.appId] - Application ID for tracking
 * @param {boolean} [props.debug] - Enable debug logging
 */
function WebticksAnalytics({ serverUrl, appId, debug }) {
    useEffect(() => {
        inject({ serverUrl, appId, debug });
    }, [serverUrl, appId, debug]);
    return null;
}

export default WebticksAnalytics;