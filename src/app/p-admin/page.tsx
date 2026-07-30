import Layout from '@root/src/components/layouts/AdminPanelLayout'
import TomanIcon from '@root/src/components/modules/icons/TomanIcon'
import SalesPulse from '@root/src/components/templates/p-admin/SalesPulse/SalesPulse'
import StatCard from '@root/src/components/templates/p-admin/StatCard/StatCard'
import Link from 'next/link'

import {
    PiShoppingBagOpenLight,
    PiUsersLight,
    PiWalletLight,
    PiChatCircleTextLight,
    PiWarningCircleLight,
} from 'react-icons/pi'

type Order = {
    id: string
    customer: string
    total: number
    status: 'در حال پردازش' | 'ارسال شده' | 'تحویل شده' | 'لغو شده'
    date: string
}

const recentOrders: Order[] = [
    { id: '۱۴۰۴۰۹۲۳۱۸', customer: 'سینا کریمی', total: 1450000, status: 'در حال پردازش', date: '۱۴۰۴/۰۴/۰۸' },
    { id: '۱۴۰۴۰۹۲۳۱۷', customer: 'علی رضایی', total: 890000, status: 'ارسال شده', date: '۱۴۰۴/۰۴/۰۸' },
    { id: '۱۴۰۴۰۹۲۳۱۶', customer: 'مریم احمدی', total: 2340000, status: 'تحویل شده', date: '۱۴۰۴/۰۴/۰۷' },
    { id: '۱۴۰۴۰۹۲۳۱۵', customer: 'حسین نوری', total: 560000, status: 'لغو شده', date: '۱۴۰۴/۰۴/۰۷' },
    { id: '۱۴۰۴۰۹۲۳۱۴', customer: 'زهرا محمدی', total: 1120000, status: 'تحویل شده', date: '۱۴۰۴/۰۴/۰۶' },
]

const statusStyle: Record<Order['status'], string> = {
    'در حال پردازش': 'bg-amber-50 text-amber-600',
    'ارسال شده': 'bg-sky-50 text-sky-600',
    'تحویل شده': 'bg-primary-50 text-primary-600',
    'لغو شده': 'bg-danger/10 text-danger',
}

const lowStockProducts = [
    { title: 'هندزفری بلوتوثی کربی مدل CR-T107', stock: 3 },
    { title: 'پاوربانک انکر مدل PowerCore 10000', stock: 1 },
    { title: 'کابل شارژ مولتی رابط مدل ایکس', stock: 4 },
]
function page() {
    return (
        <Layout>
            <main className='flex-1 min-w-0'>
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <StatCard label="فروش امروز" value="۳۲,۴۰۰,۰۰۰ تومان" icon={PiWalletLight} accent="primary" trend={{ value: '۱۲٪', positive: true }} />
                        <StatCard label="سفارش‌های جدید" value="۱۲" icon={PiShoppingBagOpenLight} accent="neon" trend={{ value: '۴٪', positive: true }} />
                        <StatCard label="مشتریان فعال" value="۸۷۶" icon={PiUsersLight} accent="primary" trend={{ value: '۲٪', positive: false }} />
                        <StatCard label="نظرات در انتظار تایید" value="۵" icon={PiChatCircleTextLight} accent="danger" />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Sales Pulse */}
                        <div className="xl:col-span-2">
                            <SalesPulse />
                        </div>

                        {/* Low Stock */}
                        <div className="bg-white shadow-lg rounded-2xl p-5 sm:p-6">
                            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
                                <PiWarningCircleLight className="w-5 h-5 text-amber-500" />
                                <h2 className="font-IranYekanBold text-base text-zinc-800">موجودی رو به اتمام</h2>
                            </div>
                            <div className="flex flex-col gap-4">
                                {lowStockProducts.map(p => (
                                    <div key={p.title} className="flex items-center justify-between gap-3">
                                        <p className="text-sm text-zinc-600 line-clamp-1">{p.title}</p>
                                        <span className="shrink-0 px-2.5 py-1 text-xs font-IranYekanMedium text-danger bg-danger/10 rounded-lg">
                                            {p.stock} عدد
                                        </span>
                                    </div>
                                ))}
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
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-primary-50/30 transition-colors">
                                            <td className="px-5 sm:px-6 py-3.5 font-IranYekanMedium text-zinc-700 tracking-wide">{order.id}</td>
                                            <td className="px-3 py-3.5 text-zinc-600">{order.customer}</td>
                                            <td className="px-3 py-3.5">
                                                <span className="inline-flex items-center gap-1 text-zinc-700">
                                                    {order.total.toLocaleString()}
                                                    <TomanIcon className="w-3 h-3" />
                                                </span>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <span className={`px-2.5 py-1 text-xs rounded-lg ${statusStyle[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3.5 text-zinc-400">{order.date}</td>
                                        </tr>
                                    ))}
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