'use client';
import inject from '../core/inject.js';
import { useEffect } from 'react';

function WebTicksAnalytics() {
    useEffect(() => {
        inject();
    }, []);
    return null;
}

export default WebTicksAnalytics;