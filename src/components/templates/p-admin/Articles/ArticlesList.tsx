"use client"

import { useState } from "react"
import {
    PiMagnifyingGlassLight,
    PiPencilSimpleLight,
    PiTrashLight,
    PiArticleLight,
    PiEyeLight,
} from "react-icons/pi"
import { AdminArticle } from "@root/src/types/adminArticleType"


// نمونه دیتای اولیه - منطبق با دیتای LatestArticles - در آینده با فچ از API جایگزین می‌شود
const articles: AdminArticle[] = [
    { _id: "1", title: "بهترین گوشی تا پنج میلیون", linkName: "best-phone", img: "/images/articles/phone.jpg", category: "راهنمای خرید", date: "۱۴۰۴/۰۴/۲۱", views: 1240, status: "منتشر شده" },
    { _id: "2", title: "کسب درآمد از بازی!", linkName: "earn-from-game", img: "/images/articles/game-article.jpg", category: "اخبار تکنولوژی", date: "۱۴۰۴/۰۹/۰۳", views: 860, status: "منتشر شده" },
    { _id: "3", title: "راهنمای خرید اسپیکر بلوتوث قابل حمل", linkName: "how-buy-speaker", img: "/images/articles/speaker.jpg", category: "راهنمای خرید", date: "۱۴۰۳/۰۲/۲۸", views: 2310, status: "منتشر شده" },
    { _id: "4", title: "راهنمای خرید هندزفری سیمی", linkName: "how-buy-headphon", img: "/images/articles/headphone.jpg", category: "راهنمای خرید", date: "۱۴۰۳/۰۵/۳۱", views: 540, status: "پیش‌نویس" },
]

const statusStyle: Record<AdminArticle["status"], string> = {
    "منتشر شده": "bg-primary-50 text-primary-600",
    "پیش‌نویس": "bg-amber-50 text-amber-600",
}

export default function ArticlesList() {
    const [search, setSearch] = useState("")

    const filtered = articles.filter(a => a.title.includes(search))

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiArticleLight className='w-5 h-5 text-primary-500' />
                    لیست مقالات
                    <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                </h2>

                <div className='hidden sm:flex items-center gap-2 px-3.5 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                    <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        type='text'
                        placeholder='جستجوی مقاله...'
                        className='w-full bg-transparent outline-none placeholder:text-zinc-400'
                    />
                </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='text-right text-xs text-zinc-400 border-b border-gray-100'>
                            <th className='font-IranYekanMedium px-5 sm:px-6 py-3'>مقاله</th>
                            <th className='font-IranYekanMedium px-3 py-3'>دسته‌بندی</th>
                            <th className='font-IranYekanMedium px-3 py-3'>تاریخ انتشار</th>
                            <th className='font-IranYekanMedium px-3 py-3'>بازدید</th>
                            <th className='font-IranYekanMedium px-3 py-3'>وضعیت</th>
                            <th className='font-IranYekanMedium px-3 py-3'>عملیات</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {filtered.map(article => (
                            <tr key={article._id} className='hover:bg-primary-50/30 transition-colors'>
                                <td className='px-5 sm:px-6 py-3.5'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-14 h-11 shrink-0 bg-gray-50 rounded-lg overflow-hidden'>
                                            <img src={article.img} className='w-full h-full object-cover' alt={article.title} />
                                        </div>
                                        <div className='min-w-0'>
                                            <p className='text-zinc-700 line-clamp-1 max-w-64'>{article.title}</p>
                                            <p className='text-xs text-zinc-400 tracking-tight' dir='ltr'>/{article.linkName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-3 py-3.5 text-zinc-500'>{article.category}</td>
                                <td className='px-3 py-3.5 text-zinc-400'>{article.date}</td>
                                <td className='px-3 py-3.5'>
                                    <span className='inline-flex items-center gap-1 text-zinc-600'>
                                        <PiEyeLight className='w-3.5 h-3.5' />
                                        {article.views.toLocaleString()}
                                    </span>
                                </td>
                                <td className='px-3 py-3.5'>
                                    <span className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-lg ${statusStyle[article.status]}`}>
                                        {article.status}
                                    </span>
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
                        ))}

                        {filtered.length === 0 &&
                            <tr>
                                <td colSpan={6} className='py-10 text-center text-zinc-400'>مقاله‌ای یافت نشد.</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
