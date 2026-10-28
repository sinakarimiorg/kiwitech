import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import ArticleCard from '@root/src/components/templates/Articles/ArticleCard/ArticleCard'
import Pagination from '@root/src/components/modules/Pagination/Pagination'
import ListSearch from '@root/src/components/modules/ListSearch/ListSearch'
import { PiXCircleLight, PiArticleLight, PiXBold, PiCaretDownBold } from 'react-icons/pi'
import { getPersianDateParts } from '@root/src/utils/date'
import { buildQuery } from '@root/src/utils/query'
import { getArticleCategories, getArticleListing } from '@root/src/lib/listings/listings'

export const dynamic = 'force-dynamic'

// canonical بدون query string (فیلتر و مرتب‌سازی) و مخصوص هر صفحه‌ی صفحه‌بندی
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
    const { page } = await params
    const pageNumber = Number(page) > 1 ? Math.floor(Number(page)) : 1
    return {
        title: pageNumber > 1 ? `موبولند مگ - صفحه ${pageNumber.toLocaleString('fa-IR')}` : 'موبولند مگ',
        description: 'آخرین مطالب، اخبار و راهنمای خرید لوازم جانبی موبایل',
        alternates: { canonical: `/articles/${pageNumber}` },
    }
}

const PER_PAGE = 9
const BASE_PATH = '/articles'

type PageProps = {
    params: Promise<{ page: string }>
    searchParams: Promise<{ q?: string; category?: string }>
}

export default async function ArticlesPage({ params, searchParams }: PageProps) {
    const { page } = await params
    const { q: qParam, category } = await searchParams
    const q = qParam?.trim() || undefined

    const [listing, categories] = await Promise.all([
        getArticleListing({ q, category, page: Number(page) || 1, perPage: PER_PAGE }),
        getArticleCategories().catch(() => [] as string[]),
    ])

    const state = { q, category }
    const href = (override: Partial<typeof state> = {}) => `${BASE_PATH}/1${buildQuery({ ...state, ...override })}`
    const hasFilters = Boolean(q || category)

    const categoryList = (
        <div className='flex flex-col gap-1'>
            <Link
                href={href({ category: undefined })}
                className={`px-3 py-2 rounded-lg text-sm transition-colors
                    ${!category ? 'bg-primary-50 text-primary-600 font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}>
                همه مطالب
            </Link>
            {categories.map(name => (
                <Link
                    key={name}
                    href={href({ category: name })}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors
                        ${category === name ? 'bg-primary-50 text-primary-600 font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}>
                    {name}
                </Link>
            ))}
        </div>
    )

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'مطالب خواندنی', to: '/articles/1' },
                ]}
            />

            <div className='container px-3 sm:px-0 pb-16'>
                <div className='flex items-center justify-between gap-3 mb-5 sm:mb-8'>
                    <div>
                        <h1 className='font-MorabbaBold text-xl sm:text-2xl text-zinc-800'>{category ?? 'موبولـند مگ'}</h1>
                        <p className='mt-1.5 text-xs sm:text-sm text-zinc-400'>آخرین مطالب، اخبار و راهنمای خرید لوازم جانبی موبایل</p>
                    </div>
                    <span className='shrink-0 text-sm text-zinc-400'>{listing.total.toLocaleString('fa-IR')} مقاله</span>
                </div>

                <div className='flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8'>

                    <aside className='w-full lg:w-64 shrink-0'>
                        <div className='lg:sticky lg:top-28 flex flex-col gap-4'>

                            <div className='bg-white shadow-lg rounded-2xl p-3 sm:p-4'>
                                <ListSearch
                                    basePath={BASE_PATH}
                                    initialValue={q}
                                    placeholder='جستجو در مقالات...'
                                    params={{ category }}
                                />
                            </div>

                            <details className='group lg:hidden bg-white shadow-lg rounded-2xl'>
                                <summary className='flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden'>
                                    <span className='flex items-center gap-2 font-IranYekanBold text-sm text-zinc-800'>
                                        <PiArticleLight className='w-4 h-4 text-primary-500' />
                                        دسته‌بندی مطالب
                                        {category && <span className='text-xs text-primary-600 font-IranYekanMedium'>({category})</span>}
                                    </span>
                                    <PiCaretDownBold className='w-3.5 h-3.5 text-zinc-400 transition-transform group-open:rotate-180' />
                                </summary>
                                <div className='px-3 pb-3 max-h-80 overflow-y-auto'>{categoryList}</div>
                            </details>

                            <div className='hidden lg:block bg-white shadow-lg rounded-2xl p-5'>
                                <h2 className='flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 font-IranYekanBold text-sm text-zinc-800'>
                                    <PiArticleLight className='w-4 h-4 text-primary-500' />
                                    دسته‌بندی مطالب
                                </h2>
                                {categoryList}
                            </div>
                        </div>
                    </aside>

                    <div className='flex-1 min-w-0'>
                        {hasFilters &&
                            <div className='flex items-center flex-wrap gap-2 mb-4 sm:mb-6'>
                                {q &&
                                    <Link href={href({ q: undefined })} className='flex items-center gap-1.5 px-3 py-1 text-xs text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors'>
                                        «{q}» <PiXBold className='w-3 h-3' />
                                    </Link>
                                }
                                {category &&
                                    <Link href={href({ category: undefined })} className='flex items-center gap-1.5 px-3 py-1 text-xs text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors'>
                                        {category} <PiXBold className='w-3 h-3' />
                                    </Link>
                                }
                                <Link href={`${BASE_PATH}/1`} className='text-xs text-zinc-400 hover:text-zinc-600 transition-colors'>حذف همه</Link>
                            </div>
                        }

                        {listing.items.length === 0 ? (
                            <div className='flex flex-col items-center justify-center gap-4 py-16 sm:py-24 px-4 text-center bg-white shadow-lg rounded-2xl'>
                                <PiXCircleLight className='w-12 h-12 text-zinc-300' />
                                <div>
                                    <h2 className='font-IranYekanBold text-zinc-700'>مقاله‌ای یافت نشد</h2>
                                    <p className='mt-1.5 text-sm text-zinc-400'>فیلترها را تغییر دهید یا عبارت دیگری را جستجو کنید.</p>
                                </div>
                                {hasFilters &&
                                    <Link href={`${BASE_PATH}/1`} className='px-6 py-2.5 text-sm text-text linear_btn'>حذف فیلترها</Link>
                                }
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'>
                                {listing.items.map(article => (
                                    <ArticleCard
                                        key={article._id}
                                        shortName={article.linkName}
                                        img={article.img}
                                        title={article.title}
                                        date={[getPersianDateParts(article.createdAt)]}
                                        category={article.category}
                                    />
                                ))}
                            </div>
                        )}

                        <Pagination
                            currentPage={listing.page}
                            totalPages={listing.totalPages}
                            basePath={BASE_PATH}
                            query={buildQuery(state)}
                        />
                    </div>
                </div>
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}
