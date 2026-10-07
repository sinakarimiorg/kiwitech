import Link from "next/link";
import { PiPlusCircleLight } from "react-icons/pi";

export default function WalletBar({ balance = 0 }: { balance?: number }) {
    return (
        <div className='flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 bg-white shadow-lg rounded-2xl px-4 sm:px-5 py-3.5 mb-6'>

            <Link
                href='/p-user/wallet'
                className='flex-center gap-1.5 shrink-0 h-10 sm:h-auto text-primary-600 hover:text-primary-700 bg-primary-50 sm:bg-transparent rounded-xl sm:rounded-none text-sm font-IranYekanMedium transition-colors'
            >
                <PiPlusCircleLight className='w-5 h-5' />
                افزایش موجودی
            </Link>

            <span className='hidden sm:block w-px h-6 bg-gray-200 shrink-0' />

            <p className='flex-1 sm:text-left text-sm text-zinc-500'>
                موجودی کیف پول:
                <span className='block sm:inline mt-1 sm:mt-0 font-IranYekanBold text-lg sm:text-sm text-zinc-800 sm:mr-1.5'>
                    {balance.toLocaleString()} تومان
                </span>
            </p>
        </div>
    )
}
