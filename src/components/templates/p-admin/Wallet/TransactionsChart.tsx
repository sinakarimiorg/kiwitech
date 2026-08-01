"use client"

import { useState } from "react"

type DayData = { day: string; deposit: number; withdraw: number }

const weekData: DayData[] = [
    { day: "شنبه", deposit: 32, withdraw: 14 },
    { day: "یک‌شنبه", deposit: 48, withdraw: 22 },
    { day: "دوشنبه", deposit: 27, withdraw: 18 },
    { day: "سه‌شنبه", deposit: 61, withdraw: 30 },
    { day: "چهارشنبه", deposit: 54, withdraw: 25 },
    { day: "پنج‌شنبه", deposit: 72, withdraw: 41 },
    { day: "جمعه", deposit: 45, withdraw: 20 },
]

export default function TransactionsChart() {
    const [active, setActive] = useState<number | null>(null)
    const max = Math.max(...weekData.map(d => Math.max(d.deposit, d.withdraw)))

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
                            {d.deposit}M / {d.withdraw}M
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
                    <p className='font-IranYekanBold text-lg text-primary-600'>{totalDeposit.toLocaleString()} میلیون</p>
                    <p className='text-xs text-zinc-400 mt-1'>مجموع واریزی هفته</p>
                </div>
                <span className='w-px h-10 bg-gray-100' />
                <div>
                    <p className='font-IranYekanBold text-lg text-zinc-700'>{totalWithdraw.toLocaleString()} میلیون</p>
                    <p className='text-xs text-zinc-400 mt-1'>مجموع برداشت هفته</p>
                </div>
            </div>
        </div>
    )
}
