import React from 'react'
import { BsPatchCheck } from "react-icons/bs";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaChevronLeft } from "react-icons/fa6";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import './PopularBrands.css'

export default function PopularBrands() {
    return (
        <div className='hidden sm:block mt-20'>
            <div className='container'>
                <div className='flex items-center w-full  text-white border border-gray-400 rounded-2xl'>
                    {/* Brands Section Title */}
                    <div className='w-3/12 2xl:w-1/6 h-full p-3 md:p-5 text-center bg-linear-to-r from-primary-500 to-primary-600  rounded-r-xl'>
                        <BsPatchCheck className='mx-auto w-10 lg:w-12 h-10 lg:h-12' />
                        <h2 className='pt-3 lg:pt-5 font-DanaMedium lg:font-DanaDemiBold md:text-lg lg:text-2xl'>بـرنــدهای محـبوب</h2>
                    </div>

                    {/* Brands Slider Section */}
                    <div className='w-9/12 2xl:w-5/6 my-auto overflow-hidden'>

                        <Swiper
                            spaceBetween={1}
                            slidesPerView={3}
                            loop={true}
                            speed={1200}
                            autoplay={{
                                delay: 1000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                992: { slidesPerView: 4, spaceBetween: 2 },
                                1240: { slidesPerView: 5, spaceBetween: 2 },
                                1536: { slidesPerView: 6, spaceBetween: 2 },
                            }}
                            modules={[Autoplay]}
                            className='mySwiper overflow-visible'
                        >
                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/apple.jpg' />
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/samsung.jpg' />
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/huawei.jpg' />
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/asus.jpg' />
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/adata.jpg' />
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/anker.jpg' />
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/haylou.jpg' />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/jbl.jpg' />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/LG.jpg' />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/philips.jpg' />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/sony.jpg' />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/tp-link.jpg' />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='brand-item'>
                                    <img src='/images/brands/tsco.jpg' />
                                </div>
                            </SwiperSlide>
                        </Swiper>

                    </div>
                </div>
            </div>
        </div>
    )
}
