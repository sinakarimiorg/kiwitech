"use client"

import { useState, useEffect } from "react"
import {
    PiMagnifyingGlassLight,
    PiListMagnifyingGlassLight,
} from "react-icons/pi"
import ProductBox from "./ProductBox"
import { ObjectId } from "mongoose"

type Product = {
    _id: string
    name: string
    linkName: string
    price: number
    exPrice?: number
    discount?: number
    stock: number
    category: string
    subCategory: string
    description?: string
    colors: string
    tags: string[]
    img: string
    images?: string[]
}

export default function ProductsList() {
    const [productsList, setProductsList] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [search, setSearch] = useState<string>("")


    ////////get products on loading
useEffect(() => {
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products')
            const data = await res.json()

            // بررسی کنید که آیا data خودش آرایه است یا داخل یک کلید مثل data.products است
            if (Array.isArray(data)) {
                setProductsList(data)
            } else if (Array.isArray(data.products)) {
                setProductsList(data.products)
            } else if (Array.isArray(data.data)) {
                setProductsList(data.data)
            } else {
                setProductsList([])
            }
        } catch (error) {
            console.error("خطا در دریافت محصولات:", error)
            setProductsList([])
        } finally {
            setIsLoading(false)
        }
    }

    fetchProducts()
}, [])

    const filtered = productsList.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiListMagnifyingGlassLight className='w-5 h-5 text-primary-500' />
                    لیست محصولات
                    <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                </h2>

                <div className='hidden sm:flex items-center gap-2 px-3.5 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                    <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        type='text'
                        placeholder='جستجوی محصول...'
                        className='w-full bg-transparent outline-none placeholder:text-zinc-400'
                    />
                </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='text-right text-xs text-zinc-400 border-b border-gray-100'>
                            <th className='font-IranYekanMedium px-5 sm:px-6 py-3'>محصول</th>
                            <th className='font-IranYekanMedium px-3 py-3'>دسته‌بندی</th>
                            <th className='font-IranYekanMedium px-3 py-3'>قیمت</th>
                            <th className='font-IranYekanMedium px-3 py-3'>موجودی</th>
                            <th className='font-IranYekanMedium px-3 py-3'>عملیات</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className='py-10 text-center text-zinc-400'>
                                    در حال دریافت داده‌ها...
                                </td>
                            </tr>
                        ) : filtered.length > 0 ? (
                            filtered.map(product => (
                                <ProductBox key={product._id} product={product} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className='py-10 text-center text-zinc-400'>
                                    محصولی یافت نشد.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}