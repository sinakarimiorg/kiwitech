"use client"

import Link from 'next/link'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import CheckoutSteps from '@root/src/components/templates/Checkout/CheckoutSteps/CheckoutSteps'
import { useAppDispatch, useAppSelector } from '@root/src/store/hooks'
import { incrementItem, decrementItem, removeFromCart } from '@root/src/store/reducers/cartSlice'

import { FaPlus, FaMinus } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md'
import { HiOutlineShoppingCart, HiMiniChevronLeft } from 'react-icons/hi2'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import AsideBox from '@root/src/components/templates/P-user/AsideBox/AsideBox'

const UNIT_COL = 'sm:w-32 lg:w-36'
const QTY_COL = 'sm:w-28'
const TOTAL_COL = 'sm:w-32 lg:w-36'

function Price({ value, className = '' }: { value: number; className?: string }) {
    return (
        <span className={`inline-flex items-center gap-1 ${className}`}>
            {value.toLocaleString()}
            <TomanIcon className='w-3.5 h-3.5' />
        </span>
    )
}

export default function CheckoutCartPage() {
    const dispatch = useAppDispatch()
    const cart = useAppSelector(state => state.cart.items)

    const increment = (id: string) => {
        const item = cart.find(i => i.id === id)
        if (item?.stock && item.count >= item.stock) return
        dispatch(incrementItem(id))
    }
    const decrement = (id: string) => {
        dispatch(decrementItem(id))
    }
    const removeItem = (id: string) => {
        dispatch(removeFromCart(id))
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

                            <div className='hidden sm:flex items-center gap-4 px-6 py-4 border-b border-gray-100 text-xs text-zinc-400'>
                                <span className='flex-1'>محصول</span>
                                <span className={`text-center ${UNIT_COL}`}>قیمت واحد</span>
                                <span className={`text-center ${QTY_COL}`}>تعداد</span>
                                <span className={`text-center ${TOTAL_COL}`}>قیمت کل</span>
                            </div>

                            <div className='divide-y divide-gray-100'>
                                {cart.map(item => {
                                    const hasDiscount = !!item.exPrice && item.exPrice > item.price
                                    const discountPercent = hasDiscount
                                        ? Math.round(((item.exPrice! - item.price) / item.exPrice!) * 100)
                                        : 0
                                    const savedAmount = hasDiscount ? (item.exPrice! - item.price) * item.count : 0
                                    const reachedStock = !!item.stock && item.count >= item.stock

                                    return (
                                        <div key={item.id} className='flex flex-col sm:flex-row sm:items-center gap-4 px-4 sm:px-6 py-5'>

                                            <div className='flex items-center gap-4 flex-1 min-w-0'>
                                                <Link href={`/product-info/${item.linkName}`} className='shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden'>
                                                    <img src={item.img} className='w-full h-full object-cover' alt={item.title} />
                                                </Link>
                                                <div className='min-w-0'>
                                                    <Link href={`/product-info/${item.linkName}`} className='text-sm sm:text-base text-zinc-700 leading-6 line-clamp-2'>{item.title}</Link>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className='flex items-center gap-1 mt-2 text-xs text-red-400 hover:text-red-500 transition-colors cursor-pointer'>
                                                        <MdDeleteOutline className='w-4 h-4' />
                                                        حذف از سبد خرید
                                                    </button>
                                                </div>
                                            </div>

                                            <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-xl'>

                                                <div className={`flex items-center justify-between sm:justify-center ${UNIT_COL}`}>
                                                    <span className='sm:hidden text-xs text-zinc-500'>قیمت واحد</span>
                                                    <div className='flex flex-col items-end sm:items-center gap-1'>
                                                        <Price value={item.price} className='font-IranYekanMedium text-sm text-zinc-700' />
                                                        {hasDiscount &&
                                                            <div className='flex items-center gap-1.5'>
                                                                <span className='text-xs text-zinc-400 line-through'>{item.exPrice!.toLocaleString()}</span>
                                                                <span className='px-1.5 py-0.5 text-[10px] text-white bg-primary-600 rounded-md'>
                                                                    {discountPercent.toLocaleString('fa-IR')}٪
                                                                </span>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>

                                                <div className={`flex items-center justify-between sm:justify-center ${QTY_COL}`}>
                                                    <span className='sm:hidden text-xs text-zinc-500'>تعداد</span>
                                                    <div className='flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-1.5 py-1'>
                                                        <button
                                                            onClick={() => increment(item.id)}
                                                            disabled={reachedStock}
                                                            aria-label='افزایش تعداد'
                                                            className='flex-center w-6 h-6 text-primary-600 hover:bg-primary-50 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'>
                                                            <FaPlus className='w-2.5 h-2.5' />
                                                        </button>
                                                        <span className='w-4 text-center font-IranYekanMedium text-sm'>{item.count.toLocaleString('fa-IR')}</span>
                                                        <button
                                                            onClick={() => decrement(item.id)}
                                                            disabled={item.count === 1}
                                                            aria-label='کاهش تعداد'
                                                            className='flex-center w-6 h-6 text-zinc-500 hover:bg-gray-100 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'>
                                                            <FaMinus className='w-2.5 h-2.5' />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className={`flex items-center justify-between sm:justify-center pt-3 sm:pt-0 border-t border-dashed border-gray-200 sm:border-0 ${TOTAL_COL}`}>
                                                    <span className='sm:hidden text-xs text-zinc-500'>قیمت کل</span>
                                                    <div className='flex flex-col items-end sm:items-center gap-1'>
                                                        <Price value={item.price * item.count} className='font-IranYekanBold text-base text-zinc-800' />
                                                        {savedAmount > 0 &&
                                                            <span className='text-[11px] text-primary-600'>
                                                                {savedAmount.toLocaleString()} تومان سود
                                                            </span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
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
