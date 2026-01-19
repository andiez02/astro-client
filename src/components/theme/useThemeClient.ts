'use client'

import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

function subscribe() {
    return () => {}
}

function getSnapshot() {
    return true
}

function getServerSnapshot() {
    return false
}

export function useThemeClient() {
    const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    const { theme, setTheme, resolvedTheme } = useTheme()

    if (!mounted) {
        return {
            theme: undefined,
            resolvedTheme: undefined,
            setTheme,
            mounted: false,
        }
    }

    return {
        theme,
        resolvedTheme,
        setTheme,
        mounted: true,
    }
}
