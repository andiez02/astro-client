'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { blo } from 'blo';
import { ChevronDown, ChevronUp, CopyIcon, UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDisconnect } from "wagmi";
import { toast } from "sonner";

export default function WalletConnector() {
    const [isHovering, setIsHovering] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { disconnect } = useDisconnect();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        // Only enable hover on desktop (md and above)
        if (window.innerWidth >= 768) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setIsHovering(true);
        }
    };

    const handleMouseLeave = () => {
        // Only enable hover on desktop (md and above)
        if (window.innerWidth >= 768) {
            timeoutRef.current = setTimeout(() => {
                setIsHovering(false);
            }, 150);
        }
    };

    const handleClick = () => {
        // On mobile, toggle dropdown. On desktop, hover handles it.
        if (window.innerWidth < 768) {
            setIsOpen(!isOpen);
        }
    };

    // Close dropdown when clicking outside (mobile)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scroll on mobile when dropdown is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const copyAddress = (address: string) => {
        navigator.clipboard.writeText(address);
        toast.success('Address copied to clipboard');
    };

    return (
        <div className="font-sans">
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    // openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                }) => {

                    // 1. Check mounted state to avoid Next.js hydration error
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus ||
                            authenticationStatus === 'authenticated');

                    return (
                        <div
                            {...(!ready && {
                                'aria-hidden': true,
                                'style': {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                },
                            })}
                            className="relative"
                        >
                            {(() => {
                                if (!connected) {
                                    // 2. Not connected -> Show connect button
                                    return (
                                        <button
                                            onClick={openConnectModal}
                                            className="bg-black text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition-all active:scale-95 font-display"
                                        >
                                            Connect
                                        </button>
                                    );
                                }

                                if (chain.unsupported) {
                                    // 3. Wrong network -> Show switch network button
                                    return (
                                        <button
                                            onClick={openChainModal}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors font-display"
                                        >
                                            Wrong Network
                                        </button>
                                    );
                                }

                                // 4. Connected -> Show balance + address
                                return (
                                    <div className="flex items-center gap-3">
                                        <button className="bg-black text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition-all active:scale-95 font-display cursor-pointer">
                                            Create
                                        </button>
                                        {/* Show user information (Balance + Address) */}
                                        <div
                                            ref={dropdownRef}
                                            className="relative"
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div
                                                onClick={handleClick}
                                                className="flex items-center gap-2 cursor-pointer md:cursor-default"
                                            >
                                                {/* Show ENS avatar if available */}
                                                {account.ensAvatar ? (
                                                    <Image
                                                        src={account.ensAvatar}
                                                        alt="ENS Avatar"
                                                        width={26}
                                                        height={26}
                                                        className="rounded-full border border-gray-200"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{ backgroundImage: `url(${blo(account.address as `0x${string}`)})` }}
                                                        className="w-[26px] h-[26px] rounded-full bg-cover bg-center"
                                                    >
                                                    </div>
                                                )}

                                                <span className="text-sm font-semibold text-gray-700 mr-1 font-display">
                                                    {account.displayName}
                                                </span>

                                                {(isHovering || isOpen) ? (
                                                    <ChevronUp className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                                )}
                                            </div>

                                            {/* Mobile Backdrop */}
                                            {isOpen && (
                                                <div
                                                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                                                    onClick={() => setIsOpen(false)}
                                                />
                                            )}

                                            {/* Dropdown Box */}
                                            <div
                                                className={`absolute right-0 top-full mt-2 w-60 sm:w-72 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 transition-all duration-150 ease-out font-sans ${isHovering || isOpen
                                                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                                                    : 'opacity-0 -translate-y-2 pointer-events-none'
                                                    }`}
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {/* Header with avatar and address */}
                                                <div className="p-4 border-b border-gray-100 bg-linear-to-br from-gray-50 to-white">
                                                    <div className="flex items-center gap-3">
                                                        {account.ensAvatar ? (
                                                            <Image
                                                                src={account.ensAvatar}
                                                                alt="ENS Avatar"
                                                                width={48}
                                                                height={48}
                                                                className="rounded-full border-2 border-purple-500 shadow-sm"
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{ backgroundImage: `url(${blo(account.address as `0x${string}`)})` }}
                                                                className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-purple-500 shadow-sm"
                                                            />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-gray-900 font-semibold text-sm truncate font-display">
                                                                {account.ensName || account.displayName}
                                                            </p>
                                                            <button
                                                                onClick={() => copyAddress(account.address)}
                                                                className="text-gray-500 text-xs hover:text-purple-600 transition-colors flex items-center gap-1 mt-0.5 group font-sans"
                                                            >
                                                                <span className="font-mono">{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
                                                                <CopyIcon className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Balance */}
                                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600 text-sm font-medium font-sans">Balance</span>
                                                        <span className="text-gray-900 font-semibold text-sm font-display">
                                                            {account.displayBalance || '0.00 ETH'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Network */}
                                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600 text-sm font-medium font-sans">Network</span>
                                                        <div className="flex items-center gap-2">
                                                            {chain.hasIcon && chain.iconUrl && (
                                                                <Image
                                                                    alt={chain.name ?? 'Chain icon'}
                                                                    src={chain.iconUrl}
                                                                    width={16}
                                                                    height={16}
                                                                    className="rounded-full"
                                                                />
                                                            )}
                                                            <span className="text-gray-900 font-medium text-sm font-display">{chain.name}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="p-2 bg-gray-50/30">
                                                    <button
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            // openAccountModal();
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-white hover:shadow-sm rounded-xl transition-all text-sm font-medium group font-sans"
                                                    >
                                                        <UserIcon className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-colors" />
                                                        Profile
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            openChainModal();
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-white hover:shadow-sm rounded-xl transition-all text-sm font-medium group font-sans"
                                                    >
                                                        <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                        </svg>
                                                        Switch Network
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            disconnect();
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 hover:shadow-sm rounded-xl transition-all text-sm font-medium group font-sans"
                                                    >
                                                        <svg className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        Disconnect
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        </div>
    );
}