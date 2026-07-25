import { PiPlusCircleLight } from "react-icons/pi";

export default function WalletBar({ balance = 0 }: { balance?: number }) {
    return (
        <div className='flex items-center justify-between gap-3 bg-white shadow-lg rounded-2xl px-5 py-3.5 mb-6'>

            <button className='flex-center gap-1.5 shrink-0 text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-IranYekanMedium transition-colors'>
                <PiPlusCircleLight className='w-5 h-5' />
                افزایش موجودی
            </button>

            <span className='w-px h-6 bg-gray-200 shrink-0' />

            <p className='flex-1 text-left text-xs sm:text-sm text-zinc-500'>
                موجودی کیف پول:
                <span className='font-IranYekanBold text-zinc-800 mr-1.5'>
                    {balance.toLocaleString()} تومان
                </span>
            </p>
        </div>
    )
}
