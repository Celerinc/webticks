'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import inject from '@webticks/core';

export { track, identify, reset } from '@webticks/react';

/**
 * Drop-in analytics component for Next.js App Router.
 * Uses usePathname to reliably capture soft navigations.
 *
 * @param {Object} props
 * @param {string} [props.serverUrl]
 * @param {string} props.appId
 * @param {boolean} [props.debug]
 * @param {string[]} [props.stripLocales] - Locale prefixes to strip from tracked paths e.g. ['fr', 'en']
 */
function WebticksAnalytics({ serverUrl, appId, debug, stripLocales = [] }) {
    const pathname = usePathname();
    const prevPathname = useRef(null);

    // Initialize once — disable core's History patching since we own page view tracking
    useEffect(() => {
        inject({ serverUrl, appId, debug, autoTrackPageViews: false });
    }, [serverUrl, appId, debug]);

    // Track page view on every pathname change (including initial mount)
    useEffect(() => {
        if (typeof window === 'undefined' || !window.webticks) return;
        if (pathname === prevPathname.current) return;
        prevPathname.current = pathname;

        let path = pathname;
        for (const locale of stripLocales) {
            if (path.startsWith(`/${locale}/`)) {
                path = path.slice(locale.length + 1);
                break;
            }
            if (path === `/${locale}`) {
                path = '/';
                break;
            }
        }
        window.webticks.trackPageView(path);
    }, [pathname, stripLocales]);

    return null;
}

export default WebticksAnalytics;