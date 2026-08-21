"use client"

import { useRef, useState, useTransition } from "react"
import {
    PiArticleLight,
    PiTextAlignRightLight,
    PiTagLight,
    PiImageLight,
    PiFloppyDiskLight,
    PiLinkSimpleLight,
    PiXBold,
} from "react-icons/pi"
import Swal from "sweetalert2"
import { updateArticleAction } from "./actions"
import type { AdminArticle } from "@root/src/types/adminArticleType"

const categories = [
    "راهنمای خرید",
    "اخبار تکنولوژی",
    "بررسی محصول",
    "آموزش",
]

type EditArticleModalProps = {
    article: AdminArticle
    onClose: () => void
}

export default function EditArticleModal({ article, onClose }: EditArticleModalProps) {
    const [title, setTitle] = useState(article.title)
    const [shortName, setShortName] = useState(article.linkName)
    const [category, setCategory] = useState(article.category)
    const [excerpt, setExcerpt] = useState(article.excerpt ?? "")
    const [content, setContent] = useState(article.content ?? "")
    const [tags, setTags] = useState(article.tags?.join("، ") ?? "")
    const [publish, setPublish] = useState(article.status === "منتشر شده")
    const [imagePreview, setImagePreview] = useState(article.img)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isPending, startTransition] = useTransition()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        setImageFile(file)
        const reader = new FileReader()
        reader.onload = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    const handleSubmit = async () => {
        if (!title.trim() || !shortName.trim() || !category) {
            Swal.fire({ icon: "error", title: "خطا", text: "عنوان، آدرس صفحه و دسته‌بندی الزامی است" })
            return
        }

        const payload = new FormData()
        payload.append("title", title.trim())
        payload.append("shortName", shortName.trim())
        payload.append("category", category)
        payload.append("excerpt", excerpt)
        payload.append("content", content)
        payload.append("tags", tags)
        payload.append("publish", String(publish))
        payload.append("existingImage", article.img)
        if (imageFile) payload.append("image", imageFile)

        startTransition(async () => {
            const result = await updateArticleAction(article._id, payload)

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "موفقیت‌آمیز",
                    text: "مقاله با موفقیت ویرایش شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
                onClose()
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: result.error || "مشکلی در ویرایش مقاله پیش آمد" })
            }
        })
    }

    return (
        <div className="fixed inset-0 flex-center bg-black/40 z-50 px-4 py-6">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                    <h2 className="flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800">
                        <PiArticleLight className="w-5 h-5 text-primary-500" />
                        ویرایش مقاله
                    </h2>
                    <button onClick={onClose} className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Cover Image */}
                    <div className='w-full lg:w-56 shrink-0'>
                        <label className='block mb-2 text-xs text-zinc-500'>تصویر کاور مقاله</label>
                        <div className='relative w-full h-56 rounded-xl overflow-hidden border border-gray-200'>
                            <img src={imagePreview} className='w-full h-full object-cover' alt='پیش‌نمایش کاور' />
                            <label className='absolute bottom-2 right-2 left-2 flex-center gap-1.5 py-2 text-xs text-white bg-black/60 hover:bg-black/75 rounded-lg cursor-pointer transition-colors'>
                                <PiImageLight className='w-4 h-4' />
                                تغییر تصویر
                                <input
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    type='file'
                                    accept='image/*'
                                    className='hidden'
                                />
                            </label>
                        </div>

                        {/* Publish Toggle */}
                        <div className='flex items-center justify-between mt-4 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg'>
                            <span className='text-xs text-zinc-500'>وضعیت انتشار</span>
                            <button
                                onClick={() => setPublish(!publish)}
                                className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer shrink-0
                                    ${publish ? "bg-primary-500" : "bg-gray-300"}`}>
                                <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all
                                    ${publish ? "right-0.5" : "right-4.5"}`} />
                            </button>
                        </div>
                        <p className='mt-1.5 text-xs text-zinc-400'>{publish ? "منتشر شده" : "پیش‌نویس"}</p>
                    </div>

                    {/* Fields */}
                    <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5'>
                        <div className='sm:col-span-2'>
                            <label className='block mb-1.5 text-xs text-zinc-500'>عنوان مقاله</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                            />
                        </div>

                        <div className='sm:col-span-2'>
                            <label className='flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500'>
                                <PiLinkSimpleLight className='w-3.5 h-3.5' />
                                آدرس صفحه (Slug)
                            </label>
                            <div className='flex items-center gap-2'>
                                <span className='text-xs text-zinc-400 whitespace-nowrap'>article-info/</span>
                                <input
                                    value={shortName}
                                    onChange={e => setShortName(e.target.value)}
                                    dir='ltr'
                                    className='w-full px-3.5 py-2.5 text-sm text-left border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500'>
                                <PiTagLight className='w-3.5 h-3.5' />
                                دسته‌بندی
                            </label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className='w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block mb-1.5 text-xs text-zinc-500'>تگ‌ها (با کاما جدا کنید)</label>
                            <input
                                value={tags}
                                onChange={e => setTags(e.target.value)}
                                className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                            />
                        </div>

                        <div className='sm:col-span-2'>
                            <label className='block mb-1.5 text-xs text-zinc-500'>خلاصه مقاله</label>
                            <input
                                value={excerpt}
                                onChange={e => setExcerpt(e.target.value)}
                                className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                            />
                        </div>

                        <div className='sm:col-span-2'>
                            <label className='flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500'>
                                <PiTextAlignRightLight className='w-3.5 h-3.5' />
                                متن کامل مقاله
                            </label>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                rows={8}
                                className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors resize-none'
                            />
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-end gap-3 mt-7 pt-5 border-t border-gray-100'>
                    <button
                        onClick={onClose}
                        className='px-5 py-2.5 text-sm text-zinc-500 hover:text-zinc-700 border border-gray-200 rounded-lg transition-colors cursor-pointer'>
                        انصراف
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className='flex-center gap-1.5 px-6 py-2.5 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed'>
                        <PiFloppyDiskLight className='w-4 h-4' />
                        {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </button>
                </div>
            </div>
        </div>
    )
}
