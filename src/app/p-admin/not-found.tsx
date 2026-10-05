import Link from 'next/link'
import Layout from '@root/src/components/layouts/AdminPanelLayout'
import BackButton from '@root/src/components/modules/BackButton/BackButton'
import { PiSquaresFourLight, PiMagnifyingGlassLight } from 'react-icons/pi'

export default function AdminNotFound() {
    return (
        <Layout>
            <main className='flex-1 min-w-0'>
                <div className='p-5 sm:p-6'>
                    <div className='flex flex-col items-center justify-center gap-5 px-4 py-16 sm:py-24 text-center bg-white shadow-lg rounded-2xl'>
                        <span className='flex-center w-16 h-16 text-primary-500 bg-primary-50 rounded-full'>
                            <PiMagnifyingGlassLight className='w-8 h-8' />
                        </span>

                        <p aria-hidden='true' dir='ltr' className='font-gotham text-5xl sm:text-6xl font-bold text-primary-500'>404</p>

                        <div>
                            <h1 className='font-IranYekanBold text-lg sm:text-xl text-zinc-800'>صفحه یا رکورد مورد نظر پیدا نشد</h1>
                            <p className='mt-2 text-sm text-zinc-400 leading-7'>
                                ممکن است آدرس اشتباه باشد یا رکورد (محصول، سفارش، کاربر و ...) حذف شده باشد.
                            </p>
                        </div>

                        <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto'>
                            <Link href='/p-admin' className='flex-center gap-2 px-6 py-2.5 text-sm text-text linear_btn'>
                                <PiSquaresFourLight className='w-5 h-5' />
                                بازگشت به داشبورد
                            </Link>
                            <BackButton
                                fallbackHref='/p-admin'
                                className='px-6 py-2.5 text-sm text-zinc-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600 rounded-lg transition-colors'
                            />
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}
