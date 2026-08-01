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

type TxType = "واریز" | "برداشت" | "خرید" | "بازگشت وجه"
type TxStatus = "موفق" | "در انتظار" | "ناموفق"
type TxMethod = "کیف پول" | "درگاه بانکی" | "کارت به کارت"

type Transaction = {
    id: string
    user: string
    type: TxType
    amount: number
    method: TxMethod
    status: TxStatus
    date: string
    time: string
}

// نمونه دیتای اولیه - در آینده با فچ از API جایگزین می‌شود
const transactions: Transaction[] = [
    { id: "TRX-10482", user: "سینا کریمی", type: "واریز", amount: 2000000, method: "درگاه بانکی", status: "موفق", date: "۱۴۰۴/۰۴/۰۸", time: "۱۴:۲۲" },
    { id: "TRX-10481", user: "علی رضایی", type: "خرید", amount: 890000, method: "کیف پول", status: "موفق", date: "۱۴۰۴/۰۴/۰۸", time: "۱۳:۵۰" },
    { id: "TRX-10480", user: "مریم احمدی", type: "برداشت", amount: 1200000, method: "کارت به کارت", status: "در انتظار", date: "۱۴۰۴/۰۴/۰۸", time: "۱۱:۰۵" },
    { id: "TRX-10479", user: "حسین نوری", type: "خرید", amount: 560000, method: "کیف پول", status: "ناموفق", date: "۱۴۰۴/۰۴/۰۷", time: "۲۲:۱۸" },
    { id: "TRX-10478", user: "زهرا محمدی", type: "بازگشت وجه", amount: 277000, method: "کیف پول", status: "موفق", date: "۱۴۰۴/۰۴/۰۷", time: "۱۸:۴۰" },
    { id: "TRX-10477", user: "سینا کریمی", type: "واریز", amount: 500000, method: "درگاه بانکی", status: "موفق", date: "۱۴۰۴/۰۴/۰۶", time: "۰۹:۱۲" },
    { id: "TRX-10476", user: "علی رضایی", type: "برداشت", amount: 3000000, method: "کارت به کارت", status: "موفق", date: "۱۴۰۴/۰۴/۰۶", time: "۰۸:۰۳" },
]

const typeMeta: Record<TxType, { icon: IconType; color: string }> = {
    "واریز": { icon: PiPlusCircleLight, color: "text-primary-600 bg-primary-50" },
    "برداشت": { icon: PiMinusCircleLight, color: "text-danger bg-danger/10" },
    "خرید": { icon: PiShoppingCartLight, color: "text-sky-600 bg-sky-50" },
    "بازگشت وجه": { icon: PiWalletLight, color: "text-amber-600 bg-amber-50" },
}

const statusMeta: Record<TxStatus, { icon: IconType; color: string }> = {
    "موفق": { icon: PiCheckCircleLight, color: "bg-primary-50 text-primary-600" },
    "در انتظار": { icon: PiHourglassLight, color: "bg-amber-50 text-amber-600" },
    "ناموفق": { icon: PiXCircleLight, color: "bg-danger/10 text-danger" },
}

const typeFilters: ("همه" | TxType)[] = ["همه", "واریز", "برداشت", "خرید", "بازگشت وجه"]

export default function TransactionsList() {
    const [search, setSearch] = useState("")
    const [activeFilter, setActiveFilter] = useState<"همه" | TxType>("همه")

    const filtered = transactions.filter(tx => {
        const matchesSearch = tx.user.includes(search) || tx.id.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = activeFilter === "همه" || tx.type === activeFilter
        return matchesSearch && matchesFilter
    })

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiListMagnifyingGlassLight className='w-5 h-5 text-primary-500' />
                    تراکنش‌ها
                    <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                </h2>

                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-xl text-xs overflow-x-auto'>
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

                    <div className='hidden lg:flex items-center gap-2 px-3.5 py-2 w-56 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                        <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type='text'
                            placeholder='کاربر یا شماره پیگیری...'
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

                            return (
                                <tr key={tx.id} className='hover:bg-primary-50/30 transition-colors'>
                                    <td className='px-5 sm:px-6 py-3.5 font-IranYekanMedium text-zinc-700 tracking-wide' dir='ltr'>
                                        {tx.id}
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
                                        {tx.date} <span className='text-zinc-300'>|</span> {tx.time}
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
        </div>
    )
}
