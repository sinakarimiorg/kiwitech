import Link from 'next/link'
import {
    PiHourglassLight,
    PiTruckLight,
    PiCheckCircleLight,
    PiXCircleLight,
    PiPackageLight,
    PiCheckBold,
} from 'react-icons/pi'
import { HiMiniChevronLeft } from 'react-icons/hi2'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import { statusStyle, getOrderTotal, AdminOrder, OrderStatus } from '@root/src/types/adminOrderType'

const ORDERS_HREF = '/p-user/userOrders'

type OrderCounts = {
    processing: number
    shipped: number
    delivered: number
    cancelled: number
}

type OrdersOverviewProps = {
    counts: OrderCounts
    activeOrders: AdminOrder[]
}

const statusConfigs = [
    { key: 'processing', label: 'در حال پردازش', icon: PiHourglassLight, color: 'bg-amber-50 text-amber-600' },
    { key: 'shipped', label: 'ارسال شده', icon: PiTruckLight, color: 'bg-sky-50 text-sky-600' },
    { key: 'delivered', label: 'تحویل شده', icon: PiCheckCircleLight, color: 'bg-primary-50 text-primary-600' },
    { key: 'cancelled', label: 'لغو شده', icon: PiXCircleLight, color: 'bg-danger/10 text-danger' },
] as const

const progressSteps: OrderStatus[] = ['در حال پردازش', 'ارسال شده', 'تحویل شده']

function OrderProgress({ status }: { status: OrderStatus }) {
    const current = progressSteps.indexOf(status)

    return (
        <div className='flex items-start'>
            {progressSteps.map((step, i) => {
                const isDone = i < current
                const isActive = i === current
                const isLast = i === progressSteps.length - 1

                return (
                    <div key={step} className={`flex items-start ${isLast ? '' : 'flex-1'}`}>
                        <div className='flex flex-col items-center gap-1.5'>
                            <span className={`flex-center w-7 h-7 rounded-full border-2 text-xs
                                ${isDone
                                    ? 'bg-primary-500 border-primary-500 text-white'
                                    : isActive
                                        ? 'bg-white border-primary-500 text-primary-600 ring-4 ring-primary-100'
                                        : 'bg-white border-gray-200 text-zinc-300'}`}>
                                {isDone ? <PiCheckBold className='w-3.5 h-3.5' /> : (i + 1).toLocaleString('fa-IR')}
                            </span>
                            <span className={`text-[11px] whitespace-nowrap
                                ${isActive ? 'text-primary-600 font-IranYekanBold' : isDone ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                {step}
                            </span>
                        </div>

                        {!isLast &&
                            <span className={`flex-1 h-0.5 mx-2 mt-3.5 rounded-full ${isDone ? 'bg-primary-500' : 'bg-gray-200'}`} />
                        }
                    </div>
                )
            })}
        </div>
    )
}

export default function OrdersOverview({ counts, activeOrders }: OrdersOverviewProps) {
    return (
        <div className='bg-white shadow-lg rounded-2xl p-5 sm:p-6'>

            {/* Header */}
            <div className='flex items-center justify-between pb-4 mb-5 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiPackageLight className='w-5 sm:w-6 h-5 sm:h-6 text-primary-500' />
                    وضعیت سفارش‌ها
                </h2>
                <Link href={ORDERS_HREF} className='flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors'>
                    مشاهده همه
                    <HiMiniChevronLeft className='w-4 h-4' />
                </Link>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {statusConfigs.map(tile => {
                    const Icon = tile.icon
                    return (
                        <Link
                            key={tile.key}
                            href={ORDERS_HREF}
                            className='flex flex-col items-center gap-2 py-4 bg-gray-50 hover:bg-primary-50/60 rounded-xl transition-colors'
                        >
                            <span className={`flex-center w-10 h-10 rounded-full ${tile.color}`}>
                                <Icon className='w-5 h-5' />
                            </span>
                            <span className='font-IranYekanBold text-lg text-zinc-800'>
                                {counts[tile.key].toLocaleString('fa-IR')}
                            </span>
                            <span className='text-xs text-zinc-500'>{tile.label}</span>
                        </Link>
                    )
                })}
            </div>

            <h3 className='mt-7 mb-4 text-sm text-zinc-500'>
                سفارش‌های جاری
                {activeOrders.length > 0 && <span className='mr-1.5 text-zinc-400'>({activeOrders.length.toLocaleString('fa-IR')})</span>}
            </h3>

            {activeOrders.length === 0 ? (
                <div className='flex flex-col items-center gap-3 py-8 text-center border border-dashed border-gray-200 rounded-2xl'>
                    <span className='flex-center w-14 h-14 bg-primary-50 text-primary-400 rounded-full'>
                        <PiPackageLight className='w-7 h-7' />
                    </span>
                    <p className='text-sm text-zinc-400'>الان سفارش جاری‌ای ندارید.</p>
                    <Link href='/products/1' className='px-5 py-2 text-sm text-text linear_btn'>
                        شروع خرید
                    </Link>
                </div>
            ) : (
                <div className='flex flex-col gap-4'>
                    {activeOrders.map(order => {
                        const itemsCount = order.items.reduce((sum, item) => sum + item.count, 0)
                        const visibleItems = order.items.slice(0, 3)
                        const hiddenCount = order.items.length - visibleItems.length

                        return (
                            <div key={order._id} className='p-4 sm:p-5 border border-gray-100 rounded-2xl'>
                                <div className='flex items-center justify-between gap-3'>
                                    <div>
                                        <p className='font-IranYekanBold text-sm text-zinc-800 tracking-wide' dir='ltr'>
                                            #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className='mt-1 text-xs text-zinc-400'>
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '—'}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 text-xs rounded-lg ${statusStyle[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className='flex items-center justify-between gap-3 mt-4'>
                                    <div className='flex items-center gap-2'>
                                        {visibleItems.map((item, index) => (
                                            <span key={index} className='w-12 h-12 shrink-0 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden'>
                                                <img src={item.img} alt={item.title} className='w-full h-full object-cover' />
                                            </span>
                                        ))}
                                        {hiddenCount > 0 &&
                                            <span className='flex-center w-12 h-12 shrink-0 text-xs text-zinc-500 bg-gray-50 border border-gray-100 rounded-xl'>
                                                +{hiddenCount.toLocaleString('fa-IR')}
                                            </span>
                                        }
                                    </div>

                                    <div className='text-left'>
                                        <p className='text-xs text-zinc-400'>{itemsCount.toLocaleString('fa-IR')} کالا</p>
                                        <p className='inline-flex items-center gap-1 mt-1 font-IranYekanBold text-zinc-800'>
                                            {getOrderTotal(order).toLocaleString()}
                                            <TomanIcon className='w-3.5 h-3.5' />
                                        </p>
                                    </div>
                                </div>

                                <div className='mt-5 pt-5 border-t border-dashed border-gray-200'>
                                    <OrderProgress status={order.status} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
