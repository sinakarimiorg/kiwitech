"use client"

import Link from 'next/link'
import { BsPatchCheck } from 'react-icons/bs'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import type { HomeBanner } from '@root/src/types/homeType'

import 'swiper/css'

export default function PopularBrandsSlider({ title, brands }: { title: string; brands: HomeBanner[] }) {

    return (
        <div className='hidden sm:block mt-20'>
            <div className='container'>
                <div className='flex items-center w-full overflow-hidden bg-white/70 backdrop-blur-sm border border-primary-100 shadow-lg rounded-3xl'>

                    <div className='w-3/12 2xl:w-1/6 self-stretch flex flex-col items-center justify-center p-3 md:p-5 text-center text-white bg-linear-to-br from-primary-600 to-primary-500'>
                        <BsPatchCheck className='w-10 lg:w-12 h-10 lg:h-12' />
                        <h2 className='pt-3 lg:pt-5 font-MorabbaBold md:text-lg lg:text-2xl'>{title}</h2>
                    </div>

                    <div className='w-9/12 2xl:w-5/6 my-auto overflow-hidden'>
                        <Swiper
                            spaceBetween={1}
                            slidesPerView={3}
                            loop={brands.length > 6}
                            speed={1200}
                            autoplay={{ delay: 1500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            breakpoints={{
                                992: { slidesPerView: 4, spaceBetween: 2 },
                                1240: { slidesPerView: 5, spaceBetween: 2 },
                                1536: { slidesPerView: 6, spaceBetween: 2 },
                            }}
                            modules={[Autoplay]}
                            className='mySwiper overflow-visible'
                        >
                            {brands.map(brand => (
                                <SwiperSlide key={brand._id}>
                                    <div className='w-full h-full border-l border-gray-400'>
                                        <Link href={brand.linkUrl || '#'} aria-label={brand.title} className='flex items-center justify-center'>
                                            <img
                                                src={brand.image}
                                                alt={brand.title}
                                                className='object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300'
                                            />
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    )
}
