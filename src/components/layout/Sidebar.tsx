'use client'

import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import defaultAvatar from '@/src/common/assets/images/default-avatar.png'
import { HomeFilledIcon } from '@/src/common/assets/icons/HomeFilledIcon'
import { HomeIcon } from '@/src/common/assets/icons/HomeIcon'
import { SearchIcon } from '@/src/common/assets/icons/SearchIcon'
import { SearchFilledIcon } from '@/src/common/assets/icons/SearchFilledIcon'
import { BellIcon } from '@/src/common/assets/icons/BellIcon'
import { BellFilledIcon } from '@/src/common/assets/icons/BellFilledIcon'
import { BASE_CLASS, ICON_CLASS } from '@/src/common/utils/constants'

type IconComponent = ({ className }: { className?: string }) => ReactNode

interface NavigationItem {
    path: string
    Icon: React.ComponentType<{ className?: string }>
    FilledIcon: IconComponent
}

export const navigationItems: NavigationItem[] = [
    { path: '/home', Icon: HomeIcon, FilledIcon: HomeFilledIcon },
    { path: '/explore', Icon: SearchIcon, FilledIcon: SearchFilledIcon },
    { path: '/notifications', Icon: BellIcon, FilledIcon: BellFilledIcon },
]

const NavLink = ({ item, isActive }: { item: NavigationItem; isActive: boolean }) => (
    <Link href={item.path} className={BASE_CLASS}>
        {isActive ? (
            <item.FilledIcon className={`${ICON_CLASS} text-gray-900`} />
        ) : (
            <item.Icon className={`${ICON_CLASS} text-gray-400 group-hover:text-gray-900`} />
        )}
    </Link>
)

const PlusButton = () => (
    <button className="flex items-center justify-center w-12 h-12 md:w-10 md:h-10 rounded-lg bg-gray-200 transition-colors group cursor-pointer">
        <Plus className={`${ICON_CLASS} text-gray-600 group-hover:text-gray-900`} />
    </button>
)

const ProfileLink = ({ isActive }: { isActive: boolean }) => (
    <Link
        href="/profile"
        className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors group cursor-pointer ${isActive ? 'ring-2 ring-gray-900' : ''}`}
    >
        <Image src={defaultAvatar} alt="Default Avatar" width={26} height={26} className="size-6 md:size-8 rounded-full" />
    </Link>
)

export default function Sidebar() {
    const pathname = usePathname()
    const isActive = (path: string) => pathname === path

    return (
        <div className="fixed z-40 bg-gray-100 bottom-0 left-0 right-0 h-16 w-full flex flex-row items-center justify-around md:top-0 md:right-auto md:bottom-auto md:h-full md:w-20 md:flex-col md:justify-center md:gap-8 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:shadow-none">
            <NavLink item={navigationItems[0]} isActive={isActive(navigationItems[0].path)} />
            <NavLink item={navigationItems[1]} isActive={isActive(navigationItems[1].path)} />
            <PlusButton />
            <NavLink item={navigationItems[2]} isActive={isActive(navigationItems[2].path)} />
            <ProfileLink isActive={isActive('/profile')} />
        </div>
    )
}
