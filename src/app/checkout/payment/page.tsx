"use client"

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import CheckoutSteps from '@root/src/components/templates/Checkout/CheckoutSteps/CheckoutSteps'
import { showSwal } from '@/utils/helpers'

import { HiMiniChevronLeft } from 'react-icons/hi2'
import { PiMapPinLight, PiCreditCardLight, PiMoneyLight, PiCheckCircleFill } from 'react-icons/pi'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import AsideBox from '@root/src/components/templates/P-user/AsideBox/AsideBox'
import { createOrderAction } from '@root/src/components/templates/P-user/Orders/actions'

const selectedAddress = {
    title: 'خانه',
    receiver: 'سینا کریمی',
    phone: '۰۹۳۰۰۵۲۵۲۶۲',
    fullAddress: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲، واحد ۳',
}

const allProducts: any = []

const cartItems = (allProducts as any[]).slice(0, 4).map((p, index) => ({
    id: p.id,
    title: p.title,
    img1: p.img1,
    price: p.price,
    exPrice: p.exPrice,
    count: index === 1 ? 2 : 1,
}))

export default function CheckoutPaymentPage() {
    const router = useRouter()
    const [isSubmitting, startTransition] = useTransition()

    const FREE_SHIPPING_THRESHOLD = 2000000;
    const STANDARD_SHIPPING_COST = 45000;

    const totalCount = cartItems.reduce((sum, item) => sum + item.count, 0)
    const itemsTotalPrice = cartItems.reduce((sum, item) => sum + item.price * item.count, 0)

    const originalTotal = cartItems.reduce((sum, item) => sum + (item.exPrice ?? item.price) * item.count, 0)
    const totalDiscount = originalTotal - itemsTotalPrice

    const shippingCost = itemsTotalPrice > 0 && itemsTotalPrice < FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING_COST : 0
    const finalPayableAmount = itemsTotalPrice + shippingCost

    const submitOrder = () => {
        startTransition(async () => {
            const result = await createOrderAction({
                items: cartItems.map(item => ({
                    title: item.title,
                    img: item.img1,
                    price: item.price,
                    count: item.count,
                })),
                address: `${selectedAddress.title} - ${selectedAddress.fullAddress}`,
                phone: selectedAddress.phone,
                shippingCost: shippingCost,
            })

            if (result.success) {
                router.push('/checkout/success')
            } else {
                showSwal(result.error, 'error', 'متوجه شدم')
            }
        })
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
                                    className='relative flex items-center gap-3 w-full text-right p-4 rounded-xl border transition-colors cursor-pointer border-primary-500 bg-primary-50/60 hover:border-primary-300'>
                                    <PiCreditCardLight className='w-6 h-6 text-zinc-500 shrink-0' />
                                    <span className='flex-1'>
                                        <span className='block font-IranYekanMedium text-sm text-zinc-800'>پرداخت آنلاین (درگاه بانکی)</span>
                                        <span className='block text-xs text-zinc-400 mt-0.5'>پرداخت امن از طریق تمامی کارت‌های بانکی عضو شتاب</span>
                                    </span>
                                    <PiCheckCircleFill className='w-5 h-5 text-primary-500 shrink-0' />
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
                        finalPayableAmount={finalPayableAmount}
                        onSubmit={submitOrder}
                        submitLabel='ثبت نهایی و پرداخت'
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}
