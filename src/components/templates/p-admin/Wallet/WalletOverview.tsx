import { PiWalletLight } from "react-icons/pi"

type Segment = {
    label: string
    value: number
    color: string
}

const segments: Segment[] = [
    { label: "شارژ کیف پول", value: 42, color: "#7D971B" },
    { label: "خرید با کیف پول", value: 33, color: "#D7FF5C" },
    { label: "برداشت به حساب بانکی", value: 17, color: "#9FBE23" },
    { label: "بازگشت وجه سفارش", value: 8, color: "#EF4444" },
]

const radius = 58
const strokeWidth = 16
const circumference = 2 * Math.PI * radius

let cumulative = 0
const arcs = segments.map(seg => {
    const dash = (seg.value / 100) * circumference
    const dashoffset = circumference - cumulative
    cumulative += dash
    return { ...seg, dash, dashoffset }
})

export default function WalletOverview() {
    return (
        <div className='bg-white shadow-lg rounded-2xl p-5 sm:p-6 h-full'>
            <div className='flex items-center gap-2 pb-4 mb-6 border-b border-gray-100'>
                <PiWalletLight className='w-5 h-5 text-primary-500' />
                <h2 className='font-IranYekanBold text-base sm:text-lg text-zinc-800'>نمای کلی کیف پول‌ها</h2>
            </div>

            <div className='flex flex-col items-center'>
                {/* Donut Chart */}
                <div className='relative w-44 h-44 sm:w-48 sm:h-48'>
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
                    <div className='absolute inset-0 flex flex-col items-center justify-center'>
                        <span className='font-IranYekanBold text-xl sm:text-2xl text-zinc-800'>۴۱۸,۲۰۰,۰۰۰</span>
                        <span className='text-xs text-zinc-400 mt-1'>موجودی کل کیف پول‌ها (تومان)</span>
                    </div>
                </div>

                {/* Legend */}
                <div className='grid grid-cols-2 gap-x-6 gap-y-3 w-full mt-7'>
                    {segments.map(seg => (
                        <div key={seg.label} className='flex items-center gap-2 text-xs'>
                            <span className='w-2.5 h-2.5 rounded-full shrink-0' style={{ backgroundColor: seg.color }} />
                            <span className='text-zinc-500 flex-1'>{seg.label}</span>
                            <span className='font-IranYekanMedium text-zinc-700'>{seg.value}٪</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
