"use client"

import { useMemo } from 'react'
import Link from 'next/link'
import { PiArrowUpRightLight } from 'react-icons/pi'
import { RiFireLine } from 'react-icons/ri'
import allProducts from '@root/Products'
import allArticles from '@root/Articles'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'

// جستجوهای پرطرفدار - در آینده می‌تواند از API یا آمار واقعی جستجوی کاربران خوانده شود
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
}

export default function SearchSuggestions({ query, onNavigate }: SearchSuggestionsProps) {
    const trimmed = query.trim()

    const matchedProducts = useMemo(() => {
        if (!trimmed) return []
        return (allProducts as any[]).filter(p => p.title?.includes(trimmed)).slice(0, 4)
    }, [trimmed])

    const matchedArticles = useMemo(() => {
        if (!trimmed) return []
        return (allArticles as any[]).filter(a => a.title?.includes(trimmed)).slice(0, 3)
    }, [trimmed])

    const hasResults = matchedProducts.length > 0 || matchedArticles.length > 0

    return (
        // onMouseDown با preventDefault جلوی بسته شدن زودهنگام باکس (به خاطر رویداد blur اینپوت) را می‌گیرد
        <div
            onMouseDown={e => e.preventDefault()}
            className='absolute top-full right-0 left-0 mt-2 max-h-[70vh] overflow-y-auto bg-dark-secondary border border-border border-t-[3px] border-t-primary-500 shadow-custom rounded-2xl text-text z-40'
        >
            {!trimmed ? (
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
            ) : !hasResults ? (
                <div className='p-6 text-center text-sm text-text-muted'>
                    نتیجه‌ای برای «{trimmed}» یافت نشد.
                </div>
            ) : (
                <div className='p-3 sm:p-4'>
                    {matchedProducts.length > 0 && (
                        <div className='mb-3'>
                            <p className='px-2 mb-1.5 text-xs text-text-muted'>محصولات</p>
                            <div className='flex flex-col'>
                                {matchedProducts.map((product: any) => (
                                    <Link
                                        key={product.id}
                                        href={`/product-info/${product.id}`}
                                        onClick={onNavigate}
                                        className='flex items-center gap-3 px-2 py-2 hover:bg-navbar-hover rounded-xl transition-colors'>
                                        <span className='flex-center shrink-0 w-11 h-11 bg-white/5 rounded-lg overflow-hidden'>
                                            <img src={product.img1} className='w-full h-full object-contain' alt={product.title} />
                                        </span>
                                        <span className='flex-1 min-w-0'>
                                            <span className='block text-sm line-clamp-1'>{product.title}</span>
                                            <span className='inline-flex items-center gap-1 mt-0.5 text-xs text-neon'>
                                                {product.price?.toLocaleString()}
                                                <TomanIcon className='w-2.5 h-2.5' />
                                            </span>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {matchedArticles.length > 0 && (
                        <div className={matchedProducts.length > 0 ? 'pt-3 border-t border-border-light' : ''}>
                            <p className='px-2 mb-1.5 text-xs text-text-muted'>مقالات</p>
                            <div className='flex flex-col'>
                                {matchedArticles.map((article: any) => (
                                    <Link
                                        key={article.id}
                                        href={`/article-info/${article.shortName}`}
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
            )}
        </div>
    )
}
