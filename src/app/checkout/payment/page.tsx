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
            <svg className='hidden'>
                <symbol id="toman" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                    <path fillRule="evenodd" d="M3.057 1.742L3.821 1l.78.75-.776.741-.768-.749zm3.23 2.48c0 .622-.16 1.111-.478 1.467-.201.221-.462.39-.783.505a3.251 3.251 0 01-1.083.163h-.555c-.421 0-.801-.074-1.139-.223a2.045 2.045 0 01-.9-.738A2.238 2.238 0 011 4.148c0-.059.001-.117.004-.176.03-.55.204-1.158.525-1.827l1.095.484c-.257.532-.397 1-.419 1.403-.002.04-.004.08-.004.12 0 .252.055.458.166.618a.887.887 0 00.5.354c.085.028.178.048.278.06.079.01.16.014.243.014h.555c.458 0 .769-.081.933-.244.14-.139.21-.383.21-.731V2.02h1.2v2.202zm5.433 3.184l-.72-.7.709-.706.735.707-.724.7zm-2.856.308c.542 0 .973.19 1.293.569.297.346.445.777.445 1.293v.364h.18v-.004h.41c.221 0 .377-.028.467-.084.093-.055.14-.14.14-.258v-.069c.004-.243.017-1.044 0-1.115L13 8.05v1.574a1.4 1.4 0 01-.287.863c-.306.405-.804.607-1.495.607h-.627c-.061.733-.434 1.257-1.117 1.573-.267.122-.58.21-.937.265a5.845 5.845 0 01-.914.067v-1.159c.612 0 1.072-.082 1.38-.247.25-.132.376-.298.376-.499h-.515c-.436 0-.807-.113-1.113-.339-.367-.273-.55-.667-.55-1.18 0-.488.122-.901.367-1.24.296-.415.728-.622 1.296-.622zm.533 2.226v-.364c0-.217-.048-.389-.143-.516a.464.464 0 00-.39-.187.478.478 0 00-.396.187.705.705 0 00-.136.449.65.65 0 00.003.067c.008.125.066.22.177.283.093.054.21.08.352.08h.533zM9.5 6.707l.72.7.724-.7L10.209 6l-.709.707zm-6.694 4.888h.03c.433-.01.745-.106.937-.29.024.012.065.035.12.068l.074.039.081.042c.135.073.261.133.379.18.345.146.67.22.977.22a1.216 1.216 0 00.87-.34c.3-.285.449-.714.449-1.286a2.19 2.19 0 00-.335-1.145c-.299-.457-.732-.685-1.3-.685-.502 0-.916.192-1.242.575-.113.132-.21.284-.294.456-.032.062-.06.125-.084.191a.504.504 0 00-.03.078 1.67 1.67 0 00-.022.06c-.103.309-.171.485-.205.53-.072.09-.214.14-.427.147-.123-.005-.209-.03-.256-.076-.057-.054-.085-.153-.085-.297V7l-1.201-.5v3.562c0 .261.048.496.143.703.071.158.168.296.29.413.123.118.266.211.43.28.198.084.42.13.665.136v.001h.036zm2.752-1.014a.778.778 0 00.044-.353.868.868 0 00-.165-.47c-.1-.134-.217-.201-.35-.201-.18 0-.33.103-.447.31-.042.071-.08.158-.114.262a2.434 2.434 0 00-.04.12l-.015.053-.015.046c.142.118.323.216.544.293.18.062.325.092.433.092.044 0 .086-.05.125-.152z" clipRule="evenodd" fill="currentColor"></path>
                </symbol>
            </svg>

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

                    <aside className='w-full lg:w-87.5 shrink-0'>
                        <div className='lg:sticky lg:top-28 bg-white shadow-lg rounded-2xl p-5 sm:p-6'>
                            <h2 className='font-IranYekanBold text-base sm:text-lg text-zinc-800 pb-4 mb-4 border-b border-gray-100'>
                                خلاصه سفارش
                            </h2>

                            <div className='flex flex-col gap-3 text-sm'>
                                <div className='flex items-center justify-between text-zinc-500'>
                                    <span>قیمت کالاها ({totalCount})</span>
                                    <span className='inline-flex items-center gap-1 text-zinc-700'>
                                        {originalTotal.toLocaleString()}
                                        <svg className='w-3 h-3'><use href="#toman"></use></svg>
                                    </span>
                                </div>

                                {totalDiscount > 0 &&
                                    <div className='flex items-center justify-between text-primary-600'>
                                        <span>سود شما از خرید</span>
                                        <span className='inline-flex items-center gap-1'>
                                            {totalDiscount.toLocaleString()}
                                            <svg className='w-3 h-3'><use href="#toman"></use></svg>
                                        </span>
                                    </div>
                                }

                                <div className='flex items-center justify-between text-zinc-500'>
                                    <span>هزینه ارسال</span>
                                    <span className={shippingCost === 0 ? 'text-primary-600 font-IranYekanMedium' : 'text-zinc-700'}>
                                        {shippingCost === 0 ? 'رایگان' : `${shippingCost.toLocaleString()} تومان`}
                                    </span>
                                </div>

                                {codFee > 0 &&
                                    <div className='flex items-center justify-between text-zinc-500'>
                                        <span>هزینه پرداخت در محل</span>
                                        <span className='text-zinc-700'>{codFee.toLocaleString()} تومان</span>
                                    </div>
                                }
                            </div>

                            <div className='flex items-center justify-between mt-5 pt-4 border-t border-dashed border-gray-200'>
                                <span className='font-IranYekanMedium text-zinc-700'>مبلغ قابل پرداخت</span>
                                <span className='inline-flex items-center gap-1 font-IranYekanBold text-lg text-zinc-800'>
                                    {payable.toLocaleString()}
                                    <svg className='w-4 h-4'><use href="#toman"></use></svg>
                                </span>
                            </div>

                            <button onClick={submitOrder} className='w-full h-12 mt-6 font-IranYekanMedium text-base linear_btn'>
                                {paymentMethod === 'online' ? 'پرداخت و ثبت نهایی' : 'ثبت نهایی سفارش'}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}
