import Link from 'next/link'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import Pagination from '@root/src/components/modules/Pagination/Pagination'
import ProductCard from '@root/src/components/templates/Product/ProductCard/ProductCard'
import FilterDrawer from '@root/src/components/templates/Product/FilterDrawer/FilterDrawer'
import { PiMagnifyingGlassLight, PiSlidersHorizontalLight, PiXBold, PiXCircleLight } from 'react-icons/pi'
import { getFilterCategories, getProductsPage, isProductSort, productSortOptions } from '@root/src/lib/listQueries'
import type { ProductSort } from '@root/src/lib/listQueries'
import { getDiscountPercent } from '@root/src/types/homeType'
import type { MenuCategory } from '@root/src/types/menuType'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'همه محصولات | کیوی‌تک',
    description: 'مشاهده و خرید انواع لوازم جانبی موبایل و کامپیوتر از کیوی‌تک',
}

const PER_PAGE = 12
const DEFAULT_SORT: ProductSort = 'newest'

type Filters = {
    q?: string
    category?: string
    subCategory?: string
    sort: ProductSort
}

function queryString(filters: Partial<Filters>) {
    const params = new URLSearchParams()
    if (filters.q) params.set('q', filters.q)
    if (filters.category) params.set('category', filters.category)
    if (filters.subCategory) params.set('subCategory', filters.subCategory)
    if (filters.sort && filters.sort !== DEFAULT_SORT) params.set('sort', filters.sort)
    const query = params.toString()
    return query ? `?${query}` : ''
}

const filterHref = (filters: Filters, next: Partial<Filters>) => `/products/1${queryString({ ...filters, ...next })}`

const rowClasses = (active: boolean) =>
    `block text-right px-3 py-2.5 lg:py-2 rounded-lg text-sm transition-colors
    ${active ? 'bg-primary-50 text-primary-600 font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`

function CategoryFilterList({ categories, filters }: { categories: MenuCategory[]; filters: Filters }) {
    return (
        <div className='flex flex-col gap-1'>
            <Link href={filterHref(filters, { category: undefined, subCategory: undefined })} className={rowClasses(!filters.category)}>
                همه محصولات
            </Link>

            {categories.map(category => {
                const isActive = filters.category === category.title

                return (
                    <div key={category._id}>
                        <Link
                            href={filterHref(filters, { category: category.title, subCategory: undefined })}
                            className={rowClasses(isActive && !filters.subCategory)}
                        >
                            {category.title}
                        </Link>

                        {isActive && category.items.length > 0 &&
                            <div className='flex flex-col gap-1 mt-1 mr-4 pr-3 border-r border-gray-100'>
                                {category.items.map(item => (
                                    <Link
                                        key={item._id}
                                        href={filterHref(filters, { category: category.title, subCategory: item.title })}
                                        className={rowClasses(filters.subCategory === item.title)}
                                    >
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
}

function ProductsSearchForm({ filters }: { filters: Filters }) {
    return (
        <form
            action='/products/1'
            method='get'
            role='search'
            className='flex items-center gap-2 px-3 py-2 bg-white lg:bg-gray-50 border border-gray-200 rounded-xl text-zinc-400 focus-within:border-primary-400 transition-colors'
        >
            <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
            <input
                type='search'
                name='q'
                defaultValue={filters.q}
                enterKeyHint='search'
                placeholder='جستجو در محصولات...'
                aria-label='جستجو در محصولات'
                className='w-full min-w-0 bg-transparent outline-none placeholder:text-zinc-400 text-base sm:text-sm'
            />
            {filters.category && <input type='hidden' name='category' value={filters.category} />}
            {filters.subCategory && <input type='hidden' name='subCategory' value={filters.subCategory} />}
            {filters.sort !== DEFAULT_SORT && <input type='hidden' name='sort' value={filters.sort} />}
        </form>
    )
}

type PageProps = {
    params: Promise<{ page: string }>
    searchParams: Promise<{ q?: string; category?: string; subCategory?: string; sort?: string }>
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
    const { page } = await params
    const { q, category, subCategory, sort: sortParam = DEFAULT_SORT } = await searchParams

    const filters: Filters = {
        q: q?.trim() || undefined,
        category: category || undefined,
        subCategory: subCategory || undefined,
        sort: isProductSort(sortParam) ? sortParam : DEFAULT_SORT,
    }

    const [{ products, total, page: currentPage, totalPages }, categories] = await Promise.all([
        getProductsPage({ ...filters, page: Number(page) || 1, perPage: PER_PAGE }),
        getFilterCategories(),
    ])

    const activeFilters = [
        filters.q && { label: `جستجو: ${filters.q}`, href: filterHref(filters, { q: undefined }) },
        filters.category && { label: filters.category, href: filterHref(filters, { category: undefined, subCategory: undefined }) },
        filters.subCategory && { label: filters.subCategory, href: filterHref(filters, { subCategory: undefined }) },
    ].filter(Boolean) as { label: string; href: string }[]

    const breadcrumbLinks = [
        { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
        { id: 2, title: 'همه محصولات', to: '/products/1' },
        ...(filters.category ? [{ id: 3, title: filters.category, to: filterHref({ sort: DEFAULT_SORT }, { category: filters.category }) }] : []),
    ]

    return (
        <div>
            <Header />

            <BreadCrumb links={breadcrumbLinks} />

            <div className='container px-3 sm:px-0 pb-16'>

                <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-1 mb-5 sm:mb-8'>
                    <h1 className='font-MorabbaBold text-xl sm:text-2xl text-zinc-800'>
                        {filters.subCategory || filters.category || 'همه محصولات'}
                    </h1>
                    <span className='text-sm text-zinc-400'>{total.toLocaleString('fa-IR')} محصول</span>
                </div>

                <div className='flex flex-col lg:flex-row gap-4 lg:gap-8'>

                    {/* ستون فیلتر: فقط دسکتاپ */}
                    <aside className='hidden lg:block w-64 shrink-0'>
                        <div className='lg:sticky lg:top-28 flex flex-col gap-5'>
                            <div className='bg-white shadow-lg rounded-2xl p-4'>
                                <ProductsSearchForm filters={filters} />
                            </div>

                            <div className='bg-white shadow-lg rounded-2xl p-5'>
                                <h2 className='flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 font-IranYekanBold text-sm text-zinc-800'>
                                    <PiSlidersHorizontalLight className='w-4 h-4 text-primary-500' />
                                    دسته‌بندی‌ها
                                </h2>
                                <CategoryFilterList categories={categories} filters={filters} />
                            </div>
                        </div>
                    </aside>

                    <div className='flex-1 min-w-0'>

                        {/* نوار ابزار موبایل: جستجو + فیلترها */}
                        <div className='flex items-center gap-2 mb-3 lg:hidden'>
                            <div className='flex-1 min-w-0'>
                                <ProductsSearchForm filters={filters} />
                            </div>
                            <FilterDrawer activeCount={activeFilters.length}>
                                <CategoryFilterList categories={categories} filters={filters} />
                            </FilterDrawer>
                        </div>

                        {/* مرتب‌سازی: یک ردیف قابل اسکرول افقی */}
                        <div className='flex items-center gap-2 mb-4 sm:mb-6 bg-white shadow-lg rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3'>
                            <span className='hidden sm:block shrink-0 text-sm text-zinc-400'>مرتب‌سازی:</span>
                            <div className='flex items-center gap-1.5 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden'>
                                {productSortOptions.map(option => (
                                    <Link
                                        key={option.key}
                                        href={filterHref(filters, { sort: option.key })}
                                        className={`shrink-0 px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap rounded-lg transition-colors
                                            ${filters.sort === option.key ? 'bg-primary-500 text-white font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}
                                    >
                                        {option.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* فیلترهای فعال */}
                        {activeFilters.length > 0 &&
                            <div className='flex flex-wrap items-center gap-2 mb-4 sm:mb-6'>
                                {activeFilters.map(filter => (
                                    <Link
                                        key={filter.label}
                                        href={filter.href}
                                        className='flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-full transition-colors'
                                    >
                                        {filter.label}
                                        <PiXBold className='w-3 h-3' />
                                    </Link>
                                ))}
                                <Link href='/products/1' className='text-xs text-zinc-400 hover:text-danger transition-colors'>
                                    حذف همه
                                </Link>
                            </div>
                        }

                        {products.length === 0 ? (
                            <div className='flex flex-col items-center justify-center gap-4 py-16 sm:py-24 px-4 text-center bg-white shadow-lg rounded-2xl'>
                                <PiXCircleLight className='w-12 h-12 text-zinc-300' />
                                <div>
                                    <h2 className='font-IranYekanBold text-zinc-700'>محصولی یافت نشد</h2>
                                    <p className='mt-1.5 text-sm text-zinc-400 leading-7'>فیلترها را تغییر دهید یا عبارت دیگری را جستجو کنید.</p>
                                </div>
                                {activeFilters.length > 0 &&
                                    <Link href='/products/1' className='px-6 py-2.5 text-sm text-text linear_btn'>حذف فیلترها</Link>
                                }
                            </div>
                        ) : (
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
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            basePath='/products'
                            query={queryString(filters)}
                        />
                    </div>
                </div>
            </div>

            <Footer marginClasses={'mt-16 sm:mt-20'} />
        </div>
    )
}
