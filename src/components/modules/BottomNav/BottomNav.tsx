"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    PiHouseLight,
    PiHouseFill,
    PiSquaresFourLight,
    PiSquaresFourFill,
    PiShoppingCartSimpleLight,
    PiShoppingCartSimpleFill,
    PiUserCircleLight,
    PiUserCircleFill,
} from 'react-icons/pi'
import type { IconType } from 'react-icons'
import { CartBadge } from '@root/src/components/modules/Topbar/CartMiniPanel'
import CategorySheet from './CategorySheet'

type SessionUser = { name: string; phone: string; role: string } | null

const itemClasses = (active: boolean) =>
    `relative flex flex-col items-center justify-center gap-1 flex-1 h-16 text-[11px] transition-colors cursor-pointer
    ${active ? 'text-neon' : 'text-text-muted'}`

type NavLinkProps = {
    href: string
    label: string
    active: boolean
    icon: IconType
    activeIcon: IconType
    badge?: boolean
}

function NavLink({ href, label, active, icon: Icon, activeIcon: ActiveIcon, badge }: NavLinkProps) {
    const Current = active ? ActiveIcon : Icon

    return (
        <Link href={href} aria-current={active ? 'page' : undefined} className={itemClasses(active)}>
            <span className='relative'>
                <Current className='w-6 h-6' />
                {badge && <CartBadge className='-top-1.5 -right-2.5' />}
            </span>
            {label}
        </Link>
    )
}

export default function BottomNav({ currentUser }: { currentUser: SessionUser }) {
    const pathname = usePathname()
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

    return (
        <>
            <nav
                aria-label='منوی اصلی موبایل'
                className='sm:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch
                    pb-[env(safe-area-inset-bottom)] bg-navbar text-text border-t border-navbar-border
                    shadow-[0_-8px_24px_rgba(0,0,0,0.25)]'
            >
                <NavLink href='/' label='خانه' active={pathname === '/'} icon={PiHouseLight} activeIcon={PiHouseFill} />

                <button
                    type='button'
                    onClick={() => setIsCategoriesOpen(true)}
                    aria-haspopup='dialog'
                    aria-expanded={isCategoriesOpen}
                    className={itemClasses(isCategoriesOpen)}
                >
                    {isCategoriesOpen ? <PiSquaresFourFill className='w-6 h-6' /> : <PiSquaresFourLight className='w-6 h-6' />}
                    دسته‌بندی‌ها
                </button>

                <NavLink
                    href='/checkout/cart'
                    label='سبد خرید'
                    active={pathname.startsWith('/checkout')}
                    icon={PiShoppingCartSimpleLight}
                    activeIcon={PiShoppingCartSimpleFill}
                    badge
                />

                <NavLink
                    href='/p-user'
                    label='پروفایل من'
                    active={pathname.startsWith('/p-user')}
                    icon={PiUserCircleLight}
                    activeIcon={PiUserCircleFill}
                />
            </nav>

            {isCategoriesOpen && (
                <CategorySheet currentUser={currentUser} onClose={() => setIsCategoriesOpen(false)} />
            )}
        </>
    )
}
