"use client"

import Link from 'next/link'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { PiShoppingCartSimpleLight, PiTrashLight } from 'react-icons/pi'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import { useAppDispatch, useAppSelector } from '@root/src/store/hooks'
import {
    decrementItem,
    incrementItem,
    selectCartCount,
    selectCartHydrated,
    selectCartItems,
    selectCartTotals,
} from '@root/src/store/reducers/cartSlice'

/* ───────── Item count badge on the cart icon ───────── */
export function CartBadge({ className = '' }: { className?: string }) {
    const count = useAppSelector(selectCartCount)
    const hydrated = useAppSelector(selectCartHydrated)

    if (!hydrated || count === 0) return null

    return (
        <span className={`absolute flex-center min-w-4.5 h-4.5 px-1 text-[10px] font-IranYekanBold text-surface bg-neon rounded-full ${className}`}>
            {count > 9 ? '۹+' : count.toLocaleString('fa-IR')}
        </span>
    )
}

/* ───────── Cart goods list ───────── */
export function CartMiniList({ className = '' }: { className?: string }) {
    const dispatch = useAppDispatch()
    const items = useAppSelector(selectCartItems)

    if (items.length === 0) {
        return (
            <div className='flex flex-col items-center gap-3 py-10 text-center'>
                <span className='flex-center w-14 h-14 text-text-muted bg-white/5 rounded-full'>
                    <PiShoppingCartSimpleLight className='w-7 h-7' />
                </span>
                <p className='text-sm text-text-muted'>سبد خرید شما خالی است</p>
                <Link href='/products/1' className='text-xs text-neon hover:underline'>
                    مشاهده محصولات
                </Link>
            </div>
        )
    }

    return (
        <ul className={`divide-y divide-border ${className}`}>
            {items.map(item => {
                const atMax = item.stock !== undefined && item.count >= item.stock
                const hasDiscount = !!item.exPrice && item.exPrice > item.price
                const isLastOne = item.count === 1

                return (
                    <li key={item.id} className='flex gap-x-3 py-4 first:pt-0 last:pb-0'>
                        <Link
                            href={`/product-info/${item.linkName}`}
                            className='shrink-0 w-16 h-16 bg-white/5 rounded-xl overflow-hidden'
                        >
                            <img src={item.img} alt={item.title} className='w-full h-full object-contain' />
                        </Link>

                        <div className='flex-1 min-w-0'>
                            <Link
                                href={`/product-info/${item.linkName}`}
                                className='block text-xs leading-5 line-clamp-2 hover:text-neon transition-colors'
                            >
                                {item.title}
                            </Link>

                            <div className='flex flex-wrap items-end justify-between gap-x-3 gap-y-2 mt-2'>
                                <div className='inline-flex items-center gap-2 px-1.5 py-1 border border-border-light rounded-lg'>
                                    <button
                                        type='button'
                                        onClick={() => dispatch(incrementItem(item.id))}
                                        disabled={atMax}
                                        aria-label='افزایش تعداد'
                                        title={atMax ? 'به حداکثر موجودی رسیده‌اید' : undefined}
                                        className='flex-center w-6 h-6 text-neon hover:bg-white/10 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'
                                    >
                                        <FaPlus className='w-2.5 h-2.5' />
                                    </button>

                                    <span className='w-4 text-center text-sm font-IranYekanBold'>
                                        {item.count.toLocaleString('fa-IR')}
                                    </span>

                                    <button
                                        type='button'
                                        onClick={() => dispatch(decrementItem(item.id))}
                                        aria-label={isLastOne ? 'حذف از سبد خرید' : 'کاهش تعداد'}
                                        className={`flex-center w-6 h-6 rounded-md transition-colors cursor-pointer
                                            ${isLastOne ? 'text-danger hover:bg-danger/10' : 'text-text-muted hover:bg-white/10'}`}
                                    >
                                        {isLastOne ? <PiTrashLight className='w-3.5 h-3.5' /> : <FaMinus className='w-2.5 h-2.5' />}
                                    </button>
                                </div>

                                <div className='text-left'>
                                    {hasDiscount &&
                                        <span className='block text-[11px] text-text-muted line-through'>
                                            {(item.exPrice! * item.count).toLocaleString()}
                                        </span>
                                    }
                                    <span className='inline-flex items-center gap-1 font-IranYekanBold text-sm'>
                                        {(item.price * item.count).toLocaleString()}
                                        <TomanIcon className='w-3 h-3' />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

/* ───────── Cart Total and Place Order Button ───────── */
export function CartMiniFooter() {
    const { totalCount, subtotal, totalDiscount } = useAppSelector(selectCartTotals)

    if (totalCount === 0) return null

    return (
        <div className='mt-2 pt-4 border-t border-border'>
            {totalDiscount > 0 &&
                <div className='flex items-center justify-between mb-3 text-xs'>
                    <span className='text-text-muted'>سود شما از خرید</span>
                    <span className='inline-flex items-center gap-1 text-neon'>
                        {totalDiscount.toLocaleString()}
                        <TomanIcon className='w-2.5 h-2.5' />
                    </span>
                </div>
            }

            <div className='flex items-center justify-between gap-3'>
                <div>
                    <span className='font-IranYekan text-xs text-text-muted leading-5 tracking-tighter'>جمع سبد خرید</span>
                    <div className='font-IranYekanBold text-lg text-text'>
                        {subtotal.toLocaleString()}
                        <span className='mr-1 font-IranYekan text-xs'>تومان</span>
                    </div>
                </div>

                <Link
                    href='/checkout/cart'
                    className='flex-center shrink-0 h-11 px-4 font-IranYekan text-sm bg-primary-500 hover:bg-primary-400 text-black rounded-xl transition-colors'
                >
                    ثبت سفارش
                </Link>
            </div>
        </div>
    )
}
