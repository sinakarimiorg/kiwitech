"use client"

import type { CSSProperties } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { PiSparkleLight } from 'react-icons/pi'
import TiltCard from './TiltCard'
import type { HomeProduct } from '@root/src/types/homeType'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

export default function FeaturedProductsSwiper({ products }: { products: HomeProduct[] }) {
    const isMulti = products.length > 1

    return (
        <div className='flex flex-col h-full'>
            <h2 className='flex items-center gap-1.5 mb-3 px-1 font-MorabbaBold text-lg text-text'>
                <PiSparkleLight className='w-5 h-5 text-neon' />
                محصولات ویژه
            </h2>

            {/* padding اطراف، برای این‌که scale و glare کارت‌ت توسط overflow اسلایدر بریده نشه */}
            <div className='px-2'>
                <Swiper
                    modules={[Autoplay, EffectFade, Pagination]}
                    effect='fade'
                    fadeEffect={{ crossFade: true }}
                    loop={isMulti}
                    speed={700}
                    autoplay={isMulti ? { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                    pagination={{ clickable: true }}
                    style={{
                        '--swiper-pagination-color': '#D7FF5C',
                        '--swiper-pagination-bullet-inactive-color': '#9CA3AF',
                        '--swiper-pagination-bullet-inactive-opacity': '0.5',
                        '--swiper-pagination-bottom': '2px',
                    } as CSSProperties}
                    className='py-3! pb-9!'
                >
                    {products.map(product => (
                        <SwiperSlide key={product._id}>
                            <TiltCard product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}
