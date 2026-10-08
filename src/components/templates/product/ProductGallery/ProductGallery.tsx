"use client"

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Keyboard, Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { FaXmark } from 'react-icons/fa6'
import { PiMagnifyingGlassPlusLight } from 'react-icons/pi'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'

type LightboxProps = {
    images: string[]
    name: string
    startIndex: number
    onClose: () => void
}

function Lightbox({ images, name, startIndex, onClose }: LightboxProps) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [onClose])

    return createPortal(
        <div className='fixed inset-0 z-60 flex flex-col bg-black/95' role='dialog' aria-modal='true' aria-label={name}>
            <div className='flex items-center justify-between gap-3 shrink-0 px-4 py-3 text-white'>
                <span className='text-sm line-clamp-1'>{name}</span>
                <button
                    type='button'
                    onClick={onClose}
                    className='flex items-center gap-1.5 shrink-0 px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer'
                >
                    <FaXmark />
                    بستن
                </button>
            </div>

            <div className='relative flex-1 min-h-0'>
                <Swiper
                    modules={[Navigation, Pagination, Keyboard, Zoom]}
                    initialSlide={startIndex}
                    zoom={true}
                    keyboard={{ enabled: true }}
                    navigation={images.length > 1}
                    pagination={images.length > 1 ? { type: 'fraction' } : false}
                    style={{
                        '--swiper-navigation-color': '#fff',
                        '--swiper-pagination-color': '#fff',
                    } as CSSProperties}
                    className='absolute! inset-0 max-md:[&_.swiper-button-prev]:hidden max-md:[&_.swiper-button-next]:hidden'
                >
                    {images.map((src, index) => (
                        <SwiperSlide key={index}>
                            <div className='swiper-zoom-container'>
                                <img src={src} alt={name} className='max-w-full max-h-full object-contain' />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>,
        document.body
    )
}

/* ───────── main gallery───────── */
type ProductGalleryProps = {
    images: string[]
    name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    const hasMany = images.length > 1

    return (
        <div className='w-full'>
            <div className='relative'>
                <Swiper
                    modules={[FreeMode, Navigation, Pagination, Thumbs]}
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation={hasMany}
                    pagination={hasMany ? { clickable: true } : false}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
                    style={{
                        '--swiper-navigation-color': '#2E3642',
                        '--swiper-navigation-size': '22px',
                        '--swiper-pagination-color': '#7D971B',
                    } as CSSProperties}
                    className='w-full aspect-square bg-gray-50/70 border border-gray-100 rounded-2xl
                        max-md:[&_.swiper-button-prev]:hidden max-md:[&_.swiper-button-next]:hidden md:[&_.swiper-pagination]:hidden'
                >
                    {images.map((src, index) => (
                        <SwiperSlide key={index}>
                            <button
                                type='button'
                                onClick={() => setIsLightboxOpen(true)}
                                aria-label='نمایش تصویر بزرگ'
                                className='flex items-center justify-center w-full h-full p-4 sm:p-6 cursor-zoom-in'
                            >
                                <img src={src} alt={name} className='max-w-full max-h-full object-contain' />
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <span className='pointer-events-none absolute bottom-3 left-3 z-10 flex-center w-8 h-8 text-zinc-500 bg-white/90 rounded-full shadow-sm'>
                    <PiMagnifyingGlassPlusLight className='w-4 h-4' />
                </span>
            </div>

            {/* Only For Desctop: small photos*/}
            {hasMany &&
                <div className='hidden md:block mt-3'>
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        modules={[FreeMode, Thumbs]}
                        spaceBetween={8}
                        slidesPerView='auto'
                        freeMode={true}
                        watchSlidesProgress={true}
                    >
                        {images.map((src, index) => (
                            <SwiperSlide
                                key={index}
                                className='w-16! h-16! lg:w-20! lg:h-20! cursor-pointer opacity-60 [&.swiper-slide-thumb-active]:opacity-100 transition-opacity'
                            >
                                <img
                                    src={src}
                                    alt={`${name} - ${index + 1}`}
                                    className='w-full h-full object-cover bg-primary-50/50 border-2 border-transparent in-[.swiper-slide-thumb-active]:border-primary-500 rounded-xl'
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            }

            {isLightboxOpen &&
                <Lightbox
                    images={images}
                    name={name}
                    startIndex={activeIndex}
                    onClose={() => setIsLightboxOpen(false)}
                />
            }
        </div>
    )
}
