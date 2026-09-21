"use client"

import { useRef, useState } from 'react'
import { PiXBold, PiUploadSimpleLight } from 'react-icons/pi'
import type { AdminBanner, BannerPosition, BannerStatus } from '@root/src/types/adminBannerType'

type BannerModalProps = {
    initialData: AdminBanner | null
    onClose: () => void
    onSave: (formData: FormData) => void
    isSaving?: boolean
}

const positionOptions: { value: BannerPosition; label: string }[] = [
    { value: 'landing', label: 'اسلایدر اصلی (Landing)' },
    { value: 'amazingOffers', label: 'تخفیفات شگفت‌انگیز' },
    { value: 'categoriesByPhone', label: 'دسته‌بندی بر اساس گوشی' },
]

export default function BannerModal({ initialData, onClose, onSave, isSaving }: BannerModalProps) {
    const [title, setTitle] = useState(initialData?.title ?? '')
    const [position, setPosition] = useState<BannerPosition>(initialData?.position ?? 'landing')
    const [imagePreview, setImagePreview] = useState(initialData?.image ?? '')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [linkUrl, setLinkUrl] = useState(initialData?.linkUrl ?? '')
    const [status, setStatus] = useState<BannerStatus>(initialData?.status ?? 'active')
    const [error, setError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        setImageFile(file)
        const reader = new FileReader()
        reader.onload = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    const handleSubmit = () => {
        if (!title.trim() || (!imageFile && !imagePreview)) {
            setError('لطفاً عنوان و تصویر بنر را مشخص کنید.')
            return
        }

        const payload = new FormData()
        payload.append('title', title.trim())
        payload.append('position', position)
        payload.append('linkUrl', linkUrl.trim() || '#')
        payload.append('status', status)
        if (initialData) payload.append('existingImage', initialData.image)
        if (imageFile) payload.append('image', imageFile)

        onSave(payload)
    }

    return (
        <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-black/40 z-50 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto">

                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                    <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">
                        {initialData ? 'ویرایش بنر' : 'افزودن بنر جدید'}
                    </h2>
                    <button onClick={onClose} className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">

                    {/* Image Upload */}
                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">تصویر بنر</label>
                        <label className="flex-center flex-col gap-2 h-32 sm:h-36 border-2 border-dashed border-gray-200 hover:border-primary-400 rounded-xl cursor-pointer transition-colors overflow-hidden relative">
                            {imagePreview ? (
                                <img src={imagePreview} className="w-full h-full object-cover" alt="پیش‌نمایش بنر" />
                            ) : (
                                <>
                                    <PiUploadSimpleLight className="w-6 h-6 text-zinc-400" />
                                    <span className="text-xs text-zinc-400">آپلود تصویر بنر</span>
                                </>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">عنوان بنر</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="مثال: پرفروش‌ترین ساعت‌های هوشمند"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">موقعیت نمایش</label>
                        <select
                            value={position}
                            onChange={e => setPosition(e.target.value as BannerPosition)}
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        >
                            {positionOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">لینک مقصد</label>
                        <input
                            value={linkUrl}
                            onChange={e => setLinkUrl(e.target.value)}
                            placeholder="/products/1"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors ltr-dir"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">وضعیت</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value as BannerStatus)}
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        >
                            <option value="active">فعال</option>
                            <option value="disabled">غیرفعال</option>
                        </select>
                    </div>
                </div>

                {error && <p className="mt-3 text-xs text-danger">{error}</p>}

                <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-6 pt-5 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="md:flex-1 flex-center h-10 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'در حال ذخیره...' : initialData ? 'ذخیره تغییرات' : 'افزودن بنر'}
                    </button>
                    <button
                        onClick={onClose}
                        className="md:flex-1 flex-center h-10 text-sm text-zinc-600 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors cursor-pointer"
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </div>
    )
}
