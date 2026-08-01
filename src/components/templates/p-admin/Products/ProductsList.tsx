"use client"

import { useState } from "react"
import {
    PiMagnifyingGlassLight,
    PiPencilSimpleLight,
    PiTrashLight,
    PiListMagnifyingGlassLight,
} from "react-icons/pi"

type Product = {
    id: number
    title: string
    img: string
    category: string
    price: number
    exPrice?: number
    stock: number
}

// نمونه دیتای اولیه - در آینده با فچ از API جایگزین می‌شود
const products: Product[] = [
    { id: 1, title: "هندزفری بلوتوثی کربی مدل CR-T107", img: "/images/products/airpods.png", category: "لوازم جانبی موبایل", price: 765000, exPrice: 850000, stock: 12 },
    { id: 2, title: "کابل شارژ مولتی رابط مدل ایکس", img: "/images/products/charge-cable.png", category: "لوازم جانبی موبایل", price: 490000, stock: 3 },
    { id: 3, title: "قاب و کاور گوشی مدل پترن", img: "/images/products/cover.png", category: "لوازم جانبی موبایل", price: 149000, exPrice: 199000, stock: 0 },
    { id: 4, title: "پاوربانک انکر مدل PowerCore 10000", img: "/images/products/power-bank1.png", category: "لوازم جانبی موبایل", price: 2200000, exPrice: 2500000, stock: 1 },
    { id: 5, title: "شارژر فندکی 35 وات مدل QC 3", img: "/images/products/car-charger.png", category: "لوازم جانبی موبایل", price: 320000, stock: 25 },
]

function stockBadge(stock: number) {
    if (stock === 0) return { label: "ناموجود", className: "bg-danger/10 text-danger" }
    if (stock <= 3) return { label: `${stock} عدد`, className: "bg-amber-50 text-amber-600" }
    return { label: `${stock} عدد`, className: "bg-primary-50 text-primary-600" }
}

export default function ProductsList() {
    const [search, setSearch] = useState("")

    const filtered = products.filter(p => p.title.includes(search))

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
                        {filtered.map(product => {
                            const badge = stockBadge(product.stock)
                            return (
                                <tr key={product.id} className='hover:bg-primary-50/30 transition-colors'>
                                    <td className='px-5 sm:px-6 py-3.5'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-12 h-12 shrink-0 bg-gray-50 rounded-lg overflow-hidden'>
                                                <img src={product.img} className='w-full h-full object-cover' alt={product.title} />
                                            </div>
                                            <p className='text-zinc-700 line-clamp-2 max-w-64'>{product.title}</p>
                                        </div>
                                    </td>
                                    <td className='px-3 py-3.5 text-zinc-500'>{product.category}</td>
                                    <td className='px-3 py-3.5'>
                                        <div className='flex flex-col'>
                                            <span className='font-IranYekanMedium text-zinc-700'>{product.price.toLocaleString()} تومان</span>
                                            {product.exPrice &&
                                                <span className='text-xs text-zinc-400 line-through'>{product.exPrice.toLocaleString()}</span>
                                            }
                                        </div>
                                    </td>
                                    <td className='px-3 py-3.5'>
                                        <span className={`px-2.5 py-1 text-xs rounded-lg ${badge.className}`}>{badge.label}</span>
                                    </td>
                                    <td className='px-3 py-3.5'>
                                        <div className='flex items-center gap-2'>
                                            <button className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                                                <PiPencilSimpleLight className='w-4 h-4' />
                                            </button>
                                            <button className='flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer'>
                                                <PiTrashLight className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}

                        {filtered.length === 0 &&
                            <tr>
                                <td colSpan={5} className='py-10 text-center text-zinc-400'>محصولی یافت نشد.</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
