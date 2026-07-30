"use client"

import { useState } from 'react'

type DayData = { day: string; value: number }

const weekData: DayData[] = [
    { day: 'شنبه', value: 42 },
    { day: 'یک‌شنبه', value: 58 },
    { day: 'دوشنبه', value: 35 },
    { day: 'سه‌شنبه', value: 71 },
    { day: 'چهارشنبه', value: 64 },
    { day: 'پنج‌شنبه', value: 88 },
    { day: 'جمعه', value: 53 },
]

export default function SalesPulse() {
    const [active, setActive] = useState<number | null>(null)
    const max = Math.max(...weekData.map(d => d.value))

    return (
        <div className="bg-white shadow-lg rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                <div>
                    <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">نبض فروش هفته</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">تعداد سفارش‌های ثبت‌شده به تفکیک روز</p>
                </div>
                <span className="px-3 py-1 text-xs font-IranYekanMedium text-primary-600 bg-primary-50 rounded-full">
                    ۴۱۱ سفارش
                </span>
            </div>

            <div className="flex items-end justify-between gap-2 sm:gap-3 h-40">
                {weekData.map((d, i) => (
                    <div
                        key={d.day}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer"
                        onMouseEnter={() => setActive(i)}
                        onMouseLeave={() => setActive(null)}
                    >
                        <span className={`text-xs font-IranYekanMedium text-zinc-600 transition-opacity ${active === i ? 'opacity-100' : 'opacity-0'}`}>
                            {d.value}
                        </span>
                        <div
                            className={`w-full rounded-t-lg bg-linear-to-t from-primary-600 to-neon transition-all duration-300
                                ${active === i ? 'opacity-100 scale-x-110' : 'opacity-80'}`}
                            style={{ height: `${(d.value / max) * 100}%` }}
                        />
                        <span className="text-[11px] text-zinc-400 whitespace-nowrap">{d.day}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
