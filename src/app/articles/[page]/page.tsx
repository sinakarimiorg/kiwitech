import Link from 'next/link'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import Pagination from '@root/src/components/modules/Pagination/Pagination'
import ArticleCard from '@root/src/components/templates/Articles/ArticleCard/ArticleCard'
import { PiMagnifyingGlassLight, PiXCircleLight } from 'react-icons/pi'
import { getArticlesPage } from '@root/src/lib/listQueries'
import { getPersianDateParts } from '@root/src/utils/date'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'مطالب خواندنی | کیوی‌تک',
    description: 'آخرین مطالب، اخبار و راهنمای خرید لوازم جانبی موبایل',
}

const PER_PAGE = 9

function queryString(filters: { q?: string; category?: string }) {
    const params = new URLSearchParams()
    if (filters.q) params.set('q', filters.q)
    if (filters.category) params.set('category', filters.category)
    const query = params.toString()
    return query ? `?${query}` : ''
}

type PageProps = {
    params: Promise<{ page: string }>
    searchParams: Promise<{ q?: string; category?: string }>
}

export default async function ArticlesPage({ params, searchParams }: PageProps) {
    const { page } = await params
    const { q, category } = await searchParams
    const filters = { q: q?.trim() || undefined, category: category || undefined }

    const { articles, total, page: currentPage, totalPages, categories } = await getArticlesPage({
        ...filters,
        page: Number(page) || 1,
        perPage: PER_PAGE,
    })

    const chipClasses = (active: boolean) =>
        `shrink-0 px-3.5 py-2 text-xs sm:text-sm whitespace-nowrap rounded-lg transition-colors
        ${active ? 'bg-primary-500 text-white font-IranYekanMedium' : 'text-zinc-500 bg-white hover:bg-primary-50 shadow-sm'}`

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

                <div className='flex items-end justify-between flex-wrap gap-x-4 gap-y-2 mb-5 sm:mb-8'>
                    <div>
                        <h1 className='font-MorabbaBold text-xl sm:text-2xl text-zinc-800'>کیوی مگ</h1>
                        <p className='mt-1.5 text-sm text-zinc-400 leading-7'>آخرین مطالب، اخبار و راهنمای خرید لوازم جانبی موبایل</p>
                    </div>
                    <span className='text-sm text-zinc-400'>{total.toLocaleString('fa-IR')} مقاله</span>
                </div>

                {/* Search */}
                <form
                    action='/articles/1'
                    method='get'
                    role='search'
                    className='flex items-center gap-2 px-4 py-2.5 mb-4 bg-white shadow-lg border border-gray-200 rounded-2xl text-zinc-400 focus-within:border-primary-400 transition-colors sm:max-w-md'
                >
                    <PiMagnifyingGlassLight className='w-5 h-5 shrink-0' />
                    <input
                        type='search'
                        name='q'
                        defaultValue={filters.q}
                        enterKeyHint='search'
                        placeholder='جستجو در مقالات...'
                        aria-label='جستجو در مقالات'
                        className='w-full min-w-0 bg-transparent outline-none placeholder:text-zinc-400 text-base sm:text-sm'
                    />
                    {filters.category && <input type='hidden' name='category' value={filters.category} />}
                </form>

                {categories.length > 0 &&
                    <div className='flex items-center gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden'>
                        <Link href={`/articles/1${queryString({ q: filters.q })}`} className={chipClasses(!filters.category)}>
                            همه مطالب
                        </Link>
                        {categories.map(name => (
                            <Link
                                key={name}
                                href={`/articles/1${queryString({ q: filters.q, category: name })}`}
                                className={chipClasses(filters.category === name)}
                            >
                                {name}
                            </Link>
                        ))}
                    </div>
                }

                {articles.length === 0 ? (
                    <div className='flex flex-col items-center justify-center gap-4 py-16 sm:py-24 px-4 text-center bg-white shadow-lg rounded-2xl'>
                        <PiXCircleLight className='w-12 h-12 text-zinc-300' />
                        <div>
                            <h2 className='font-IranYekanBold text-zinc-700'>مقاله‌ای یافت نشد</h2>
                            <p className='mt-1.5 text-sm text-zinc-400 leading-7'>دسته‌بندی را تغییر دهید یا عبارت دیگری را جستجو کنید.</p>
                        </div>
                        {(filters.q || filters.category) &&
                            <Link href='/articles/1' className='px-6 py-2.5 text-sm text-text linear_btn'>حذف فیلترها</Link>
                        }
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'>
                        {articles.map(article => (
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
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath='/articles'
                    query={queryString(filters)}
                />
            </div>

            <Footer marginClasses={'mt-16 sm:mt-20'} />
        </div>
    )
}
