"use client"

import { useRef, useState } from "react"
import {
    PiPackageLight,
    PiTextAlignRightLight,
    PiTagLight,
    PiStackLight,
    PiImageLight,
    PiXCircleFill,
    PiFloppyDiskLight,
} from "react-icons/pi"

const categories = [
    "انتخاب کنید",
    "لوازم جانبی موبایل",
    "لوازم جانبی کامپیوتر",
    "لوازم خانگی",
    "لوازم جانبی متفرقه",
]

const subCategories = [
    "انتخاب کنید",
    "شارژر و کابل",
    "هندزفری و هدفون",
    "کیس و کاور",
    "پایه نگهدارنده",
]

type ProductFormState = {
    name: string
    linkName: string
    price: string
    exPrice: string
    discount: string
    stock: string
    category: string
    subCategory: string
    description: string
    colors: string
    tags: string
}

const initialState: ProductFormState = {
    name: "",
    linkName: "",
    price: "",
    exPrice: "",
    discount: "",
    stock: "",
    category: categories[0],
    subCategory: subCategories[0],
    description: "",
    colors: "",
    tags: "",
}

export default function AddProduct() {
    const [form, setForm] = useState<ProductFormState>(initialState)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const updateField = (field: keyof ProductFormState, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
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
        if (!imageFile) {
            console.error("تصویر محصول الزامی است")
            return
        }

        setIsSubmitting(true)
        try {
            const payload = new FormData()
            payload.append("img", imageFile)
            payload.append("name", form.name)
            payload.append("linkName", form.linkName)
            payload.append("price", form.price)
            if (form.exPrice) payload.append("exPrice", form.exPrice)
            payload.append("discount", form.discount || "0")
            payload.append("stock", form.stock)
            payload.append("category", form.category)
            payload.append("subCategory", form.subCategory)
            payload.append("description", form.description)
            payload.append("colors", form.colors)
            payload.append("tags", form.tags)

            const res = await fetch("/api/products", {
                method: "POST",
                body: payload, // مهم: هدر Content-Type رو دستی ست نکن، خود مرورگر boundary درست می‌کنه
            })

            if (!res.ok) throw new Error("خطا در ثبت محصول")

            resetForm()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
        setTimeout(() => {
            setIsSubmitting(false)
        }, 1200)
    }

    return (
        <div className='bg-white shadow-lg rounded-2xl p-5 sm:p-6'>
            {/* Header */}
            <div className='flex items-center gap-2 pb-4 mb-6 border-b border-gray-100'>
                <PiPackageLight className='w-5 h-5 text-primary-500' />
                <h2 className='font-IranYekanBold text-base sm:text-lg text-zinc-800'>افزودن محصول جدید</h2>
            </div>

            <div className='flex flex-col lg:flex-row gap-6'>
                {/* Image Uploader */}
                <div className='w-full lg:w-56 shrink-0'>
                    <label className='block mb-2 text-xs text-zinc-500'>تصویر محصول</label>
                    {imagePreview ? (
                        <div className='relative w-full h-56 rounded-xl overflow-hidden border border-gray-200'>
                            <img src={imagePreview} className='w-full h-full object-cover' alt='پیش‌نمایش محصول' />
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
                </div>

                {/* Fields */}
                <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <div>
                        <label className='block mb-1.5 text-xs text-zinc-500'>نام محصول</label>
                        <input
                            value={form.name}
                            onChange={e => updateField("name", e.target.value)}
                            placeholder='مثال: هندزفری بلوتوثی کربی مدل CR-T107'
                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                        />
                    </div>
                    <div>
                        <label className='block mb-1.5 text-xs text-zinc-500'>نام لینک</label>
                        <input
                            value={form.linkName}
                            onChange={e => updateField("linkName", e.target.value)}
                            placeholder='مثال: cerby-890'
                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                        />
                    </div>

                    <div>
                        <label className='block mb-1.5 text-xs text-zinc-500'>قیمت (تومان)</label>
                        <input
                            value={form.price}
                            onChange={e => updateField("price", e.target.value.replace(/[^0-9]/g, ""))}
                            placeholder='765000'
                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                        />
                    </div>

                    <div>
                        <label className='block mb-1.5 text-xs text-zinc-500'>درصد تخفیف (اختیاری)</label>
                        <input
                            value={form.discount}
                            onChange={e => updateField("discount", e.target.value.replace(/[^0-9]/g, ""))}
                            placeholder='30'
                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                        />
                    </div>
                    <div>
                        <label className='block mb-1.5 text-xs text-zinc-500'>قیمت قبل از تخفیف (اختیاری)</label>
                        <input
                            value={form.exPrice}
                            onChange={e => updateField("exPrice", e.target.value.replace(/[^0-9]/g, ""))}
                            placeholder='850000'
                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                        />
                    </div>

                    <div>
                        <label className='flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500'>
                            <PiStackLight className='w-3.5 h-3.5' />
                            موجودی انبار
                        </label>
                        <input
                            value={form.stock}
                            onChange={e => updateField("stock", e.target.value.replace(/[^0-9]/g, ""))}
                            placeholder='تعداد'
                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                        />
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
                        <label className='flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500'>
                            <PiTagLight className='w-3.5 h-3.5' />
                            زیر مجموعه
                        </label>
                        <select
                            value={form.subCategory}
                            onChange={e => updateField("subCategory", e.target.value)}
                            className='w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                        >
                            {subCategories.map(subCat => (
                                <option key={subCat} value={subCat}>{subCat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className='block mb-1.5 text-xs text-zinc-500'>رنگ ها (اختیاری)</label>
                        <input
                            value={form.colors}
                            onChange={e => updateField("colors", e.target.value)}
                            placeholder='قرمز، آبی، مشکی'
                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                        />
                    </div>

                    <div>
                        <label className='block mb-1.5 text-xs text-zinc-500'>تگ‌ها (اختیاری)</label>
                        <input
                            value={form.tags}
                            onChange={e => updateField("tags", e.target.value)}
                            placeholder='هندزفری، بلوتوث، کربی'
                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                        />
                    </div>

                    <div className='sm:col-span-2'>
                        <label className='flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500'>
                            <PiTextAlignRightLight className='w-3.5 h-3.5' />
                            توضیحات (اختیاری)
                        </label>
                        <textarea
                            value={form.description}
                            onChange={e => updateField("description", e.target.value)}
                            rows={7}
                            placeholder='مشخصات فنی، ویژگی‌ها و توضیحات محصول را وارد کنید'
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
                    disabled={isSubmitting}
                    className='flex-center gap-1.5 px-6 py-2.5 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed'>
                    <PiFloppyDiskLight className='w-4 h-4' />
                    {isSubmitting ? "در حال ذخیره..." : "ذخیره محصول"}
                </button>
            </div>
        </div>
    )
}
