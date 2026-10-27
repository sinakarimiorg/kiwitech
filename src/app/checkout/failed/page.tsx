import Link from 'next/link'
import Header from '@root/src/components/modules/Header/Header'
import Footer from '@root/src/components/modules/Footer/Footer'
import { PiWarningCircleFill } from 'react-icons/pi'

type FailedPageProps = {
    searchParams: Promise<{ reason?: string }>
}

const messages: Record<string, string> = {
    pending: 'نتیجه‌ی پرداخت هنوز مشخص نیست. اگر مبلغی از حساب شما کسر شده، تا چند دقیقه‌ی دیگر وضعیت سفارش در «سفارش‌های من» به‌روز می‌شود؛ در غیر این صورت مبلغ طی ۷۲ ساعت به حساب شما برمی‌گردد.',
    error: 'در تأیید پرداخت خطایی رخ داد. اگر مبلغی کسر شده، با پشتیبانی تماس بگیرید.',
}

export default async function CheckoutFailedPage({ searchParams }: FailedPageProps) {
    const { reason } = await searchParams
    const text = (reason && messages[reason]) || 'پرداخت انجام نشد یا لغو شد. سبد خرید شما حفظ شده و می‌توانید دوباره تلاش کنید.'

    return (
        <div>
            <Header />
            <div className='sm:pt-48 pt-24 pb-10'>
                <div className='container'>
                    <div className='max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8 text-center'>
                        <span className='flex-center w-20 h-20 mx-auto bg-red-50 text-red-500 rounded-full'>
                            <PiWarningCircleFill className='w-11 h-11' />
                        </span>
                        <h1 className='mt-6 font-MorabbaBold text-xl sm:text-2xl text-zinc-800'>پرداخت ناموفق بود</h1>
                        <p className='mt-3 text-sm sm:text-base text-zinc-500 leading-7'>{text}</p>
                        <div className='flex flex-col sm:flex-row gap-3 mt-8'>
                            <Link href='/checkout/payment' className='flex-1 flex-center h-12 text-sm sm:text-base linear_btn'>
                                تلاش مجدد
                            </Link>
                            <Link href='/checkout/cart' className='flex-1 flex-center h-12 text-sm sm:text-base text-zinc-600 border border-gray-200 hover:border-primary-400 rounded-lg transition-colors'>
                                بازگشت به سبد خرید
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer marginClasses={''} />
        </div>
    )
}
