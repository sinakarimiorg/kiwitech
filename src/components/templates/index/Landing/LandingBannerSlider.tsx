"use client"

import type { CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { FaChevronLeft } from 'react-icons/fa6'
import { HiMiniChevronLeft } from 'react-icons/hi2'
import { PiSparkleLight } from 'react-icons/pi'
import type { HomeBanner } from '@root/src/types/homeType'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const frameClasses = 'relative w-full h-full overflow-hidden rounded-3xl aspect-video lg:aspect-auto lg:min-h-105 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]'

const navButtonClasses =
    `hidden sm:flex items-center justify-center absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 text-white
    bg-white/10 backdrop-blur-md border border-white/25 rounded-full shadow-lg
    opacity-0 group-hover/slider:opacity-100 hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer`

function DefaultSlide() {
    return (
        <div className={`${frameClasses} flex flex-col justify-center px-6 sm:px-12 bg-linear-to-br from-primary-700 via-primary-600 to-dark-secondary`}>
            <div className='pointer-events-none absolute -top-16 -left-10 w-64 h-64 bg-neon/25 rounded-full blur-3xl' />

            <div className='relative z-10 max-w-md'>
                <span className='inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 text-xs sm:text-sm text-neon bg-white/10 border border-neon/25 rounded-full'>
                    <PiSparkleLight className='w-4 h-4' />
                    نسل جدید لوازم جانبی موبایل
                </span>
                <h2 className='font-MorabbaBold text-3xl sm:text-4xl xl:text-5xl leading-tight text-text'>
                    تکنولوژی رو
                    <span className='block mt-1 text-neon neon-text-glow'>یه‌جور دیگه تجربه کن</span>
                </h2>
                <p className='mt-4 text-sm sm:text-base text-text/80 leading-8'>
                    هرچی که برای گوشیت لازم داری، با اصالت کامل و ارسال سریع.
                </p>
                <Link
                    href='/products/1'
                    className='group inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm sm:text-base bg-neon text-surface rounded-2xl shadow-[0_0_30px_rgba(215,255,92,0.35)] hover:shadow-[0_0_45px_rgba(215,255,92,0.55)] transition-shadow'
                >
                    شروع خرید
                    <HiMiniChevronLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
                </Link>
            </div>
        </div>
    )
}

export default function LandingBannerSlider({ banners }: { banners: HomeBanner[] }) {
    if (banners.length === 0) return <DefaultSlide />

    const isMulti = banners.length > 1

    return (
        <div className='group/slider relative h-full'>
            <Swiper
                modules={[Autoplay, Keyboard, Navigation, Pagination]}
                loop={isMulti}
                speed={800}
                keyboard={{ enabled: true }}
                autoplay={isMulti ? { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                navigation={{ prevEl: '.landing-banner-prev', nextEl: '.landing-banner-next' }}
                pagination={{ clickable: true }}
                style={{
                    '--swiper-pagination-color': '#D7FF5C',
                    '--swiper-pagination-bullet-inactive-color': '#FFFFFF',
                    '--swiper-pagination-bullet-inactive-opacity': '0.45',
                    '--swiper-pagination-bottom': '14px',
                } as CSSProperties}
                className={`${frameClasses}`}
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={banner._id}>
                        <Link href={banner.linkUrl || '#'} aria-label={banner.title} className='relative block w-full h-full'>
                            <Image
                                src={banner.image}
                                alt={banner.title}
                                fill
                                priority={index === 0}
                                sizes='(max-width: 1024px) 100vw, 66vw'
                                className='object-cover'
                            />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>

            {isMulti && (
                <>
                    <button
                        type='button'
                        aria-label='بنر قبلی'
                        className={`landing-banner-prev right-3 ${navButtonClasses}`}
                    >
                        <FaChevronLeft className='w-4 h-4 rotate-180' />
                    </button>
                    <button
                        type='button'
                        aria-label='بنر بعدی'
                        className={`landing-banner-next left-3 ${navButtonClasses}`}                    >
                        <FaChevronLeft className='w-4 h-4' />
                    </button>
                </>
            )}
        </div>
    )
}
