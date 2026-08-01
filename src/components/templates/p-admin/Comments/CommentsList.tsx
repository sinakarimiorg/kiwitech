"use client"

import { useState } from "react"
import { RiStarFill } from "react-icons/ri"
import {
    PiMagnifyingGlassLight,
    PiUserCircleLight,
    PiCheckCircleLight,
    PiXCircleLight,
    PiTrashLight,
    PiChatCircleTextLight,
} from "react-icons/pi"

type CommentStatus = "تایید شده" | "در انتظار بررسی" | "رد شده"

type Comment = {
    id: number
    author: string
    product: string
    text: string
    rating: number
    date: string
    status: CommentStatus
}

// نمونه دیتای اولیه - در آینده با فچ از API جایگزین می‌شود
const comments: Comment[] = [
    { id: 1, author: "علی رضایی", product: "هندزفری بلوتوثی کربی مدل CR-T107", text: "کاملا این محصول رو پیشنهاد میکنم، کیفیت بسیار خوبی داره و برند شناخته شده‌ای هست.", rating: 4, date: "۱۴۰۴/۰۴/۰۸", status: "در انتظار بررسی" },
    { id: 2, author: "مریم احمدی", product: "پاوربانک انکر مدل PowerCore 10000", text: "ظرفیت باتری واقعا خوبه ولی حجمش یکم زیاده برای جیب.", rating: 3, date: "۱۴۰۴/۰۴/۰۷", status: "تایید شده" },
    { id: 3, author: "حسین نوری", product: "کابل شارژ مولتی رابط مدل ایکس", text: "کیفیت ساخت پایینه، بعد از دو هفته قطعی داشت.", rating: 1, date: "۱۴۰۴/۰۴/۰۶", status: "رد شده" },
    { id: 4, author: "زهرا محمدی", product: "قاب و کاور گوشی مدل پترن", text: "دقیقا طبق عکس بود، بسته‌بندی هم عالی.", rating: 5, date: "۱۴۰۴/۰۴/۰۵", status: "در انتظار بررسی" },
    { id: 5, author: "سینا کریمی", product: "شارژر فندکی 35 وات مدل QC 3", text: "سرعت شارژ عالیه، پیشنهاد میکنم.", rating: 5, date: "۱۴۰۴/۰۴/۰۴", status: "تایید شده" },
]

const statusStyle: Record<CommentStatus, string> = {
    "تایید شده": "bg-primary-50 text-primary-600",
    "در انتظار بررسی": "bg-amber-50 text-amber-600",
    "رد شده": "bg-danger/10 text-danger",
}

const filters: ("همه" | CommentStatus)[] = ["همه", "در انتظار بررسی", "تایید شده", "رد شده"]

export default function CommentsList() {
    const [search, setSearch] = useState("")
    const [activeFilter, setActiveFilter] = useState<"همه" | CommentStatus>("همه")

    const filtered = comments.filter(c => {
        const matchesSearch = c.author.includes(search) || c.product.includes(search)
        const matchesFilter = activeFilter === "همه" || c.status === activeFilter
        return matchesSearch && matchesFilter
    })

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiChatCircleTextLight className='w-5 h-5 text-primary-500' />
                    نظرات کاربران
                    <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                </h2>

                <div className='flex items-center gap-3'>
                    {/* Status Filter */}
                    <div className='flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-xl text-xs'>
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 whitespace-nowrap rounded-lg transition-colors cursor-pointer
                                    ${activeFilter === f
                                        ? "bg-primary-500 text-white font-IranYekanMedium"
                                        : "text-zinc-500 hover:text-zinc-700"}`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className='hidden lg:flex items-center gap-2 px-3.5 py-2 w-56 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                        <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type='text'
                            placeholder='نام کاربر یا محصول...'
                            className='w-full bg-transparent outline-none placeholder:text-zinc-400'
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className='divide-y divide-gray-50'>
                {filtered.map(comment => (
                    <div key={comment.id} className='flex flex-col sm:flex-row sm:items-start gap-4 px-5 sm:px-6 py-5'>

                        {/* Author */}
                        <div className='flex items-center gap-3 sm:w-48 shrink-0'>
                            <span className='flex-center w-10 h-10 shrink-0 bg-primary-50 text-primary-500 rounded-full'>
                                <PiUserCircleLight className='w-6 h-6' />
                            </span>
                            <div>
                                <p className='font-IranYekanMedium text-sm text-zinc-700'>{comment.author}</p>
                                <p className='text-xs text-zinc-400'>{comment.date}</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className='flex-1 min-w-0'>
                            <p className='text-xs text-zinc-400 mb-1.5'>
                                نظر روی: <span className='text-zinc-600'>{comment.product}</span>
                            </p>
                            <div className='flex gap-0.5 mb-2'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <RiStarFill key={i} className={`w-3.5 h-3.5 ${i < comment.rating ? "text-amber-500" : "text-gray-200"}`} />
                                ))}
                            </div>
                            <p className='text-sm text-zinc-600 leading-7'>{comment.text}</p>
                        </div>

                        {/* Status & Actions */}
                        <div className='flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:w-40 shrink-0'>
                            <span className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-lg ${statusStyle[comment.status]}`}>
                                {comment.status}
                            </span>
                            <div className='flex items-center gap-2'>
                                <button className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                                    <PiCheckCircleLight className='w-4 h-4' />
                                </button>
                                <button className='flex-center w-8 h-8 text-zinc-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer'>
                                    <PiXCircleLight className='w-4 h-4' />
                                </button>
                                <button className='flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer'>
                                    <PiTrashLight className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 &&
                    <div className='py-10 text-center text-zinc-400'>نظری یافت نشد.</div>
                }
            </div>
        </div>
    )
}
