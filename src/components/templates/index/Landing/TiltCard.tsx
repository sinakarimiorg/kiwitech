"use client"

import Link from 'next/link'
import Tilt from 'react-parallax-tilt'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import { getDiscountPercent } from '@root/src/types/homeType'
import type { HomeProduct } from '@root/src/types/homeType'

export default function TiltCard({ product }: { product: HomeProduct }) {
    const percent = getDiscountPercent(product)
    const lowStock = product.stock > 0 && product.stock <= 5

    return (
        <Tilt
            glareEnable={true}
            glareMaxOpacity={0.25}
            glareColor="#D7FF5C"
            glarePosition="all"
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            scale={1.02}
            transitionSpeed={1500}
            className='w-full'
        >
            <Link
                href={`/product-info/${product.linkName}`}
                className='relative block glass-neon-card rounded-3xl p-6 sm:p-7'
            >
                {percent > 0 &&
                    <span className='absolute top-4 right-4 z-10 px-3 py-1 text-xs font-DanaDemiBold bg-neon text-surface rounded-full shadow-lg animate-glow-pulse'>
                        {percent.toLocaleString('fa-IR')}٪ تخفیف
                    </span>
                }

                <img
                    src={product.img}
                    alt={product.name}
                    className='w-full h-56 sm:h-64 object-contain drop-shadow-[0_25px_35px_rgba(159,190,35,0.35)]'
                />

                <div className='mt-5 text-center'>
                    <p className='min-h-12 text-sm sm:text-base leading-6 text-zinc-700 line-clamp-2'>{product.name}</p>

                    <div className='mt-3 flex flex-col items-center gap-1'>
                        {percent > 0 &&
                            <span className='relative inline-flex text-sm text-zinc-400'>
                                {product.exPrice!.toLocaleString()}
                                <span className='absolute inset-x-0 top-1/2 h-px bg-zinc-400/70' />
                            </span>
                        }
                        <span className='inline-flex items-center gap-1 font-IranYekanBold text-primary-600 text-lg sm:text-xl'>
                            {product.price.toLocaleString()}
                            <TomanIcon className='w-4 h-4' />
                        </span>
                    </div>

                    {lowStock &&
                        <span className='inline-block mt-3 px-2.5 py-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg'>
                            تنها {product.stock.toLocaleString('fa-IR')} عدد باقی مانده
                        </span>
                    }
                </div>
            </Link>
        </Tilt>
    )
}
