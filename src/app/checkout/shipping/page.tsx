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
import { PiMapPinLight, PiPlusCircleLight, PiCheckCircleFill } from 'react-icons/pi'
import TomanIcon from '@root/src/components/modules/icons/TomanIcon'
import AsideBox from '@root/src/components/templates/checkout/AsideBox/AsideBox'

type Address = {
    id: number
    title: string
    receiver: string
    phone: string
    fullAddress: string
}

const addresses: Address[] = [
    {
        id: 1,
        title: 'خانه',
        receiver: 'سینا کریمی',
        phone: '۰۹۳۰۰۵۲۵۲۶۲',
        fullAddress: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲، واحد ۳',
    },
    {
        id: 2,
        title: 'محل کار',
        receiver: 'سینا کریمی',
        phone: '۰۹۳۰۰۵۲۵۲۶۲',
        fullAddress: 'تهران، خیابان آزادی، برج نگین، طبقه ۵، واحد ۹',
    },
]

// نمونه‌ی خلاصه‌ی سبد خرید برای نمایش کنار صفحه (تا اتصال state واقعی)
const seedCart = (allProducts as any[]).slice(0, 4).map((p, index) => ({
    price: p.price,
    exPrice: p.exPrice,
    count: index === 1 ? 2 : 1,
}))

export default function CheckoutShippingPage() {
    const router = useRouter()
    const [selectedAddress, setSelectedAddress] = useState<number>(addresses[0].id)

    const totalCount = seedCart.reduce((sum, item) => sum + item.count, 0)
    const subtotal = seedCart.reduce((sum, item) => sum + item.price * item.count, 0)
    const originalTotal = seedCart.reduce((sum, item) => sum + (item.exPrice ?? item.price) * item.count, 0)
    const totalDiscount = originalTotal - subtotal
    const shippingCost = subtotal > 0 && subtotal < 1000000 ? 45000 : 0
    const payable = subtotal + shippingCost

    const goToPayment = () => {
        router.push('/checkout/payment')
    }

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'سبد خرید', to: '/checkout/cart' },
                    { id: 3, title: 'اطلاعات ارسال', to: '/checkout/shipping' },
                ]}
            />

            <div className='container pb-16'>
                <CheckoutSteps current='shipping' />

                <div className='flex flex-col lg:flex-row gap-6 xl:gap-10'>

                    <div className='flex-1 min-w-0 bg-white shadow-lg rounded-2xl p-5 sm:p-6'>
                        <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800 pb-4 mb-4 border-b border-gray-100'>
                            <PiMapPinLight className='w-5 h-5 text-primary-500' />
                            آدرس تحویل سفارش
                        </h2>

                        <div className='flex flex-col gap-3'>
                            {addresses.map(addr => {
                                const isActive = selectedAddress === addr.id
                                return (
                                    <button
                                        key={addr.id}
                                        onClick={() => setSelectedAddress(addr.id)}
                                        className={`relative flex flex-col items-start gap-1.5 w-full text-right p-4 rounded-xl border transition-colors cursor-pointer
                                            ${isActive ? 'border-primary-500 bg-primary-50/60' : 'border-gray-200 hover:border-primary-300'}`}>
                                        <span className='flex items-center gap-2 font-IranYekanMedium text-sm text-zinc-800'>
                                            {addr.title}
                                            <span className='text-xs text-zinc-400 font-IranYekan'>({addr.receiver} - {addr.phone})</span>
                                        </span>
                                        <span className='text-xs sm:text-sm text-zinc-500 leading-6'>{addr.fullAddress}</span>

                                        {isActive && <PiCheckCircleFill className='absolute top-4 left-4 w-5 h-5 text-primary-500' />}
                                    </button>
                                )
                            })}

                            <button className='flex-center gap-2 w-full py-3.5 text-sm text-primary-600 hover:text-primary-700 border border-dashed border-primary-300 hover:border-primary-400 rounded-xl transition-colors cursor-pointer'>
                                <PiPlusCircleLight className='w-5 h-5' />
                                افزودن آدرس جدید
                            </button>
                        </div>

                        <Link href='/checkout/cart' className='inline-flex items-center gap-1.5 mt-6 text-sm text-zinc-500 hover:text-primary-600 transition-colors'>
                            <HiMiniChevronLeft className='w-4 h-4 rotate-180' />
                            بازگشت به سبد خرید
                        </Link>
                    </div>

                        <AsideBox
                            totalCount={totalCount}
                            originalTotal={originalTotal}
                            totalDiscount={totalDiscount}
                            shippingCost={shippingCost}
                            payable={payable}
                            href='payment'
                        />
                </div>
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}
