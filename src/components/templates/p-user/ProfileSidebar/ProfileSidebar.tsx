import Link from 'next/link'
import {
    PiUserCircleLight,
    PiPackageLight,
    PiHeartLight,
    PiChatCircleTextLight,
    PiMapPinLight,
    PiGiftLight,
    PiEnvelopeSimpleLight,
    PiEyeLight,
    PiWalletLight,
    PiSignOutLight,
} from "react-icons/pi";
import type { IconType } from 'react-icons'

type NavItem = {
    key: string
    label: string
    href: string
    icon: IconType
}

const navItems: NavItem[] = [
    { key: 'orders', label: 'سفارش‌های من', href: '#', icon: PiPackageLight },
    { key: 'favorites', label: 'کالاهای مورد علاقه', href: '#', icon: PiHeartLight },
    { key: 'comments', label: 'نظرات', href: '#', icon: PiChatCircleTextLight },
    { key: 'addresses', label: 'نشانی‌ها', href: '#', icon: PiMapPinLight },
    { key: 'messages', label: 'پیام‌ها', href: '#', icon: PiEnvelopeSimpleLight },
    { key: 'recently-viewed', label: 'آخرین کالاهای دیده‌شده', href: '#', icon: PiEyeLight },
    { key: 'personal-info', label: 'مشخصات فردی', href: '/profile', icon: PiUserCircleLight },
    { key: 'wallet', label: 'کیف پول', href: '#', icon: PiWalletLight },
]

export default function ProfileSidebar({ active = 'personal-info' }: { active?: string }) {
    return (
        <aside className='w-full lg:w-72 shrink-0'>
            <div className='bg-white shadow-lg rounded-2xl overflow-hidden lg:sticky lg:top-28'>

                {/* Sidebar Header — hidden on mobile to save space */}
                <div className='hidden lg:flex items-center gap-3 px-5 py-5 border-b border-gray-100'>
                    <span className='flex-center w-11 h-11 bg-primary-50 text-primary-600 rounded-full shrink-0'>
                        <PiUserCircleLight className='w-6 h-6' />
                    </span>
                    <div>
                        <p className='text-xs text-zinc-400'>خوش آمدید</p>
                        <h2 className='font-IranYekanBold text-sm text-zinc-800'>مشتری گرامی</h2>
                    </div>
                </div>

                {/* Nav List — horizontal scroll on mobile, vertical list on desktop */}
                <div className='flex lg:flex-col gap-1.5 lg:gap-1 p-3 overflow-x-auto lg:overflow-visible
                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none'>
                    {navItems.map(item => {
                        const isActive = item.key === active
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`flex flex-col lg:flex-row items-center lg:gap-3 gap-1.5 shrink-0
                                    px-4 lg:px-4 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm transition-colors
                                    ${isActive
                                        ? 'bg-primary-50 text-primary-600 font-IranYekanBold'
                                        : 'text-zinc-500 hover:bg-primary-50/60 hover:text-primary-600'}`}
                            >
                                <Icon className='w-5 h-5 lg:w-5 lg:h-5 shrink-0' />
                                <span className='whitespace-nowrap lg:whitespace-normal'>{item.label}</span>
                            </Link>
                        )
                    })}

                    {/* Logout — visually separated, subtle danger tone on hover */}
                    <div className='hidden lg:block border-t border-gray-100 my-2' />
                    <button
                        className='flex flex-col lg:flex-row items-center lg:gap-3 gap-1.5 shrink-0
                            px-4 lg:px-4 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm
                            text-zinc-500 hover:bg-red-50 hover:text-red-500 transition-colors'
                    >
                        <PiSignOutLight className='w-5 h-5 shrink-0' />
                        <span className='whitespace-nowrap lg:whitespace-normal'>خروج</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}
