"use client"

import Link from 'next/link'
import { PiArrowUpRightLight } from 'react-icons/pi'
import { RiFireLine } from 'react-icons/ri'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import { MIN_QUERY_LENGTH, useSearchSuggestions } from '../useSearchSuggestions'

const popularSearches = [
    'هندزفری بلوتوثی',
    'پاوربانک',
    'قاب و کاور گوشی',
    'کابل شارژ',
    'ساعت هوشمند',
    'اسپیکر بلوتوث',
]

type SearchSuggestionsProps = {
    query: string
    onNavigate?: () => void
    embedded?: boolean
}

function Skeleton() {
    return (
        <div className='flex flex-col gap-3 p-4' aria-hidden='true'>
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className='flex items-center gap-3'>
                    <span className='w-11 h-11 shrink-0 rounded-lg bg-white/10 animate-pulse' />
                    <span className='flex-1 flex flex-col gap-2'>
                        <span className='h-3 w-3/4 rounded bg-white/10 animate-pulse' />
                        <span className='h-3 w-1/3 rounded bg-white/10 animate-pulse' />
                    </span>
                </div>
            ))}
        </div>
    )
}

export default function SearchSuggestions({ query, onNavigate, embedded = false }: SearchSuggestionsProps) {
    const trimmed = query.trim()
    const { data, isLoading } = useSearchSuggestions(trimmed)

    const { products, articles } = data
    const hasResults = products.length > 0 || articles.length > 0
    const isShort = trimmed.length < MIN_QUERY_LENGTH

    const content = isShort ? (
        <div className='p-4 sm:p-5'>
            <p className='flex items-center gap-1.5 mb-3 text-xs text-text-muted'>
                <RiFireLine className='w-3.5 h-3.5 text-neon' />
                جستجوهای پرطرفدار
            </p>
            <div className='flex flex-wrap gap-2'>
                {popularSearches.map(term => (
                    <Link
                        key={term}
                        href={`/search/${encodeURIComponent(term)}`}
                        onClick={onNavigate}
                        className='px-3 py-1.5 text-xs sm:text-sm bg-dark border border-border-light hover:border-primary-500 hover:text-primary-400 rounded-full transition-colors'>
                        {term}
                    </Link>
                ))}
            </div>
        </div>
    ) : isLoading && !hasResults ? (
        <Skeleton />
    ) : !hasResults ? (
        <div className='p-6 text-center text-sm text-text-muted'>
            نتیجه‌ای برای «{trimmed}» یافت نشد.
        </div>
    ) : (
        <div className={`p-3 sm:p-4 transition-opacity ${isLoading ? 'opacity-60' : ''}`}>
            {products.length > 0 && (
                <div className='mb-3'>
                    <p className='px-2 mb-1.5 text-xs text-text-muted'>محصولات</p>
                    <div className='flex flex-col'>
                        {products.map(product => (
                            <Link
                                key={product._id}
                                href={`/product-info/${product.linkName}`}
                                onClick={onNavigate}
                                className='flex items-center gap-3 px-2 py-2 hover:bg-navbar-hover rounded-xl transition-colors'>
                                <span className='flex-center shrink-0 w-11 h-11 bg-white/5 rounded-lg overflow-hidden'>
                                    <img src={product.img} className='w-full h-full object-contain' alt={product.name} />
                                </span>
                                <span className='flex-1 min-w-0'>
                                    <span className='block text-sm line-clamp-1'>{product.name}</span>
                                    <span className='inline-flex items-center gap-1 mt-0.5 text-xs text-neon'>
                                        {product.price.toLocaleString()}
                                        <TomanIcon className='w-2.5 h-2.5' />
                                    </span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {articles.length > 0 && (
                <div className={products.length > 0 ? 'pt-3 border-t border-border-light' : ''}>
                    <p className='px-2 mb-1.5 text-xs text-text-muted'>مقالات</p>
                    <div className='flex flex-col'>
                        {articles.map(article => (
                            <Link
                                key={article._id}
                                href={`/article-info/${article.linkName}`}
                                onClick={onNavigate}
                                className='flex items-center gap-3 px-2 py-2 hover:bg-navbar-hover rounded-xl transition-colors'>
                                <span className='shrink-0 w-11 h-11 rounded-lg overflow-hidden'>
                                    <img src={article.img} className='w-full h-full object-cover' alt={article.title} />
                                </span>
                                <span className='flex-1 min-w-0 text-sm line-clamp-1'>{article.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <Link
                href={`/search/${encodeURIComponent(trimmed)}`}
                onClick={onNavigate}
                className='flex items-center justify-between gap-2 mt-3 pt-3 px-2 border-t border-border-light text-sm text-primary-400 hover:text-primary-300 transition-colors'>
                مشاهده همه نتایج برای «{trimmed}»
                <PiArrowUpRightLight className='w-4 h-4' />
            </Link>
        </div>
    )

    if (embedded) return <div className='text-text'>{content}</div>

    return (
        <div
            onMouseDown={e => e.preventDefault()}
            className='absolute top-full right-0 left-0 mt-2 max-h-[70vh] overflow-y-auto bg-dark-secondary border border-border border-t-[3px] border-t-primary-500 shadow-2xl rounded-2xl text-text z-40'
        >
            {content}
        </div>
    )
}
