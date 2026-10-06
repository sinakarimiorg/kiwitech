"use client"

import Link from 'next/link'
import { useState } from 'react'
import { PiPackageLight } from 'react-icons/pi'
import { HiMiniChevronLeft } from 'react-icons/hi2'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import type { UserOrder, OrderStatus } from '@/types/userOrderType'

const statusStyle: Record<OrderStatus, string> = {
    "در حال پردازش": "bg-amber-50 text-amber-600",
    "ارسال شده": "bg-sky-50 text-sky-600",
    "تحویل شده": "bg-primary-50 text-primary-600",
    "لغو شده": "bg-danger/10 text-danger",
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
                        const itemsCount = order.items.reduce((sum, item) => sum + item.count, 0)
                        const visibleItems = order.items.slice(0, 5)
                        const hiddenCount = order.items.length - visibleItems.length
                        const detailHref = `/p-user/userOrders/${order._id}`

                        return (
                            <div key={order._id} className='bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-zinc-200/70 transition-shadow'>

                                {/* Header — clicking goes to order detail */}
                                <Link href={detailHref} className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 sm:px-6 py-4 border-b border-gray-100'>
                                    <div className='flex items-center gap-2.5'>
                                        <span className='flex-center w-9 h-9 bg-primary-50 text-primary-600 rounded-lg shrink-0'>
                                            <PiPackageLight className='w-5 h-5' />
                                        </span>
                                        <div>
                                            <p className='font-IranYekanMedium text-sm text-zinc-700 tracking-wide' dir='ltr'>
                                                {order._id.slice(-8).toUpperCase()}
                                            </p>
                                            <p className='text-xs text-zinc-400'>
                                                {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`self-start sm:self-auto px-3 py-1.5 text-xs rounded-lg ${statusStyle[order.status]}`}>
                                        {order.status}
                                    </span>
                                </Link>

                                {/* Product thumbnails only — each links to its own product page when available */}
                                <div className='flex items-center gap-2 px-5 sm:px-6 py-4 overflow-x-auto'>
                                    {visibleItems.map(item => {
                                        const productHref = item.product?.linkName ? `/product-info/${item.product.linkName}` : null
                                        const image = <img src={item.img} alt={item.title} className='w-full h-full object-cover' />

                                        return productHref ? (
                                            <Link
                                                key={item._id}
                                                href={productHref}
                                                title={item.title}
                                                className='w-14 h-14 shrink-0 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden hover:border-primary-300 transition-colors'>
                                                {image}
                                            </Link>
                                        ) : (
                                            <span key={item._id} title={item.title} className='w-14 h-14 shrink-0 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden'>
                                                {image}
                                            </span>
                                        )
                                    })}
                                    {hiddenCount > 0 &&
                                        <Link href={detailHref} className='flex-center w-14 h-14 shrink-0 text-xs text-zinc-500 bg-gray-50 border border-gray-100 rounded-xl hover:border-primary-300 transition-colors'>
                                            +{hiddenCount.toLocaleString('fa-IR')}
                                        </Link>
                                    }
                                </div>

                                {/* Footer — clicking goes to order detail */}
                                <Link href={detailHref} className='flex items-center justify-between gap-3 px-5 sm:px-6 py-4 bg-gray-50/60 hover:bg-gray-50 transition-colors'>
                                    <span className='text-xs text-zinc-500'>{itemsCount.toLocaleString('fa-IR')} کالا</span>
                                    <div className='flex items-center gap-3'>
                                        <span className='inline-flex items-center gap-1 font-IranYekanBold text-zinc-800'>
                                            {getOrderTotal(order).toLocaleString()}
                                            <TomanIcon />
                                        </span>
                                        <span className='flex items-center gap-1 text-xs sm:text-sm text-primary-600'>
                                            مشاهده جزئیات
                                            <HiMiniChevronLeft className='w-4 h-4' />
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}