'use client'

import Image from 'next/image';
import { HEADER_HEIGHT } from '@/src/common/utils/constants';
import WalletConnector from '../ui/WalletConnector';
import SearchBar from '../ui/SearchBar';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useTheme } from 'next-themes';

export default function Header() {
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === 'dark'

    return (
        <div
            className="relative flex items-center px-3 sm:px-4 md:px-6 bg-background border-gray-200 z-50"
            style={{ height: HEADER_HEIGHT }}
        >
            {/* Logo Area */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0">
                <Image
                    src={isDark ? '/logo/white-logo.svg' : '/logo/black-logo.svg'}
                    alt="Astro"
                    width={40}
                    height={40}
                    className="w-8 h-8 sm:w-10 sm:h-10"
                />
            </div>

            {/* SearchBar - Responsive positioning */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
                <SearchBar />
            </div>

            {/* Wallet Connector - Right side */}
            <div className="ml-auto shrink-0 flex items-center gap-6">
                <ThemeToggle />
                <WalletConnector />
            </div>
        </div >
    );
}