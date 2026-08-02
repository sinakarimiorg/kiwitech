"use client"

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import ArticleCard from '@root/src/components/templates/Articles/ArticleCard/ArticleCard'
import Pagination from '@root/src/components/modules/Pagination/Pagination'
import allArticles from '@root/Articles'

import { PiMagnifyingGlassLight, PiXCircleLight, PiArticleLight } from 'react-icons/pi'

const categories = ['راهنمای خرید', 'اخبار تکنولوژی', 'بررسی محصول', 'آموزش']
const PER_PAGE = 3

export default function ArticlesPage() {
    const params = useParams<{ page: string }>()
    const currentPage = Math.max(1, Number(params?.page) || 1)

    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    const filtered = useMemo(() => {
        let list = [...(allArticles as any[])]

        if (activeCategory) {
            list = list.filter(a => a.category === activeCategory)
        }

        if (search.trim()) {
            list = list.filter(a => a.title?.includes(search.trim()))
        }

        return list.sort((a, b) => b.id - a.id)
    }, [search, activeCategory])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const safePage = Math.min(currentPage, totalPages)
    const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'مطالب خواندنی', to: '/articles/1' },
                ]}
            />

            <div className='container pb-16'>
                <div className='flex items-center justify-between flex-wrap gap-4 mb-8'>
                    <div>
                        <h1 className='font-MorabbaBold text-xl sm:text-2xl text-zinc-800'>موبولـند مگ</h1>
                        <p className='mt-1.5 text-sm text-zinc-400'>آخرین مطالب، اخبار و راهنمای خرید لوازم جانبی موبایل</p>
                    </div>
                    <span className='text-sm text-zinc-400'>{filtered.length.toLocaleString('fa-IR')} مقاله</span>
                </div>

                <div className='flex flex-col lg:flex-row gap-6 xl:gap-8'>

                    <aside className='w-full lg:w-64 shrink-0'>
                        <div className='lg:sticky lg:top-28 flex flex-col gap-5'>

                            <div className='bg-white shadow-lg rounded-2xl p-4'>
                                <div className='flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                                    <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        type='text'
                                        placeholder='جستجو در مقالات...'
                                        className='w-full bg-transparent outline-none placeholder:text-zinc-400'
                                    />
                                </div>
                            </div>

                            <div className='bg-white shadow-lg rounded-2xl p-5'>
                                <h2 className='flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 font-IranYekanBold text-sm text-zinc-800'>
                                    <PiArticleLight className='w-4 h-4 text-primary-500' />
                                    دسته‌بندی مطالب
                                </h2>
                                <div className='flex flex-col gap-1'>
                                    <button
                                        onClick={() => setActiveCategory(null)}
                                        className={`text-right px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer
                                            ${!activeCategory ? 'bg-primary-50 text-primary-600 font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}>
                                        همه مطالب
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`text-right px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer
                                                ${activeCategory === cat ? 'bg-primary-50 text-primary-600 font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className='flex-1 min-w-0'>
                        {paginated.length === 0 ? (
                            <div className='flex flex-col items-center justify-center gap-4 py-24 text-center bg-white shadow-lg rounded-2xl'>
                                <PiXCircleLight className='w-12 h-12 text-zinc-300' />
                                <div>
                                    <h2 className='font-IranYekanBold text-zinc-700'>مقاله‌ای یافت نشد</h2>
                                    <p className='mt-1.5 text-sm text-zinc-400'>فیلترها را تغییر دهید یا عبارت دیگری را جستجو کنید.</p>
                                </div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'>
                                {paginated.map((article: any) => (
                                    <ArticleCard
                                        key={article.id}
                                        shortName={article.shortName}
                                        img={article.img}
                                        title={article.title}
                                        date={article.date}
                                        category={article.category}
                                    />
                                ))}
                            </div>
                        )}

                        <Pagination currentPage={safePage} totalPages={totalPages} basePath='/articles' />
                    </div>
                </div>
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}