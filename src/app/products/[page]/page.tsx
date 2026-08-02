"use client"

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Pagination from '@root/src/components/modules/Pagination/Pagination'
import allProducts from '@root/Products'
import ProductCard from '@root/src/components/templates/Product/ProductCard/ProductCard'
import Footer from '@root/src/components/modules/Footer/Footer'
import { PiSlidersHorizontalLight, PiMagnifyingGlassLight, PiXCircleLight } from 'react-icons/pi'


type SortKey = 'default' | 'newest' | 'cheap' | 'expensive' | 'discount'

const categories = [
    { label: 'شارژر گوشی', keyword: 'شارژر' },
    { label: 'قاب و کاور گوشی', keyword: 'قاب' },
    { label: 'کابل شارژ و مبدل', keyword: 'کابل' },
    { label: 'پاوربانک', keyword: 'پاوربانک' },
]

const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'default', label: 'پیش‌فرض' },
    { key: 'newest', label: 'جدیدترین' },
    { key: 'cheap', label: 'ارزان‌ترین' },
    { key: 'expensive', label: 'گران‌ترین' },
    { key: 'discount', label: 'بیشترین تخفیف' },
]

const PER_PAGE = 8

function getDiscount(item: any) {
    if (!item.exPrice || item.exPrice <= item.price) return undefined
    return Math.round(((item.exPrice - item.price) / item.exPrice) * 100)
}

export default function ProductsPage() {
    const params = useParams<{ page: string }>()
    const currentPage = Math.max(1, Number(params?.page) || 1)

    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [sortKey, setSortKey] = useState<SortKey>('default')

    const filtered = useMemo(() => {
        let list = [...(allProducts as any[])]

        if (activeCategory) {
            const cat = categories.find(c => c.label === activeCategory)
            if (cat) list = list.filter(p => p.title?.includes(cat.keyword))
        }

        if (search.trim()) {
            list = list.filter(p => p.title?.includes(search.trim()))
        }

        switch (sortKey) {
            case 'newest':
                list.sort((a, b) => b.id - a.id)
                break
            case 'cheap':
                list.sort((a, b) => a.price - b.price)
                break
            case 'expensive':
                list.sort((a, b) => b.price - a.price)
                break
            case 'discount':
                list.sort((a, b) => (getDiscount(b) ?? 0) - (getDiscount(a) ?? 0))
                break
        }

        return list
    }, [search, activeCategory, sortKey])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const safePage = Math.min(currentPage, totalPages)
    const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'همه محصولات', to: '/products/1' },
                ]}
            />

            <div className='container pb-16'>
                <div className='flex items-center justify-between flex-wrap gap-4 mb-8'>
                    <h1 className='font-MorabbaBold text-xl sm:text-2xl text-zinc-800'>همه محصولات</h1>
                    <span className='text-sm text-zinc-400'>{filtered.length.toLocaleString('fa-IR')} محصول</span>
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
                                        placeholder='جستجو در محصولات...'
                                        className='w-full bg-transparent outline-none placeholder:text-zinc-400'
                                    />
                                </div>
                            </div>

                            <div className='bg-white shadow-lg rounded-2xl p-5'>
                                <h2 className='flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 font-IranYekanBold text-sm text-zinc-800'>
                                    <PiSlidersHorizontalLight className='w-4 h-4 text-primary-500' />
                                    دسته‌بندی‌ها
                                </h2>
                                <div className='flex flex-col gap-1'>
                                    <button
                                        onClick={() => setActiveCategory(null)}
                                        className={`text-right px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer
                                            ${!activeCategory ? 'bg-primary-50 text-primary-600 font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}>
                                        همه محصولات
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.label}
                                            onClick={() => setActiveCategory(cat.label)}
                                            className={`text-right px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer
                                                ${activeCategory === cat.label ? 'bg-primary-50 text-primary-600 font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}>
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className='flex-1 min-w-0'>

                        <div className='flex items-center justify-between gap-3 mb-6 bg-white shadow-lg rounded-2xl px-4 py-3 flex-wrap'>
                            <span className='hidden sm:block text-sm text-zinc-400 shrink-0'>مرتب‌سازی:</span>
                            <div className='flex items-center gap-1.5 flex-wrap'>
                                {sortOptions.map(opt => (
                                    <button
                                        key={opt.key}
                                        onClick={() => setSortKey(opt.key)}
                                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer
                                            ${sortKey === opt.key ? 'bg-primary-500 text-white font-IranYekanMedium' : 'text-zinc-500 hover:bg-gray-50'}`}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {paginated.length === 0 ? (
                            <div className='flex flex-col items-center justify-center gap-4 py-24 text-center bg-white shadow-lg rounded-2xl'>
                                <PiXCircleLight className='w-12 h-12 text-zinc-300' />
                                <div>
                                    <h2 className='font-IranYekanBold text-zinc-700'>محصولی یافت نشد</h2>
                                    <p className='mt-1.5 text-sm text-zinc-400'>فیلترها را تغییر دهید یا عبارت دیگری را جستجو کنید.</p>
                                </div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
                                {paginated.map((product: any) => (
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
                        )}

                        <Pagination currentPage={safePage} totalPages={totalPages} basePath='/products' />
                    </div>
                </div>
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}