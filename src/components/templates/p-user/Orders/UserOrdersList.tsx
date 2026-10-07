"use client"

import Link from 'next/link'
import { useState } from 'react'
import { PiPackageLight, PiReceiptLight } from 'react-icons/pi'
import { HiMiniChevronLeft } from 'react-icons/hi2'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import type { UserOrder, OrderStatus } from '@/types/userOrderType'
import { IoCheckmarkCircle } from 'react-icons/io5'

const statusStyle: Record<OrderStatus, string> = {
    "در حال پردازش": "bg-amber-50 text-amber-600",
    "ارسال شده": "bg-sky-50 text-sky-600",
    "تحویل شده": "bg-primary-50 text-primary-600",
    "لغو شده": "bg-danger/10 text-danger",
}

const statusIcon: Record<OrderStatus, React.ReactNode> = {
    "در حال پردازش": <span className='w-2 h-2 rounded-full bg-amber-500 animate-pulse' />,
    "ارسال شده": <span className='w-2 h-2 rounded-full bg-sky-500 animate-pulse' />,
    "تحویل شده": <IoCheckmarkCircle className='w-4.5 h-4.5' />,
    "لغو شده": <span className='w-2 h-2 rounded-full bg-danger' />,
}

type TabKey = 'active' | 'delivered' | 'cancelled'

const tabs: { key: TabKey; label: string }[] = [
    { key: 'active', label: 'جاری' },
    { key: 'delivered', label: 'تحویل داده شده' },
    { key: 'cancelled', label: 'لغو شده' },
]

function matchesTab(status: OrderStatus, tab: TabKey) {
    if (tab === 'active') return status === 'در حال پردازش' || status === 'ارسال شده'
    if (tab === 'delivered') return status === 'تحویل شده'
    return status === 'لغو شده'
}

function getOrderTotal(order: UserOrder) {
    return order.items.reduce((sum, item) => sum + item.price * item.count, 0) + order.shippingCost
}

export default function UserOrdersList({ orders }: { orders: UserOrder[] }) {
    const [activeTab, setActiveTab] = useState<TabKey>('active')

    if (orders.length === 0) {
        return (
            <div className='bg-white shadow-lg rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-4'>
                <span className='flex-center w-16 h-16 bg-primary-50 text-primary-400 rounded-full'>
                    <PiPackageLight className='w-8 h-8' />
                </span>
                <div>
                    <h2 className='font-IranYekanBold text-zinc-700'>هنوز سفارشی ثبت نکرده‌اید</h2>
                    <p className='mt-1.5 text-sm text-zinc-400'>بعد از ثبت اولین سفارش، وضعیت آن اینجا نمایش داده می‌شود.</p>
                </div>
                <Link href='/' className='mt-2 px-6 py-2.5 text-sm text-text linear_btn'>
                    بازگشت به فروشگاه
                </Link>
            </div>
        )
    }
    const counts: Record<TabKey, number> = {
        active: orders.filter(o => matchesTab(o.status, 'active')).length,
        delivered: orders.filter(o => matchesTab(o.status, 'delivered')).length,
        cancelled: orders.filter(o => matchesTab(o.status, 'cancelled')).length,
    }

    const filtered = orders.filter(o => matchesTab(o.status, activeTab))

    return (
        <div className='flex flex-col gap-5'>
            {/* Status Tabs */}
            <div className='flex items-center gap-1 p-1 bg-white shadow-lg rounded-2xl w-fit overflow-x-auto scrollbar-none'>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap rounded-xl transition-colors cursor-pointer
                            ${activeTab === tab.key ? 'bg-primary-500 text-white font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}>
                        {tab.label}
                        <span className='mr-1.5 text-[11px] opacity-80'>({counts[tab.key].toLocaleString('fa-IR')})</span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className='bg-white shadow-lg rounded-2xl py-14 text-center text-sm text-zinc-400'>
                    سفارشی در این دسته یافت نشد.
                </div>
            ) : (
                <div className='flex flex-col gap-4'>
                    {filtered.map(order => {
                        const visibleItems = order.items.slice(0, 5)
                        const hiddenCount = order.items.length - visibleItems.length
                        const detailHref = `/p-user/userOrders/${order._id}`
                        const orderDate = new Date(order.createdAt).toLocaleDateString('fa-IR', { day: 'numeric', month: 'long' })

                        return (
                            <Link
                                href={detailHref}
                                key={order._id}
                                className='group block bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-zinc-200/70 transition-shadow'>

                                {/* Header: status + meta row */}
                                <div className='flex items-center justify-between gap-3 px-4 sm:px-5 pt-4 pb-3.5'>
                                    <span className={`inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-IranYekanMedium px-2.5 py-1 rounded-lg shrink-0 ${statusStyle[order.status]}`}>
                                        {statusIcon[order.status]}
                                        {order.status}
                                    </span>

                                    <HiMiniChevronLeft className='w-4 h-4 text-zinc-300 group-hover:text-primary-500 group-hover:-translate-x-0.5 transition-all shrink-0' />
                                </div>

                                <div className='flex flex-wrap items-center gap-x-2.5 gap-y-1 px-4 sm:px-5 pb-4 text-[11px] sm:text-xs text-zinc-400'>
                                    <span>{orderDate} ۱۴۰۵</span>
                                    <span className='w-0.5 h-0.5 rounded-full bg-zinc-300' />
                                    <span dir='ltr' className='tracking-wide'>{order._id.slice(-10)}</span>
                                    <span className='w-0.5 h-0.5 rounded-full bg-zinc-300' />
                                    <span className='inline-flex items-center gap-0.5'>
                                        مبلغ {getOrderTotal(order).toLocaleString()}
                                        <TomanIcon className='w-3 h-3' />
                                    </span>
                                </div>

                                {/* Product thumbnails */}
                                <div className='flex items-center gap-2 px-4 sm:px-5 pb-4 overflow-x-auto'>
                                    {visibleItems.map(item => (
                                        <span key={item._id} title={item.title} className='w-14 h-14 shrink-0 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden'>
                                            <img src={item.img} alt={item.title} className='w-full h-full object-cover' />
                                        </span>
                                    ))}
                                    {hiddenCount > 0 &&
                                        <span className='flex-center w-14 h-14 shrink-0 text-xs text-zinc-500 bg-gray-50 border border-gray-100 rounded-xl'>
                                            +{hiddenCount.toLocaleString('fa-IR')}
                                        </span>
                                    }
                                </div>

                                {/* Footer */}
                                <div className='flex items-center justify-end gap-1.5 px-4 sm:px-5 py-3 border-t border-gray-100 text-xs sm:text-[13px] text-zinc-500 group-hover:text-primary-600 transition-colors'>
                                    <PiReceiptLight className='w-4 h-4' />
                                    مشاهده فاکتور
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}