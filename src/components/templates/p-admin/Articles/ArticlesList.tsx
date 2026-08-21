"use client"

import { useState, useTransition } from "react"
import {
    PiMagnifyingGlassLight,
    PiPencilSimpleLight,
    PiTrashLight,
    PiArticleLight,
    PiEyeLight,
} from "react-icons/pi"
import { AdminArticle } from "@root/src/types/adminArticleType"
import Swal from "sweetalert2"
import { deleteArticleAction } from "./actions"
import ArticleBox from "./ArticleBox"
import EditArticleModal from "./EditArticleModal"


type ArticlesListProps = {
    initialArticles: AdminArticle[]
}

export default function ArticlesList({ initialArticles }: ArticlesListProps) {
    const [search, setSearch] = useState("")
    const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null)
    const [, startDeleteTransition] = useTransition()

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "حذف مقاله",
            text: "آیا از حذف این مقاله مطمئن هستید؟ این عملیات قابل بازگشت نیست.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله، حذف شود",
            cancelButtonText: "انصراف",
            confirmButtonColor: "#EF4444",
        })

        if (!result.isConfirmed) return

        startDeleteTransition(async () => {
            const res = await deleteArticleAction(id)

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "حذف شد",
                    text: "مقاله با موفقیت حذف شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی در حذف مقاله پیش آمد" })
            }
        })
    }

    const filtered = initialArticles.filter(a => a.title.includes(search))

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
                            <ArticleBox
                                key={article._id}
                                article={article}
                                onEdit={setEditingArticle}
                                onDelete={handleDelete}
                            />
                        ))}

                        {filtered.length === 0 &&
                            <tr>
                                <td colSpan={6} className='py-10 text-center text-zinc-400'>مقاله‌ای یافت نشد.</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>

            {editingArticle && (
                <EditArticleModal
                    article={editingArticle}
                    onClose={() => setEditingArticle(null)}
                />
            )}
        </div>
    )
}
