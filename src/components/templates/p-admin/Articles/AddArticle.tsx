"use client"

import { useRef, useState, useTransition } from "react"
import {
    PiArticleLight,
    PiTextAlignRightLight,
    PiTagLight,
    PiImageLight,
    PiXCircleFill,
    PiFloppyDiskLight,
    PiLinkSimpleLight,
} from "react-icons/pi"
import Swal from "sweetalert2"
import { addArticleAction } from "./actions"

const categories = [
    "راهنمای خرید",
    "اخبار تکنولوژی",
    "بررسی محصول",
    "آموزش",
]

type ArticleFormState = {
    title: string
    shortName: string
    category: string
    excerpt: string
    content: string
    tags: string
    publish: boolean
}

const initialState: ArticleFormState = {
    title: "",
    shortName: "",
    category: categories[0],
    excerpt: "",
    content: "",
    tags: "",
    publish: false,
}

const slugify = (value: string) =>
    value.trim().replace(/\s+/g, "-")

export default function AddArticle() {
    const [form, setForm] = useState<ArticleFormState>(initialState)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isPending, startTransition] = useTransition()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const updateField = <K extends keyof ArticleFormState>(field: K, value: ArticleFormState[K]) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleTitleChange = (value: string) => {
        setForm(prev => ({
            ...prev,
            title: value,
            shortName: prev.shortName === slugify(prev.title) || prev.shortName === "" ? slugify(value) : prev.shortName,
        }))
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        setImageFile(file)
        const reader = new FileReader()
        reader.onload = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    const removeImage = () => {
        setImagePreview(null)
        setImageFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const resetForm = () => {
        setForm(initialState)
        removeImage()
    }

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.shortName.trim() || !form.category) {
            Swal.fire({ icon: "error", title: "خطا", text: "عنوان، آدرس صفحه و دسته‌بندی الزامی است" })
            return
        }
        if (!imageFile) {
            Swal.fire({ icon: "error", title: "خطا", text: "تصویر کاور مقاله الزامی است" })
            return
        }

        const payload = new FormData()
        payload.append("title", form.title.trim())
        payload.append("shortName", form.shortName.trim())
        payload.append("category", form.category)
        payload.append("excerpt", form.excerpt)
        payload.append("content", form.content)
        payload.append("tags", form.tags)
        payload.append("publish", String(form.publish))
        payload.append("image", imageFile)

        startTransition(async () => {
            const res = await addArticleAction(payload)

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "موفقیت‌آمیز",
                    text: "مقاله با موفقیت ذخیره شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
                resetForm()
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی در ذخیره مقاله پیش آمد" })
            }
        })

    }

    return (
        <div className='bg-white shadow-lg rounded-2xl p-5 sm:p-6'>
            {/* Header */}
            <div className='flex items-center gap-2 pb-4 mb-6 border-b border-gray-100'>
                <PiArticleLight className='w-5 h-5 text-primary-500' />
                <h2 className='font-IranYekanBold text-base sm:text-lg text-zinc-800'>نوشتن مقاله جدید</h2>
            </div>

            <div className='flex flex-col lg:flex-row gap-6'>
                {/* Cover Image */}
                <div className='w-full lg:w-56 shrink-0'>
                    <label className='block mb-2 text-xs text-zinc-500'>تصویر کاور مقاله</label>
                    {imagePreview ? (
                        <div className='relative w-full h-56 rounded-xl overflow-hidden border border-gray-200'>
                            <img src={imagePreview} className='w-full h-full object-cover' alt='پیش‌نمایش کاور' />
                            <button
                                onClick={removeImage}
                                className='absolute top-2 left-2 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer'>
                                <PiXCircleFill className='w-6 h-6' />
                            </button>
                        </div>
                    ) : (
                        <label className='flex flex-col items-center justify-center gap-2 w-full h-56 border-2 border-dashed border-gray-200 hover:border-primary-400 rounded-xl cursor-pointer text-zinc-400 hover:text-primary-500 transition-colors'>
                            <PiImageLight className='w-9 h-9' />
                            <span className='text-xs'>برای آپلود کلیک کنید</span>
                            <input
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                type='file'
                                accept='image/*'
                                className='hidden'
                            />
                        </label>
                    )}

                    {/* Publish Toggle */}
                    <div className='flex items-center justify-between mt-4 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg'>
                        <span className='text-xs text-zinc-500'>وضعیت انتشار</span>
                        <button
                            onClick={() => updateField("publish", !form.publish)}
                            className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer shrink-0
                                ${form.publish ? "bg-primary-500" : "bg-gray-300"}`}>
                            <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all
                                ${form.publish ? "right-0.5" : "right-4.5"}`} />
                        </button>
                    </div>
                    <p className='mt-1.5 text-xs text-zinc-400'>{form.publish ? "پس از ذخیره منتشر می‌شود" : "به عنوان پیش‌نویس ذخیره می‌شود"}</p>
                </div>

                {/* Fields */}
                <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <div className='sm:col-span-2'>
                        <label className='block mb-1.5 text-xs text-zinc-500'>عنوان مقاله</label>
                        <input
                            value={form.title}
                            onChange={e => handleTitleChange(e.target.value)}
                            placeholder='مثال: راهنمای خرید اسپیکر بلوتوث قابل حمل'
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
                                value={form.shortName}
                                onChange={e => updateField("shortName", e.target.value)}
                                placeholder='how-buy-speaker'
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
                            value={form.category}
                            onChange={e => updateField("category", e.target.value)}
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
                            value={form.tags}
                            onChange={e => updateField("tags", e.target.value)}
                            placeholder='اسپیکر، بلوتوث، راهنمای خرید'
                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                        />
                    </div>

                    <div className='sm:col-span-2'>
                        <label className='block mb-1.5 text-xs text-zinc-500'>خلاصه مقاله</label>
                        <input
                            value={form.excerpt}
                            onChange={e => updateField("excerpt", e.target.value)}
                            placeholder='یک یا دو خط برای نمایش در کارت مقاله'
                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                        />
                    </div>

                    <div className='sm:col-span-2'>
                        <label className='flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500'>
                            <PiTextAlignRightLight className='w-3.5 h-3.5' />
                            متن کامل مقاله
                        </label>
                        <textarea
                            value={form.content}
                            onChange={e => updateField("content", e.target.value)}
                            rows={8}
                            placeholder='متن کامل مقاله را اینجا بنویسید...'
                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors resize-none'
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className='flex items-center justify-end gap-3 mt-7 pt-5 border-t border-gray-100'>
                <button
                    onClick={resetForm}
                    className='px-5 py-2.5 text-sm text-zinc-500 hover:text-zinc-700 border border-gray-200 rounded-lg transition-colors cursor-pointer'>
                    پاک کردن فرم
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className='flex-center gap-1.5 px-6 py-2.5 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed'>
                    <PiFloppyDiskLight className='w-4 h-4' />
                    {isPending ? "در حال ذخیره..." : form.publish ? "ذخیره و انتشار" : "ذخیره پیش‌نویس"}
                </button>
            </div>
        </div>
    )
}
