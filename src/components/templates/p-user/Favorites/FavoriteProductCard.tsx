"use client"

import Link from 'next/link'
import Image from 'next/image'
import { FavoriteProduct } from "@root/src/types/userFavoriteType"
import { useState, useTransition } from "react"
import Swal from "sweetalert2"
import {
    PiShoppingCartSimpleLight,
    PiCheckBold,
    PiTrashLight,
    PiEyeLight,
    PiShareNetworkLight,
} from 'react-icons/pi'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import { toggleFavoriteAction } from "./action"

const toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
})

type FavoriteProductCardProps = {
    product: FavoriteProduct
}

export default function FavoriteProductCard({ product }: FavoriteProductCardProps) {
    const [isPending, startTransition] = useTransition()
    const [justAdded, setJustAdded] = useState(false)

    const productHref = `/product-info/${product.linkName || product._id}`

    const hasExPrice = !!product.exPrice && product.exPrice > product.price
    const discountPercent =
        product.discount && product.discount > 0
            ? product.discount
            : hasExPrice
                ? Math.round(((product.exPrice! - product.price) / product.exPrice!) * 100)
                : 0;
    const savedAmount = hasExPrice ? product.exPrice! - product.price : 0

    const inStock = product.stock === undefined || product.stock > 0
    const lowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 3

    /* ───────── Remove Favorite Product ───────── */
    const handleRemove = async () => {
        const confirm = await Swal.fire({
            title: 'حذف از علاقه‌مندی‌ها',
            text: 'این محصول از لیست علاقه‌مندی‌های شما حذف شود؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بله، حذف شود',
            cancelButtonText: 'انصراف',
            confirmButtonColor: '#EF4444',
        })
        if (!confirm.isConfirmed) return

        startTransition(async () => {
            const res = await toggleFavoriteAction(product._id)
            if (res.success) {
                toast.fire({ icon: 'success', title: 'از علاقه‌مندی‌ها حذف شد' })
            } else {
                Swal.fire({ icon: 'error', title: 'خطا', text: res.error })
            }
        })
    }

    /* ───────── Add To Favorite Products ───────── */
    const handleAddToCart = () => {
        if (!inStock) return

        setJustAdded(true)
        toast.fire({ icon: 'success', title: 'به سبد خرید اضافه شد' })
        setTimeout(() => setJustAdded(false), 1800)
    }

    /* ───────── Share The Favorite Products ───────── */
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}${productHref}`)
            toast.fire({ icon: 'success', title: 'لینک محصول کپی شد' })
        } catch {
            toast.fire({ icon: 'error', title: 'کپی لینک انجام نشد' })
        }
    }

    return (
        <article
            className={`group flex flex-col w-full h-full bg-white shadow-lg rounded-2xl overflow-hidden
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/70
                ${isPending ? 'opacity-50 scale-[0.98] pointer-events-none' : ''}`}
        >
            <div className='relative w-full aspect-square shrink-0 bg-linear-to-br from-primary-50 to-white'>
                <Link href={productHref} className='absolute inset-0 block p-5 sm:p-7' aria-label={product.name}>
                    <div className='relative w-full h-full'>
                        <Image
                            src={product.img}
                            alt={product.name}
                            fill
                            sizes='(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw'
                            className={`object-contain transition-transform duration-500 group-hover:scale-105
                                ${inStock ? '' : 'grayscale opacity-60'}`}
                        />
                    </div>
                </Link>

                {discountPercent > 0 && inStock &&
                    <span className='absolute top-3 right-3 px-2.5 pt-0.5 font-DanaDemiBold text-xs text-white bg-primary-600 rounded-lg shadow-sm'>
                        {discountPercent}٪ تخفیف
                    </span>
                }

                {!inStock &&
                    <span className='absolute top-3 right-3 px-2.5 py-1 text-xs text-danger bg-white/90 border border-danger/30 rounded-lg'>
                        ناموجود
                    </span>
                }

                <button
                    type='button'
                    onClick={handleShare}
                    title='کپی لینک محصول'
                    aria-label='کپی لینک محصول'
                    className='absolute top-3 left-3 flex-center w-8 h-8 text-zinc-500 bg-white/90 hover:text-primary-600 hover:bg-white rounded-full shadow-sm transition-colors cursor-pointer'
                >
                    <PiShareNetworkLight className='w-4 h-4' />
                </button>

                {lowStock &&
                    <span className='absolute bottom-3 right-3 px-2.5 py-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg'>
                        تنها {product.stock!.toLocaleString('fa-IR')} عدد باقی مانده
                    </span>
                }
            </div>

            <div className='flex flex-col flex-1 p-4'>
                <Link href={productHref} className='flex-1'>
                    <h3 className='text-sm sm:text-[15px] leading-7 text-zinc-700 line-clamp-2 min-h-14 hover:text-primary-600 transition-colors'>
                        {product.name}
                    </h3>
                </Link>

                {/* قیمت */}
                <div className='mt-3 pt-3 border-t border-dashed border-gray-200'>
                    <div className='flex items-end justify-between gap-2 min-h-11'>
                        <div className='flex flex-col'>
                            {hasExPrice &&
                                <span className='relative inline-flex w-fit text-xs text-zinc-400'>
                                    {product.exPrice!.toLocaleString()}
                                    <span className='absolute inset-x-0 top-1/2 h-px bg-zinc-400/70' />
                                </span>
                            }
                            <span className='inline-flex items-center gap-1 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                                {product.price.toLocaleString()}
                                <TomanIcon className='w-3.5 h-3.5' />
                            </span>
                        </div>

                        {savedAmount > 0 &&
                            <span className='px-2 py-1 text-[11px] text-primary-700 bg-primary-50 rounded-md whitespace-nowrap'>
                                {savedAmount.toLocaleString()} تومان سود
                            </span>
                        }
                    </div>
                </div>

                <button
                    type='button'
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className={`flex-center gap-2 w-full h-11 mt-4 text-sm font-IranYekanMedium transition-all
                        ${!inStock
                            ? 'bg-gray-100 text-zinc-400 rounded-lg cursor-not-allowed'
                            : justAdded
                                ? 'bg-primary-50 text-primary-700 border border-primary-300 rounded-lg'
                                : 'linear_btn'}`}
                >
                    {!inStock ? 'ناموجود' : justAdded ? (
                        <>
                            <PiCheckBold className='w-4 h-4' />
                            به سبد اضافه شد
                        </>
                    ) : (
                        <>
                            <PiShoppingCartSimpleLight className='w-5 h-5' />
                            افزودن به سبد خرید
                        </>
                    )}
                </button>

                {/* اکشن‌های ثانویه */}
                <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-100'>
                    <Link
                        href={productHref}
                        className='flex items-center gap-1.5 text-xs text-zinc-500 hover:text-primary-600 transition-colors'
                    >
                        <PiEyeLight className='w-4 h-4' />
                        مشاهده محصول
                    </Link>

                    <button
                        type='button'
                        onClick={handleRemove}
                        disabled={isPending}
                        className='flex items-center gap-1.5 text-xs text-zinc-400 hover:text-danger transition-colors cursor-pointer disabled:cursor-not-allowed'
                    >
                        <PiTrashLight className='w-4 h-4' />
                        {isPending ? 'در حال حذف...' : 'حذف از لیست'}
                    </button>
                </div>
            </div>
        </article>
    )

}