import Link from 'next/link'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import ProductCard from '@root/src/components/templates/Product/ProductCard/ProductCard'
import ArticleCard from '@root/src/components/templates/Articles/ArticleCard/ArticleCard'
import SearchBox from '@root/src/components/modules/SearchBox/SearchBox'
import { PiXCircleLight, PiPackageLight, PiArticleLight } from 'react-icons/pi'
import { searchAll } from '@root/src/lib/listQueries'
import { getPersianDateParts } from '@root/src/utils/date'
import { getDiscountPercent } from '@root/src/types/homeType'

export const dynamic = 'force-dynamic'

type TabKey = 'all' | 'products' | 'articles'

type PageProps = {
    params: Promise<{ query: string }>
    searchParams: Promise<{ tab?: string }>
}

function safeDecode(value: string) {
    try {
        return decodeURIComponent(value)
    } catch {
        return value
    }
}

export default async function SearchPage({ params, searchParams }: PageProps) {
    const { query: rawQuery } = await params
    const { tab: tabParam } = await searchParams

    const query = safeDecode(rawQuery).trim()
    const activeTab: TabKey = tabParam === 'products' || tabParam === 'articles' ? tabParam : 'all'

    const { products, articles } = query
        ? await searchAll(query)
        : { products: [], articles: [] }

    const totalResults = products.length + articles.length
    const showProducts = activeTab === 'all' || activeTab === 'products'
    const showArticles = activeTab === 'all' || activeTab === 'articles'
    const basePath = `/search/${encodeURIComponent(query)}`

    const tabs: { key: TabKey; label: string; count: number; icon?: typeof PiPackageLight }[] = [
        { key: 'all', label: 'همه', count: totalResults },
        { key: 'products', label: 'محصولات', count: products.length, icon: PiPackageLight },
        { key: 'articles', label: 'مقالات', count: articles.length, icon: PiArticleLight },
    ]

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'نتایج جستجو', to: basePath },
                ]}
            />

            <div className='container px-3 sm:px-0 pb-16'>

                <div className='max-w-xl mx-auto mb-6 sm:mb-8'>
                    <SearchBox initialValue={query} />
                </div>

                {totalResults === 0 ? (
                    <div className='flex flex-col items-center justify-center gap-4 py-16 sm:py-20 px-4 text-center bg-white shadow-lg rounded-2xl'>
                        <PiXCircleLight className='w-12 h-12 text-zinc-300' />
                        <div>
                            <h2 className='font-IranYekanBold text-zinc-700 wrap-break-word'>
                                {query ? `نتیجه‌ای برای «${query}» یافت نشد` : 'عبارت مورد نظر را جستجو کنید'}
                            </h2>
                            <p className='mt-1.5 text-sm text-zinc-400 leading-7'>
                                {query ? 'عبارت دیگری را امتحان کنید یا املای آن را بررسی کنید.' : 'می‌توانید در بین محصولات و مقالات کیوی‌تک جستجو کنید.'}
                            </p>
                        </div>
                        <Link href='/products/1' className='px-6 py-2.5 text-sm text-text linear_btn'>مشاهده همه محصولات</Link>
                    </div>
                ) : (
                    <>
                        <div className='flex items-center justify-between flex-wrap gap-3 mb-5 sm:mb-6'>
                            <h1 className='font-MorabbaBold text-lg sm:text-xl text-zinc-800 wrap-break-word min-w-0'>
                                نتایج جستجو برای «{query}»
                                <span className='text-sm text-zinc-400 font-IranYekan mr-2'>({totalResults.toLocaleString('fa-IR')} نتیجه)</span>
                            </h1>

                            <div className='flex items-center gap-1 w-full sm:w-auto p-1 overflow-x-auto bg-white shadow-sm border border-gray-100 rounded-xl text-xs sm:text-sm scrollbar-none [&::-webkit-scrollbar]:hidden'>
                                {tabs.map(tab => {
                                    const Icon = tab.icon
                                    return (
                                        <Link
                                            key={tab.key}
                                            href={tab.key === 'all' ? basePath : `${basePath}?tab=${tab.key}`}
                                            className={`flex items-center justify-center gap-1.5 flex-1 sm:flex-none shrink-0 px-3 sm:px-4 py-2 whitespace-nowrap rounded-lg transition-colors
                                                ${activeTab === tab.key ? 'bg-primary-500 text-white font-IranYekanMedium' : 'text-zinc-500 hover:text-zinc-700'}`}
                                        >
                                            {Icon && <Icon className='w-4 h-4' />}
                                            {tab.label} ({tab.count.toLocaleString('fa-IR')})
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {showProducts && products.length > 0 &&
                            <section className='mb-10'>
                                {activeTab === 'all' &&
                                    <h2 className='flex items-center gap-2 mb-4 font-IranYekanBold text-sm sm:text-base text-zinc-700'>
                                        <PiPackageLight className='w-4 h-4 text-primary-500' />
                                        محصولات
                                    </h2>
                                }
                                <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
                                    {products.map(product => (
                                        <ProductCard
                                            key={product._id}
                                            shortName={product.linkName}
                                            img={product.img}
                                            title={product.name}
                                            price={product.price}
                                            exPrice={product.exPrice}
                                            discount={getDiscountPercent(product) || undefined}
                                        />
                                    ))}
                                </div>
                            </section>
                        }

                        {showArticles && articles.length > 0 &&
                            <section>
                                {activeTab === 'all' &&
                                    <h2 className='flex items-center gap-2 mb-4 font-IranYekanBold text-sm sm:text-base text-zinc-700'>
                                        <PiArticleLight className='w-4 h-4 text-primary-500' />
                                        مقالات
                                    </h2>
                                }
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
                            </section>
                        }

                        {activeTab === 'products' && products.length === 0 &&
                            <div className='py-16 text-center text-sm text-zinc-400 bg-white shadow-lg rounded-2xl'>محصولی مطابق این جستجو یافت نشد.</div>
                        }
                        {activeTab === 'articles' && articles.length === 0 &&
                            <div className='py-16 text-center text-sm text-zinc-400 bg-white shadow-lg rounded-2xl'>مقاله‌ای مطابق این جستجو یافت نشد.</div>
                        }
                    </>
                )}
            </div>

            <Footer marginClasses={'mt-16 sm:mt-20'} />
        </div>
    )
}
