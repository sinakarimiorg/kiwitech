import Link from 'next/link'
import { PiClockCounterClockwiseLight } from 'react-icons/pi'
import { HiMiniChevronLeft } from "react-icons/hi2";
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import { statusStyle, getOrderTotal } from '@root/src/types/adminOrderType'
import type { AdminOrder } from '@root/src/types/adminOrderType'


export default function RecentOrders({ orders }: { orders: AdminOrder[] }) {
    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>

            <div className='flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiClockCounterClockwiseLight className='w-5 sm:w-6 h-5 sm:h-6 text-primary-500' />
                    سفارش‌های قبلی
                </h2>
                <Link href='/p-user/userOrders' className='flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors'>
                    دیدن همه
                    <HiMiniChevronLeft className='w-4 h-4' />
                </Link>
            </div>

            {orders.length === 0 ? (
                <p className='px-5 py-10 text-sm text-center text-zinc-400'>
                    هنوز سفارش تحویل‌شده یا لغوشده‌ای ندارید.
                </p>
            ) : (
                <div className='divide-y divide-gray-50'>
                    {orders.map(order => {
                        const itemsCount = order.items.reduce((sum, item) => sum + item.count, 0)

                        return (
                            <Link
                                key={order._id}
                                href='/p-user/userOrders'
                                className='flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 sm:px-6 py-4 hover:bg-primary-50/30 transition-colors'
                            >
                                <div>
                                    <p className='font-IranYekanBold text-sm text-zinc-800 tracking-wide' dir='ltr'>
                                        #{order._id.slice(-8).toUpperCase()}
                                    </p>
                                    <p className='mt-1 text-xs text-zinc-400'>
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '—'}
                                        <span className='mr-2'>{itemsCount.toLocaleString('fa-IR')} کالا</span>
                                    </p>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <span className='inline-flex items-center gap-1 text-sm text-zinc-700'>
                                        {getOrderTotal(order).toLocaleString()}
                                        <TomanIcon className='w-3 h-3' />
                                    </span>
                                    <span className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-lg ${statusStyle[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
