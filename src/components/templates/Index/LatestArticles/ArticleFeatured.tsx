"use client"

import Link from 'next/link'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { PiCalendarBlankLight } from 'react-icons/pi'
import { FaChevronLeft } from 'react-icons/fa6'

type ArticleDate = { day: string; month: string; year: string }

type ArticleFeaturedProps = {
    shortName: string
    img: string
    title: string
    date: ArticleDate
}

export default function ArticleFeatured({ shortName, img, title, date }: ArticleFeaturedProps) {
    return (
        <Link
            href={`/article-info/${shortName}`}
            className='group relative block h-full min-h-72 sm:min-h-96 overflow-hidden rounded-2xl shadow-xl'
        >
            <LazyLoadImage
                src={img}
                alt={title}
                height='100%'
                width='100%'
                wrapperClassName='absolute! inset-0 w-full! h-full! block!'
                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
            />

            <div className='absolute inset-0 bg-linear-to-t from-dark/90 via-dark/30 to-transparent' />

            <span className='absolute top-4 right-4 px-3 py-1 text-xs font-IranYekanMedium text-surface bg-neon rounded-full shadow-[0_0_20px_rgba(215,255,92,0.4)]'>
                تازه‌ترین مطلب
            </span>

            <div className='absolute inset-x-0 bottom-0 p-4 sm:p-6'>
                <h3 className='font-MorabbaBold text-lg sm:text-2xl leading-8 sm:leading-10 text-white line-clamp-3 group-hover:text-neon transition-colors'>
                    {title}
                </h3>

                <div className='flex items-center justify-between mt-4 pt-4 border-t border-white/20 text-xs sm:text-sm text-white/80'>
                    <span className='flex items-center gap-1.5'>
                        <PiCalendarBlankLight className='w-4 h-4' />
                        {date.day} {date.month} {date.year}
                    </span>
                    <span className='flex items-center gap-1 text-neon'>
                        ادامه مطلب
                        <FaChevronLeft className='w-3 h-3 group-hover:-translate-x-1 transition-transform' />
                    </span>
                </div>
            </div>
        </Link>
    )
}
