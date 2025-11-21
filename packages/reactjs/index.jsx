'use client';
import inject from '@webticks/core';
import { useEffect } from 'react';

function WebticksAnalytics() {
    useEffect(() => {
        inject();
    }, []);
    return null;
}

export default WebticksAnalytics;