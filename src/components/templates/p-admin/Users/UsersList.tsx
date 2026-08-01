"use client"

import { useState } from "react"
import {
    PiMagnifyingGlassLight,
    PiUserCircleLight,
    PiEyeLight,
    PiProhibitLight,
    PiUsersLight,
} from "react-icons/pi"

type CustomerStatus = "فعال" | "مسدود"

type Customer = {
    id: number
    name: string
    phone: string
    email: string
    ordersCount: number
    totalSpent: number
    joinedAt: string
    status: CustomerStatus
}

// نمونه دیتای اولیه - در آینده با فچ از API جایگزین می‌شود
const customers: Customer[] = [
    { id: 1, name: "سینا کریمی", phone: "۰۹۳۰۰۵۲۵۲۶۲", email: "sina@example.com", ordersCount: 14, totalSpent: 18450000, joinedAt: "۱۴۰۳/۰۲/۱۱", status: "فعال" },
    { id: 2, name: "علی رضایی", phone: "۰۹۱۲۳۴۵۶۷۸۹", email: "ali.rezaei@example.com", ordersCount: 6, totalSpent: 5230000, joinedAt: "۱۴۰۳/۰۵/۰۳", status: "فعال" },
    { id: 3, name: "مریم احمدی", phone: "۰۹۳۵۱۱۲۲۳۳۴", email: "maryam.a@example.com", ordersCount: 22, totalSpent: 31200000, joinedAt: "۱۴۰۲/۱۱/۲۸", status: "فعال" },
    { id: 4, name: "حسین نوری", phone: "۰۹۱۹۸۸۷۷۶۶۵", email: "h.nouri@example.com", ordersCount: 1, totalSpent: 560000, joinedAt: "۱۴۰۴/۰۳/۱۹", status: "مسدود" },
    { id: 5, name: "زهرا محمدی", phone: "۰۹۳۶۴۴۵۵۶۶۷", email: "z.mohammadi@example.com", ordersCount: 9, totalSpent: 11200000, joinedAt: "۱۴۰۳/۰۸/۰۷", status: "فعال" },
]

const statusStyle: Record<CustomerStatus, string> = {
    "فعال": "bg-primary-50 text-primary-600",
    "مسدود": "bg-danger/10 text-danger",
}

const filters: ("همه" | CustomerStatus)[] = ["همه", "فعال", "مسدود"]

export default function UsersList() {
    const [search, setSearch] = useState("")
    const [activeFilter, setActiveFilter] = useState<"همه" | CustomerStatus>("همه")

    const filtered = customers.filter(c => {
        const matchesSearch = c.name.includes(search) || c.phone.includes(search)
        const matchesFilter = activeFilter === "همه" || c.status === activeFilter
        return matchesSearch && matchesFilter
    })

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiUsersLight className='w-5 h-5 text-primary-500' />
                    لیست مشتریان
                    <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                </h2>

                <div className='flex items-center gap-3'>
                    {/* Status Filter */}
                    <div className='flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-xl text-xs'>
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer
                                    ${activeFilter === f
                                        ? "bg-primary-500 text-white font-IranYekanMedium"
                                        : "text-zinc-500 hover:text-zinc-700"}`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className='hidden sm:flex items-center gap-2 px-3.5 py-2 w-56 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                        <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type='text'
                            placeholder='نام یا شماره موبایل...'
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
                            <th className='font-IranYekanMedium px-5 sm:px-6 py-3'>مشتری</th>
                            <th className='font-IranYekanMedium px-3 py-3'>شماره تماس</th>
                            <th className='font-IranYekanMedium px-3 py-3'>تعداد سفارش</th>
                            <th className='font-IranYekanMedium px-3 py-3'>مجموع خرید</th>
                            <th className='font-IranYekanMedium px-3 py-3'>تاریخ عضویت</th>
                            <th className='font-IranYekanMedium px-3 py-3'>وضعیت</th>
                            <th className='font-IranYekanMedium px-3 py-3'>عملیات</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {filtered.map(customer => (
                            <tr key={customer.id} className='hover:bg-primary-50/30 transition-colors'>
                                <td className='px-5 sm:px-6 py-3.5'>
                                    <div className='flex items-center gap-3'>
                                        <span className='flex-center w-10 h-10 shrink-0 bg-primary-50 text-primary-500 rounded-full'>
                                            <PiUserCircleLight className='w-6 h-6' />
                                        </span>
                                        <div>
                                            <p className='font-IranYekanMedium text-zinc-700 line-clamp-1'>{customer.name}</p>
                                            <p className='text-xs text-zinc-400'>{customer.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-3 py-3.5 text-zinc-500 tracking-wide'>{customer.phone}</td>
                                <td className='px-3 py-3.5 text-zinc-600'>{customer.ordersCount}</td>
                                <td className='px-3 py-3.5 text-zinc-700 font-IranYekanMedium'>{customer.totalSpent.toLocaleString()} تومان</td>
                                <td className='px-3 py-3.5 text-zinc-400'>{customer.joinedAt}</td>
                                <td className='px-3 py-3.5'>
                                    <span className={`px-2.5 py-1 text-xs rounded-lg ${statusStyle[customer.status]}`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td className='px-3 py-3.5'>
                                    <div className='flex items-center gap-2'>
                                        <button className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                                            <PiEyeLight className='w-4 h-4' />
                                        </button>
                                        <button className='flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer'>
                                            <PiProhibitLight className='w-4 h-4' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 &&
                            <tr>
                                <td colSpan={7} className='py-10 text-center text-zinc-400'>مشتری‌ای یافت نشد.</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
