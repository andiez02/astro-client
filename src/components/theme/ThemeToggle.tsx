'use client'

import { useThemeClient } from './useThemeClient'

export function ThemeToggle() {
    const { setTheme, mounted } = useThemeClient()

    if (!mounted) return null

    return (
        <div className="flex gap-2">
            <button onClick={() => setTheme('light')} className="cursor-pointer">
                🌞
            </button>

            <button onClick={() => setTheme('dark')} className="cursor-pointer">
                🌙
            </button>

            <button onClick={() => setTheme('system')} className="cursor-pointer">
                💻
            </button>
        </div>
    )
}
