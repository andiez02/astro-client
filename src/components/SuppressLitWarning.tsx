'use client';

import { useEffect } from 'react';

/**
 * Suppresses Lit dev mode warning in development
 * This warning is harmless and expected when using Lit in development mode
 */
export function SuppressLitWarning() {
    useEffect(() => {
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            const originalWarn = console.warn;
            console.warn = (...args: Parameters<typeof console.warn>) => {
                // Filter out Lit dev mode warning
                const message = args[0]?.toString() || '';
                if (message.includes('Lit is in dev mode')) {
                    return; // Suppress this specific warning
                }
                originalWarn.apply(console, args);
            };

            // Cleanup: restore original console.warn on unmount
            return () => {
                console.warn = originalWarn;
            };
        }
    }, []);

    return null;
}

