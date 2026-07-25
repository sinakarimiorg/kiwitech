import Link from 'next/link'
import { PiPackageLight } from "react-icons/pi";
import { HiMiniChevronLeft } from "react-icons/hi2";

export default function RecentOrders() {
    return (
        <div className='bg-white shadow-lg rounded-2xl p-5 mt-6'>

            {/* Card Header */}
            <div className='flex items-center justify-between pb-4 mb-2 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiPackageLight className='w-5 sm:w-6 h-5 sm:h-6 text-primary-500' />
                    آخرین سفارش‌ها
                </h2>
            </div>

            {/* Empty State — replace with order cards once order data is wired up */}
            <div className='flex items-center justify-between py-4'>
                <p className='text-sm text-zinc-400'>هنوز سفارشی ثبت نکرده‌اید.</p>

                <Link href='#' className='group flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors'>
                    دیدن همه‌ی سفارش‌های من
                    <span className='flex-center w-8 h-8 bg-primary-50 rounded-full group-hover:bg-primary-100 transition-colors'>
                        <HiMiniChevronLeft className='w-4 h-4' />
                    </span>
                </Link>
            </div>
        </div>
    )
}
