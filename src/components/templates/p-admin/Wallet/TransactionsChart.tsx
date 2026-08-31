"use client"

import { useMemo, useState } from "react"
import type { AdminTransaction } from "@root/src/types/adminTransactionType"

type DayData = { day: string; deposit: number; withdraw: number }

const weekDays = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"]

function toPersianWeekdayIndex(jsDay: number) {
    return (jsDay + 1) % 7
}

type TransactionsChartProps = {
    transactions: AdminTransaction[]
}

export default function TransactionsChart({ transactions }: TransactionsChartProps) {
    const [active, setActive] = useState<number | null>(null)

    const weekData = useMemo(() => {
        const now = new Date()
        const sevenDaysAgo = new Date(now)
        sevenDaysAgo.setDate(now.getDate() - 7)

        const buckets = weekDays.map(day => ({ day, deposit: 0, withdraw: 0 }))

        transactions.forEach(tx => {
            if (!tx.createdAt || tx.status !== "موفق") return
            const date = new Date(tx.createdAt)
            if (date < sevenDaysAgo) return

            const index = toPersianWeekdayIndex(date.getDay())
            const amountInMillion = tx.amount / 1000000

            if (tx.type === "واریز" || tx.type === "بازگشت وجه") {
                buckets[index].deposit += amountInMillion
            } else if (tx.type === "برداشت" || tx.type === "خرید") {
                buckets[index].withdraw += amountInMillion
            }
        })

        return buckets
    }, [transactions])

    const max = Math.max(1, ...weekData.map(d => Math.max(d.deposit, d.withdraw)))
    const totalDeposit = weekData.reduce((sum, d) => sum + d.deposit, 0)
    const totalWithdraw = weekData.reduce((sum, d) => sum + d.withdraw, 0)

    return (
        <div className='bg-white shadow-lg rounded-2xl p-5 sm:p-6 h-full'>
            <div className='flex items-center justify-between pb-4 mb-5 border-b border-gray-100'>
                <div>
                    <h2 className='font-IranYekanBold text-base sm:text-lg text-zinc-800'>واریز و برداشت هفته</h2>
                    <p className='text-xs text-zinc-400 mt-0.5'>مقایسه تراکنش‌های واریزی و برداشتی به تفکیک روز</p>
                </div>
                <div className='flex items-center gap-3'>
                    <span className='flex items-center gap-1.5 text-xs text-zinc-500'>
                        <span className='w-2.5 h-2.5 rounded-full bg-primary-500' />
                        واریز
                    </span>
                    <span className='flex items-center gap-1.5 text-xs text-zinc-500'>
                        <span className='w-2.5 h-2.5 rounded-full bg-neon' />
                        برداشت
                    </span>
                </div>
            </div>

            <div className='flex items-end justify-between gap-2 sm:gap-3 h-48'>
                {weekData.map((d, i) => (
                    <div
                        key={d.day}
                        className='flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer'
                        onMouseEnter={() => setActive(i)}
                        onMouseLeave={() => setActive(null)}
                    >
                        <span className={`text-[10px] sm:text-xs font-IranYekanMedium text-zinc-600 transition-opacity ${active === i ? "opacity-100" : "opacity-0"}`}>
                            {d.deposit.toFixed(1)}M / {d.withdraw.toFixed(1)}M
                        </span>
                        <div className='flex items-end gap-1 w-full h-full'>
                            <div
                                className={`flex-1 rounded-t-md bg-linear-to-t from-primary-600 to-primary-400 transition-all duration-300 ${active === i ? "opacity-100" : "opacity-80"}`}
                                style={{ height: `${(d.deposit / max) * 100}%` }}
                            />
                            <div
                                className={`flex-1 rounded-t-md bg-linear-to-t from-neon-soft to-neon transition-all duration-300 ${active === i ? "opacity-100" : "opacity-70"}`}
                                style={{ height: `${(d.withdraw / max) * 100}%` }}
                            />
                        </div>
                        <span className='text-[10px] sm:text-[11px] text-zinc-400 whitespace-nowrap'>{d.day}</span>
                    </div>
                ))}
            </div>

            <div className='flex items-center justify-around mt-6 pt-5 border-t border-dashed border-gray-200 text-center'>
                <div>
                    <p className='font-IranYekanBold text-lg text-primary-600'>{totalDeposit.toLocaleString(undefined, { maximumFractionDigits: 1 })} میلیون</p>
                    <p className='text-xs text-zinc-400 mt-1'>مجموع واریزی هفته</p>
                </div>
                <span className='w-px h-10 bg-gray-100' />
                <div>
                    <p className='font-IranYekanBold text-lg text-zinc-700'>{totalWithdraw.toLocaleString(undefined, { maximumFractionDigits: 1 })} میلیون</p>
                    <p className='text-xs text-zinc-400 mt-1'>مجموع برداشت هفته</p>
                </div>
            </div>
        </div>
    )
}
