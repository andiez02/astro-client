import Image from 'next/image';
import { HEADER_HEIGHT } from '@/src/common/utils/constants';
import WalletConnector from '../ui/WalletConnector/WalletConnector';
import SearchBar from '../ui/Search/SearchBar';

export default function Header() {
    return (
        <div
            className="relative flex items-center px-6 bg-gray-100 border-gray-200"
            style={{ height: HEADER_HEIGHT }}
        >
            {/* Logo Area */}
            <div className="flex items-center gap-3 cursor-pointer shrink-0">
                <Image src="/logo/black-logo.svg" alt="Astro" width={40} height={40} className="w-10 h-10" />
            </div>

            {/* Navigation */}
            <nav className="flex gap-6 font-medium text-gray-600 shrink-0 ml-6">
                {/* Add links here */}
            </nav>

            {/* SearchBar - Fixed in center */}
            <div className="absolute left-1/2 -translate-x-1/2">
                <SearchBar />
            </div>

            {/* Wallet Connector - Right side */}
            <div className="ml-auto shrink-0">
                <WalletConnector />
            </div>
        </div >
    );
}