"use client"

import Link from 'next/link'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { FaChevronLeft } from 'react-icons/fa6'

type ArticleDate = {
    day: string
    month: string
    year: string
}

type ArticleCardProps = {
    shortName: string
    img: string
    title: string
    date: ArticleDate[]
    category?: string
}

export default function ArticleCard({ shortName, img, title, date, category }: ArticleCardProps) {
    const { day, month, year } = date[0]

    return (
        <Link
            href={`/article-info/${shortName}`}
            className='group flex flex-col w-full h-full bg-white shadow-lg rounded-2xl overflow-hidden cursor-pointer transition-transform hover:-translate-y-1'>

            {/* تصویر مقاله */}
            <div className='relative w-full aspect-video shrink-0 overflow-hidden'>
                <LazyLoadImage
                    src={img}
                    alt={title}
                    height={'100%'}
                    width={'100%'}
                    effect='blur'
                    wrapperClassName='!w-full !h-full !block'
                />

                {category &&
                    <span className='absolute top-2.5 right-2.5 px-2.5 py-1 text-xs font-IranYekanMedium text-primary-600 bg-white/90 rounded-lg'>
                        {category}
                    </span>
                }

                <div className='absolute inset-0 flex-center flex-col invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-linear-to-r from-orange-200/80 to-orange-300/80 transition-all delay-75'>
                    <img src='/images/logo/logo.png' className='w-10 h-10 object-contain' />
                    <p className='pt-2 font-sans font-extrabold text-sm text-purple-custom'>Mobo Mag</p>
                </div>
            </div>

            {/* بدنه کارت */}
            <div className='flex flex-col flex-1 p-4'>
                <h2 className='flex-1 text-sm sm:text-base leading-6 sm:leading-7 text-zinc-700 line-clamp-2 min-h-12 sm:min-h-14 group-hover:text-primary-500 transition-colors'>
                    {title}
                </h2>

                <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-100'>
                    <div className='flex items-center gap-1 text-xs sm:text-sm text-teal-600'>
                        <span className='font-DanaDemiBold'>{day}</span>
                        <span>{month}</span>
                        <span>{year}</span>
                    </div>

                    <span className='flex-center gap-x-1 h-6 pr-2.5 pl-2 font-DanaMedium text-xs text-orange-300 bg-orange-200/20 rounded-md'>
                        مطالعه
                        <FaChevronLeft className='w-3 h-3' />
                    </span>
                </div>
            </div>
        </Link>
    )
}