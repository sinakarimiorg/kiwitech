import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import Pagination from '@root/src/components/modules/Pagination/Pagination'
import ListSearch from '@root/src/components/modules/ListSearch/ListSearch'
import ProductCard from '@root/src/components/templates/Product/ProductCard/ProductCard'
import { PiSlidersHorizontalLight, PiXCircleLight, PiXBold, PiCaretDownBold } from 'react-icons/pi'
import { getDiscountPercent } from '@root/src/types/homeType'
import { buildQuery } from '@root/src/utils/query'
import {
    PRODUCT_SORTS,
    getFilterCategories,
    getProductListing,
    isProductSort,
    type ProductSort,
} from '@root/src/lib/listings/listings'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
    const { page } = await params
    const pageNumber = Number(page) > 1 ? Math.floor(Number(page)) : 1
    return {
        title: pageNumber > 1 ? `همه محصولات - صفحه ${pageNumber.toLocaleString('fa-IR')}` : 'همه محصولات',
        description: 'مشاهده و خرید انواع لوازم جانبی موبایل و کامپیوتر از کیوی‌تک',
        alternates: { canonical: `/products/${pageNumber}` },
    }
}

const PER_PAGE = 12
const BASE_PATH = '/products'

type PageProps = {
    params: Promise<{ page: string }>
    searchParams: Promise<{ q?: string; category?: string; subCategory?: string; sort?: string }>
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
    const { page } = await params
    const { q: qParam, category, subCategory, sort: sortParam = 'newest' } = await searchParams

    const q = qParam?.trim() || undefined
    const sort: ProductSort = isProductSort(sortParam) ? sortParam : 'newest'
    const activeSubCategory = category ? subCategory : undefined

    const [listing, categories] = await Promise.all([
        getProductListing({
            q,
            category,
            subCategory: activeSubCategory,
            sort,
            page: Number(page) || 1,
            perPage: PER_PAGE,
        }),
        getFilterCategories().catch(() => []),
    ])

    const state = { q, category, subCategory: activeSubCategory, sort: sort === 'newest' ? undefined : sort }
    const href = (override: Partial<typeof state> = {}) => `${BASE_PATH}/1${buildQuery({ ...state, ...override })}`

    const hasFilters = Boolean(q || category)
    const activeCount = [q, category, activeSubCategory].filter(Boolean).length

    const chipClasses = (active: boolean) =>
        `px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap rounded-lg transition-colors
        ${active ? 'bg-primary-500 text-white font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`

    const categoryList = (
        <div className='flex flex-col gap-1'>
            <Link
                href={href({ category: undefined, subCategory: undefined })}
                className={`px-3 py-2 rounded-lg text-sm transition-colors
                    ${!category ? 'bg-primary-50 text-primary-600 font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}>
                همه محصولات
            </Link>
            {categories.map(cat => {
                const isActive = category === cat.title
                return (
                    <div key={cat._id}>
                        <Link
                            href={href({ category: cat.title, subCategory: undefined })}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                                ${isActive && !activeSubCategory ? 'bg-primary-50 text-primary-600 font-IranYekanMedium' : isActive ? 'text-primary-600 font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}>
                            {cat.title}
                            {cat.items?.length > 0 && <PiCaretDownBold className={`w-3 h-3 transition-transform ${isActive ? 'rotate-180' : ''}`} />}
                        </Link>
                        {isActive && cat.items?.length > 0 &&
                            <div className='flex flex-col gap-0.5 mt-1 mr-3 pr-3 border-r border-gray-100'>
                                {cat.items.map(item => (
                                    <Link
                                        key={item._id}
                                        href={href({ category: cat.title, subCategory: item.title })}
                                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors
                                            ${activeSubCategory === item.title ? 'bg-primary-50 text-primary-600 font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}>
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        }
                    </div>
                )
            })}
        </div>
    )

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'همه محصولات', to: '/products/1' },
                ]}
            />

            <div className='container px-3 sm:px-0 pb-16'>
                <div className='flex items-center justify-between gap-3 mb-5 sm:mb-8'>
                    <h1 className='font-MorabbaBold text-xl sm:text-2xl text-zinc-800'>
                        {activeSubCategory ?? category ?? 'همه محصولات'}
                    </h1>
                    <span className='shrink-0 text-sm text-zinc-400'>{listing.total.toLocaleString('fa-IR')} محصول</span>
                </div>

                <div className='flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8'>

                    <aside className='w-full lg:w-64 shrink-0'>
                        <div className='lg:sticky lg:top-28 flex flex-col gap-4'>

                            <div className='bg-white shadow-lg rounded-2xl p-3 sm:p-4'>
                                <ListSearch
                                    basePath={BASE_PATH}
                                    initialValue={q}
                                    placeholder='جستجو در محصولات...'
                                    params={{ category, subCategory: activeSubCategory, sort: state.sort }}
                                />
                            </div>

                            {/* Mobile & Tablet: Collapsible Filter Panel */}
                            <details className='group lg:hidden bg-white shadow-lg rounded-2xl'>
                                <summary className='flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden'>
                                    <span className='flex items-center gap-2 font-IranYekanBold text-sm text-zinc-800'>
                                        <PiSlidersHorizontalLight className='w-4 h-4 text-primary-500' />
                                        دسته‌بندی‌ها
                                        {activeCount > 0 &&
                                            <span className='px-1.5 text-xs text-white bg-primary-500 rounded-full'>{activeCount.toLocaleString('fa-IR')}</span>
                                        }
                                    </span>
                                    <PiCaretDownBold className='w-3.5 h-3.5 text-zinc-400 transition-transform group-open:rotate-180' />
                                </summary>
                                <div className='px-3 pb-3 max-h-80 overflow-y-auto'>{categoryList}</div>
                            </details>

                            {/* Desktop: Fixed Sidebar */}
                            <div className='hidden lg:block bg-white shadow-lg rounded-2xl p-5'>
                                <h2 className='flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 font-IranYekanBold text-sm text-zinc-800'>
                                    <PiSlidersHorizontalLight className='w-4 h-4 text-primary-500' />
                                    دسته‌بندی‌ها
                                </h2>
                                {categoryList}
                            </div>
                        </div>
                    </aside>

                    <div className='flex-1 min-w-0'>

                        <div className='flex items-center gap-3 mb-4 sm:mb-6 bg-white shadow-lg rounded-2xl px-3 sm:px-4 py-3'>
                            <span className='hidden sm:block text-sm text-zinc-400 shrink-0'>مرتب‌سازی:</span>
                            <div className='flex items-center gap-1.5 overflow-x-auto scrollbar-none'>
                                {PRODUCT_SORTS.map(option => (
                                    <Link
                                        key={option.key}
                                        href={href({ sort: option.key === 'newest' ? undefined : option.key })}
                                        className={chipClasses(sort === option.key)}>
                                        {option.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {hasFilters &&
                            <div className='flex items-center flex-wrap gap-2 mb-4 sm:mb-6'>
                                {[
                                    q && { label: `«${q}»`, to: href({ q: undefined }) },
                                    category && { label: category, to: href({ category: undefined, subCategory: undefined }) },
                                    activeSubCategory && { label: activeSubCategory, to: href({ subCategory: undefined }) },
                                ].filter((chip): chip is { label: string; to: string } => Boolean(chip)).map(chip => (
                                    <Link
                                        key={chip.label}
                                        href={chip.to}
                                        className='flex items-center gap-1.5 px-3 py-1 text-xs text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors'>
                                        {chip.label}
                                        <PiXBold className='w-3 h-3' />
                                    </Link>
                                ))}
                                <Link href={`${BASE_PATH}/1`} className='text-xs text-zinc-400 hover:text-zinc-600 transition-colors'>
                                    حذف همه
                                </Link>
                            </div>
                        }

                        {listing.items.length === 0 ? (
                            <div className='flex flex-col items-center justify-center gap-4 py-16 sm:py-24 px-4 text-center bg-white shadow-lg rounded-2xl'>
                                <PiXCircleLight className='w-12 h-12 text-zinc-300' />
                                <div>
                                    <h2 className='font-IranYekanBold text-zinc-700'>محصولی یافت نشد</h2>
                                    <p className='mt-1.5 text-sm text-zinc-400'>فیلترها را تغییر دهید یا عبارت دیگری را جستجو کنید.</p>
                                </div>
                                {hasFilters &&
                                    <Link href={`${BASE_PATH}/1`} className='px-6 py-2.5 text-sm text-text linear_btn'>حذف فیلترها</Link>
                                }
                            </div>
                        ) : (
                            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
                                {listing.items.map(product => (
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
