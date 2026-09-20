"use client"

import { useMemo } from "react"
import { PiWalletLight } from "react-icons/pi"
import type { AdminTransaction } from "@root/src/types/adminTransactionType"


const radius = 58
const strokeWidth = 16
const circumference = 2 * Math.PI * radius

type WalletOverviewProps = {
    transactions: AdminTransaction[]
}

export default function WalletOverview({ transactions }: WalletOverviewProps) {
    const { segments, totalBalance } = useMemo(() => {
        const successful = transactions.filter(tx => tx.status === "موفق")

        const depositSum = successful.filter(tx => tx.type === "واریز").reduce((s, t) => s + t.amount, 0)
        const purchaseSum = successful.filter(tx => tx.type === "خرید" && tx.method === "کیف پول").reduce((s, t) => s + t.amount, 0)
        const withdrawSum = successful.filter(tx => tx.type === "برداشت").reduce((s, t) => s + t.amount, 0)
        const refundSum = successful.filter(tx => tx.type === "بازگشت وجه").reduce((s, t) => s + t.amount, 0)

        const rawTotal = depositSum + purchaseSum + withdrawSum + refundSum
        const safeTotal = rawTotal || 1

        const segs = [
            { label: "شارژ کیف پول", value: Math.round((depositSum / safeTotal) * 100), color: "#7D971B" },
            { label: "خرید با کیف پول", value: Math.round((purchaseSum / safeTotal) * 100), color: "#D7FF5C" },
            { label: "برداشت به حساب بانکی", value: Math.round((withdrawSum / safeTotal) * 100), color: "#9FBE23" },
            { label: "بازگشت وجه سفارش", value: Math.round((refundSum / safeTotal) * 100), color: "#EF4444" },
        ]

        const balance = depositSum + refundSum - purchaseSum - withdrawSum

        return { segments: segs, totalBalance: balance }
    }, [transactions])


    let cumulative = 0
    const arcs = segments.map(seg => {
        const dash = (seg.value / 100) * circumference
        const dashoffset = circumference - cumulative
        cumulative += dash
        return { ...seg, dash, dashoffset }
    })

    return (
        <div className='bg-white shadow-lg rounded-2xl p-4 sm:p-5 lg:p-6 h-full'>
            <div className='flex items-center gap-2 pb-4 mb-6 border-b border-gray-100'>
                <PiWalletLight className='w-5 h-5 text-primary-500' />
                <h2 className='font-IranYekanBold text-sm sm:text-base md:text-lg lg:text-xl text-zinc-800'>نمای کلی کیف پول‌ها</h2>
            </div>

            <div className='flex flex-col items-center'>
                {/* Donut Chart */}
                <div className='relative w-40 h-40 sm:w-44 sm:h-44 lg:w-48 lg:h-48'>
                    <svg viewBox='0 0 140 140' className='w-full h-full -rotate-90'>
                        <circle cx='70' cy='70' r={radius} fill='none' stroke='#F3F4F6' strokeWidth={strokeWidth} />
                        {arcs.map(arc => (
                            <circle
                                key={arc.label}
                                cx='70' cy='70' r={radius}
                                fill='none'
                                stroke={arc.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${arc.dash} ${circumference}`}
                                strokeDashoffset={arc.dashoffset}
                                strokeLinecap='round'
                                className='transition-all duration-700'
                            />
                        ))}
                    </svg>
                    <div className='absolute inset-0 flex flex-col items-center justify-center px-2 text-center'>
                        <span className='font-IranYekanBold text-base sm:text-lg lg:text-xl text-zinc-800 truncate max-w-full'>{totalBalance.toLocaleString()}</span>
                        <span className='text-[11px] sm:text-xs text-zinc-400 mt-1'>موجودی خالص (تومان)</span>
                    </div>
                </div>

                {/* Legend */}
                <div className='grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 w-full mt-7'>
                    {segments.map(seg => (
                        <div key={seg.label} className='flex items-center gap-2 text-[11px] sm:text-xs'>
                            <span className='w-2.5 h-2.5 rounded-full shrink-0' style={{ backgroundColor: seg.color }} />
                            <span className='text-zinc-500 flex-1 truncate'>{seg.label}</span>
                            <span className='font-IranYekanMedium text-zinc-700 shrink-0'>{seg.value}٪</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
