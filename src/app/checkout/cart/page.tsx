"use client"

import { useState } from 'react'
import Link from 'next/link'
import Header from '@root/src/components/modules/header/header'
import BreadCrumb from '@root/src/components/modules/breadCrumb/breadCrumb'
import Footer from '@root/src/components/modules/footer/footer'
import CheckoutSteps from '@root/src/components/templates/Checkout/CheckoutSteps/CheckoutSteps'
import allProducts from '@root/Products'

import { FaPlus, FaMinus } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md'
import { HiOutlineShoppingCart, HiMiniChevronLeft } from 'react-icons/hi2'
import TomanIcon from '@root/src/components/modules/icons/TomanIcon'
import AsideBox from '@root/src/components/templates/p-user/AsideBox/AsideBox'

type CartItem = {
    id: number
    title: string
    price: number
    exPrice?: number
    count: number
    img1: string
}

// نمونه دیتای اولیه سبد خرید - در آینده با state واقعی (ردوکس/context) جایگزین می‌شود
const seedCart: CartItem[] = (allProducts as any[]).slice(0, 4).map((p, index) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    exPrice: p.exPrice,
    count: index === 1 ? 2 : 1,
    img1: p.img1,
}))

export default function CheckoutCartPage() {
    const [cart, setCart] = useState<CartItem[]>(seedCart)

    const increment = (id: number) => {
        setCart(prev => prev.map(item => item.id === id ? { ...item, count: item.count + 1 } : item))
    }
    const decrement = (id: number) => {
        setCart(prev => prev.map(item => item.id === id && item.count > 1 ? { ...item, count: item.count - 1 } : item))
    }
    const removeItem = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    const totalCount = cart.reduce((sum, item) => sum + item.count, 0)
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.count, 0)
    const originalTotal = cart.reduce((sum, item) => sum + (item.exPrice ?? item.price) * item.count, 0)
    const totalDiscount = originalTotal - subtotal
    const shippingCost = subtotal > 0 && subtotal < 1000000 ? 45000 : 0
    const payable = subtotal + shippingCost

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'سبد خرید', to: '/checkout/cart' },
                ]}
            />

            <div className='container pb-16'>
                <CheckoutSteps current='cart' />

                {cart.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className='flex flex-col lg:flex-row gap-6 xl:gap-10'>

                        <div className='flex-1 min-w-0 bg-white shadow-lg rounded-2xl overflow-hidden'>
                            <div className='hidden sm:flex items-center justify-between px-6 py-4 border-b border-gray-100 text-xs text-zinc-400'>
                                <span>محصول</span>
                                <div className='flex items-center gap-10 lg:gap-16'>
                                    <span>تعداد</span>
                                    <span>قیمت</span>
                                </div>
                            </div>

                            <div className='divide-y divide-gray-100'>
                                {cart.map(item => (
                                    <div key={item.id} className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 px-4 sm:px-6 py-5'>

                                        <div className='flex items-center gap-4 flex-1 min-w-0'>
                                            <div className='shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden'>
                                                <img src={item.img1} className='w-full h-full object-cover' alt={item.title} />
                                            </div>
                                            <div className='min-w-0'>
                                                <p className='text-sm sm:text-base text-zinc-700 leading-6 line-clamp-2'>{item.title}</p>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className='flex items-center gap-1 mt-2 text-xs text-red-400 hover:text-red-500 transition-colors cursor-pointer'>
                                                    <MdDeleteOutline className='w-4 h-4' />
                                                    حذف از سبد خرید
                                                </button>
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-between sm:justify-end gap-6 lg:gap-14 shrink-0'>
                                            <div className='flex items-center gap-3 border border-gray-200 rounded-lg px-1.5 py-1'>
                                                <button
                                                    onClick={() => increment(item.id)}
                                                    className='flex-center w-6 h-6 text-primary-600 hover:bg-primary-50 rounded-md transition-colors cursor-pointer'>
                                                    <FaPlus className='w-2.5 h-2.5' />
                                                </button>
                                                <span className='w-4 text-center font-IranYekanMedium text-sm'>{item.count}</span>
                                                <button
                                                    onClick={() => decrement(item.id)}
                                                    disabled={item.count === 1}
                                                    className='flex-center w-6 h-6 text-zinc-500 hover:bg-gray-100 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'>
                                                    <FaMinus className='w-2.5 h-2.5' />
                                                </button>
                                            </div>

                                            <div className='text-left w-28'>
                                                <div className='inline-flex items-center gap-1 font-IranYekanBold text-sm sm:text-base text-zinc-800'>
                                                    <span>{(item.price * item.count).toLocaleString()}</span>
                                                    <TomanIcon />
                                                </div>
                                                {item.exPrice && item.exPrice > item.price &&
                                                    <div className='relative inline-flex mt-1 text-xs text-zinc-400'>
                                                        {(item.exPrice * item.count).toLocaleString()}
                                                        <span className='absolute inset-x-0 top-1/2 h-px bg-zinc-400/60'></span>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='px-6 py-4 border-t border-gray-100'>
                                <Link href='/' className='inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors'>
                                    <HiMiniChevronLeft className='w-4 h-4 rotate-180' />
                                    ادامه‌ی خرید
                                </Link>
                            </div>
                        </div>

                        <AsideBox
                            totalCount={totalCount}
                            originalTotal={originalTotal}
                            totalDiscount={totalDiscount}
                            shippingCost={shippingCost}
                            payable={payable}
                            href='shipping'
                        />
                    </div>
                )}
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}

function EmptyCart() {
    return (
        <div className='flex flex-col items-center justify-center gap-5 py-20 text-center'>
            <span className='flex-center w-20 h-20 bg-primary-50 text-primary-400 rounded-full'>
                <HiOutlineShoppingCart className='w-10 h-10' />
            </span>
            <div>
                <h2 className='font-IranYekanBold text-lg text-zinc-700'>سبد خرید شما خالی است</h2>
                <p className='mt-2 text-sm text-zinc-400'>محصولی برای نمایش وجود ندارد، از فروشگاه بازدید کنید.</p>
            </div>
            <Link href='/' className='inline-flex items-center gap-1.5 px-6 py-2.5 text-sm text-text linear_btn'>
                بازگشت به فروشگاه
                <HiMiniChevronLeft className='w-4 h-4' />
            </Link>
        </div>
    )
}
