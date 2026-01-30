'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { useThemeClient } from './useThemeClient'

export function ThemeToggle() {
    const { theme, setTheme, mounted } = useThemeClient()

    if (!mounted) return null

    const isActive = (value: string) => theme === value

    return (
        <div className='inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 px-0.5 py-0.5 shadow-sm backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/70'>
            <button
                type='button'
                onClick={() => setTheme('light')}
                aria-label='Use light theme'
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] transition-colors cursor-pointer
                    ${
                        isActive('light')
                            ? 'bg-gray-900 text-yellow-300 dark:bg-white dark:text-gray-900'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
            >
                <Sun className='h-4 w-4' />
            </button>

            <button
                type='button'
                onClick={() => setTheme('dark')}
                aria-label='Use dark theme'
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] transition-colors cursor-pointer
                    ${
                        isActive('dark')
                            ? 'bg-gray-900 text-indigo-200 dark:bg-white dark:text-gray-900'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
            >
                <Moon className='h-4 w-4' />
            </button>

            <button
                type='button'
                onClick={() => setTheme('system')}
                aria-label='Use system theme'
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] transition-colors cursor-pointer
                    ${
                        isActive('system')
                            ? 'bg-gray-900 text-teal-200 dark:bg-white dark:text-gray-900'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
            >
                <Monitor className='h-3.5 w-3.5' />
            </button>
        </div>
    )
}
