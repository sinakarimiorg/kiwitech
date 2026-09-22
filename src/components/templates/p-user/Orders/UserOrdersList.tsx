import Link from 'next/link'
import { PiPackageLight, PiMapPinLight, PiCreditCardLight } from 'react-icons/pi'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import type { UserOrder, OrderStatus } from '@/types/userOrderType'

const statusStyle: Record<OrderStatus, string> = {
    "در حال پردازش": "bg-amber-50 text-amber-600",
    "ارسال شده": "bg-sky-50 text-sky-600",
    "تحویل شده": "bg-primary-50 text-primary-600",
    "لغو شده": "bg-danger/10 text-danger",
}

function getOrderTotal(order: UserOrder) {
    return order.items.reduce((sum, item) => sum + item.price * item.count, 0) + order.shippingCost
}

export default function UserOrdersList({orders}: {orders: UserOrder[]}) {
    if(orders.length === 0){
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

        return (
        <div className='flex flex-col gap-5'>
            {orders.map(order => (
                <div key={order._id} className='bg-white shadow-lg rounded-2xl overflow-hidden'>
                    {/* Header */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 sm:px-6 py-4 border-b border-gray-100'>
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
                    </div>

                    {/* Items */}
                    <div className='divide-y divide-gray-50'>
                        {order.items.map(item => (
                            <div key={item._id} className='flex items-center gap-3 px-5 sm:px-6 py-3.5'>
                                <div className='w-14 h-14 shrink-0 bg-gray-50 rounded-lg overflow-hidden'>
                                    <img src={item.img} className='w-full h-full object-cover' alt={item.title} />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm text-zinc-700 line-clamp-1'>{item.title}</p>
                                    <p className='text-xs text-zinc-400 mt-1'>
                                        {item.count.toLocaleString('fa-IR')} عدد × {item.price.toLocaleString()} تومان
                                    </p>
                                </div>
                                <span className='inline-flex items-center gap-1 text-sm font-IranYekanMedium text-zinc-700 shrink-0'>
                                    {(item.price * item.count).toLocaleString()}
                                    <TomanIcon className='w-3 h-3' />
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-4 bg-gray-50/60'>
                        <div className='flex items-center gap-4 text-xs text-zinc-500'>
                            <span className='flex items-center gap-1.5'>
                                <PiMapPinLight className='w-4 h-4' />
                                <span className='line-clamp-1 max-w-52'>{order.address}</span>
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <PiCreditCardLight className='w-4 h-4' />
                                درگاه بانکی
                            </span>
                        </div>
                        <span className='inline-flex items-center gap-1 font-IranYekanBold text-zinc-800'>
                            مبلغ نهایی:
                            {getOrderTotal(order).toLocaleString()}
                            <TomanIcon />
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}