"use client"

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import CheckoutSteps from '@root/src/components/templates/Checkout/CheckoutSteps/CheckoutSteps'
import { showSwal } from '@/utils/helpers'
import { useAppSelector } from '@root/src/store/hooks'

import { HiMiniChevronLeft } from 'react-icons/hi2'
import { PiMapPinLight, PiCreditCardLight, PiCheckCircleFill } from 'react-icons/pi'
import AsideBox from '@root/src/components/templates/P-user/AsideBox/AsideBox'
import { createOrderAction } from '@root/src/components/templates/P-user/Orders/actions'
import { UserAddress } from '@root/src/types/userAddressType'
import { ShippingSettings } from '@root/src/types/siteSettingsType'

type PaymentClientProps = {
    selectedAddress: UserAddress
    shippingSettings: ShippingSettings
}

function formatAddress(address: UserAddress) {
    const location = address.province && address.city
        ? `${address.province}، ${address.city}`
        : address.province || address.city || ''

    return `${address.title} — ${location ? `${location}، ` : ''}${address.fullAddress}`
}

export default function PaymentClient({ selectedAddress, shippingSettings }: PaymentClientProps) {
    const router = useRouter()
    const [isSubmitting, startTransition] = useTransition()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])
    const cartItems = useAppSelector(state => state.cart.items)
    const activeCartItems = mounted ? cartItems : []

    const totalCount = activeCartItems.reduce((sum, item) => sum + item.count, 0)
    const itemsTotalPrice = activeCartItems.reduce((sum, item) => sum + item.price * item.count, 0)

    const originalTotal = activeCartItems.reduce((sum, item) => sum + (item.exPrice ?? item.price) * item.count, 0)
    const totalDiscount = originalTotal - itemsTotalPrice

    const shippingCost = itemsTotalPrice > 0 && itemsTotalPrice < shippingSettings.freeShippingThreshold ? shippingSettings.standardShippingCost : 0
    const finalPayableAmount = itemsTotalPrice + shippingCost

    const submitOrder = () => {
        if (!activeCartItems.length) {
            showSwal('سبد خرید شما خالی است', 'error', 'متوجه شدم')
            return
        }

        startTransition(async () => {
            const result = await createOrderAction({
                items: activeCartItems.map(item => ({
                    title: item.title,
                    img: item.img,
                    price: item.price,
                    count: item.count,
                    product: item.id,
                })),
                address: formatAddress(selectedAddress),
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

    if (!mounted) {
        return <div className='min-h-screen flex items-center justify-center'>در حال بارگذاری سبد خرید...</div>
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
