"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@root/src/components/modules/header/header'
import BreadCrumb from '@root/src/components/modules/breadCrumb/breadCrumb'
import Footer from '@root/src/components/modules/footer/footer'
import CheckoutSteps from '@root/src/components/templates/checkout/CheckoutSteps/CheckoutSteps'
import allProducts from '@root/Products'

import { HiMiniChevronLeft } from 'react-icons/hi2'
import { PiMapPinLight, PiCreditCardLight, PiMoneyLight, PiCheckCircleFill } from 'react-icons/pi'
import TomanIcon from '@root/src/components/modules/icons/TomanIcon'
import AsideBox from '@root/src/components/templates/p-user/AsideBox/AsideBox'

// آدرس انتخاب‌شده در مرحله‌ی قبل - در پروژه‌ی واقعی از state مشترک (context/ردوکس) خوانده می‌شود
const selectedAddress = {
    title: 'خانه',
    receiver: 'سینا کریمی',
    phone: '۰۹۳۰۰۵۲۵۲۶۲',
    fullAddress: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲، واحد ۳',
}

const seedCart = (allProducts as any[]).slice(0, 4).map((p, index) => ({
    price: p.price,
    exPrice: p.exPrice,
    count: index === 1 ? 2 : 1,
}))

export default function CheckoutPaymentPage() {
    const router = useRouter()
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online')

    const totalCount = seedCart.reduce((sum, item) => sum + item.count, 0)
    const subtotal = seedCart.reduce((sum, item) => sum + item.price * item.count, 0)
    const originalTotal = seedCart.reduce((sum, item) => sum + (item.exPrice ?? item.price) * item.count, 0)
    const totalDiscount = originalTotal - subtotal
    const shippingCost = subtotal > 0 && subtotal < 1000000 ? 45000 : 0
    const codFee = paymentMethod === 'cod' ? 25000 : 0
    const payable = subtotal + shippingCost + codFee

    const submitOrder = () => {
        // در پروژه‌ی واقعی: ارسال سفارش به سرور و اتصال به درگاه پرداخت
        router.push('/checkout/success')
    }

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'سبد خرید', to: '/checkout/cart' },
                    { id: 3, title: 'اطلاعات ارسال', to: '/checkout/shipping' },
                    { id: 4, title: 'پرداخت', to: '/checkout/payment' },
                ]}
            />

            <div className='container pb-16'>
                <CheckoutSteps current='payment' />

                <div className='flex flex-col lg:flex-row gap-6 xl:gap-10'>

                    <div className='flex-1 min-w-0 flex flex-col gap-6'>

                        {/* آدرس انتخاب‌شده - خلاصه‌ی فقط خواندنی */}
                        <div className='bg-white shadow-lg rounded-2xl p-5 sm:p-6'>
                            <div className='flex items-center justify-between pb-4 mb-4 border-b border-gray-100'>
                                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                                    <PiMapPinLight className='w-5 h-5 text-primary-500' />
                                    آدرس تحویل
                                </h2>
                                <Link href='/checkout/shipping' className='text-xs sm:text-sm text-primary-600 hover:text-primary-700 transition-colors'>
                                    ویرایش
                                </Link>
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <span className='flex items-center gap-2 font-IranYekanMedium text-sm text-zinc-800'>
                                    {selectedAddress.title}
                                    <span className='text-xs text-zinc-400 font-IranYekan'>({selectedAddress.receiver} - {selectedAddress.phone})</span>
                                </span>
                                <span className='text-xs sm:text-sm text-zinc-500 leading-6'>{selectedAddress.fullAddress}</span>
                            </div>
                        </div>

                        {/* انتخاب روش پرداخت */}
                        <div className='bg-white shadow-lg rounded-2xl p-5 sm:p-6'>
                            <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800 pb-4 mb-4 border-b border-gray-100'>
                                <PiCreditCardLight className='w-5 h-5 text-primary-500' />
                                روش پرداخت
                            </h2>

                            <div className='flex flex-col gap-3'>
                                <button
                                    onClick={() => setPaymentMethod('online')}
                                    className={`relative flex items-center gap-3 w-full text-right p-4 rounded-xl border transition-colors cursor-pointer
                                        ${paymentMethod === 'online' ? 'border-primary-500 bg-primary-50/60' : 'border-gray-200 hover:border-primary-300'}`}>
                                    <PiCreditCardLight className='w-6 h-6 text-zinc-500 shrink-0' />
                                    <span className='flex-1'>
                                        <span className='block font-IranYekanMedium text-sm text-zinc-800'>پرداخت آنلاین (درگاه بانکی)</span>
                                        <span className='block text-xs text-zinc-400 mt-0.5'>پرداخت امن از طریق تمامی کارت‌های بانکی عضو شتاب</span>
                                    </span>
                                    {paymentMethod === 'online' && <PiCheckCircleFill className='w-5 h-5 text-primary-500 shrink-0' />}
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`relative flex items-center gap-3 w-full text-right p-4 rounded-xl border transition-colors cursor-pointer
                                        ${paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50/60' : 'border-gray-200 hover:border-primary-300'}`}>
                                    <PiMoneyLight className='w-6 h-6 text-zinc-500 shrink-0' />
                                    <span className='flex-1'>
                                        <span className='block font-IranYekanMedium text-sm text-zinc-800'>پرداخت در محل</span>
                                        <span className='block text-xs text-zinc-400 mt-0.5'>پرداخت نقدی یا کارت‌خوان هنگام تحویل سفارش (۲۵,۰۰۰ تومان هزینه اضافه)</span>
                                    </span>
                                    {paymentMethod === 'cod' && <PiCheckCircleFill className='w-5 h-5 text-primary-500 shrink-0' />}
                                </button>
                            </div>
                        </div>

                        <Link href='/checkout/shipping' className='inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-primary-600 transition-colors'>
                            <HiMiniChevronLeft className='w-4 h-4 rotate-180' />
                            بازگشت به اطلاعات ارسال
                        </Link>
                    </div>

                        <AsideBox
                            totalCount={totalCount}
                            originalTotal={originalTotal}
                            totalDiscount={totalDiscount}
                            shippingCost={shippingCost}
                            payable={payable}
                            href='success'
                        />
                </div>
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}
