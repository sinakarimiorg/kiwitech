import Link from 'next/link'
import { PiPackageLight } from "react-icons/pi";
import { HiMiniChevronLeft } from "react-icons/hi2";
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import type { UserOrder, OrderStatus } from '@root/src/types/userOrderType'


const statusStyle: Record<OrderStatus, string> = {
    "در حال پردازش": "bg-amber-50 text-amber-600",
    "ارسال شده": "bg-sky-50 text-sky-600",
    "تحویل شده": "bg-primary-50 text-primary-600",
    "لغو شده": "bg-danger/10 text-danger",
}

function getOrderTotal(order: UserOrder) {
    return order.items.reduce((sum, item)=> sum + item.price * item.count, 0) + order.shippingCost
}

export default function RecentOrders({ orders }: { orders: UserOrder[] }) {
    return (
        <div className='bg-white shadow-lg rounded-2xl p-5 mt-6'>

            {/* Card Header */}
            <div className='flex items-center justify-between pb-4 mb-2 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiPackageLight className='w-5 sm:w-6 h-5 sm:h-6 text-primary-500' />
                    آخرین سفارش‌ها
                </h2>
            </div>

            {orders.length === 0 ? (
                <div className='flex items-center justify-between py-4'>
                    <p className='text-sm text-zinc-400'>هنوز سفارشی ثبت نکرده‌اید.</p>

                    <Link href='/p-user/userOrders' className='group flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors'>
                        دیدن همه‌ی سفارش‌های من
                        <span className='flex-center w-8 h-8 bg-primary-50 rounded-full group-hover:bg-primary-100 transition-colors'>
                            <HiMiniChevronLeft className='w-4 h-4' />
                        </span>
                    </Link>
                </div>
            ) : (
                <div className='flex flex-col divide-y divide-gray-50'>
                    {orders.map(order => (
                        <div key={order._id} className='flex flex-wrap items-center justify-between gap-2 py-3.5'>
                            <div>
                                <p className='text-sm text-zinc-700 tracking-wide' dir='ltr'>{order._id.slice(-8).toUpperCase()}</p>
                                <p className='text-xs text-zinc-400 mt-1'>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs rounded-lg ${statusStyle[order.status]}`}>
                                {order.status}
                            </span>
                            <span className='inline-flex items-center gap-1 text-sm font-IranYekanMedium text-zinc-700'>
                                {getOrderTotal(order).toLocaleString()}
                                <TomanIcon className='w-3 h-3' />
                            </span>
                        </div>
                    ))}

                    <Link href='/p-user/userOrders' className='group flex items-center justify-center gap-2 pt-4 text-sm text-primary-600 hover:text-primary-700 transition-colors'>
                        دیدن همه‌ی سفارش‌های من
                        <HiMiniChevronLeft className='w-4 h-4' />
                    </Link>
                </div>
            )}
        </div>
    )
}
