import React from 'react'
import { HiMiniChevronLeft } from "react-icons/hi2";
import { FaChevronLeft } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import './Landing.css'

export default function Landing() {
    return (
        <>
            <div className='relative sm:mt-72'>
                <button className='prev absolute top-1/2 right-6 md:right-10 p-2 md:p-3 bg-white/15 hover:bg-white/50 rounded-full shadow-black shadow-custom z-10'>
                    <FaChevronLeft className='w-3 md:w-4 xl:w-5 h-3 md:h-4 xl:h-5 rotate-180 text-zinc-800' />
                </button>
                <Swiper
                    spaceBetween={5}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    speed={1200}
                    pagination={
                        { clickable: true }
                    }
                    navigation={{
                        prevEl: '.prev',
                        nextEl: '.next',
                    }}
                    grabCursor={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className='mySwiper'
                >
                    <SwiperSlide>
                        <div className='relative w-full h-50 custom-sc:h-60 xl:h-80 bg-linear-to-r from-orange-300 to-orange-600'>
                            <div className='flex flex-col items-center justify-center my-auto h-full sm:w-88 md:w-md custom-sc:w-120 xl:w-160 text-white'>
                                <div className='moveNow flex flex-col items-center justify-center'>
                                    <h4 className='banner--title-first font-MorabbaBold text-xl md:text-2xl custom-sc:text-3xl xl:text-4xl tracking-wide xl:leading-10'>
                                        پرفروش ترین ساعت های هوشمند!
                                    </h4>
                                    <h4 className='banner--title-second font-MorabbaBold text-sm md:text-base custom-sc:text-xl xl:text-2xl tracking-tight xl:leading-10 pt-3'>
                                        حرفه ای باش!
                                    </h4>
                                </div>
                                <button className='shopping-btn mt-3 md:mt-4 custom-sc:mt-6 pr-3 md:pr-3.5 custom-sc:pr-5 pl-0.5 md:pl-1 custom-sc:pl-1.5 xl:pl-2 py-1 xl:py-1.5 font-DanaMedium
     text-xs md:text-base custom-sc:text-lg xl:text-xl hover:bg-neon hover:text-black border border-white/75 hover:border-0 shadow-2xl 
     rounded-2xl flex-center'>
                                    خرید
                                    <HiMiniChevronLeft className='w-5 xl:w-6 h-5 xl:h-6 pb-0.5 xl:pb-1' />
                                </button>
                            </div>
                            <img className='absolute -top-26 left-2.5 w-68.75 h-68.75 object-contain hidden sm:block custom-sc:w-87.5 xl:w-112.5 custom-sc:h-87.5 xl:h-112.5 custom-sc:-top-32 custom-sc:left-12' src='/images/banners/banner-smart watch.png' />
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className='relative w-full h-50 custom-sc:h-60 xl:h-80 bg-linear-to-r from-rose-400 to-red-500'>
                            <div className='flex flex-col items-center justify-center my-auto h-full sm:w-88 md:w-md custom-sc:w-120 xl:w-160 text-custom-dark'>
                                <h4 className='banner--title-first font-MorabbaBold text-xl md:text-2xl custom-sc:text-3xl xl:text-4xl tracking-wide xl:leading-10'>
                                    این یک حلقه ساده نیست...!
                                </h4>
                                <h4 className='banner--title-second font-MorabbaBold text-sm md:text-base custom-sc:text-xl xl:text-2xl tracking-tight xl:leading-10 pt-3'>
                                    دستیار هوشمند سلامتیه!
                                </h4>
                                <button className='shopping-btn mt-3 md:mt-4 custom-sc:mt-6 pr-3 md:pr-3.5 custom-sc:pr-5 pl-0.5 md:pl-1 custom-sc:pl-1.5 xl:pl-2 py-1 xl:py-1.5 font-DanaMedium
     text-xs md:text-base custom-sc:text-lg xl:text-xl hover:bg-neon hover:text-black border border-white/75 hover:border-0 shadow-2xl 
     rounded-2xl flex-center'>
                                    خرید
                                    <HiMiniChevronLeft className='w-5 xl:w-6 h-5 xl:h-6 pb-0.5 xl:pb-1' />
                                </button>
                            </div>
                            <img className='absolute -top-26 left-2.5 w-68.75 h-68.75 object-contain hidden sm:block custom-sc:w-87.5 xl:w-112.5 custom-sc:h-87.5 xl:h-112.5 custom-sc:-top-32 custom-sc:left-12' src='/images/banners/banner-smartRing.png' />
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className='relative w-full h-50 custom-sc:h-60 xl:h-80 bg-linear-to-r from-slate-300 to-slate-500'>

                            <div className='flex flex-col items-center justify-center my-auto h-full sm:w-88 md:w-md custom-sc:w-120 xl:w-160 text-white -translate-x-6'>
                                <h4 className='banner--title-first font-MorabbaBold text-xl md:text-2xl custom-sc:text-3xl xl:text-4xl tracking-wide xl:leading-10 uppercase'>
                                    کیفیت را گوش دهید!
                                </h4>
                                <h4 className='banner--title-second font-MorabbaBold text-sm md:text-base custom-sc:text-xl xl:text-2xl tracking-tight xl:leading-10 pt-3'>
                                    انواع هندزفری از 500 هزار تومان
                                </h4>
                                <button className='shopping-btn mt-3 md:mt-4 custom-sc:mt-6 pr-3 md:pr-3.5 custom-sc:pr-5 pl-0.5 md:pl-1 custom-sc:pl-1.5 xl:pl-2 py-1 xl:py-1.5 font-DanaMedium
     text-xs md:text-base custom-sc:text-lg xl:text-xl hover:bg-neon hover:text-black border border-white/75 hover:border-0 shadow-2xl 
     rounded-2xl flex-center'>
                                    خرید
                                    <HiMiniChevronLeft className='w-5 xl:w-6 h-5 xl:h-6 pb-0.5 xl:pb-1' />
                                </button>
                            </div>
                            <img className='absolute -top-26 left-2.5 w-68.75 h-68.75 object-contain hidden sm:block custom-sc:w-87.5 xl:w-112.5 custom-sc:h-87.5 xl:h-112.5 custom-sc:-top-32 custom-sc:left-12' src='/images/banners/banner-headphones.png' />
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className='relative w-full h-50 custom-sc:h-60 xl:h-80 bg-linear-to-r from-teal-200 to-teal-500'>
                            <div className='flex flex-col items-center justify-center my-auto h-full sm:w-88 md:w-md custom-sc:w-120 xl:w-160 text-custom-dark -translate-x-6'>
                                <div className='banner--title-first font-MorabbaBold text-xl md:text-2xl custom-sc:text-3xl xl:text-4xl tracking-wide xl:leading-10 uppercase'>
                                    اقتصادی اما ایده‌آل!
                                </div>
                                <h4 className='banner--title-second font-MorabbaBold text-sm md:text-base custom-sc:text-xl xl:text-2xl tracking-tight xl:leading-10 pt-3'>
                                    با تجهیزات
                                    &nbsp;
                                    <span className='font-serif text-xl'>creative</span>
                                    &nbsp;
                                    عاشق موزیک شو!
                                </h4>
                                <button className='shopping-btn mt-3 md:mt-4 custom-sc:mt-6 pr-3 md:pr-3.5 custom-sc:pr-5 pl-0.5 md:pl-1 custom-sc:pl-1.5 xl:pl-2 py-1 xl:py-1.5 font-DanaMedium
     text-xs md:text-base custom-sc:text-lg xl:text-xl hover:bg-neon hover:text-black border border-white/75 hover:border-0 shadow-2xl 
     rounded-2xl flex-center'>
                                    خرید
                                    <HiMiniChevronLeft className='w-5 xl:w-6 h-5 xl:h-6 pb-0.5 xl:pb-1' />
                                </button>
                            </div>
                            <img className='absolute -top-26 left-2.5 w-68.75 h-68.75 object-contain hidden sm:block custom-sc:w-87.5 xl:w-112.5 custom-sc:h-87.5 xl:h-112.5 custom-sc:-top-32 custom-sc:left-12' src='/images/banners/banner-speaker.jpg' />
                        </div>
                    </SwiperSlide>
                </Swiper>
                <button className='next absolute top-1/2 left-6 md:left-10 p-2 md:p-3 bg-white/15 hover:bg-white/50 rounded-full shadow-black shadow-custom z-10'>
                    <FaChevronLeft className='w-3 md:w-4 xl:w-5 h-3 md:h-4 xl:h-5  text-zinc-800' />
                </button>
            </div>
        </>
    )
}
