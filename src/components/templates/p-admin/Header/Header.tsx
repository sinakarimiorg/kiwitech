"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
    PiMagnifyingGlassLight,
    PiBellLight,
    PiUserCircleLight,
    PiShoppingBagOpenLight,
    PiChatCircleTextLight,
    PiWarningCircleLight,
} from 'react-icons/pi'
import type { AdminNotificationsData } from '@root/src/lib/admin/notifications'


type AdminTopbarProps = {
    notifications?: AdminNotificationsData
}

export default function AdminTopbar({ notifications }: AdminTopbarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const totalCount = notifications?.totalCount ?? 0

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 mb-4 bg-white shadow-sm">
            <h1 className="font-MorabbaBold text-lg sm:text-xl text-zinc-800">پـنل مـدیـریـت</h1>

            <div className="flex items-center gap-3 sm:gap-5">
                {/* Search Box  */}
                <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors">
                    <PiMagnifyingGlassLight className="w-4 h-4 shrink-0" />
                    <input
                        type="text"
                        placeholder="جستجو در سفارش‌ها، محصولات..."
                        className="w-full bg-transparent outline-none placeholder:text-zinc-400"
                    />
                </div>

                {/* Notifications */}
                <div className='relative' ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(prev => !prev)}
                        className="relative p-2 text-zinc-500 hover:text-primary-600 transition-colors cursor-pointer">
                        <PiBellLight className="w-5 h-5" />
                        {totalCount > 0 &&
                            <span className="absolute top-1 left-1.5 w-2 h-2 bg-danger rounded-full" />
                        }
                    </button>

                    {isOpen && (
                        <div className='absolute left-0 top-full mt-2 w-80 sm:w-96 max-h-100 overflow-y-auto bg-white border border-gray-100 shadow-2xl rounded-2xl z-20'>

                            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
                                <h3 className='font-IranYekanBold text-sm text-zinc-800'>اعلان‌ها</h3>
                                {totalCount > 0 &&
                                    <span className='px-2 py-0.5 text-xs font-IranYekanMedium text-white bg-primary-500 rounded-full'>{totalCount}</span>
                                }
                            </div>

                            {totalCount === 0 ? (
                                <div className='py-10 text-center text-sm text-zinc-400'>اعلان جدیدی وجود ندارد.</div>
                            ) : (
                                <div className='flex flex-col'>

                                    {notifications && notifications.pendingOrders.length > 0 && (
                                        <div className='px-4 py-3 border-b border-gray-50'>
                                            <p className='flex items-center gap-1.5 mb-2 text-xs text-zinc-400'>
                                                <PiShoppingBagOpenLight className='w-3.5 h-3.5' />
                                                سفارش‌های در حال پردازش
                                            </p>
                                            <div className='flex flex-col gap-1'>
                                                {notifications.pendingOrders.map(item => (
                                                    <Link
                                                        key={item.id}
                                                        href='/p-admin/orders'
                                                        onClick={() => setIsOpen(false)}
                                                        className='flex items-center justify-between gap-2 px-2.5 py-2 hover:bg-gray-50 rounded-lg transition-colors'>
                                                        <span className='text-xs sm:text-sm text-zinc-700 line-clamp-1'>{item.title}</span>
                                                        <span className='text-[11px] text-zinc-400 shrink-0'>{item.subtitle}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {notifications && notifications.pendingComments.length > 0 && (
                                        <div className='px-4 py-3 border-b border-gray-50'>
                                            <p className='flex items-center gap-1.5 mb-2 text-xs text-zinc-400'>
                                                <PiChatCircleTextLight className='w-3.5 h-3.5' />
                                                نظرات در انتظار بررسی
                                            </p>
                                            <div className='flex flex-col gap-1'>
                                                {notifications.pendingComments.map(item => (
                                                    <Link
                                                        key={item.id}
                                                        href='/p-admin/comments'
                                                        onClick={() => setIsOpen(false)}
                                                        className='flex items-center justify-between gap-2 px-2.5 py-2 hover:bg-gray-50 rounded-lg transition-colors'>
                                                        <span className='text-xs sm:text-sm text-zinc-700 line-clamp-1'>{item.title}</span>
                                                        <span className='text-[11px] text-zinc-400 shrink-0 line-clamp-1 max-w-24'>{item.subtitle}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {notifications && notifications.lowStockProducts.length > 0 && (
                                        <div className='px-4 py-3'>
                                            <p className='flex items-center gap-1.5 mb-2 text-xs text-zinc-400'>
                                                <PiWarningCircleLight className='w-3.5 h-3.5 text-amber-500' />
                                                موجودی رو به اتمام
                                            </p>
                                            <div className='flex flex-col gap-1'>
                                                {notifications.lowStockProducts.map(item => (
                                                    <Link
                                                        key={item.id}
                                                        href='/p-admin/products'
                                                        onClick={() => setIsOpen(false)}
                                                        className='flex items-center justify-between gap-2 px-2.5 py-2 hover:bg-gray-50 rounded-lg transition-colors'>
                                                        <span className='text-xs sm:text-sm text-zinc-700 line-clamp-1'>{item.title}</span>
                                                        <span className='text-[11px] text-danger shrink-0'>{item.subtitle}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Admin Sectio  */}
                <div className="flex items-center gap-2.5 pr-3 sm:border-r border-gray-200">
                    <span className="flex-center w-9 h-9 bg-primary-50 text-primary-600 rounded-full">
                        <PiUserCircleLight className="w-6 h-6" />
                    </span>
                    <div className="hidden sm:block">
                        <p className="font-IranYekanMedium text-sm text-zinc-800">سینا کریمی</p>
                        <p className="text-xs text-zinc-400">مدیر فروشگاه</p>
                    </div>
                </div>
            </div>
        </div>
    )
}