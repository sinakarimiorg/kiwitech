"use client"

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import ProductCard from '@root/src/components/templates/Product/ProductCard/ProductCard'
import ArticleCard from '@root/src/components/templates/Articles/ArticleCard/ArticleCard'
import allProducts from '@root/Products'
import allArticles from '@root/Articles'

import { RiSearch2Line } from 'react-icons/ri'
import { PiMagnifyingGlassLight, PiXCircleLight, PiPackageLight, PiArticleLight } from 'react-icons/pi'

type TabKey = 'all' | 'products' | 'articles'

// همون تابع محاسبه درصد تخفیف که در صفحه‌ی همه محصولات استفاده شده
function getDiscount(item: any) {
    if (!item.exPrice || item.exPrice <= item.price) return undefined
    return Math.round(((item.exPrice - item.price) / item.exPrice) * 100)
}

export default function SearchPage() {
    const params = useParams<{ query: string }>()
    const initialQuery = decodeURIComponent(params?.query ?? '')

    const [search, setSearch] = useState(initialQuery)
    const [activeTab, setActiveTab] = useState<TabKey>('all')

    const trimmedSearch = search.trim()

    const matchedProducts = useMemo(() => {
        if (!trimmedSearch) return []
        return (allProducts as any[]).filter(p => p.title?.includes(trimmedSearch))
    }, [trimmedSearch])

    const matchedArticles = useMemo(() => {
        if (!trimmedSearch) return []
        return (allArticles as any[]).filter(a => a.title?.includes(trimmedSearch))
    }, [trimmedSearch])

    const totalResults = matchedProducts.length + matchedArticles.length
    const showProducts = activeTab === 'all' || activeTab === 'products'
    const showArticles = activeTab === 'all' || activeTab === 'articles'

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'نتایج جستجو', to: `/search/${encodeURIComponent(trimmedSearch)}` },
                ]}
            />

            <div className='container pb-16'>

                {/* Search Box */}
                <div className='max-w-xl mx-auto mb-8'>
                    <div className='flex items-center gap-2 px-4 py-3 bg-white shadow-lg border border-gray-200 rounded-2xl focus-within:border-primary-400 transition-colors'>
                        <RiSearch2Line className='w-5 h-5 text-zinc-400 shrink-0' />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type='text'
                            placeholder='جستجو در محصولات و مقالات...'
                            className='w-full bg-transparent outline-none placeholder:text-zinc-400 text-sm sm:text-base'
                        />
                        {search &&
                            <button onClick={() => setSearch('')} className='text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer'>
                                <PiXCircleLight className='w-5 h-5' />
                            </button>
                        }
                    </div>
                </div>

                {!trimmedSearch ? (
                    <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
                        <PiMagnifyingGlassLight className='w-12 h-12 text-zinc-300' />
                        <div>
                            <h2 className='font-IranYekanBold text-zinc-700'>عبارت مورد نظر را جستجو کنید</h2>
                            <p className='mt-1.5 text-sm text-zinc-400'>می‌توانید در بین محصولات و مقالات فروشگاه کیوی‌تک جستجو کنید.</p>
                        </div>
                    </div>
                ) : totalResults === 0 ? (
                    <div className='flex flex-col items-center justify-center gap-4 py-20 text-center bg-white shadow-lg rounded-2xl'>
                        <PiXCircleLight className='w-12 h-12 text-zinc-300' />
                        <div>
                            <h2 className='font-IranYekanBold text-zinc-700'>نتیجه‌ای برای «{trimmedSearch}» یافت نشد</h2>
                            <p className='mt-1.5 text-sm text-zinc-400'>عبارت دیگری را امتحان کنید یا املای آن را بررسی کنید.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header + Tabs */}
                        <div className='flex items-center justify-between flex-wrap gap-4 mb-6'>
                            <h1 className='font-MorabbaBold text-lg sm:text-xl text-zinc-800'>
                                نتایج جستجو برای «{trimmedSearch}»
                                <span className='text-sm text-zinc-400 font-IranYekan mr-2'>({totalResults.toLocaleString('fa-IR')} نتیجه)</span>
                            </h1>

                            <div className='flex items-center gap-1 p-1 bg-white shadow-sm border border-gray-100 rounded-xl text-xs sm:text-sm'>
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer
                                        ${activeTab === 'all' ? 'bg-primary-500 text-white font-IranYekanMedium' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                    همه ({totalResults.toLocaleString('fa-IR')})
                                </button>
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer
                                        ${activeTab === 'products' ? 'bg-primary-500 text-white font-IranYekanMedium' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                    <PiPackageLight className='w-4 h-4' />
                                    محصولات ({matchedProducts.length.toLocaleString('fa-IR')})
                                </button>
                                <button
                                    onClick={() => setActiveTab('articles')}
                                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer
                                        ${activeTab === 'articles' ? 'bg-primary-500 text-white font-IranYekanMedium' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                    <PiArticleLight className='w-4 h-4' />
                                    مقالات ({matchedArticles.length.toLocaleString('fa-IR')})
                                </button>
                            </div>
                        </div>

                        {/* Products */}
                        {showProducts && matchedProducts.length > 0 && (
                            <div className='mb-10'>
                                {activeTab === 'all' &&
                                    <h2 className='flex items-center gap-2 mb-4 font-IranYekanBold text-sm sm:text-base text-zinc-700'>
                                        <PiPackageLight className='w-4 h-4 text-primary-500' />
                                        محصولات
                                    </h2>
                                }
                                <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
                                    {matchedProducts.map((product: any) => (
                                        <ProductCard
                                            key={product.id}
                                            shortName={String(product.id)}
                                            img={product.img1}
                                            img2={product.img2}
                                            title={product.title}
                                            price={product.price}
                                            exPrice={product.exPrice}
                                            discount={getDiscount(product)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Articles */}
                        {showArticles && matchedArticles.length > 0 && (
                            <div>
                                {activeTab === 'all' &&
                                    <h2 className='flex items-center gap-2 mb-4 font-IranYekanBold text-sm sm:text-base text-zinc-700'>
                                        <PiArticleLight className='w-4 h-4 text-primary-500' />
                                        مقالات
                                    </h2>
                                }
                                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'>
                                    {matchedArticles.map((article: any) => (
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
                            </div>
                        )}

                        {/* حالتی که تب انتخاب‌شده نتیجه‌ای ندارد (مثلا تب مقالات درحالی‌که فقط محصول پیدا شده) */}
                        {activeTab === 'products' && matchedProducts.length === 0 && (
                            <div className='py-16 text-center text-sm text-zinc-400 bg-white shadow-lg rounded-2xl'>محصولی مطابق این جستجو یافت نشد.</div>
                        )}
                        {activeTab === 'articles' && matchedArticles.length === 0 && (
                            <div className='py-16 text-center text-sm text-zinc-400 bg-white shadow-lg rounded-2xl'>مقاله‌ای مطابق این جستجو یافت نشد.</div>
                        )}
                    </>
                )}
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}
