"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { FaChevronLeft } from 'react-icons/fa6'
import ProductCard from '../../Product/ProductCard/ProductCard'
import { getDiscountPercent } from "@root/src/types/homeType"
import type { HomeProduct } from '@root/src/types/homeType'

import 'swiper/css'
import 'swiper/css/navigation'

const navButtonClasses =
    `hidden sm:flex items-center justify-center absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 text-zinc-800 bg-white shadow-lg border border-gray-100 hover:bg-neon rounded-full transition-all cursor-pointer
    [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:pointer-events-none`


type HomeProductsSwiperProps = {
    products: HomeProduct[]
    navId: string
}

export default function HomeProductsSwiper({ products, navId }: HomeProductsSwiperProps) {
    return (
        <div className='relative'>
            <button type='button' aria-label='قبلی' className={`${navId}-prev right-2 ${navButtonClasses}`}>
                <FaChevronLeft className='w-4 h-4 rotate-180' />
            </button>

            <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={1.6}
                speed={900}
                grabCursor={true}
                navigation={{ prevEl: `.${navId}-prev`, nextEl: `.${navId}-next` }}
                breakpoints={{
                    480: { slidesPerView: 2.2 },
                    640: { slidesPerView: 3 },
                    992: { slidesPerView: 4 },
                    1240: { slidesPerView: 5 },
                }}
                className='w-full py-2!'
            >
                {products
                    .filter((product, index, self) =>
                        index === self.findIndex(p => String(p._id) === String(product._id))
                    ).map(product => (
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

            <button type='button' aria-label='بعدی' className={`${navId}-next left-2 ${navButtonClasses}`}>
                <FaChevronLeft className='w-4 h-4' />
            </button>
        </div>
    )
}
