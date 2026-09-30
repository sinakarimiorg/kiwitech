import Link from 'next/link'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import Pagination from '@root/src/components/modules/Pagination/Pagination'
import ProductCard from '@root/src/components/templates/Product/ProductCard/ProductCard'
import OfferCountdown from '@root/src/components/templates/Index/AmazingOffers/OfferCountdown'
import { PiLightningFill, PiXCircleLight } from 'react-icons/pi'
import { getAllOfferProducts } from '@root/src/lib/home/homeData'
import { getHomeSections } from '@root/src/lib/siteSettings'
import { getEndOfIranDay } from '@root/src/utils/date'
import { getDiscountPercent } from '@root/src/types/homeType'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'تخفیفات شگفت‌انگیز | کیوی‌تک',
    description: 'بهترین تخفیف‌های کیوی‌تک روی لوازم جانبی موبایل و کامپیوتر',
}

const PER_PAGE = 12

type SortKey = 'discount' | 'cheap' | 'expensive' | 'newest'

const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'discount', label: 'بیشترین تخفیف' },
    { key: 'cheap', label: 'ارزان‌ترین' },
    { key: 'expensive', label: 'گران‌ترین' },
    { key: 'newest', label: 'جدیدترین' },
]

const isSortKey = (value: string): value is SortKey => sortOptions.some(option => option.key === value)

const buildQuery = (sort: SortKey, category?: string) => {
    const params = new URLSearchParams()
    if (sort !== 'discount') params.set('sort', sort)
    if (category) params.set('category', category)
    const query = params.toString()
    return query ? `?${query}` : ''
}

type PageProps = {
    params: Promise<{ page: string }>
    searchParams: Promise<{ sort?: string; category?: string }>
}

export default async function AmazingOffersPage({ params, searchParams }: PageProps) {
    const { page } = await params
    const { sort: sortParam = 'discount', category } = await searchParams
    const sort: SortKey = isSortKey(sortParam) ? sortParam : 'discount'
    const currentPage = Math.max(1, Number(page) || 1)

    const [allOffers, sections] = await Promise.all([getAllOfferProducts(), getHomeSections()])
    const offersConfig = sections.find(section => section.key === 'amazingOffers')
    const title = offersConfig?.title || 'تخفیفات شگفت‌انگیز'
    const subtitle = offersConfig?.subtitle

    const categoryCounts = allOffers.reduce<Record<string, number>>((acc, product) => {
        if (product.category) acc[product.category] = (acc[product.category] ?? 0) + 1
        return acc
    }, {})
    const categories = Object.entries(categoryCounts)

    const products = category ? allOffers.filter(product => product.category === category) : [...allOffers]

    switch (sort) {
        case 'cheap': products.sort((a, b) => a.price - b.price); break
        case 'expensive': products.sort((a, b) => b.price - a.price); break
        case 'newest': products.sort((a, b) => b._id.localeCompare(a._id)); break
        default: products.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a))
    }

    const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE))
    const safePage = Math.min(currentPage, totalPages)
    const paginated = products.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

    const words = title.trim().split(/\s+/)
    const highlight = words.length > 1 ? words.pop() : null

    const chipClasses = (active: boolean) =>
        `px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap rounded-lg transition-colors
        ${active ? 'bg-primary-500 text-white font-IranYekanMedium' : 'text-zinc-500 bg-white hover:bg-primary-50 shadow-sm'}`

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'شگفت‌انگیزها', to: '/amazing-offers/1' },
                ]}
            />

            <div className='container px-3 sm:px-0 pb-16'>

                {/* Hero */}
                <section className='relative overflow-hidden rounded-3xl bg-linear-to-br from-dark via-dark-secondary to-dark px-6 sm:px-10 py-8 sm:py-10 mb-8 text-text'>
                    <div className='pointer-events-none absolute -top-20 -left-12 w-64 h-64 bg-neon/20 rounded-full blur-3xl' />
                    <div className='pointer-events-none absolute -bottom-24 right-16 w-64 h-64 bg-primary-500/25 rounded-full blur-3xl' />

                    <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6'>
                        <div>
                            <span className='inline-flex items-center gap-1.5 px-3 py-1 mb-4 text-xs text-neon bg-white/5 border border-neon/25 rounded-full'>
                                <PiLightningFill className='w-4 h-4' />
                                پیشنهاد لحظه‌ای
                            </span>
                            <h1 className='font-MorabbaBold text-2xl sm:text-4xl leading-relaxed'>
                                {words.join(' ')}
                                <span> </span>
                                {highlight && <span className='mr-2 text-neon neon-text-glow'>{highlight}</span>}
                            </h1>
                            <p className='mt-2 text-sm text-text-muted leading-7'>
                                {subtitle ? `${subtitle} ` : ''}
                                {allOffers.length.toLocaleString('fa-IR')} محصول تخفیف‌دار
                            </p>
                        </div>

                        <div>
                            <p className='mb-2 text-xs text-text-muted'>زمان باقی‌مانده تا پایان امروز</p>
                            <OfferCountdown endsAt={getEndOfIranDay()} />
                        </div>
                    </div>
                </section>

                {allOffers.length === 0 ? (
                    <div className='flex flex-col items-center justify-center gap-4 py-24 text-center bg-white shadow-lg rounded-2xl'>
                        <PiXCircleLight className='w-12 h-12 text-zinc-300' />
                        <div>
                            <h2 className='font-IranYekanBold text-zinc-700'>الان محصول تخفیف‌داری نداریم</h2>
                            <p className='mt-1.5 text-sm text-zinc-400'>به‌زودی پیشنهادهای جدید اضافه می‌شود.</p>
                        </div>
                        <Link href='/products/1' className='px-6 py-2.5 text-sm text-text linear_btn'>مشاهده همه‌ی محصولات</Link>
                    </div>
                ) : (
                    <>
                        {/* فیلترها */}
                        <div className='flex flex-col gap-4 mb-6'>
                            {categories.length > 0 &&
                                <div className='flex items-center gap-2 overflow-x-auto pb-1'>
                                    <Link href={`/amazing-offers/1${buildQuery(sort)}`} className={chipClasses(!category)}>
                                        همه
                                    </Link>
                                    {categories.map(([name, count]) => (
                                        <Link
                                            key={name}
                                            href={`/amazing-offers/1${buildQuery(sort, name)}`}
                                            className={chipClasses(category === name)}
                                        >
                                            {name} ({count.toLocaleString('fa-IR')})
                                        </Link>
                                    ))}
                                </div>
                            }

                            <div className='flex items-center justify-between flex-wrap gap-3 px-4 py-3 bg-white shadow-lg rounded-2xl'>
                                <div className='flex items-center gap-1.5 flex-wrap'>
                                    <span className='hidden sm:block ml-2 text-sm text-zinc-400'>مرتب‌سازی:</span>
                                    {sortOptions.map(option => (
                                        <Link
                                            key={option.key}
                                            href={`/amazing-offers/1${buildQuery(option.key, category)}`}
                                            className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors
                                                ${sort === option.key ? 'bg-primary-500 text-white font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}
                                        >
                                            {option.label}
                                        </Link>
                                    ))}
                                </div>
                                <span className='text-sm text-zinc-400'>{products.length.toLocaleString('fa-IR')} محصول</span>
                            </div>
                        </div>

                        {/* لیست محصولات */}
                        {paginated.length === 0 ? (
                            <div className='py-20 text-center text-sm text-zinc-400 bg-white shadow-lg rounded-2xl'>
                                محصولی در این دسته‌بندی پیدا نشد.
                            </div>
                        ) : (
                            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
                                {paginated.map(product => (
                                    <ProductCard
                                        key={product._id}
                                        shortName={product.linkName}
                                        img={product.img}
                                        title={product.name}
                                        price={product.price}
                                        exPrice={product.exPrice}
                                        discount={getDiscountPercent(product)}
                                    />
                                ))}
                            </div>
                        )}

                        <Pagination
                            currentPage={safePage}
                            totalPages={totalPages}
                            basePath='/amazing-offers'
                            query={buildQuery(sort, category)}
                        />
                    </>
                )}
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}
