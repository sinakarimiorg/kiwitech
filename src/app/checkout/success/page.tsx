import Link from 'next/link'
import Header from '@root/src/components/modules/header/header'
import Footer from '@root/src/components/modules/footer/footer'

import { PiCheckCircleFill, PiPackageLight, PiPhoneCallLight } from 'react-icons/pi'
import { HiMiniChevronLeft } from 'react-icons/hi2'

// شماره‌ی سفارش نمونه - در پروژه‌ی واقعی از سرور برمی‌گردد
const orderNumber = '۱۴۰۴۰۹۲۳۱۸'

export default function CheckoutSuccessPage() {
    return (
        <div>
            <Header />

            <div className='sm:pt-48 pt-24 pb-10'>
                <div className='container'>
                    <div className='max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8 text-center'>

                        <span className='flex-center w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-primary-50 text-primary-500 rounded-full'>
                            <PiCheckCircleFill className='w-11 h-11 sm:w-13 sm:h-13' />
                        </span>

                        <h1 className='mt-6 font-MorabbaBold text-xl sm:text-2xl text-zinc-800'>
                            سفارش شما با موفقیت ثبت شد
                        </h1>
                        <p className='mt-3 text-sm sm:text-base text-zinc-500 leading-7'>
                            از خرید شما از کیوی‌تک متشکریم. سفارش پس از بررسی، در سریع‌ترین زمان ممکن آماده و ارسال می‌شود.
                        </p>

                        <div className='flex items-center justify-between mt-8 py-4 px-5 bg-primary-50/60 rounded-xl text-sm'>
                            <span className='text-zinc-500'>شماره سفارش</span>
                            <span className='font-IranYekanBold text-zinc-800 tracking-wider'>{orderNumber}</span>
                        </div>

                        <div className='flex items-center gap-3 mt-4 py-4 px-5 border border-gray-100 rounded-xl text-right'>
                            <PiPackageLight className='w-8 h-8 text-primary-500 shrink-0' />
                            <p className='text-xs sm:text-sm text-zinc-500 leading-6'>
                                می‌تونی وضعیت سفارشت رو از بخش «سفارش‌های من» در پروفایل کاربری دنبال کنی.
                            </p>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-3 mt-8'>
                            <Link
                                href='/p-user'
                                className='flex-1 flex-center gap-1.5 h-12 text-sm sm:text-base linear_btn'>
                                مشاهده سفارش‌های من
                            </Link>
                            <Link
                                href='/'
                                className='flex-1 flex-center gap-1.5 h-12 text-sm sm:text-base text-zinc-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600 rounded-lg transition-colors'>
                                بازگشت به فروشگاه
                                <HiMiniChevronLeft className='w-4 h-4' />
                            </Link>
                        </div>

                        <div className='flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-100 text-xs sm:text-sm text-zinc-400'>
                            <PiPhoneCallLight className='w-4 h-4' />
                            سوالی داری؟ با پشتیبانی ۰۲۱-۱۱۱۱۰۰۰ تماس بگیر.
                        </div>
                    </div>
                </div>
            </div>

            <Footer marginClasses={''} />
        </div>
    )
}
