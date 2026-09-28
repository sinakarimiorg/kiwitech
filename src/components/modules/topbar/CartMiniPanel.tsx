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
import { useSyncExternalStore } from 'react'

// false during SSR + hydration, true afterwards (no mismatch, no extra effect)
export function useIsClient() {
    return useSyncExternalStore(() => () => { }, () => true, () => false)
}

/* ───────── Item count badge on the cart icon ───────── */
export function CartBadge({ className = '' }: { className?: string }) {
    const count = useAppSelector(selectCartCount)
    const hydrated = useAppSelector(selectCartHydrated)
    const isClient = useIsClient()

    if (!isClient || !hydrated || count === 0) return null

    return (
        <span className={`absolute flex-center min-w-4.5 h-4.5 px-1 text-[10px] font-IranYekanBold text-surface bg-neon rounded-full ${className}`}>
            {count > 9 ? '۹+' : count.toLocaleString('fa-IR')}
        </span>
    )
}

/* ───────── Cart goods list ───────── */
export function CartMiniList({ className = '' }: { className?: string }) {
    const dispatch = useAppDispatch()
    const storeItems = useAppSelector(selectCartItems)
    const isClient = useIsClient()
    const items = isClient ? storeItems : []

    if (items.length === 0) {
        return (
            <div className='flex flex-col items-center gap-3 py-10 text-center'>
                <span className='flex-center w-14 h-14 text-primary-400 bg-primary-50 rounded-full'>
                    <PiShoppingCartSimpleLight className='w-7 h-7' />
                </span>
                <p className='text-sm text-zinc-400'>سبد خرید شما خالی است</p>
                <Link href='/products/1' className='text-xs text-primary-600 hover:underline'>
                    مشاهده محصولات
                </Link>
            </div>
        )
    }

    return (
        <ul className={`divide-y divide-gray-100 ${className}`}>
            {items.map(item => {
                const atMax = item.stock !== undefined && item.count >= item.stock
                const hasDiscount = !!item.exPrice && item.exPrice > item.price
                const isLastOne = item.count === 1

                return (
                    <li key={item.id} className='flex gap-x-3 py-3.5 first:pt-0 last:pb-0'>
                        <Link
                            href={`/product-info/${item.linkName}`}
                            className='shrink-0 w-14 h-14 bg-gray-50 rounded-lg overflow-hidden'
                        >
                            <img src={item.img} alt={item.title} className='w-full h-full object-contain' />
                        </Link>

                        <div className='flex-1 min-w-0 flex flex-col gap-2'>
                            <Link
                                href={`/product-info/${item.linkName}`}
                                className='block text-xs text-zinc-700 leading-5 line-clamp-2 hover:text-primary-600 transition-colors'
                            >
                                {item.title}
                            </Link>

                            <div className='flex items-end justify-between gap-2'>
                                {/* Stepper: compact pill */}
                                <div className='inline-flex items-center h-7 shrink-0 border border-gray-200 rounded-full overflow-hidden'>
                                    <button
                                        type='button'
                                        onClick={() => dispatch(incrementItem(item.id))}
                                        disabled={atMax}
                                        aria-label='افزایش تعداد'
                                        title={atMax ? 'به حداکثر موجودی رسیده‌اید' : undefined}
                                        className='flex-center w-7 h-full text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'
                                    >
                                        <FaPlus className='w-2 h-2' />
                                    </button>

                                    <span className='min-w-4 text-center text-xs font-IranYekanBold text-zinc-800'>
                                        {item.count.toLocaleString('fa-IR')}
                                    </span>

                                    <button
                                        type='button'
                                        onClick={() => dispatch(decrementItem(item.id))}
                                        aria-label={isLastOne ? 'حذف از سبد خرید' : 'کاهش تعداد'}
                                        className={`flex-center w-7 h-full transition-colors cursor-pointer
                                            ${isLastOne ? 'text-danger hover:bg-danger/10' : 'text-zinc-400 hover:bg-gray-100'}`}
                                    >
                                        {isLastOne ? <PiTrashLight className='w-3.5 h-3.5' /> : <FaMinus className='w-2 h-2' />}
                                    </button>
                                </div>

                                <div className='text-left leading-4'>
                                    {hasDiscount &&
                                        <span className='block text-[10px] text-zinc-400 line-through'>
                                            {(item.exPrice! * item.count).toLocaleString()}
                                        </span>
                                    }
                                    <span className='inline-flex items-center gap-1 font-IranYekanBold text-[13px] text-zinc-800'>
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
    const totals = useAppSelector(selectCartTotals)
    const isClient = useIsClient()

    if (!isClient || totals.totalCount === 0) return null
    const { subtotal, totalDiscount } = totals

    return (
        <div className='mt-2 pt-4 border-t border-gray-100'>
            {totalDiscount > 0 &&
                <div className='flex items-center justify-between mb-3 text-xs'>
                    <span className='text-zinc-500'>سود شما از خرید</span>
                    <span className='inline-flex items-center gap-1 text-primary-600'>
                        {totalDiscount.toLocaleString()}
                        <TomanIcon className='w-2.5 h-2.5' />
                    </span>
                </div>
            }

            <div className='flex items-center justify-between gap-3'>
                <div>
                    <span className='font-IranYekan text-xs text-zinc-400 leading-5 tracking-tighter'>جمع سبد خرید</span>
                    <div className='font-IranYekanBold text-lg text-zinc-800'>
                        {subtotal.toLocaleString()}
                        <span className='mr-1 font-IranYekan text-xs'>تومان</span>
                    </div>
                </div>

                <Link
                    href='/checkout/cart'
                    className='flex-center shrink-0 h-11 px-4 font-IranYekan text-sm bg-primary-500 hover:bg-primary-400 text-white rounded-xl transition-colors'
                >
                    ثبت سفارش
                </Link>
            </div>
        </div>
    )
}
