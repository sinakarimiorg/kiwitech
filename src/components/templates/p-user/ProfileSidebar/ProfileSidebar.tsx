"use client"

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    PiUserCircleLight,
    PiPackageLight,
    PiHeartLight,
    PiMapPinLight,
    PiEnvelopeSimpleLight,
    PiWalletLight,
    PiSignOutLight,
    PiSquaresFourLight
} from "react-icons/pi";
import type { IconType } from 'react-icons'
import { logoutAction } from '../../Auth/action';

type NavItem = {
    key: string
    label: string
    href: string
    icon: IconType
}

const navItems: NavItem[] = [
    { key: 'dashboard', label: 'داشبورد', href: '/p-user', icon: PiSquaresFourLight },
    { key: 'orders', label: 'سفارش‌های من', href: '/p-user/userOrders', icon: PiPackageLight },
    { key: 'favorites', label: 'کالاهای مورد علاقه', href: '/p-user/favorites', icon: PiHeartLight },
    { key: 'addresses', label: 'نشانی‌ها', href: '/p-user/addresses', icon: PiMapPinLight },
    { key: 'messages', label: 'پیام ها', href: '/p-user/messages', icon: PiEnvelopeSimpleLight },
    { key: 'personal-info', label: 'مشخصات فردی', href: '/p-user/profile', icon: PiUserCircleLight },
    { key: 'wallet', label: 'کیف پول', href: '/p-user/wallet', icon: PiWalletLight },
]

type ProfileSidebarProps = {
    userName: string
    unreadMessagesCount?: number
}

const itemBase =
    'shrink-0 snap-center flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 rounded-full lg:rounded-xl border lg:border-transparent text-sm whitespace-nowrap transition-colors'

export default function ProfileSidebar({ userName, unreadMessagesCount = 3 }: ProfileSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const activeRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        if (window.matchMedia('(min-width: 1024px)').matches) return
        activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
    }, [pathname])

    const handleLogout = async () => {
        await logoutAction()
        router.replace('/')
        router.refresh()
    }
    return (
        <aside className='w-full lg:w-72 shrink-0'>
            <div className='bg-white shadow-lg rounded-2xl overflow-hidden lg:sticky lg:top-28'>

                <div className='flex items-center gap-3 px-4 lg:px-5 py-3 lg:py-5 border-b border-gray-100'>
                    <span className='flex-center w-10 h-10 lg:w-11 lg:h-11 bg-primary-50 text-primary-600 rounded-full shrink-0'>
                        <PiUserCircleLight className='w-6 h-6' />
                    </span>
                    <div className='min-w-0'>
                        <p className='text-xs text-zinc-400'>خوش آمدید</p>
                        <h2 className='font-IranYekanBold text-sm text-zinc-800 line-clamp-1'>{userName}</h2>
                    </div>
                </div>

                <nav
                    aria-label='منوی پنل کاربری'
                    className='flex lg:flex-col gap-2 lg:gap-1 p-3 overflow-x-auto lg:overflow-visible snap-x scrollbar-none [&::-webkit-scrollbar]:hidden'
                >
                    {navItems.map(item => {
                        const isActive = item.href === '/p-user'
                            ? pathname === item.href
                            : pathname.startsWith(item.href)
                        const Icon = item.icon
                        const showBadge = item.key === 'messages' && unreadMessagesCount > 0

                        return (
                            <Link
                                key={item.key}
                                ref={isActive ? activeRef : null}
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`${itemBase}
                                    ${isActive
                                        ? 'bg-primary-50 text-primary-600 font-IranYekanBold border-primary-200'
                                        : 'text-zinc-500 border-gray-200 hover:bg-primary-50/60 hover:text-primary-600'}`}
                            >
                                <Icon className='w-5 h-5 shrink-0' />
                                {item.label}
                                {showBadge && (
                                    <span className='flex-center min-w-4.5 h-4.5 px-1 text-[10px] font-IranYekanBold bg-danger text-white rounded-full'>
                                        {unreadMessagesCount}
                                    </span>
                                )}
                            </Link>
                        )
                    })}

                    <div className='hidden lg:block border-t border-gray-100 my-2' />

                    <button
                        type='button'
                        onClick={handleLogout}
                        className={`${itemBase} text-zinc-500 border-gray-200 hover:bg-red-50 hover:text-red-500 cursor-pointer`}
                    >
                        <PiSignOutLight className='w-5 h-5 shrink-0' />
                        خروج
                    </button>
                </nav>
            </div>
        </aside>
    )
}
