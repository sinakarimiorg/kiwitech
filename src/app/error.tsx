"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { PiWarningCircleLight, PiArrowClockwiseLight, PiHouseLight } from 'react-icons/pi'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <main className='flex-center min-h-[70vh] px-3 py-10'>
            <div className='w-full max-w-lg text-center bg-white shadow-lg rounded-3xl p-7 sm:p-10'>
                <span className='flex-center w-16 h-16 mx-auto text-danger bg-danger/10 rounded-full'>
                    <PiWarningCircleLight className='w-9 h-9' />
                </span>

                <h1 className='mt-6 font-MorabbaBold text-2xl sm:text-3xl text-zinc-800'>یه مشکلی پیش اومد</h1>
                <p className='mt-3 text-sm sm:text-base text-zinc-500 leading-8'>
                    متأسفانه در بارگذاری این صفحه خطایی رخ داد. دوباره تلاش کن؛ اگر مشکل ادامه داشت با پشتیبانی در تماس باش.
                </p>

                {error.digest &&
                    <p className='mt-3 text-xs text-zinc-400' dir='ltr'>Error code: {error.digest}</p>
                }

                <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-7'>
                    <button
                        type='button'
                        onClick={reset}
                        className='flex-center gap-2 px-6 py-3 text-sm sm:text-base text-text linear_btn'
                    >
                        <PiArrowClockwiseLight className='w-5 h-5' />
                        تلاش دوباره
                    </button>
                    <Link
                        href='/'
                        className='flex-center gap-2 px-6 py-3 text-sm sm:text-base text-zinc-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600 rounded-lg transition-colors'
                    >
                        <PiHouseLight className='w-5 h-5' />
                        صفحه اصلی
                    </Link>
                </div>
            </div>
        </main>
    )
}
