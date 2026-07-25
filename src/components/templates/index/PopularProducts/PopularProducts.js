import React from 'react'
import SectionHeader from '@root/src/components/modules/sectionHeader/sectionHeader'
import ProductBox from '../ProductBox/ProductBox';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FaChevronLeft } from "react-icons/fa6";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import './PopularProducts.css'

export default function PopularProducts() {
    return (
        <div>
            <div className='container'>
                <SectionHeader title={'محصولات منتخب'} desc={'براساس نظرات شما'} btnTitle={'مشاهده همه'} />
                <div className='overflow-hidden section-border bg-linear-to-r from-emerald-50 to-lime-100 py-4 px-2.5 md:py-8'>

                    <button className='prev absolute top-1/2 right-6 md:right-5 p-2 bg-white/95 rounded-full shadow-black shadow-custom z-10'>
                        <FaChevronLeft className='w-3 md:w-4 h-3 md:h-4 rotate-180 text-zinc-800' />
                    </button>

                    <Swiper
                        spaceBetween={2}
                        slidesPerView={2}
                        speed={1200}
                        navigation={{
                            prevEl: '.prev',
                            nextEl: '.next',
                        }}
                        breakpoints={{
                            640: { slidesPerView: 3, spaceBetween: 2 },
                            992: { slidesPerView: 4, spaceBetween: 2 },
                            1240: { slidesPerView: 5, spaceBetween: 2 },
                            1536: { slidesPerView: 6, spaceBetween: 2 },
                        }}
                        modules={[Navigation]}
                        className='mySwiper overflow-visible'
                    >
                        <SwiperSlide>
                            <ProductBox img={'/images/products/airpods.png'} img2={'/images/products/airpod2.png'} title={'هندزفری بلوتوثی کربی مدل CR-T107'} classes={'product-box__sm'} price={765000} discount={10} exPrice={850000} />
                        </SwiperSlide>

                        <SwiperSlide>
                            <ProductBox img={'/images/products/charge-cable.png'} img2={'/images/products/charge-cable2.png'} title={'کابل شارژ مولتی رابط مدل ایکس'} classes={'product-box__sm'} price={765000} discount={10} exPrice={850000} />
                        </SwiperSlide>

                        <SwiperSlide>
                            <ProductBox img={'/images/products/cover.png'} img2={'/images/products/cover2.png'} title={'هندزفری بلوتوثی کربی مدل CR-T107'} classes={'product-box__sm'} price={765000} discount={27} exPrice={850000} />
                        </SwiperSlide>

                        <SwiperSlide>
                            <ProductBox img={'/images/products/power-bank3.png'} img2={'/images/products/power-bank4.png'} title={'هندزفری بلوتوثی کربی مدل CR-T107'} classes={'product-box__sm'} price={765000} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ProductBox img={'/images/products/power-bank1.png'} img2={'/images/products/power-bank2.png'} title={'هندزفری بلوتوثی کربی مدل CR-T107'} classes={'product-box__sm'} price={765000} discount={88} exPrice={970000} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ProductBox img={'/images/products/car-charger.png'} img2={'/images/products/car-charger2.png'} title={'هندزفری بلوتوثی کربی مدل CR-T107'} classes={'product-box__sm'} price={765000} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ProductBox img={'/images/products/airpods.png'} title={'هندزفری بلوتوثی کربی مدل CR-T107'} classes={'product-box__sm'} price={765000} discount={88} exPrice={970000} />
                        </SwiperSlide>

                        <SwiperSlide>
                            <ProductBox img={'/images/products/charge-cable.png'} title={'هندزفری بلوتوثی کربی مدل CR-T107'} classes={'product-box__sm'} price={765000} discount={10} exPrice={850000} />
                        </SwiperSlide>
                    </Swiper>

                    <button className='next absolute top-1/2 left-6 md:left-5 p-2 bg-white/95 rounded-full shadow-black shadow-custom z-10'>
                            <FaChevronLeft className='w-3 md:w-4 h-3 md:h-4 text-zinc-800' />
                        </button>
                </div>
            </div>
        </div>
    )
}
