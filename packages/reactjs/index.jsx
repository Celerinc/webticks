'use client';
import inject from '@webticks/core';
import { useEffect } from 'react';

function WebTicksAnalytics() {
    useEffect(() => {
        inject();
    }, []);
    return null;
}

export default WebTicksAnalytics;