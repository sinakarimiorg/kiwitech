"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { FaChevronLeft } from 'react-icons/fa6'
import ProductCard from '@root/src/components/templates/Product/ProductCard/ProductCard'
import { getDiscountPercent } from '@root/src/types/homeType'
import type { HomeProduct } from '@root/src/types/homeType'

import 'swiper/css'
import 'swiper/css/navigation'

const navButtonClasses =
    `hidden sm:flex items-center justify-center absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 text-zinc-800 bg-white/95 hover:bg-neon rounded-full shadow-lg transition-all cursor-pointer
    [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:pointer-events-none`

export default function AmazingOffersSlider({ products }: { products: HomeProduct[] }) {
    return (
        <div className='relative min-w-0 flex-1'>
            <button type='button' aria-label='قبلی' className={`offers-prev right-2 ${navButtonClasses}`}>
                <FaChevronLeft className='w-4 h-4 rotate-180' />
            </button>

            <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={1.5}
                speed={900}
                grabCursor={true}
                navigation={{ prevEl: '.offers-prev', nextEl: '.offers-next' }}
                breakpoints={{
                    480: { slidesPerView: 2.2 },
                    768: { slidesPerView: 3.2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 3.5 },
                    1536: { slidesPerView: 4.5 },
                }}
                className='w-full'
            >
                {products.map(product => (
                    <SwiperSlide key={product._id} className='h-auto!'>
                        <ProductCard
                            shortName={product.linkName}
                            img={product.img}
                            title={product.name}
                            price={product.price}
                            exPrice={product.exPrice}
                            discount={getDiscountPercent(product)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <button type='button' aria-label='بعدی' className={`offers-next left-2 ${navButtonClasses}`}>
                <FaChevronLeft className='w-4 h-4' />
            </button>
        </div>
    )
}
