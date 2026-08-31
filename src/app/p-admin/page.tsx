import Layout from '@root/src/components/layouts/AdminPanelLayout'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import SalesPulse from '@root/src/components/templates/P-admin/Index/SalesPulse'
import StatCard from '@root/src/components/templates/P-admin/Index/StatCard'
import Link from 'next/link'
import { connectDB } from '@root/src/lib/mongodb'
import OrderModel from '@root/src/models/Order'
import ProductModel from '@root/src/models/Product'
import CommentModel from '@root/src/models/Comment'
import { getOrderTotal, statusStyle } from '@root/src/types/adminOrderType'
import type { AdminOrder } from '@root/src/types/adminOrderType'

import {
    PiShoppingBagOpenLight,
    PiUsersLight,
    PiWalletLight,
    PiChatCircleTextLight,
    PiWarningCircleLight,
} from 'react-icons/pi'

export const dynamic = "force-dynamic"

const weekDays = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"]

function toPersianWeekdayIndex(jsDay: number) {
    return (jsDay + 1) % 7
}

const LOW_STOCK_THRESHOLD = 5

const page = async () => {
    await connectDB()

    const [ordersRaw, lowStockRaw, pendingCommentsCount] = await Promise.all([
        OrderModel.find({}).sort({ _id: -1 }).limit(200).lean(),
        ProductModel.find({ stock: { $lte: LOW_STOCK_THRESHOLD } }).sort({ stock: 1 }).limit(5).lean(),
        CommentModel.countDocuments({ status: "در انتظار بررسی" }),
    ])

    const allOrders: AdminOrder[] = JSON.parse(JSON.stringify(ordersRaw))
    const lowStockProducts = JSON.parse(JSON.stringify(lowStockRaw)) as { _id: string; name: string; stock: number }[]

    // ** Set Dates **-----------
    const now = new Date()
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)
    const startOfYesterday = new Date(startOfToday)
    startOfYesterday.setDate(startOfToday.getDate() - 1)
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 7)
    // ----------------------------

    const isSameOrAfter = (dateStr: string | undefined, ref: Date) => (dateStr ? new Date(dateStr) >= ref : false)
    const isBetween = (dateStr: string | undefined, start: Date, end: Date) => {
        if (!dateStr) return false
        const d = new Date(dateStr)
        return d >= start && d < end
    }
    const notCancelled = (o: AdminOrder) => o.status !== "لغو شده"

    const todaysOrders = allOrders.filter(o => isSameOrAfter(o.createdAt, startOfToday) && notCancelled(o))
    const yesterdaysOrders = allOrders.filter(o => isBetween(o.createdAt, startOfYesterday, startOfToday) && notCancelled(o))

    const todaySales = todaysOrders.reduce((sum, o) => sum + getOrderTotal(o), 0)
    const yesterdaySales = yesterdaysOrders.reduce((sum, o) => sum + getOrderTotal(o), 0)
    const salesTrend = yesterdaySales > 0 ? Math.round(((todaySales - yesterdaySales) / yesterdaySales) * 100) : null

    const newOrdersToday = todaysOrders.length
    const newOrdersYesterday = yesterdaysOrders.length
    const ordersTrend = newOrdersYesterday > 0 ? Math.round(((newOrdersToday - newOrdersYesterday) / newOrdersYesterday) * 100) : null

    const customersWithOrders = new Set(allOrders.map(o => o.phone).filter(Boolean)).size

    const weekBuckets = weekDays.map(day => ({ day, value: 0 }))
    allOrders.forEach(o => {
        if (!o.createdAt) return
        const d = new Date(o.createdAt)
        if (d < sevenDaysAgo) return
        weekBuckets[toPersianWeekdayIndex(d.getDay())].value += 1
    })
    const totalWeeklyOrders = weekBuckets.reduce((sum, d) => sum + d.value, 0)

    const recentOrders = allOrders.slice(0, 5)

    return (
        <Layout>
            <main className='flex-1 min-w-0'>
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <StatCard
                            label="فروش امروز"
                            value={`${todaySales.toLocaleString()} تومان`}
                            icon={PiWalletLight}
                            accent="primary"
                            trend={salesTrend !== null ? { value: `${Math.abs(salesTrend)}٪`, positive: salesTrend >= 0 } : undefined}
                        />
                        <StatCard
                            label="سفارش‌های جدید امروز"
                            value={newOrdersToday.toLocaleString('fa-IR')}
                            icon={PiShoppingBagOpenLight}
                            accent="neon"
                            trend={ordersTrend !== null ? { value: `${Math.abs(ordersTrend)}٪`, positive: ordersTrend >= 0 } : undefined}
                        />
                        <StatCard label="مشتریان دارای سفارش" value={customersWithOrders.toLocaleString('fa-IR')} icon={PiUsersLight} accent="primary" />
                        <StatCard label="نظرات در انتظار تایید" value={pendingCommentsCount.toLocaleString('fa-IR')} icon={PiChatCircleTextLight} accent="danger" />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Sales Pulse */}
                        <div className="xl:col-span-2">
                            <SalesPulse weekData={weekBuckets} totalCount={totalWeeklyOrders} />
                        </div>

                        {/* Low Stock */}
                        <div className="bg-white shadow-lg rounded-2xl p-5 sm:p-6">
                            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
                                <PiWarningCircleLight className="w-5 h-5 text-amber-500" />
                                <h2 className="font-IranYekanBold text-base text-zinc-800">موجودی رو به اتمام</h2>
                            </div>
                            <div className="flex flex-col gap-4">
                                {lowStockProducts.length > 0 ? (
                                    lowStockProducts.map(p => (
                                        <div key={p._id} className="flex items-center justify-between gap-3">
                                            <p className="text-sm text-zinc-600 line-clamp-1">{p.name}</p>
                                            <span className="shrink-0 px-2.5 py-1 text-xs font-IranYekanMedium text-danger bg-danger/10 rounded-lg">
                                                {p.stock} عدد
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-sm text-center text-zinc-400">موجودی رو به اتمامی وجود ندارد.</p>
                                )}
                            </div>
                            <Link href="/p-admin/products" className="flex-center gap-1.5 w-full mt-5 py-2.5 text-sm text-primary-600 hover:text-primary-700 border border-dashed border-primary-300 rounded-xl transition-colors">
                                مدیریت موجودی محصولات
                            </Link>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                            <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">آخرین سفارش‌ها</h2>
                            <Link href="/p-admin/orders" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                                مشاهده همه
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-right text-xs text-zinc-400 border-b border-gray-100">
                                        <th className="font-IranYekanMedium px-5 sm:px-6 py-3">شماره سفارش</th>
                                        <th className="font-IranYekanMedium px-3 py-3">مشتری</th>
                                        <th className="font-IranYekanMedium px-3 py-3">مبلغ</th>
                                        <th className="font-IranYekanMedium px-3 py-3">وضعیت</th>
                                        <th className="font-IranYekanMedium px-3 py-3">تاریخ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map(order => (
                                            <tr key={order._id} className="hover:bg-primary-50/30 transition-colors">
                                                <td className="px-5 sm:px-6 py-3.5 font-IranYekanMedium text-zinc-700 tracking-wide" dir='ltr'>
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </td>
                                                <td className="px-3 py-3.5 text-zinc-600">{order.customer}</td>
                                                <td className="px-3 py-3.5">
                                                    <span className="inline-flex items-center gap-1 text-zinc-700">
                                                        {getOrderTotal(order).toLocaleString()}
                                                        <TomanIcon className="w-3 h-3" />
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3.5">
                                                    <span className={`px-2.5 py-1 text-xs rounded-lg ${statusStyle[order.status]}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3.5 text-zinc-400">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '—'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-10 text-center text-zinc-400">سفارشی ثبت نشده است.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default page