"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
    PiSquaresFourLight,
    PiPackageLight,
    PiShoppingBagOpenLight,
    PiTagLight,
    PiUsersLight,
    PiChatCircleTextLight,
    PiPercentLight,
    PiImagesLight,
    PiGearLight,
    PiSignOutLight,
    PiCaretRightLight,
    PiArticle,
    PiWallet,
    PiWalletLight,
    PiArticleLight,
} from 'react-icons/pi'
import type { IconType } from 'react-icons'

type NavItem = {
    key: string
    label: string
    href: string
    icon: IconType
    badge?: number
}

const navItems: NavItem[] = [
    { key: 'dashboard', label: 'داشبورد', href: '/p-admin', icon: PiSquaresFourLight },
    { key: 'dashboard', label: 'کیف پول و تراکنش‌ها', href: '/p-admin/wallet', icon: PiWalletLight },
    { key: 'orders', label: 'سفارش‌ها', href: '/p-admin/orders', icon: PiShoppingBagOpenLight, badge: 12 },
    { key: 'products', label: 'محصولات', href: '/p-admin/products', icon: PiPackageLight },
    { key: 'categories', label: 'دسته‌بندی‌ها', href: '/p-admin/categories', icon: PiTagLight },
    { key: 'customers', label: 'کاربران', href: '/p-admin/users', icon: PiUsersLight },
    { key: 'comments', label: 'نظرات کاربران', href: '/p-admin/comments', icon: PiChatCircleTextLight, badge: 5 },
    { key: 'discounts', label: 'کدهای تخفیف', href: '/p-admin/discounts', icon: PiPercentLight },
    { key: 'discounts', label: 'مقالات', href: '/p-admin/articles', icon: PiArticleLight },
    { key: 'banners', label: 'بنرها و اسلایدر', href: '/p-admin/banners', icon: PiImagesLight },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside className={`sticky top-0 h-screen shrink-0 bg-navbar text-text transition-all duration-1000 overflow-hidden ${collapsed ? 'w-20' : 'w-64'}`}>
            {/* Logo */}
            <div className="flex items-center justify-between px-5 py-6 border-b border-navbar-border">
                {!collapsed && (
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/images/logo/logo1.png" className="w-9 h-9" alt="کیوی‌تک" />
                        <span className="font-MorabbaBold text-neon text-lg line-clamp-1">کیــــوی تـــک</span>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 text-text-muted hover:text-neon transition-colors cursor-pointer"
                >
                    <PiCaretRightLight className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1 px-3 py-5 overflow-x-hidden overflow-y-auto">
                {navItems.map(item => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors line-clamp-1
                                ${isActive
                                    ? 'bg-primary-600/90 text-white font-IranYekanMedium'
                                    : 'text-text-muted hover:bg-navbar-hover hover:text-text'}`
                                }
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            {item.badge && !collapsed && (
                                <span className="mr-auto flex-center min-w-5 h-5 px-1 text-[11px] bg-neon text-surface font-IranYekanBold rounded-full">
                                    {item.badge}
                                </span>
                            )}
                            {item.badge && collapsed && (
                                <span className="absolute top-1 left-1 w-2 h-2 bg-neon rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="mt-auto px-3 py-4 border-t border-navbar-border">
                <Link
                    href="/p-admin/settings"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-text-muted hover:bg-navbar-hover hover:text-text transition-colors"
                >
                    <PiGearLight className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>تنظیمات</span>}
                </Link>
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-danger/90 hover:bg-danger/10 transition-colors"
                >
                    <PiSignOutLight className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className='line-clamp-1'>خروج به فروشگاه</span>}
                </Link>
            </div>
        </aside>
    )
}