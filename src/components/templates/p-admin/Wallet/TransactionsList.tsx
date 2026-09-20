"use client"

import { useState } from "react"
import {
    PiMagnifyingGlassLight,
    PiPlusCircleLight,
    PiMinusCircleLight,
    PiShoppingCartLight,
    PiWalletLight,
    PiCheckCircleLight,
    PiHourglassLight,
    PiXCircleLight,
    PiUserCircleLight,
    PiEyeLight,
    PiListMagnifyingGlassLight,
} from "react-icons/pi"
import type { IconType } from "react-icons"
import type { AdminTransaction, TransactionType, TransactionStatus } from "@root/src/types/adminTransactionType"


const typeMeta: Record<TransactionType, { icon: IconType; color: string }> = {
    "واریز": { icon: PiPlusCircleLight, color: "text-primary-600 bg-primary-50" },
    "برداشت": { icon: PiMinusCircleLight, color: "text-danger bg-danger/10" },
    "خرید": { icon: PiShoppingCartLight, color: "text-sky-600 bg-sky-50" },
    "بازگشت وجه": { icon: PiWalletLight, color: "text-amber-600 bg-amber-50" },
}

const statusMeta: Record<TransactionStatus, { icon: IconType; color: string }> = {
    "موفق": { icon: PiCheckCircleLight, color: "bg-primary-50 text-primary-600" },
    "در انتظار": { icon: PiHourglassLight, color: "bg-amber-50 text-amber-600" },
    "ناموفق": { icon: PiXCircleLight, color: "bg-danger/10 text-danger" },
}

const typeFilters: ("همه" | TransactionType)[] = ["همه", "واریز", "برداشت", "خرید", "بازگشت وجه"]

type TransactionsListProps = {
    transactions: AdminTransaction[]
}

export default function TransactionsList({ transactions }: TransactionsListProps) {
    const [search, setSearch] = useState("")
    const [activeFilter, setActiveFilter] = useState<"همه" | TransactionType>("همه")

    const filtered = transactions.filter(tx => {
        const matchesSearch = tx.user.includes(search) || tx._id.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = activeFilter === "همه" || tx.type === activeFilter
        return matchesSearch && matchesFilter
    })

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='bg-white shadow-lg rounded-2xl w-full max-w-full overflow-hidden box-border'>
                <div className='px-4 sm:px-6 py-4 border-b border-gray-100 w-full'>
                    <h2 className='flex items-center gap-2 font-IranYekanBold text-sm sm:text-base md:text-lg lg:text-xl text-zinc-800 mb-3'>
                        <PiListMagnifyingGlassLight className='w-5 h-5 text-primary-500 shrink-0' />
                        تراکنش‌ها
                        <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                    </h2>

                    {/* استفاده از گرید/فلکس کنترل شده برای جلوگیری از به هم ریختگی */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 w-full'>
                        {/* دکمه‌های فیلتر با کانتینر کاملاً محدود شده */}
                        <div className='w-full overflow-x-auto scrollbar-none'>
                            <div className='flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-xl text-xs w-max'>
                                {typeFilters.map(f => (
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
                        </div>

                        {/* فیلد جستجو */}
                        <div className='flex items-center gap-2 px-3.5 py-2 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                            <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                type='text'
                                placeholder='کاربر یا شماره پیگیری...'
                                className='w-full bg-transparent outline-none placeholder:text-zinc-400 text-zinc-800'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table - md+ */}
            <div className='hidden md:block overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='text-right text-xs text-zinc-400 border-b border-gray-100'>
                            <th className='font-IranYekanMedium px-5 sm:px-6 py-3'>شماره پیگیری</th>
                            <th className='font-IranYekanMedium px-3 py-3'>کاربر</th>
                            <th className='font-IranYekanMedium px-3 py-3'>نوع تراکنش</th>
                            <th className='font-IranYekanMedium px-3 py-3'>مبلغ</th>
                            <th className='font-IranYekanMedium px-3 py-3'>روش</th>
                            <th className='font-IranYekanMedium px-3 py-3'>وضعیت</th>
                            <th className='font-IranYekanMedium px-3 py-3'>تاریخ و ساعت</th>
                            <th className='font-IranYekanMedium px-3 py-3'></th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {filtered.map(tx => {
                            const type = typeMeta[tx.type]
                            const status = statusMeta[tx.status]
                            const TypeIcon = type.icon
                            const StatusIcon = status.icon
                            const isPositive = tx.type === "واریز" || tx.type === "بازگشت وجه"
                            const dateObj = tx.createdAt ? new Date(tx.createdAt) : null

                            return (
                                <tr key={tx._id} className='hover:bg-primary-50/30 transition-colors'>
                                    <td className='px-5 sm:px-6 py-3.5 font-IranYekanMedium text-zinc-700 tracking-wide' dir='ltr'>
                                        #{tx._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className='px-3 py-3.5'>
                                        <div className='flex items-center gap-2'>
                                            <PiUserCircleLight className='w-5 h-5 text-zinc-400' />
                                            <span className='text-zinc-600'>{tx.user}</span>
                                        </div>
                                    </td>
                                    <td className='px-3 py-3.5'>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs whitespace-nowrap rounded-lg ${type.color}`}>
                                            <TypeIcon className='w-3.5 h-3.5' />
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className={`px-3 py-3.5 font-IranYekanMedium ${isPositive ? "text-primary-600" : "text-zinc-700"}`}>
                                        {isPositive ? "+" : "−"}{tx.amount.toLocaleString()} تومان
                                    </td>
                                    <td className='px-3 py-3.5 text-zinc-500'>{tx.method}</td>
                                    <td className='px-3 py-3.5'>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs whitespace-nowrap rounded-lg ${status.color}`}>
                                            <StatusIcon className='w-3.5 h-3.5' />
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className='px-3 py-3.5 text-zinc-400 whitespace-nowrap'>
                                        {dateObj ? dateObj.toLocaleDateString('fa-IR') : '—'} <span className='text-zinc-300'>|</span> {dateObj ? dateObj.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </td>
                                    <td className='px-3 py-3.5'>
                                        <button className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                                            <PiEyeLight className='w-4 h-4' />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}

                        {filtered.length === 0 &&
                            <tr>
                                <td colSpan={8} className='py-10 text-center text-zinc-400'>تراکنشی یافت نشد.</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>

            {/* Cards - below md */}
            <div className='md:hidden divide-y divide-gray-50'>
                {filtered.length === 0 ? (
                    <div className='py-10 text-center text-zinc-400'>تراکنشی یافت نشد.</div>
                ) : (
                    filtered.map(tx => {
                        const type = typeMeta[tx.type]
                        const status = statusMeta[tx.status]
                        const TypeIcon = type.icon
                        const StatusIcon = status.icon
                        const isPositive = tx.type === "واریز" || tx.type === "بازگشت وجه"
                        const dateObj = tx.createdAt ? new Date(tx.createdAt) : null

                        return (
                            <div key={tx._id} className='flex flex-col gap-2.5 px-4 py-4'>
                                <div className='flex items-center justify-between gap-2'>
                                    <span className='font-IranYekanMedium text-xs text-zinc-700 tracking-wide' dir='ltr'>
                                        #{tx._id.slice(-8).toUpperCase()}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 text-[10px] whitespace-nowrap rounded-lg px-2 py-1 ${status.color}`}>
                                        <StatusIcon className='w-3 h-3' />
                                        {tx.status}
                                    </span>
                                </div>

                                <div className='flex items-center gap-2 text-xs text-zinc-600'>
                                    <PiUserCircleLight className='w-4 h-4 text-zinc-400 shrink-0' />
                                    {tx.user}
                                </div>

                                <div className='flex items-center justify-between gap-2'>
                                    <span className={`inline-flex items-center gap-1.5 px-1 py-0.5 text-[10px] whitespace-nowrap rounded-md ${type.color}`}>
                                        <TypeIcon className='w-3.5 h-3.5' />
                                        {tx.type}
                                    </span>
                                    <span className={`font-IranYekanMedium text-xs ${isPositive ? "text-primary-600" : "text-zinc-700"}`}>
                                        {isPositive ? "+" : "−"}{tx.amount.toLocaleString()} تومان
                                    </span>
                                </div>

                                <div className='flex items-center justify-between gap-2 pt-2 mt-1 border-t border-dashed border-gray-100 text-[10px] text-zinc-400'>
                                    <span>{tx.method}</span>
                                    <span>
                                        {dateObj ? dateObj.toLocaleDateString('fa-IR') : '—'} | {dateObj ? dateObj.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
