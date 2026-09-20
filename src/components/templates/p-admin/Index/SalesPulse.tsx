"use client"

import { useState } from 'react'

type DayData = { day: string; value: number }

type SalesPulseProps = {
    weekData: DayData[]
    totalCount: number
}

export default function SalesPulse({ weekData, totalCount }: SalesPulseProps) {
    const [active, setActive] = useState<number | null>(null)
    const max = Math.max(1, ...weekData.map(d => d.value))

    return (
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-gray-100">
                <div>
                    <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">نبض فروش هفته</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">تعداد سفارش‌های ثبت‌شده به تفکیک روز (۷ روز اخیر)</p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 text-xs font-IranYekanMedium text-primary-600 bg-primary-50 rounded-full whitespace-nowrap">
                    {totalCount.toLocaleString('fa-IR')} سفارش
                </span>
            </div>

            <div className="flex items-end justify-between gap-1.5 xs:gap-2 sm:gap-3 h-32 sm:h-40 overflow-x-auto">
                {weekData.map((d, i) => (
                    <div
                        key={d.day}
                        className="flex-1 min-w-8 flex flex-col items-center gap-2 h-full justify-end cursor-pointer"
                        onMouseEnter={() => setActive(i)}
                        onMouseLeave={() => setActive(null)}
                    >
                        <span className={`text-[10px] sm:text-xs font-IranYekanMedium text-zinc-600 transition-opacity ${active === i ? 'opacity-100' : 'opacity-0'}`}>
                            {d.value.toLocaleString('fa-IR')}
                        </span>
                        <div
                            className={`w-full rounded-t-lg bg-linear-to-t from-primary-600 to-neon transition-all duration-300
                                ${active === i ? 'opacity-100 scale-x-110' : 'opacity-80'}`}
                            style={{ height: `${(d.value / max) * 100}%` }}
                        />
                        <span className="text-[10px] sm:text-[11px] text-zinc-400 whitespace-nowrap">{d.day}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
