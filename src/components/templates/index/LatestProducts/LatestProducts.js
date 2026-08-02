import React, { useEffect } from 'react'
import SectionHeader from '@root/src/components/modules/SectionHeader/SectionHeader'
import ProductBox from '../ProductBox/ProductBox';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function LatestProducts() {
    return (
        <div>
            <div className='container'>
                <SectionHeader title={'جدیدترین محصولات'} desc={'از تازه ها شروع کن!'} btnTitle={'مشاهده همه'} btnHref={'/products/1'} />
                <div className='overflow-hidden'>
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
                </div>
            </div>
        </div>
    )
}
