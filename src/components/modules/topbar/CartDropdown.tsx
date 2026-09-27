"use client"

import Link from 'next/link'
import { HiOutlineShoppingCart, HiMiniChevronLeft } from 'react-icons/hi2'
import { useAppSelector } from '@root/src/store/hooks'
import { selectCartCount } from '@root/src/store/reducers/cartSlice'
import { CartBadge, CartMiniFooter, CartMiniList } from './CartMiniPanel'

export default function CartDropdown() {
    const count = useAppSelector(selectCartCount)

    return (
        <div className='relative group cursor-pointer hover:text-neon transition-colors'>
            <Link href='/checkout/cart' aria-label='سبد خرید' className='relative block'>
                <HiOutlineShoppingCart className='w-5 custom-sc:w-8 h-5 custom-sc:h-8' />
                <CartBadge className='-top-2 -right-2' />
            </Link>

            <div className='absolute top-full left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible
                w-100 p-5 border border-border border-t-[3px] shadow-custom border-t-primary-500 rounded-2xl
                bg-dark-secondary text-text cursor-default transition-all delay-75 overflow-hidden z-30'>

                <div className='flex items-center justify-between mb-4 font-IranYekan text-xs tracking-tighter'>
                    <span className='text-text-muted'>{count.toLocaleString('fa-IR')} مورد</span>
                    <Link href='/checkout/cart' className='flex items-center text-primary-500 hover:text-primary-400 transition-colors'>
                        مشاهده سبد خرید
                        <HiMiniChevronLeft className='w-5 h-5' />
                    </Link>
                </div>

                <CartMiniList className='max-h-82.5 overflow-y-auto' />
                <CartMiniFooter />
            </div>
        </div>
    )
}
