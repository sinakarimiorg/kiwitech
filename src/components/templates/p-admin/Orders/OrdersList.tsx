"use client"

import { useState } from "react"
import {
    PiMagnifyingGlassLight,
    PiEyeLight,
    PiShoppingBagOpenLight,
    PiUserCircleLight,
} from "react-icons/pi"
import type { AdminOrder, OrderStatus } from "@root/src/types/adminOrderType"
import { statusStyle, getOrderTotal } from "@root/src/types/adminOrderType"


const statusOptions: OrderStatus[] = ["در حال پردازش", "ارسال شده", "تحویل شده", "لغو شده"]
const filters: ("همه" | OrderStatus)[] = ["همه", "در حال پردازش", "ارسال شده", "تحویل شده", "لغو شده"]

type OrdersListProps = {
    orders: AdminOrder[]
    onView: (order: AdminOrder) => void
    onStatusChange: (id: string, status: OrderStatus) => void
}

export default function OrdersList({ orders, onView, onStatusChange }: OrdersListProps) {
    const [search, setSearch] = useState("")
    const [activeFilter, setActiveFilter] = useState<"همه" | OrderStatus>("همه")

    const filtered = orders.filter(o => {
        const matchesSearch = o.customer.includes(search) || o._id.includes(search) || o.phone.includes(search)
        const matchesFilter = activeFilter === "همه" || o.status === activeFilter
        return matchesSearch && matchesFilter
    })

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiShoppingBagOpenLight className='w-5 h-5 text-primary-500' />
                    لیست سفارش‌ها
                    <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                </h2>

                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-xl text-xs overflow-x-auto'>
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 whitespace-nowrap rounded-lg transition-colors cursor-pointer
                                    ${activeFilter === f
                                        ? "bg-primary-500 text-white font-IranYekanMedium"
                                        : "text-zinc-500 hover:text-zinc-700"}`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className='hidden lg:flex items-center gap-2 px-3.5 py-2 w-56 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                        <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type='text'
                            placeholder='مشتری یا شماره سفارش...'
                            className='w-full bg-transparent outline-none placeholder:text-zinc-400'
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='text-right text-xs text-zinc-400 border-b border-gray-100'>
                            <th className='font-IranYekanMedium px-5 sm:px-6 py-3'>شماره سفارش</th>
                            <th className='font-IranYekanMedium px-3 py-3'>مشتری</th>
                            <th className='font-IranYekanMedium px-3 py-3'>تعداد اقلام</th>
                            <th className='font-IranYekanMedium px-3 py-3'>مبلغ</th>
                            <th className='font-IranYekanMedium px-3 py-3'>وضعیت</th>
                            <th className='font-IranYekanMedium px-3 py-3'>تاریخ</th>
                            <th className='font-IranYekanMedium px-3 py-3'>عملیات</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {filtered.map(order => (
                            <tr key={order._id} className='hover:bg-primary-50/30 transition-colors'>
                                <td className='px-5 sm:px-6 py-3.5 font-IranYekanMedium text-zinc-700 tracking-wide' >
                                    #{order._id.slice(-8).toUpperCase()}
                                </td>
                                <td className='px-3 py-3.5'>
                                    <div className='flex items-center gap-2'>
                                        <PiUserCircleLight className='w-5 h-5 text-zinc-400' />
                                        <span className='text-zinc-600'>{order.customer}</span>
                                    </div>
                                </td>
                                <td className='px-3 py-3.5 text-zinc-500'>
                                    {order.items.reduce((s, i) => s + i.count, 0)} عدد
                                </td>
                                <td className='px-3 py-3.5 font-IranYekanMedium text-zinc-700'>
                                    {getOrderTotal(order).toLocaleString()} تومان
                                </td>
                                <td className='px-3 py-3.5'>
                                    <select
                                        value={order.status}
                                        onChange={e => onStatusChange(order._id, e.target.value as OrderStatus)}
                                        className={`px-2.5 py-1 text-xs rounded-lg outline-none cursor-pointer border-0 ${statusStyle[order.status]}`}>
                                        {statusOptions.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className='px-3 py-3.5 text-zinc-400 whitespace-nowrap'>
                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '—'}
                                </td>
                                <td className='px-3 py-3.5'>
                                    <button
                                        onClick={() => onView(order)}
                                        className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                                        <PiEyeLight className='w-4 h-4' />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 &&
                            <tr>
                                <td colSpan={8} className='py-10 text-center text-zinc-400'>سفارشی یافت نشد.</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
