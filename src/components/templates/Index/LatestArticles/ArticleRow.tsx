"use client"

import Link from 'next/link'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { PiCalendarBlankLight } from 'react-icons/pi'

type ArticleDate = { day: string; month: string; year: string }

type ArticleRowProps = {
    index: number
    shortName: string
    img: string
    title: string
    date: ArticleDate
}

export default function ArticleRow({ index, shortName, img, title, date }: ArticleRowProps) {
    return (
        <Link
            href={`/article-info/${shortName}`}
            className='group flex items-center gap-3 sm:gap-4 py-4 first:pt-0 last:pb-0'
        >
            <span className='hidden sm:block w-8 shrink-0 font-MorabbaBold text-3xl text-primary-300 group-hover:text-primary-500 transition-colors'>
                {index.toLocaleString('fa-IR')}
            </span>

            <div className='w-24 h-20 sm:w-28 sm:h-24 shrink-0 overflow-hidden rounded-xl'>
                <LazyLoadImage
                    src={img}
                    alt={title}
                    height='100%'
                    width='100%'
                    wrapperClassName='w-full! h-full! block!'
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                />
            </div>

            <div className='flex-1 min-w-0'>
                <h3 className='text-sm sm:text-base leading-7 text-zinc-700 line-clamp-2 group-hover:text-primary-600 transition-colors'>
                    {title}
                </h3>
                <span className='flex items-center gap-1.5 mt-2 text-xs text-teal-600'>
                    <PiCalendarBlankLight className='w-3.5 h-3.5' />
                    {date.day} {date.month} {date.year}
                </span>
            </div>
        </Link>
    )
}
